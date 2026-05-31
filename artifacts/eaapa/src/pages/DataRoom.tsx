import { useParams, Link } from "wouter";
import { useGetCommodity } from "@workspace/api-client-react";
import { LoadingScreen } from "@/components/ui/Loading";
import { ArrowLeft, TrendingUp, Zap, Target, Box, CheckCircle2, ShieldAlert, ArrowRight, ShieldCheck, Truck, AlertTriangle, Calendar, DollarSign, Send, X, Check } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useState } from "react";
import { clsx } from "clsx";

const TABS = ["Market Overview", "Buyer Directory", "Contract System", "Specifications", "Logistics", "AI Engine", "Alerts"];

export default function DataRoom() {
  const params = useParams();
  const id = parseInt(params.id || "0");
  
  const { data: commodity, isLoading, error } = useGetCommodity(id, {
    query: { queryKey: ["getCommodity", id], enabled: id > 0 }
  });

  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [contractVolume, setContractVolume] = useState(10);
  const [contractType, setContractType] = useState("Fixed");
  const [executionMode, setExecutionMode] = useState("Semi-Auto");
  const [contractSuccess, setContractSuccess] = useState(false);
  const [contractLoading, setContractLoading] = useState(false);

  // Buyer Directory filters
  const [buyerTypeFilter, setBuyerTypeFilter] = useState("All");
  const [aiOnlyFilter, setAiOnlyFilter] = useState(false);

  // Buyer action modals
  const [messageModal, setMessageModal] = useState<null | { buyerId: number; buyerName: string }>(null);
  const [negotiateModal, setNegotiateModal] = useState<null | { buyerId: number; buyerName: string }>(null);
  const [messageText, setMessageText] = useState("");
  const [messageSent, setMessageSent] = useState(false);
  const [negotiatePrice, setNegotiatePrice] = useState("");
  const [negotiateSent, setNegotiateSent] = useState(false);

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
      <div className="text-muted-foreground mb-6">The requested commodity data could not be loaded.</div>
      <Link href="/market-hub" className="inline-flex items-center gap-2 text-primary hover:underline"><ArrowLeft className="w-4 h-4" /> Return to Market Hub</Link>
    </div>
  );

  const filteredBuyers = commodity.buyers.filter(b => {
    if (buyerTypeFilter !== "All" && b.type !== buyerTypeFilter) return false;
    if (aiOnlyFilter && !b.isAiRecommended) return false;
    return true;
  });

  const handleGenerateContract = () => {
    setContractLoading(true);
    setContractSuccess(false);
    setTimeout(() => {
      setContractLoading(false);
      setContractSuccess(true);
    }, 1800);
  };

  const handleSendMessage = () => {
    setMessageSent(true);
    setTimeout(() => {
      setMessageModal(null);
      setMessageText("");
      setMessageSent(false);
    }, 1500);
  };

  const handleSendNegotiation = () => {
    setNegotiateSent(true);
    setTimeout(() => {
      setNegotiateModal(null);
      setNegotiatePrice("");
      setNegotiateSent(false);
    }, 1500);
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
      
      {/* Mini Sidebar – desktop only */}
      <div className="w-64 flex-shrink-0 hidden lg:block">
        <Link href="/market-hub" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 text-sm font-medium">
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
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              {tab}
              {tab === "Alerts" && commodity.alerts.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-destructive flex items-center justify-center text-[10px] text-white font-bold">
                  {commodity.alerts.length}
                </span>
              )}
            </button>
          ))}

          <Link
            href={`/market-hub/${id}/ai`}
            className="w-full mt-8 px-4 py-3 rounded-xl bg-secondary/10 border border-secondary/20 text-secondary font-bold hover:bg-secondary/20 transition-all flex items-center justify-between text-sm shadow-[0_0_15px_rgba(217,119,6,0.1)]"
          >
            <span className="flex items-center gap-2"><Zap className="w-4 h-4" /> Advanced Layer</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0">

        {/* Mobile tab navigation */}
        <div className="lg:hidden mb-6">
          <Link href="/market-hub" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4 text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={clsx(
                  "flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap",
                  activeTab === tab
                    ? "bg-primary text-white"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {tab}
                {tab === "Alerts" && commodity.alerts.length > 0 && (
                  <span className="ml-1.5 w-4 h-4 rounded-full bg-destructive inline-flex items-center justify-center text-[10px] text-white font-bold">
                    {commodity.alerts.length}
                  </span>
                )}
              </button>
            ))}
          </div>
          <Link
            href={`/market-hub/${id}/ai`}
            className="mt-3 w-full px-4 py-2.5 rounded-xl bg-secondary/10 border border-secondary/20 text-secondary font-bold hover:bg-secondary/20 transition-all flex items-center justify-between text-sm"
          >
            <span className="flex items-center gap-2"><Zap className="w-4 h-4" /> Advanced AI Layer</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Page Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground">{commodity.name}</h1>
            <span className="px-3 py-1 rounded-lg bg-muted border border-white/20 text-white text-xs font-bold uppercase">{commodity.category}</span>
            <div className={clsx(
              "w-2.5 h-2.5 rounded-full",
              commodity.alerts.filter(a => a.severity === 'critical').length === 0
                ? "bg-primary shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                : commodity.alerts.filter(a => a.severity === 'high').length > 0
                ? "bg-secondary shadow-[0_0_8px_rgba(217,119,6,0.8)]"
                : "bg-destructive shadow-[0_0_8px_rgba(239,68,68,0.8)]"
            )} />
          </div>
          <p className="text-muted-foreground text-lg">{activeTab}</p>
        </div>

        {/* ── Market Overview ── */}
        {activeTab === "Market Overview" && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="glass-panel p-5 rounded-2xl">
                <div className="text-xs text-muted-foreground font-bold uppercase mb-1">Global Price</div>
                <div className="text-2xl font-mono font-bold text-foreground">${commodity.overview.globalPrice.toLocaleString()}</div>
              </div>
              <div className="glass-panel p-5 rounded-2xl">
                <div className="text-xs text-muted-foreground font-bold uppercase mb-1">Regional Price</div>
                <div className="text-2xl font-mono font-bold text-foreground">${commodity.overview.regionalPrice.toLocaleString()}</div>
              </div>
              <div className="glass-panel p-5 rounded-2xl">
                <div className="text-xs text-muted-foreground font-bold uppercase mb-1">Market Size</div>
                <div className="text-2xl font-mono font-bold text-foreground">${(commodity.overview.marketSizeUsd / 1_000_000).toFixed(1)}M</div>
              </div>
              <div className="glass-panel p-5 rounded-2xl">
                <div className="text-xs text-muted-foreground font-bold uppercase mb-1">Demand Growth</div>
                <div className="text-2xl font-bold text-primary">+{commodity.overview.demandGrowthPercent}%</div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-3xl border-border">
              <h2 className="text-xl font-bold text-foreground mb-6">Price History & Forecast</h2>
              {commodity.historicalPrices.length === 0 ? (
                <div className="h-40 flex items-center justify-center text-muted-foreground text-sm">No historical price data available.</div>
              ) : (
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={commodity.historicalPrices}>
                      <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'white' }} itemStyle={{ color: 'hsl(var(--primary))' }} />
                      <Area type="monotone" dataKey="price" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-panel p-6 rounded-2xl">
                <h3 className="font-bold text-foreground mb-4">Top Export Destinations</h3>
                {commodity.overview.exportRegions.length === 0
                  ? <p className="text-sm text-muted-foreground">No export destinations on record.</p>
                  : <div className="flex flex-wrap gap-2">
                    {commodity.overview.exportRegions.map((r, i) => (
                      <span key={i} className="px-3 py-1.5 rounded-lg bg-muted/50 border border-border text-sm text-foreground/70">{r}</span>
                    ))}
                  </div>
                }
              </div>
              <div className="glass-panel p-6 rounded-2xl">
                <h3 className="font-bold text-foreground mb-4">Primary Import Hubs</h3>
                {commodity.overview.importRegions.length === 0
                  ? <p className="text-sm text-muted-foreground">No import hubs on record.</p>
                  : <div className="flex flex-wrap gap-2">
                    {commodity.overview.importRegions.map((r, i) => (
                      <span key={i} className="px-3 py-1.5 rounded-lg bg-muted/50 border border-border text-sm text-foreground/70">{r}</span>
                    ))}
                  </div>
                }
              </div>
            </div>
          </div>
        )}

        {/* ── Buyer Directory ── */}
        {activeTab === "Buyer Directory" && (
          <div className="glass-panel rounded-3xl p-6 border-border animate-in fade-in zoom-in-95 duration-300">
            <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
              <div className="flex flex-wrap gap-3">
                <select
                  value={buyerTypeFilter}
                  onChange={e => setBuyerTypeFilter(e.target.value)}
                  className="bg-background border border-border rounded-xl px-4 py-2 text-sm text-foreground outline-none focus:border-primary"
                >
                  <option value="All">All Types</option>
                  <option value="Retail">Retail</option>
                  <option value="Exporter">Exporter</option>
                  <option value="Processor">Processor</option>
                  <option value="Distributor">Distributor</option>
                  <option value="Hotel">Hotel</option>
                </select>
                <button
                  onClick={() => setAiOnlyFilter(v => !v)}
                  className={clsx(
                    "px-4 py-2 rounded-xl border text-sm font-bold flex items-center gap-2 transition-all",
                    aiOnlyFilter
                      ? "bg-secondary/20 border-secondary text-secondary"
                      : "bg-muted/50 border-border text-muted-foreground hover:bg-muted"
                  )}
                >
                  <Zap className="w-4 h-4" /> AI Recommended Only
                </button>
              </div>
              <div className="text-sm text-muted-foreground">
                {filteredBuyers.length} of {commodity.buyers.length} buyers
              </div>
            </div>

            {filteredBuyers.length === 0 ? (
              <div className="py-16 text-center text-muted-foreground">
                <Target className="w-8 h-8 opacity-30 mx-auto mb-3" />
                <div className="font-medium">No buyers match your filters</div>
                <button
                  onClick={() => { setBuyerTypeFilter("All"); setAiOnlyFilter(false); }}
                  className="mt-3 text-primary text-sm hover:underline"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border text-sm text-muted-foreground uppercase tracking-wider">
                      <th className="pb-4">Buyer Name</th>
                      <th className="pb-4">Location</th>
                      <th className="pb-4">Monthly Demand</th>
                      <th className="pb-4">Sustainability</th>
                      <th className="pb-4">AI Match</th>
                      <th className="pb-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredBuyers.map((buyer) => (
                      <tr key={buyer.id} className="hover:bg-muted">
                        <td className="py-4">
                          <div className="font-bold text-foreground flex items-center gap-2">
                            {buyer.name}
                            {buyer.isAiRecommended && (
                              <span className="text-[10px] bg-secondary/20 text-secondary px-1.5 py-0.5 rounded font-bold">AI MATCH</span>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">{buyer.type} · {buyer.tradeReadiness}</div>
                        </td>
                        <td className="py-4 text-foreground/70">{buyer.location}</td>
                        <td className="py-4 font-mono text-white">{buyer.monthlyDemandTons}T</td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-primary" style={{ width: `${buyer.sustainabilityScore}%` }} />
                            </div>
                            <span className="text-xs text-muted-foreground">{buyer.sustainabilityScore}</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className={clsx(
                            "font-bold",
                            buyer.aiMatchScore > 85 ? "text-primary" :
                            buyer.aiMatchScore > 70 ? "text-blue-400" : "text-secondary"
                          )}>
                            {buyer.aiMatchScore}%
                          </span>
                        </td>
                        <td className="py-4 text-right space-x-2">
                          <button
                            onClick={() => { setMessageModal({ buyerId: buyer.id, buyerName: buyer.name }); setMessageText(""); setMessageSent(false); }}
                            className="px-3 py-1.5 rounded-lg bg-muted/50 hover:bg-muted text-sm font-medium text-white transition-all"
                          >
                            Message
                          </button>
                          <button
                            onClick={() => { setNegotiateModal({ buyerId: buyer.id, buyerName: buyer.name }); setNegotiatePrice(""); setNegotiateSent(false); }}
                            className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-sm font-medium text-white transition-all shadow-lg shadow-primary/20"
                          >
                            Negotiate
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── Contract System ── */}
        {activeTab === "Contract System" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="glass-panel p-8 rounded-3xl">
              <h3 className="text-2xl font-bold text-foreground mb-6">Contract Engine</h3>
              <div className="space-y-5">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Commodity</label>
                  <input disabled value={commodity.name} className="w-full bg-background/50 border border-border rounded-xl p-3 text-muted-foreground cursor-not-allowed" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Select Buyer</label>
                  <select className="w-full bg-background border border-border rounded-xl p-3 text-white outline-none focus:border-primary">
                    {commodity.buyers.length === 0
                      ? <option>No buyers available</option>
                      : commodity.buyers.map(b => <option key={b.id}>{b.name} ({b.location})</option>)
                    }
                  </select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Volume (Tons)</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      min={1}
                      max={10000}
                      value={contractVolume}
                      onChange={e => setContractVolume(Math.max(1, Number(e.target.value)))}
                      className="w-full bg-background border border-border rounded-xl p-3 text-white font-mono focus:border-primary outline-none"
                    />
                    <div className="text-lg font-mono text-white whitespace-nowrap">
                      = ${(contractVolume * commodity.overview.globalPrice).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Contract Type</label>
                  <div className="flex gap-3">
                    {['Fixed', 'Flexible', 'Dynamic'].map(t => (
                      <button
                        key={t}
                        onClick={() => setContractType(t)}
                        className={clsx(
                          "flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all",
                          contractType === t ? "bg-primary/20 border-primary text-primary" : "bg-muted/50 border-border text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Execution Mode</label>
                  <div className="flex gap-3">
                    {['Manual', 'Semi-Auto', 'Auto'].map(t => (
                      <button
                        key={t}
                        onClick={() => setExecutionMode(t)}
                        className={clsx(
                          "flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all",
                          executionMode === t ? "bg-white/20 border-white text-white" : "bg-muted/50 border-border text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {contractSuccess ? (
                  <div className="w-full py-4 mt-4 rounded-xl bg-primary/20 border border-primary text-primary font-bold text-center flex items-center justify-center gap-2">
                    <Check className="w-5 h-5" /> Contract Generated Successfully
                  </div>
                ) : (
                  <button
                    onClick={handleGenerateContract}
                    disabled={contractLoading || commodity.buyers.length === 0}
                    className="w-full py-4 mt-4 rounded-xl bg-primary text-white font-bold text-lg shadow-lg shadow-primary/20 hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                  >
                    {contractLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Generating...
                      </>
                    ) : "Generate Smart Contract"}
                  </button>
                )}
              </div>
            </div>

            <div className="glass-panel p-8 rounded-3xl bg-gradient-to-br from-card to-background border-border">
              <h3 className="text-xl font-bold text-foreground mb-8">Execution Pipeline</h3>
              <div className="space-y-6">
                {[
                  { title: "Harvest & Grading", icon: CheckCircle2, description: "Quality inspection and grade classification at source." },
                  { title: "Packaging & QA", icon: Box, description: "Packaging in compliance with buyer specifications." },
                  { title: "Shipment Logistics", icon: Truck, description: "Route optimization and carrier assignment." },
                  { title: "Escrow Payment Release", icon: DollarSign, description: "Funds released upon confirmed delivery." },
                ].map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={clsx(
                        "w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors",
                        contractSuccess ? "border-primary text-primary bg-primary/10" : "border-white/20 text-muted-foreground"
                      )}>
                        <step.icon className="w-4 h-4" />
                      </div>
                      {i < 3 && <div className={clsx("w-0.5 h-6 mt-1 rounded", contractSuccess ? "bg-primary/40" : "bg-white/10")} />}
                    </div>
                    <div className="pb-2">
                      <h4 className="font-bold text-foreground text-sm">{step.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              {contractSuccess && (
                <div className="mt-6 p-4 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm font-medium flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                  Pipeline activated — contract ID #{Math.floor(Math.random() * 90000 + 10000)} is live.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Specifications ── */}
        {activeTab === "Specifications" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="font-bold text-foreground mb-4">Variety</h3>
              <p className="text-lg text-primary">{commodity.specifications.variety}</p>
            </div>
            <div className="glass-panel p-6 rounded-2xl md:col-span-2">
              <h3 className="font-bold text-foreground mb-4">Certifications Required</h3>
              {commodity.specifications.certifications.length === 0
                ? <p className="text-sm text-muted-foreground">No certifications listed.</p>
                : <div className="flex flex-wrap gap-2">
                  {commodity.specifications.certifications.map(c => (
                    <span key={c} className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-sm font-medium text-blue-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" />{c}
                    </span>
                  ))}
                </div>
              }
            </div>
            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="font-bold text-foreground mb-4">Quality Standards</h3>
              {commodity.specifications.qualityStandards.length === 0
                ? <p className="text-sm text-muted-foreground">No quality standards listed.</p>
                : <ul className="space-y-2">
                  {commodity.specifications.qualityStandards.map(s => (
                    <li key={s} className="text-sm text-foreground/70 flex gap-2"><span className="text-primary">•</span>{s}</li>
                  ))}
                </ul>
              }
            </div>
            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="font-bold text-foreground mb-4">Packaging</h3>
              {commodity.specifications.packaging.length === 0
                ? <p className="text-sm text-muted-foreground">No packaging info listed.</p>
                : <ul className="space-y-2">
                  {commodity.specifications.packaging.map(s => (
                    <li key={s} className="text-sm text-foreground/70 flex gap-2"><span className="text-primary">•</span>{s}</li>
                  ))}
                </ul>
              }
            </div>
            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="font-bold text-foreground mb-4">Export Requirements</h3>
              {commodity.specifications.exportRequirements.length === 0
                ? <p className="text-sm text-muted-foreground">No export requirements listed.</p>
                : <ul className="space-y-2">
                  {commodity.specifications.exportRequirements.map(s => (
                    <li key={s} className="text-sm text-foreground/70 flex gap-2"><span className="text-primary">•</span>{s}</li>
                  ))}
                </ul>
              }
            </div>
          </div>
        )}

        {/* ── Logistics ── */}
        {activeTab === "Logistics" && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-panel p-6 rounded-2xl text-center">
                <div className="text-sm text-muted-foreground mb-2">Annual Volume</div>
                <div className="text-3xl font-mono font-bold text-foreground">{commodity.logistics.tonsPerYear.toLocaleString()} T</div>
              </div>
              <div className="glass-panel p-6 rounded-2xl text-center">
                <div className="text-sm text-muted-foreground mb-2">Avg Delivery</div>
                <div className="text-3xl font-mono font-bold text-foreground">{commodity.logistics.avgDeliveryDays} Days</div>
              </div>
              <div className="glass-panel p-6 rounded-2xl text-center">
                <div className="text-sm text-muted-foreground mb-2">Cost Per Ton</div>
                <div className="text-3xl font-mono font-bold text-foreground">${commodity.logistics.costPerTon}</div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-panel p-6 rounded-3xl">
                <h3 className="font-bold text-foreground mb-6">Regional Demand</h3>
                <div className="space-y-4">
                  {Object.entries(commodity.logistics.demandByRegion).map(([region, demand]) => {
                    const demandNum = demand as number;
                    const max = Math.max(...Object.values(commodity.logistics.demandByRegion) as number[]);
                    return (
                      <div key={region}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-foreground/70">{region}</span>
                          <span className="font-mono text-white">{demandNum.toLocaleString()} T</span>
                        </div>
                        <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                          <div className="h-full bg-primary transition-all" style={{ width: `${(demandNum / max) * 100}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="glass-panel p-6 rounded-3xl">
                <h3 className="font-bold text-foreground mb-6">Active Export Routes</h3>
                {commodity.logistics.exportRoutes.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No export routes configured.</p>
                ) : (
                  <div className="space-y-3">
                    {commodity.logistics.exportRoutes.map(r => (
                      <div key={r} className="p-4 rounded-xl bg-muted/50 border border-border flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Truck className="w-5 h-5 text-muted-foreground" />
                          <span className="font-medium text-white">{r}</span>
                        </div>
                        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">Optimized</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── AI Engine ── */}
        {activeTab === "AI Engine" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="glass-panel p-8 rounded-3xl flex flex-col items-center justify-center text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
              <h3 className="text-lg font-bold text-foreground mb-6 relative z-10">Opportunity Score</h3>
              <div className="relative w-48 h-48 flex items-center justify-center mb-6 z-10">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="10" className="text-white/5" />
                  <circle
                    cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="10"
                    strokeDasharray={`${commodity.aiEngine.opportunityScore * 2.827} 282.7`}
                    className={clsx(
                      commodity.aiEngine.opportunityScore > 80 ? "text-primary" :
                      commodity.aiEngine.opportunityScore > 60 ? "text-blue-500" : "text-secondary"
                    )}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-5xl font-display font-bold text-foreground">{commodity.aiEngine.opportunityScore}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground relative z-10">Based on market demand, historical pricing, and current supply gaps.</p>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="glass-panel p-5 rounded-2xl border-border">
                  <div className="text-xs text-muted-foreground mb-1">Suggested Acreage</div>
                  <div className="text-2xl font-mono font-bold text-foreground">{commodity.aiEngine.suggestedAcreage} Ac</div>
                </div>
                <div className="glass-panel p-5 rounded-2xl border-border">
                  <div className="text-xs text-muted-foreground mb-1">Yield Projection</div>
                  <div className="text-2xl font-mono font-bold text-foreground">{commodity.aiEngine.yieldProjectionTons} T</div>
                </div>
                <div className="glass-panel p-5 rounded-2xl border-border border-primary/30 bg-primary/5">
                  <div className="text-xs text-primary mb-1">Revenue Projection</div>
                  <div className="text-2xl font-mono font-bold text-foreground">${(commodity.aiEngine.revenueProjectionUsd / 1000).toFixed(1)}k</div>
                </div>
              </div>

              <div className="glass-panel p-6 rounded-2xl border-border">
                <h3 className="font-bold text-foreground mb-4">Top Target Buyers</h3>
                {(commodity.aiEngine.targetBuyers?.length ?? 0) === 0
                  ? <p className="text-sm text-muted-foreground">No buyer recommendations yet.</p>
                  : <div className="flex flex-wrap gap-2">
                    {commodity.aiEngine.targetBuyers!.map((b, i) => (
                      <span key={i} className="px-3 py-1.5 rounded-lg bg-secondary/10 border border-secondary/20 text-secondary text-sm font-medium flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5" />{b}
                      </span>
                    ))}
                  </div>
                }
              </div>

              <div className="glass-panel p-6 rounded-3xl border-border">
                <h3 className="font-bold text-foreground mb-4">Agronomy Suggestions</h3>
                <div className="space-y-4">
                  {commodity.aiEngine.bestPlantingMonths && commodity.aiEngine.bestPlantingMonths.length > 0 && (
                    <div>
                      <div className="text-sm text-muted-foreground mb-2">Optimal Planting Window</div>
                      <div className="flex gap-2 flex-wrap">
                        {commodity.aiEngine.bestPlantingMonths.map(m => (
                          <span key={m} className="px-3 py-1 bg-muted/50 rounded-lg text-sm text-foreground flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-primary" />{m}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {commodity.aiEngine.cropRotationSuggestions && commodity.aiEngine.cropRotationSuggestions.length > 0 && (
                    <div>
                      <div className="text-sm text-muted-foreground mb-2">Crop Rotation Sequence</div>
                      <div className="flex gap-2 items-center flex-wrap">
                        {commodity.aiEngine.cropRotationSuggestions.map((c, i) => (
                          <span key={c} className="flex items-center gap-2">
                            <span className="px-3 py-1 border border-border rounded-lg text-sm text-foreground/70">{c}</span>
                            {i < commodity.aiEngine.cropRotationSuggestions!.length - 1 && (
                              <ArrowRight className="w-3 h-3 text-muted-foreground" />
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {(!commodity.aiEngine.bestPlantingMonths?.length && !commodity.aiEngine.cropRotationSuggestions?.length) && (
                    <p className="text-sm text-muted-foreground">No agronomy data available.</p>
                  )}
                </div>
              </div>

              <Link
                href={`/market-hub/${id}/ai`}
                className="w-full px-6 py-4 rounded-2xl bg-secondary/10 border border-secondary/20 text-secondary font-bold hover:bg-secondary/20 transition-all flex items-center justify-between text-sm shadow-[0_0_15px_rgba(217,119,6,0.1)]"
              >
                <span className="flex items-center gap-2"><Zap className="w-5 h-5" /> Open Advanced AI Layer</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        )}

        {/* ── Alerts ── */}
        {activeTab === "Alerts" && (
          <div className="glass-panel p-8 rounded-3xl border-border animate-in fade-in zoom-in-95 duration-300">
            <h2 className="text-2xl font-bold text-foreground mb-6">Market Anomalies & Alerts</h2>
            {commodity.alerts.length === 0 ? (
              <div className="text-center py-16">
                <ShieldAlert className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                <div className="text-white font-medium mb-2">No active alerts</div>
                <div className="text-muted-foreground text-sm">This commodity is operating within normal parameters.</div>
              </div>
            ) : (
              <div className="space-y-4">
                {commodity.alerts.map(alert => (
                  <div
                    key={alert.id}
                    className={clsx(
                      "p-5 rounded-2xl border flex items-start gap-4",
                      alert.severity === 'critical' ? "bg-destructive/10 border-destructive/30" :
                      alert.severity === 'high' ? "bg-secondary/10 border-secondary/30" :
                      alert.severity === 'medium' ? "bg-blue-500/10 border-blue-500/30" :
                      "bg-muted/50 border-border"
                    )}
                  >
                    <div className={clsx(
                      "p-3 rounded-xl flex-shrink-0",
                      alert.severity === 'critical' ? "bg-destructive/20 text-destructive" :
                      alert.severity === 'high' ? "bg-secondary/20 text-secondary" :
                      alert.severity === 'medium' ? "bg-blue-500/20 text-blue-400" :
                      "bg-muted text-muted-foreground"
                    )}>
                      {alert.type === 'price_spike' ? <TrendingUp className="w-5 h-5" /> :
                       alert.type === 'supply_gap' ? <AlertTriangle className="w-5 h-5" /> :
                       alert.type === 'high_demand' ? <Zap className="w-5 h-5" /> :
                       <Calendar className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <h4 className="font-bold text-foreground uppercase text-sm">{alert.type.replace(/_/g, ' ')}</h4>
                        <span className="text-xs text-muted-foreground font-mono">{new Date(alert.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-foreground/70">{alert.message}</p>
                      <div className="text-xs font-medium mt-2 text-muted-foreground">Region: {alert.region}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Message Modal ── */}
      {messageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setMessageModal(null)}>
          <div className="bg-card border border-border rounded-3xl p-8 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-foreground">Message Buyer</h3>
                <p className="text-sm text-muted-foreground mt-1">{messageModal.buyerName}</p>
              </div>
              <button onClick={() => setMessageModal(null)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            {messageSent ? (
              <div className="py-8 text-center">
                <Check className="w-12 h-12 text-primary mx-auto mb-3" />
                <div className="text-white font-bold">Message Sent</div>
                <div className="text-sm text-muted-foreground mt-1">Your message has been delivered.</div>
              </div>
            ) : (
              <>
                <textarea
                  value={messageText}
                  onChange={e => setMessageText(e.target.value)}
                  placeholder="Write your message to this buyer..."
                  rows={4}
                  className="w-full bg-background border border-border rounded-xl p-4 text-white text-sm resize-none outline-none focus:border-primary mb-4"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                  className="w-full py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Send Message
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Negotiate Modal ── */}
      {negotiateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setNegotiateModal(null)}>
          <div className="bg-card border border-border rounded-3xl p-8 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-foreground">Negotiate Terms</h3>
                <p className="text-sm text-muted-foreground mt-1">{negotiateModal.buyerName}</p>
              </div>
              <button onClick={() => setNegotiateModal(null)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            {negotiateSent ? (
              <div className="py-8 text-center">
                <Check className="w-12 h-12 text-primary mx-auto mb-3" />
                <div className="text-white font-bold">Proposal Submitted</div>
                <div className="text-sm text-muted-foreground mt-1">The buyer will respond within 48 hours.</div>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="text-sm text-muted-foreground block mb-1">Commodity</label>
                    <input disabled value={commodity.name} className="w-full bg-background/50 border border-border rounded-xl p-3 text-muted-foreground text-sm cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground block mb-1">Market Price (USD/ton)</label>
                    <input disabled value={`$${commodity.overview.globalPrice.toLocaleString()}`} className="w-full bg-background/50 border border-border rounded-xl p-3 text-muted-foreground text-sm cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground block mb-1">Your Proposed Price (USD/ton)</label>
                    <input
                      type="number"
                      value={negotiatePrice}
                      onChange={e => setNegotiatePrice(e.target.value)}
                      placeholder={`${commodity.overview.globalPrice}`}
                      className="w-full bg-background border border-border rounded-xl p-3 text-white text-sm outline-none focus:border-primary"
                    />
                  </div>
                </div>
                <button
                  onClick={handleSendNegotiation}
                  disabled={!negotiatePrice}
                  className="w-full py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Submit Proposal
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
