import { useState } from "react";
import { useListMembers, useListKnowledge } from "@workspace/api-client-react";
import { LoadingScreen } from "@/components/ui/Loading";
import { useToast } from "@/hooks/use-toast";
import {
  Users, BookOpen, FolderKanban, ArrowRight, Eye, Calendar,
  MapPin, Briefcase, CheckCircle, Plus, Clock
} from "lucide-react";
import { format } from "date-fns";
import { clsx } from "clsx";

const STATIC_PROJECTS = [
  {
    id: 1, title: "Avocado Export Corridor — Nairobi to Rotterdam",
    leader: "Mary Kirori", status: "active", commodity: "Avocado", region: "Central Kenya",
    memberCount: 28, isJoined: false,
    description: "Building a traceable, GLOBALG.A.P.-certified cold chain linking 200+ Murang'a smallholder avocado farmers to EU buyers. Targeting 500 tonnes per season.",
  },
  {
    id: 2, title: "East Africa Coffee Quality Alliance",
    leader: "Jean Habimana", status: "active", commodity: "Coffee", region: "East Africa",
    memberCount: 45, isJoined: false,
    description: "Cross-border specialty coffee traceability project spanning Kenya, Uganda and Rwanda. Building shared cupping labs and a blockchain traceability layer.",
  },
  {
    id: 3, title: "Great Rift Macadamia Processing Hub",
    leader: "David Kamau", status: "planning", commodity: "Macadamia", region: "Rift Valley",
    memberCount: 17, isJoined: false,
    description: "Aggregated macadamia processing facility serving 400+ farmers. Targets 1,000 MT processing capacity annually with shared export channels.",
  },
  {
    id: 4, title: "Naivasha Floriculture Export Network",
    leader: "Carol Ndegwa", status: "active", commodity: "Flowers", region: "Naivasha",
    memberCount: 31, isJoined: false,
    description: "Cooperative export structuring for 15 flower farms around Naivasha targeting UK and Dutch auction markets. Includes shared cold storage and logistics.",
  },
];

