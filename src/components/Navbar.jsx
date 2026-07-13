import React, { useState, useEffect } from "react";
import { Menu, X, Phone, Heart, User, Calendar, MessageSquare, Briefcase, Users, Layout, Star, Globe, Bell, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

import Logo from "../assets/dr_kanaks_logo.png";
import NotificationCenter from "./NotificationCenter";

const navLinks = [
  { name: "Home", tamilName: "முகப்பு", href: "/", icon: <Layout className="w-4 h-4" /> },
  { name: "About", tamilName: "பற்றி", href: "/about", icon: <Heart className="w-4 h-4" /> },
  { name: "Services", tamilName: "சேவைகள்", href: "/services", icon: <Briefcase className="w-4 h-4" /> },
  { name: "Testimonials", tamilName: "சான்றுகள்", href: "/#testimonials", icon: <Star className="w-4 h-4 text-yellow-500" /> },
  { name: "Blog", tamilName: "வலைப்பதிவு", href: "/blog", icon: <Users className="w-4 h-4" /> },
  { name: "Contact", tamilName: "தொடர்பு", href: "/contact", icon: <MessageSquare className="w-4 h-4" /> },
];

const Navbar = () => {
  const { pathname, hash } = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lang, setLang] = useState("en");
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [appInstalled, setAppInstalled] = useState(false);

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

    // Observe changes to <html> tag attributes (like lang and class) when translation triggers
    const observer = new MutationObserver(checkLang);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang', 'class'] });

    return () => observer.disconnect();
  }, []);

  const handleLanguageChange = (newLang) => {
    const domains = [
      "",
      window.location.hostname,
      "." + window.location.hostname,
      window.location.hostname.replace(/^www\./, ""),
      "." + window.location.hostname.replace(/^www\./, "")
    ];
    
    // Clear all existing googtrans cookies
    domains.forEach(dom => {
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;" + (dom ? ` domain=${dom};` : "");
    });

    if (newLang === "ta") {
      document.cookie = "googtrans=/en/ta; path=/;";
      domains.forEach(dom => {
        if (dom) {
          document.cookie = `googtrans=/en/ta; path=/; domain=${dom};`;
        }
      });
      setLang("ta");
    } else {
      // For English, we just delete all googtrans cookies and let the page render natively
      setLang("en");
    }
    window.location.reload();
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    // Force Light Theme Only
    document.documentElement.classList.remove("dark");
    localStorage.removeItem("theme");

    // PWA Install prompt
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => {
      setAppInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setAppInstalled(true);
    }
    setDeferredPrompt(null);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        isScrolled 
          ? "bg-background/90 backdrop-blur-md py-3 border-border shadow-sm" 
          : "bg-transparent py-5 border-transparent"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center group decoration-none py-1"
        >
          <img src={Logo} className="h-9 sm:h-14 w-auto object-contain transition-transform group-hover:scale-105" alt="Dr. Kanaks Clinic" />
        </Link>

        {/* Desktop Links */}
        <nav className="hidden lg:flex items-center gap-1.5 relative">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (pathname === '/' && link.href === '/' && !hash) || (hash && link.href.endsWith(hash));
            return (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  "relative px-4 py-2 text-sm font-semibold transition-all duration-300 decoration-none rounded-full flex items-center gap-1.5 z-10",
                  isActive
                    ? "text-primary dark:text-blue-400"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavBackground"
                    className="absolute inset-0 bg-primary/10 dark:bg-primary/20 rounded-full -z-10 border border-primary/15 dark:border-primary/30"
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  />
                )}
                <span className="notranslate">{lang === 'ta' ? link.tamilName : link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* CTA & Mobile Menu */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          <NotificationCenter />

          {/* Desktop Language Switcher */}
          <Button
            variant="ghost"
            size="sm"
            className="notranslate rounded-full px-3 h-9 sm:h-11 hover:bg-muted text-foreground font-bold border border-border flex items-center gap-1.5 shrink-0"
            onClick={() => handleLanguageChange(lang === "en" ? "ta" : "en")}
          >
            <Globe className="w-4 h-4 text-primary shrink-0" />
            <span className="text-xs shrink-0">{lang === "en" ? "தமிழ்" : "English"}</span>
          </Button>

          {/* Install App Button — Desktop */}
          {deferredPrompt && !appInstalled && (
            <Button
              variant="outline"
              size="sm"
              className="notranslate hidden sm:flex rounded-full px-3 h-9 sm:h-11 hover:bg-green-50 text-green-700 font-bold border border-green-200 bg-green-50/60 items-center gap-1.5 shrink-0 shadow-sm hover:border-green-400 transition-all"
              onClick={handleInstallApp}
            >
              <Download className="w-4 h-4 shrink-0" />
              <span className="text-xs shrink-0 notranslate">{lang === 'ta' ? "பயன்பாடு" : "Install App"}</span>
            </Button>
          )}

           <Button variant="outline" className="hidden sm:flex rounded-full gap-2 border-border bg-background hover:bg-muted text-foreground font-bold shadow-sm" asChild>
            <Link to="/profile">
              <User className="w-4 h-4" />
              <span className="notranslate">{lang === 'ta' ? "சுயவிவரம்" : "Profile"}</span>
            </Link>
          </Button>
          
          <Button className="rounded-full shadow-lg shadow-primary/25 hidden md:flex h-11" asChild>
            <Link to="/book" className="notranslate">{lang === 'ta' ? "முன்பதிவு" : "Book Appointment"}</Link>
          </Button>

          {/* Mobile Menu */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden rounded-xl h-9 w-9 sm:h-11 sm:w-11">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] p-0 border-l-0 dark:bg-slate-950 flex flex-col h-full overflow-hidden">
              <SheetHeader className="text-left py-4 px-6 border-b border-border bg-slate-50 dark:bg-slate-900/50">
                <SheetTitle className="flex items-center gap-3">
                  <div className="bg-white p-1 rounded-lg border border-border">
                    <img src={Logo} className="w-5 h-5 object-contain" alt="Logo" />
                  </div>
                  <span className="font-black text-sm uppercase tracking-widest text-slate-800 dark:text-white notranslate">
                    {lang === 'ta' ? "முன்பதிவு வழிகாட்டி" : "Clinical Menu"}
                  </span>
                </SheetTitle>
              </SheetHeader>

              {/* Compact Nav Links */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-primary/5 text-slate-600 dark:text-slate-400 font-bold text-xs transition-all decoration-none group"
                  >
                    <div className="p-1.5 bg-white dark:bg-slate-900 rounded-lg shadow-xs border border-border group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-colors">
                      {React.cloneElement(link.icon, { className: "w-3.5 h-3.5" })}
                    </div>
                    <span className="notranslate">{lang === 'ta' ? link.tamilName : link.name}</span>
                  </Link>
                ))}
                
                {/* Profile Link in Mobile */}
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-primary/5 text-slate-600 dark:text-slate-400 font-bold text-xs transition-all decoration-none group"
                >
                  <div className="p-1.5 bg-white dark:bg-slate-900 rounded-lg shadow-xs border border-border group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-colors">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <span className="notranslate">{lang === 'ta' ? "சுயவிவரம்" : "My Profile"}</span>
                </Link>
              </div>

              {/* Bottom Compact CTA */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-border mt-auto">
                {deferredPrompt && !appInstalled && (
                  <Button
                    className="notranslate w-full rounded-xl mb-3 h-9 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20"
                    onClick={() => { handleInstallApp(); setIsMenuOpen(false); }}
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{lang === 'ta' ? "பயன்பாட்டை நிறுவு" : "Install App"}</span>
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  className="w-full rounded-xl mb-3 h-9 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 border-slate-200"
                  onClick={() => {
                    window.dispatchEvent(new Event('triggerPushPrompt'));
                    setIsMenuOpen(false);
                  }}
                >
                  <Bell className="w-3.5 h-3.5 text-primary animate-pulse" />
                  <span className="notranslate">{lang === 'ta' ? "அறிவிப்புகளை அனுமதி" : "Allow Notifications"}</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="notranslate w-full rounded-xl mb-3 h-9 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 border-slate-200"
                  onClick={() => {
                    handleLanguageChange(lang === "en" ? "ta" : "en");
                    setIsMenuOpen(false);
                  }}
                >
                  <Globe className="w-3.5 h-3.5 text-primary" />
                  {lang === "en" ? "தமிழ்" : "English"}
                </Button>
                 <Button className="w-full rounded-xl py-4 h-9 text-[10px] font-black uppercase tracking-widest mb-3 bg-primary shadow-lg shadow-primary/20" asChild onClick={() => setIsMenuOpen(false)}>
                  <Link to="/book" className="notranslate">{lang === 'ta' ? "முன்பதிவு" : "Book Appointment"}</Link>
                </Button>
                <div className="flex items-center justify-center gap-2 text-primary font-black text-[10px] uppercase tracking-tighter">
                  <Phone className="w-3 h-3" />
                  +91 97504 51176
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
