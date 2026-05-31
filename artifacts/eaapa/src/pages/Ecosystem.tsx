import { useState } from "react";
import { useListMembers, useConnectMember } from "@workspace/api-client-react";
import { LoadingScreen } from "@/components/ui/Loading";
import {
  Search, Filter, MapPin, Briefcase, LayoutGrid, List,
  Star, Phone, Mail, Globe, Building2, Users, TrendingUp,
  CheckCircle, Award, DollarSign, Target, BookOpen, Sprout, Wifi
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useSearch, useLocation } from "wouter";
import { clsx } from "clsx";

// ── Entity type config ────────────────────────────────────
const ENTITY_TABS = [
  { id: "all",         label: "All Members",    icon: Users },
  { id: "agripreneur", label: "Agripreneurs",   icon: Sprout },
  { id: "company",     label: "Agribusinesses", icon: Building2 },
  { id: "partner",     label: "Partners & NGOs",icon: Globe },
  { id: "investor",    label: "Investors",       icon: DollarSign },
  { id: "mentor",      label: "Mentors",         icon: BookOpen },
  { id: "satellite",   label: "Satellite Centers", icon: Wifi },
];

// ── Static satellite centers (from seed data) ─────────────
const SATELLITE_CENTERS = [
  { name: "EAAPA Nairobi HQ", type: "Headquarters", address: "Karen Business Park, Karen", city: "Nairobi", region: "Nairobi", country: "Kenya", manager: "Dr. Alice Mwangi", email: "nairobi@eaapa.org", phone: "+254722000001", services: ["Market Intelligence", "Training", "Investor Matchmaking", "Export Facilitation"], memberCount: 1240, lat: "-1.3182", lng: "36.7163" },
  { name: "EAAPA Nakuru Centre", type: "Regional Hub", address: "Westside Mall, Kenyatta Avenue", city: "Nakuru", region: "Rift Valley", country: "Kenya", manager: "James Korir", email: "nakuru@eaapa.org", phone: "+254722000002", services: ["Farmer Training", "Market Linkage", "Cooperative Support"], memberCount: 680, lat: "-0.3031", lng: "36.0800" },
  { name: "EAAPA Mombasa Centre", type: "Regional Hub", address: "Nyali Centre, Nyali", city: "Mombasa", region: "Coastal Kenya", country: "Kenya", manager: "Said Omar", email: "mombasa@eaapa.org", phone: "+254722000003", services: ["Export Documentation", "Port Clearance", "Market Intelligence"], memberCount: 290, lat: "-4.0435", lng: "39.6682" },
  { name: "EAAPA Kampala Office", type: "Country Office", address: "Nakasero Business Park", city: "Kampala", region: "Central Uganda", country: "Uganda", manager: "Rebecca Namukasa", email: "kampala@eaapa.org", phone: "+256772000001", services: ["Farmer Network", "Training", "Market Data"], memberCount: 520, lat: "0.3476", lng: "32.5825" },
  { name: "EAAPA Kigali Office", type: "Country Office", address: "KG 7 Ave, Kigali Business Centre", city: "Kigali", region: "Kigali", country: "Rwanda", manager: "Florent Habimana", email: "kigali@eaapa.org", phone: "+250788000001", services: ["Coffee Export Support", "Training", "Impact Reporting"], memberCount: 380, lat: "-1.9441", lng: "30.0619" },
  { name: "EAAPA Dar es Salaam", type: "Country Office", address: "Mikocheni Business Park", city: "Dar es Salaam", region: "Northern Tanzania", country: "Tanzania", manager: "Zawadi Salehe", email: "dar@eaapa.org", phone: "+255754000001", services: ["Export Facilitation", "Market Intelligence", "Farmer Network"], memberCount: 340, lat: "-6.7924", lng: "39.2083" },
];

// ── Role color map ────────────────────────────────────────
const ROLE_COLORS: Record<string, string> = {
  agripreneur: "bg-emerald-50 text-emerald-700 border-emerald-200",
  company:     "bg-blue-50 text-blue-700 border-blue-200",
  partner:     "bg-purple-50 text-purple-700 border-purple-200",
  investor:    "bg-amber-50 text-amber-700 border-amber-200",
  mentor:      "bg-rose-50 text-rose-700 border-rose-200",
};

