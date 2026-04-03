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
  ArrowRight,
  CreditCard,
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
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";

import { 
  bookAppointment, 
  checkUser, 
  createUser, 
  bookAppointmentWithPayment, 
  verifyPayment, 
  API_URL 
} from '../services/api';

const serviceOptions = [
  'Hair Transplantation', 'Laser Hair Removal', 'PRP / GFC Hair Therapy',
  'Acne & Scar Treatment', 'Q-Switch ND Yag Laser', 'Dermal Fillers & Botox',
  'General Skin Consultation',
];

const AppointmentForm = ({ onSuccess }) => {
  const [date, setDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [paymentStep, setPaymentStep] = useState(null); // null | 'creating_order' | 'payment_open' | 'verifying' | 'confirmed'
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const res = await fetch(`${API_URL}/api/active-slots`);
        const data = await res.json();
        if (data.status === 'success') {
          setAvailableSlots(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch slots", err);
        // Fallback slots
        setAvailableSlots(['10:30 AM', '11:30 AM', '12:30 PM', '02:00 PM', '03:30 PM', '05:00 PM', '06:30 PM']);
      }
    };
    fetchSlots();
  }, []);

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
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'phone' && value.replace(/\s/g, '').length === 10) {
      handleCheckUser(value.replace(/\s/g, ''));
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

  const convertTo24Hour = (timeStr) => {
    let [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') hours = '00';
    if (modifier === 'PM') hours = parseInt(hours, 10) + 12;
    return `${String(hours).padStart(2, '0')}:${minutes}`;
  };

  const openRazorpay = (orderData, appointmentId, userName, userPhone) => {
    const rzp = new window.Razorpay({
      key: orderData.key,
      order_id: orderData.order_id,
      amount: orderData.amount,
      currency: orderData.currency || 'INR',
      name: "Dr. Kanak's Clinic",
      description: "Appointment Booking (₹100 Consultation Fee)",
      image: "/favicon.svg",
      prefill: {
        name: userName,
        contact: userPhone,
      },
      theme: { color: "#863bff" },
      modal: {
        ondismiss: () => {
          toast("Payment cancelled. Your slot has not been booked.", { icon: "⚠️" });
          setLoading(false);
          setPaymentStep(null);
        }
      },
      handler: async (response) => {
        setPaymentStep('verifying');
        try {
          const verifyRes = await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            appointment_id: appointmentId,
          });

          if (verifyRes.success) {
            setPaymentStep('confirmed');
            const newApt = {
              id: appointmentId,
              service: formData.service,
              date: format(date, "yyyy-MM-dd"),
              time: formData.time,
              token: orderData.token, // Store the generated token
              status: 'CONFIRMED',
              payment_id: response.razorpay_payment_id,
            };
            const existingApts = JSON.parse(localStorage.getItem('clinic_appointments')) || [];
            localStorage.setItem('clinic_appointments', JSON.stringify([...existingApts, newApt]));

            toast.success(`✅ Confirmed! Your Token is ${orderData.token}`);
            window.dispatchEvent(new Event('triggerPushPrompt'));
            if (onSuccess) onSuccess();
            setTimeout(() => navigate('/profile'), 2500);
          } else {
            toast.error(`❌ Payment verification failed: ${verifyRes.message}`);
            setPaymentStep(null);
            setLoading(false);
          }
        } catch (err) {
          toast.error("Verification error. Please contact us if amount was deducted.");
          setPaymentStep(null);
          setLoading(false);
        }
      }
    });
    rzp.open();
    setPaymentStep('payment_open');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !date || !formData.time || !formData.service) {
      toast.error("Please provide all required information.");
      return;
    }

    setLoading(true);
    setPaymentStep('creating_order');

    try {
      // Attempt to register/verify user — non-blocking, payment proceeds regardless
      try {
        const checkRes = await checkUser(formData.phone);
        if (!checkRes.success || !checkRes.user) {
          const createRes = await createUser(formData.name, formData.phone);
          if (createRes.success && createRes.user?.id) {
            localStorage.setItem('clinic_user', JSON.stringify({ id: createRes.user.id, name: formData.name, phone: formData.phone }));
          }
          // If "already exists", user is in the system — no action needed
        } else {
          localStorage.setItem('clinic_user', JSON.stringify({ id: checkRes.user.id, name: checkRes.user.name || formData.name, phone: formData.phone }));
        }
      } catch (userErr) {
        // Non-critical — user management failure should not block booking
        console.warn('User sync skipped:', userErr?.message);
      }

      const formattedDate = format(date, "yyyy-MM-dd");

      // Step 1: Call /api/book to create Razorpay order
      const bookRes = await bookAppointmentWithPayment({
        name: formData.name,
        phone: formData.phone,
        appointment_date: formattedDate,
        appointment_time: formData.time, // 12-hour "HH:MM AM/PM"
        service: formData.service,
        message: formData.message,
      });

      if (!bookRes.success) {
        // Handle slot conflict
        if (bookRes.status === 409) {
          toast.error("⚠️ This time slot is already booked. Please choose a different slot.");
        } else {
          toast.error(bookRes.error || "Booking failed. Please try again.");
        }
        setLoading(false);
        setPaymentStep(null);
        return;
      }

      // Step 2: Open Razorpay checkout with order details
      openRazorpay(bookRes.data, bookRes.data.appointment_id, formData.name, formData.phone);

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
        <CardTitle className="text-xl sm:text-2xl font-bold mb-1">Book Priority Access</CardTitle>
        <CardDescription className="text-slate-400 font-medium text-xs sm:text-sm">
          Select your preferred treatment and time slot.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 sm:p-10 -mt-10 bg-card rounded-t-[2.5rem] relative z-20">
        <form className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Name</Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className="pl-12 h-12 rounded-xl text-sm" required />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Phone</Label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="9876543210" className="pl-12 h-12 rounded-xl text-sm" required />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full h-12 justify-start text-left font-normal rounded-xl border-border bg-muted/50 pl-4 text-sm", !date && "text-muted-foreground")}>
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
                  {availableSlots.map(s => <option key={s.time} value={s.time}>{s.time}</option>)}
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

          <div className="space-y-3 pt-2">
            <Button
              onClick={handleSubmit}
              disabled={loading || paymentStep === 'confirmed'}
              className="w-full h-14 rounded-xl text-base font-bold shadow-lg shadow-primary/20 bg-primary hover:bg-primary/95"
            >
              {paymentStep === 'creating_order' ? (
                <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Checking Availability...</>
              ) : paymentStep === 'verifying' ? (
                <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Verifying Payment...</>
              ) : paymentStep === 'confirmed' ? (
                <><CheckCircle2 className="w-5 h-5 mr-2 text-green-300" /> Confirmed! Redirecting...</>
              ) : (
                <><CreditCard className="w-5 h-5 mr-2" /> Pay ₹100 & Confirm Booking</>
              )}
            </Button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
              <span>Secured by <strong>Razorpay</strong> · ₹100 Consultation Fee · Refundable on cancellation</span>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AppointmentForm;
