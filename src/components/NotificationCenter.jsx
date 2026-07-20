import React, { useState, useEffect } from "react";
import { Bell, BellRing, ArrowUpRight, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { getNotifications } from "../services/api";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";

const SwipeableCard = ({ 
  banner, 
  onDismiss, 
  isExpanded, 
  setIsExpanded, 
  total,
  currentIndex 
}) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0.5, 0.9, 1, 0.9, 0.5]);

  const handleDragEnd = (event, info) => {
    if (Math.abs(info.offset.x) > 130 || Math.abs(info.velocity.x) > 400) {
      onDismiss();
    }
  };

  return (
    <motion.div
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.03 }}
      initial={{ scale: 0.92, y: 30, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ 
        x: x.get() > 0 ? 400 : x.get() < 0 ? -400 : 400, 
        opacity: 0, 
        rotate: x.get() > 0 ? 25 : -25,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      layout
      className="bg-card border border-border rounded-[2.5rem] w-full max-w-sm sm:max-w-md max-h-[80vh] overflow-hidden shadow-2xl relative flex flex-col cursor-grab active:cursor-grabbing select-none z-[100]"
    >
      {/* Drag handle pill */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/30 rounded-full z-50 pointer-events-none" />

      {/* Close/Dismiss button */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onDismiss();
        }}
        className="absolute top-4 right-4 bg-slate-950/60 hover:bg-slate-950 border border-white/10 text-white rounded-full p-2 z-50 transition-colors shadow-lg cursor-pointer"
        title="Close"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {/* Banner image */}
      <div 
        className="relative w-full h-48 sm:h-60 bg-slate-950 overflow-hidden cursor-pointer group shrink-0"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <img 
          src={banner.image_url} 
          alt="Banner" 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
        
        {/* Toggle instruction overlay */}
        {!isExpanded && (
          <div className="absolute inset-0 bg-black/25 group-hover:bg-black/15 flex flex-col items-center justify-center gap-1 transition-colors">
            <span className="text-white text-[10px] bg-primary/90 px-4 py-1.5 rounded-full font-black uppercase tracking-widest shadow-md transition-all active:scale-[0.98]">
              Click for Details
            </span>
          </div>
        )}
      </div>

      {/* Details pane */}
      <motion.div 
        layout
        className="p-5 sm:p-6 flex flex-col gap-3 text-center bg-card border-t border-border overflow-hidden flex-1"
      >
        <div className="flex flex-col gap-1.5 shrink-0">
          <h3 className="text-base sm:text-lg font-black text-foreground tracking-tight leading-tight">
            {banner.title}
          </h3>
          <span className="text-[9px] bg-primary/10 text-primary font-black px-2 py-0.5 rounded-full w-fit mx-auto uppercase">
            Announcement
          </span>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 pr-1">
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.p 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="text-xs sm:text-sm text-muted-foreground font-semibold leading-relaxed text-left sm:text-center whitespace-pre-wrap py-1"
              >
                {banner.body}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-1 shrink-0">
          {banner.url && (
            <a
              href={banner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 bg-primary hover:bg-primary/95 text-white font-extrabold text-[10px] uppercase tracking-widest rounded-full flex items-center justify-center gap-1.5 flex-1 shadow-lg shadow-primary/20 transition-all decoration-none"
            >
              Open Link <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDismiss();
            }}
            className="h-10 border border-border hover:bg-muted text-foreground font-extrabold text-[10px] uppercase tracking-widest rounded-full flex items-center justify-center flex-1 transition-all cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      </motion.div>

      {/* Navigation hints */}
      <div className="py-2.5 bg-slate-50 dark:bg-slate-900/50 border-t border-border text-center text-[9px] font-bold text-muted-foreground uppercase tracking-widest flex items-center justify-center gap-1.5 pointer-events-none">
        <span>← Swipe to dismiss →</span>
        {total > 1 && <span>•</span>}
        {total > 1 && <span>Card {currentIndex + 1} of {total}</span>}
      </div>
    </motion.div>
  );
};

const NotificationCenter = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [bannerQueue, setBannerQueue] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const [isAuthorized, setIsAuthorized] = useState(() => {
    const savedUser = JSON.parse(localStorage.getItem('clinic_user') || 'null');
    if (savedUser && savedUser.id && !savedUser.id.startsWith('GUEST_')) return true;
    const savedAppointments = JSON.parse(localStorage.getItem('clinic_appointments') || '[]');
    return savedAppointments && savedAppointments.length > 0;
  });

  useEffect(() => {
    const checkAuth = () => {
      const savedUser = JSON.parse(localStorage.getItem('clinic_user') || 'null');
      if (savedUser && savedUser.id && !savedUser.id.startsWith('GUEST_')) {
        setIsAuthorized(true);
        return;
      }
      const savedAppointments = JSON.parse(localStorage.getItem('clinic_appointments') || '[]');
      setIsAuthorized(savedAppointments && savedAppointments.length > 0);
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    window.addEventListener('triggerPushPrompt', checkAuth);
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('triggerPushPrompt', checkAuth);
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await getNotifications();
      if (res.success && res.data) {
        // Calculate unread count based on last read timestamp
        const lastRead = localStorage.getItem("last_read_notifications") || 0;
        const unread = res.data.filter(
          (n) => new Date(n.created_at).getTime() > Number(lastRead)
        ).length;
        setUnreadCount(unread);

        // Filter out dismissed popup banners that have valid images
        const dismissed = JSON.parse(localStorage.getItem("dismissed_popup_ids") || "[]");
        const activeBanners = res.data.filter(n => n.image_url && !dismissed.includes(n.id));
        setBannerQueue(activeBanners);
      }
    } catch (err) {
      console.error("Failed to load notifications", err);
    }
  };

  useEffect(() => {
    if (!isAuthorized) return;
    fetchNotifications();

    // Poll for new notifications every 60 seconds
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [isAuthorized]);

  const handleDismissCurrentBanner = () => {
    if (bannerQueue.length === 0) return;
    const current = bannerQueue[0];
    
    // Save to dismissed IDs list in localStorage
    const dismissed = JSON.parse(localStorage.getItem("dismissed_popup_ids") || "[]");
    if (!dismissed.includes(current.id)) {
      dismissed.push(current.id);
      localStorage.setItem("dismissed_popup_ids", JSON.stringify(dismissed));
    }
    
    // Reset expanded state and shift queue
    setIsExpanded(false);
    setBannerQueue(prev => prev.slice(1));
  };

  const currentBanner = bannerQueue[0];

  if (!isAuthorized) {
    return null;
  }

  return (
    <>
      <Link
        to="/notifications"
        className="relative rounded-full h-9 w-9 sm:h-11 sm:w-11 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center border border-border bg-background"
      >
        {unreadCount > 0 ? (
          <>
            <BellRing className="w-5 h-5 text-primary animate-wiggle" />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-background" />
          </>
        ) : (
          <Bell className="w-5 h-5 text-foreground/70" />
        )}
      </Link>

      {/* PREMIUM STACKED IN-APP ANNOUNCEMENT POPUP MODALS */}
      {currentBanner && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
          <div className="relative w-full max-w-sm sm:max-w-md">
            <AnimatePresence mode="popLayout">
              {bannerQueue.slice(0, 3).reverse().map((banner, idx, arr) => {
                const isTop = idx === arr.length - 1;
                const relativeIndex = (arr.length - 1) - idx;
                
                if (isTop) {
                  return (
                    <SwipeableCard
                      key={banner.id}
                      banner={banner}
                      onDismiss={handleDismissCurrentBanner}
                      isExpanded={isExpanded}
                      setIsExpanded={setIsExpanded}
                      total={bannerQueue.length}
                      currentIndex={0}
                    />
                  );
                }

                return (
                  <motion.div
                    key={banner.id}
                    initial={{ scale: 0.9, y: 30, opacity: 0 }}
                    animate={{
                      scale: 1 - relativeIndex * 0.05,
                      y: relativeIndex * 15,
                      opacity: 0.6 - relativeIndex * 0.2,
                      zIndex: 10 - relativeIndex
                    }}
                    exit={{ opacity: 0, y: 30, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    className="absolute top-0 left-0 w-full h-full bg-card border border-border rounded-[2.5rem] shadow-lg pointer-events-none overflow-hidden"
                  >
                    <div className="w-full h-full relative">
                      <img src={banner.image_url} alt="" className="w-full h-full object-cover opacity-60 blur-[1px]" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationCenter;
