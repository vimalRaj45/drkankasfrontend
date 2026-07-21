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
  Edit2,
  Columns,
  LayoutGrid,
  List,
  Star,
  LogOut
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
import { getAppointments, updateStatus, broadcastPush, uploadImage, getNotifications, updateNotification, deleteNotification, getSetting, saveSetting, adminSendOtp, adminVerifyOtp, getAdminFeedback, deleteAdminFeedback } from '../services/api';
import { useNavigate } from "react-router-dom";

const convertTo24h = (timeStr) => {
  if (!timeStr) return "";
  timeStr = timeStr.trim();
  // Check if already in HH:MM:SS or HH:MM format
  if (/^\d{2}:\d{2}(:\d{2})?$/.test(timeStr)) {
    return timeStr.substring(0, 5); // Return HH:MM
  }
  // Try to parse AM/PM format
  const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (match) {
    let hours = parseInt(match[1]);
    const minutes = match[2];
    const ampm = match[3].toUpperCase();
    if (ampm === "PM" && hours < 12) hours += 12;
    if (ampm === "AM" && hours === 12) hours = 0;
    return `${String(hours).padStart(2, "0")}:${minutes}`;
  }
  return timeStr;
};

const AdminPanel = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdmin, setShowAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const todayStr = React.useMemo(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  const [analyticsTab, setAnalyticsTab] = useState("overall");

  const overallStats = React.useMemo(() => {
    if (!appointments || appointments.length === 0) {
      return { total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0 };
    }
    return {
      total: appointments.length,
      pending: appointments.filter(a => (a.status || 'PENDING').toUpperCase() === 'PENDING').length,
      confirmed: appointments.filter(a => {
        const s = (a.status || '').toUpperCase();
        return s === 'CONFIRMED' || s === 'RESCHEDULED';
      }).length,
      completed: appointments.filter(a => (a.status || '').toUpperCase() === 'COMPLETED').length,
      cancelled: appointments.filter(a => (a.status || '').toUpperCase() === 'CANCELLED').length,
    };
  }, [appointments]);

  const todayStats = React.useMemo(() => {
    if (!appointments || appointments.length === 0) {
      return { total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0 };
    }
    const todayApts = appointments.filter(apt => {
      if (!apt.appointment_date && !apt.date) return false;
      const rawDate = apt.appointment_date || apt.date;
      const aptDateStr = new Date(rawDate).toISOString().split('T')[0];
      return aptDateStr === todayStr;
    });

    return {
      total: todayApts.length,
      pending: todayApts.filter(a => (a.status || 'PENDING').toUpperCase() === 'PENDING').length,
      confirmed: todayApts.filter(a => {
        const s = (a.status || '').toUpperCase();
        return s === 'CONFIRMED' || s === 'RESCHEDULED';
      }).length,
      completed: todayApts.filter(a => (a.status || '').toUpperCase() === 'COMPLETED').length,
      cancelled: todayApts.filter(a => (a.status || '').toUpperCase() === 'CANCELLED').length,
    };
  }, [appointments, todayStr]);

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loginStep, setLoginStep] = useState(1); // 1: phone input, 2: OTP input
  const [displayPhone, setDisplayPhone] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("admin_authenticated");
    if (auth === "true") {
      setShowAdmin(true);
    }
  }, []);

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);
    try {
      const res = await adminSendOtp(phone);
      if (res.success) {
        const displayMatch = res.message.match(/\(([^)]+)\)/);
        setDisplayPhone(displayMatch ? displayMatch[1] : "your registered number");
        setLoginStep(2);
        toast.success("OTP has been sent to WhatsApp!");
      } else {
        setLoginError(res.message || "Access denied. Unauthorized number.");
        toast.error("Unauthorized!");
      }
    } catch (err) {
      setLoginError("Failed to connect to authentication server.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);
    try {
      const res = await adminVerifyOtp(otp);
      if (res.success) {
        setShowAdmin(true);
        localStorage.setItem("admin_authenticated", "true");
        toast.success("Welcome back, Dr. Kanak!");
      } else {
        setLoginError(res.message || "Invalid or expired OTP. Please try again.");
        toast.error("Verification failed!");
      }
    } catch (err) {
      setLoginError("Verification failed.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_authenticated");
    setShowAdmin(false);
    toast.success("Logged out successfully.");
    navigate("/");
  };

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Push Broadcast State
  const [isPushDialogOpen, setIsPushDialogOpen] = useState(false);
  const [pushData, setPushData] = useState({ title: "", body: "", url: "", image: "", send_native_push: true });
  const [pushSending, setPushSending] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [bannerList, setBannerList] = useState([]);
  const [editingBannerId, setEditingBannerId] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);

  const [editStatus, setEditStatus] = useState("");
  const [editReason, setEditReason] = useState("");
  const [editSuggestion, setEditSuggestion] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");
  const [isSavingPatientInfo, setIsSavingPatientInfo] = useState(false);

  const [viewType, setViewType] = useState("grid");
  const [filterService, setFilterService] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterDate, setFilterDate] = useState("");

  const [feedbacks, setFeedbacks] = useState([]);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(false);

  const fetchFeedbacks = async () => {
    setLoadingFeedbacks(true);
    try {
      const res = await getAdminFeedback();
      if (res.success && res.data) {
        setFeedbacks(res.data);
      }
    } catch (err) {
      console.error("Failed to load feedbacks:", err);
    } finally {
      setLoadingFeedbacks(false);
    }
  };

  useEffect(() => {
    if (viewType === "reviews") {
      fetchFeedbacks();
    }
  }, [viewType]);

  useEffect(() => {
    if (selectedPatient) {
      setEditStatus(selectedPatient.status || "PENDING");
      setEditReason(selectedPatient.cancel_reason || "");
      setEditSuggestion(selectedPatient.suggestion || "");
      setEditNotes(selectedPatient.consultation_notes || "");
      setEditDate(selectedPatient.date ? selectedPatient.date.split('T')[0] : "");
      setEditTime(selectedPatient.time ? convertTo24h(selectedPatient.time) : "");
    }
  }, [selectedPatient]);
 
  const handleSavePatientInfo = async () => {
    if (!selectedPatient) return;
    setIsSavingPatientInfo(true);
    try {
      const res = await updateStatus(selectedPatient.id, editStatus, "dr_kanaks", editReason, editSuggestion, editNotes, editDate, editTime);
      if (res.success || res.status === 'success') {
        toast.success("Patient clinical records updated successfully!");
        setIsPatientModalOpen(false);
        fetchAppointments();
      } else {
        toast.error(`Update failed: ${res.message}`);
      }
    } catch (err) {
      toast.error("Failed to connect to update status endpoint.");
    } finally {
      setIsSavingPatientInfo(false);
    }
  };

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
          displayTime = `${h}:${mins.substring(0, 2)} ${suffix}`;
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
      const res = await updateStatus(id, newStatus, "dr_kanaks");
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
        const res = await uploadImage(base64Data, "dr_kanaks");
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
      const res = await saveSetting("working_hours", clinicHours, "dr_kanaks");
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

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = 
      !searchTerm ||
      apt.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.phone?.includes(searchTerm) ||
      apt.id?.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesService = 
      filterService === "All" || 
      apt.service === filterService;
      
    const matchesStatus = 
      filterStatus === "All" || 
      apt.status === filterStatus;
      
    const matchesDate = 
      !filterDate || 
      apt.date === filterDate;
      
    return matchesSearch && matchesService && matchesStatus && matchesDate;
  });

  if (!showAdmin) {
    return (
      <div className="fixed inset-0 z-[1500] bg-slate-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Background Gradients */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-sky-100/50 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-blue-100 rounded-[3rem] p-6 sm:p-10 shadow-2xl shadow-blue-900/5 relative"
        >
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center border border-blue-100 mb-6">
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
            <img src={Logo} alt="Clinic Logo" className="h-12 object-contain mb-4" />
            <h2 className="font-display font-extrabold text-2xl text-slate-900 tracking-tight mb-2">Clinical Portal</h2>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Access Restricted to Authorized Staff</p>
          </div>

          {loginStep === 1 ? (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 pl-1">WhatsApp Mobile Number</Label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    type="tel"
                    placeholder="Enter admin phone number..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className="h-12 pl-12 rounded-2xl border-slate-200 bg-white text-slate-900 focus:ring-primary focus:border-primary placeholder:text-slate-400 font-medium font-mono"
                    maxLength={10}
                    required
                  />
                </div>
                {loginError && (
                  <p className="text-red-400 text-xs font-semibold pl-1 pt-1">{loginError}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoggingIn}
                className="w-full h-12 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:bg-primary/95 transition-all flex items-center justify-center gap-2 mt-8"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  "Request Verification Code"
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">One-Time Password (OTP)</Label>
                  <button 
                    type="button" 
                    onClick={() => { setLoginStep(1); setLoginError(""); }}
                    className="text-[10px] font-bold text-blue-600 hover:underline uppercase"
                  >
                    Change Phone
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Enter 6-digit OTP code..."
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="h-12 pl-12 rounded-2xl border-slate-200 bg-white text-slate-900 focus:ring-primary focus:border-primary placeholder:text-slate-400 font-medium font-mono text-center tracking-[0.2em] text-lg"
                    maxLength={6}
                    required
                  />
                </div>
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed px-1">
                  We've sent a 6-digit verification code to <span className="font-mono text-slate-800 font-bold">{displayPhone}</span> via WhatsApp.
                </p>
                {loginError && (
                  <p className="text-red-400 text-xs font-semibold pl-1 pt-1">{loginError}</p>
                )}
              </div>

              <div className="flex flex-col gap-3 mt-8">
                <Button
                  type="submit"
                  disabled={isLoggingIn || otp.length !== 6}
                  className="w-full h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
                >
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify & Authenticate"
                  )}
                </Button>
                
                <button
                  type="button"
                  onClick={(e) => handleSendOtp(e)}
                  disabled={isLoggingIn}
                  className="text-[10px] font-bold uppercase tracking-widest text-slate-405 hover:text-slate-700 transition-colors py-2"
                >
                  Resend OTP Code
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#f4f7fc] text-slate-800 flex flex-col font-sans">
      <div className="w-full flex-grow flex flex-col">
        {/* Admin Header */}
        <div className="bg-white border-b border-blue-100 text-slate-800 p-4 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden shadow-sm shrink-0">
          <div className="relative z-10 w-full sm:w-auto">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <div className="bg-white px-3 py-1.5 rounded-xl shadow-md border border-blue-50 flex items-center">
                <img src={Logo} className="h-8 w-auto object-contain" alt="Logo" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tighter text-slate-900">Clinical Dashboard V4.0</h2>
            </div>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              Authenticated Admin Session &middot; Secure 256-bit Encryption
            </p>
          </div>

          <Button
            variant="outline"
            className="rounded-2xl bg-red-50/80 border-red-200/60 text-red-600 hover:bg-red-600 hover:text-white font-extrabold h-11 px-5 gap-2 transition-all shadow-sm relative z-10 self-end sm:self-auto"
            onClick={() => setShowLogoutConfirm(true)}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>

          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-100/40 rounded-full blur-[80px] -z-0 translate-x-1/2 -translate-y-1/2" />
        </div>

        {/* Clinical Analytics Overview Banner */}
        <div className="bg-[#f8fafc] border-b border-blue-100 p-4 sm:p-6 px-4 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-md shadow-blue-600/20">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 leading-none">
                  {analyticsTab === "overall" ? "Overall Clinical Analytics" : "Today's Queue Analytics"}
                </h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  {analyticsTab === "overall" ? "All-Time Patient Database Overview" : `Live Queue Summary · ${todayStr}`}
                </p>
              </div>
            </div>

            {/* Tab Mode Switcher & Quick Filter */}
            <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-blue-100 shadow-sm">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => { setAnalyticsTab("overall"); setFilterDate(""); }}
                className={cn(
                  "rounded-xl px-4 h-9 text-xs font-black transition-all",
                  analyticsTab === "overall"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                    : "text-slate-600 hover:bg-blue-50"
                )}
              >
                Overall ({overallStats.total})
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => { setAnalyticsTab("today"); setFilterDate(todayStr); }}
                className={cn(
                  "rounded-xl px-4 h-9 text-xs font-black transition-all",
                  analyticsTab === "today"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                    : "text-slate-600 hover:bg-blue-50"
                )}
              >
                Today ({todayStats.total})
              </Button>
            </div>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {/* Total Card */}
            <div 
              onClick={() => {
                if (analyticsTab === "today") {
                  setFilterDate(todayStr); setFilterStatus("All");
                } else {
                  setFilterDate(""); setFilterStatus("All");
                }
              }}
              className="bg-white p-3.5 sm:p-4 rounded-2xl border border-blue-100 shadow-sm cursor-pointer hover:border-blue-300 transition-all group"
            >
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                {analyticsTab === "overall" ? "Overall Total" : "Today's Total"}
              </p>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                  {analyticsTab === "overall" ? overallStats.total : todayStats.total}
                </span>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  {analyticsTab === "overall" && todayStats.total > 0 ? `+${todayStats.total} today` : "Bookings"}
                </span>
              </div>
            </div>

            {/* Pending Card */}
            <div 
              onClick={() => {
                if (analyticsTab === "today") {
                  setFilterDate(todayStr); setFilterStatus("PENDING");
                } else {
                  setFilterDate(""); setFilterStatus("PENDING");
                }
              }}
              className="bg-white p-3.5 sm:p-4 rounded-2xl border border-amber-100 shadow-sm cursor-pointer hover:border-amber-300 transition-all group"
            >
              <p className="text-[10px] font-black uppercase text-amber-500 tracking-wider">
                {analyticsTab === "overall" ? "Overall Pending" : "Today Pending"}
              </p>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl sm:text-3xl font-black text-amber-600">
                  {analyticsTab === "overall" ? overallStats.pending : todayStats.pending}
                </span>
                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                  Queue
                </span>
              </div>
            </div>

            {/* Confirmed Card */}
            <div 
              onClick={() => {
                if (analyticsTab === "today") {
                  setFilterDate(todayStr); setFilterStatus("CONFIRMED");
                } else {
                  setFilterDate(""); setFilterStatus("CONFIRMED");
                }
              }}
              className="bg-white p-3.5 sm:p-4 rounded-2xl border border-blue-100 shadow-sm cursor-pointer hover:border-blue-300 transition-all group"
            >
              <p className="text-[10px] font-black uppercase text-blue-500 tracking-wider">
                {analyticsTab === "overall" ? "Overall Confirmed" : "Today Confirmed"}
              </p>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl sm:text-3xl font-black text-blue-600">
                  {analyticsTab === "overall" ? overallStats.confirmed : todayStats.confirmed}
                </span>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  Active
                </span>
              </div>
            </div>

            {/* Completed Card */}
            <div 
              onClick={() => {
                if (analyticsTab === "today") {
                  setFilterDate(todayStr); setFilterStatus("COMPLETED");
                } else {
                  setFilterDate(""); setFilterStatus("COMPLETED");
                }
              }}
              className="bg-white p-3.5 sm:p-4 rounded-2xl border border-emerald-100 shadow-sm cursor-pointer hover:border-emerald-300 transition-all group"
            >
              <p className="text-[10px] font-black uppercase text-emerald-500 tracking-wider">
                {analyticsTab === "overall" ? "Overall Completed" : "Today Completed"}
              </p>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl sm:text-3xl font-black text-emerald-600">
                  {analyticsTab === "overall" ? overallStats.completed : todayStats.completed}
                </span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Visited
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Actions Bar */}
        <div className="p-4 sm:p-8 border-b border-blue-50 flex flex-col gap-6 bg-white">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search Patient Name, Phone or ID..."
                className="pl-12 h-12 rounded-2xl border-slate-200 bg-[#f8fafc] text-slate-850 focus:ring-primary focus:bg-white shadow-sm w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* View Selector & Utilities */}
            <div className="flex items-center flex-wrap gap-4 w-full lg:w-auto justify-start lg:justify-end">
              {/* View Selector Button Group */}
              <div className="flex items-center bg-blue-50/50 p-1.5 rounded-2xl border border-blue-100/50 w-full sm:w-auto justify-between sm:justify-start">
                <Button
                  variant="ghost"
                  onClick={() => setViewType("grid")}
                  className={cn("rounded-xl px-4 py-2 h-9 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5", 
                    viewType === "grid" ? "bg-white shadow-md text-blue-600 font-extrabold" : "text-slate-500 hover:bg-blue-50/50"
                  )}
                >
                  <LayoutGrid className="w-4 h-4" />
                  Grid
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setViewType("table")}
                  className={cn("rounded-xl px-4 py-2 h-9 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5", 
                    viewType === "table" ? "bg-white shadow-md text-blue-600 font-extrabold" : "text-slate-500 hover:bg-blue-50/50"
                  )}
                >
                  <List className="w-4 h-4" />
                  Table
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setViewType("kanban")}
                  className={cn("rounded-xl px-4 py-2 h-9 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5", 
                    viewType === "kanban" ? "bg-white shadow-md text-blue-600 font-extrabold" : "text-slate-500 hover:bg-blue-50/50"
                  )}
                >
                  <Columns className="w-4 h-4" />
                  Kanban
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setViewType("reviews")}
                  className={cn("rounded-xl px-4 py-2 h-9 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5", 
                    viewType === "reviews" ? "bg-white shadow-md text-blue-600 font-extrabold" : "text-slate-500 hover:bg-blue-50/50"
                  )}
                >
                  <MessageSquare className="w-4 h-4" />
                  Reviews
                </Button>
              </div>

              <Button
                onClick={() => setIsPushDialogOpen(true)}
                className="rounded-2xl h-12 px-5 gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200/50 font-bold transition-all flex-1 sm:flex-none justify-center"
              >
                <Bell className="w-4 h-4 text-blue-500" />
                Banner Upload
              </Button>
              <Button
                onClick={handleOpenHoursDialog}
                className="rounded-2xl h-12 px-5 gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200/50 font-bold transition-all flex-1 sm:flex-none justify-center"
              >
                <Clock className="w-4 h-4 text-blue-500" />
                Hours
              </Button>
              <Button onClick={fetchAppointments} disabled={loading} className="rounded-2xl h-12 px-5 gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-600/20 flex-1 sm:flex-none justify-center">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4 rotate-90" />}
                Sync Database
              </Button>
            </div>
          </div>

          {/* Advanced Search & Filtering Drawer */}
          <div className="flex flex-wrap items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-border shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider pl-2">
              <Filter className="w-4 h-4 text-primary" />
              Advanced Filters
            </div>

            <div className="flex flex-wrap items-center gap-4 flex-1">
              {/* Service Selector */}
              <select
                value={filterService}
                onChange={(e) => setFilterService(e.target.value)}
                className="h-10 rounded-xl border border-border bg-muted/30 px-3 text-xs font-bold text-foreground focus:bg-background outline-none min-w-[150px] w-full sm:w-auto"
              >
                <option value="All">All Services</option>
                <option value="General Consultation">General Consultation</option>
                <option value="Hair Transplant">Hair Transplant</option>
                <option value="Hair Care">Hair Care</option>
                <option value="Skin Care">Skin Care</option>
                <option value="Treatments">Treatments</option>
                <option value="Aftercare">Aftercare</option>
              </select>

              {/* Status Selector */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="h-10 rounded-xl border border-border bg-muted/30 px-3 text-xs font-bold text-foreground focus:bg-background outline-none min-w-[140px] w-full sm:w-auto"
              >
                <option value="All">All Statuses</option>
                <option value="PENDING">PENDING</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="RESCHEDULED">RESCHEDULED</option>
                <option value="CANCELLED">CANCELLED</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>

              {/* Date Input */}
              <div className="flex items-center gap-1.5 w-full sm:w-auto">
                <Input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="h-10 rounded-xl border-border bg-muted/30 px-3 text-xs font-bold text-foreground focus:bg-background w-full sm:w-auto sm:max-w-[160px]"
                />
                <Button
                  type="button"
                  size="sm"
                  variant={filterDate === todayStr ? "default" : "outline"}
                  onClick={() => setFilterDate(filterDate === todayStr ? "" : todayStr)}
                  className="h-10 rounded-xl text-xs font-extrabold px-3 shrink-0"
                >
                  Today
                </Button>
              </div>

              {/* Reset Filters button */}
              {(filterService !== "All" || filterStatus !== "All" || filterDate) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { setFilterService("All"); setFilterStatus("All"); setFilterDate(""); }}
                  className="text-primary font-bold text-xs uppercase hover:bg-primary/5 rounded-lg px-3"
                >
                  Reset Filters
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Database Grid */}
        <div className="flex-grow overflow-y-auto p-4 sm:p-8 bg-muted/30 relative">
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
          ) : viewType === "table" ? (
            /* TABLE VIEW */
            <div className="bg-white border border-blue-100 rounded-[2.5rem] overflow-hidden shadow-md shadow-blue-900/5">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#f8fafc] border-b border-blue-50">
                      <th className="p-5 text-[10px] font-black uppercase text-slate-500 tracking-wider">Patient Details</th>
                      <th className="p-5 text-[10px] font-black uppercase text-muted-foreground tracking-wider">Schedule</th>
                      <th className="p-5 text-[10px] font-black uppercase text-muted-foreground tracking-wider">Service</th>
                      <th className="p-5 text-[10px] font-black uppercase text-muted-foreground tracking-wider">Reference Note</th>
                      <th className="p-5 text-[10px] font-black uppercase text-muted-foreground tracking-wider text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-50/30">
                    {filteredAppointments.map((apt) => (
                      <tr key={apt.id} className="hover:bg-blue-50/10 transition-colors group">
                        <td className="p-5">
                          <div 
                            onClick={() => { setSelectedPatient(apt); setIsPatientModalOpen(true); }}
                            className="font-extrabold text-primary underline cursor-pointer hover:text-primary/80"
                          >
                            {apt.name}
                          </div>
                          {apt.reschedule_request && (
                            <Badge className="bg-amber-100 hover:bg-amber-100 text-amber-800 border-amber-200 text-[9px] font-bold tracking-wider uppercase py-0.5 px-2 rounded-md mt-1 block w-fit">
                              ⚠️ Reschedule Requested
                            </Badge>
                          )}
                          <div className="text-[10px] text-muted-foreground font-mono mt-1">
                            PID: {apt.id.slice(-8)} &middot; +91 {apt.phone}
                          </div>
                        </td>
                        <td className="p-5 text-xs font-bold text-foreground">
                          {formatApptDateTime(apt.date, apt.time)}
                        </td>
                        <td className="p-5 text-xs font-bold text-secondary">
                          {apt.service}
                        </td>
                        <td className="p-5 text-xs text-muted-foreground font-medium italic max-w-xs truncate">
                          {apt.consultation_notes || "—"}
                        </td>
                        <td className="p-5 text-center">
                          <select
                            value={apt.status || 'PENDING'}
                            onChange={(e) => handleDynamicStatusChange(apt.id, e.target.value)}
                            className="bg-background border border-border text-foreground px-3 py-1.5 rounded-xl font-bold text-xs outline-none focus:ring-1 focus:ring-primary w-32 mx-auto"
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="RESCHEDULED">RESCHEDULED</option>
                            <option value="CANCELLED">CANCELLED</option>
                            <option value="COMPLETED">COMPLETED</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : viewType === "kanban" ? (
            /* KANBAN BOARD VIEW */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 items-start">
              {[
                { id: "PENDING", title: "Pending Request" },
                { id: "CONFIRMED", title: "Confirmed Slot" },
                { id: "RESCHEDULED", title: "Rescheduled Slot" },
                { id: "CANCELLED", title: "Cancelled Out" },
                { id: "COMPLETED", title: "Completed Visit" }
              ].map((col) => {
                const colApts = filteredAppointments.filter(apt => (apt.status || 'PENDING') === col.id);
                
                return (
                  <div key={col.id} className="bg-white border border-blue-100/85 rounded-[2.5rem] p-5 shadow-md shadow-blue-900/5 flex flex-col max-h-[70vh] min-h-[400px]">
                    <div className="flex items-center justify-between mb-4 border-b border-blue-50 pb-3 shrink-0">
                      <div className="flex items-center gap-2">
                        <span className={cn("w-2 h-2 rounded-full", 
                          col.id === 'PENDING' ? 'bg-amber-400' :
                          col.id === 'CONFIRMED' ? 'bg-green-400' :
                          col.id === 'RESCHEDULED' ? 'bg-indigo-400' :
                          col.id === 'CANCELLED' ? 'bg-red-400' : 'bg-blue-400'
                        )} />
                        <h4 className="font-extrabold text-sm text-foreground tracking-tight">{col.title}</h4>
                      </div>
                      <Badge variant="outline" className="font-bold rounded-full bg-muted/50">{colApts.length}</Badge>
                    </div>

                    <div className="space-y-4 overflow-y-auto flex-1 pr-1 min-h-0">
                      {colApts.length === 0 ? (
                        <div className="h-32 flex items-center justify-center border border-dashed border-border rounded-2xl text-center text-xs text-muted-foreground italic font-medium">
                          No items here
                        </div>
                      ) : (
                        colApts.map((apt) => (
                          <div
                            key={apt.id}
                            className="bg-[#f8fafc] border border-blue-50/80 hover:border-blue-300 hover:bg-white rounded-2xl p-4 transition-all shadow-sm hover:shadow-md flex flex-col gap-3 group relative cursor-pointer"
                            onClick={() => { setSelectedPatient(apt); setIsPatientModalOpen(true); }}
                          >
                            <div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">PID: {apt.id.slice(-8)}</div>
                                {apt.reschedule_request && (
                                  <span className="bg-amber-100 text-amber-800 border border-amber-250 text-[8px] font-black uppercase px-1.5 py-0.5 rounded-md leading-none animate-pulse">
                                    Reschedule Req
                                  </span>
                                )}
                              </div>
                              <h5 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors mt-0.5">{apt.name}</h5>
                            </div>

                            <div className="text-xs text-muted-foreground font-semibold leading-relaxed">
                              <div>{formatApptDateTime(apt.date, apt.time)}</div>
                              <div className="text-secondary mt-1">{apt.service}</div>
                            </div>

                            {apt.consultation_notes && (
                              <div className="text-[10px] text-muted-foreground italic bg-background/50 border border-border/40 p-2 rounded-xl mt-1 line-clamp-2">
                                Note: {apt.consultation_notes}
                              </div>
                            )}

                            <div className="pt-2 border-t border-border/40 mt-1 flex items-center justify-between gap-2" onClick={(e) => e.stopPropagation()}>
                              <span className="text-[8px] font-bold uppercase text-muted-foreground tracking-wider">Move:</span>
                              <select
                                value={apt.status || 'PENDING'}
                                onChange={(e) => handleDynamicStatusChange(apt.id, e.target.value)}
                                className="bg-background border border-border text-foreground px-2 py-1 rounded-lg font-bold text-[10px] outline-none focus:ring-1 focus:ring-primary w-24"
                              >
                                <option value="PENDING">PENDING</option>
                                <option value="CONFIRMED">CONFIRMED</option>
                                <option value="RESCHEDULED">RESCHEDULED</option>
                                <option value="CANCELLED">CANCELLED</option>
                                <option value="COMPLETED">COMPLETED</option>
                              </select>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : viewType === "reviews" ? (
            /* REVIEWS & FEEDBACK VIEW */
            <div className="space-y-6">
              {loadingFeedbacks ? (
                <div className="flex flex-col items-center justify-center py-20 opacity-50">
                  <Loader2 className="w-10 h-10 text-primary animate-spin mb-3" />
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Loading Reviews...</span>
                </div>
              ) : feedbacks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="bg-blue-50 p-6 rounded-full mb-4">
                    <MessageSquare className="w-12 h-12 text-blue-500" />
                  </div>
                  <h4 className="text-lg font-extrabold text-slate-800">No Patient Reviews Yet</h4>
                  <p className="text-xs text-slate-500 max-w-xs mt-1">Feedback messages submitted through the testimonial form will appear here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {feedbacks.map((fb) => (
                    <motion.div
                      key={fb.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white border border-blue-100 rounded-[2rem] p-6 shadow-md shadow-blue-900/5 hover:border-blue-200 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  "w-4 h-4",
                                  i < fb.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"
                                )}
                              />
                            ))}
                          </div>
                          <Badge className="bg-slate-50 text-slate-500 border border-slate-100 text-[8px] font-mono tracking-wider">
                            {formatCreatedTime(fb.created_at)}
                          </Badge>
                        </div>

                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                          Patient: <span className="text-slate-800 font-extrabold normal-case">{fb.name || "Anonymous"}</span>
                        </p>
                        
                        <p className="text-sm font-medium text-slate-600 italic bg-[#f8fafc] p-4 rounded-2xl border border-blue-50/50 mt-3 relative min-h-[80px]">
                          "{fb.feedback || "No comment left."}"
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-50">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                          Source: {fb.source || "Google Review System"}
                        </span>
                        
                        <Button
                          variant="ghost"
                          onClick={async () => {
                            const res = await deleteAdminFeedback(fb.id);
                            if (res.success) {
                              toast.success("Review deleted successfully!");
                              fetchFeedbacks();
                            } else {
                              toast.error("Failed to delete review.");
                            }
                          }}
                          className="h-8 w-8 p-0 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                          title="Delete Review"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* GRID VIEW (DEFAULT) */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredAppointments.map((apt) => (
                <motion.div
                  key={apt.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group"
                >
                  <Card className="bg-white border border-blue-100/60 rounded-[2.5rem] overflow-hidden shadow-lg shadow-blue-900/5 hover:border-blue-200/80 transition-all flex flex-col justify-between h-full group-hover:-translate-y-1 duration-300">
                    <CardHeader
                      className="p-8 pb-4 flex flex-row items-center justify-between cursor-pointer"
                      onClick={() => { setSelectedPatient(apt); setIsPatientModalOpen(true); }}
                    >
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <Badge className="bg-blue-50 text-blue-600 border border-blue-100 text-[9px] font-mono tracking-widest uppercase py-1 px-3 rounded-lg">PID: {apt.id.slice(-8)}</Badge>
                          {apt.reschedule_request && (
                            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border border-amber-200 text-[9px] font-bold uppercase py-1 px-3 rounded-lg animate-pulse">
                              ⚠️ Reschedule Requested
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-xl font-extrabold text-blue-600 underline leading-none group-hover:text-blue-700 transition-colors">{apt.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="p-8 pt-0 space-y-6">
                      <div className="bg-[#f8fafc] p-4 rounded-2xl border border-blue-50/50 w-full">
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-blue-500" /> Schedule Slot
                        </p>
                        <p className="text-sm font-black text-slate-800">
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
                    <CardFooter className="p-4 border-t border-blue-50 bg-[#f8fafc]/60 flex items-center justify-between gap-4">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
                        Status:
                      </span>
                      <select
                        value={apt.status || 'PENDING'}
                        onChange={(e) => handleDynamicStatusChange(apt.id, e.target.value)}
                        className="bg-background border border-border text-foreground px-3 py-1.5 rounded-xl font-bold text-xs outline-none focus:ring-1 focus:ring-primary w-32 text-center"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="RESCHEDULED">RESCHEDULED</option>
                        <option value="CANCELLED">CANCELLED</option>
                        <option value="COMPLETED">COMPLETED</option>
                      </select>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Global Push Broadcast Dialog */}
      <Dialog open={isPushDialogOpen} onOpenChange={handlePushDialogClose}>
        <DialogContent className="rounded-[2.5rem] p-5 sm:p-10 w-[95vw] sm:w-full max-w-4xl max-h-[90vh] overflow-y-auto border-none shadow-2xl">
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
                  onChange={(e) => setPushData({ ...pushData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">Message Content</Label>
                <textarea
                  placeholder="Describe your announcement..."
                  className="w-full min-h-[100px] rounded-2xl border border-border bg-muted/30 p-6 focus:bg-background focus:ring-primary shadow-sm font-medium text-sm outline-none transition-all"
                  value={pushData.body}
                  onChange={(e) => setPushData({ ...pushData, body: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-2">Redirect URL / Feedback Link</Label>
                <Input
                  placeholder="https://dr-kanaks-clinic.netlify.app/feedback"
                  className="h-14 rounded-2xl border-border bg-muted/30 pl-6 focus:bg-background focus:ring-primary shadow-sm"
                  value={pushData.url}
                  onChange={(e) => setPushData({ ...pushData, url: e.target.value })}
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
                    onChange={(e) => setPushData({ ...pushData, image: e.target.value })}
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
                  onChange={(e) => setPushData({ ...pushData, send_native_push: e.target.value === "both" })}
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
      <Dialog open={isPatientModalOpen} onOpenChange={(open) => { setIsPatientModalOpen(open); if (!open) setSelectedPatient(null); }}>
        <DialogContent className="rounded-[2.5rem] p-5 sm:p-10 w-[95vw] sm:w-full max-w-4xl max-h-[90vh] overflow-y-auto border-none shadow-2xl bg-card">
          <DialogHeader>
            <DialogTitle className="text-2xl font-extrabold text-foreground mb-2">Patient Profile Details</DialogTitle>
            <DialogDescription className="text-muted-foreground font-medium">
              Comprehensive personal booking records and clinical actions for this patient.
            </DialogDescription>
          </DialogHeader>

          {selectedPatient && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 text-left">
              {/* Left Column: Patient Profile Details */}
              <div className="space-y-5">
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
                  <p className="text-sm text-muted-foreground bg-muted/40 p-4 rounded-2xl border border-border font-medium italic whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto">
                    {selectedPatient.message || "No message provided."}
                  </p>
                </div>
              </div>

              {/* Right Column: Doctor Actions */}
              <div className="space-y-4 md:border-l border-slate-100 dark:border-slate-800 md:pl-8 pt-6 md:pt-0">
                <h4 className="font-extrabold text-sm uppercase tracking-wider text-primary">Doctor Clinical Actions</h4>
                
                {selectedPatient.reschedule_request && (
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-amber-700 block mb-1">⚠️ Patient Reschedule Request</span>
                    <p className="text-xs font-semibold text-amber-900 italic">"{selectedPatient.reschedule_request}"</p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1.5">Update Status</Label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="flex h-12 w-full rounded-xl border border-border bg-muted/30 px-3 focus:bg-background focus:ring-primary shadow-sm font-bold text-xs outline-none"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="RESCHEDULED">RESCHEDULED</option>
                      <option value="CANCELLED">CANCELLED</option>
                      <option value="COMPLETED">COMPLETED</option>
                    </select>
                  </div>
                  <div>
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1.5">Re-plan / Suggestion</Label>
                    <Input
                      value={editSuggestion}
                      onChange={(e) => setEditSuggestion(e.target.value)}
                      placeholder="e.g. Next Mon"
                      className="h-12 rounded-xl border-border bg-muted/30 pl-3 focus:bg-background focus:ring-primary shadow-sm text-xs font-bold"
                    />
                  </div>
                </div>

                {(editStatus === 'CANCELLED' || editStatus === 'RESCHEDULED' || selectedPatient.reschedule_request) && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1.5">Reschedule Date</Label>
                      <Input
                        type="date"
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                        className="h-12 rounded-xl border-border bg-muted/30 pl-3 focus:bg-background focus:ring-primary shadow-sm text-xs font-bold text-foreground"
                      />
                    </div>
                    <div>
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1.5">Reschedule Time</Label>
                      <Input
                        type="time"
                        value={editTime}
                        onChange={(e) => setEditTime(e.target.value)}
                        className="h-12 rounded-xl border-border bg-muted/30 px-3 focus:bg-background focus:ring-primary shadow-sm text-xs font-bold text-foreground"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1.5">Clinical Reason / Visit Guidance Notes (Public)</Label>
                  <textarea
                    value={editReason}
                    onChange={(e) => setEditReason(e.target.value)}
                    placeholder="Enter clinical notes, guidance or reasons..."
                    className="w-full min-h-[70px] rounded-xl border border-border bg-muted/30 p-3 focus:bg-background focus:ring-primary shadow-sm font-medium text-xs outline-none transition-all text-foreground resize-none"
                  />
                </div>

                <div>
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-1.5">Private Reference Notes (For Doctor Reference Only)</Label>
                  <textarea
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Enter private reference notes, medical history summaries or diagnostic remarks..."
                    className="w-full min-h-[70px] rounded-xl border border-border bg-muted/30 p-3 focus:bg-background focus:ring-primary shadow-sm font-medium text-xs outline-none transition-all text-foreground resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="mt-8 gap-3 flex-col sm:flex-row border-t border-slate-100 dark:border-slate-800 pt-6">
            <Button 
              variant="outline"
              className="rounded-full h-12 flex-1 font-bold" 
              onClick={() => setIsPatientModalOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              className="rounded-full h-12 flex-1 font-bold bg-primary hover:bg-primary/90 flex items-center justify-center gap-2" 
              onClick={handleSavePatientInfo}
              disabled={isSavingPatientInfo}
            >
              {isSavingPatientInfo && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Updates
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Clinic Hours Editor Dialog */}
      <Dialog open={isHoursDialogOpen} onOpenChange={setIsHoursDialogOpen}>
        <DialogContent className="rounded-[2.5rem] p-5 sm:p-10 w-[95vw] sm:w-full max-w-md max-h-[90vh] overflow-y-auto border-none shadow-2xl">
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

      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <DialogContent className="rounded-[2.5rem] p-6 sm:p-10 w-[95vw] sm:w-full max-w-md border-none shadow-2xl bg-card">
          <DialogHeader>
            <DialogTitle className="text-2xl font-extrabold text-foreground mb-2 flex items-center gap-2">
              <LogOut className="w-6 h-6 text-red-500" />
              Confirm Admin Logout?
            </DialogTitle>
            <DialogDescription className="text-slate-500 font-medium leading-relaxed">
              Are you sure you want to log out of your administrative session? You will need to authenticate again to access clinical records.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 gap-3 flex flex-col sm:flex-row">
            <Button
              variant="outline"
              className="rounded-full h-12 flex-1 font-bold border-slate-200"
              onClick={() => setShowLogoutConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              className="rounded-full h-12 flex-1 font-bold bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20"
              onClick={() => {
                setShowLogoutConfirm(false);
                handleLogout();
              }}
            >
              Confirm Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPanel;
