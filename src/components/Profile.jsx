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
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { getUserAppointments, API_URL } from '../services/api';

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

const Profile = () => {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

      setAppointments(result.data);
      localStorage.setItem('clinic_appointments', JSON.stringify(result.data));
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setAppointments([]);
    toast.success("Logged Out Successfully. Your clinical session has been completely reset for your security.", {
      icon: "🔒"
    });
    navigate('/');
  };

  if (!user) return null;

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

        <div className="grid lg:grid-cols-4 gap-8">
          {/* User Info Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
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
                              <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                                <CalendarCheck className="w-4 h-4 text-slate-400" />
                                {apt.date}
                              </div>
                              <div className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300 mt-1">
                                <Clock className="w-4 h-4 text-slate-400" />
                                {apt.time}
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
                              <Button variant="ghost" size="icon" className="rounded-xl h-12 w-12 bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:bg-primary/5 text-slate-400 hover:text-primary transition-colors">
                                <ExternalLink className="w-5 h-5" />
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
                                    {apt.status === 'CONFIRMED' ? "Visit Guidance:" : "Clinical Reason:"}
                                  </p>
                                  {apt.cancel_reason || (
                                    apt.status === 'CONFIRMED'
                                      ? "Your clinical session has been officially confirmed. Please arrive 10 mins prior."
                                      : "This session has been cancelled by the clinical board."
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
    </section>
  );
};

export default Profile;