export default function Network() {
  const [activeTab, setActiveTab] = useState<"connection" | "projects" | "knowledge">("connection");
  const [projects, setProjects] = useState(STATIC_PROJECTS);

  const { data: members, isLoading: l1 } = useListMembers();
  const { data: knowledge, isLoading: l2 } = useListKnowledge();
  const { toast } = useToast();

  if (l1 || l2) return <LoadingScreen />;

  const handleJoin = (id: number) => {
    setProjects(ps => ps.map(p => p.id === id ? { ...p, isJoined: true, memberCount: p.memberCount + 1 } : p));
    toast({ title: "Joined Project", description: "You are now collaborating on this project." });
  };

  return (
    <div className="w-full bg-background min-h-screen">
      {/* Page header */}
      <div className="bg-gradient-to-b from-primary/6 to-background border-b border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4">
            <Users className="w-3.5 h-3.5" /> Network Layer
          </div>
          <h1 className="text-4xl font-display font-bold text-foreground mb-2">Network Layer</h1>
          <p className="text-muted-foreground text-lg">Collaborate, connect, and share knowledge across the ecosystem.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex border-b border-border mb-10 overflow-x-auto no-scrollbar">
          {[
            { id: "connection", icon: Users, label: "Connection Hub" },
            { id: "projects", icon: FolderKanban, label: "Project Rooms" },
            { id: "knowledge", icon: BookOpen, label: "Knowledge Sharing" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={clsx(
                "flex items-center gap-2 px-6 py-4 font-semibold whitespace-nowrap border-b-2 transition-all",
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon className="w-4.5 h-4.5" /> {tab.label}
            </button>
          ))}
        </div>

        {/* Connection Hub */}
        {activeTab === "connection" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-display font-bold text-foreground">Recommended Connections</h2>
              <div className="flex gap-2">
                <span className="px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-bold">All Members</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {members?.slice(0, 8).map(member => (
                <div key={member.id} className="bg-card border border-border rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-md hover:-translate-y-1 transition-all">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-emerald-100 flex items-center justify-center text-2xl font-bold text-primary mb-4 shadow-sm">
                    {member.name.charAt(0)}
                  </div>
                  <h3 className="font-bold text-foreground">{member.name}</h3>
                  <p className="text-xs text-primary font-bold uppercase tracking-wide mb-1">{member.role}</p>
                  <p className="text-sm text-muted-foreground mb-1">{member.sector}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
                    <MapPin className="w-3 h-3" /> {member.country}
                  </div>
                  {member.isVerified && (
                    <div className="flex items-center gap-1 text-xs text-blue-600 font-medium mb-3">
                      <CheckCircle className="w-3.5 h-3.5" /> Verified
                    </div>
                  )}
                  <button className="w-full py-2.5 rounded-xl bg-muted border border-border hover:bg-primary hover:border-primary hover:text-white text-foreground/70 transition-all text-sm font-semibold mt-auto">
                    Connect
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Project Rooms */}
        {activeTab === "projects" && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-display font-bold text-foreground">Active Value Chain Projects</h2>
                <p className="text-muted-foreground text-sm mt-1">Join collaborative projects to grow the ecosystem.</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 shadow-sm shadow-primary/20 transition-all">
                <Plus className="w-4 h-4" /> Create Project
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map(proj => (
                <div key={proj.id} className="bg-card border border-border p-6 rounded-2xl flex flex-col hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 min-w-0 pr-4">
                      <h3 className="text-lg font-bold text-foreground mb-1 leading-tight">{proj.title}</h3>
                      <p className="text-sm text-muted-foreground">Led by <span className="text-foreground font-medium">{proj.leader}</span></p>
                    </div>
                    <span className={clsx(
                      "px-2.5 py-1 rounded-full text-xs font-bold uppercase flex-shrink-0",
                      proj.status === "active"
                        ? "bg-primary/10 text-primary"
                        : "bg-blue-50 text-blue-600 border border-blue-200"
                    )}>
                      {proj.status}
                    </span>
                  </div>

                  <p className="text-sm text-foreground/70 mb-5 flex-1 leading-relaxed">{proj.description}</p>

                  <div className="flex items-center gap-3 mb-5 flex-wrap">
                    {proj.commodity && (
                      <span className="px-2.5 py-1 rounded-full bg-primary/8 text-primary text-xs font-medium border border-primary/20">
                        {proj.commodity}
                      </span>
                    )}
                    {proj.region && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" /> {proj.region}
                      </span>
                    )}
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground ml-auto">
                      <Users className="w-3.5 h-3.5" /> {proj.memberCount} members
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleJoin(proj.id)}
                      disabled={proj.isJoined}
                      className={clsx(
                        "flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all",
                        proj.isJoined
                          ? "bg-muted border border-border text-muted-foreground cursor-default"
                          : "bg-primary text-white hover:bg-primary/90 shadow-sm shadow-primary/20"
                      )}
                    >
                      {proj.isJoined ? "✓ Joined" : "Join Project"}
                    </button>
                    <button className="px-5 py-2.5 rounded-xl bg-muted border border-border text-foreground/70 hover:text-foreground hover:bg-muted/80 text-sm font-semibold transition-all">
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Knowledge Sharing */}
        {activeTab === "knowledge" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-display font-bold text-foreground">Ecosystem Insights</h2>
              <div className="flex gap-2 overflow-x-auto">
                {["All", "Agronomy", "Market Trends", "Technology", "Finance"].map(cat => (
                  <button
                    key={cat}
                    className="px-3 py-1.5 rounded-lg bg-muted/50 text-foreground/60 text-xs font-bold hover:bg-muted hover:text-foreground whitespace-nowrap border border-border transition-colors"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {knowledge?.map(item => (
                <div key={item.id} className="bg-card border border-border rounded-2xl p-6 flex flex-col group hover:shadow-md hover:-translate-y-1 transition-all">
                  <span className="text-secondary text-xs font-bold uppercase tracking-wider mb-3 block">
                    {item.category.replace("_", " ")}
                  </span>
                  <h3 className="text-base font-bold text-foreground mb-3 group-hover:text-primary transition-colors leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6 flex-1 line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {format(new Date(item.publishedAt), "MMM d")}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" /> {item.views}
                      </span>
                    </div>
                    <button className="text-primary hover:text-primary/80 transition-colors p-1">
                      <ArrowRight className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
