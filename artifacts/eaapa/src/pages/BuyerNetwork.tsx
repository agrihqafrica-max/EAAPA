import { useState, useMemo } from "react";
import { useListBuyers } from "@workspace/api-client-react";
import { LoadingScreen } from "@/components/ui/Loading";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, SlidersHorizontal, ShoppingCart, Globe, Star, TrendingUp,
  Zap, CheckCircle2, AlertCircle, Clock, MessageSquare, Package,
  ArrowUpRight, ChevronDown, Filter, X, Users, BarChart3,
  Truck, FileText, MapPin, Shield, Sparkles, Building2, Send,
  Phone, Mail, ExternalLink, Tag, AlertTriangle
} from "lucide-react";

const BUYER_TYPES = ["All", "Exporter", "Retail", "Platform", "Processor", "Distributor"];
const COMMODITIES = ["All", "Avocado", "Coffee", "Macadamia", "Tea", "Flowers", "Vanilla", "Maize", "Fish"];
const TRADE_READINESS = ["All", "Ready", "Partial", "In Progress"];
const COUNTRIES = ["All", "Netherlands", "Kenya", "USA", "UAE", "Rwanda", "Uganda", "Germany", "UK"];

const READINESS_CONFIG: Record<string, { color: string; bg: string; icon: any }> = {
  Ready:       { color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20", icon: CheckCircle2 },
  Partial:     { color: "text-amber-400",   bg: "bg-amber-400/10 border-amber-400/20",   icon: AlertCircle },
  "In Progress": { color: "text-blue-400",  bg: "bg-blue-400/10 border-blue-400/20",     icon: Clock },
};

const TYPE_COLORS: Record<string, string> = {
  Exporter:    "from-emerald-500/20 to-teal-500/20 border-emerald-500/30",
  Retail:      "from-blue-500/20 to-indigo-500/20 border-blue-500/30",
  Platform:    "from-violet-500/20 to-purple-500/20 border-violet-500/30",
  Processor:   "from-amber-500/20 to-orange-500/20 border-amber-500/30",
  Distributor: "from-rose-500/20 to-pink-500/20 border-rose-500/30",
};

function ScoreRing({ score, size = 56 }: { score: number; size?: number }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  const color = score >= 90 ? "#10b981" : score >= 75 ? "#f59e0b" : "#3b82f6";
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.06)" strokeWidth={6} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={6} fill="none"
          strokeDasharray={`${fill} ${circ}`} strokeLinecap="round" style={{ transition: "stroke-dasharray 1s ease" }} />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">{score}</span>
    </div>
  );
}

function SustainabilityBar({ score }: { score: number }) {
  const color = score >= 90 ? "bg-emerald-400" : score >= 75 ? "bg-amber-400" : "bg-blue-400";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs text-white/60 w-6">{score}</span>
    </div>
  );
}