// ── Entity cards ──────────────────────────────────────────
function AgripreneurCard({ member, onConnect }: { member: any; onConnect: () => void }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 flex flex-col h-full hover:shadow-md hover:-translate-y-1 transition-all duration-200">
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 border border-emerald-200 flex items-center justify-center flex-shrink-0 shadow-sm">
          <span className="text-xl font-bold text-emerald-700">{member.name.charAt(0)}</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-display font-bold text-foreground">{member.name}</h3>
            {member.isVerified && <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" title="Verified Member" />}
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Agripreneur</span>
        </div>
      </div>

      {/* Value chain */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Briefcase className="w-3.5 h-3.5 flex-shrink-0 text-primary/60" />
          <span>{member.sector}{member.commodity ? ` · ${member.commodity}` : ""}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-primary/60" />
          <span>{member.region}, {member.country}</span>
        </div>
        {member.businessType && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Target className="w-3.5 h-3.5 flex-shrink-0 text-primary/60" />
            <span>{member.businessType}</span>
          </div>
        )}
      </div>

      {/* Bio */}
      {member.bio && (
        <p className="text-sm text-foreground/65 leading-relaxed mb-4 line-clamp-2">{member.bio}</p>
      )}

      {/* Metrics */}
      {(member.revenueUsd || member.jobsCreated) && (
        <div className="grid grid-cols-2 gap-3 mb-4 p-3 rounded-xl bg-muted/60 border border-border">
          {member.revenueUsd && (
            <div>
              <div className="text-[10px] text-muted-foreground uppercase font-bold">Revenue</div>
              <div className="font-mono text-sm font-bold text-foreground">${(parseFloat(member.revenueUsd)/1000).toFixed(0)}k</div>
            </div>
          )}
          {member.jobsCreated > 0 && (
            <div>
              <div className="text-[10px] text-muted-foreground uppercase font-bold">Jobs</div>
              <div className="font-mono text-sm font-bold text-foreground">{member.jobsCreated}</div>
            </div>
          )}
        </div>
      )}

      <button
        onClick={onConnect}
        className={clsx(
          "w-full py-2.5 rounded-xl font-bold text-sm transition-all mt-auto",
          member.isConnected
            ? "bg-muted border border-border text-foreground/70"
            : "bg-primary text-white hover:bg-primary/90 shadow-sm shadow-primary/20"
        )}
      >
        {member.isConnected ? "Connected ✓" : "Connect"}
      </button>
    </div>
  );
}

function CompanyCard({ member, onConnect }: { member: any; onConnect: () => void }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 flex flex-col h-full hover:shadow-md hover:-translate-y-1 transition-all duration-200">
      <div className="flex items-start gap-4 mb-5">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 flex items-center justify-center flex-shrink-0">
          <Building2 className="w-6 h-6 text-blue-600" />
        </div>
        <div className="min-w-0">
          <h3 className="font-display font-bold text-foreground leading-tight">{member.name}</h3>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Agribusiness</span>
          {member.businessType && (
            <div className="text-xs text-muted-foreground mt-0.5">{member.businessType}</div>
          )}
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Briefcase className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{member.sector}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{member.region}, {member.country}</span>
        </div>
        {member.commodity && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sprout className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{member.commodity}</span>
          </div>
        )}
      </div>

      {member.bio && (
        <p className="text-sm text-foreground/65 leading-relaxed mb-4 flex-1 line-clamp-3">{member.bio}</p>
      )}

      {member.isVerified && (
        <div className="flex items-center gap-1.5 text-xs text-blue-600 font-medium mb-4">
          <CheckCircle className="w-3.5 h-3.5" /> Verified Business
        </div>
      )}

      <button
        onClick={onConnect}
        className="w-full py-2.5 rounded-xl font-bold text-sm bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all mt-auto"
      >
        View Profile
      </button>
    </div>
  );
}

function InvestorCard({ member, onConnect }: { member: any; onConnect: () => void }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 flex flex-col h-full hover:shadow-md hover:-translate-y-1 transition-all duration-200">
      <div className="flex items-start gap-4 mb-5">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 flex items-center justify-center flex-shrink-0">
          <span className="text-xl font-bold text-amber-700">{member.name.charAt(0)}</span>
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-display font-bold text-foreground">{member.name}</h3>
            {member.isVerified && <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />}
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Investor</span>
          {member.businessType && <div className="text-xs text-muted-foreground mt-0.5">{member.businessType}</div>}
        </div>
      </div>

      <div className="space-y-2.5 mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <TrendingUp className="w-3.5 h-3.5 flex-shrink-0" />
          <span>Focus: {member.sector}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{member.region}, {member.country}</span>
        </div>
      </div>

      {member.bio && (
        <p className="text-sm text-foreground/65 leading-relaxed mb-4 flex-1 line-clamp-3">{member.bio}</p>
      )}

      <button
        onClick={onConnect}
        className="w-full py-2.5 rounded-xl font-bold text-sm bg-amber-600 text-white hover:bg-amber-700 shadow-sm transition-all mt-auto"
      >
        Schedule Meeting
      </button>
    </div>
  );
}

