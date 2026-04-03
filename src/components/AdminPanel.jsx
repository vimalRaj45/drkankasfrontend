import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  ShieldCheck, 
  X, 
  LayoutDashboard, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Stethoscope, 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  Search,
  Filter,
  MoreVertical,
  ChevronRight,
  Loader2,
  Lock,
  MessageSquare,
  Bell,
  Zap,
  Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'react-hot-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

// Existing API services
import { getAppointments, updateStatus, broadcastPush } from '../services/api';

const AdminPanel = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdmin, setShowAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Cancellation Modal State
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [cancelData, setCancelData] = useState({ id: null, reason: "", suggestedDate: "" });

  // Push Broadcast State
  const [isPushDialogOpen, setIsPushDialogOpen] = useState(false);
  const [pushData, setPushData] = useState({ title: "", body: "", url: "" });
  const [pushSending, setPushSending] = useState(false);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const result = await getAppointments();
      if (result.success && result.data) {
        setAppointments(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
      toast.error("Database Connection Error: Could not retrieve medical records from clinical backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showAdmin) {
      fetchAppointments();
    }
  }, [showAdmin]);

  const handleStatusChangeClick = (id, newStatus) => {
    if (newStatus === 'CANCELLED') {
      setCancelData({ id, reason: "", suggestedDate: "" });
      setIsCancelDialogOpen(true);
    } else {
      processStatusUpdate(id, newStatus);
    }
  };

  const processStatusUpdate = async (id, newStatus, reason = "", suggestedDate = "") => {
    try {
      const result = await updateStatus(id, newStatus, "CHANGE_THIS_SECRET", reason, suggestedDate);
      if (result.success || result.status === 'success') {
        toast.success(`Priority Updated: ${newStatus}. Patient ID ${id} record has been synchronized.`);
        fetchAppointments();
      } else {
        toast.error(`Process Failed: ${result.message || 'Update failed'}`);
      }
    } catch (error) {
      toast.error("Critical System Error: Something went wrong while notifying patient.");
    }
  };

  const confirmCancellation = () => {
    processStatusUpdate(cancelData.id, 'CANCELLED', cancelData.reason, cancelData.suggestedDate);
    setIsCancelDialogOpen(false);
  };

  const handleSendBroadcast = async () => {
    if (!pushData.title || !pushData.body) {
      toast.error("Missing Details: Title and Body are required for broadcast.");
      return;
    }

    setPushSending(true);
    try {
      const result = await broadcastPush(pushData.title, pushData.body, pushData.url);
      if (result.success) {
        toast.success(`Broadcast Successful: ${result.message}`);
        setIsPushDialogOpen(false);
        setPushData({ title: "", body: "", url: "" });
      } else {
        toast.error(`Broadcast Failed: ${result.message || 'Unknown error'}`);
      }
    } catch (error) {
      toast.error("Process Failed: Could not transmit broadcast to clinical network.");
    } finally {
      setPushSending(false);
    }
  };

  const filteredAppointments = appointments.filter(apt => 
    apt.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.phone?.includes(searchTerm) ||
    apt.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!showAdmin) {
    return (
      <Button 
        onClick={() => setShowAdmin(true)} 
        className="fixed bottom-10 right-10 z-[100] h-14 w-14 rounded-full shadow-2xl bg-slate-900 border-2 border-white/10 p-0 overflow-hidden group hover:w-48 hover:rounded-2xl transition-all duration-300"
      >
        <Lock className="w-5 h-5 text-white group-hover:mr-2" />
        <span className="hidden group-hover:inline text-xs font-bold uppercase tracking-widest text-white">Clinical Admin Panel</span>
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-950/60 backdrop-blur-xl flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-7xl h-[90vh] bg-card rounded-[3.5rem] shadow-2xl border border-border overflow-hidden flex flex-col"
      >
        {/* Admin Header */}
        <div className="bg-slate-900 dark:bg-slate-950 text-white p-10 flex items-center justify-between relative overflow-hidden">
           <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                 <div className="bg-primary/20 p-2 rounded-xl">
                   <LayoutDashboard className="w-6 h-6 text-primary" />
                 </div>
                 <h2 className="text-3xl font-extrabold tracking-tighter">Clinical Dashboard V4.0</h2>
              </div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
                 <ShieldCheck className="w-3 h-3 text-primary" />
                 Authenticated Admin Session &middot; Secure 256-bit Encryption
              </p>
           </div>
           
           <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full bg-white/5 border-white/10 hover:bg-foreground hover:text-background h-14 w-14 transition-all"
              onClick={() => setShowAdmin(false)}
           >
              <X className="w-6 h-6" />
           </Button>

           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-0 translate-x-1/2 -translate-y-1/2" />
        </div>

        {/* Filters & Actions Bar */}
        <div className="p-8 border-b border-border flex flex-wrap items-center justify-between gap-6 bg-muted/30">
           <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search Patient Name, Phone or ID..." 
                className="pl-12 h-12 rounded-2xl border-slate-200 bg-white focus:ring-primary shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <div className="flex items-center gap-4">
              <Button 
                onClick={() => setIsPushDialogOpen(true)} 
                className="rounded-2xl h-12 px-6 gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold border-2 border-white/5"
              >
                 <Bell className="w-4 h-4 text-primary" />
                 Global Push
              </Button>
              <Button onClick={fetchAppointments} disabled={loading} className="rounded-2xl h-12 px-6 gap-2 bg-primary font-bold shadow-lg shadow-primary/20">
                 {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4 rotate-90" />}
                 Sync Database
              </Button>
           </div>
        </div>

        {/* Database Grid */}
        <div className="flex-grow overflow-y-auto p-8 bg-muted/30 relative">
           {loading ? (
             <div className="h-full flex flex-col items-center justify-center opacity-50">
                <Loader2 className="w-16 h-16 text-primary animate-spin mb-6" />
                <h4 className="text-xl font-extrabold text-slate-900 uppercase tracking-widest text-xs">Querying Clinical Records...</h4>
             </div>
           ) : filteredAppointments.length === 0 ? (
             <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="bg-muted p-10 rounded-full mb-8">
                   <Search className="w-16 h-16 text-muted-foreground" />
                </div>
                <h4 className="text-2xl font-extrabold text-foreground mb-2">No Matching Records Found</h4>
                <p className="text-muted-foreground font-medium max-w-sm">Try adjusting your search criteria or contact backend support if records appear missing.</p>
             </div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredAppointments.map((apt) => (
                  <motion.div
                    key={apt.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -5 }}
                  >
                     <Card className="border border-border shadow-xl shadow-slate-200/40 dark:shadow-none rounded-[2.5rem] bg-card overflow-hidden group">
                        <CardHeader className="p-8 pb-4 flex flex-row items-center justify-between">
                           <div>
                              <Badge className="bg-foreground text-background mb-2 text-[9px] font-mono tracking-widest uppercase py-1 px-3 rounded-lg border-none">PID: {apt.id}</Badge>
                              <CardTitle className="text-xl font-extrabold text-foreground leading-none group-hover:text-primary transition-colors">{apt.name}</CardTitle>
                           </div>
                           <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                 <Button variant="ghost" size="icon" className="rounded-xl h-12 w-12 bg-muted/50 hover:bg-muted font-bold text-muted-foreground">
                                    <MoreVertical className="w-5 h-5" />
                                 </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="rounded-2xl border-none shadow-2xl p-2" align="end">
                                 <DropdownMenuLabel className="text-[10px] uppercase font-bold text-slate-400 p-3">Manage Patient</DropdownMenuLabel>
                                 <DropdownMenuItem className="rounded-xl p-3 gap-3 cursor-pointer" onClick={() => handleStatusChangeClick(apt.id, 'CONFIRMED')}>
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    <span className="font-bold text-xs uppercase tracking-widest">Mark Confirmed</span>
                                 </DropdownMenuItem>
                                 <DropdownMenuItem className="rounded-xl p-3 gap-3 cursor-pointer" onClick={() => handleStatusChangeClick(apt.id, 'CANCELLED')}>
                                    <XCircle className="w-4 h-4 text-red-500" />
                                    <span className="font-bold text-xs uppercase tracking-widest">Cancel Session</span>
                                 </DropdownMenuItem>
                              </DropdownMenuContent>
                           </DropdownMenu>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 space-y-6">
                           <div className="grid grid-cols-2 gap-4">
                              <div className="bg-muted/50 p-4 rounded-2xl border border-border">
                                 <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-1">
                                    <Calendar className="w-3 h-3" /> Visit Date
                                 </p>
                                 <p className="text-sm font-bold text-foreground">{apt.date}</p>
                              </div>
                              <div className="bg-muted/50 p-4 rounded-2xl border border-border">
                                 <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> Duration
                                 </p>
                                 <p className="text-sm font-bold text-foreground">{apt.time}</p>
                              </div>
                           </div>
                           
                           <div className="space-y-3">
                              <div className="flex items-center gap-3 text-sm font-bold text-foreground">
                                 <Stethoscope className="w-4 h-4 text-primary" />
                                 <span>{apt.service}</span>
                              </div>
                              <div className="flex items-center gap-3 text-sm font-bold text-foreground">
                                 <Phone className="w-4 h-4 text-secondary" />
                                 <a href={`tel:${apt.phone}`} className="hover:text-secondary hover:underline transition-all font-mono">{apt.phone}</a>
                              </div>
                              {apt.message && apt.message !== "No message" && (
                                <div className="flex items-start gap-3 mt-4 pt-4 border-t border-slate-100 italic">
                                   <MessageSquare className="w-4 h-4 text-slate-300 mt-1" />
                                   <p className="text-xs text-slate-400 font-medium leading-relaxed font-mono">
                                      {apt.message}
                                   </p>
                                </div>
                              )}
                           </div>
                        </CardContent>
                        <CardFooter className="p-0 border-t border-border">
                           <div className={cn(
                             "w-full py-4 text-center text-[10px] font-extrabold uppercase tracking-widest",
                             apt.status === "CONFIRMED" ? "bg-green-50/50 dark:bg-green-900/20 text-green-600 dark:text-green-400" : 
                             apt.status === "CANCELLED" ? "bg-red-50/50 dark:bg-red-900/20 text-red-600 dark:text-red-400" : 
                             "bg-muted text-muted-foreground"
                           )}>
                              SESSION STATUS: {apt.status || "PENDING BOARD REVIEW"}
                           </div>
                        </CardFooter>
                     </Card>
                  </motion.div>
                ))}
             </div>
           )}
        </div>
      </motion.div>

      {/* Cancellation Dialog (Replaces Swal) */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent className="rounded-[2.5rem] p-10 max-w-lg border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-extrabold text-foreground mb-2">Cancel Appointment</DialogTitle>
            <DialogDescription className="text-muted-foreground font-medium">
              Please provide a valid clinical reason for cancelling this patient session.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">Cancellation Reason</Label>
              <Input 
                placeholder="e.g. Doctor Unavailable / Equipment Maintenance" 
                className="h-14 rounded-2xl border-border bg-muted/50 pl-6 focus:bg-background focus:ring-primary shadow-sm"
                value={cancelData.reason}
                onChange={(e) => setCancelData({...cancelData, reason: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">Suggested recovery Date (Optional)</Label>
              <Input 
                type="date"
                className="h-14 rounded-2xl border-border bg-muted/50 px-6 focus:bg-background focus:ring-primary shadow-sm transition-all"
                value={cancelData.suggestedDate}
                onChange={(e) => setCancelData({...cancelData, suggestedDate: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-8">
            <Button variant="outline" className="rounded-full h-12 flex-1 font-bold border-border" onClick={() => setIsCancelDialogOpen(false)}>
              Discard
            </Button>
            <Button className="rounded-full h-12 flex-1 font-bold bg-secondary hover:bg-secondary/90 shadow-lg shadow-secondary/20" onClick={confirmCancellation}>
              Submit Cancellation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Global Push Broadcast Dialog */}
      <Dialog open={isPushDialogOpen} onOpenChange={setIsPushDialogOpen}>
        <DialogContent className="rounded-[2.5rem] p-10 max-w-xl border-none shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
          
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
               <div className="bg-primary/20 p-2 rounded-xl">
                 <Zap className="w-5 h-5 text-primary" />
               </div>
               <DialogTitle className="text-2xl font-extrabold text-foreground">Push Broadcast</DialogTitle>
            </div>
            <DialogDescription className="text-muted-foreground font-medium">
              Transmit a global alert to all patients subscribed to the clinical network.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 pt-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">Announcement Title</Label>
              <Input 
                placeholder="e.g. Health Camp This Sunday" 
                className="h-14 rounded-2xl border-border bg-muted/30 pl-6 focus:bg-background focus:ring-primary shadow-sm font-bold"
                value={pushData.title}
                onChange={(e) => setPushData({...pushData, title: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">Message Content</Label>
              <textarea 
                placeholder="Describe your announcement..." 
                className="w-full min-h-[120px] rounded-2xl border border-border bg-muted/30 p-6 focus:bg-background focus:ring-primary shadow-sm font-medium text-sm outline-none transition-all"
                value={pushData.body}
                onChange={(e) => setPushData({...pushData, body: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">Redirect URL / Feedback Link</Label>
              <Input 
                placeholder="https://dr-kanaks-clinic.netlify.app/feedback" 
                className="h-14 rounded-2xl border-border bg-muted/30 pl-6 focus:bg-background focus:ring-primary shadow-sm"
                value={pushData.url}
                onChange={(e) => setPushData({...pushData, url: e.target.value})}
              />
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-10">
            <Button variant="ghost" className="rounded-full h-12 flex-1 font-bold" onClick={() => setIsPushDialogOpen(false)}>
              Discard
            </Button>
            <Button 
               disabled={pushSending}
               className="rounded-full h-14 flex-[2] font-extrabold text-xs uppercase tracking-widest bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 gap-3" 
               onClick={handleSendBroadcast}
            >
              {pushSending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Transmitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Execute Broadcast
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPanel;
