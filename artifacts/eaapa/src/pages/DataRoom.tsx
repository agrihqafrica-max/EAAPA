import { useParams, Link } from "wouter";
import { useGetCommodity } from "@workspace/api-client-react";
import { LoadingScreen } from "@/components/ui/Loading";
import { ArrowLeft, TrendingUp, Zap, Target, Box, FileText, CheckCircle2, ShieldAlert, ArrowRight, ShieldCheck, Truck, BarChart3, AlertTriangle, Calendar } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useState } from "react";
import { clsx } from "clsx";

const TABS = ["Market Overview", "Buyer Directory", "Contract System", "Specifications", "Logistics", "AI Engine", "Alerts"];

export default function DataRoom() {
  const params = useParams();
  const id = parseInt(params.id || "0");
  
  const { data: commodity, isLoading } = useGetCommodity(id, { query: { queryKey: ['getCommodity', id] }});
  const [activeTab, setActiveTab] = useState(TABS[0]);

  const [contractVolume, setContractVolume] = useState(10);
  const [contractType, setContractType] = useState("Fixed");
  const [executionMode, setExecutionMode] = useState("Semi-Auto");

  if (isLoading) return <LoadingScreen />;
  if (!commodity) return <div className="p-10 text-white">Commodity not found</div>;

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
      
      {/* Mini Sidebar */}
      <div className="w-64 flex-shrink-0 hidden lg:block">
        <Link href="/market-hub" className="inline-flex items-center gap-2 text-muted-foreground hover:text-white transition-colors mb-8 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        
        <div className="space-y-1 sticky top-24">
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 px-3">Data Room</div>
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={clsx(
                "w-full text-left px-4 py-3 rounded-xl font-medium transition-all text-sm flex items-center justify-between",
                activeTab === tab 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-muted-foreground hover:bg-white/5 hover:text-white"
              )}
            >
              {tab}
              {tab === "Alerts" && commodity.alerts.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-destructive flex items-center justify-center text-[10px] text-white font-bold">{commodity.alerts.length}</span>
              )}
            </button>
          ))}

          <Link href={`/market-hub/${id}/ai`} className="w-full mt-8 px-4 py-3 rounded-xl bg-secondary/10 border border-secondary/20 text-secondary font-bold hover:bg-secondary/20 transition-all flex items-center justify-between text-sm shadow-[0_0_15px_rgba(217,119,6,0.1)]">
            <span className="flex items-center gap-2"><Zap className="w-4 h-4" /> Advanced Layer</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-display font-bold text-white">{commodity.name}</h1>
            <span className="px-3 py-1 rounded-lg bg-white/10 border border-white/20 text-white text-xs font-bold uppercase">{commodity.category}</span>
            <div className={clsx(
              "w-2.5 h-2.5 rounded-full",
              commodity.marketHealth === 'Green' ? "bg-primary shadow-[0_0_8px_rgba(16,185,129,0.8)]" :
              commodity.marketHealth === 'Yellow' ? "bg-secondary shadow-[0_0_8px_rgba(217,119,6,0.8)]" : "bg-destructive shadow-[0_0_8px_rgba(239,68,68,0.8)]"
            )} />
          </div>
          <p className="text-muted-foreground text-lg">{activeTab}</p>
        </div>

        {activeTab === "Market Overview" && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="glass-panel p-5 rounded-2xl">
                <div className="text-xs text-muted-foreground font-bold uppercase mb-1">Global Price</div>
                <div className="text-2xl font-mono font-bold text-white">${commodity.overview.globalPrice.toLocaleString()}</div>
              </div>
              <div className="glass-panel p-5 rounded-2xl">
                <div className="text-xs text-muted-foreground font-bold uppercase mb-1">Regional Price</div>
                <div className="text-2xl font-mono font-bold text-white">${commodity.overview.regionalPrice.toLocaleString()}</div>
              </div>
              <div className="glass-panel p-5 rounded-2xl">
                <div className="text-xs text-muted-foreground font-bold uppercase mb-1">Market Size</div>
                <div className="text-2xl font-mono font-bold text-white">${(commodity.overview.marketSizeUsd/1000000).toFixed(1)}M</div>
              </div>
              <div className="glass-panel p-5 rounded-2xl">
                <div className="text-xs text-muted-foreground font-bold uppercase mb-1">Demand Growth</div>
                <div className="text-2xl font-bold text-primary">+{commodity.overview.demandGrowthPercent}%</div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-3xl border-white/10">
              <h2 className="text-xl font-bold text-white mb-6">Price History & Forecast</h2>
              <div className="h-80 w-full">
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
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'white' }} itemStyle={{ color: 'hsl(var(--primary))' }} />
                    <Area type="monotone" dataKey="price" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-panel p-6 rounded-2xl">
                <h3 className="font-bold text-white mb-4">Top Export Destinations</h3>
                <div className="flex flex-wrap gap-2">
                  {commodity.overview.exportRegions.map((r,i) => <span key={i} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white/80">{r}</span>)}
                </div>
              </div>
              <div className="glass-panel p-6 rounded-2xl">
                <h3 className="font-bold text-white mb-4">Primary Import Hubs</h3>
                <div className="flex flex-wrap gap-2">
                  {commodity.overview.importRegions.map((r,i) => <span key={i} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white/80">{r}</span>)}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Buyer Directory" && (
          <div className="glass-panel rounded-3xl p-6 border-white/10 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-4">
                <select className="bg-background border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none">
                  <option>All Types</option>
                  <option>Retail</option>
                  <option>Exporter</option>
                  <option>Processor</option>
                </select>
                <button className="px-4 py-2 rounded-xl bg-secondary/10 border border-secondary/20 text-secondary text-sm font-bold flex items-center gap-2">
                  <Zap className="w-4 h-4"/> AI Recommended Only
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/10 text-sm text-muted-foreground uppercase tracking-wider">
                    <th className="pb-4">Buyer Name</th>
                    <th className="pb-4">Location</th>
                    <th className="pb-4">Monthly Demand</th>
                    <th className="pb-4">Sustainability</th>
                    <th className="pb-4">AI Match</th>
                    <th className="pb-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {commodity.buyers.map((buyer) => (
                    <tr key={buyer.id} className="hover:bg-white/[0.02]">
                      <td className="py-4">
                        <div className="font-bold text-white flex items-center gap-2">
                          {buyer.name} {buyer.isAiRecommended && <span className="text-secondary" title="AI Match">★</span>}
                        </div>
                        <div className="text-xs text-muted-foreground">{buyer.type} • {buyer.tradeReadiness}</div>
                      </td>
                      <td className="py-4 text-white/80">{buyer.location}</td>
                      <td className="py-4 font-mono text-white">{buyer.monthlyDemandTons}T</td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${buyer.sustainabilityScore}%` }} />
                          </div>
                          <span className="text-xs text-white/60">{buyer.sustainabilityScore}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className={clsx("font-bold", 
                          buyer.aiMatchScore > 85 ? "text-primary" : 
                          buyer.aiMatchScore > 70 ? "text-blue-400" : "text-secondary"
                        )}>{buyer.aiMatchScore}%</span>
                      </td>
                      <td className="py-4 text-right space-x-2">
                        <button className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-medium text-white transition-all">Message</button>
                        <button className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-sm font-medium text-white transition-all shadow-lg shadow-primary/20">Negotiate</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "Contract System" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="glass-panel p-8 rounded-3xl">
              <h3 className="text-2xl font-bold text-white mb-6">Contract Engine</h3>
              <div className="space-y-5">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Commodity</label>
                  <input disabled value={commodity.name} className="w-full bg-background/50 border border-white/10 rounded-xl p-3 text-white/50" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Select Buyer</label>
                  <select className="w-full bg-background border border-white/10 rounded-xl p-3 text-white outline-none">
                    {commodity.buyers.map(b => <option key={b.id}>{b.name} ({b.location})</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Volume (Tons)</label>
                  <div className="flex items-center gap-4">
                    <input type="number" value={contractVolume} onChange={e=>setContractVolume(Number(e.target.value))} className="w-full bg-background border border-white/10 rounded-xl p-3 text-white font-mono" />
                    <div className="text-2xl font-mono text-white">= ${(contractVolume * commodity.overview.globalPrice).toLocaleString()}</div>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Contract Type</label>
                  <div className="flex gap-3">
                    {['Fixed', 'Flexible', 'Dynamic'].map(t => (
                      <button key={t} onClick={()=>setContractType(t)} className={clsx("flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all", contractType===t ? "bg-primary/20 border-primary text-primary" : "bg-white/5 border-white/10 text-white/60")}>{t}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Execution Mode</label>
                  <div className="flex gap-3">
                    {['Manual', 'Semi-Auto', 'Auto'].map(t => (
                      <button key={t} onClick={()=>setExecutionMode(t)} className={clsx("flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all", executionMode===t ? "bg-white/20 border-white text-white" : "bg-white/5 border-white/10 text-white/60")}>{t}</button>
                    ))}
                  </div>
                </div>
                <button className="w-full py-4 mt-4 rounded-xl bg-primary text-white font-bold text-lg shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
                  Generate Smart Contract
                </button>
              </div>
            </div>
            <div className="glass-panel p-8 rounded-3xl bg-gradient-to-br from-card to-background border-white/10">
              <h3 className="text-xl font-bold text-white mb-8">Execution Pipeline</h3>
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
                {[
                  { title: "Harvest & Grading", icon: CheckCircle2, status: "pending" },
                  { title: "Packaging & QA", icon: Box, status: "pending" },
                  { title: "Shipment Logistics", icon: Truck, status: "pending" },
                  { title: "Escrow Payment Release", icon: DollarSign, status: "pending" },
                ].map((step, i) => (
                  <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-card text-muted-foreground group-hover:text-primary group-hover:border-primary/30 transition-colors z-10 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      <step.icon className="w-4 h-4" />
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl bg-white/5 border border-white/10">
                      <h4 className="font-bold text-white text-sm">{step.title}</h4>
                      <p className="text-xs text-muted-foreground">Automated trigger awaiting contract signature.</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "Specifications" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="font-bold text-white mb-4">Variety</h3>
              <p className="text-lg text-primary">{commodity.specifications.variety}</p>
            </div>
            <div className="glass-panel p-6 rounded-2xl md:col-span-2">
              <h3 className="font-bold text-white mb-4">Certifications Required</h3>
              <div className="flex flex-wrap gap-2">
                {commodity.specifications.certifications.map(c => <span key={c} className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-sm font-medium text-blue-400 flex items-center gap-1.5"><ShieldCheck className="w-4 h-4"/>{c}</span>)}
              </div>
            </div>
            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="font-bold text-white mb-4">Quality Standards</h3>
              <ul className="space-y-2">
                {commodity.specifications.qualityStandards.map(s => <li key={s} className="text-sm text-white/80 flex gap-2"><span className="text-primary">•</span>{s}</li>)}
              </ul>
            </div>
            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="font-bold text-white mb-4">Packaging</h3>
              <ul className="space-y-2">
                {commodity.specifications.packaging.map(s => <li key={s} className="text-sm text-white/80 flex gap-2"><span className="text-primary">•</span>{s}</li>)}
              </ul>
            </div>
            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="font-bold text-white mb-4">Export Requirements</h3>
              <ul className="space-y-2">
                {commodity.specifications.exportRequirements.map(s => <li key={s} className="text-sm text-white/80 flex gap-2"><span className="text-primary">•</span>{s}</li>)}
              </ul>
            </div>
          </div>
        )}

        {activeTab === "Logistics" && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-panel p-6 rounded-2xl text-center">
                <div className="text-sm text-muted-foreground mb-2">Annual Volume</div>
                <div className="text-3xl font-mono font-bold text-white">{commodity.logistics.tonsPerYear.toLocaleString()} T</div>
              </div>
              <div className="glass-panel p-6 rounded-2xl text-center">
                <div className="text-sm text-muted-foreground mb-2">Avg Delivery</div>
                <div className="text-3xl font-mono font-bold text-white">{commodity.logistics.avgDeliveryDays} Days</div>
              </div>
              <div className="glass-panel p-6 rounded-2xl text-center">
                <div className="text-sm text-muted-foreground mb-2">Cost Per Ton</div>
                <div className="text-3xl font-mono font-bold text-white">${commodity.logistics.costPerTon}</div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-panel p-6 rounded-3xl">
                <h3 className="font-bold text-white mb-6">Regional Demand</h3>
                <div className="space-y-4">
                  {Object.entries(commodity.logistics.demandByRegion).map(([region, demand]) => (
                    <div key={region}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white/80">{region}</span>
                        <span className="font-mono text-white">{demand} T</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${(demand / commodity.logistics.tonsPerYear) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="glass-panel p-6 rounded-3xl">
                <h3 className="font-bold text-white mb-6">Active Export Routes</h3>
                <div className="space-y-3">
                  {commodity.logistics.exportRoutes.map(r => (
                    <div key={r} className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Truck className="w-5 h-5 text-muted-foreground" />
                        <span className="font-medium text-white">{r}</span>
                      </div>
                      <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">Optimized</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "AI Engine" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="glass-panel p-8 rounded-3xl flex flex-col items-center justify-center text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
              <h3 className="text-lg font-bold text-white mb-6 relative z-10">Opportunity Score</h3>
              <div className="relative w-48 h-48 flex items-center justify-center mb-6 z-10">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="10" className="text-white/5" />
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="10" strokeDasharray={`${commodity.aiEngine.opportunityScore * 2.827} 282.7`} className={clsx(
                    commodity.aiEngine.opportunityScore > 80 ? "text-primary" : 
                    commodity.aiEngine.opportunityScore > 60 ? "text-blue-500" : "text-secondary"
                  )} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-5xl font-display font-bold text-white">{commodity.aiEngine.opportunityScore}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground relative z-10">Based on market demand, historical pricing, and current supply gaps.</p>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="glass-panel p-5 rounded-2xl border-white/10">
                  <div className="text-xs text-muted-foreground mb-1">Suggested Acreage</div>
                  <div className="text-2xl font-mono font-bold text-white">{commodity.aiEngine.suggestedAcreage} Ac</div>
                </div>
                <div className="glass-panel p-5 rounded-2xl border-white/10">
                  <div className="text-xs text-muted-foreground mb-1">Yield Projection</div>
                  <div className="text-2xl font-mono font-bold text-white">{commodity.aiEngine.yieldProjectionTons} T</div>
                </div>
                <div className="glass-panel p-5 rounded-2xl border-white/10 border-primary/30 bg-primary/5">
                  <div className="text-xs text-primary mb-1">Revenue Projection</div>
                  <div className="text-2xl font-mono font-bold text-white">${(commodity.aiEngine.revenueProjectionUsd/1000).toFixed(1)}k</div>
                </div>
              </div>

              <div className="glass-panel p-6 rounded-3xl border-white/10">
                <h3 className="font-bold text-white mb-4">Agronomy Suggestions</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Optimal Planting Window</div>
                    <div className="flex gap-2">
                      {commodity.aiEngine.bestPlantingMonths?.map(m => <span key={m} className="px-3 py-1 bg-white/5 rounded-lg text-sm text-white">{m}</span>)}
                    </div>
                  </div>
                  {commodity.aiEngine.cropRotationSuggestions && (
                    <div>
                      <div className="text-sm text-muted-foreground mb-2">Crop Rotation Sequence</div>
                      <div className="flex gap-2 items-center flex-wrap">
                        {commodity.aiEngine.cropRotationSuggestions.map((c, i) => (
                          <span key={c} className="flex items-center gap-2">
                            <span className="px-3 py-1 border border-white/10 rounded-lg text-sm text-white/80">{c}</span>
                            {i < commodity.aiEngine.cropRotationSuggestions!.length - 1 && <ArrowRight className="w-3 h-3 text-muted-foreground" />}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Alerts" && (
          <div className="glass-panel p-8 rounded-3xl border-white/10 animate-in fade-in zoom-in-95 duration-300">
            <h2 className="text-2xl font-bold text-white mb-6">Market Anomalies & Alerts</h2>
            {commodity.alerts.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">No active alerts for this commodity.</div>
            ) : (
              <div className="space-y-4">
                {commodity.alerts.map(alert => (
                  <div key={alert.id} className={clsx(
                    "p-5 rounded-2xl border flex items-start gap-4",
                    alert.severity === 'critical' ? "bg-destructive/10 border-destructive/30" :
                    alert.severity === 'high' ? "bg-secondary/10 border-secondary/30" :
                    alert.severity === 'medium' ? "bg-blue-500/10 border-blue-500/30" : "bg-white/5 border-white/10"
                  )}>
                    <div className={clsx(
                      "p-3 rounded-xl",
                      alert.severity === 'critical' ? "bg-destructive/20 text-destructive" :
                      alert.severity === 'high' ? "bg-secondary/20 text-secondary" :
                      alert.severity === 'medium' ? "bg-blue-500/20 text-blue-400" : "bg-white/10 text-white/60"
                    )}>
                      {alert.type === 'price_spike' ? <TrendingUp className="w-5 h-5"/> : 
                       alert.type === 'supply_gap' ? <AlertTriangle className="w-5 h-5"/> : 
                       alert.type === 'high_demand' ? <Zap className="w-5 h-5"/> : <Calendar className="w-5 h-5"/>}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-bold text-white uppercase text-sm">{alert.type.replace('_', ' ')}</h4>
                        <span className="text-xs text-muted-foreground font-mono">{new Date(alert.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-white/80">{alert.message}</p>
                      <div className="text-xs font-medium mt-2 text-muted-foreground">Region: {alert.region}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
