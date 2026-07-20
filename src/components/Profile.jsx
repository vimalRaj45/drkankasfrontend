import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  User,
  Phone,
  CalendarCheck,
  Clock,
  ShieldCheck,
  History,
  LogOut,
  ExternalLink,
  ArrowRight,
  Stethoscope,
  ChevronRight,
  TrendingUp,
  MapPin,
  FileText,
  CheckCircle2,
  Loader2,
  Printer,
  Sparkles,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { getUserAppointments, API_URL, checkUser, getNotifications } from '../services/api';
import { Dialog, DialogContent } from "../components/ui/dialog";
import { jsPDF } from "jspdf";

const QueueProgress = ({ date }) => {
  const [completed, setCompleted] = useState(0);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await fetch(`${API_URL}/api/queue-stats/${date}`);
        const data = await res.json();
        if (data.status === 'success') {
          setCompleted(data.count);
        }
      } catch (e) {
        console.error("Progress fail", e);
      }
    };
    fetchProgress();
    const interval = setInterval(fetchProgress, 30000); // 30s auto-refresh
    return () => clearInterval(interval);
  }, [date]);

  return (
    <div className="flex items-center gap-1.5 mt-2 bg-slate-900/5 dark:bg-white/5 px-2 py-1.5 rounded-lg border border-dashed border-slate-200 dark:border-white/10 group-hover:bg-primary/5 transition-colors">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
      <span className="text-[9px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider">
        Clinic Tracker: {completed} Patients Seen
      </span>
    </div>
  );
};

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

