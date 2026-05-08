import { Link, useLocation } from "wouter";
import { ChevronDown, Menu, Globe, Shield, Lock } from "lucide-react";
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
      { label: "Leadership & Governance", href: "/about#leadership" },
      { label: "Strategy", href: "/about#strategy" },
      { label: "Partners & Collaborators", href: "/about#partners" },
      { label: "Contact", href: "/about#contact" },
    ]
  },
  {
    label: "Programs",
    href: "/programs",
    dropdown: [
      { label: "Accelerator", href: "/programs#accelerator" },
      { label: "Incubation", href: "/programs#incubation" },
      { label: "Training & Capacity Building", href: "/programs#training" },
      { label: "Mentorship Programs", href: "/programs#mentorship" },
      { label: "Youth Agripreneurs", href: "/programs#youth" },
    ]
  },
  {
    label: "Ecosystem",
    href: "/ecosystem",
    dropdown: [
      { label: "Agripreneurs Directory", href: "/ecosystem" },
      { label: "Agribusinesses", href: "/ecosystem" },
      { label: "Partners", href: "/ecosystem" },
      { label: "Investors", href: "/ecosystem" },
      { label: "Mentors", href: "/ecosystem" },
      { label: "Satellite Centers", href: "/ecosystem" },
    ]
  },
  {
    label: "Market Hub",
    href: "/market-hub",
    isRestricted: true,
    dropdown: [
      { label: "Market Intelligence", href: "/market-hub" },
      { label: "Commodity Prices", href: "/market-hub" },
      { label: "Buyer Directory", href: "/market-hub" },
      { label: "Export Opportunities", href: "/market-hub" },
      { label: "Supply Chain", href: "/market-hub" },
    ]
  },
  {
    label: "Opportunities",
    href: "/opportunities",
    dropdown: [
      { label: "Investment Opportunities", href: "/opportunities" },
      { label: "Funding Programs", href: "/opportunities" },
      { label: "Value Chain Projects", href: "/opportunities" },
      { label: "Submit Your Idea", href: "/opportunities" },
    ]
  },
  {
    label: "Network",
    href: "/network",
    dropdown: [
      { label: "Collaboration Hub", href: "/network" },
      { label: "Connection Hub", href: "/network" },
      { label: "Project Rooms", href: "/network" },
      { label: "Knowledge Sharing", href: "/network" },
      { label: "Buyer Network", href: "/buyer-network" },
    ]
  },
  {
    label: "Community",
    href: "/community",
    dropdown: [
      { label: "Forum", href: "/community" },
      { label: "Mentor Network", href: "/community" },
      { label: "Agripreneur Challenge", href: "/community" },
      { label: "News & Updates", href: "/community" },
    ]
  },
  {
    label: "Resources",
    href: "/resources",
    dropdown: [
      { label: "Research & Reports", href: "/resources" },
      { label: "Knowledge Center", href: "/resources" },
      { label: "Best Practices", href: "/resources" },
      { label: "Training Materials", href: "/resources" },
      { label: "Policy & Regulations", href: "/resources" },
    ]
  },
  {
    label: "Events",
    href: "/events",
    dropdown: [
      { label: "Upcoming Events", href: "/events" },
      { label: "Exhibitions", href: "/events" },
      { label: "Workshops", href: "/events" },
      { label: "All Events", href: "/events" },
    ]
  },
  {
    label: "Impact",
    href: "/impact",
    dropdown: [
      { label: "Success Stories", href: "/impact" },
      { label: "Case Studies", href: "/impact" },
      { label: "Impact Metrics", href: "/impact" },
    ]
  }
];

export function TopNav() {
  const [location] = useLocation();
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          
          <div className="hidden xl:flex items-center space-x-0.5">
            {NAV_ITEMS.map((item) => {
              const isActive = location === item.href || location.startsWith(item.href + '/');
              return (
                <div 
                  key={item.label}
                  className="relative px-1 py-4"
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
                    {item.dropdown && <ChevronDown className="w-3.5 h-3.5 opacity-50" />}
                  </Link>

                  {item.dropdown && (
                    <AnimatePresence>
                      {hoveredMenu === item.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 5, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-[85%] left-0 mt-2 w-64 rounded-xl glass-panel p-2 shadow-2xl border border-white/10"
                        >
                          {item.dropdown.map((drop) => (
                            <Link
                              key={drop.label}
                              href={drop.href}
                              className="flex items-center gap-2 px-4 py-2.5 text-sm text-muted-foreground hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                            >
                              {item.isRestricted && <Lock className="w-3.5 h-3.5 text-secondary" />}
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

          <div className="hidden xl:flex items-center gap-4">
            <button className="px-6 py-2.5 text-sm font-semibold rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all">
              Sign In
            </button>
            <button className="px-6 py-2.5 text-sm font-semibold rounded-lg bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5">
              Join EAAPA
            </button>
          </div>

          <button 
            className="xl:hidden p-2 text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden border-t border-white/10 bg-background overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {NAV_ITEMS.map(item => (
                <Link 
                  key={item.label}
                  href={item.href}
                  className="block px-4 py-3 text-white font-medium rounded-lg hover:bg-white/5"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center gap-2">
                    {item.isRestricted && <Shield className="w-4 h-4 text-secondary" />}
                    {item.label}
                  </div>
                </Link>
              ))}
              <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                <button className="w-full py-3 rounded-lg bg-white/5 text-white font-semibold border border-white/10">Sign In</button>
                <button className="w-full py-3 rounded-lg bg-primary text-white font-semibold">Join EAAPA</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