function MentorCard({ member, onConnect }: { member: any; onConnect: () => void }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 flex flex-col h-full hover:shadow-md hover:-translate-y-1 transition-all duration-200">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-50 to-rose-100 border border-rose-200 flex items-center justify-center flex-shrink-0">
          <span className="text-xl font-bold text-rose-700">{member.name.charAt(0)}</span>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-display font-bold text-foreground">{member.name}</h3>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-700">Mentor</span>
          {/* Stars */}
          <div className="flex items-center gap-0.5 mt-1">
            {[1,2,3,4,5].map(s => (
              <Star key={s} className="w-3 h-3" fill={s <= 4 ? "#f43f5e" : "none"} stroke="#f43f5e" />
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <BookOpen className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{member.sector}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{member.region}, {member.country}</span>
        </div>
      </div>

      {member.bio && (
        <p className="text-sm text-foreground/65 leading-relaxed mb-4 flex-1 line-clamp-3">{member.bio}</p>
      )}

      <div className="flex items-center gap-2 mb-4">
        <span className="px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold border border-green-200">Available</span>
        <span className="text-xs text-muted-foreground">Expert mentor</span>
      </div>

      <button
        onClick={onConnect}
        className="w-full py-2.5 rounded-xl font-bold text-sm bg-rose-600 text-white hover:bg-rose-700 shadow-sm transition-all mt-auto"
      >
        Book Mentorship
      </button>
    </div>
  );
}

function PartnerCard({ member, onConnect }: { member: any; onConnect: () => void }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 flex flex-col h-full hover:shadow-md hover:-translate-y-1 transition-all duration-200">
      <div className="flex items-start gap-4 mb-5">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 flex items-center justify-center flex-shrink-0">
          <Globe className="w-6 h-6 text-purple-600" />
        </div>
        <div className="min-w-0">
          <h3 className="font-display font-bold text-foreground">{member.name}</h3>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-700">Partner Organization</span>
          {member.businessType && <div className="text-xs text-muted-foreground mt-0.5">{member.businessType}</div>}
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Target className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{member.sector}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{member.region}, {member.country}</span>
        </div>
      </div>

      {member.bio && (
        <p className="text-sm text-foreground/65 leading-relaxed mb-4 flex-1 line-clamp-3">{member.bio}</p>
      )}

      <button
        onClick={onConnect}
        className="w-full py-2.5 rounded-xl font-bold text-sm bg-purple-600 text-white hover:bg-purple-700 shadow-sm transition-all mt-auto"
      >
        Learn More
      </button>
    </div>
  );
}

function SatelliteCard({ center }: { center: typeof SATELLITE_CENTERS[0] }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 flex flex-col h-full hover:shadow-md hover:-translate-y-1 transition-all duration-200">
      <div className="flex items-start gap-4 mb-5">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-50 to-teal-100 border border-teal-200 flex items-center justify-center flex-shrink-0">
          <Wifi className="w-6 h-6 text-teal-600" />
        </div>
        <div className="min-w-0">
          <h3 className="font-display font-bold text-foreground text-sm leading-tight">{center.name}</h3>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700">{center.type}</span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{center.city}, {center.country}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{center.memberCount.toLocaleString()} members</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">{center.email}</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-xs font-bold text-foreground/60 uppercase mb-2">Services</div>
        <div className="flex flex-wrap gap-1.5">
          {center.services.map(s => (
            <span key={s} className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 text-xs border border-teal-200">{s}</span>
          ))}
        </div>
      </div>

      <div className="text-xs text-muted-foreground mt-auto">
        Manager: <span className="text-foreground font-medium">{center.manager}</span>
      </div>
    </div>
  );
}

// ── Generic card fallback ─────────────────────────────────
function GenericCard({ member, onConnect }: { member: any; onConnect: () => void }) {
  switch (member.role) {
    case "agripreneur": return <AgripreneurCard member={member} onConnect={onConnect} />;
    case "company":     return <CompanyCard member={member} onConnect={onConnect} />;
    case "investor":    return <InvestorCard member={member} onConnect={onConnect} />;
    case "mentor":      return <MentorCard member={member} onConnect={onConnect} />;
    default:            return <PartnerCard member={member} onConnect={onConnect} />;
  }
}

