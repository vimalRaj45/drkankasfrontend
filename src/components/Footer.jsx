import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Heart, 
  Instagram, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Youtube, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Award, 
  Star,
  ArrowRight,
  Send,
  CalendarCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import Logo from "../assets/dr_kanaks_logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 pt-14 sm:pt-24 pb-8 sm:pb-12 relative overflow-hidden border-t border-white/5">
      {/* Background Decorative Element */}
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[100px] -z-0" />
      <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-[100px] -z-0" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-16 mb-12 lg:mb-24">
          
          {/* Brand & Mission Column */}
          <div className="lg:col-span-1 space-y-8">
            <Link to="/" className="flex items-center gap-3 decoration-none group">
              <div className="bg-white p-1 rounded-xl shadow-xl transition-transform group-hover:scale-110 border border-white/10">
                <img src={Logo} className="w-8 h-8 object-contain" alt="Dr. Kanak's Clinic" />
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tighter">
                Dr. Kanak's <br />
                <span className="text-xs text-primary font-bold uppercase tracking-widest leading-none block mt-1">Speciality Clinic</span>
              </span>
            </Link>
            
            <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-xs italic">
              "Pioneering world-class clinical excellence in dermatology and hair restoration since 2014. Committed to delivering safe, effective and personalized patient care."
            </p>

            <div className="flex gap-4">
              <Button size="icon" variant="ghost" className="rounded-full h-11 w-11 bg-white/5 text-slate-300 border border-white/10 hover:bg-white hover:text-slate-900 hover:shadow-xl transition-all">
                <Instagram className="w-5 h-5" />
              </Button>
              <Button size="icon" variant="ghost" className="rounded-full h-11 w-11 bg-white/5 text-slate-300 border border-white/10 hover:bg-white hover:text-slate-900 hover:shadow-xl transition-all">
                <Youtube className="w-5 h-5" />
              </Button>
              <Button size="icon" variant="ghost" className="rounded-full h-11 w-11 bg-white/5 text-slate-300 border border-white/10 hover:bg-white hover:text-slate-900 hover:shadow-xl transition-all">
                <Linkedin className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Quick Nav Links Column */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-bold text-white mb-8 border-l-2 border-primary pl-4 tracking-tighter uppercase tracking-widest text-xs">Medical Directory</h4>
            <nav className="flex flex-col gap-5">
              {[
                { name: "Home", path: "/" },
                { name: "About Us", path: "/about" },
                { name: "Services", path: "/services" },
                { name: "Our Doctors", path: "/doctors" },
                { name: "Book Appointment", path: "/book" },
                { name: "Contact Us", path: "/contact" }
              ].map(link => (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  className="text-slate-400 text-sm font-bold hover:text-primary hover:translate-x-1 transition-all decoration-none flex items-center gap-2 group"
                >
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Clinical Locations / Support Column */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-bold text-white mb-8 border-l-2 border-secondary pl-4 tracking-tighter uppercase tracking-widest text-xs">Patient Concierge</h4>
            <div className="space-y-6">
              <div className="flex items-start gap-4 text-slate-400">
                <Phone className="w-5 h-5 text-secondary mt-1" />
                <div className="text-sm font-medium">
                  <p className="text-white font-bold mb-1">Clinic Support</p>
                  <p>+91 97504 51176</p>
                </div>
              </div>
              <div className="flex items-start gap-4 text-slate-400">
                <MapPin className="w-5 h-5 text-secondary mt-1" />
                <div className="text-sm font-medium">
                  <p className="text-white font-bold mb-1">Clinic Address</p>
                  <p>1/11A-3, Anna Salai, Swarnapuri,</p>
                  <p>Salem, Tamil Nadu 636004</p>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter / CTA Column */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-bold text-white mb-8 border-l-2 border-amber-500 pl-4 tracking-tighter uppercase tracking-widest text-xs">Clinical Bulletin</h4>
            <p className="text-slate-400 text-sm font-medium mb-6 leading-relaxed italic">
              Subscribe to receive exclusive healthcare tips and priority update on clinical camps.
            </p>
            <div className="relative mb-6">
              <Input 
                placeholder="Email Address" 
                className="h-14 rounded-2xl bg-white/5 border border-white/10 pl-6 text-white text-sm focus:ring-primary shadow-xl"
              />
              <Button 
                size="icon" 
                className="absolute right-2 top-2 h-10 w-10 rounded-xl bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            <Link
              to="/book"
              className="bg-primary/10 border border-primary/20 p-5 rounded-2xl flex items-center gap-4 transition-all hover:bg-primary/20 cursor-pointer decoration-none"
            >
              <div className="bg-primary p-2 rounded-xl">
                 <CalendarCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-primary font-extrabold uppercase tracking-widest leading-none mb-1">Priority Desk</p>
                <p className="text-white text-sm font-bold">Book Instantly</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Global Certifications Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-12 sm:mb-20">
          {[
            { label: "ISO Certified 9001", icon: <ShieldCheck className="w-6 h-6 text-slate-500" /> },
            { label: "US FDA Approved", icon: <Award className="w-6 h-6 text-slate-500" /> },
            { label: "IAHRS Member", icon: <Star className="w-6 h-6 text-slate-500" /> },
            { label: "Board Certified", icon: <Star className="w-6 h-6 text-slate-500" /> }
          ].map(cert => (
            <div key={cert.label} className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center justify-center gap-4 hover:bg-white/10 transition-colors">
              {cert.icon}
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">{cert.label}</span>
            </div>
          ))}
        </div>

        {/* Bottom Bar: Copyright & Accessibility */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-xs font-medium">
             &copy; {currentYear} Dr. Kanak's Speciality Clinic. All Rights Reserved. &middot; <a href="#" className="hover:text-primary decoration-none">Privacy Policy</a>
          </p>
          
          <div className="flex items-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
             <span className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
               Server Status: Optimal
             </span>
             <span className="opacity-20">|</span>
             <span>Handcrafted with Care</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
