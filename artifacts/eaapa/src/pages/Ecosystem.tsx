import { useState } from "react";
import { useListMembers, useConnectMember } from "@workspace/api-client-react";
import { LoadingScreen } from "@/components/ui/Loading";
import { Search, Filter, Mail, MapPin, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function Ecosystem() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: members, isLoading } = useListMembers();
  const { mutate: connect } = useConnectMember();
  const { toast } = useToast();

  if (isLoading) return <LoadingScreen />;

  const handleConnect = (id: number) => {
    connect({ id }, {
      onSuccess: () => {
        toast({
          title: "Connection Request Sent",
          description: "They will be added to your network once approved.",
        });
      }
    });
  };

  const filteredMembers = members?.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.sector.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Ecosystem Directory</h1>
          <p className="text-muted-foreground mt-2">Connect with leading agripreneurs and investors across East Africa.</p>
        </div>
        
        <div className="flex w-full md:w-auto gap-4">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              className="w-full bg-card border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
              placeholder="Search by name or sector..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-2.5 rounded-xl bg-card border border-white/10 text-white hover:bg-white/5 transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMembers.map((member, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            key={member.id} 
            className="glass-panel p-6 rounded-2xl flex flex-col h-full hover:border-primary/30 transition-all duration-300 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center overflow-hidden">
                {member.avatarUrl ? (
                  <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-lg font-bold text-primary">{member.name.charAt(0)}</span>
                )}
              </div>
              <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-medium text-white/80 capitalize">
                {member.role}
              </span>
            </div>
            
            <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{member.name}</h3>
            <p className="text-sm text-primary mt-1">{member.sector}</p>
            
            <div className="mt-4 space-y-2 flex-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 opacity-70" /> {member.region}, {member.country}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Briefcase className="w-4 h-4 opacity-70" /> {member.businessType || 'Independent'}
              </div>
            </div>

            <button 
              onClick={() => handleConnect(member.id)}
              className="mt-6 w-full py-2.5 rounded-lg bg-primary/10 text-primary font-semibold hover:bg-primary hover:text-white transition-all duration-200"
            >
              Connect
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
