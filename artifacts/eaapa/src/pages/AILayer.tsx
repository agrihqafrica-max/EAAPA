import { useParams, Link } from "wouter";
import { useGetCommodity } from "@workspace/api-client-react";
import { LoadingScreen } from "@/components/ui/Loading";
import { ArrowLeft, Cpu, Activity, TrendingUp, Globe, AlertTriangle, Check, Zap } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useState } from "react";
import { clsx } from "clsx";

export default function AILayer() {
  const params = useParams();
  const id = parseInt(params.id || "0");
  const { data: commodity, isLoading, error } = useGetCommodity(id, {
    query: { queryKey: ["getCommodity", id], enabled: id > 0 }
  });

  const [acreage, setAcreage] = useState(50);
  const [targetMarket, setTargetMarket] = useState<"local" | "export">("local");
  const [forecastPeriod, setForecastPeriod] = useState<3 | 12>(12);
  const [autoNegotiate, setAutoNegotiate] = useState(true);
  const [deployState, setDeployState] = useState<"idle" | "loading" | "deployed">("idle");
  const [deployedId, setDeployedId] = useState("");

  if (!id || id <= 0) return (
    <div className="p-10 text-center text-white">
      <div className="text-muted-foreground mb-4">Invalid commodity ID.</div>
      <Link href="/market-hub" className="text-primary hover:underline">← Return to Market Hub</Link>
    </div>
  );
  if (isLoading) return <LoadingScreen />;
  if (error || !commodity) return (
    <div className="p-10 text-center text-white">
      <AlertTriangle className="w-10 h-10 text-destructive mx-auto mb-4" />
      <div className="text-lg font-bold mb-2">Commodity not found</div>
      <div className="text-muted-foreground mb-6">The requested data could not be loaded.</div>
      <Link href="/market-hub" className="inline-flex items-center gap-2 text-primary hover:underline">
        <ArrowLeft className="w-4 h-4" /> Return to Market Hub
      </Link>
    </div>
  );

  const basePrice = commodity.overview.globalPrice;
  const yieldPerAcre = 4;
  const estimatedYield = acreage * yieldPerAcre;
  const multiplier = targetMarket === "export" ? 1.4 : 1;
  const revenue = estimatedYield * basePrice * multiplier;

  const forecastData = Array.from({ length: forecastPeriod }).map((_, i) => ({
    month: forecastPeriod === 3 ? `W${i * 4 + 1}` : `M${i + 1}`,
    price: Math.max(0, basePrice * (1 + Math.sin(i * 0.8) * 0.12 + i * 0.015))
  }));

  const arbitrageMarkets = [
    { name: "Dubai", price: basePrice * 1.8, score: 92, rec: "Strong Buy" },
    { name: "Rotterdam", price: basePrice * 2.1, score: 88, rec: "Strong Buy" },
    { name: "Shanghai", price: basePrice * 1.5, score: 75, rec: "Hold" },
    { name: "London", price: basePrice * 1.9, score: 82, rec: "Buy" },
    { name: "Nairobi", price: basePrice, score: 40, rec: "Local Supply" },
  ];

  const handleDeploy = () => {
    if (deployState !== "idle") return;
    setDeployState("loading");
    setTimeout(() => {
      setDeployedId(`SC-${Math.floor(Math.random() * 90000 + 10000)}`);
      setDeployState("deployed");
    }, 2000);
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href={`/market-hub/${id}`} className="inline-flex items-center gap-2 text-muted-foreground hover:text-white transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" /> Back to Data Room
      </Link>

      <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h1 className="text-4xl font-display font-bold text-white">{commodity.name}</h1>
            <span className="px-3 py-1 rounded-lg bg-secondary/20 border border-secondary/30 text-secondary text-sm font-bold flex items-center gap-1.5">
              <Cpu className="w-4 h-4" /> Layer 3 AI
            </span>
          </div>
          <p className="text-muted-foreground text-lg">Predictive Automation & Arbitrage Engine</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          Live Neural Sync
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Scenario Simulator */}
        <div className="glass-panel rounded-3xl p-8 border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 blur-[80px] rounded-full pointer-events-none" />
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
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>1 ac</span><span>500 ac</span>
              </div>
            </div>

            <div>
              <label className="text-white font-medium mb-3 block">Target Market</label>
              <div className="flex gap-4">
                <button
                  onClick={() => setTargetMarket("local")}
                  className={clsx(
                    "flex-1 py-3 rounded-xl border font-bold transition-all",
                    targetMarket === 'local'
                      ? 'bg-primary/20 border-primary text-primary'
                      : 'bg-background border-white/10 text-white/70 hover:text-white'
                  )}
                >
                  Local Hubs
                </button>
                <button
                  onClick={() => setTargetMarket("export")}
                  className={clsx(
                    "flex-1 py-3 rounded-xl border font-bold transition-all",
                    targetMarket === 'export'
                      ? 'bg-secondary/20 border-secondary text-secondary'
                      : 'bg-background border-white/10 text-white/70 hover:text-white'
                  )}
                >
                  Export Route (+40% Prem)
                </button>
              </div>
            </div>

            <div className="bg-background/80 border border-white/10 p-6 rounded-2xl">
              <div className="text-sm text-muted-foreground mb-4">AI Projection</div>
              <div className="text-base text-white font-medium leading-relaxed">
                Planting <span className="font-bold text-primary">{acreage} acres</span> will yield approx{" "}
                <span className="font-bold text-primary">{estimatedYield.toLocaleString()} tons</span>. At current {targetMarket} rates, projected revenue is
                <span className="font-bold text-secondary text-3xl block mt-2">
                  ${revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Forecasting */}
        <div className="glass-panel rounded-3xl p-8 border-white/10">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white">Price Forecast</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setForecastPeriod(3)}
                className={clsx(
                  "px-3 py-1 rounded text-xs font-bold transition-all",
                  forecastPeriod === 3 ? "bg-primary text-white" : "bg-white/10 text-white hover:bg-white/20"
                )}
              >
                3M
              </button>
              <button
                onClick={() => setForecastPeriod(12)}
                className={clsx(
                  "px-3 py-1 rounded text-xs font-bold transition-all",
                  forecastPeriod === 12 ? "bg-primary text-white" : "bg-white/10 text-white hover:bg-white/20"
                )}
              >
                12M
              </button>
            </div>
          </div>
          <div className="h-64 w-full mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData}>
                <defs>
                  <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  domain={['dataMin - 50', 'dataMax + 50']}
                  tickFormatter={val => `$${Math.round(val)}`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'white' }}
                  itemStyle={{ color: 'hsl(var(--secondary))' }}
                  formatter={(val: number) => [`$${val.toFixed(2)}`, "Forecast Price"]}
                />
                <Area type="monotone" dataKey="price" stroke="hsl(var(--secondary))" strokeWidth={3} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorForecast)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-start gap-3 bg-secondary/10 p-4 rounded-xl border border-secondary/20">
            <TrendingUp className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
            <p className="text-sm text-secondary font-medium">
              Model indicates a 14% price surge in {forecastPeriod === 3 ? "week 8" : "M4"} due to projected rainfall deficits in competing regions.
            </p>
          </div>
        </div>
      </div>

      {/* Global Arbitrage & Smart Contracts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel rounded-3xl p-8 border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Globe className="w-6 h-6 text-primary" /> Global Arbitrage Scanner
          </h2>
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
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 font-bold text-white">{m.name}</td>
                    <td className="py-4 font-mono text-white/80">${m.price.toFixed(2)}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className={clsx("h-full", m.score > 80 ? "bg-primary" : m.score > 60 ? "bg-blue-500" : "bg-secondary")}
                            style={{ width: `${m.score}%` }}
                          />
                        </div>
                        <span className="text-xs text-white/70">{m.score}</span>
                      </div>
                    </td>
                    <td className="py-4 text-right">
                      <span className={clsx(
                        "px-3 py-1 rounded-md text-xs font-bold",
                        m.rec.includes('Buy') ? 'bg-primary/20 text-primary' : 'bg-white/10 text-white/70'
                      )}>
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
            {/* Auto-Negotiate Toggle */}
            <button
              onClick={() => setAutoNegotiate(v => !v)}
              className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 w-full text-left hover:bg-white/[0.07] transition-colors"
            >
              <div>
                <div className="font-bold text-white">Auto-Negotiation</div>
                <div className="text-xs text-muted-foreground">AI negotiates within margins</div>
              </div>
              <div className={clsx(
                "w-12 h-6 rounded-full relative transition-colors flex-shrink-0",
                autoNegotiate ? "bg-primary" : "bg-white/20"
              )}>
                <div className={clsx(
                  "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                  autoNegotiate ? "right-1" : "left-1"
                )} />
              </div>
            </button>

            <div className="space-y-3">
              <div className="text-sm font-medium text-white/80">Execution Pipeline</div>
              {['Match Buyer', 'Lock Price Oracle', 'Escrow Funds', 'Trigger Logistics'].map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={clsx(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 transition-colors",
                    deployState === "deployed" ? "bg-primary/20 text-primary" : "bg-white/5 text-muted-foreground"
                  )}>
                    {deployState === "deployed" ? <Check className="w-3 h-3" /> : i + 1}
                  </div>
                  <span className={clsx("text-sm", deployState === "deployed" ? "text-white" : "text-white/70")}>{step}</span>
                </div>
              ))}
            </div>

            {deployState === "deployed" ? (
              <div className="space-y-3">
                <div className="w-full py-3 rounded-xl bg-primary/20 border border-primary text-primary font-bold flex items-center justify-center gap-2 text-sm">
                  <Check className="w-4 h-4" /> Contract Live
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                  <div className="text-xs text-muted-foreground mb-1">Contract ID</div>
                  <div className="font-mono font-bold text-white text-sm">{deployedId}</div>
                </div>
                <button
                  onClick={() => { setDeployState("idle"); setDeployedId(""); }}
                  className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white text-sm font-medium transition-colors"
                >
                  New Contract
                </button>
              </div>
            ) : (
              <button
                onClick={handleDeploy}
                disabled={deployState === "loading"}
                className="w-full py-3 mt-4 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 disabled:opacity-70 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
              >
                {deployState === "loading" ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Deploying...
                  </>
                ) : (
                  <><Activity className="w-4 h-4" /> Deploy Contract</>
                )}
              </button>
            )}

            {!autoNegotiate && deployState === "idle" && (
              <p className="text-xs text-muted-foreground text-center">
                <Zap className="w-3 h-3 inline mr-1 text-secondary" />
                Enable auto-negotiation for faster execution
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
