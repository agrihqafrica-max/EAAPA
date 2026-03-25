import { useState } from "react";
import { useListMembers, useConnectMember } from "@workspace/api-client-react";
import { LoadingScreen } from "@/components/ui/Loading";
import { Search, Filter, Mail, MapPin, Briefcase, LayoutGrid, List } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { clsx } from "clsx";

const ROLES = ["ALL", "AGRIPRENEURS", "COMPANIES", "PARTNERS", "INVESTORS", "MENTORS", "SATELLITE CENTERS"];

export default function Ecosystem() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeRole, setActiveRole] = useState("ALL");
  const [viewMode, setViewMode] = useState<"grid"|"table">("grid");
  const [showFilters, setShowFilters] = useState(false);
  
  const { data: members, isLoading } = useListMembers();
  const { mutate: connect } = useConnectMember();
  const { toast } = useToast();

  if (isLoading) return <LoadingScreen />;

  const handleConnect = (id: number) => {
    connect({ id }, {
      onSuccess: () => {
        toast({
          title: "Connected ✓",
          description: "Messaging and deeper profile unlocked.",
        });
      }
    });
  };

  const filteredMembers = members?.filter(m => {
    if (activeRole !== "ALL" && m.role.toUpperCase() !== activeRole && !(activeRole === "AGRIPRENEURS" && m.role === "agripreneur") && !(activeRole === "COMPANIES" && m.role === "company")) {
      // rough matching for mockup
      if (activeRole === "AGRIPRENEURS" && m.role !== "agripreneur") return false;
      if (activeRole === "COMPANIES" && m.role !== "company") return false;
      if (activeRole === "PARTNERS" && m.role !== "partner") return false;
      if (activeRole === "INVESTORS" && m.role !== "investor") return false;
      if (activeRole === "MENTORS" && m.role !== "mentor") return false;
    }
    return m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.sector.toLowerCase().includes(searchTerm.toLowerCase());
  }) || [];

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-display font-bold text-white">Ecosystem Directory</h1>
            <span className="px-3 py-1 rounded-full bg-primary/20 text-primary font-bold text-sm">{members?.length || 0} Members</span>
          </div>
          <p className="text-muted-foreground mt-2 text-lg">Connect with the most verified network in East Africa.</p>
        </div>
        
        <div className="flex w-full md:w-auto gap-3">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              className="w-full bg-card border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:ring-2 focus:ring-primary outline-none transition-all"
              placeholder="Search directory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`p-3 rounded-xl border transition-all ${showFilters ? 'bg-primary border-primary text-white' : 'bg-card border-white/10 text-white hover:bg-white/5'}`}
          >
            <Filter className="w-5 h-5" />
          </button>
          <div className="flex bg-card border border-white/10 rounded-xl p-1">
            <button onClick={() => setViewMode("grid")} className={`p-2 rounded-lg ${viewMode==='grid'?'bg-white/10 text-white':'text-muted-foreground'}`}><LayoutGrid className="w-5 h-5"/></button>
            <button onClick={() => setViewMode("table")} className={`p-2 rounded-lg ${viewMode==='table'?'bg-white/10 text-white':'text-muted-foreground'}`}><List className="w-5 h-5"/></button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-8"
          >
            <div className="glass-panel p-6 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-6 border-white/10">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Commodity</label>
                <select className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-white outline-none"><option>All Commodities</option><option>Coffee</option><option>Avocado</option></select>
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Region</label>
                <select className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-white outline-none"><option>All Regions</option><option>Kenya</option><option>Uganda</option></select>
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Activity</label>
                <select className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-white outline-none"><option>All Activity</option><option>Exporting</option><option>Processing</option></select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex overflow-x-auto no-scrollbar gap-2 mb-8 pb-2">
        {ROLES.map(role => (
          <button 
            key={role}
            onClick={() => setActiveRole(role)}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
              activeRole === role ? 'bg-white text-background' : 'bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white'
            }`}
          >
            {role}
          </button>
        ))}
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMembers.map((member, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={member.id} 
              className="glass-panel p-6 rounded-3xl flex flex-col h-full hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 border-white/10 relative"
            >
              {member.isVerified && (
                <div className="absolute top-6 right-6 w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30" title="Verified Member">
                  <span className="text-blue-500 text-xs font-bold">✓</span>
                </div>
              )}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-card to-background border border-white/10 flex items-center justify-center mb-5 shadow-lg">
                <span className="text-2xl font-bold text-white">{member.name.charAt(0)}</span>
              </div>
              
              <div className="mb-2">
                <h3 className="text-xl font-bold text-white">{member.name}</h3>
                <span className={clsx("text-xs font-bold uppercase tracking-wider", 
                  member.role === 'agripreneur' ? "text-primary" : 
                  member.role === 'investor' ? "text-blue-400" : 
                  member.role === 'mentor' ? "text-purple-400" : "text-secondary"
                )}>{member.role}</span>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{member.bio || `Leading operations in ${member.sector} sector within ${member.region}.`}</p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-2.5 py-1 rounded bg-white/5 border border-white/5 text-xs text-white/80">{member.sector}</span>
                {member.commodity && <span className="px-2.5 py-1 rounded bg-white/5 border border-white/5 text-xs text-white/80">{member.commodity}</span>}
                <span className="px-2.5 py-1 rounded bg-white/5 border border-white/5 text-xs text-white/80">{member.country}</span>
              </div>

              {member.metrics && (
                <div className="grid grid-cols-2 gap-4 mb-6 p-4 rounded-xl bg-background/50 border border-white/5 mt-auto">
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase font-bold">Revenue</div>
                    <div className="font-mono text-white font-medium">${(member.metrics.revenue/1000).toFixed(0)}k</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase font-bold">Jobs</div>
                    <div className="font-mono text-white font-medium">{member.metrics.jobsCreated}</div>
                  </div>
                </div>
              )}

              <button 
                onClick={() => handleConnect(member.id)}
                className={`w-full py-3 rounded-xl font-bold text-sm transition-all mt-auto ${
                  member.isConnected 
                    ? "bg-white/10 text-white border border-white/20" 
                    : "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20"
                }`}
              >
                {member.isConnected ? "Connected ✓" : "Connect"}
              </button>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="glass-panel rounded-3xl overflow-hidden border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-sm font-bold text-muted-foreground bg-white/5">
                  <th className="p-5">Member</th>
                  <th className="p-5">Role</th>
                  <th className="p-5">Sector & Commodity</th>
                  <th className="p-5">Location</th>
                  <th className="p-5">Status</th>
                  <th className="p-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center font-bold text-white border border-white/10">
                          {member.name.charAt(0)}
                        </div>
                        <span className="font-bold text-white">{member.name}</span>
                      </div>
                    </td>
                    <td className="p-5">
                      <span className={clsx("px-2.5 py-1 rounded-md text-xs font-bold uppercase", 
                        member.role === 'agripreneur' ? "bg-primary/10 text-primary" : 
                        member.role === 'investor' ? "bg-blue-500/10 text-blue-400" : 
                        "bg-secondary/10 text-secondary"
                      )}>{member.role}</span>
                    </td>
                    <td className="p-5">
                      <div className="text-white text-sm">{member.sector}</div>
                      {member.commodity && <div className="text-xs text-muted-foreground">{member.commodity}</div>}
                    </td>
                    <td className="p-5 text-white/80 text-sm">
                      {member.region}, {member.country}
                    </td>
                    <td className="p-5">
                      {member.isVerified ? <span className="text-blue-400 text-sm flex items-center gap-1 font-medium"><span className="w-2 h-2 rounded-full bg-blue-400" /> Verified</span> : <span className="text-muted-foreground text-sm">Standard</span>}
                    </td>
                    <td className="p-5 text-right">
                      <button 
                        onClick={() => handleConnect(member.id)}
                        className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
                          member.isConnected ? "bg-white/10 text-white" : "bg-primary text-white hover:bg-primary/90"
                        }`}
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
  );
}
