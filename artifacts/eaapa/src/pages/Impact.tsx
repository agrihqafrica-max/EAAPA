import { useGetImpactMetrics, useListSuccessStories } from "@workspace/api-client-react";
import { LoadingScreen } from "@/components/ui/Loading";
import { TrendingUp, Users, Target, Globe } from "lucide-react";
import { motion } from "framer-motion";

export default function Impact() {
  const { data: metrics, isLoading: loading1 } = useGetImpactMetrics();
  const { data: stories, isLoading: loading2 } = useListSuccessStories();

  if (loading1 || loading2) return <LoadingScreen />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-display font-bold text-white mb-4">Platform Impact</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Measuring the transformation of the East African agricultural landscape.</p>
      </div>

      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel p-8 rounded-3xl text-center border-t-4 border-t-primary">
            <Users className="w-8 h-8 text-primary mx-auto mb-4" />
            <div className="text-4xl font-display font-bold text-white mb-2">{metrics.totalAgripreneurs.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground font-medium uppercase tracking-wide">Agripreneurs</div>
          </motion.div>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }} className="glass-panel p-8 rounded-3xl text-center border-t-4 border-t-secondary">
            <TrendingUp className="w-8 h-8 text-secondary mx-auto mb-4" />
            <div className="text-4xl font-display font-bold text-white mb-2">${(metrics.marketValueUsd / 1000000).toFixed(1)}M</div>
            <div className="text-sm text-muted-foreground font-medium uppercase tracking-wide">Market Value Created</div>
          </motion.div>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }} className="glass-panel p-8 rounded-3xl text-center border-t-4 border-t-blue-500">
            <Target className="w-8 h-8 text-blue-500 mx-auto mb-4" />
            <div className="text-4xl font-display font-bold text-white mb-2">{metrics.totalJobsCreated.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground font-medium uppercase tracking-wide">Jobs Created</div>
          </motion.div>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3 }} className="glass-panel p-8 rounded-3xl text-center border-t-4 border-t-purple-500">
            <Globe className="w-8 h-8 text-purple-500 mx-auto mb-4" />
            <div className="text-4xl font-display font-bold text-white mb-2">{metrics.countriesReached}</div>
            <div className="text-sm text-muted-foreground font-medium uppercase tracking-wide">Countries Active</div>
          </motion.div>
        </div>
      )}

      <h2 className="text-3xl font-display font-bold text-white mb-8">Success Stories</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {stories?.map((story) => (
          <div key={story.id} className="bg-card border border-white/10 rounded-2xl overflow-hidden flex flex-col md:flex-row">
            <div className="p-6 md:w-2/3 flex flex-col justify-center">
              <h3 className="text-xl font-bold text-white mb-2">{story.title}</h3>
              <p className="text-sm text-muted-foreground mb-6 line-clamp-3">{story.story}</p>
              <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-auto">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    {story.agripreneurName.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-white">{story.agripreneurName}</span>
                </div>
                <span className="text-sm font-bold text-primary">+{story.growthPercent}% Growth</span>
              </div>
            </div>
            <div className="bg-white/5 p-6 md:w-1/3 flex flex-col justify-center border-l border-white/10">
              <div className="mb-4">
                <div className="text-xs text-muted-foreground mb-1">Revenue</div>
                <div className="text-lg font-mono font-bold text-white">${story.revenueUsd.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Region</div>
                <div className="text-sm font-medium text-white">{story.region}, {story.country}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
