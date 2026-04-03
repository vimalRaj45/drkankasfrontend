import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Briefcase, Users, User, Calendar, Layout } from "lucide-react";
import { cn } from "@/lib/utils";

const mobileLinks = [
  { name: "Home", href: "/", icon: <Layout className="w-5 h-5" /> },
  { name: "Services", href: "/services", icon: <Briefcase className="w-5 h-5" /> },
  { name: "Doctors", href: "/doctors", icon: <Users className="w-5 h-5" /> },
  { name: "Book", href: "/book", icon: <Calendar className="w-5 h-5" /> },
  { name: "Profile", href: "/profile", icon: <User className="w-5 h-5" /> },
];

const MobileBottomNav = () => {
  const { pathname, hash } = useLocation();
  const currentPath = pathname + hash;

  const isActive = (href) => {
    if (href === "/" && currentPath === "/") return true;
    if (href !== "/" && currentPath.includes(href)) return true;
    return false;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] lg:hidden bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-t border-border px-4 py-2 safe-area-bottom">
      <div className="flex items-center justify-around">
        {mobileLinks.map((link) => {
          const active = isActive(link.href);
          
          return (
            <Link
              key={link.name}
              to={link.href === "/" ? "/" : link.href}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-300 gap-1 min-w-[64px] decoration-none",
                active 
                  ? "text-primary scale-110" 
                  : "text-slate-500 dark:text-slate-400 opacity-60 hover:opacity-100"
              )}
            >
              <div className={cn(
                "p-1.5 rounded-xl transition-colors",
                active && "bg-primary/10"
              )}>
                {link.icon}
              </div>
              <span className={cn(
                "text-[9px] font-bold uppercase tracking-widest",
                active ? "opacity-100" : "opacity-0"
              )}>
                {link.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
