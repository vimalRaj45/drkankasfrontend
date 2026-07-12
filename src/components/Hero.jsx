// components/Hero.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  ShieldCheck, 
  Clock, 
  Award, 
  ArrowRight, 
  ChevronRight,
  Sparkles,
  TrendingUp,
  ChevronLeft
} from "lucide-react";
import { getPublicStats } from "../services/api";
import Logo from "../assets/dr_kanaks_logo.png";

const flyers = [
  { id: 1, src: "/flyer1.jpg" },
  { id: 2, src: "/flyer2.jpg" },
  { id: 3, src: "/flyer3.jpg" },
  { id: 4, src: "/flyer4.jpg" },
  { id: 5, src: "/flyer5.jpg" }
];

const englishWords = [
  "Your Skin & Hair",
  "Your Confidence",
  "Your Aesthetics",
  "Hair Restoration",
  "Clinical Excellence"
];

const tamilWords = [
  "உங்கள் சருமம் & முடியில்",
  "உங்கள் நம்பிக்கையில்",
  "உங்கள் அழகியலில்",
  "முடி மறுசீரமைப்பில்",
  "சிறந்த மருத்துவ சேவையில்"
];

const Hero = () => {
  const [lang, setLang] = useState("en");
  const words = lang === 'ta' ? tamilWords : englishWords;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [liveStats, setLiveStats] = useState({ total_patients: 10000, success_rate: 98 });
  const [wordIndex, setWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [speed, setSpeed] = useState(50);

  // Watch for language changes and browser translation events
  useEffect(() => {
    const checkLang = () => {
      const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
          try {
            return decodeURIComponent(parts.pop().split(';').shift());
          } catch (e) {
            return parts.pop().split(';').shift();
          }
        }
      };
      
      const currentLang = getCookie('googtrans');
      const isTamil = 
        (currentLang && currentLang.includes('/ta')) ||
        document.documentElement.lang === 'ta' ||
        document.documentElement.classList.contains('translated-ltr') ||
        document.documentElement.className.includes('translated');
        
      setLang(isTamil ? "ta" : "en");
    };

    checkLang();

    // Observe changes to html lang attribute to detect dynamic browser translations
    const observer = new MutationObserver(checkLang);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang', 'class'] });

    return () => observer.disconnect();
  }, []);
  
  // Fetch live stats
  useEffect(() => {
    getPublicStats().then(res => {
      if (res.success) setLiveStats(res.data);
    });
  }, []);
  
  // Auto-rotate flyers every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Typewriter typography effect logic
  useEffect(() => {
    let timer;
    const activeWord = words[wordIndex];

    const handleType = () => {
      if (!isDeleting) {
        const nextText = activeWord.substring(0, currentText.length + 1);
        setCurrentText(nextText);
        setSpeed(50); // Snappy typing speed

        if (nextText === activeWord) {
          setIsDeleting(true);
          setSpeed(1200); // 1.2s pause on complete phrase
        }
      } else {
        const nextText = activeWord.substring(0, currentText.length - 1);
        setCurrentText(nextText);
        setSpeed(25); // Faster deleting speed

        if (nextText === "") {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
          setSpeed(300); // Quick 0.3s pause before typing the next phrase
        }
      }
    };

    timer = setTimeout(handleType, speed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, wordIndex, speed, words]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % flyers.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + flyers.length) % flyers.length);
  };

  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center pt-24 sm:pt-32 pb-12 sm:pb-20 bg-gradient-to-br from-background via-background to-blue-50/30 overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], x: [0, 50, 0] }}
          transition={{ repeat: Infinity, duration: 8 }}
        />
        <motion.div 
          className="absolute bottom-20 left-10 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], y: [0, -30, 0] }}
          transition={{ repeat: Infinity, duration: 10, delay: 1 }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/3 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.5, 1], rotate: [0, 180, 360] }}
          transition={{ repeat: Infinity, duration: 12 }}
        />
      </div>

      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
        {/* Left Side Content */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10"
        >
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-xs font-black uppercase tracking-widest mb-4 shadow-xs backdrop-blur-md animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 animate-spin" style={{ animationDuration: '3s' }} />
              <span>Pioneering Clinical Excellence</span>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7.5xl font-black leading-[1.15] text-foreground tracking-tight">
              <span className="block mb-2 drop-shadow-sm">Advanced Care for</span>
              <span className={`notranslate inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-500 dark:from-blue-400 dark:via-indigo-400 dark:to-sky-400 min-h-[1.2em] font-black drop-shadow-[0_2px_10px_rgba(59,130,246,0.15)] ${
                lang === 'ta' 
                  ? "text-xl sm:text-3xl md:text-4xl lg:text-5xl" 
                  : "text-2xl sm:text-4xl md:text-5xl lg:text-6xl"
              }`}>
                {currentText || "\u00A0"}
              </span>
              <span className="notranslate w-[4px] h-[0.9em] bg-blue-600 dark:bg-blue-400 ml-1 animate-pulse inline-block align-middle shrink-0" />
            </h1>
          </div>

          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-8 max-w-xl leading-relaxed font-medium">
            Expert dermatological care by Dr. (Major) R. Kanagaraj MBBS., MD (DVL). Specialized in advanced skin treatments, 
            hair restoration & cosmetic procedures. Trusted by 10,000+ happy patients.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-10 w-full sm:w-auto">
            <Button 
              size="lg" 
              className="rounded-full px-8 py-6 text-base shadow-xl shadow-blue-500/25 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 group w-full sm:w-auto justify-center hover:scale-[1.02] active:scale-[0.98] transition-all"
              asChild
            >
              <a href="/appointment" className="flex items-center justify-center gap-3">
                <div className="bg-white p-1 rounded-lg shrink-0">
                   <img src={Logo} className="w-5 h-5 object-contain" alt="" />
                </div>
                Book Consultation
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="rounded-full px-8 py-6 text-base border border-slate-200/80 dark:border-white/10 backdrop-blur-md bg-white/20 dark:bg-slate-900/20 hover:bg-slate-100/50 dark:hover:bg-slate-900/50 transition-all group w-full sm:w-auto justify-center hover:scale-[1.02] active:scale-[0.98]"
              asChild
            >
              <a href="#services" className="flex items-center justify-center">
                Explore Treatments
                <ChevronRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-4 w-full">
            {[
              { value: "13+", label: "Years Experience", icon: Clock, color: "text-blue-600 bg-blue-500/10 dark:text-blue-400 dark:bg-blue-400/10" },
              { value: `${(liveStats.total_patients / 1000).toFixed(1)}k+`, label: "Happy Patients", icon: Award, color: "text-sky-500 bg-sky-500/10 dark:text-sky-400 dark:bg-sky-400/10" },
              { value: `${liveStats.success_rate}%`, label: "Success Rate", icon: TrendingUp, color: "text-cyan-500 bg-cyan-500/10 dark:text-cyan-400 dark:bg-cyan-400/10" }
            ].map((stat, idx) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + idx * 0.1, type: "spring", stiffness: 100 }}
                className="flex flex-col items-center text-center p-3 sm:p-4 rounded-2xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/50 dark:border-white/5 shadow-lg shadow-slate-100/50 dark:shadow-none hover:border-blue-500/20 dark:hover:border-blue-500/30 hover:bg-white/80 dark:hover:bg-slate-900/80 hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300 group"
              >
                <div className={`p-2 rounded-xl mb-2 sm:mb-3 ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-5 h-5 shrink-0" />
                </div>
                <motion.span 
                  className="text-lg sm:text-2xl font-black text-foreground leading-tight"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8 + idx * 0.1 }}
                >
                  {stat.value}
                </motion.span>
                <span className="text-[9px] sm:text-xs text-muted-foreground font-semibold uppercase tracking-wider leading-tight max-w-[80px] sm:max-w-none mt-1 sm:mt-1.5">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Side - Carousel Slider (Images only, no click actions) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, x: 30 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-full max-w-lg lg:max-w-xl mx-auto z-10"
        >
          {/* Floating Certified Badge */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute top-6 -left-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-border p-3.5 rounded-2xl shadow-xl z-30 flex items-center gap-2.5 max-w-[160px] pointer-events-none"
          >
            <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] text-muted-foreground font-black uppercase tracking-wider">Clinic Verified</span>
              <span className="text-xs font-bold text-foreground leading-tight">ISO Certified</span>
            </div>
          </motion.div>

          {/* Floating Top Rated Badge */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.5 }}
            className="absolute -bottom-4 -right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-border p-3.5 rounded-2xl shadow-xl z-30 flex items-center gap-2.5 pointer-events-none"
          >
            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0 animate-pulse">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] text-muted-foreground font-black uppercase tracking-wider">Top Rated</span>
              <span className="text-xs font-bold text-foreground leading-tight">Skin & Hair Care</span>
            </div>
          </motion.div>

          {/* Slider window wrapping container */}
          <div className="p-2 bg-white/30 dark:bg-slate-900/30 backdrop-blur-xl border border-white/20 rounded-[2.5rem] sm:rounded-[3.5rem] shadow-2xl relative">
            <div className="relative aspect-square w-full rounded-[2rem] sm:rounded-[3rem] overflow-hidden bg-slate-950 border border-slate-200/10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 flex h-full w-full"
                >
                  <div className="relative w-full h-full bg-slate-950 flex items-center justify-center overflow-hidden">
                    {/* Blurred background flyer image for ambient glow */}
                    <img
                      src={flyers[currentIndex].src}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-30 scale-110 pointer-events-none"
                    />
                    <img
                      src={flyers[currentIndex].src}
                      alt={`Clinic Flyer ${flyers[currentIndex].id}`}
                      className="relative w-full h-full object-contain select-none z-10"
                    />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-4 sm:left-[-1.5rem] top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-background/90 backdrop-blur-md border border-border shadow-xl flex items-center justify-center hover:bg-muted text-foreground transition-all z-20 hover:scale-105 active:scale-95"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 sm:right-[-1.5rem] top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-background/90 backdrop-blur-md border border-border shadow-xl flex items-center justify-center hover:bg-muted text-foreground transition-all z-20 hover:scale-105 active:scale-95"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Indicator Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {flyers.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentIndex === idx 
                    ? "bg-blue-600 w-5" 
                    : "bg-slate-300 dark:bg-slate-700 hover:bg-slate-400"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;