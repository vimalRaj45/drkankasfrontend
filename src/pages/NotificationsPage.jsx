import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bell, ArrowLeft, ArrowUpRight, Calendar, Trash2, Sparkles } from "lucide-react";
import { getNotifications } from "../services/api";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await getNotifications();
      if (res.success && res.data) {
        // Sort notifications: newest first
        const sorted = [...res.data].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setNotifications(sorted);
        
        // Mark as read in localstorage
        localStorage.setItem("last_read_notifications", Date.now().toString());
      }
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const formatTime = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-IN", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return dateStr;
    }
  };

  const handleClearAll = () => {
    const dismissed = JSON.parse(localStorage.getItem("dismissed_popup_ids") || "[]");
    notifications.forEach((n) => {
      if (!dismissed.includes(n.id)) {
        dismissed.push(n.id);
      }
    });
    localStorage.setItem("dismissed_popup_ids", JSON.stringify(dismissed));
    setNotifications([]);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Header Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-border bg-background hover:bg-muted text-foreground"
              asChild
            >
              <Link to="/">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Bell className="w-5 h-5 text-primary" />
                <span className="text-[10px] bg-primary/10 text-primary font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Live Feed
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Notifications Center
              </h1>
            </div>
          </div>

          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="text-slate-500 hover:text-red-500 font-bold self-start sm:self-center gap-2 hover:bg-red-500/5 rounded-full px-4"
            >
              <Trash2 className="w-4 h-4" />
              Clear Announcements
            </Button>
          )}
        </div>

        {/* Notifications Listing */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground font-bold">Loading updates...</p>
          </div>
        ) : notifications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-3xl p-12 text-center shadow-xl shadow-slate-100/50 dark:shadow-none flex flex-col items-center justify-center max-w-md mx-auto"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Bell className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-white mb-2">
              All caught up! 🎉
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed mb-6">
              There are no announcements, offers, or personal updates at the moment. We will notify you when something exciting comes up!
            </p>
            <Button className="rounded-full px-6 font-bold shadow-md shadow-primary/10" asChild>
              <Link to="/">Back to Home</Link>
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {notifications.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-card border border-border rounded-3xl overflow-hidden hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-800 transition-all shadow-md group flex flex-col md:flex-row"
              >
                {/* Notification Image */}
                {item.image_url && (
                  <div className="w-full md:w-80 h-48 md:h-auto min-h-[180px] bg-slate-100 dark:bg-slate-900 shrink-0 relative overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/40 md:from-transparent via-transparent to-transparent" />
                  </div>
                )}

                {/* Content details */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-3 text-muted-foreground text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                      <span className="flex items-center gap-1.5 text-primary">
                        <Sparkles className="w-3.5 h-3.5" />
                        Announcement
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatTime(item.created_at)}
                      </span>
                    </div>

                    <h2 className="text-lg sm:text-xl font-black text-slate-800 dark:text-white tracking-tight leading-tight group-hover:text-primary transition-colors">
                      {item.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed whitespace-pre-wrap">
                      {item.body}
                    </p>
                  </div>

                  {item.url && (
                    <div className="pt-2">
                      <Button
                        className="rounded-full font-bold shadow-md shadow-primary/10 gap-1.5 uppercase text-[10px] tracking-wider h-10 px-5"
                        asChild
                      >
                        <a href={item.url} target="_blank" rel="noopener noreferrer">
                          Explore Offer <ArrowUpRight className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
