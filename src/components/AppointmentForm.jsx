import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Clock,
  Stethoscope,
  User,
  Phone,
  CheckCircle2,
  Loader2,
  CalendarCheck,
  ShieldCheck
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";

import { 
  checkUser, 
  createUser, 
  bookAppointmentWithPayment 
} from '../services/api';

const serviceOptions = [
  'Hair Transplantation', 'Laser Hair Removal', 'PRP / GFC Hair Therapy',
  'Acne & Scar Treatment', 'Q-Switch ND Yag Laser', 'Dermal Fillers & Botox',
  'General Skin Consultation',
];

const AppointmentForm = ({ onSuccess }) => {
  const [date, setDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentStep, setPaymentStep] = useState(null); // null | 'submitting' | 'confirmed'
  const [turnstileToken, setTurnstileToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkTurnstile = setInterval(() => {
      if (window.turnstile) {
        clearInterval(checkTurnstile);
        window.turnstile.render("#turnstile-container", {
          sitekey: "0x4AAAAAAD1KgGwMC0H6cdla",
          callback: (token) => {
            setTurnstileToken(token);
          },
          "expired-callback": () => {
            setTurnstileToken(null);
          },
          "error-callback": () => {
            setTurnstileToken(null);
          }
        });
      }
    }, 100);
    return () => clearInterval(checkTurnstile);
  }, []);

  // Static standard clinical hours
  const availableSlots = [
    '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', 
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', 
    '06:00 PM', '07:00 PM'
  ];

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    time: '',
    service: '',
    message: '',
  });

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('clinic_user'));
    if (savedUser) {
      setFormData(prev => ({
        ...prev,
        name: savedUser.name || '',
        phone: savedUser.phone || '',
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const cleanValue = name === 'phone' ? value.replace(/\D/g, '') : value;
    setFormData(prev => ({ ...prev, [name]: cleanValue }));

    if (name === 'phone' && cleanValue.length === 10) {
      handleCheckUser(cleanValue);
    }
  };

  const handleCheckUser = async (phone) => {
    try {
      const response = await checkUser(phone);
      if (response.success && response.user) {
        setFormData(prev => ({ ...prev, name: response.user.name || prev.name }));
        localStorage.setItem('clinic_user', JSON.stringify({
          id: response.user.id,
          name: response.user.name,
          phone: response.user.phone
        }));
        toast.success(`Welcome back, ${response.user.name}!`);
      }
    } catch (error) {
      console.error('Error checking user:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !date || !formData.time || !formData.service) {
      toast.error("Please provide all required information.");
      return;
    }

    if (!turnstileToken) {
      toast.error("Please complete the security challenge verification.");
      return;
    }

    setLoading(true);
    setPaymentStep('submitting');

    try {
      // Sync user profile
      try {
        const checkRes = await checkUser(formData.phone);
        if (!checkRes.success || !checkRes.user) {
          const createRes = await createUser(formData.name, formData.phone);
          if (createRes.success && createRes.user?.id) {
            localStorage.setItem('clinic_user', JSON.stringify({ id: createRes.user.id, name: formData.name, phone: formData.phone }));
          }
        } else {
          localStorage.setItem('clinic_user', JSON.stringify({ id: checkRes.user.id, name: checkRes.user.name || formData.name, phone: formData.phone }));
        }
      } catch (userErr) {
        console.warn('User sync skipped:', userErr?.message);
      }

      const formattedDate = format(date, "yyyy-MM-dd");

      // Book appointment (calls simplified backend /api/book flow)
      const bookRes = await bookAppointmentWithPayment({
        name: formData.name,
        phone: formData.phone,
        appointment_date: formattedDate,
        appointment_time: formData.time,
        service: formData.service,
        message: formData.message,
        turnstile_token: turnstileToken,
      });

      if (!bookRes.success) {
        toast.error(bookRes.error || "Booking failed. Please try again.");
        setLoading(false);
        setPaymentStep(null);
        return;
      }

      // Success
      setPaymentStep('confirmed');
      
      // Save locally
      const newApt = {
        id: bookRes.data.appointment_id,
        service: formData.service,
        date: formattedDate,
        time: formData.time,
        token: bookRes.data.token,
        status: 'PENDING',
      };
      
      const existingApts = JSON.parse(localStorage.getItem('clinic_appointments')) || [];
      localStorage.setItem('clinic_appointments', JSON.stringify([...existingApts, newApt]));

      toast.success(`Booking Request Submitted! Token: ${bookRes.data.token}`);
      window.dispatchEvent(new Event('triggerPushPrompt'));
      
      if (onSuccess) onSuccess();
      setTimeout(() => navigate('/profile'), 2500);

    } catch (error) {
      toast.error("Booking Error: Please try again.");
      console.error('Appointment booking error:', error);
      setLoading(false);
      setPaymentStep(null);
    }
  };

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="bg-slate-900 text-white p-6 sm:p-10 pb-16 rounded-b-[3rem] sm:rounded-b-[4rem]">
        <CardTitle className="text-xl sm:text-2xl font-bold mb-1">Request An Appointment</CardTitle>
        <CardDescription className="text-slate-400 font-medium text-xs sm:text-sm">
          Select your preferred treatment and time slot.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 sm:p-10 -mt-10 bg-card rounded-t-[2.5rem] relative z-20">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Phone Number (Required first)</Label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  placeholder="Enter 10-digit mobile number" 
                  className="pl-12 h-12 rounded-xl text-sm" 
                  maxLength={10}
                  required 
                />
              </div>
            </div>

            <AnimatePresence initial={false}>
              {formData.phone.length === 10 && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-1.5 overflow-hidden"
                >
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Name</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      placeholder="Enter Full Name" 
                      className="pl-12 h-12 rounded-xl text-sm" 
                      required 
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button type="button" variant="outline" className={cn("w-full h-12 justify-start text-left font-normal rounded-xl border-border bg-muted/50 pl-4 text-sm", !date && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-2xl shadow-2xl border-none">
                  <Calendar mode="single" selected={date} onSelect={setDate} disabled={(d) => d < new Date().setHours(0, 0, 0, 0)} className="p-3" />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Slot</Label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <select name="time" value={formData.time} onChange={handleChange} className="flex h-12 w-full rounded-xl border border-border bg-muted/50 pl-12 pr-4 text-sm appearance-none" required>
                  <option value="" disabled>Select Time</option>
                  {availableSlots.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Service</Label>
            <div className="relative">
              <Stethoscope className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <select name="service" value={formData.service} onChange={handleChange} className="flex h-12 w-full rounded-xl border border-border bg-muted/50 pl-12 pr-4 text-sm appearance-none" required>
                <option value="" disabled>Choose Therapy</option>
                {serviceOptions.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Message (Optional)</Label>
            <Textarea name="message" value={formData.message} onChange={handleChange} placeholder="Brief on concerns..." className="min-h-[80px] rounded-xl text-sm" />
          </div>

          <div id="turnstile-container" className="my-4 flex justify-center min-h-[65px]"></div>

          <div className="space-y-3 pt-2">
            <Button
              type="submit"
              disabled={loading || paymentStep === 'confirmed'}
              className="w-full h-14 rounded-xl text-base font-bold shadow-lg shadow-primary/20 bg-primary hover:bg-primary/95"
            >
              {paymentStep === 'submitting' ? (
                <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Submitting Request...</>
              ) : paymentStep === 'confirmed' ? (
                <><CheckCircle2 className="w-5 h-5 mr-2 text-green-300" /> Request Confirmed! Redirecting...</>
              ) : (
                <><CalendarCheck className="w-5 h-5 mr-2" /> Confirm Booking Request</>
              )}
            </Button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              <span>We will review your request and get in touch with you shortly.</span>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AppointmentForm;
