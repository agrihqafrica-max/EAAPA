import { useParams, Link } from "wouter";
import { useGetCommodity } from "@workspace/api-client-react";
import { LoadingScreen } from "@/components/ui/Loading";
import { ArrowLeft, Cpu, Activity, TrendingUp, Globe, AlertTriangle } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useState } from "react";

export default function AILayer() {
  const params = useParams();
  const id = parseInt(params.id || "0");
  const { data: commodity, isLoading } = useGetCommodity(id);
  
  const [acreage, setAcreage] = useState(50);
  const [targetMarket, setTargetMarket] = useState<"local"|"export">("local");

  if (isLoading) return <LoadingScreen />;
  if (!commodity) return <div className="p-10 text-white">Commodity not found</div>;

  const basePrice = commodity.overview.globalPrice;
  const yieldPerAcre = 4; // tons
  const basePricePerTon = basePrice;
  const estimatedYield = acreage * yieldPerAcre;
  const multiplier = targetMarket === "export" ? 1.4 : 1;
  const revenue = estimatedYield * basePricePerTon * multiplier;

  // Mock forecast data
  const forecastData = Array.from({ length: 12 }).map((_, i) => ({
    month: `M${i+1}`,
    price: basePrice * (1 + (Math.sin(i) * 0.15) + (i * 0.02))
  }));

  const arbitrageMarkets = [
    { name: "Dubai", price: basePrice * 1.8, score: 92, rec: "Strong Buy" },
    { name: "Rotterdam", price: basePrice * 2.1, score: 88, rec: "Strong Buy" },
    { name: "Shanghai", price: basePrice * 1.5, score: 75, rec: "Hold" },
    { name: "London", price: basePrice * 1.9, score: 82, rec: "Buy" },
    { name: "Nairobi", price: basePrice, score: 40, rec: "Local Supply" }
  ];

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href={`/market-hub/${id}`} className="inline-flex items-center gap-2 text-muted-foreground hover:text-white transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" /> Back to Data Room
      </Link>

      <div className="flex items-center justify-between mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-display font-bold text-white">{commodity.name}</h1>
            <span className="px-3 py-1 rounded-lg bg-secondary/20 border border-secondary/30 text-secondary text-sm font-bold flex items-center gap-1.5">
              <Cpu className="w-4 h-4" /> Layer 3 AI
            </span>
          </div>
          <p className="text-muted-foreground text-lg">Predictive Automation & Arbitrage Engine</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Live Neural Sync
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Scenario Simulator */}
        <div className="glass-panel rounded-3xl p-8 border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 blur-[80px] rounded-full" />
          <h2 className="text-2xl font-bold text-white mb-8">Scenario Simulator</h2>
          
          <div className="space-y-8 relative z-10">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-white font-medium">If I plant...</label>
                <span className="text-primary font-bold">{acreage} Acres</span>
              </div>
              <input 
                type="range" min="1" max="500" step="1" 
                value={acreage} onChange={(e) => setAcreage(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>

            <div>
              <label className="text-white font-medium mb-3 block">Target Market</label>
              <div className="flex gap-4">
                <button 
                  onClick={() => setTargetMarket("local")}
                  className={`flex-1 py-3 rounded-xl border font-bold transition-all ${targetMarket === 'local' ? 'bg-primary/20 border-primary text-primary' : 'bg-background border-white/10 text-white/70'}`}
                >
                  Local Hubs
                </button>
                <button 
                  onClick={() => setTargetMarket("export")}
                  className={`flex-1 py-3 rounded-xl border font-bold transition-all ${targetMarket === 'export' ? 'bg-secondary/20 border-secondary text-secondary' : 'bg-background border-white/10 text-white/70'}`}
                >
                  Export Route (+40% Prem)
                </button>
              </div>
            </div>

            <div className="bg-background/80 border border-white/10 p-6 rounded-2xl">
              <div className="text-sm text-muted-foreground mb-4">AI Projection</div>
              <div className="text-xl text-white font-medium leading-relaxed">
                Planting <span className="font-bold text-primary">{acreage} acres</span> will yield approx <span className="font-bold text-primary">{estimatedYield.toLocaleString()} tons</span>. At current {targetMarket} rates, projected revenue is <span className="font-bold text-secondary text-3xl block mt-2">${revenue.toLocaleString(undefined, {maximumFractionDigits:0})}</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Forecasting */}
        <div className="glass-panel rounded-3xl p-8 border-white/10">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white">12-Month Price Forecast</h2>
            <div className="flex gap-2">
              <span className="px-3 py-1 rounded bg-white/10 text-xs text-white">3M</span>
              <span className="px-3 py-1 rounded bg-primary text-xs text-white font-bold">12M</span>
            </div>
          </div>
          <div className="h-64 w-full mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData}>
                <defs>
                  <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 100', 'dataMax + 100']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'white' }}
                  itemStyle={{ color: 'hsl(var(--secondary))' }}
                />
                <Area type="monotone" dataKey="price" stroke="hsl(var(--secondary))" strokeWidth={3} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorForecast)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-start gap-3 bg-secondary/10 p-4 rounded-xl border border-secondary/20">
            <TrendingUp className="w-5 h-5 text-secondary flex-shrink-0" />
            <p className="text-sm text-secondary font-medium">Model indicates a 14% price surge in M4 due to projected rainfall deficits in competing regions.</p>
          </div>
        </div>
      </div>

      {/* Global Arbitrage & Smart Contracts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel rounded-3xl p-8 border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><Globe className="w-6 h-6 text-primary"/> Global Arbitrage Scanner</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-sm text-muted-foreground border-b border-white/10">
                  <th className="pb-4">Market</th>
                  <th className="pb-4">Est. Landed Price</th>
                  <th className="pb-4">Opp. Score</th>
                  <th className="pb-4 text-right">AI Rec</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {arbitrageMarkets.map((m, i) => (
                  <tr key={i}>
                    <td className="py-4 font-bold text-white">{m.name}</td>
                    <td className="py-4 font-mono text-white/80">${m.price.toFixed(2)}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${m.score}%` }} />
                        </div>
                        <span className="text-xs text-white/70">{m.score}</span>
                      </div>
                    </td>
                    <td className="py-4 text-right">
                      <span className={`px-3 py-1 rounded-md text-xs font-bold ${
                        m.rec.includes('Buy') ? 'bg-primary/20 text-primary' : 'bg-white/10 text-white/70'
                      }`}>
                        {m.rec}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-8 border-white/10 bg-gradient-to-br from-card to-background">
          <h2 className="text-2xl font-bold text-white mb-6">Smart Contracts</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
              <div>
                <div className="font-bold text-white">Auto-Negotiation</div>
                <div className="text-xs text-muted-foreground">AI negotiates within margins</div>
              </div>
              <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="text-sm font-medium text-white/80">Execution Pipeline</div>
              {['Match Buyer', 'Lock Price Oracle', 'Escrow Funds', 'Trigger Logistics'].map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-xs text-muted-foreground">{i+1}</div>
                  <span className="text-sm text-white">{step}</span>
                </div>
              ))}
            </div>

            <button className="w-full py-3 mt-4 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
              <Activity className="w-4 h-4" /> Deploy Contract
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
