import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Calendar, X, Plus, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FloatingActions = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-8 lg:bottom-10 right-5 lg:right-10 z-[100] flex flex-col items-end gap-3">
      
      {/* Expanded Actions */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex flex-col gap-3 items-end mb-1 pointer-events-none"
          >
            {/* Call Now */}
            <div className="flex items-center gap-3 group">
              <motion.span 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="bg-white/95 backdrop-blur-md text-slate-900 text-[9px] font-black px-3 py-1 rounded-full shadow-lg border border-border whitespace-nowrap uppercase tracking-widest"
              >
                Call Now
              </motion.span>
              <motion.a
                href="tel:+919750451176"
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                className="pointer-events-auto w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full shadow-lg border border-white/20 transition-all"
              >
                <Phone className="w-5 h-5 fill-white/10" />
              </motion.a>
            </div>

            {/* Book Appointment */}
            <div className="flex items-center gap-3 group">
              <motion.span 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="bg-white/95 backdrop-blur-md text-slate-900 text-[9px] font-black px-3 py-1 rounded-full shadow-lg border border-border whitespace-nowrap uppercase tracking-widest"
              >
                Book Now
              </motion.span>
              <motion.button
                onClick={() => {
                  navigate('/book');
                  setIsOpen(false);
                }}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                className="pointer-events-auto w-10 h-10 flex items-center justify-center bg-primary text-white rounded-full shadow-lg border border-white/20 transition-all"
              >
                <Calendar className="w-5 h-5" />
              </motion.button>
            </div>

            {/* WhatsApp */}
            <div className="flex items-center gap-3 group">
              <motion.span 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="bg-white/95 backdrop-blur-md text-slate-900 text-[9px] font-black px-3 py-1 rounded-full shadow-lg border border-border whitespace-nowrap uppercase tracking-widest"
              >
                WhatsApp
              </motion.span>
              <motion.a
                href="https://wa.me/919750451176"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                className="pointer-events-auto w-10 h-10 flex items-center justify-center bg-[#25D366] text-white rounded-full shadow-lg border border-white/20 transition-all"
              >
                <MessageSquare className="w-5 h-5 fill-white/10" />
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`w-12 h-12 flex items-center justify-center rounded-full shadow-xl border border-white/20 transition-all duration-300 ${
          isOpen ? "bg-slate-900 text-white rotate-90" : "bg-primary text-white"
        }`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
      </motion.button>
    </div>
  );
};

export default FloatingActions;