function InquiryModal({ buyer, onClose }: { buyer: any; onClose: () => void }) {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", commodity: buyer.commodities?.[0] || "", volume: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      toast({ title: "Inquiry Sent!", description: `Your inquiry has been sent to ${buyer.name}.` });
      onClose();
    }, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="glass-panel rounded-3xl w-full max-w-lg p-8 border border-white/10 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Trade Inquiry</h3>
            <p className="text-sm text-muted-foreground">Sending to <span className="text-primary">{buyer.name}</span></p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 text-muted-foreground hover:text-white transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {sent ? (
          <div className="flex flex-col items-center py-8 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <p className="text-white font-semibold">Sending your inquiry...</p>
          </div>
        ) : (
          <form onSubmit={handleSend} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-white/60 mb-1 block">Your Name</label>
                <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
                  placeholder="e.g. Amara Nkosi" />
              </div>
              <div>
                <label className="text-xs text-white/60 mb-1 block">Email</label>
                <input required type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
                  placeholder="you@farm.com" />
              </div>
            </div>
            <div>
              <label className="text-xs text-white/60 mb-1 block">Commodity</label>
              <select value={form.commodity} onChange={e => setForm(p => ({ ...p, commodity: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none transition-all">
                {buyer.commodities?.map((c: string) => <option key={c} value={c} className="bg-background">{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-white/60 mb-1 block">Volume Available (tons/month)</label>
              <input required value={form.volume} onChange={e => setForm(p => ({ ...p, volume: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
                placeholder="e.g. 25 tons/month" />
            </div>
            <div>
              <label className="text-xs text-white/60 mb-1 block">Message</label>
              <textarea required value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all resize-none"
                placeholder="Describe your product, quality certifications, and availability..." />
            </div>
            <button type="submit"
              className="w-full py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 shadow-lg shadow-primary/20">
              <Send className="w-4 h-4" /> Send Inquiry to {buyer.name}
            </button>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}

function BuyerCard({ buyer, index, onInquire }: { buyer: any; index: number; onInquire: (b: any) => void }) {
  const [expanded, setExpanded] = useState(false);
  const readiness = READINESS_CONFIG[buyer.tradeReadiness] || READINESS_CONFIG["Partial"];
  const ReadinessIcon = readiness.icon;
  const gradientClass = TYPE_COLORS[buyer.type] || TYPE_COLORS["Exporter"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className={`bg-gradient-to-br ${gradientClass} border rounded-2xl p-5 flex flex-col gap-4 hover:shadow-xl hover:shadow-black/20 transition-all group relative overflow-hidden`}
    >
      {buyer.isAiRecommended && (
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary/20 border border-secondary/30">
          <Sparkles className="w-3 h-3 text-secondary" />
          <span className="text-[10px] font-bold text-secondary">AI MATCH</span>
        </div>
      )}

      {/* Header Row */}
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center flex-shrink-0 text-lg font-bold text-white shadow-inner">
          {buyer.name?.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-white text-base leading-tight truncate pr-14">{buyer.name}</h3>
          <div className="flex items-center gap-1.5 mt-0.5">
            <MapPin className="w-3 h-3 text-white/40 flex-shrink-0" />
            <span className="text-xs text-white/50 truncate">{buyer.location}</span>
          </div>
        </div>
        <ScoreRing score={buyer.aiMatchScore || 80} size={48} />
      </div>

      {/* Type Badge + Readiness */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white text-xs font-semibold border border-white/10">
          {buyer.type}
        </span>
        <span className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border ${readiness.bg} ${readiness.color}`}>
          <ReadinessIcon className="w-3 h-3" />
          {buyer.tradeReadiness}
        </span>
      </div>

      {/* Commodities */}
      <div className="flex flex-wrap gap-1.5">
        {buyer.commodities?.slice(0, 4).map((c: string) => (
          <span key={c} className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/20 text-white/70 text-xs border border-white/5">
            <Tag className="w-2.5 h-2.5" /> {c}
          </span>
        ))}
        {(buyer.commodities?.length || 0) > 4 && (
          <span className="px-2 py-0.5 rounded-md bg-black/20 text-white/40 text-xs">+{buyer.commodities.length - 4}</span>
        )}
      </div>

      {/* Demand Stats */}
      <div className="grid grid-cols-3 gap-2 bg-black/20 rounded-xl p-3 border border-white/5">
        {[
          { label: "Weekly", value: buyer.weeklyDemandTons, suffix: "T" },
          { label: "Monthly", value: buyer.monthlyDemandTons, suffix: "T" },
          { label: "Yearly", value: buyer.yearlyDemandTons ? (parseFloat(buyer.yearlyDemandTons) / 1000).toFixed(1) + "K" : "—", suffix: "T" },
        ].map(stat => (
          <div key={stat.label} className="text-center">
            <div className="text-base font-bold text-white">{stat.value || "—"}<span className="text-xs text-white/40">{stat.value ? stat.suffix : ""}</span></div>
            <div className="text-[10px] text-white/40 uppercase tracking-wide">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Sustainability */}
      <div>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-white/40">Sustainability Score</span>
          <span className="text-white/60 font-semibold">{buyer.sustainabilityScore}/100</span>
        </div>
        <SustainabilityBar score={buyer.sustainabilityScore || 70} />
      </div>

      {/* Expanded Section */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-white/10 pt-3 space-y-2 overflow-hidden"
          >
            <div className="flex items-center gap-2 text-xs text-white/50">
              <Package className="w-3.5 h-3.5" />
              <span>Currency: <span className="text-white/80">{buyer.currency || "USD"}</span></span>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/50">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Annual Demand: <span className="text-white/80">{buyer.yearlyDemandTons} tons/year</span></span>
            </div>
            <div className="text-xs text-white/50 flex items-center gap-2">
              <Truck className="w-3.5 h-3.5" />
              <span>Avg Lead Time: <span className="text-white/80">3–7 days</span></span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions */}
      <div className="flex gap-2 mt-auto pt-1">
        <button
          onClick={() => onInquire(buyer)}
          className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all hover:-translate-y-0.5 shadow-md shadow-primary/20"
        >
          <MessageSquare className="w-3.5 h-3.5" /> Send Inquiry
        </button>
        <button
          onClick={() => setExpanded(p => !p)}
          className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all"
        >
          <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>
      </div>
    </motion.div>
  );
}

function StatCard({ icon: Icon, label, value, sub, color = "text-primary" }: any) {
  return (
    <div className="glass-panel rounded-2xl p-5 flex items-center gap-4 border border-white/5">
      <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/5`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <div>
        <div className="text-2xl font-bold text-white">{value}</div>
        <div className="text-sm text-muted-foreground">{label}</div>
        {sub && <div className="text-xs text-white/40 mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}

function BulkRequestsTab() {
  const requests = [
    { id: 1, buyer: "WFP Regional Office", commodity: "Maize", volumeTons: 2400, priceRange: "$170–190/ton", currency: "USD", deadline: "Apr 30, 2025", region: "East Africa", description: "Emergency maize procurement for food relief programs. Minimum 500 tons per delivery, FOB Mombasa.", urgency: "high", requirements: ["KEBS Graded", "Max 13.5% moisture", "FOB Mombasa"] },
    { id: 2, buyer: "Carrefour Kenya", commodity: "Avocado (Hass)", volumeTons: 95, priceRange: "KES 165–180/kg", currency: "KES", deadline: "Mar 31, 2025", region: "Nairobi", description: "Weekly avocado supply for all Carrefour branches in Kenya. Grade A, min 180g. Cold chain required.", urgency: "medium", requirements: ["Grade A min 180g", "GlobalGAP preferred", "Weekly delivery"] },
    { id: 3, buyer: "McCormick & Company", commodity: "Vanilla", volumeTons: 2, priceRange: "$115–125K/ton", currency: "USD", deadline: "Jun 30, 2025", region: "USA", description: "Premium organic vanilla pods for food flavoring applications. Organic certification required.", urgency: "low", requirements: ["USDA Organic", "Min 20cm pods", "Min 25% vanillin"] },
    { id: 4, buyer: "Dubai Multi Commodities Centre", commodity: "Macadamia", volumeTons: 500, priceRange: "$3,100–3,300/ton", currency: "USD", deadline: "May 15, 2025", region: "UAE", description: "Bulk macadamia kernel Grade 0 and Grade 1 for re-export to GCC markets. Multiple shipments welcome.", urgency: "high", requirements: ["Grade 0 / Grade 1 Kernel", "FDA Registered Facility", "Vacuum Packed 25kg"] },
    { id: 5, buyer: "Nakumatt International", commodity: "French Beans", volumeTons: 28, priceRange: "KES 135–145/kg", currency: "KES", deadline: "Apr 15, 2025", region: "Nairobi", description: "Weekly French bean supply for supermarket chain. Uniform sizing 4–8mm diameter, well-chilled.", urgency: "medium", requirements: ["4–8mm diameter", "Max 12cm length", "Cold chain 2–5°C"] },
    { id: 6, buyer: "FloraHolland Auction", commodity: "Flowers (Roses)", volumeTons: 920, priceRange: "€85–110/ton", currency: "EUR", deadline: "Ongoing", region: "Netherlands", description: "Weekly flower auction allocations for Kenya-origin roses. MPS-SQ certification required.", urgency: "low", requirements: ["MPS-SQ Certified", "60cm stems min", "Grade A1 FloraHolland"] },
  ];

  const urgencyConfig = {
    high:   { color: "text-red-400",    bg: "bg-red-400/10 border-red-400/20",    label: "URGENT" },
    medium: { color: "text-amber-400",  bg: "bg-amber-400/10 border-amber-400/20", label: "ACTIVE" },
    low:    { color: "text-green-400",  bg: "bg-green-400/10 border-green-400/20", label: "OPEN" },
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Open Bulk Requests</h2>
          <p className="text-sm text-muted-foreground mt-1">Active purchase orders from verified international buyers</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <span className="text-xs font-bold text-primary">{requests.length} LIVE REQUESTS</span>
        </div>
      </div>

      <div className="grid gap-4">
        {requests.map((req, i) => {
          const urg = urgencyConfig[req.urgency as keyof typeof urgencyConfig];
          return (
            <motion.div
              key={req.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-primary/30 transition-all group"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold border ${urg.bg} ${urg.color}`}>{urg.label}</span>
                    <h3 className="text-lg font-bold text-white">{req.commodity}</h3>
                    <span className="text-muted-foreground text-sm">from <span className="text-white font-medium">{req.buyer}</span></span>
                  </div>
                  <p className="text-sm text-white/60 mb-3">{req.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {req.requirements.map(r => (
                      <span key={r} className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-xs text-white/60">
                        <CheckCircle2 className="w-3 h-3 text-primary" /> {r}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3 min-w-[200px]">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{req.volumeTons}<span className="text-sm text-white/40">T</span></div>
                    <div className="text-xs text-white/40">Volume Required</div>
                  </div>
                  <div className="text-right">
                    <div className="text-primary font-bold">{req.priceRange}</div>
                    <div className="text-xs text-white/40">Price Range</div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-white/50">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Deadline: {req.deadline}</span>
                  </div>
                  <button className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-sm font-bold flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 shadow-md shadow-primary/20">
                    <Send className="w-3.5 h-3.5" /> Apply to Supply
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function TradeListingsTab() {
  const listings = [
    { id: 1, seller: "Amara Nkosi", commodity: "Avocado (Hass) - Grade A Export", qty: "50MT", price: "$850/ton", currency: "USD", location: "Muranga, Kenya", certs: ["GlobalGAP", "KEPHIS"], isExport: true, isOrganic: false, status: "active", views: 245, inquiries: 18 },
    { id: 2, seller: "Jean-Pierre Nziza", commodity: "Rwanda Arabica AA - Specialty", qty: "15MT", price: "$4,800/ton", currency: "USD", location: "Southern Province, Rwanda", certs: ["Fair Trade", "Organic"], isExport: true, isOrganic: true, status: "active", views: 182, inquiries: 12 },
    { id: 3, seller: "Zawadi Mwangi", commodity: "Macadamia Kernel Grade 0", qty: "25MT", price: "$3,200/ton", currency: "USD", location: "Mt. Kenya, Kenya", certs: ["KEPHIS", "FDA Registered"], isExport: true, isOrganic: false, status: "active", views: 312, inquiries: 24 },
    { id: 4, seller: "Tigist Bekele", commodity: "Naivasha Hybrid Tea Roses", qty: "1,200T/yr", price: "$95/ton", currency: "USD", location: "Naivasha, Kenya", certs: ["MPS-SQ", "Fairtrade"], isExport: true, isOrganic: false, status: "active", views: 428, inquiries: 35 },
    { id: 5, seller: "Asha Daud", commodity: "Premium Vanilla Pods - Organic", qty: "800KG", price: "$118,000/ton", currency: "USD", location: "Coastal Kenya", certs: ["Organic EU", "USDA Organic"], isExport: true, isOrganic: true, status: "active", views: 560, inquiries: 48 },
    { id: 6, seller: "Moses Wanjala", commodity: "Maize (White) NCPB Grade", qty: "500MT", price: "KES 3,800/bag", currency: "KES", location: "Western Kenya", certs: ["KEBS EAS 40"], isExport: false, isOrganic: false, status: "active", views: 89, inquiries: 7 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Active Trade Listings</h2>
          <p className="text-sm text-muted-foreground mt-1">Verified seller listings ready for buyer matching</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-sm font-bold transition-all shadow-lg shadow-primary/20">
          <FileText className="w-4 h-4" /> Post Your Listing
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {listings.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:border-primary/30 transition-all group"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  {item.isOrganic && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/20">ORGANIC</span>}
                  {item.isExport && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">EXPORT</span>}
                </div>
                <h3 className="font-bold text-white text-base leading-tight">{item.commodity}</h3>
                <p className="text-xs text-white/50 mt-1">by <span className="text-white/70">{item.seller}</span> · {item.location}</p>
              </div>
              <div className="text-right ml-4">
                <div className="text-lg font-bold text-primary">{item.price}</div>
                <div className="text-xs text-white/40">per unit</div>
              </div>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-xs text-white">
                <span className="text-white/40">Vol: </span>{item.qty}
              </div>
              {item.certs.map(c => (
                <span key={c} className="flex items-center gap-1 text-xs text-white/50">
                  <Shield className="w-3 h-3 text-primary" /> {c}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-white/40">
                <span>{item.views} views</span>
                <span>·</span>
                <span>{item.inquiries} inquiries</span>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-primary/10 border border-white/10 hover:border-primary/30 text-white text-xs font-semibold transition-all">
                <MessageSquare className="w-3 h-3" /> Inquire
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function BuyerNetwork() {
  const { data: buyers, isLoading } = useListBuyers();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [commodityFilter, setCommodityFilter] = useState("All");
  const [readinessFilter, setReadinessFilter] = useState("All");
  const [sortBy, setSortBy] = useState<"aiMatchScore" | "weeklyDemandTons" | "sustainabilityScore">("aiMatchScore");
  const [activeTab, setActiveTab] = useState<"buyers" | "bulk" | "listings">("buyers");
  const [inquiryBuyer, setInquiryBuyer] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    if (!buyers) return [];
    return buyers
      .filter(b => {
        const matchSearch = search === "" ||
          b.name.toLowerCase().includes(search.toLowerCase()) ||
          b.location?.toLowerCase().includes(search.toLowerCase());
        const matchType = typeFilter === "All" || b.type === typeFilter;
        const matchCommodity = commodityFilter === "All" ||
          b.commodities?.some((c: string) => c.toLowerCase().includes(commodityFilter.toLowerCase()));
        const matchReadiness = readinessFilter === "All" || b.tradeReadiness === readinessFilter;
        return matchSearch && matchType && matchCommodity && matchReadiness;
      })
      .sort((a, b) => {
        const av = parseFloat(String(a[sortBy] || 0));
        const bv = parseFloat(String(b[sortBy] || 0));
        return bv - av;
      });
  }, [buyers, search, typeFilter, commodityFilter, readinessFilter, sortBy]);

  const totalDemand = buyers?.reduce((s, b) => s + parseFloat(String(b.yearlyDemandTons || 0)), 0) || 0;
  const avgMatch = buyers?.length ? Math.round(buyers.reduce((s, b) => s + (b.aiMatchScore || 0), 0) / buyers.length) : 0;
  const readyCount = buyers?.filter(b => b.tradeReadiness === "Ready").length || 0;
  const aiCount = buyers?.filter(b => b.isAiRecommended).length || 0;

  const TABS = [
    { id: "buyers",   icon: Users,       label: "Buyer Directory", count: buyers?.length },
    { id: "bulk",     icon: ShoppingCart, label: "Bulk Requests",  count: 6 },
    { id: "listings", icon: FileText,    label: "Trade Listings",  count: 6 },
  ] as const;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-xs font-bold text-primary tracking-wide">LIVE BUYER NETWORK</span>
          </div>
        </div>
        <h1 className="text-4xl lg:text-5xl font-display font-bold text-white mb-3 leading-tight">
          Global Buyer Network
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Connect with verified international buyers, respond to bulk purchase requests, and post your produce for direct trade matching.
        </p>
      </div>

      {/* Stats */}
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <StatCard icon={Users} label="Verified Buyers" value={buyers?.length || 0} sub="Across 12 countries" />
            <StatCard icon={TrendingUp} label="Total Annual Demand" value={`${(totalDemand / 1000).toFixed(0)}KT`} sub="Tons per year" color="text-secondary" />
            <StatCard icon={CheckCircle2} label="Trade Ready" value={readyCount} sub="Ready to transact" color="text-emerald-400" />
            <StatCard icon={Sparkles} label="AI Matched" value={aiCount} sub="AI-recommended buyers" color="text-violet-400" />
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/10 mb-8 overflow-x-auto no-scrollbar gap-1">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-4 font-semibold whitespace-nowrap border-b-2 transition-all text-sm ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-white"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.count !== undefined && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    activeTab === tab.id ? "bg-primary/20 text-primary" : "bg-white/5 text-white/40"
                  }`}>{tab.count}</span>
                )}
              </button>
            ))}
          </div>

          {/* Buyer Directory Tab */}
          {activeTab === "buyers" && (
            <>
              {/* Search & Filters */}
              <div className="flex flex-col gap-4 mb-8">
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="Search buyers by name or location..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
                    />
                    {search && (
                      <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => setShowFilters(p => !p)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${
                      showFilters ? "bg-primary/10 border-primary/30 text-primary" : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                    }`}
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    <span className="hidden sm:inline">Filters</span>
                    {(typeFilter !== "All" || commodityFilter !== "All" || readinessFilter !== "All") && (
                      <span className="w-2 h-2 bg-primary rounded-full" />
                    )}
                  </button>
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as any)}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary focus:outline-none cursor-pointer"
                  >
                    <option value="aiMatchScore" className="bg-background">Sort: AI Match</option>
                    <option value="weeklyDemandTons" className="bg-background">Sort: Weekly Demand</option>
                    <option value="sustainabilityScore" className="bg-background">Sort: Sustainability</option>
                  </select>
                </div>

                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-white/[0.02] border border-white/10 rounded-2xl">
                        <div>
                          <label className="text-xs text-white/40 mb-2 block uppercase tracking-wide">Buyer Type</label>
                          <div className="flex flex-wrap gap-1.5">
                            {BUYER_TYPES.map(t => (
                              <button key={t} onClick={() => setTypeFilter(t)}
                                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                                  typeFilter === t ? "bg-primary text-white" : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
                                }`}>{t}</button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-white/40 mb-2 block uppercase tracking-wide">Commodity</label>
                          <div className="flex flex-wrap gap-1.5">
                            {COMMODITIES.map(c => (
                              <button key={c} onClick={() => setCommodityFilter(c)}
                                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                                  commodityFilter === c ? "bg-primary text-white" : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
                                }`}>{c}</button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-white/40 mb-2 block uppercase tracking-wide">Trade Readiness</label>
                          <div className="flex flex-wrap gap-1.5">
                            {TRADE_READINESS.map(r => (
                              <button key={r} onClick={() => setReadinessFilter(r)}
                                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                                  readinessFilter === r ? "bg-primary text-white" : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
                                }`}>{r}</button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Results Summary */}
              <div className="flex items-center justify-between mb-5">
                <p className="text-sm text-muted-foreground">
                  Showing <span className="text-white font-semibold">{filtered.length}</span> of {buyers?.length || 0} buyers
                  {search && <> matching <span className="text-primary">"{search}"</span></>}
                </p>
                {(typeFilter !== "All" || commodityFilter !== "All" || readinessFilter !== "All" || search) && (
                  <button
                    onClick={() => { setSearch(""); setTypeFilter("All"); setCommodityFilter("All"); setReadinessFilter("All"); }}
                    className="text-xs text-primary hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <X className="w-3 h-3" /> Clear all filters
                  </button>
                )}
              </div>

              {/* Buyer Grid */}
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                  <AlertTriangle className="w-12 h-12 text-white/20" />
                  <p className="text-white/40 text-lg">No buyers match your filters</p>
                  <button onClick={() => { setSearch(""); setTypeFilter("All"); setCommodityFilter("All"); setReadinessFilter("All"); }}
                    className="text-primary text-sm hover:underline">Clear filters</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {filtered.map((buyer, i) => (
                    <BuyerCard key={buyer.id} buyer={buyer} index={i} onInquire={setInquiryBuyer} />
                  ))}
                </div>
              )}

              {/* AI Match Banner */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-violet-500/10 via-purple-500/5 to-primary/10 border border-violet-500/20 flex flex-col sm:flex-row items-center gap-4"
              >
                <div className="w-14 h-14 rounded-2xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-7 h-7 text-violet-400" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-lg font-bold text-white mb-1">AI Buyer Matching Engine</h3>
                  <p className="text-sm text-white/50">Upload your production profile and let our AI match you with the highest-value buyers across 45 countries. Average match score: <span className="text-primary font-bold">{avgMatch}%</span></p>
                </div>
                <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-violet-500/20 hover:bg-violet-500/30 border border-violet-500/30 text-violet-300 font-semibold text-sm transition-all hover:-translate-y-0.5 whitespace-nowrap">
                  <Zap className="w-4 h-4" /> Run AI Match
                </button>
              </motion.div>
            </>
          )}

          {activeTab === "bulk" && <BulkRequestsTab />}
          {activeTab === "listings" && <TradeListingsTab />}
        </>
      )}

      {/* Inquiry Modal */}
      <AnimatePresence>
        {inquiryBuyer && (
          <InquiryModal buyer={inquiryBuyer} onClose={() => setInquiryBuyer(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
