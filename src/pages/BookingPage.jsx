import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ShieldCheck, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppointmentForm from "../components/AppointmentForm";

const BookingPage = () => {
  const navigate = useNavigate();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background pb-20 pt-32">
       <div className="container mx-auto px-4">
          
          {/* Back Button & Header */}
          <div className="max-w-3xl mx-auto mb-12">
             <motion.div
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
             >
                <Button 
                  variant="ghost" 
                  onClick={() => navigate(-1)} 
                  className="mb-8 hover:bg-primary/5 hover:text-primary transition-colors pl-0 pr-6 group"
                >
                  <ArrowLeft className="mr-2 w-5 h-5 transition-transform group-hover:-translate-x-1" />
                  Back to Previous
                </Button>
             </motion.div>

             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 }}
               className="space-y-4"
             >
                <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 w-fit rounded-full mb-2">
                   <ShieldCheck className="w-4 h-4 text-primary" />
                   <span className="text-[10px] font-black text-primary uppercase tracking-widest">Secure Clinical Booking</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
                  Schedule Your <br />
                  <span className="text-primary italic">Priority Consultation</span>
                </h1>
                <p className="text-lg text-muted-foreground font-medium leading-relaxed max-w-xl">
                  Take the first step towards your transformation. Please provide your clinical requirements below to request a session with Dr. Kanagaraj.
                </p>
             </motion.div>
          </div>

          {/* Booking Form Card */}
          <div className="max-w-3xl mx-auto">
             <motion.div
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: 0.2 }}
               className="bg-card rounded-[3rem] shadow-2xl border border-border overflow-hidden"
             >
                <AppointmentForm onSuccess={() => setTimeout(() => navigate('/profile'), 3000)} />
             </motion.div>

             {/* Booking Help Footer */}
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.5 }}
               className="mt-12 flex flex-col md:flex-row items-center justify-between gap-8 p-10 bg-primary/5 rounded-[2.5rem] border border-primary/10"
             >
                <div className="flex gap-6 items-center">
                   <div className="w-14 h-14 bg-white rounded-2xl shadow-xl flex items-center justify-center">
                      <Phone className="w-6 h-6 text-primary" />
                   </div>
                   <div>
                      <p className="text-sm font-black text-foreground uppercase tracking-widest mb-1">Assisted Booking</p>
                      <p className="text-xs text-muted-foreground font-medium italic">Speak with our coordinator for urgent timing.</p>
                   </div>
                </div>
                <Button variant="link" className="text-xl font-black text-primary p-0" asChild>
                   <a href="tel:+919750451176">+91 97504 51176</a>
                </Button>
             </motion.div>
          </div>

       </div>
    </div>
  );
};

export default BookingPage;
