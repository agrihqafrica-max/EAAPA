import { useEffect, useState } from "react";
import { useGetImpactMetrics, useListSuccessStories } from "@workspace/api-client-react";
import { LoadingScreen } from "@/components/ui/Loading";
import { TrendingUp, Users, Target, Globe, Briefcase, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

// Animated counter hook
function useCounter(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTime: number | null = null;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration]);
  return count;
}

export default function Impact() {
  const { data: metrics, isLoading: l1 } = useGetImpactMetrics();
  const { data: stories, isLoading: l2 } = useListSuccessStories();

  if (l1 || l2) return <LoadingScreen />;

  return (
    <div className="w-full">
      <div className="bg-card border-b border-border py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-display font-bold text-foreground mb-6">Platform Impact</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Measuring the transformation of the East African agricultural landscape through data, capital, and network effects.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-10 relative z-20">
        {metrics && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              <StatCard title="Agripreneurs" value={metrics.totalAgripreneurs} icon={Users} color="text-primary" border="border-t-primary" />
              <StatCard title="Market Value Created" value={`$${(metrics.marketValueUsd / 1000000).toFixed(1)}M`} icon={TrendingUp} color="text-secondary" border="border-t-secondary" isText />
              <StatCard title="Jobs Created" value={metrics.totalJobsCreated} icon={Briefcase} color="text-blue-400" border="border-t-blue-400" />
              <StatCard title="Countries Active" value={metrics.countriesReached} icon={Globe} color="text-purple-400" border="border-t-purple-400" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
              <div className="lg:col-span-2 glass-panel p-8 rounded-3xl border-border">
                <h2 className="text-2xl font-bold text-foreground mb-8">Value Creation by Region</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={metrics.regionalImpact} layout="vertical" margin={{ left: 40 }}>
                      <XAxis type="number" hide />
                      <YAxis dataKey="region" type="category" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))'}} />
                      <Tooltip 
                        cursor={{fill: 'hsl(var(--card))'}}
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '12px' }}
                        formatter={(val: number) => [`$${(val/1000000).toFixed(1)}M`, "Value"]}
                      />
                      <Bar dataKey="marketValueUsd" radius={[0, 8, 8, 0]} barSize={32}>
                        {metrics.regionalImpact.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? 'hsl(var(--primary))' : 'hsl(var(--primary)/0.3)'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="glass-panel p-8 rounded-3xl border-border flex flex-col justify-center bg-gradient-to-br from-card to-background">
                <h3 className="text-xl font-bold text-foreground mb-6">Regional Distribution</h3>
                <div className="space-y-6">
                  {metrics.regionalImpact.slice(0,4).map(r => (
                    <div key={r.region}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-white font-medium">{r.region}, {r.country}</span>
                        <span className="text-muted-foreground">{r.agripreneurs.toLocaleString()} members</span>
                      </div>
                      <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{width: `${(r.agripreneurs/metrics.totalAgripreneurs)*100}%`}} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        <div className="mb-10 flex justify-between items-end">
          <h2 className="text-4xl font-display font-bold text-foreground">Success Stories</h2>
          <button className="text-primary font-bold flex items-center gap-1 hover:text-foreground transition-colors">View All <ChevronRight className="w-5 h-5"/></button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {stories?.map((story) => (
            <div key={story.id} className="glass-panel border-border rounded-[2rem] overflow-hidden flex flex-col md:flex-row group hover:-translate-y-1 transition-transform duration-300 shadow-xl">
              <div className="p-8 md:w-3/5 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-emerald-700 flex items-center justify-center text-2xl font-bold text-foreground shadow-lg">
                    {story.agripreneurName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{story.agripreneurName}</h3>
                    <p className="text-sm text-primary font-medium">{story.sector}</p>
                  </div>
                </div>
                <h4 className="text-lg font-bold text-foreground mb-3 leading-snug">{story.title}</h4>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-6">{story.story}</p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {story.commodities?.map(c => <span key={c} className="px-3 py-1 rounded-md bg-muted/50 text-xs text-foreground/65">{c}</span>)}
                </div>
              </div>
              <div className="bg-background/80 p-8 md:w-2/5 flex flex-col justify-center border-l border-border">
                <div className="space-y-6">
                  <div>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Annual Revenue</div>
                    <div className="text-3xl font-mono font-bold text-foreground">${story.revenueUsd.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Jobs Created</div>
                    <div className="text-xl font-mono font-bold text-foreground">{story.jobsCreated}</div>
                  </div>
                  <div className="pt-6 border-t border-border">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Growth via EAAPA</div>
                    <div className="text-xl font-bold text-primary">+{story.growthPercent}%</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, border, isText = false }: any) {
  const count = useCounter(isText ? 0 : value as number);
  
  return (
    <motion.div initial={{ scale: 0.95, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} className={`glass-panel p-8 rounded-[2rem] text-center border-t-4 ${border} hover:-translate-y-1 transition-transform`}>
      <Icon className={`w-8 h-8 ${color} mx-auto mb-6`} />
      <div className="text-4xl md:text-5xl font-display font-bold text-foreground mb-3 font-mono">
        {isText ? value : count.toLocaleString()}
      </div>
      <div className="text-sm text-muted-foreground font-bold uppercase tracking-widest">{title}</div>
    </motion.div>
  );
}
