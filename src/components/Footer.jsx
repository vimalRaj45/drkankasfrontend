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
  ArrowRight,
  Send,
  CalendarCheck,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import Logo from "../assets/dr_kanaks_logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 pt-14 sm:pt-24 pb-8 sm:pb-12 relative overflow-hidden border-t border-slate-200">
      {/* Background Decorative Element */}
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[100px] -z-0" />
      <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-[100px] -z-0" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-16 mb-12 lg:mb-24">
          
          {/* Brand & Mission Column */}
          <div className="lg:col-span-1 space-y-8">
            <Link to="/" className="flex items-center decoration-none group">
              <img src={Logo} className="h-14 sm:h-20 w-auto object-contain transition-transform group-hover:scale-105" alt="Dr. Kanaks Clinic" />
            </Link>
            
            <p className="text-slate-600 text-sm font-medium leading-relaxed max-w-xs italic">
              "Pioneering world-class clinical excellence in dermatology and hair restoration since 2014. Committed to delivering safe, effective and personalized patient care."
            </p>

            <div className="flex gap-4">
              <Button asChild size="icon" variant="ghost" className="rounded-full h-11 w-11 bg-slate-200/50 text-slate-600 border border-slate-200 hover:bg-primary hover:text-white hover:border-primary hover:shadow-xl transition-all">
                <a href="https://www.instagram.com/drkanaks?igsh=ZWgydWlnNXU3MzB2" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <Instagram className="w-5 h-5" />
                </a>
              </Button>
              <Button asChild size="icon" variant="ghost" className="rounded-full h-11 w-11 bg-slate-200/50 text-slate-600 border border-slate-200 hover:bg-primary hover:text-white hover:border-primary hover:shadow-xl transition-all">
                <a href="https://www.facebook.com/profile.php?id=61567068521262" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <Facebook className="w-5 h-5" />
                </a>
              </Button>
              <Button asChild size="icon" variant="ghost" className="rounded-full h-11 w-11 bg-slate-200/50 text-slate-600 border border-slate-200 hover:bg-primary hover:text-white hover:border-primary hover:shadow-xl transition-all">
                <a href="https://www.youtube.com/@drkanaks1847/shorts" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                  <Youtube className="w-5 h-5" />
                </a>
              </Button>
              <Button asChild size="icon" variant="ghost" className="rounded-full h-11 w-11 bg-slate-200/50 text-slate-600 border border-slate-200 hover:bg-primary hover:text-white hover:border-primary hover:shadow-xl transition-all">
                <a href="https://www.linkedin.com/in/dr-kanaks-150226320/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <Linkedin className="w-5 h-5" />
                </a>
              </Button>
              <Button asChild size="icon" variant="ghost" className="rounded-full h-11 w-11 bg-slate-200/50 text-slate-600 border border-slate-200 hover:bg-primary hover:text-white hover:border-primary hover:shadow-xl transition-all">
                <a href="https://share.google/JJWJzBNnjSpuiSfb8" target="_blank" rel="noopener noreferrer" aria-label="Google My Business">
                  <Globe className="w-5 h-5" />
                </a>
              </Button>
            </div>
          </div>

          {/* Quick Nav Links Column */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-bold text-white mb-8 border-l-2 border-primary pl-4 uppercase tracking-widest text-xs">Medical Directory</h4>
            <nav className="flex flex-col gap-5">
              {[
                { name: "Home", path: "/" },
                { name: "About Us", path: "/about" },
                { name: "Services", path: "/services" },
                { name: "Our Doctors", path: "/#doctors" },
                { name: "Book Appointment", path: "/book" },
                { name: "Contact Us", path: "/contact" }
              ].map(link => (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  className="text-slate-600 text-sm font-semibold hover:text-primary hover:translate-x-1 transition-all decoration-none flex items-center gap-2 group"
                >
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Clinical Locations / Support Column */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-bold text-slate-800 mb-8 border-l-2 border-secondary pl-4 uppercase tracking-widest text-xs">Patient Concierge</h4>
            <div className="space-y-6">
              <div className="flex items-start gap-4 text-slate-600">
                <Phone className="w-5 h-5 text-secondary mt-1" />
                <div className="text-sm font-medium">
                  <p className="text-slate-800 font-bold mb-1">Clinic Support</p>
                  <p className="text-slate-600">+91 97504 51176</p>
                </div>
              </div>
              <div className="flex items-start gap-4 text-slate-600">
                <MapPin className="w-5 h-5 text-secondary mt-1" />
                <div className="text-sm font-medium">
                  <p className="text-slate-800 font-bold mb-1">Clinic Address</p>
                  <p className="text-slate-600">1/11A-3, Anna Salai, Swarnapuri,</p>
                  <p className="text-slate-600">Salem, Tamil Nadu 636004</p>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter / CTA Column */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-bold text-slate-800 mb-8 border-l-2 border-amber-500 pl-4 uppercase tracking-widest text-xs">Clinical Bulletin</h4>
            <p className="text-slate-600 text-sm font-medium mb-6 leading-relaxed italic">
              Subscribe to receive exclusive healthcare tips and priority update on clinical camps.
            </p>
            <div className="relative mb-6">
              <Input 
                placeholder="Email Address" 
                className="h-14 rounded-2xl bg-white border border-slate-200 pl-6 text-slate-800 text-sm focus:ring-primary shadow-sm"
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
                <p className="text-slate-800 text-sm font-bold">Book Instantly</p>
              </div>
            </Link>
          </div>
        </div>


        {/* Bottom Bar: Copyright & Accessibility */}
        <div className="pt-12 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-xs font-medium">
             &copy; {currentYear} Dr. Kanaks Speciality Clinic. All Rights Reserved. &middot; <a href="#" className="hover:text-primary decoration-none">Privacy Policy</a>
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