const Profile = () => {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loginPhone, setLoginPhone] = useState("");
  const [checking, setChecking] = useState(false);
  const navigate = useNavigate();

  const [announcements, setAnnouncements] = useState([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  // Compute Last Clinical Visit
  const lastVisit = React.useMemo(() => {
    if (!appointments || appointments.length === 0) return null;
    const todayStr = new Date().toISOString().split('T')[0];
    
    // Check for COMPLETED visits first
    const completed = appointments.filter(a => (a.status || '').toUpperCase() === 'COMPLETED');
    if (completed.length > 0) {
      return [...completed].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))[0];
    }
    
    // Otherwise check for past visits (date < today)
    const past = appointments.filter(a => a.date && a.date < todayStr);
    if (past.length > 0) {
      return [...past].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))[0];
    }
    
    // Otherwise return the most recent appointment
    return [...appointments].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))[0];
  }, [appointments]);

  const lastVisitTiming = React.useMemo(() => {
    if (!lastVisit || !lastVisit.date) return "";
    try {
      const visitDate = new Date(lastVisit.date);
      const today = new Date();
      visitDate.setHours(0,0,0,0);
      today.setHours(0,0,0,0);
      const diffTime = today - visitDate;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "Yesterday";
      if (diffDays > 1) return `${diffDays} days ago`;
      if (diffDays < 0) return `Scheduled in ${Math.abs(diffDays)} days`;
    } catch (e) {
      return "";
    }
    return "";
  }, [lastVisit]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await getNotifications();
        if (res.success && res.data) {
          const sorted = [...res.data]
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 3);
          setAnnouncements(sorted);
        }
      } catch (err) {
        console.error("Failed to load announcements for profile feed", err);
      }
    };
    fetchAnnouncements();
  }, []);

  const handlePrintToken = (apt) => {
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [80, 150]
      });

      const docId = apt.id?.slice(-8) || "8821004";
      const formattedDate = formatApptDateTime(apt.date, apt.time);

      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, 80, 150, "F");

      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.8);
      doc.roundedRect(4, 4, 72, 142, 4, 4, "D");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(37, 99, 235);
      doc.text("DR. KANAK'S CLINIC", 40, 18, { align: "center" });

      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text("PRIORITY CONSULTATION SLIP", 40, 24, { align: "center" });

      doc.setLineDashPattern([1.5, 1], 0);
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.4);
      doc.line(8, 28, 72, 28);
      doc.setLineDashPattern([], 0);

      doc.setFillColor(239, 246, 255);
      doc.roundedRect(8, 32, 64, 24, 3, 3, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(37, 99, 235);
      doc.text("APPOINTMENT TOKEN", 40, 40, { align: "center" });

      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(30, 64, 175);
      doc.text(String(apt.token || "REGULAR"), 40, 50, { align: "center" });

      let yOffset = 64;
      const drawDetailRow = (label, val, highlightColor = null) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        doc.setTextColor(100, 116, 139);
        doc.text(label, 8, yOffset);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        if (highlightColor) {
          doc.setTextColor(highlightColor[0], highlightColor[1], highlightColor[2]);
        } else {
          doc.setTextColor(15, 23, 42);
        }
        
        const wrappedVal = doc.splitTextToSize(val, 34);
        doc.text(wrappedVal, 72, yOffset, { align: "right" });
        yOffset += (wrappedVal.length * 4.2) + 1.2;
      };

      drawDetailRow("Patient Name:", apt.name || "N/A");
      drawDetailRow("Patient ID:", `PID-${docId}`);
      drawDetailRow("Service:", apt.service || "N/A");
      drawDetailRow("Schedule Slot:", formattedDate);
      drawDetailRow("Booking Status:", String(apt.status).toUpperCase(), [16, 185, 129]);

      if (apt.cancel_reason) {
        yOffset += 2;
        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.3);
        
        const textLines = doc.splitTextToSize(`"${apt.cancel_reason}"`, 56);
        const boxHeight = (textLines.length * 3.5) + 8;
        
        doc.roundedRect(8, yOffset, 64, boxHeight, 2, 2, "FD");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(7);
        doc.setTextColor(37, 99, 235);
        const boxTitle = apt.status === 'CONFIRMED' ? 'VISIT GUIDANCE' : apt.status === 'CANCELLED' ? 'CLINICAL REASON' : 'DOCTOR GUIDANCE';
        doc.text(boxTitle, 12, yOffset + 5);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        doc.setTextColor(51, 65, 85);
        doc.text(textLines, 12, yOffset + 9.5);
        
        yOffset += boxHeight + 4;
      } else {
        yOffset += 4;
      }

      doc.setDrawColor(241, 245, 249);
      doc.setLineWidth(0.4);
      doc.line(8, 128, 72, 128);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.5);
      doc.setTextColor(148, 163, 184);
      doc.text("Thank you for choosing Dr. Kanak's Clinic.", 40, 133, { align: "center" });
      doc.text("Please show this digital priority slip at the front desk.", 40, 137, { align: "center" });
      doc.text(`Contact Support: +91 ${apt.phone || "N/A"}`, 40, 141, { align: "center" });

      doc.save(`Priority_Slip_PID_${docId}.pdf`);
      toast.success("Priority slip PDF downloaded successfully!");
    } catch (err) {
      console.error("PDF generation failed:", err);
      toast.error("Failed to generate PDF. Please try again.");
    }
  };

  const syncAppointments = async (phone) => {
    if (!phone) return;
    const result = await getUserAppointments(phone);
    if (result.success && result.data) {
      // Logic to detect status changes for toast notifications
      const oldApts = JSON.parse(localStorage.getItem('clinic_appointments')) || [];

      result.data.forEach(newApt => {
        const matchingOldApt = oldApts.find(old => old.id === newApt.id);
        if (matchingOldApt && matchingOldApt.status !== newApt.status) {
          // Status changed!
          toast.success(`Visit Update: Your appointment for ${newApt.service} is now ${newApt.status}! 🏥`, {
            icon: "🔔"
          });
        }
      });

      // Update local storage representation and local state
      localStorage.setItem('clinic_appointments', JSON.stringify(result.data));
      setAppointments(result.data);
    }
  };

  // Sync from backend every 10 seconds
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('clinic_user'));
    if (savedUser) {
      setUser(savedUser);
      // Initial fetch
      syncAppointments(savedUser.phone);

      const interval = setInterval(() => {
        syncAppointments(savedUser.phone);
      }, 10000);

      return () => clearInterval(interval);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setAppointments([]);
    toast.success("Logged Out Successfully. Your clinical session has been completely reset for your security.", {
      icon: "🔒"
    });
    navigate('/');
  };

  const handlePhoneLogin = async (e) => {
    e.preventDefault();
    if (!loginPhone || loginPhone.length < 10) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }
    setChecking(true);
    try {
      const res = await checkUser(loginPhone);
      if (res.success && res.user) {
        localStorage.setItem('clinic_user', JSON.stringify(res.user));
        setUser(res.user);
        syncAppointments(res.user.phone);
        window.dispatchEvent(new Event('triggerPushPrompt'));
        toast.success("Welcome back! Your clinical profile has been loaded.");
      } else {
        toast.error("No profile found with this number. Please book an appointment to register!");
      }
    } catch (err) {
      toast.error("Failed to connect to backend server.");
    } finally {
      setChecking(false);
    }
  };

  if (!user) {
    return (
      <section className="py-20 sm:py-32 bg-slate-50/30 flex items-center justify-center min-h-[70vh]">
        <div className="container mx-auto px-4 max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border border-border/50 shadow-2xl rounded-[2.5rem] overflow-hidden bg-card">
              <CardHeader className="text-center pb-4 pt-8">
                <div className="mx-auto w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                  <User className="w-7 h-7 text-primary" />
                </div>
                <CardTitle className="text-2xl font-black tracking-tight">Access Your Profile</CardTitle>
                <CardDescription className="text-muted-foreground font-medium pt-1 px-2">
                  Enter your registered mobile number to check booking history, vitals, and treatment history.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 sm:px-8 pb-8">
                <form onSubmit={handlePhoneLogin} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-2">Mobile Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        maxLength={10}
                        placeholder="98765 43210"
                        className="pl-12 h-12 rounded-xl border-slate-200 focus:ring-primary shadow-sm"
                        value={loginPhone}
                        onChange={(e) => setLoginPhone(e.target.value.replace(/\D/g, ''))}
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-12 rounded-full font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                    disabled={checking}
                  >
                    {checking ? <Loader2 className="w-5 h-5 animate-spin" /> : <ChevronRight className="w-5 h-5" />}
                    Verify & Access
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="profile" className="py-24 bg-background overflow-hidden relative scroll-mt-20 transition-colors duration-500">
      <div className="container mx-auto px-4 relative z-10">

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 rounded-full mb-4"
            >
              <TrendingUp className="w-4 h-4 text-secondary" />
              <span className="text-[10px] font-bold text-secondary uppercase tracking-widest leading-none">Global Patient Hub</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-extrabold text-foreground mb-6 leading-tight"
            >
              Welcome Back, <br />
              <span className="text-secondary italic">{user.name}</span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Button variant="outline" className="rounded-full shadow-lg border-2 border-red-100 text-red-500 font-bold hover:bg-red-50 hover:text-red-600 h-auto py-4 px-8" onClick={handleLogout}>
              Secure Logout
              <LogOut className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </div>

        {/* Featured Top Last Visit Banner */}
        {lastVisit && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <Card className="border-2 border-primary/30 shadow-2xl rounded-[2.5rem] bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 text-white overflow-hidden relative group p-6 sm:p-8">
              {/* Cinematic Background Glow */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2" />

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                <div className="space-y-3 max-w-2xl">
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge className="bg-primary text-white border-none font-black tracking-widest text-[10px] uppercase px-3 py-1 rounded-full shadow-lg shadow-primary/30">
                      ⚡ Most Recent Visit
                    </Badge>
                    {lastVisitTiming && (
                      <span className="text-xs font-bold text-slate-300 font-mono bg-white/10 px-3 py-1 rounded-full backdrop-blur-md">
                        {lastVisitTiming}
                      </span>
                    )}
                    <Badge className={cn(
                      "text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border-none",
                      lastVisit.status === 'COMPLETED' ? "bg-emerald-500 text-white" :
                      lastVisit.status === 'CONFIRMED' ? "bg-blue-500 text-white" : "bg-amber-500 text-white"
                    )}>
                      {lastVisit.status || "COMPLETED"}
                    </Badge>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                    <Stethoscope className="w-7 h-7 text-primary shrink-0" />
                    {lastVisit.service}
                  </h3>

                  <div className="flex items-center gap-6 text-sm font-semibold text-slate-300 flex-wrap pt-1">
                    <div className="flex items-center gap-2">
                      <CalendarCheck className="w-4 h-4 text-primary" />
                      {formatApptDateTime(lastVisit.date, lastVisit.time)}
                    </div>
                    {lastVisit.token && (
                      <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-lg border border-primary/20">
                        Token #{lastVisit.token}
                      </div>
                    )}
                    <div className="text-xs text-slate-400 font-mono">
                      ID: {lastVisit.id?.slice(-8)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-start lg:self-center shrink-0">
                  <Button
                    onClick={() => handlePrintToken(lastVisit)}
                    className="h-12 px-6 rounded-2xl font-extrabold bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 flex items-center gap-2"
                  >
                    <Printer className="w-4 h-4" />
                    Download Visit Token Slip
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Column: User Info & Live Announcements */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="w-full"
            >
              <Card className="border border-border shadow-2xl shadow-slate-200/50 dark:shadow-none rounded-[3rem] overflow-hidden bg-card h-full relative group">
                <CardHeader className="bg-slate-900 dark:bg-slate-950 text-white p-6 sm:p-10 pb-16 rounded-b-[3rem] sm:rounded-b-[4rem]">
                  <div className="w-20 h-20 bg-white/10 p-1 rounded-[2rem] mb-6 relative group-hover:scale-105 transition-transform">
                    <div className="w-full h-full bg-white dark:bg-slate-100 rounded-full flex items-center justify-center p-3">
                      <User className="w-full h-full text-slate-900 fill-slate-900/10" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-slate-900 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-extrabold text-white leading-tight uppercase tracking-widest">{user.name}</CardTitle>
                  <CardDescription className="text-white/40 font-bold uppercase tracking-widest text-xs flex items-center gap-2 mt-1">
                    <ShieldCheck className="w-3 h-3 text-secondary" />
                    Verified Global Identity
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 sm:p-10 -mt-10 bg-card rounded-t-[2.5rem] sm:rounded-t-[3rem] relative z-20 space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">Phone Identity</Label>
                    <div className="bg-muted/50 p-4 rounded-2xl flex items-center gap-4 border border-border font-mono text-foreground font-bold transition-colors">
                      <Phone className="w-5 h-5 text-secondary" />
                      {user.phone}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">Unique Patient ID</Label>
                    <div className="bg-muted/50 p-4 rounded-2xl flex items-center gap-4 border border-border font-mono text-foreground font-bold transition-colors">
                      <FileText className="w-5 h-5 text-primary" />
                      PID-{user.id?.slice(-8) || "8821004"}
                    </div>
                  </div>
                  <div className="pt-6">
                    <Button variant="link" className="p-0 text-secondary font-extrabold h-auto flex items-center gap-2 hover:translate-x-1 transition-transform decoration-none">
                      Update Clinical Profile
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>



            {/* Live Announcements Feed */}
            {announcements.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="w-full"
              >
                <Card className="border border-border shadow-xl rounded-[2.5rem] bg-card overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-black tracking-tight flex items-center gap-2 text-foreground">
                      <Sparkles className="w-5 h-5 text-primary" /> Clinic Updates
                    </CardTitle>
                    <CardDescription className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Latest Announcements</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 px-6 pb-6">
                    {announcements.map((item) => (
                      <div 
                        key={item.id}
                        onClick={() => setSelectedAnnouncement(item)}
                        className="p-3 bg-muted/40 hover:bg-muted/80 rounded-2xl border border-border cursor-pointer transition-all group flex items-start gap-3"
                      >
                        {item.image_url && (
                          <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-border">
                            <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-primary transition-colors truncate">{item.title}</h4>
                          <p className="text-[10px] text-slate-500 font-medium line-clamp-2 mt-0.5 leading-relaxed">{item.body}</p>
                        </div>
                      </div>
                    ))}
                    
                    <Button variant="link" className="p-0 text-xs font-bold text-primary flex items-center gap-1.5 h-auto decoration-none" asChild>
                      <Link to="/notifications">
                        All Announcements <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Appointment History Column */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-primary p-3 rounded-2xl shadow-xl shadow-primary/20">
                  <History className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-extrabold text-foreground tracking-tighter">Medical Visit Logs</h3>
                <Badge variant="outline" className="rounded-full bg-white ml-2 text-slate-500 font-bold py-1 px-4 border-slate-200 uppercase tracking-widest text-[9px]">
                  {appointments.length} Total Logs
                </Badge>
              </div>

              {appointments.length > 0 ? (
                <div className="space-y-4">
                  {appointments.map((apt, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <Card className="border border-border shadow-xl shadow-slate-200/50 dark:shadow-none rounded-[2rem] overflow-hidden bg-card p-6 relative group transition-all hover:shadow-primary/10">
                        <div className="grid md:grid-cols-4 gap-6 items-center">
                          {/* Service Icon */}
                          <div className="md:col-span-1 flex items-center gap-4">
                            <div className="bg-primary/5 p-4 rounded-2xl group-hover:bg-primary transition-colors">
                              <Stethoscope className="w-6 h-6 text-primary group-hover:text-white" />
                            </div>
                            <div className="md:hidden">
                              <h4 className="font-extrabold text-slate-900 dark:text-foreground leading-none mb-1">{apt.service}</h4>
                              <div className="flex gap-2 items-center flex-wrap">
                                <Badge variant="outline" className="text-[10px] uppercase font-bold text-secondary border-secondary/20 font-mono tracking-widest">
                                  ID: {apt.id.slice(-8)}
                                </Badge>
                                {apt.token && (
                                  <Badge className="text-[10px] uppercase font-black bg-primary text-white border-none tracking-widest px-3">
                                    TOKEN: {apt.token}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Service Detail */}
                          <div className="hidden md:block md:col-span-1">
                            <h4 className="font-extrabold text-slate-900 dark:text-foreground leading-none mb-2">{apt.service}</h4>
                            <div className="flex flex-col gap-1">
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest font-mono">ID: {apt.id.slice(-8)}</p>
                              {apt.token && (
                                <div className="bg-primary/10 text-primary w-fit px-2 py-0.5 rounded text-[10px] font-black tracking-widest">
                                  #{apt.token}
                                </div>
                              )}
                              {/* --- LIVE QUEUE STATUS --- */}
                              {apt.status === 'CONFIRMED' && (
                                <QueueProgress date={apt.date} />
                              )}
                            </div>
                          </div>

                          <div className="md:col-span-1 flex items-center gap-8 md:justify-center">
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2 text-sm font-extrabold text-slate-800 dark:text-slate-100">
                                <CalendarCheck className="w-4 h-4 text-primary" />
                                {formatApptDateTime(apt.date, apt.time)}
                              </div>
                            </div>
                          </div>

                          <div className="md:col-span-1 flex flex-col items-center justify-between md:items-end gap-3 border-t md:border-t-0 pt-4 md:pt-0">
                            <div className="flex items-center justify-between w-full md:w-auto md:justify-end gap-4 pt-4 md:pt-0">
                              <Badge className={cn(
                                "rounded-xl py-2 px-6 font-extrabold uppercase tracking-widest text-[9px] shadow-sm",
                                apt.status === "PENDING" ? "bg-amber-100 text-amber-600 hover:bg-amber-100 border border-amber-200" :
                                  apt.status === "CANCELLED" ? "bg-red-100 text-red-600 hover:bg-red-100 border border-red-200" :
                                    "bg-green-100 text-green-600 hover:bg-green-100 border border-green-200"
                              )}>
                                {apt.status}
                              </Badge>
                              <Button 
                                onClick={() => handlePrintToken(apt)}
                                variant="ghost" 
                                size="icon" 
                                className="rounded-xl h-12 w-12 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:bg-primary/5 text-slate-400 hover:text-primary transition-all"
                                title="Download PDF Token"
                              >
                                <Download className="w-5 h-5" />
                              </Button>
                            </div>

                            {/* Patient Concerns & Clinical Guidance */}
                            <div className="flex flex-col gap-3 w-full md:max-w-[250px]">
                              {/* Original Booking Message */}
                              {apt.message && apt.message !== "No message" && (
                                <div className="text-[9px] bg-muted/50 p-2 rounded-lg border border-border italic text-muted-foreground text-center md:text-right">
                                  <span className="opacity-50 uppercase tracking-tighter not-italic font-bold block mb-1">Your Concerns:</span>
                                  "{apt.message}"
                                </div>
                              )}

                              {/* Clinical Response / Instructions */}
                              {apt.status !== 'PENDING' && (
                                <div className={cn(
                                  "text-[10px] font-bold p-3 rounded-xl border shadow-sm text-center md:text-right transition-all",
                                  apt.status === 'CANCELLED' ? "text-red-600 bg-red-50 dark:bg-red-950/30 border-red-100" : "text-primary bg-primary/5 dark:bg-primary/10 border-primary/10"
                                )}>
                                  <p className="mb-1 uppercase tracking-tighter opacity-70">
                                    {apt.status === 'CONFIRMED' 
                                      ? "Visit Guidance:" 
                                      : apt.status === 'CANCELLED' 
                                      ? "Clinical Reason:" 
                                      : apt.status === 'COMPLETED'
                                      ? "Clinical Notes & Advice:"
                                      : "Clinical Notes:"}
                                  </p>
                                  {apt.cancel_reason || (
                                    apt.status === 'CONFIRMED'
                                      ? "Your clinical session has been officially confirmed. Please arrive 10 mins prior."
                                      : apt.status === 'CANCELLED'
                                      ? "This session has been cancelled by the clinical board."
                                      : "No specific guidance notes provided for this session."
                                  )}
                                  {apt.suggestion && (
                                    <div className="mt-2 pt-2 border-t border-current/10 font-extrabold uppercase tracking-tighter">
                                      RE-PLAN: {apt.suggestion}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-card p-10 sm:p-20 rounded-[2.5rem] sm:rounded-[3.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-dashed border-border flex flex-col items-center justify-center text-center">
                  <div className="bg-muted/50 p-6 sm:p-8 rounded-full mb-8">
                    <CalendarCheck className="w-8 h-8 sm:w-12 sm:h-12 text-slate-300" />
                  </div>
                  <h4 className="text-xl sm:text-2xl font-extrabold text-foreground mb-2">No Visit Logs Found</h4>
                  <p className="text-muted-foreground font-medium max-w-xs mb-8 text-sm sm:text-base">
                    It seems you haven't booked any clinical sessions yet. Secure your first priority slot today!
                  </p>
                  <Button size="lg" className="rounded-full px-10 h-14 bg-slate-900 hover:bg-primary transition-all font-bold shadow-xl shadow-slate-900/20" asChild>
                    <Link to="/book">Register New Session</Link>
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] -z-0" />

      {/* Lightbox / Announcement Details Modal */}
      <Dialog open={!!selectedAnnouncement} onOpenChange={(open) => !open && setSelectedAnnouncement(null)}>
        <DialogContent className="rounded-[2.5rem] p-6 sm:p-10 max-w-2xl border-none shadow-2xl overflow-hidden">
          {selectedAnnouncement && (
            <div className="space-y-6 pt-4 text-left">
              {selectedAnnouncement.image_url && (
                <div className="w-full h-64 sm:h-80 bg-slate-100 dark:bg-slate-900 rounded-3xl overflow-hidden border border-border">
                  <img
                    src={selectedAnnouncement.image_url}
                    alt={selectedAnnouncement.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3 text-muted-foreground text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                  <span className="flex items-center gap-1.5 text-primary">
                    <Sparkles className="w-3.5 h-3.5" />
                    Announcement
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                  {selectedAnnouncement.title}
                </h2>

                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed whitespace-pre-wrap">
                  {selectedAnnouncement.body}
                </p>
              </div>

              {selectedAnnouncement.url && (
                <div className="pt-2 flex justify-end">
                  <Button
                    className="rounded-full font-bold shadow-md shadow-primary/10 gap-1.5 uppercase text-xs tracking-wider h-12 px-6"
                    asChild
                  >
                    <a href={selectedAnnouncement.url} target="_blank" rel="noopener noreferrer">
                      Explore Offer <ArrowRight className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Profile;
