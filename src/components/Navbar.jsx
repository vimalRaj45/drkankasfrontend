import React, { useState, useEffect } from "react";
import { Menu, X, Phone, Heart, User, Calendar, MessageSquare, Briefcase, Users, Layout, Moon, Sun, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "Home", href: "/", icon: <Layout className="w-4 h-4" /> },
  { name: "About", href: "/about", icon: <Heart className="w-4 h-4" /> },
  { name: "Services", href: "/services", icon: <Briefcase className="w-4 h-4" /> },
  { name: "Testimonials", href: "/#testimonials", icon: <Star className="w-4 h-4 text-yellow-500" /> },
  { name: "Blog", href: "/blog", icon: <Users className="w-4 h-4" /> },
  { name: "Appointment", href: "/book", icon: <Calendar className="w-4 h-4" /> },
  { name: "Contact", href: "/contact", icon: <MessageSquare className="w-4 h-4" /> },
];

const Navbar = () => {
  const { pathname, hash } = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeToken, setActiveToken] = useState("Home");
  const [isDark, setIsDark] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    // Initial theme check
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
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
          className="flex items-center gap-2 group decoration-none"
        >
          <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">
            <Heart className="w-6 h-6 text-white fill-white/20" />
          </div>
          <span className="text-2xl font-black tracking-tight text-foreground">
            Dr. Kanak's
          </span>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden lg:flex items-center gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              onClick={() => setActiveToken(link.name)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 decoration-none flex items-center gap-2",
                pathname === link.href || (pathname === '/' && link.href === '/' && !hash)
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-foreground/70 hover:bg-muted hover:text-foreground"
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* CTA & Mobile Menu & Theme Toggle */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full h-11 w-11 hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={toggleTheme}
          >
            {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-foreground/70" />}
          </Button>

          <Button variant="outline" className="hidden sm:flex rounded-full gap-2 border-border bg-background hover:bg-muted text-foreground font-bold shadow-sm" asChild>
            <Link to="/profile">
              <User className="w-4 h-4" />
              Profile
            </Link>
          </Button>
          
          <Button className="rounded-full shadow-lg shadow-primary/25 hidden md:flex h-11" asChild>
            <Link to="/book">Book Appointment</Link>
          </Button>

          {/* Mobile Menu */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden rounded-xl h-11 w-11">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] p-0 border-l-0 dark:bg-slate-950 flex flex-col h-full overflow-hidden">
              <SheetHeader className="text-left py-4 px-6 border-b border-border bg-slate-50 dark:bg-slate-900/50">
                <SheetTitle className="flex items-center gap-3">
                  <div className="bg-primary p-1.5 rounded-lg">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-black text-sm uppercase tracking-widest text-slate-800 dark:text-white">Clinical Menu</span>
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
                    {link.name}
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
                  My Profile
                </Link>
              </div>

              {/* Bottom Compact CTA */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-border mt-auto">
                <Button className="w-full rounded-xl py-4 h-9 text-[10px] font-black uppercase tracking-widest mb-3 bg-primary shadow-lg shadow-primary/20" asChild onClick={() => setIsMenuOpen(false)}>
                  <Link to="/book">Book Appointment</Link>
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
