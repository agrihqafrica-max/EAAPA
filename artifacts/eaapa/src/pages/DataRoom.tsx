import { useParams, Link } from "wouter";
import { useGetCommodity } from "@workspace/api-client-react";
import { LoadingScreen } from "@/components/ui/Loading";
import { ArrowLeft, TrendingUp, Zap, Target, Box } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function DataRoom() {
  const params = useParams();
  const id = parseInt(params.id || "0");
  
  const { data: commodity, isLoading } = useGetCommodity(id);

  if (isLoading) return <LoadingScreen />;
  if (!commodity) return <div className="p-10 text-white">Commodity not found</div>;

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/market-hub" className="inline-flex items-center gap-2 text-muted-foreground hover:text-white transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="flex items-end justify-between mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-display font-bold text-white">{commodity.name}</h1>
            <span className="px-3 py-1 rounded-lg bg-primary/20 border border-primary/30 text-primary text-sm font-bold">Layer 2</span>
          </div>
          <p className="text-muted-foreground text-lg">{commodity.category} Data Room</p>
        </div>
        <button className="px-6 py-3 rounded-xl bg-secondary text-white font-bold hover:bg-secondary/90 transition-all flex items-center gap-2 shadow-lg shadow-secondary/20">
          <Zap className="w-4 h-4" /> Advanced AI Layer
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Overview Stats */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border-white/10">
          <h2 className="text-xl font-bold text-white mb-6">Price History & Forecast</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={commodity.historicalPrices}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'white' }}
                  itemStyle={{ color: 'hsl(var(--primary))' }}
                />
                <Area type="monotone" dataKey="price" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Opportunity Box */}
        <div className="bg-gradient-to-br from-card to-background border border-primary/30 rounded-2xl p-6 shadow-[0_0_30px_rgba(16,185,129,0.1)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] rounded-full" />
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" /> AI Match Engine
          </h2>
          
          <div className="space-y-6 relative z-10">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Opportunity Score</span>
                <span className="text-primary font-bold">{commodity.aiEngine.opportunityScore}/100</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${commodity.aiEngine.opportunityScore}%` }} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <p className="text-xs text-muted-foreground mb-1">Proj. Yield</p>
                <p className="text-lg font-mono font-bold text-white">{commodity.aiEngine.yieldProjectionTons}T</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <p className="text-xs text-muted-foreground mb-1">Proj. Revenue</p>
                <p className="text-lg font-mono font-bold text-white">${(commodity.aiEngine.revenueProjectionUsd / 1000).toFixed(1)}k</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-white mb-2">Target Buyers</p>
              <div className="flex flex-wrap gap-2">
                {commodity.aiEngine.targetBuyers.map((b, i) => (
                  <span key={i} className="px-2.5 py-1 text-xs font-medium rounded-md bg-secondary/20 text-secondary border border-secondary/20">
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Buyer Directory Preview */}
      <div className="glass-panel rounded-2xl p-6 border-white/10">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Box className="w-5 h-5" /> Active Buyers
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-sm text-muted-foreground">
                <th className="pb-3">Buyer Name</th>
                <th className="pb-3">Location</th>
                <th className="pb-3">Monthly Demand</th>
                <th className="pb-3">AI Match</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {commodity.buyers.map((buyer) => (
                <tr key={buyer.id} className="hover:bg-white/[0.02]">
                  <td className="py-4">
                    <div className="font-bold text-white">{buyer.name}</div>
                    <div className="text-xs text-muted-foreground">{buyer.type}</div>
                  </td>
                  <td className="py-4 text-white/80">{buyer.location}</td>
                  <td className="py-4 font-mono text-white">{buyer.monthlyDemandTons} T</td>
                  <td className="py-4">
                    <span className="text-primary font-bold">{buyer.aiMatchScore}%</span>
                  </td>
                  <td className="py-4 text-right">
                    <button className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all">
                      Negotiate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
