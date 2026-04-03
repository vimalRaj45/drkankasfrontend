import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Stethoscope, 
  User, 
  Phone, 
  MessageSquare, 
  CheckCircle2, 
  Loader2, 
  ArrowRight,
  ShieldCheck,
  Star,
  Users,
  Award
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
import { Badge } from "@/components/ui/badge";
import { toast } from "react-toastify";

// Existing API services
import { bookAppointment, checkUser, createUser } from '../services/api';

const timeSlots = [
  '10:30 AM', '11:30 AM', '12:30 PM', '02:00 PM', '03:30 PM', '05:00 PM', '06:30 PM',
];

const serviceOptions = [
  'Hair Transplantation', 'Laser Hair Removal', 'PRP / GFC Hair Therapy', 
  'Acne & Scar Treatment', 'Q-Switch ND Yag Laser', 'Dermal Fillers & Botox', 
  'General Skin Consultation',
];

import AppointmentForm from "./AppointmentForm";

const Appointment = () => {
  return (
    <section id="appointment" className="py-24 bg-background border-t border-border relative overflow-hidden scroll-mt-20">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          {/* Left Column: Info & Trust */}
          <div className="lg:w-1/2 w-full">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Badge variant="outline" className="text-secondary border-secondary/20 font-bold bg-secondary/5 mb-6 py-2 px-4 rounded-full">
                Priority Booking Access
              </Badge>
              
              <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-8 leading-tight">
                Experience Advanced <br />
                <span className="text-primary underline decoration-primary/10 underline-offset-8">Clinical Treatment</span>
              </h2>
              
              <p className="text-lg text-muted-foreground mb-10 leading-relaxed font-medium">
                Skip the long queues and secure your health consultation today. Our medical team ensures a seamless experience from booking to recovery.
              </p>

              {/* Trust Cards */}
              <div className="grid sm:grid-cols-2 gap-6 mb-12">
                <div className="bg-card p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-border flex items-center gap-4 transition-transform hover:scale-105">
                  <div className="bg-primary/10 p-4 rounded-2xl text-primary font-bold">
                    <Star className="w-6 h-6 fill-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">4.9/5</p>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Patient Rating</p>
                  </div>
                </div>
                <div className="bg-card p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-border flex items-center gap-4 transition-transform hover:scale-105">
                  <div className="bg-secondary/10 p-4 rounded-2xl text-secondary font-bold">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">25k+</p>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Global Users</p>
                  </div>
                </div>
              </div>

              {/* Contact Hint */}
              <div className="bg-primary/5 p-8 rounded-[2.5rem] border border-primary/10 relative overflow-hidden group">
                <div className="relative z-10">
                  <h4 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <Phone className="w-5 h-5 text-primary" />
                    Need Immediate Assistance?
                  </h4>
                  <p className="text-sm text-slate-600 mb-6 font-medium">Talk to our medical coordinators directly for urgent requirements.</p>
                  <Button variant="link" className="p-0 text-primary font-extrabold text-xl hover:scale-105 transition-transform" asChild>
                    <a href="tel:+919750451176">+91 97504 51176</a>
                  </Button>
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:rotate-12 transition-transform">
                  <ShieldCheck className="w-48 h-48 text-primary" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Appointment Form */}
          <div className="lg:w-1/2 w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-card rounded-[3rem] shadow-2xl border border-border overflow-hidden"
            >
              <AppointmentForm />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-full h-full opacity-[0.03] select-none pointer-events-none -z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary rounded-full blur-[120px]" />
      </div>
    </section>
  );
};

export default Appointment;
