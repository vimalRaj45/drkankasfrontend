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
  Download,
  Search,
  Filter,
  Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { getUserAppointments, API_URL, checkUser, getNotifications, requestReschedule } from '../services/api';
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

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rescheduleText, setRescheduleText] = useState("");
  const [submittingReschedule, setSubmittingReschedule] = useState(false);

  const handleRescheduleSubmit = async () => {
    if (!selectedBooking) return;
    if (!rescheduleText.trim()) {
      toast.error("Please enter your reschedule message or details.");
      return;
    }
    setSubmittingReschedule(true);
    try {
      const res = await requestReschedule(selectedBooking.id, user.id, rescheduleText.trim());
      if (res.success || res.status === 'success') {
        toast.success("Reschedule request submitted successfully!");
        
        // Update local state
        const updatedApts = appointments.map(apt => {
          if (apt.id === selectedBooking.id) {
            return { ...apt, reschedule_request: rescheduleText.trim() };
          }
          return apt;
        });
        setAppointments(updatedApts);
        localStorage.setItem('clinic_appointments', JSON.stringify(updatedApts));
        
        // Update dialog state
        setSelectedBooking(prev => ({ ...prev, reschedule_request: rescheduleText.trim() }));
      } else {
        toast.error(res.message || "Failed to submit reschedule request.");
      }
    } catch (err) {
      toast.error("Failed to connect to reschedule endpoint.");
    } finally {
      setSubmittingReschedule(false);
    }
  };

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

  // Compute Current Active / Upcoming Booking (Priority: Future dates nearest first, then Today)
  const currentBooking = React.useMemo(() => {
    if (!appointments || appointments.length === 0) return null;
    const todayStr = new Date().toISOString().split('T')[0];
    
    // Active bookings: status is PENDING or CONFIRMED, or appointment date >= today and not completed/cancelled
    const active = appointments.filter(a => {
      const statusUpper = (a.status || '').toUpperCase();
      if (statusUpper === 'COMPLETED' || statusUpper === 'CANCELLED') return false;
      const isPendingOrConfirmed = statusUpper === 'PENDING' || statusUpper === 'CONFIRMED' || statusUpper === 'RESCHEDULED';
      const isFutureOrToday = a.date && a.date >= todayStr;
      return isPendingOrConfirmed || isFutureOrToday;
    });

    if (active.length > 0) {
      // Sort priority: Upcoming future dates (e.g. tomorrow) first, then today
      return [...active].sort((a, b) => {
        const dateA = a.date || '';
        const dateB = b.date || '';
        
        const isFutureA = dateA > todayStr;
        const isFutureB = dateB > todayStr;

        if (isFutureA && isFutureB) return dateA.localeCompare(dateB);
        if (isFutureA && !isFutureB) return -1;
        if (!isFutureA && isFutureB) return 1;

        return dateA.localeCompare(dateB);
      })[0];
    }
    return null;
  }, [appointments]);

  const currentBookingTiming = React.useMemo(() => {
    if (!currentBooking || !currentBooking.date) return "";
    try {
      const bookingDate = new Date(currentBooking.date);
      const today = new Date();
      bookingDate.setHours(0,0,0,0);
      today.setHours(0,0,0,0);
      const diffTime = bookingDate - today;
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return "Today's Active Booking";
      if (diffDays === 1) return "Tomorrow's Active Booking";
      if (diffDays > 1) return `Upcoming in ${diffDays} days`;
      if (diffDays < 0) return `Scheduled ${Math.abs(diffDays)} days ago`;
    } catch (e) {
      return "";
    }
    return "";
  }, [currentBooking]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Filtered Appointments
  const filteredAppointments = React.useMemo(() => {
    if (!appointments) return [];
    const todayStr = new Date().toISOString().split('T')[0];

    return appointments.filter((apt) => {
      const statusUpper = (apt.status || "").toUpperCase();
      const serviceLower = (apt.service || "").toLowerCase();
      const dateStr = apt.date || "";
      const tokenStr = apt.token ? String(apt.token) : "";
      const reasonLower = (apt.reason || apt.notes || apt.suggestion || "").toLowerCase();
      const query = searchTerm.toLowerCase().trim();

      // Search match check
      const matchesSearch =
        !query ||
        serviceLower.includes(query) ||
        dateStr.includes(query) ||
        statusUpper.includes(query.toUpperCase()) ||
        tokenStr.includes(query) ||
        reasonLower.includes(query);

      if (!matchesSearch) return false;

      // Status filter check
      if (statusFilter === "All") return true;
      if (statusFilter === "Upcoming") {
        return (statusUpper === "CONFIRMED" || statusUpper === "PENDING" || statusUpper === "RESCHEDULED" || dateStr >= todayStr) && statusUpper !== "COMPLETED" && statusUpper !== "CANCELLED";
      }
      if (statusFilter === "Confirmed") return statusUpper === "CONFIRMED";
      if (statusFilter === "Completed") return statusUpper === "COMPLETED";
      if (statusFilter === "Pending") return statusUpper === "PENDING";
      if (statusFilter === "Rescheduled") return statusUpper === "RESCHEDULED";

      return true;
    });
  }, [appointments, searchTerm, statusFilter]);

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
      doc.text("Contact Support: +91 97504 51176", 40, 141, { align: "center" });

      doc.save(`Priority_Slip_PID_${docId}.pdf`);
      toast.success("Priority slip PDF downloaded successfully!");
    } catch (err) {
      console.error("PDF generation failed:", err);
      toast.error("Failed to generate PDF. Please try again.");
    }
  };

  const syncAppointments = async (phone) => {
    if (!phone) return;
    try {
      const result = await getUserAppointments(phone);
      const localApts = JSON.parse(localStorage.getItem('clinic_appointments')) || [];
      
      let combined = [];
      if (result && result.success && Array.isArray(result.data)) {
        combined = [...result.data];
      }
      
      // Merge local appointments
      localApts.forEach(loc => {
        if (!combined.some(c => c.id === loc.id || (c.date === loc.date && c.service === loc.service))) {
          combined.push(loc);
        }
      });

      // Detect status changes for toast notifications
      const oldApts = JSON.parse(localStorage.getItem('clinic_appointments')) || [];
      combined.forEach(newApt => {
        const matchingOldApt = oldApts.find(old => old.id === newApt.id);
        if (matchingOldApt && matchingOldApt.status !== newApt.status) {
          toast.success(`Visit Update: Your appointment for ${newApt.service} is now ${newApt.status}! 🏥`, {
            icon: "🔔"
          });
        }
      });

      if (combined.length > 0) {
        localStorage.setItem('clinic_appointments', JSON.stringify(combined));
        setAppointments(combined);
      }
    } catch (err) {
      console.error("Failed to sync appointments", err);
      const cached = JSON.parse(localStorage.getItem('clinic_appointments')) || [];
      if (cached.length > 0) {
        setAppointments(cached);
      }
    }
  };

  // Sync from backend every 10 seconds & load cached appointments instantly
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('clinic_user'));
    if (savedUser) {
      setUser(savedUser);
      // Immediately load cached appointments so there is NO initial blank state
      const cachedApts = JSON.parse(localStorage.getItem('clinic_appointments')) || [];
      if (cachedApts.length > 0) {
        setAppointments(cachedApts);
      }
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

  // ─── Login / Guest Gate ─────────────────────────────────────────────────────
  if (!user) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center px-4 py-16">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-sm relative z-10"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/25 mb-4">
              <Stethoscope className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Patient Portal</h1>
            <p className="text-slate-500 text-sm mt-1 font-semibold">Dr. Kanak's Clinic</p>
          </div>

          {/* Card */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-2xl shadow-blue-900/5">
            <h2 className="text-lg font-extrabold text-slate-900 mb-1">Access Your Records</h2>
            <p className="text-slate-500 text-sm mb-6">Enter your registered mobile number</p>

            <form onSubmit={handlePhoneLogin} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="phone"
                    type="tel"
                    maxLength={10}
                    placeholder="98765 43210"
                    className="pl-11 h-13 text-base bg-slate-50/50 border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-2xl focus:border-blue-500 focus:ring-blue-500/20 w-full"
                    style={{ fontSize: '16px' }}
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-13 rounded-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 text-sm active:scale-[0.98] transition-all"
                style={{ height: '52px' }}
                disabled={checking}
              >
                {checking ? <Loader2 className="w-5 h-5 animate-spin" /> : <ChevronRight className="w-5 h-5" />}
                Verify & Access
              </Button>
            </form>

            <p className="text-center text-xs text-slate-500 mt-4 font-medium">
              No account? <Link to="/book" className="text-blue-600 font-bold hover:underline">Book an appointment</Link>
            </p>
          </div>
        </motion.div>
      </section>
    );
  }

  // ─── Status colour helpers ────────────────────────────────────────────────
  const statusColor = (s) => {
    const st = (s || "").toUpperCase();
    if (st === "CONFIRMED") return { bg: "bg-blue-50 text-blue-600 border-blue-100", dot: "bg-blue-500" };
    if (st === "COMPLETED") return { bg: "bg-emerald-50 text-emerald-600 border-emerald-100", dot: "bg-emerald-500" };
    if (st === "CANCELLED") return { bg: "bg-red-50 text-red-600 border-red-100", dot: "bg-red-500" };
    if (st === "RESCHEDULED") return { bg: "bg-indigo-50 text-indigo-600 border-indigo-100", dot: "bg-indigo-500" };
    return { bg: "bg-amber-50 text-amber-600 border-amber-100", dot: "bg-amber-500" };
  };

  // ─── Main Profile Page ────────────────────────────────────────────────────
  return (
    <div id="profile" className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 scroll-mt-20">

      {/* ── Hero Header Banner ─────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-white via-slate-50 to-blue-50 border-b border-slate-100 pt-24 pb-6 px-4">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10">
          {/* Top row: avatar + name + logout */}
          <div className="flex items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Patient Portal</p>
                <h1 className="text-lg font-black text-slate-900 tracking-tight truncate leading-tight">{user.name}</h1>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-xs font-bold active:scale-95 transition-all shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>

          {/* Quick info pills row */}
          <div className="flex flex-wrap gap-2 mb-5">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-100 text-xs font-bold text-slate-600 shadow-xs">
              <Phone className="w-3 h-3 text-blue-500" />
              {user.phone}
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-100 text-xs font-bold text-slate-600 shadow-xs">
              <ShieldCheck className="w-3 h-3 text-blue-500" />
              PID-{user.id?.slice(-8) || "8821004"}
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-xs font-bold text-emerald-600">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              Verified
            </div>
          </div>

          {/* Quick stats row */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Total Visits", value: appointments.length, icon: History, color: "text-blue-500" },
              { label: "Upcoming", value: appointments.filter(a => { const s = (a.status || "").toUpperCase(); return (s === "PENDING" || s === "CONFIRMED" || s === "RESCHEDULED") && a.date >= new Date().toISOString().split("T")[0]; }).length, icon: CalendarCheck, color: "text-emerald-500" },
              { label: "Completed", value: appointments.filter(a => (a.status || "").toUpperCase() === "COMPLETED").length, icon: CheckCircle2, color: "text-indigo-500" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-white border border-slate-100/80 rounded-2xl p-3 text-center shadow-xs">
                <Icon className={`w-4 h-4 ${color} mx-auto mb-1`} />
                <div className="text-xl font-black text-slate-900 leading-none">{value}</div>
                <div className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Page Content ────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 pt-5 pb-24 space-y-5">

        {/* ── Active Booking Banner ───────────────────────────────────────── */}
        {currentBooking && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div 
              onClick={() => { setSelectedBooking(currentBooking); setRescheduleText(currentBooking.reschedule_request || ""); }}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 via-indigo-50/30 to-white border border-blue-200/60 p-4 shadow-xl shadow-blue-100/20 cursor-pointer hover:shadow-2xl hover:border-blue-400 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] group/card"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10">
                {/* badges row */}
                <div className="flex items-center gap-2 flex-wrap mb-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider shadow-lg shadow-blue-600/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    Active Booking
                  </span>
                  {currentBookingTiming && (
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200/60 text-slate-600 text-[10px] font-bold font-mono">
                      {currentBookingTiming}
                    </span>
                  )}
                  <span className={cn(
                    "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border",
                    statusColor(currentBooking.status).bg
                  )}>
                    {currentBooking.status || "PENDING"}
                  </span>
                  {currentBooking.reschedule_request && (
                    <span className="px-2.5 py-1 rounded-full bg-amber-55 border border-amber-200 text-amber-700 text-[10px] font-black uppercase tracking-wider animate-pulse">
                      ⚠️ Reschedule Requested
                    </span>
                  )}
                  <span className="px-2.5 py-1 rounded-full bg-indigo-55 border border-indigo-150 text-indigo-600 text-[10px] font-extrabold group-hover/card:bg-indigo-600 group-hover/card:text-white group-hover/card:border-indigo-600 transition-all duration-300">
                    🔍 View details & reschedule
                  </span>
                </div>

                {/* service name */}
                <h2 className="text-xl font-black text-slate-950 tracking-tight mb-2 flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-blue-600 shrink-0" />
                  {currentBooking.service}
                </h2>

                {/* date + token */}
                <div className="space-y-1.5 mb-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <CalendarCheck className="w-4 h-4 text-blue-500 shrink-0" />
                    {formatApptDateTime(currentBooking.date, currentBooking.time)}
                  </div>
                  {currentBooking.token && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 text-xs font-black break-all">
                      <span className="text-blue-500">Token #</span>{currentBooking.token}
                    </div>
                  )}
                  <p className="text-[10px] font-mono text-slate-500">ID: {currentBooking.id?.slice(-8)}</p>
                </div>

                {/* Queue Progress */}
                {currentBooking.status === 'CONFIRMED' && <QueueProgress date={currentBooking.date} />}

                {/* Doctor Guidance */}
                {(currentBooking.suggestion || currentBooking.reason || currentBooking.notes) && (
                  <div className="mt-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                    {currentBooking.suggestion && (
                      <div className="flex items-start gap-2 text-xs">
                        <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-black text-slate-900 uppercase tracking-wider text-[9px] block">Doctor Suggestion</span>
                          <p className="text-slate-600 mt-0.5 font-medium leading-relaxed">{currentBooking.suggestion}</p>
                        </div>
                      </div>
                    )}
                    {(currentBooking.reason || currentBooking.notes) && (
                      <div className="flex items-start gap-2 text-xs">
                        <FileText className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-black text-slate-900 uppercase tracking-wider text-[9px] block">Visit Guidance</span>
                          <p className="text-slate-600 mt-0.5 font-medium leading-relaxed">{currentBooking.reason || currentBooking.notes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* CTA Button */}
                <Button
                  onClick={(e) => { e.stopPropagation(); handlePrintToken(currentBooking); }}
                  className="mt-4 w-full h-12 rounded-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 text-sm active:scale-[0.98] transition-all"
                >
                  <Printer className="w-4 h-4" />
                  Download Booking Slip
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Last Visit Banner (only when no active booking) ─────────────── */}
        {lastVisit && !currentBooking && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}>
            <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-100 p-4 shadow-xl shadow-slate-100/50">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-black uppercase tracking-wider">
                      ⚡ Last Visit
                    </span>
                    {lastVisitTiming && (
                      <span className="px-2.5 py-1 rounded-full bg-slate-55 text-slate-500 text-[10px] font-bold font-mono">
                        {lastVisitTiming}
                      </span>
                    )}
                    <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-black uppercase border", statusColor(lastVisit.status).bg)}>
                      {lastVisit.status || "COMPLETED"}
                    </span>
                  </div>
                  <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-blue-500 shrink-0" />
                    {lastVisit.service}
                  </h2>
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 mt-1">
                    <CalendarCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    {formatApptDateTime(lastVisit.date, lastVisit.time)}
                  </div>
                  {lastVisit.token && (
                    <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-slate-50 border border-slate-100 text-slate-600 text-xs font-black break-all">
                      Token #{lastVisit.token}
                    </div>
                  )}
                </div>
              </div>
              <Button
                onClick={() => handlePrintToken(lastVisit)}
                className="w-full h-11 rounded-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white flex items-center justify-center gap-2 text-sm active:scale-[0.98] transition-all shadow-lg shadow-blue-500/10"
              >
                <Download className="w-4 h-4" />
                Download Visit Slip
              </Button>
            </div>
          </motion.div>
        )}

        {/* ── Announcements Feed ──────────────────────────────────────────── */}
        {announcements.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
            <div className="rounded-3xl bg-white border border-slate-100 overflow-hidden shadow-sm">
              <div className="flex items-center justify-between px-4 px-4 pt-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-500" />
                  <h3 className="text-sm font-black text-slate-950 tracking-tight">Clinic Updates</h3>
                </div>
                <Link to="/notifications" className="text-blue-600 text-xs font-bold flex items-center gap-1 hover:underline">
                  All <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="p-3 space-y-2">
                {announcements.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedAnnouncement(item)}
                    className="w-full flex items-start gap-3 p-3 rounded-2xl bg-slate-50/50 hover:bg-slate-50 active:scale-[0.99] transition-all text-left border border-slate-100"
                  >
                    {item.image_url && (
                      <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                        <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-slate-800 truncate leading-snug">{item.title}</h4>
                      <p className="text-[10px] text-slate-500 font-medium line-clamp-2 mt-0.5 leading-relaxed">{item.body}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Medical Visit Logs ──────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}>

          {/* Section Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-50 border border-blue-100">
                <History className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 tracking-tight">Visit Logs</h3>
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Clinical Records</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-white border border-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-widest shadow-xs">
              {filteredAppointments.length}/{appointments.length}
            </span>
          </div>

          {/* Search Bar */}
          <div className="relative mb-3">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search treatment, date, token…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 h-12 text-base bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-2xl focus:border-blue-500/50 w-full"
              style={{ fontSize: '16px' }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Pills - horizontal scroll */}
          <div className="flex gap-2 overflow-x-auto pb-1 mb-4 scrollbar-none -mx-4 px-4">
            {["All", "Upcoming", "Confirmed", "Completed", "Pending", "Rescheduled"].map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={cn(
                  "shrink-0 px-4 py-2 rounded-full text-xs font-extrabold border transition-all active:scale-95",
                  statusFilter === f
                    ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20"
                    : "bg-white border-slate-100 text-slate-500 hover:bg-slate-50 shadow-xs"
                )}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Visit Log Cards (Mobile) / Table (Desktop) */}
          {filteredAppointments.length > 0 ? (
            <>
              {/* ─ Mobile Cards (shown up to md) ─ */}
              <div className="md:hidden space-y-3">
                {filteredAppointments.map((apt, i) => {
                  const sc = statusColor(apt.status);
                  return (
                    <motion.div
                      key={apt.id || i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.04 }}
                      onClick={() => { setSelectedBooking(apt); setRescheduleText(apt.reschedule_request || ""); }}
                      className="rounded-3xl bg-white border border-slate-100 overflow-hidden shadow-md shadow-slate-100/50 cursor-pointer hover:border-blue-300 hover:shadow-lg active:scale-[0.99] transition-all"
                    >
                      {/* Card Header */}
                      <div className="flex items-start justify-between gap-3 p-4 pb-3">
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                          <div className="p-2 rounded-xl bg-blue-50 border border-blue-100 shrink-0 mt-0.5">
                            <Stethoscope className="w-4 h-4 text-blue-500" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-extrabold text-slate-800 text-sm leading-tight truncate">{apt.service}</h4>
                            <p className="text-[10px] font-mono text-slate-400 mt-0.5">ID: {apt.id?.slice(-8)}</p>
                          </div>
                        </div>
                        <span className={cn("px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border shrink-0", sc.bg)}>
                          {apt.status || "PENDING"}
                        </span>
                      </div>

                      {/* Divider */}
                      <div className="h-px bg-slate-50 mx-4" />

                      {/* Card Details */}
                      <div className="p-4 pt-3 space-y-2.5">
                        {/* Date & Time */}
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                          <CalendarCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          {formatApptDateTime(apt.date, apt.time)}
                        </div>

                        {/* Token — full width, no truncation */}
                        {apt.token && (
                          <div className="inline-flex items-start gap-1.5 px-3 py-2 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 text-xs font-black break-all w-full">
                            <span className="shrink-0 text-blue-400">Token</span>
                            <span className="break-all">#{apt.token}</span>
                          </div>
                        )}

                        {/* Queue Progress */}
                        {apt.status === 'CONFIRMED' && <QueueProgress date={apt.date} />}

                        {/* Clinical Note */}
                        {(apt.suggestion || apt.reason || apt.notes) && (
                          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-500 break-words">
                            <span className="block text-[9px] uppercase tracking-wider font-black text-slate-400 mb-1">Clinical Note</span>
                            {apt.suggestion || apt.reason || apt.notes}
                          </div>
                        )}

                        {/* Print Button */}
                        <Button
                          onClick={(e) => { e.stopPropagation(); handlePrintToken(apt); }}
                          className="w-full h-11 rounded-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white flex items-center justify-center gap-2 text-xs active:scale-[0.98] transition-all shadow-lg shadow-blue-500/10"
                        >
                          <Printer className="w-4 h-4" />
                          Print Priority Slip
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* ─ Desktop Table (shown at md+) ─ */}
              <div className="hidden md:block rounded-3xl bg-white border border-slate-100 overflow-hidden shadow-md shadow-slate-100/50">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-450 bg-slate-50/50">
                      <th className="py-4 px-5">Treatment</th>
                      <th className="py-4 px-5">Date & Time</th>
                      <th className="py-4 px-5">Token</th>
                      <th className="py-4 px-5">Status</th>
                      <th className="py-4 px-5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAppointments.map((apt, i) => {
                      const sc = statusColor(apt.status);
                      return (
                        <tr 
                          key={apt.id || i} 
                          onClick={() => { setSelectedBooking(apt); setRescheduleText(apt.reschedule_request || ""); }}
                          className="group hover:bg-blue-50/30 cursor-pointer transition-colors"
                        >
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-xl bg-blue-50 border border-blue-100 shrink-0 group-hover:bg-blue-100 transition-colors">
                                <Stethoscope className="w-4 h-4 text-blue-500" />
                              </div>
                              <div>
                                <div className="text-sm font-extrabold text-slate-800">{apt.service}</div>
                                {(apt.suggestion || apt.reason || apt.notes) && (
                                  <div className="text-[10px] text-slate-500 truncate max-w-[220px] mt-0.5">
                                    {apt.suggestion || apt.reason || apt.notes}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-2 text-sm font-semibold text-slate-600 whitespace-nowrap">
                              <CalendarCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                              {formatApptDateTime(apt.date, apt.time)}
                            </div>
                            {apt.status === 'CONFIRMED' && <div className="mt-1"><QueueProgress date={apt.date} /></div>}
                          </td>
                          <td className="py-4 px-5">
                            {apt.token ? (
                              <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 text-[10px] font-black border border-blue-100 max-w-[140px] truncate inline-block" title={`Token #${apt.token}`}>
                                #{apt.token}
                              </span>
                            ) : (
                              <span className="text-[10px] font-mono text-slate-400">Regular</span>
                            )}
                            <p className="text-[10px] font-mono text-slate-400 mt-0.5">ID: {apt.id?.slice(-8)}</p>
                          </td>
                          <td className="py-4 px-5">
                            <span className={cn("px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border", sc.bg)}>
                              {apt.status || "PENDING"}
                            </span>
                          </td>
                          <td className="py-4 px-5 text-right">
                            <Button
                              onClick={(e) => { e.stopPropagation(); handlePrintToken(apt); }}
                              size="sm"
                              className="h-9 px-4 rounded-xl font-bold text-xs bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white border border-blue-100 hover:border-blue-600 transition-all flex items-center gap-1.5 ml-auto"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              Slip
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="rounded-3xl bg-white border border-slate-100 border-dashed p-10 flex flex-col items-center justify-center text-center shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-4">
                {appointments.length > 0 ? (
                  <Filter className="w-6 h-6 text-blue-500" />
                ) : (
                  <CalendarCheck className="w-6 h-6 text-slate-400" />
                )}
              </div>
              <h4 className="text-base font-black text-slate-800 mb-1">
                {appointments.length > 0 ? "No Matching Logs" : "No Sessions Yet"}
              </h4>
              <p className="text-sm text-slate-500 font-medium mb-6 max-w-xs">
                {appointments.length > 0
                  ? `No logs match "${statusFilter}"${searchTerm ? ` and "${searchTerm}"` : ""}.`
                  : "You haven't booked any clinical sessions yet. Get started today!"}
              </p>
              {appointments.length > 0 ? (
                <Button
                  onClick={() => { setSearchTerm(""); setStatusFilter("All"); }}
                  className="rounded-full px-6 h-11 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 font-bold text-white flex items-center gap-2 text-sm active:scale-95 transition-all"
                >
                  <Filter className="w-4 h-4" />
                  Reset Filters
                </Button>
              ) : (
                <Button className="rounded-full px-6 h-11 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 font-bold text-white text-sm" asChild>
                  <Link to="/book">Book Your First Session</Link>
                </Button>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* ── Announcement Detail Modal ────────────────────────────────────── */}
      <Dialog open={!!selectedAnnouncement} onOpenChange={(open) => !open && setSelectedAnnouncement(null)}>
        <DialogContent className="rounded-2xl sm:rounded-3xl p-0 max-w-lg border border-slate-100 shadow-2xl overflow-hidden bg-white">
          {selectedAnnouncement && (
            <div className="text-left">
              {selectedAnnouncement.image_url && (
                <div className="w-full h-48 sm:h-60 overflow-hidden">
                  <img src={selectedAnnouncement.image_url} alt={selectedAnnouncement.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-5 sm:p-7 space-y-3">
                <span className="inline-flex items-center gap-1 text-blue-600 text-[10px] font-black uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" /> Announcement
                </span>
                <h2 className="text-xl font-black text-slate-900 tracking-tight leading-tight">{selectedAnnouncement.title}</h2>
                <p className="text-sm text-slate-500 font-medium leading-relaxed whitespace-pre-wrap">{selectedAnnouncement.body}</p>
                {selectedAnnouncement.url && (
                  <a
                    href={selectedAnnouncement.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold text-sm transition-all"
                  >
                    Explore <ArrowRight className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Booking Details & Reschedule Modal ────────────────────────────── */}
      <Dialog open={!!selectedBooking} onOpenChange={(open) => !open && setSelectedBooking(null)}>
        <DialogContent className="rounded-[2rem] p-0 w-[95vw] sm:w-full max-w-lg border border-slate-200 shadow-2xl overflow-hidden bg-white">
          {selectedBooking && (
            <div className="text-left font-sans">
              {/* Header section with gradient */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-6 text-white relative">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 text-white text-[9px] font-black uppercase tracking-wider mb-2">
                  Booking Details
                </span>
                <h3 className="text-xl font-black tracking-tight leading-tight">{selectedBooking.service}</h3>
                <p className="text-blue-100 text-xs font-semibold mt-1 font-mono">PID: {selectedBooking.id?.slice(-8)}</p>
                <button 
                  onClick={() => setSelectedBooking(null)}
                  className="absolute top-4 right-4 text-white/80 hover:text-white text-lg font-bold outline-none"
                >
                  ✕
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
                {/* Appointment Information Card */}
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Appointment Slot</span>
                    <p className="text-xs font-extrabold text-slate-800 flex items-center gap-1">
                      <CalendarCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      {formatApptDateTime(selectedBooking.date, selectedBooking.time)}
                    </p>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Status</span>
                    <div>
                      <span className={cn(
                        "inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border",
                        statusColor(selectedBooking.status).bg
                      )}>
                        {selectedBooking.status || "PENDING"}
                      </span>
                    </div>
                  </div>
                  {selectedBooking.token && (
                    <div className="col-span-2 border-t border-slate-200/50 pt-2.5 mt-1">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Token Number</span>
                      <p className="text-xs font-black text-blue-600">#{selectedBooking.token}</p>
                    </div>
                  )}
                </div>

                {/* Patient Information */}
                <div className="space-y-1">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 block">Patient Name & Phone</span>
                  <p className="text-xs font-extrabold text-slate-800">{selectedBooking.name || user.name}</p>
                  <p className="text-xs font-mono font-bold text-slate-500">+91 {selectedBooking.phone || user.phone}</p>
                </div>

                {/* Messages & Guidance */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  {/* Patient message */}
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Your Problem Message (Public Note)</span>
                    <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 font-medium italic leading-relaxed">
                      {selectedBooking.message || "No problem message provided."}
                    </p>
                  </div>

                  {/* Doctor suggestion */}
                  {selectedBooking.suggestion && (
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Doctor Suggestion / Re-plan</span>
                      <p className="text-xs text-blue-700 bg-blue-50/50 p-3 rounded-xl border border-blue-100/50 font-bold leading-relaxed flex items-start gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                        {selectedBooking.suggestion}
                      </p>
                    </div>
                  )}

                  {/* Visit guidance */}
                  {selectedBooking.cancel_reason && (
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Visit Guidance / Clinical Reason</span>
                      <p className="text-xs text-indigo-700 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/50 font-semibold leading-relaxed flex items-start gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-indigo-600 mt-0.5 shrink-0" />
                        {selectedBooking.cancel_reason}
                      </p>
                    </div>
                  )}
                </div>

                {/* Reschedule Request Form / Existing Request */}
                {(selectedBooking.status === 'PENDING' || selectedBooking.status === 'CONFIRMED') && (
                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 block">Need to Reschedule?</span>
                    
                    {selectedBooking.reschedule_request && (
                      <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl">
                        <span className="text-[8px] font-bold uppercase tracking-wider text-amber-700 block mb-1">Your Reschedule Request:</span>
                        <p className="text-xs font-semibold text-amber-900 italic">"{selectedBooking.reschedule_request}"</p>
                        <span className="text-[8px] text-amber-600 block mt-1 font-medium">Status: Pending review by clinic admin.</span>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label className="text-[9px] font-bold uppercase tracking-widest text-slate-400 block">
                        {selectedBooking.reschedule_request ? "Update Reschedule Request Message" : "Write Message / Reschedule Request"}
                      </Label>
                      <textarea
                        value={rescheduleText}
                        onChange={(e) => setRescheduleText(e.target.value)}
                        placeholder="Explain your reschedule preference (e.g. Please reschedule me to next Saturday 5:30 PM because...)"
                        className="w-full min-h-[70px] rounded-xl border border-slate-200 bg-slate-50/50 p-3 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-xs font-semibold outline-none transition-all resize-none text-slate-800 placeholder:text-slate-400"
                      />
                    </div>

                    <Button
                      onClick={handleRescheduleSubmit}
                      disabled={submittingReschedule}
                      className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/10 active:scale-[0.98] transition-all"
                    >
                      {submittingReschedule ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                      {selectedBooking.reschedule_request ? "Update Request" : "Send Reschedule Request"}
                    </Button>
                  </div>
                )}

                {/* Print button at bottom */}
                <div className="pt-2">
                  <Button
                    onClick={() => handlePrintToken(selectedBooking)}
                    className="w-full h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-500" />
                    Download Booking Slip PDF
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};


export default Profile;


