import { Link, useLocation } from "wouter";
import { ChevronDown, ChevronRight, Menu, Globe, Shield, Lock, X } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type DropdownItem = { label: string; href: string };
type NavItem = {
  label: string;
  href: string;
  isRestricted?: boolean;
  dropdown?: DropdownItem[];
};

const NAV_ITEMS: NavItem[] = [
  {
    label: "About",
    href: "/about",
    dropdown: [
      { label: "Vision & Mission", href: "/about#vision" },
      { label: "Leadership & Governance", href: "/about#leadership" },
      { label: "Strategy", href: "/about#strategy" },
      { label: "Partners & Collaborators", href: "/about#partners" },
      { label: "Contact", href: "/about#contact" },
    ],
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
    ],
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
    ],
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
    ],
  },
  {
    label: "Opportunities",
    href: "/opportunities",
    dropdown: [
      { label: "Investment Opportunities", href: "/opportunities" },
      { label: "Funding Programs", href: "/opportunities" },
      { label: "Value Chain Projects", href: "/opportunities" },
      { label: "Submit Your Idea", href: "/opportunities" },
    ],
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
    ],
  },
  {
    label: "Community",
    href: "/community",
    dropdown: [
      { label: "Forum", href: "/community" },
      { label: "Mentor Network", href: "/community" },
      { label: "Agripreneur Challenge", href: "/community" },
      { label: "News & Updates", href: "/community" },
    ],
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
    ],
  },
  {
    label: "Events",
    href: "/events",
    dropdown: [
      { label: "Upcoming Events", href: "/events" },
      { label: "Exhibitions", href: "/events" },
      { label: "Workshops", href: "/events" },
      { label: "All Events", href: "/events" },
    ],
  },
  {
    label: "Impact",
    href: "/impact",
    dropdown: [
      { label: "Success Stories", href: "/impact" },
      { label: "Case Studies", href: "/impact" },
      { label: "Impact Metrics", href: "/impact" },
    ],
  },
  {
    label: "Documents",
    href: "/documents",
    dropdown: [
      { label: "All Documents",        href: "/documents" },
      { label: "Licences",             href: "/documents?category=licences" },
      { label: "Contracts",            href: "/documents?category=contracts" },
      { label: "Agreements",           href: "/documents?category=agreements" },
      { label: "Sales Requirements",   href: "/documents?category=sales_requirements" },
      { label: "Reports",              href: "/documents?category=reports" },
      { label: "Certificates",         href: "/documents?category=certificates" },
      { label: "Exhibits",             href: "/documents?category=exhibits" },
      { label: "Notifications",        href: "/documents?category=notifications" },
      { label: "Messages",             href: "/documents?category=messages" },
      { label: "User Documents",       href: "/documents?category=user_documents" },
      { label: "System Generated",     href: "/documents?category=system_generated" },
      { label: "Marketing Documents",  href: "/documents?category=marketing" },
      { label: "Financial Documents",  href: "/documents?category=financial" },
      { label: "Legal Documents",      href: "/documents?category=legal" },
    ],
  },
];