// ── Main page ─────────────────────────────────────────────
export default function Ecosystem() {
  const searchStr = useSearch();
  const [, navigate] = useLocation();
  const urlType = new URLSearchParams(searchStr).get("type") ?? "all";

  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: members, isLoading } = useListMembers();
  const { mutate: connect } = useConnectMember();
  const { toast } = useToast();

  if (isLoading) return <LoadingScreen />;

  const handleConnect = (id: number) => {
    connect({ id }, {
      onSuccess: () => toast({ title: "Connected!", description: "You are now connected with this member." }),
    });
  };

  const filteredMembers = members?.filter(m => {
    const matchesType = urlType === "all" || m.role === urlType;
    const matchesSearch = !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.sector.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  }) ?? [];

  const currentTab = ENTITY_TABS.find(t => t.id === urlType) ?? ENTITY_TABS[0];
  const showSatellites = urlType === "satellite";

  return (
    <div className="w-full bg-background min-h-screen">
      {/* Page header */}
      <div className="bg-gradient-to-b from-primary/6 to-background border-b border-border py-12">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4">
                <Users className="w-3.5 h-3.5" /> Verified Network
              </div>
              <h1 className="text-4xl font-display font-bold text-foreground">
                {currentTab.label}
              </h1>
              <p className="text-muted-foreground mt-2 text-base">
                {showSatellites ? "EAAPA physical offices and satellite centres across East Africa." : `Connect with ${(members?.length ?? 0).toLocaleString()} verified members in the ecosystem.`}
              </p>
            </div>

            {!showSatellites && (
              <div className="flex gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-80">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    className="w-full bg-card border border-border rounded-xl py-2.5 pl-11 pr-4 text-sm text-foreground focus:border-primary outline-none transition-all"
                    placeholder="Search by name or sector…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
                <div className="flex bg-card border border-border rounded-xl p-1">
                  <button onClick={() => setViewMode("grid")} className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button onClick={() => setViewMode("list")} className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Entity type tabs */}
        <div className="flex overflow-x-auto no-scrollbar gap-2 mb-8 pb-1">
          {ENTITY_TABS.map(tab => {
            const active = urlType === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => navigate(tab.id === "all" ? "/ecosystem" : `/ecosystem?type=${tab.id}`)}
                className={clsx(
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all border",
                  active
                    ? "bg-primary text-white border-primary shadow-sm shadow-primary/20"
                    : "bg-card text-foreground/60 border-border hover:text-foreground hover:border-primary/30 hover:bg-primary/5"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.id === "all" && members && (
                  <span className={clsx("text-xs rounded-full px-1.5 py-0.5 font-bold", active ? "bg-white/20 text-white" : "bg-muted text-muted-foreground")}>
                    {members.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Satellite Centers */}
        {showSatellites ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SATELLITE_CENTERS.map((center, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                <SatelliteCard center={center} />
              </motion.div>
            ))}
          </div>
        ) : viewMode === "grid" ? (
          <>
            {filteredMembers.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <Users className="w-10 h-10 mx-auto mb-4 opacity-30" />
                <p>No members found. Try changing the filter or search term.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredMembers.map((member, idx) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(idx * 0.04, 0.4) }}
                  >
                    <GenericCard member={member} onConnect={() => handleConnect(member.id)} />
                  </motion.div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Member</th>
                    <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Type</th>
                    <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Sector</th>
                    <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Location</th>
                    <th className="p-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="p-4 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredMembers.map(member => (
                    <tr key={member.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary text-sm flex-shrink-0">
                            {member.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-foreground text-sm">{member.name}</div>
                            {member.commodity && <div className="text-xs text-muted-foreground">{member.commodity}</div>}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={clsx("px-2.5 py-1 rounded-full text-xs font-bold border", ROLE_COLORS[member.role] ?? "bg-muted text-foreground border-border")}>
                          {member.role}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-foreground/70">{member.sector}</td>
                      <td className="p-4 text-sm text-foreground/70">{member.region}, {member.country}</td>
                      <td className="p-4">
                        {member.isVerified
                          ? <span className="flex items-center gap-1.5 text-xs text-blue-600 font-medium"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" />Verified</span>
                          : <span className="text-xs text-muted-foreground">Standard</span>}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleConnect(member.id)}
                          className={clsx("px-4 py-1.5 rounded-lg text-xs font-bold transition-all", member.isConnected ? "bg-muted text-foreground/70 border border-border" : "bg-primary text-white hover:bg-primary/90")}
                        >
                          {member.isConnected ? "Connected" : "Connect"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
