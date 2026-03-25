import { Link, useLocation } from "wouter";
import { ChevronDown, Menu, Globe, Shield } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const NAV_ITEMS = [
  {
    label: "About",
    href: "/about",
    dropdown: [
      { label: "Vision & Mission", href: "/about#vision" },
      { label: "Leadership", href: "/about#leadership" },
      { label: "Strategy", href: "/about#strategy" },
      { label: "Contact", href: "/about#contact" },
    ]
  },
  {
    label: "Programs",
    href: "/programs",
    dropdown: [
      { label: "Accelerator", href: "/programs/accelerator" },
      { label: "Incubation", href: "/programs/incubation" },
      { label: "Training", href: "/programs/training" },
    ]
  },
  {
    label: "Ecosystem",
    href: "/ecosystem",
  },
  {
    label: "Market Hub",
    href: "/market-hub",
    isRestricted: true,
  },
  {
    label: "Opportunities",
    href: "/opportunities",
  },
  {
    label: "Network",
    href: "/projects",
  },
  {
    label: "Community",
    href: "/community",
  },
  {
    label: "Impact",
    href: "/impact",
  }
];

export function TopNav() {
  const [location] = useLocation();
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);

  return (
    <nav className="sticky top-0 z-50 w-full glass-panel border-b-0 border-white/5">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-emerald-700 flex items-center justify-center shadow-lg shadow-primary/20">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <Link href="/" className="font-display font-bold text-2xl tracking-wide text-white">
              EAAPA<span className="text-primary">.</span>
            </Link>
          </div>
          
          <div className="hidden lg:flex items-center space-x-1">
            {NAV_ITEMS.map((item) => {
              const isActive = location === item.href || location.startsWith(item.href + '/');
              return (
                <div 
                  key={item.label}
                  className="relative px-2 py-2"
                  onMouseEnter={() => setHoveredMenu(item.label)}
                  onMouseLeave={() => setHoveredMenu(null)}
                >
                  <Link 
                    href={item.href}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive 
                        ? "text-white bg-white/10" 
                        : "text-muted-foreground hover:text-white hover:bg-white/5"
                    )}
                  >
                    {item.isRestricted && <Shield className="w-3.5 h-3.5 text-secondary" />}
                    {item.label}
                    {item.dropdown && <ChevronDown className="w-4 h-4 opacity-50" />}
                  </Link>

                  {item.dropdown && (
                    <AnimatePresence>
                      {hoveredMenu === item.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 5, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-0 mt-2 w-56 rounded-xl glass-panel p-2 shadow-2xl border border-white/10"
                        >
                          {item.dropdown.map((drop) => (
                            <Link
                              key={drop.label}
                              href={drop.href}
                              className="block px-4 py-2.5 text-sm text-muted-foreground hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                            >
                              {drop.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            <button className="hidden md:block px-6 py-2.5 text-sm font-semibold rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all">
              Sign In
            </button>
            <button className="px-6 py-2.5 text-sm font-semibold rounded-lg bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5">
              Join EAAPA
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