function DesktopNavItem({
  item,
  isActive,
  alignRight,
}: {
  item: NavItem;
  isActive: boolean;
  alignRight: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => setOpen(true);
  const handleMouseLeave = () => setOpen(false);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={item.href}
        className={cn(
          "flex items-center gap-1 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
          isActive
            ? "text-white bg-white/10"
            : "text-muted-foreground hover:text-white hover:bg-white/5"
        )}
        aria-haspopup={item.dropdown ? "true" : undefined}
        aria-expanded={item.dropdown ? open : undefined}
      >
        {item.isRestricted && <Shield className="w-3 h-3 text-secondary flex-shrink-0" />}
        {item.label}
        {item.dropdown && (
          <ChevronDown
            className={cn(
              "w-3 h-3 opacity-50 transition-transform duration-150 flex-shrink-0",
              open && "rotate-180 opacity-100"
            )}
          />
        )}
      </Link>

      {item.dropdown && (
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.97 }}
              transition={{ duration: 0.13, ease: "easeOut" }}
              className={cn(
                "absolute top-full mt-1 w-60 rounded-xl glass-panel p-1.5 shadow-2xl border border-white/10 z-[200]",
                alignRight ? "right-0" : "left-0"
              )}
              role="menu"
            >
              {item.dropdown.map((drop) => (
                <Link
                  key={drop.label}
                  href={drop.href}
                  role="menuitem"
                  className="flex items-center gap-2 px-3.5 py-2.5 text-sm text-muted-foreground hover:text-white hover:bg-white/5 rounded-lg transition-colors focus-visible:outline-none focus-visible:bg-white/5"
                >
                  {item.isRestricted && (
                    <Lock className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
                  )}
                  {drop.label}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

function MobileAccordionItem({
  item,
  isActive,
  onNavigate,
}: {
  item: NavItem;
  isActive: boolean;
  onNavigate: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-b border-white/[0.06] last:border-0">
      <div className="flex items-center">
        <Link
          href={item.href}
          onClick={onNavigate}
          className={cn(
            "flex-1 flex items-center gap-2.5 px-4 py-3.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:bg-white/5 rounded-l-lg",
            isActive ? "text-white" : "text-white/70 hover:text-white"
          )}
        >
          {item.isRestricted && <Shield className="w-4 h-4 text-secondary flex-shrink-0" />}
          {item.label}
          {isActive && <span className="ml-auto w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />}
        </Link>
        {item.dropdown && (
          <button
            onClick={() => setExpanded((p) => !p)}
            className="px-3 py-3.5 text-white/40 hover:text-white transition-colors focus-visible:outline-none"
            aria-label={expanded ? "Collapse" : "Expand"}
            aria-expanded={expanded}
          >
            <ChevronRight
              className={cn(
                "w-4 h-4 transition-transform duration-200",
                expanded && "rotate-90"
              )}
            />
          </button>
        )}
      </div>

      <AnimatePresence>
        {expanded && item.dropdown && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-2 pl-4 pr-2 space-y-0.5">
              {item.dropdown.map((drop) => (
                <Link
                  key={drop.label}
                  href={drop.href}
                  onClick={onNavigate}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-colors focus-visible:outline-none focus-visible:bg-white/5"
                >
                  {item.isRestricted && (
                    <Lock className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
                  )}
                  {drop.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function TopNav() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    closeMobile();
  }, [location, closeMobile]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const TOTAL = NAV_ITEMS.length;

  return (
    <>
      <nav
        className="sticky top-0 z-[100] w-full border-b border-white/[0.06]"
        style={{ background: "rgba(10,14,23,0.92)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 lg:h-[68px]">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-emerald-700 flex items-center justify-center shadow-lg shadow-primary/20 flex-shrink-0">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <Link
                href="/"
                className="font-display font-bold text-xl tracking-wide text-white focus-visible:outline-none"
              >
                EAAPA<span className="text-primary">.</span>
              </Link>
            </div>

            {/* Desktop nav — hidden below 2xl, shown from 2xl up as full row */}
            <div className="hidden 2xl:flex items-center gap-0.5 flex-1 justify-center px-4">
              {NAV_ITEMS.map((item, idx) => {
                const isActive =
                  location === item.href ||
                  location.startsWith(item.href + "/");
                const alignRight = idx >= TOTAL - 3;
                return (
                  <DesktopNavItem
                    key={item.label}
                    item={item}
                    isActive={isActive}
                    alignRight={alignRight}
                  />
                );
              })}
            </div>

            {/* Desktop nav — xl to 2xl: split into two rows using a mega-bar */}
            <div className="hidden xl:flex 2xl:hidden items-center gap-0.5 flex-1 justify-center px-2">
              {NAV_ITEMS.slice(0, 7).map((item, idx) => {
                const isActive =
                  location === item.href ||
                  location.startsWith(item.href + "/");
                return (
                  <DesktopNavItem
                    key={item.label}
                    item={item}
                    isActive={isActive}
                    alignRight={idx >= 5}
                  />
                );
              })}
              {/* More menu for remaining items */}
              <MoreMenu items={NAV_ITEMS.slice(7)} location={location} />
            </div>

            {/* CTA buttons — desktop */}
            <div className="hidden xl:flex items-center gap-3 flex-shrink-0">
              <button className="px-4 py-2 text-sm font-semibold rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20">
                Sign In
              </button>
              <button className="px-4 py-2 text-sm font-semibold rounded-lg bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50">
                Join EAAPA
              </button>
            </div>

            {/* Hamburger — below xl */}
            <button
              className="xl:hidden flex items-center justify-center w-10 h-10 rounded-lg text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
              onClick={() => setMobileOpen((p) => !p)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-drawer"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[98] bg-black/60 backdrop-blur-sm xl:hidden"
              onClick={closeMobile}
              aria-hidden="true"
            />

            {/* Drawer */}
            <motion.aside
              key="drawer"
              id="mobile-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed top-0 right-0 bottom-0 z-[99] w-full max-w-[320px] flex flex-col xl:hidden"
              style={{
                background: "rgba(10,14,23,0.98)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                borderLeft: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] flex-shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-emerald-700 flex items-center justify-center">
                    <Globe className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-display font-bold text-lg text-white">
                    EAAPA<span className="text-primary">.</span>
                  </span>
                </div>
                <button
                  onClick={closeMobile}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
                  aria-label="Close navigation"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable nav items */}
              <div className="flex-1 overflow-y-auto overscroll-contain px-2 py-2">
                {NAV_ITEMS.map((item) => {
                  const isActive =
                    location === item.href ||
                    location.startsWith(item.href + "/");
                  return (
                    <MobileAccordionItem
                      key={item.label}
                      item={item}
                      isActive={isActive}
                      onNavigate={closeMobile}
                    />
                  );
                })}
              </div>

              {/* Drawer footer CTA */}
              <div className="flex-shrink-0 px-4 py-5 border-t border-white/[0.06] flex flex-col gap-3">
                <button className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-sm hover:bg-white/10 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20">
                  Sign In
                </button>
                <button className="w-full py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50">
                  Join EAAPA
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function MoreMenu({ items, location }: { items: NavItem[]; location: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const hasActive = items.some(
    (item) => location === item.href || location.startsWith(item.href + "/")
  );

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className={cn(
          "flex items-center gap-1 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
          hasActive || open
            ? "text-white bg-white/10"
            : "text-muted-foreground hover:text-white hover:bg-white/5"
        )}
        aria-haspopup="true"
        aria-expanded={open}
      >
        More
        <ChevronDown
          className={cn(
            "w-3 h-3 opacity-50 transition-transform duration-150",
            open && "rotate-180 opacity-100"
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.13, ease: "easeOut" }}
            className="absolute top-full right-0 mt-1 w-64 rounded-xl p-1.5 shadow-2xl border border-white/10 z-[200] max-h-[70vh] overflow-y-auto"
            style={{
              background: "rgba(10,14,23,0.97)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
            role="menu"
          >
            {items.map((item) => {
              const isActive =
                location === item.href || location.startsWith(item.href + "/");
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center justify-between gap-2 px-3.5 py-2.5 text-sm rounded-lg transition-colors focus-visible:outline-none focus-visible:bg-white/5",
                    isActive
                      ? "text-white bg-white/10"
                      : "text-muted-foreground hover:text-white hover:bg-white/5"
                  )}
                >
                  <span className="flex items-center gap-2">
                    {item.isRestricted && (
                      <Shield className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
                    )}
                    {item.label}
                  </span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                  )}
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
