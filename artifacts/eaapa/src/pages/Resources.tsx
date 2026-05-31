import { useState } from "react";
import { useListResources } from "@workspace/api-client-react";
import { LoadingScreen } from "@/components/ui/Loading";
import { FileText, Download, FileVideo, FileSpreadsheet, Lock, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { clsx } from "clsx";

const CATEGORIES = ["All", "Research", "Best Practices", "Training", "Policy", "Market Report"];

export default function Resources() {
  const [activeCat, setActiveCat] = useState("All");
  const { data: resources, isLoading } = useListResources();

  if (isLoading) return <LoadingScreen />;

  const filtered = resources?.filter(r => {
    if (activeCat === "All") return true;
    return r.category.toLowerCase().replace('_', ' ') === activeCat.toLowerCase();
  }) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">Ecosystem Knowledge Center</h1>
        <p className="text-xl text-muted-foreground">Access institutional-grade research, validated best practices, and regional policy documents.</p>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCat(cat)}
            className={clsx(
              "px-6 py-3 rounded-full text-sm font-bold transition-all shadow-sm",
              activeCat === cat 
                ? "bg-primary text-white shadow-primary/20" 
                : "bg-card border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filtered.map((res) => (
          <div key={res.id} className="glass-panel p-8 rounded-[2rem] flex flex-col group hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 border-border">
            <div className="flex justify-between items-start mb-6">
              <div className={clsx(
                "w-14 h-14 rounded-2xl flex items-center justify-center",
                res.fileType === 'pdf' ? "bg-blue-500/10 text-blue-400" :
                res.fileType === 'video' ? "bg-purple-500/10 text-purple-400" : "bg-emerald-500/10 text-emerald-400"
              )}>
                {res.fileType === 'pdf' ? <FileText className="w-7 h-7" /> :
                 res.fileType === 'video' ? <FileVideo className="w-7 h-7" /> : <FileSpreadsheet className="w-7 h-7" />}
              </div>
              <span className="px-3 py-1 rounded-full bg-muted/50 border border-border text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {res.category.replace('_', ' ')}
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors leading-snug">{res.title}</h3>
            <p className="text-sm text-muted-foreground mb-8 flex-1 leading-relaxed">{res.description}</p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-medium text-muted-foreground border-t border-border pt-4">
                <span>{res.author}</span>
                <span>{format(new Date(res.publishedAt), 'MMM yyyy')}</span>
              </div>
              
              <button className="w-full py-4 rounded-xl bg-muted/50 hover:bg-primary border border-border hover:border-primary text-white font-bold transition-all flex items-center justify-center gap-3 group/btn">
                <Download className="w-5 h-5 text-muted-foreground group-hover/btn:text-white transition-colors" /> 
                Download {res.fileType.toUpperCase()} ({res.fileSize})
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {filtered.length === 0 && (
        <div className="text-center py-20 glass-panel rounded-3xl border-dashed">
          <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-bold text-foreground mb-2">No Resources Found</h3>
          <p className="text-muted-foreground">Try adjusting your category filter.</p>
        </div>
      )}
    </div>
  );
}
