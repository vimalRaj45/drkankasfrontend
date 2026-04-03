// components/Hero.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  ShieldCheck, 
  Clock, 
  Award, 
  Star, 
  ArrowRight, 
  ChevronRight,
  Sparkles,
  Droplets,
  Scissors,
  Heart,
  Shield,
  Phone,
  TrendingUp,
  CheckCircle,
  Zap,
  Activity,
  Calendar,
  ThumbsUp,
  Users,
  Zap as ZapIcon
} from "lucide-react";
import { getPublicStats } from "../services/api";
import Logo from "../assets/dr_kanaks_logo.png";

const Hero = () => {
  const [activeCard, setActiveCard] = useState(0);
  const [liveStats, setLiveStats] = useState({ total_patients: 10000, success_rate: 98 });
  
  // Fetch live stats
  useEffect(() => {
    getPublicStats().then(res => {
      if (res.success) setLiveStats(res.data);
    });
  }, []);
  
  // Treatment cards data with more content
  const treatmentCards = [
    {
      title: "Hair Transplant",
      description: "Advanced FUE & FUT techniques for natural results",
      icon: Scissors,
      gradientFrom: "from-blue-600",
      gradientTo: "to-blue-400",
      stats: "95% Success Rate",
      patients: "2,500+ Treated",
      recovery: "7-10 Days",
      details: "Permanent solution with minimal scarring"
    },
    {
      title: "Acne Treatment",
      description: "Clear skin solutions for all skin types",
      icon: Sparkles,
      gradientFrom: "from-blue-500",
      gradientTo: "to-sky-400",
      stats: "98% Improvement",
      patients: "3,200+ Treated",
      recovery: "4-6 Weeks",
      details: "Customized treatment plans"
    },
    {
      title: "PRP Therapy",
      description: "Natural hair restoration using your own platelets",
      icon: Droplets,
      gradientFrom: "from-blue-600",
      gradientTo: "to-cyan-400",
      stats: "90% Results",
      patients: "1,800+ Treated",
      recovery: "No Downtime",
      details: "Stimulates natural hair growth"
    },
    {
      title: "Anti-Aging",
      description: "Youthful skin revival with advanced treatments",
      icon: Heart,
      gradientFrom: "from-blue-500",
      gradientTo: "to-indigo-400",
      stats: "100% Satisfaction",
      patients: "4,000+ Treated",
      recovery: "Minimal",
      details: "Turn back the clock naturally"
    },
    {
      title: "Pigmentation",
      description: "Even tone restoration for radiant skin",
      icon: Shield,
      gradientFrom: "from-blue-600",
      gradientTo: "to-sky-400",
      stats: "92% Success",
      patients: "1,500+ Treated",
      recovery: "2-3 Sessions",
      details: "Advanced laser technology"
    },
    {
      title: "Laser Treatment",
      description: "State-of-the-art laser technology",
      icon: Zap,
      gradientFrom: "from-blue-500",
      gradientTo: "to-cyan-400",
      stats: "99% Results",
      patients: "5,000+ Treated",
      recovery: "24-48 Hours",
      details: "Painless & effective"
    }
  ];

  // Auto-rotate cards every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % treatmentCards.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [treatmentCards.length]);

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

      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left Side Content */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10"
        >
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6"
          >
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Certified Dermatology Specialist</span>
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Sparkles className="w-3 h-3 text-blue-500" />
            </motion.span>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] mb-6 text-foreground">
            Your Skin, Hair & <br />
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500">
                Confidence
              </span>
              <motion.div 
                className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-sky-500 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              />
            </span>{" "}
            <span className="text-foreground">Our Priority</span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-8 max-w-xl leading-relaxed">
            Expert dermatological care by Dr. Kanagaraj MBBS., MD (DVL). Specialized in advanced skin treatments, 
            hair restoration & cosmetic procedures. Trusted by 10,000+ happy patients.
          </p>

          <div className="flex flex-wrap gap-4 mb-10">
            <Button 
              size="lg" 
              className="rounded-full px-8 py-6 text-base shadow-xl shadow-blue-500/25 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 group"
              asChild
            >
              <a href="/appointment" className="flex items-center gap-3">
                <div className="bg-white p-1 rounded-lg">
                   <img src={Logo} className="w-5 h-5 object-contain" alt="" />
                </div>
                Book Consultation
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="rounded-full px-8 py-6 text-base border-2 border-blue-500/30 hover:border-blue-500 hover:bg-blue-500/5 transition-all group"
              asChild
            >
              <a href="#services">
                Explore Treatments
                <ChevronRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4 sm:gap-8 pt-6 border-t border-border">
            {[
              { value: "15+", label: "Years Experience", icon: Clock, color: "text-blue-600" },
              { value: `${(liveStats.total_patients / 1000).toFixed(1)}k+`, label: "Happy Patients", icon: Award, color: "text-sky-500" },
              { value: `${liveStats.success_rate}%`, label: "Success Rate", icon: TrendingUp, color: "text-cyan-500" }
            ].map((stat, idx) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + idx * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <stat.icon className={`w-5 h-5 mb-2 ${stat.color}`} />
                <motion.span 
                  className="text-2xl sm:text-3xl font-bold text-foreground"
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8 + idx * 0.1, type: "spring" }}
                >
                  {stat.value}
                </motion.span>
                <span className="text-xs sm:text-sm text-muted-foreground font-medium">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Side - Moving Cards Stack with Rich Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: 30 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "circOut" }}
          className="relative lg:block hidden"
        >
          <div className="relative z-20" style={{ width: "100%", maxWidth: "520px", margin: "0 auto" }}>
            <div className="relative" style={{ height: "620px" }}>
              <AnimatePresence mode="wait">
                {treatmentCards.map((card, idx) => {
                  const offset = (idx - activeCard + treatmentCards.length) % treatmentCards.length;
                  const isActive = offset === 0;
                  const isBehind = offset === 1;
                  const isFurtherBehind = offset === 2;
                  
                  if (offset > 2) return null;
                  
                  let yOffset = 0;
                  let scale = 1;
                  let opacity = 1;
                  let zIndex = 10;
                  let rotate = 0;
                  let xOffset = 0;
                  
                  if (isActive) {
                    yOffset = 0;
                    scale = 1;
                    opacity = 1;
                    zIndex = 40;
                    rotate = 0;
                    xOffset = 0;
                  } else if (isBehind) {
                    yOffset = 25;
                    scale = 0.96;
                    opacity = 0.85;
                    zIndex = 30;
                    rotate = -2;
                    xOffset = -6;
                  } else {
                    yOffset = 50;
                    scale = 0.92;
                    opacity = 0.7;
                    zIndex = 20;
                    rotate = -4;
                    xOffset = -12;
                  }
                  
                  return (
                    <motion.div
                      key={card.title}
                      initial={false}
                      animate={{
                        y: yOffset,
                        scale: scale,
                        opacity: opacity,
                        zIndex: zIndex,
                        rotate: rotate,
                        x: xOffset,
                      }}
                      transition={{ duration: 0.5, type: "spring", stiffness: 300, damping: 25 }}
                      className={`absolute top-0 left-0 w-full bg-gradient-to-br ${card.gradientFrom} ${card.gradientTo} rounded-3xl p-6 shadow-2xl cursor-pointer border-2 border-white/30`}
                      style={{ backdropFilter: "blur(10px)" }}
                      onClick={() => setActiveCard(idx)}
                    >
                      <div className="flex flex-col h-full">
                        {/* Header */}
                        <div className="flex items-start gap-4 mb-5">
                          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                            <card.icon className="w-7 h-7 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-white font-bold text-xl mb-1">{card.title}</h3>
                            <p className="text-white/80 text-sm leading-relaxed">{card.description}</p>
                          </div>
                        </div>
                        
                        {/* Stats Row - Two columns */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="bg-white/15 rounded-xl p-2 text-center">
                            <div className="flex items-center justify-center gap-1 mb-1">
                              <TrendingUp className="w-3 h-3 text-white/80" />
                              <span className="text-white text-xs font-semibold">Success Rate</span>
                            </div>
                            <p className="text-white font-bold text-lg">{card.stats}</p>
                          </div>
                          <div className="bg-white/15 rounded-xl p-2 text-center">
                            <div className="flex items-center justify-center gap-1 mb-1">
                              <Users className="w-3 h-3 text-white/80" />
                              <span className="text-white text-xs font-semibold">Patients</span>
                            </div>
                            <p className="text-white font-bold text-lg">{card.patients}</p>
                          </div>
                        </div>
                        
                        {/* Recovery & Details */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-white/70" />
                            <span className="text-white/80 text-xs">Recovery: {card.recovery}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="w-3 h-3 text-white/70" />
                            <span className="text-white/70 text-xs">Proven Results</span>
                          </div>
                        </div>
                        
                        {/* Details Line */}
                        <div className="bg-white/10 rounded-xl p-2 mb-4">
                          <p className="text-white/90 text-xs text-center">{card.details}</p>
                        </div>
                        
                        {/* Divider */}
                        <div className="border-t border-white/20 my-2"></div>
                        
                        {/* Footer */}
                        <div className="flex items-center justify-between mt-1">
                          <div>
                            <span className="text-white/70 text-xs">Dr. Kanagaraj</span>
                            <p className="text-white/60 text-[10px]">MBBS., MD (DVL)</p>
                          </div>
                          <div className="flex items-center gap-1 text-white font-semibold text-sm hover:gap-2 transition-all">
                            Learn More
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                      
                      {/* Decorative sparkles */}
                      <motion.div 
                        className="absolute bottom-3 right-3 text-white/20"
                        animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                      >
                        <Sparkles className="w-6 h-6" />
                      </motion.div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
            
            {/* Card Navigation Dots - Reduced gap */}
            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 flex gap-3 mt-4">
              {treatmentCards.map((card, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveCard(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === activeCard 
                      ? "w-8 bg-gradient-to-r from-blue-500 to-sky-400" 
                      : "w-2 bg-blue-300/50 hover:bg-blue-400/70"
                  }`}
                />
              ))}
            </div>
          </div>
          
          {/* Floating Contact Card - Adjusted position */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="absolute bottom-4 -left-8 z-30 bg-gradient-to-r from-blue-600 to-blue-500 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-blue-400/30 max-w-[240px]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-white uppercase tracking-wider">Emergency Contact</p>
                <p className="text-sm font-bold text-white">+91 97504 51176</p>
                <p className="text-[9px] text-white/80">Available 24/7</p>
              </div>
            </div>
          </motion.div>
          
          {/* Floating Rating Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="absolute top-12 -right-6 z-30 bg-gradient-to-r from-sky-500 to-cyan-500 backdrop-blur-md rounded-2xl p-2.5 shadow-xl border border-blue-400/30"
          >
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-3 h-3 fill-white text-white" />
                ))}
              </div>
              <div>
                <p className="text-sm font-bold text-white leading-none">4.9/5</p>
                <p className="text-[9px] text-white/80">1,200+ Reviews</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;