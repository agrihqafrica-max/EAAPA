import { useState } from "react";
import { useListMembers, useListProjects, useListKnowledge, useJoinProject } from "@workspace/api-client-react";
import { LoadingScreen } from "@/components/ui/Loading";
import { useToast } from "@/hooks/use-toast";
import { Users, BookOpen, FolderKanban, ArrowRight, Eye, Calendar } from "lucide-react";
import { format } from "date-fns";

export default function Network() {
  const [activeTab, setActiveTab] = useState<"connection"|"projects"|"knowledge">("connection");
  
  const { data: members, isLoading: l1 } = useListMembers();
  const { data: projects, isLoading: l2 } = useListProjects();
  const { data: knowledge, isLoading: l3 } = useListKnowledge();
  const { mutate: join } = useJoinProject();
  const { toast } = useToast();

  if (l1 || l2 || l3) return <LoadingScreen />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-display font-bold text-white mb-2">Network Layer</h1>
        <p className="text-xl text-muted-foreground">Collaborate, connect, and share knowledge across the ecosystem.</p>
      </div>

      <div className="flex border-b border-white/10 mb-8 overflow-x-auto no-scrollbar">
        {[
          { id: "connection", icon: Users, label: "Connection Hub" },
          { id: "projects", icon: FolderKanban, label: "Project Rooms" },
          { id: "knowledge", icon: BookOpen, label: "Knowledge Sharing" }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-4 font-semibold whitespace-nowrap border-b-2 transition-all ${
              activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-white"
            }`}
          >
            <tab.icon className="w-5 h-5" /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "connection" && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Recommended Connections</h2>
            <div className="flex gap-2">
              <span className="px-4 py-2 rounded-lg bg-primary/20 text-primary text-sm font-bold">Agripreneurs</span>
              <span className="px-4 py-2 rounded-lg bg-white/5 text-muted-foreground text-sm font-bold">Companies</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {members?.slice(0,8).map(member => (
              <div key={member.id} className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-emerald-700 text-white flex items-center justify-center text-2xl font-bold mb-4 shadow-lg">
                  {member.name.charAt(0)}
                </div>
                <h3 className="font-bold text-white">{member.name}</h3>
                <p className="text-xs text-primary mb-1">{member.role.toUpperCase()}</p>
                <p className="text-sm text-muted-foreground mb-4">{member.sector} • {member.country}</p>
                <button className="w-full py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-primary hover:border-primary text-white transition-all text-sm font-semibold mt-auto">
                  Connect
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "projects" && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Active Value Chain Projects</h2>
            <button className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90">
              + Create Project
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects?.map((proj) => (
              <div key={proj.id} className="bg-card border border-white/10 p-6 rounded-2xl flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{proj.title}</h3>
                    <p className="text-sm text-muted-foreground">Led by <span className="text-white">{proj.leader}</span></p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase ${
                    proj.status === 'active' ? 'bg-primary/20 text-primary' : 'bg-blue-500/20 text-blue-500'
                  }`}>
                    {proj.status}
                  </span>
                </div>
                <p className="text-sm text-white/80 mb-6 flex-1">{proj.description}</p>
                <div className="flex items-center gap-4 mb-6">
                  {proj.commodity && <span className="px-2 py-1 rounded bg-white/5 text-xs text-white/70">{proj.commodity}</span>}
                  {proj.region && <span className="px-2 py-1 rounded bg-white/5 text-xs text-white/70">{proj.region}</span>}
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground ml-auto">
                    <Users className="w-3.5 h-3.5" /> {proj.memberCount}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => join({ id: proj.id }, { onSuccess: () => toast({ title: "Joined Project" }) })}
                    disabled={proj.isJoined}
                    className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-primary hover:border-primary disabled:opacity-50 transition-all"
                  >
                    {proj.isJoined ? "Joined" : "Join Project"}
                  </button>
                  <button className="px-4 py-2.5 rounded-xl bg-background border border-white/10 text-white hover:bg-white/5 transition-all">
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "knowledge" && (
        <div>
           <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Ecosystem Insights</h2>
            <div className="flex gap-2 overflow-x-auto">
              {['All', 'Agronomy', 'Market Trends', 'Technology', 'Finance'].map(cat => (
                <button key={cat} className="px-3 py-1.5 rounded-lg bg-white/5 text-white/70 text-xs font-bold hover:bg-white/10 whitespace-nowrap">
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {knowledge?.map(item => (
              <div key={item.id} className="glass-panel p-6 rounded-2xl flex flex-col group">
                <span className="text-secondary text-xs font-bold uppercase mb-2 block">{item.category.replace('_', ' ')}</span>
                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-primary transition-colors">{item.title}</h3>
                <p className="text-sm text-muted-foreground mb-6 flex-1 line-clamp-3">{item.description}</p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                  <div className="flex items-center gap-3 text-xs text-white/60">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5"/> {format(new Date(item.publishedAt), 'MMM d')}</span>
                    <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5"/> {item.views}</span>
                  </div>
                  <button className="text-primary hover:text-white transition-colors">
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
