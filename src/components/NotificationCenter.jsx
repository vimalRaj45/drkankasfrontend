import React, { useState, useEffect } from "react";
import { Bell, BellRing, ArrowUpRight, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { getNotifications } from "../services/api";

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [bannerQueue, setBannerQueue] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await getNotifications();
      if (res.success && res.data) {
        setNotifications(res.data);
        
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
    fetchNotifications();

    // Poll for new notifications every 60 seconds
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenChange = (open) => {
    setIsOpen(open);
    if (open) {
      // Mark all as read
      const now = Date.now();
      localStorage.setItem("last_read_notifications", now.toString());
      setUnreadCount(0);
    }
  };

  const formatTime = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return dateStr;
    }
  };

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

  return (
    <>
      <Popover open={isOpen} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full h-9 w-9 sm:h-11 sm:w-11 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {unreadCount > 0 ? (
              <>
                <BellRing className="w-5 h-5 text-primary animate-wiggle" />
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-background" />
              </>
            ) : (
              <Bell className="w-5 h-5 text-foreground/70" />
            )}
          </Button>
        </PopoverTrigger>
        
        <PopoverContent 
          align="end" 
          className="w-80 sm:w-[380px] p-0 rounded-3xl border border-border bg-card shadow-2xl overflow-hidden z-50"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-border">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary" />
              <span className="font-extrabold text-sm text-foreground">Notification Center</span>
            </div>
            {unreadCount > 0 && (
              <span className="text-[10px] bg-primary/10 text-primary font-black px-2 py-0.5 rounded-full">
                {unreadCount} New
              </span>
            )}
          </div>

          {/* Scrollable List */}
          <div className="max-h-[350px] overflow-y-auto divide-y divide-border">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                  <Bell className="w-5 h-5 text-muted-foreground" />
                </div>
                <p className="text-xs font-bold text-foreground">No alerts yet</p>
                <p className="text-[10px] text-muted-foreground mt-1 max-w-[200px]">
                  You're all caught up! When updates or clinic announcements are sent, they'll show up here.
                </p>
              </div>
            ) : (
              notifications.map((item) => (
                <div key={item.id} className="p-4 hover:bg-muted/30 transition-colors flex flex-col gap-2">
                  <div className="flex justify-between items-start gap-4">
                    <h4 className="font-bold text-xs sm:text-sm text-foreground leading-snug">
                      {item.title}
                    </h4>
                    <span className="text-[9px] text-muted-foreground font-medium shrink-0">
                      {formatTime(item.created_at)}
                    </span>
                  </div>
                  
                  <p className="text-xs text-muted-foreground font-medium leading-normal whitespace-pre-wrap">
                    {item.body}
                  </p>



                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-primary mt-1 hover:underline decoration-none w-fit"
                    >
                      Open Link <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              ))
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* PREMIUM STACKED IN-APP ANNOUNCEMENT POPUP MODALS */}
      {currentBanner && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-[2rem] max-w-md w-full overflow-hidden shadow-2xl relative flex flex-col animate-in fade-in zoom-in-95 duration-200">
            
            {/* Close Button in top right */}
            <button 
              onClick={handleDismissCurrentBanner}
              className="absolute top-4 right-4 bg-slate-900/80 hover:bg-slate-900 border border-border text-white rounded-full p-2 z-[10000] transition-colors shadow-lg"
              title="Close and show next"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Banner Image (always shown first) */}
            <div 
              className="relative w-full h-72 bg-slate-950 overflow-hidden cursor-pointer group"
              onClick={() => setIsExpanded(true)}
            >
              <img 
                src={currentBanner.image_url} 
                alt="Banner Announcement" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              
              {/* Click instruction overlay helper */}
              {!isExpanded && (
                <div className="absolute inset-0 bg-black/35 group-hover:bg-black/25 flex flex-col items-center justify-center gap-1 transition-colors">
                  <span className="text-white text-xs bg-primary/90 px-4 py-1.5 rounded-full font-black uppercase tracking-widest shadow-md transition-all active:scale-[0.98]">
                    Click for Details
                  </span>
                  {bannerQueue.length > 1 && (
                    <span className="text-[10px] text-slate-300 font-bold">
                      {bannerQueue.length} announcements pending
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Detailed Message (Revealed on click) */}
            {isExpanded && (
              <div className="p-6 sm:p-8 flex flex-col gap-4 text-center border-t border-border animate-in fade-in slide-in-from-bottom-3 duration-300">
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-xl font-black text-foreground tracking-tight leading-tight">
                    {currentBanner.title}
                  </h3>
                  <span className="text-[10px] bg-primary/10 text-primary font-black px-2 py-0.5 rounded-full w-fit mx-auto uppercase">
                    Clinic Announcement
                  </span>
                </div>
                
                <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed whitespace-pre-wrap max-h-40 overflow-y-auto">
                  {currentBanner.body}
                </p>
                
                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 mt-2">
                  {currentBanner.url && (
                    <a
                      href={currentBanner.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-12 bg-primary hover:bg-primary/95 text-white font-extrabold text-xs uppercase tracking-widest rounded-full flex items-center justify-center gap-2 flex-1 shadow-lg shadow-primary/20 transition-all decoration-none"
                    >
                      Open Link <ArrowUpRight className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    onClick={handleDismissCurrentBanner}
                    className="h-12 border border-border hover:bg-muted text-foreground font-extrabold text-xs uppercase tracking-widest rounded-full flex items-center justify-center flex-1 transition-all"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}

            {/* Queue pagination status bar */}
            {bannerQueue.length > 1 && (
              <div className="py-2 bg-muted/30 border-t border-border text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Stack queue: 1 of {bannerQueue.length}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationCenter;
