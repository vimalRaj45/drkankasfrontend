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
  Send,
  Upload,
  Edit2
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

import Logo from "../assets/dr_kanaks_logo.png";
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
import { getAppointments, updateStatus, broadcastPush, uploadImage, getNotifications, updateNotification, deleteNotification, getSetting, saveSetting } from '../services/api';

const AdminPanel = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdmin, setShowAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Push Broadcast State
  const [isPushDialogOpen, setIsPushDialogOpen] = useState(false);
  const [pushData, setPushData] = useState({ title: "", body: "", url: "", image: "", send_native_push: true });
  const [pushSending, setPushSending] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [bannerList, setBannerList] = useState([]);
  const [editingBannerId, setEditingBannerId] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);

  // Clinic Hours State
  const [isHoursDialogOpen, setIsHoursDialogOpen] = useState(false);
  const [clinicHours, setClinicHours] = useState("");
  const [savingHours, setSavingHours] = useState(false);

  const formatApptDateTime = (dateStr, timeStr) => {
    if (!dateStr) return "";
    try {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const parts = dateStr.split('-');
      const y = parseInt(parts[0]);
      const mIdx = parseInt(parts[1]) - 1;
      const d = parseInt(parts[2]);
      const m = months[mIdx] || "";
      
      let displayTime = timeStr || "";
      if (timeStr && timeStr.includes(':')) {
        const timeParts = timeStr.split(':');
        let h = parseInt(timeParts[0]);
        let mins = timeParts[1];
        if (!timeStr.toUpperCase().includes('AM') && !timeStr.toUpperCase().includes('PM')) {
          const suffix = h >= 12 ? 'PM' : 'AM';
          h = h % 12 || 12;
          displayTime = `${h}:${mins.substring(0,2)} ${suffix}`;
        } else {
          const suffix = timeStr.toUpperCase().includes('PM') ? 'PM' : 'AM';
          h = parseInt(timeStr.split(':')[0]);
          displayTime = `${h}:${mins.split(' ')[0]} ${suffix}`;
        }
      }
      return `${d} ${m} ${y} ${displayTime}`;
    } catch (e) {
      return `${dateStr} ${timeStr}`;
    }
  };

  const formatCreatedTime = (createdStr) => {
    if (!createdStr) return "-";
    try {
      const date = new Date(createdStr);
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const d = date.getDate();
      const m = months[date.getMonth()];
      const y = date.getFullYear();
      let h = date.getHours();
      const suffix = h >= 12 ? 'PM' : 'AM';
      h = h % 12 || 12;
      const mins = date.getMinutes().toString().padStart(2, '0');
      return `${d} ${m} ${y} ${h}:${mins} ${suffix}`;
    } catch (e) {
      return createdStr;
    }
  };

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

  const fetchBanners = async () => {
    try {
      const res = await getNotifications();
      if (res.success && res.data) {
        setBannerList(res.data);
      }
    } catch (err) {
      console.error("Failed to load banners", err);
    }
  };

  useEffect(() => {
    if (isPushDialogOpen) {
      fetchBanners();
    }
  }, [isPushDialogOpen]);

  const handlePushDialogClose = () => {
    setIsPushDialogOpen(false);
    setEditingBannerId(null);
    setPushData({ title: "", body: "", url: "", image: "", send_native_push: true });
  };

  const handleEditBannerClick = (item) => {
    setEditingBannerId(item.id);
    setPushData({
      title: item.title,
      body: item.body,
      url: item.url || "",
      image: item.image_url || "",
      send_native_push: item.send_native_push ?? true
    });
  };

  const handleDeleteBannerClick = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement banner?")) return;
    try {
      const res = await deleteNotification(id);
      if (res.success) {
        toast.success("Banner deleted successfully!");
        fetchBanners();
      } else {
        toast.error(`Delete failed: ${res.message}`);
      }
    } catch (err) {
      toast.error("Failed to connect to delete endpoint");
    }
  };

  const handleDynamicStatusChange = async (id, newStatus) => {
    if (!newStatus.trim()) newStatus = 'PENDING';
    try {
      const res = await updateStatus(id, newStatus, "CHANGE_THIS_SECRET");
      if (res.success || res.status === 'success') {
        toast.success("Status updated!");
        fetchAppointments();
      } else {
        toast.error(`Update failed: ${res.message}`);
      }
    } catch (error) {
      toast.error("Failed to connect to status endpoint");
    }
  };

  const handleSendBroadcast = async () => {
    if (!pushData.title || !pushData.body) {
      toast.error("Missing Details: Title and Body are required.");
      return;
    }

    setPushSending(true);
    try {
      let result;
      if (editingBannerId) {
        result = await updateNotification(editingBannerId, pushData.title, pushData.body, pushData.url, pushData.image);
      } else {
        result = await broadcastPush(pushData.title, pushData.body, pushData.url, pushData.image, pushData.send_native_push);
      }
      
      if (result.success) {
        toast.success(editingBannerId ? "Banner updated successfully!" : "Announcement published successfully!");
        handlePushDialogClose();
        fetchBanners();
      } else {
        toast.error(`Operation Failed: ${result.message || 'Unknown error'}`);
      }
    } catch (error) {
      toast.error("Process Failed: Could not submit announcement.");
    } finally {
      setPushSending(false);
    }
  };

  const handleImageFileChange = async (e) => {
    if (e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setUploadLoading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Data = event.target.result;
      try {
        const res = await uploadImage(base64Data, "CHANGE_THIS_SECRET");
        if (res.success) {
          setPushData(prev => ({ ...prev, image: res.url }));
          toast.success("Image uploaded successfully!");
        } else {
          toast.error(`Upload Failed: ${res.message || "Failed to save file."}`);
        }
      } catch (err) {
        toast.error("Network Error: Could not connect to upload API.");
      } finally {
        setUploadLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleOpenHoursDialog = async () => {
    setIsHoursDialogOpen(true);
    try {
      const res = await getSetting("working_hours");
      if (res.success) {
        setClinicHours(res.value);
      }
    } catch (err) {
      console.error("Failed to load clinical hours", err);
    }
  };

  const handleSaveHours = async () => {
    setSavingHours(true);
    try {
      const res = await saveSetting("working_hours", clinicHours, "CHANGE_THIS_SECRET");
      if (res.success) {
        toast.success("Clinical working hours updated successfully!");
        setIsHoursDialogOpen(false);
      } else {
        toast.error(`Update failed: ${res.message || "Unauthorized"}`);
      }
    } catch (err) {
      toast.error("Failed to contact settings API endpoint.");
    } finally {
      setSavingHours(false);
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
                 <div className="bg-white px-3 py-1.5 rounded-xl shadow-lg border border-white/10 flex items-center">
                    <img src={Logo} className="h-8 w-auto object-contain" alt="Logo" />
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
                 Banner Upload
              </Button>
              <Button 
                onClick={handleOpenHoursDialog} 
                className="rounded-2xl h-12 px-6 gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold border-2 border-white/5"
              >
                 <Clock className="w-4 h-4 text-primary" />
                 Clinic Hours
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
                        <CardHeader 
                          className="p-8 pb-4 flex flex-row items-center justify-between cursor-pointer"
                          onClick={() => { setSelectedPatient(apt); setIsPatientModalOpen(true); }}
                        >
                           <div>
                              <Badge className="bg-foreground text-background mb-2 text-[9px] font-mono tracking-widest uppercase py-1 px-3 rounded-lg border-none">PID: {apt.id}</Badge>
                              <CardTitle className="text-xl font-extrabold text-primary underline leading-none group-hover:text-primary transition-colors">{apt.name}</CardTitle>
                           </div>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 space-y-6">
                           <div className="bg-muted/50 p-4 rounded-2xl border border-border w-full">
                               <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-1">
                                  <Calendar className="w-3 h-3 text-primary" /> Schedule Slot
                               </p>
                               <p className="text-sm font-black text-foreground">
                                  {formatApptDateTime(apt.date, apt.time)}
                               </p>
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
                        <CardFooter className="p-4 border-t border-border bg-muted/20 flex items-center justify-between gap-4">
                           <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">
                              Status:
                           </span>
                           <input 
                              type="text" 
                              defaultValue={apt.status || 'PENDING'} 
                              onBlur={(e) => handleDynamicStatusChange(apt.id, e.target.value)}
                              onKeyDown={(e) => {
                                 if (e.key === 'Enter') {
                                    handleDynamicStatusChange(apt.id, e.currentTarget.value);
                                    e.currentTarget.blur();
                                 }
                              }}
                              className="bg-background border border-border text-foreground px-3 py-1.5 rounded-xl font-bold text-xs text-center outline-none focus:ring-1 focus:ring-primary w-32"
                              placeholder="Enter status..."
                           />
                        </CardFooter>
                     </Card>
                  </motion.div>
                ))}
             </div>
           )}
        </div>
      </motion.div>

      {/* Global Push Broadcast Dialog */}
      <Dialog open={isPushDialogOpen} onOpenChange={handlePushDialogClose}>
        <DialogContent className="rounded-[2.5rem] p-10 max-w-4xl border-none shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
          
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
               <div className="bg-primary/20 p-2 rounded-xl">
                 <Zap className="w-5 h-5 text-primary" />
               </div>
               <DialogTitle className="text-2xl font-extrabold text-foreground">Banner Upload with Description</DialogTitle>
            </div>
            <DialogDescription className="text-muted-foreground font-medium">
              Upload a banner and description to display as a popup immediately when patients open the website.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 flex-1 overflow-hidden">
            {/* Form Column */}
            <div className="space-y-6 overflow-y-auto max-h-[60vh] pr-2">
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-primary">
                {editingBannerId ? "Edit Announcement" : "Create Announcement"}
              </h3>
              
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
                  className="w-full min-h-[100px] rounded-2xl border border-border bg-muted/30 p-6 focus:bg-background focus:ring-primary shadow-sm font-medium text-sm outline-none transition-all"
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

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">Image (Upload File or Enter URL)</Label>
                <div className="flex gap-3">
                  <Input 
                    placeholder={uploadLoading ? "Uploading file..." : "https://example.com/image.jpg"} 
                    disabled={uploadLoading}
                    className="h-14 rounded-2xl border-border bg-muted/30 pl-6 focus:bg-background focus:ring-primary shadow-sm flex-1"
                    value={pushData.image}
                    onChange={(e) => setPushData({...pushData, image: e.target.value})}
                  />
                  
                  <Label className="h-14 px-6 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-primary/20 transition-all hover:bg-primary/95 text-sm whitespace-nowrap active:scale-[0.98]">
                    <Upload className="w-4 h-4" />
                    {uploadLoading ? "Uploading..." : "Upload File"}
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageFileChange} disabled={uploadLoading} />
                  </Label>
                </div>

                {pushData.image && (
                  <div className="mt-3 relative rounded-2xl border border-border overflow-hidden max-w-[150px] shadow-sm">
                    <img src={pushData.image} alt="Preview" className="w-full h-auto object-cover" />
                    <button 
                      type="button" 
                      onClick={() => setPushData(prev => ({ ...prev, image: "" }))} 
                      className="absolute top-2 right-2 bg-black/70 hover:bg-black/85 text-white rounded-full p-1.5 shadow-md transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">Broadcast Channel</Label>
                <select 
                  className="flex h-14 w-full rounded-2xl border border-border bg-muted/30 px-6 focus:bg-background focus:ring-primary shadow-sm font-bold text-sm outline-none"
                  value={pushData.send_native_push ? "both" : "in_app"}
                  onChange={(e) => setPushData({...pushData, send_native_push: e.target.value === "both"})}
                >
                  <option value="both">Both (Browser Push + Website Pop-up)</option>
                  <option value="in_app">In-App Only (Website Pop-up, No Browser Push)</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="ghost" className="rounded-full h-12 flex-1 font-bold" onClick={handlePushDialogClose}>
                  Cancel
                </Button>
                <Button 
                   disabled={pushSending}
                   className="rounded-full h-12 flex-1 font-extrabold text-xs uppercase tracking-widest bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 gap-2" 
                   onClick={handleSendBroadcast}
                >
                  {pushSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {editingBannerId ? "Update" : "Publish"}
                </Button>
              </div>
            </div>

            {/* List/CRUD Column */}
            <div className="border-l border-border pl-6 flex flex-col overflow-hidden max-h-[60vh]">
              <h3 className="font-extrabold text-sm uppercase tracking-wider text-muted-foreground mb-4">
                Active & Past Banners
              </h3>
              
              <div className="space-y-4 overflow-y-auto pr-2 flex-grow">
                {bannerList.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic p-4 text-center">No announcement banners published yet.</p>
                ) : (
                  bannerList.map((item) => (
                    <div key={item.id} className="bg-muted/30 border border-border p-4 rounded-2xl space-y-3 relative group">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <h4 className="font-bold text-sm text-foreground">{item.title}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{item.body}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditBannerClick(item)}
                            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-foreground transition-colors"
                          >
                            <Edit2 className="w-4 h-4 text-primary" />
                          </button>
                          <button
                            onClick={() => handleDeleteBannerClick(item.id)}
                            className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg text-red-500 transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      {item.image_url && (
                        <div className="h-16 w-full rounded-lg overflow-hidden border border-border">
                          <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* Patient Profile/Details Modal */}
      <Dialog open={isPatientModalOpen} onOpenChange={setIsPatientModalOpen}>
        <DialogContent className="rounded-[2.5rem] p-10 max-w-lg border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-extrabold text-foreground mb-2">Patient Profile Details</DialogTitle>
            <DialogDescription className="text-muted-foreground font-medium">
              Comprehensive personal booking records for this clinical slot.
            </DialogDescription>
          </DialogHeader>

          {selectedPatient && (
            <div className="space-y-6 pt-4 text-left">
              <div>
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">Full Name</Label>
                <p className="text-lg font-extrabold text-foreground">{selectedPatient.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">Phone Number</Label>
                  <a href={`tel:${selectedPatient.phone}`} className="text-sm font-bold text-primary hover:underline font-mono">
                    +91 {selectedPatient.phone}
                  </a>
                </div>
                <div>
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">Patient ID</Label>
                  <p className="text-xs font-mono text-muted-foreground break-all">{selectedPatient.id}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">Chosen Slot Time</Label>
                  <p className="text-sm font-black text-foreground">{formatApptDateTime(selectedPatient.date, selectedPatient.time)}</p>
                </div>
                <div>
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">Booked On (Submission)</Label>
                  <p className="text-sm font-black text-foreground">{formatCreatedTime(selectedPatient.created_at)}</p>
                </div>
              </div>

              <div>
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">Chosen Service</Label>
                <p className="text-sm font-bold text-secondary">{selectedPatient.service}</p>
              </div>

              <div>
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1">Current Problems</Label>
                <p className="text-sm text-muted-foreground bg-muted/40 p-4 rounded-2xl border border-border font-medium italic whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto">
                  {selectedPatient.message || "No message provided."}
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="mt-8">
            <Button className="rounded-full h-12 w-full font-bold bg-primary hover:bg-primary/90" onClick={() => setIsPatientModalOpen(false)}>
              Close Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Clinic Hours Editor Dialog */}
      <Dialog open={isHoursDialogOpen} onOpenChange={setIsHoursDialogOpen}>
        <DialogContent className="rounded-[2.5rem] p-10 max-w-md border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-extrabold text-foreground mb-2 flex items-center gap-2">
              <Clock className="w-6 h-6 text-primary" />
              Edit Clinic Hours
            </DialogTitle>
            <DialogDescription className="text-muted-foreground font-medium">
              Update the clinical operational hours displayed to the patients.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-4 text-left">
            <div>
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">Operational Hours Text</Label>
              <Input 
                value={clinicHours} 
                onChange={(e) => setClinicHours(e.target.value)} 
                placeholder="e.g. Mon – Sat: 10:30 AM – 8:30 PM (Sunday Closed)" 
                className="h-12 rounded-xl border-slate-200 focus:ring-primary shadow-sm w-full"
              />
            </div>
          </div>

          <DialogFooter className="mt-8 gap-3 flex-col sm:flex-row">
            <Button 
              variant="outline"
              className="rounded-full h-12 font-bold w-full sm:w-auto" 
              onClick={() => setIsHoursDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="rounded-full h-12 font-bold bg-primary hover:bg-primary/90 w-full sm:w-auto flex items-center justify-center gap-2" 
              onClick={handleSaveHours}
              disabled={savingHours}
            >
              {savingHours && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPanel;
