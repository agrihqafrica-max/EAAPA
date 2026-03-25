import { useState } from "react";
import { useListMembers, useConnectMember } from "@workspace/api-client-react";
import { LoadingScreen } from "@/components/ui/Loading";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Briefcase, CheckCircle2 } from "lucide-react";

const PROGRAMS = [
  { id: "accelerator", name: "Accelerator", desc: "Scale your high-growth agribusiness with equity funding and elite mentorship.", benefits: ["Up to $100k Seed Funding", "6-Month Intense Coaching", "Investor Demo Day"] },
  { id: "incubation", name: "Incubation", desc: "Turn your early-stage idea into a market-ready product.", benefits: ["Product Development", "Workspace Access", "Initial Market Testing"] },
  { id: "training", name: "Training", desc: "Capacity building for modern farming techniques and business management.", benefits: ["Expert Masterclasses", "Certification", "Peer Learning"] },
  { id: "mentorship", name: "Mentorship", desc: "1-on-1 guidance from industry veterans and successful founders.", benefits: ["Personalized Advice", "Network Expansion", "Leadership Skills"] },
  { id: "youth", name: "Youth Agripreneurs", desc: "Dedicated support for under-30 innovators in agriculture.", benefits: ["Grants", "Tech Focus", "Youth Network"] }
];

export default function Programs() {
  const [activeTab, setActiveTab] = useState(PROGRAMS[0].id);
  const [regionFilter, setRegionFilter] = useState("All");
  const [sectorFilter, setSectorFilter] = useState("All");
  
  const { data: members, isLoading } = useListMembers();
  const { mutate: connect } = useConnectMember();
  const { toast } = useToast();

  if (isLoading) return <LoadingScreen />;

  const currentProgram = PROGRAMS.find(p => p.id === activeTab)!;

  const filteredMembers = members?.filter(m => {
    if (regionFilter !== "All" && m.region !== regionFilter) return false;
    if (sectorFilter !== "All" && m.sector !== sectorFilter) return false;
    // In a real app, members would have a programId field. For mockup, we just show all filtered
    return true;
  }) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-display font-bold text-white mb-4">EAAPA Programs</h1>
        <p className="text-xl text-muted-foreground">Comprehensive growth tracks designed to elevate every stage of your agricultural journey.</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {PROGRAMS.map(prog => (
          <button
            key={prog.id}
            onClick={() => setActiveTab(prog.id)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === prog.id 
                ? "bg-primary text-white shadow-lg shadow-primary/20" 
                : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white"
            }`}
          >
            {prog.name}
          </button>
        ))}
      </div>

      {/* Program Info */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="glass-panel p-8 md:p-12 rounded-3xl mb-12 border-primary/20 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full" />
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-4">{currentProgram.name} Program</h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl">{currentProgram.desc}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {currentProgram.benefits.map((ben, i) => (
                <div key={i} className="flex items-center gap-3 bg-background/50 p-4 rounded-xl border border-white/5">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                  <span className="font-medium text-white">{ben}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Program Cohort / Members */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold text-white">Current Cohort</h3>
          <p className="text-muted-foreground">Discover participants in this track.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <select 
            className="bg-card border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-primary outline-none flex-1 md:w-48"
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
          >
            <option value="All">All Regions</option>
            <option value="Central Kenya">Central Kenya</option>
            <option value="Rift Valley">Rift Valley</option>
            <option value="Western">Western</option>
          </select>
          <select 
            className="bg-card border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-primary outline-none flex-1 md:w-48"
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
          >
            <option value="All">All Sectors</option>
            <option value="Horticulture">Horticulture</option>
            <option value="Dairy">Dairy</option>
            <option value="Agri-Tech">Agri-Tech</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredMembers.slice(0, 8).map((member, idx) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            key={member.id} 
            className="bg-card border border-white/10 p-6 rounded-2xl flex flex-col hover:border-primary/50 transition-colors group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center text-lg font-bold">
                {member.name.charAt(0)}
              </div>
              <span className="px-2 py-1 rounded bg-white/5 text-[10px] uppercase font-bold text-white/70 tracking-wider">
                {member.role}
              </span>
            </div>
            
            <h4 className="font-bold text-white text-lg group-hover:text-primary transition-colors">{member.name}</h4>
            <p className="text-sm text-primary mb-4">{member.sector}</p>
            
            <div className="space-y-2 mb-6 flex-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="w-3.5 h-3.5" /> {member.region}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Briefcase className="w-3.5 h-3.5" /> {member.businessType || 'Startup'}
              </div>
            </div>

            <button 
              onClick={() => connect({ id: member.id }, { onSuccess: () => toast({ title: "Connected", description: "Request sent successfully." }) })}
              className="w-full py-2 rounded-lg bg-primary/10 text-primary font-bold hover:bg-primary hover:text-white transition-all text-sm"
            >
              Connect
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
