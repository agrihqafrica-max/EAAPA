import { useListProjects, useJoinProject } from "@workspace/api-client-react";
import { LoadingScreen } from "@/components/ui/Loading";
import { Users, Calendar, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Projects() {
  const { data: projects, isLoading } = useListProjects();
  const { mutate: join } = useJoinProject();
  const { toast } = useToast();

  if (isLoading) return <LoadingScreen />;

  const handleJoin = (id: number) => {
    join({ id }, {
      onSuccess: () => toast({ title: "Joined Project Room" })
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-display font-bold text-foreground">Collaboration Network</h1>
        <p className="text-muted-foreground mt-2">Join active value chain projects across the region.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects?.map((proj) => (
          <div key={proj.id} className="bg-card border border-border p-6 rounded-2xl flex flex-col justify-between hover:shadow-xl hover:shadow-primary/5 transition-all group">
            <div>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{proj.title}</h3>
                <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase ${
                  proj.status === 'active' ? 'bg-primary/20 text-primary' : 'bg-muted text-foreground/65'
                }`}>
                  {proj.status}
                </span>
              </div>
              <p className="text-muted-foreground text-sm mb-6">{proj.description}</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-t border-border pt-4 mt-auto">
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5 text-sm text-foreground/70">
                  <Users className="w-4 h-4 opacity-50" /> {proj.memberCount} Members
                </div>
                {proj.startDate && (
                  <div className="flex items-center gap-1.5 text-sm text-foreground/70">
                    <Calendar className="w-4 h-4 opacity-50" /> {new Date(proj.startDate).toLocaleDateString()}
                  </div>
                )}
              </div>
              <button 
                onClick={() => handleJoin(proj.id)}
                disabled={proj.isJoined}
                className="w-full sm:w-auto px-6 py-2 rounded-lg bg-muted/50 border border-border text-white hover:bg-primary hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {proj.isJoined ? "Joined" : "Join Room"} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
