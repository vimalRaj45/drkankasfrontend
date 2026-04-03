import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShieldCheck, Sparkles, Activity } from "lucide-react";

import Logo from "../assets/dr_kanaks_logo.png";

const LoadingScreen = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="loading"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Main Logo Animation */}
          <motion.div
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            className="relative"
          >
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150" />
            <div className="bg-white p-4 rounded-[2.5rem] shadow-2xl relative z-10 border border-slate-100">
              <img src={Logo} className="w-16 h-16 object-contain" alt="Dr. Kanak's Clinic" />
            </div>
            
            {/* Spinning Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-4 border-2 border-dashed border-primary/20 rounded-full"
            />
          </motion.div>

          {/* Loading Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 text-center"
          >
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tighter mb-2">
              Dr. Kanak's <span className="text-primary italic">Clinic</span>
            </h2>
            <div className="flex items-center gap-3 justify-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
              <ShieldCheck className="w-3 h-3 text-primary" />
              Verified Healthcare Specialist
              <ShieldCheck className="w-3 h-3 text-primary" />
            </div>
          </motion.div>

          {/* Progress Bar */}
          <div className="w-64 h-1.5 bg-slate-100 rounded-full mt-10 overflow-hidden relative">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="absolute inset-0 bg-primary rounded-full shadow-lg shadow-primary/20"
            />
          </div>

          {/* Floating Icons Background */}
          <div className="absolute inset-0 opacity-[0.03] select-none pointer-events-none -z-0">
             <Sparkles className="absolute left-[10%] top-[20%] w-24 h-24 text-primary rotate-12" />
             <Activity className="absolute right-[15%] top-[10%] w-32 h-32 text-secondary -rotate-12" />
             <ShieldCheck className="absolute left-[20%] bottom-[15%] w-20 h-20 text-primary rotate-45" />
             <Heart className="absolute right-[10%] bottom-[20%] w-28 h-28 text-secondary -rotate-12" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
