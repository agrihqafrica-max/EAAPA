import { useState } from "react";
import { useMarketAuth } from "@/store/use-auth";
import { useVerifyMarketPin, useListCommodities, useListMarketAlerts } from "@workspace/api-client-react";
import { Shield, Lock, ChevronRight, Activity, Globe, DollarSign, LogOut, ArrowUpRight, ArrowDownRight, Minus, Bell, AlertTriangle, TrendingUp, Search, Filter, ExternalLink } from "lucide-react";
import { Link, useLocation } from "wouter";
import { LoadingScreen } from "@/components/ui/Loading";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { clsx } from "clsx";

function PinEntry() {
  const [pin, setPin] = useState("");
  const { verify } = useMarketAuth();
  const { mutate: verifyPin, isPending } = useVerifyMarketPin();
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    verifyPin({ data: { pin } }, {
      onSuccess: (res) => {
        if (res.success && res.accessToken) {
          verify(res.accessToken);
        } else {
          setError(res.message || "Invalid PIN");
        }
      },
      onError: () => setError("Verification failed. Please try again.")
    });
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      </div>
      <div className="glass-panel p-10 md:p-14 rounded-[2.5rem] w-full max-w-md relative z-10 border-primary/20 shadow-[0_0_50px_rgba(16,185,129,0.1)]">
        <div className="w-20 h-20 rounded-3xl bg-secondary/10 flex items-center justify-center mx-auto mb-8 border border-secondary/20">
          <Shield className="w-10 h-10 text-secondary" />
        </div>
        <h2 className="text-3xl font-display font-bold text-center text-white mb-3">Restricted Access</h2>
        <p className="text-center text-muted-foreground mb-10 text-sm">Enter executive PIN to access Market Hub Intelligence.</p>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground/50" />
              <input
                type="password"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                className="w-full bg-background/50 border-2 border-white/10 rounded-2xl py-5 pl-14 pr-4 text-center text-3xl tracking-[0.5em] text-white focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all outline-none"
                placeholder="••••"
                autoComplete="off"
              />
            </div>
            {error && <p className="text-destructive text-sm mt-3 text-center font-medium">{error}</p>}
            <p className="text-muted-foreground/50 text-xs text-center mt-3">Demo PIN: 1234</p>
          </div>
          
          <button 
            type="submit" 
            disabled={isPending || pin.length < 4}
            className="w-full py-5 rounded-2xl bg-gradient-to-r from-primary to-emerald-600 text-white font-bold text-lg hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] disabled:opacity-50 transition-all"
          >
            {isPending ? "Verifying..." : "Access Data Room"}
          </button>
        </form>
      </div>
    </div>
  );
}

const CONVERSION_RATES: Record<string, number> = {
  USD: 1,
  KES: 130.5,
  UGX: 3850.5,
  TZS: 2550.2,
  RWF: 1250.8,
  ETB: 56.4,
  EUR: 0.92
};

type SidebarView = "scan" | "alerts";

export default function MarketHub() {
  const { isVerified, logout } = useMarketAuth();
  const [, navigate] = useLocation();
  const [currency, setCurrency] = useState("USD");
  const [exitOpen, setExitOpen] = useState(false);
  const [sidebarView, setSidebarView] = useState<SidebarView>("scan");

  // Filters
  const [category, setCategory] = useState("All");
  const [region, setRegion] = useState("All");
  const [exportOnly, setExportOnly] = useState(false);
  const [organicOnly, setOrganicOnly] = useState(false);
  const [search, setSearch] = useState("");
  
  const { data: commodities, isLoading } = useListCommodities();
  const { data: alerts } = useListMarketAlerts();

  if (!isVerified) return <PinEntry />;
  if (isLoading) return <LoadingScreen />;

  const filteredData = commodities?.filter(c => {
    if (category !== "All" && c.category !== category) return false;
    if (region !== "All" && c.region !== region) return false;
    if (exportOnly && !c.isExport) return false;
    if (organicOnly && !c.isOrganic) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.category.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }) ?? [];

  const alertCount = alerts?.length ?? 0;
  const criticalCount = alerts?.filter(a => a.severity === "critical").length ?? 0;

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden bg-background">
      {/* Sidebar */}
      <div className="w-72 border-r border-white/5 bg-card/30 flex flex-col z-20 relative flex-shrink-0">
        <div className="p-6 pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-secondary" />
            <div>
              <div className="font-display font-bold text-white leading-tight">MARKET HUB</div>
              <div className="text-[10px] font-mono text-primary tracking-widest uppercase">Secured Session</div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-1 no-scrollbar">
          <div className="text-xs font-bold text-muted-foreground mb-3 px-3 mt-4">INTELLIGENCE LAYERS</div>
          
          <button
            onClick={() => setSidebarView("scan")}
            className={clsx(
              "w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold border transition-all",
              sidebarView === "scan"
                ? "bg-primary/10 text-primary border-primary/20"
                : "text-white/70 hover:bg-white/5 hover:text-white border-transparent"
            )}
          >
            <span className="flex items-center gap-3"><Activity className="w-4 h-4" /> Market Scan</span>
            {sidebarView === "scan" && <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
          </button>

          <button
            onClick={() => setSidebarView("alerts")}
            className={clsx(
              "w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium border transition-all",
              sidebarView === "alerts"
                ? "bg-primary/10 text-primary border-primary/20 font-bold"
                : "text-white/70 hover:bg-white/5 hover:text-white border-transparent"
            )}
          >
            <span className="flex items-center gap-3"><Bell className="w-4 h-4" /> Market Alerts</span>
            {alertCount > 0 && (
              <span className={clsx(
                "px-2 py-0.5 rounded text-[10px] font-bold text-white",
                criticalCount > 0 ? "bg-destructive" : "bg-secondary"
              )}>{alertCount}</span>
            )}
          </button>

          <button
            onClick={() => setSidebarView("scan")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/5 hover:text-white font-medium transition-colors border border-transparent"
          >
            <Globe className="w-4 h-4" /> Category Data Rooms
          </button>

          <div className="text-xs font-bold text-muted-foreground mb-3 px-3 mt-8">OPERATIONS</div>

          <button
            onClick={() => navigate("/buyer-network")}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-white/70 hover:bg-white/5 hover:text-white font-medium transition-colors border border-transparent group"
          >
            <span className="flex items-center gap-3"><DollarSign className="w-4 h-4" /> Buyer Network</span>
            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          <button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/40 font-medium border border-transparent cursor-not-allowed"
            disabled
            title="Coming soon"
          >
            <TrendingUp className="w-4 h-4" /> Contract Engine
            <span className="ml-auto text-[9px] font-bold bg-white/10 px-2 py-0.5 rounded text-white/40">SOON</span>
          </button>
        </div>

        <div className="p-4 border-t border-white/5">
          <button onClick={() => setExitOpen(true)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive font-medium transition-colors">
            <LogOut className="w-4 h-4" /> Exit Hub
          </button>
        </div>
      </div>

      {/* Main Panel */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="p-6 md:p-8 flex-1 overflow-y-auto relative z-10 no-scrollbar">

          {sidebarView === "scan" && (
            <>
              <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 gap-6">
                <div>
                  <h1 className="text-4xl font-display font-bold text-white tracking-tight">Market Scan Dashboard</h1>
                  <p className="text-muted-foreground mt-2 text-lg">Real-time commodity data aggregated from 47 regional nodes.</p>
                </div>
                <div className="flex items-center gap-4 bg-card border border-white/10 p-2 rounded-2xl">
                  <span className="text-sm font-bold text-white/50 pl-3">CURRENCY</span>
                  <select 
                    value={currency} 
                    onChange={(e) => setCurrency(e.target.value)}
                    className="bg-background border border-white/10 rounded-xl px-4 py-2 font-mono font-bold text-white outline-none focus:border-primary"
                  >
                    {Object.keys(CONVERSION_RATES).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-3 mb-6 bg-card border border-white/10 p-4 rounded-2xl items-center">
                <div className="relative flex-1 min-w-[180px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search commodities..."
                    className="w-full bg-background border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white outline-none focus:border-primary"
                  />
                </div>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="bg-background border border-white/10 rounded-lg px-4 py-2 text-sm text-white outline-none focus:border-primary"
                >
                  <option value="All">All Categories</option>
                  <option value="Horticulture">Horticulture</option>
                  <option value="Beverages">Beverages</option>
                  <option value="Cereals">Cereals</option>
                  <option value="Dairy">Dairy</option>
                </select>
                <select
                  value={region}
                  onChange={e => setRegion(e.target.value)}
                  className="bg-background border border-white/10 rounded-lg px-4 py-2 text-sm text-white outline-none focus:border-primary"
                >
                  <option value="All">All Regions</option>
                  <option value="Central Kenya">Central Kenya</option>
                  <option value="Rift Valley">Rift Valley</option>
                  <option value="Uganda">Uganda</option>
                </select>
                <div className="h-8 w-px bg-white/10 hidden sm:block" />
                <button
                  onClick={() => setExportOnly(v => !v)}
                  className={clsx(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors border",
                    exportOnly
                      ? "bg-primary/20 border-primary text-primary"
                      : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                  )}
                >
                  <Filter className="w-3 h-3 inline mr-1.5" />Export Only
                </button>
                <button
                  onClick={() => setOrganicOnly(v => !v)}
                  className={clsx(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors border",
                    organicOnly
                      ? "bg-primary/20 border-primary text-primary"
                      : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                  )}
                >
                  🌿 Organic
                </button>
                {(search || category !== "All" || region !== "All" || exportOnly || organicOnly) && (
                  <button
                    onClick={() => { setSearch(""); setCategory("All"); setRegion("All"); setExportOnly(false); setOrganicOnly(false); }}
                    className="px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 border border-transparent hover:border-destructive/20 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Data Table */}
              <div className="glass-panel rounded-3xl overflow-hidden border-white/10 shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse whitespace-nowrap">
                    <thead>
                      <tr className="bg-background/80 border-b border-white/10 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        <th className="p-5 pl-6">#</th>
                        <th className="p-5">Commodity</th>
                        <th className="p-5">Avg Price ({currency})</th>
                        <th className="p-5">Demand</th>
                        <th className="p-5">Market Size</th>
                        <th className="p-5">Trend</th>
                        <th className="p-5">Health</th>
                        <th className="p-5 text-right pr-6">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredData.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-20 text-center text-muted-foreground">
                            <div className="flex flex-col items-center gap-3">
                              <Filter className="w-8 h-8 opacity-30" />
                              <div className="font-medium">No commodities match your filters</div>
                              <button
                                onClick={() => { setSearch(""); setCategory("All"); setRegion("All"); setExportOnly(false); setOrganicOnly(false); }}
                                className="text-primary text-sm hover:underline"
                              >
                                Clear all filters
                              </button>
                            </div>
                          </td>
                        </tr>
                      ) : filteredData.map((item, idx) => {
                        const price = item.avgPrice * (currency === "USD" ? 1 : CONVERSION_RATES[currency]);
                        return (
                          <tr key={item.id} className="hover:bg-white/[0.03] transition-colors group">
                            <td className="p-5 pl-6 text-sm text-white/40">{idx + 1}</td>
                            <td className="p-5">
                              <div className="font-bold text-white text-base group-hover:text-primary transition-colors">{item.name}</div>
                              <div className="text-xs text-muted-foreground flex items-center gap-2">
                                {item.category}
                                {item.isOrganic && <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold">ORG</span>}
                                {item.isExport && <span className="text-[10px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded font-bold">EXP</span>}
                              </div>
                            </td>
                            <td className="p-5">
                              <div className="font-mono font-bold text-white text-base">
                                {currency !== "USD" ? "" : "$"}{price.toLocaleString(undefined, { maximumFractionDigits: 2 })} <span className="text-xs text-muted-foreground">{currency}</span>
                              </div>
                              <div className={clsx("text-xs flex items-center font-medium mt-0.5", (item.priceChange7d ?? 0) > 0 ? "text-primary" : (item.priceChange7d ?? 0) < 0 ? "text-destructive" : "text-muted-foreground")}>
                                {(item.priceChange7d ?? 0) > 0 ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : (item.priceChange7d ?? 0) < 0 ? <ArrowDownRight className="w-3 h-3 mr-0.5" /> : <Minus className="w-3 h-3 mr-0.5" />}
                                {Math.abs(item.priceChange7d ?? 0).toFixed(1)}% 7d
                              </div>
                            </td>
                            <td className="p-5">
                              <span className={clsx(
                                "px-3 py-1.5 rounded-lg text-xs font-bold uppercase",
                                item.demandLevel === 'Very High' || item.demandLevel === 'High'
                                  ? "bg-primary/10 text-primary border border-primary/20"
                                  : item.demandLevel === 'Medium'
                                  ? "bg-secondary/10 text-secondary border border-secondary/20"
                                  : "bg-white/5 text-white/60 border border-white/10"
                              )}>
                                {item.demandLevel}
                              </span>
                            </td>
                            <td className="p-5 font-mono text-sm text-white/80">
                              ${(item.marketSizeUsd / 1_000_000).toFixed(1)}M
                            </td>
                            <td className="p-5">
                              {item.trend === 'up' && <ArrowUpRight className="w-5 h-5 text-primary" />}
                              {item.trend === 'down' && <ArrowDownRight className="w-5 h-5 text-destructive" />}
                              {item.trend === 'stable' && <Minus className="w-5 h-5 text-muted-foreground" />}
                            </td>
                            <td className="p-5">
                              <div className="flex items-center gap-2">
                                <div className={clsx(
                                  "w-3 h-3 rounded-full",
                                  item.marketHealth === 'Green'
                                    ? "bg-primary shadow-[0_0_10px_rgba(16,185,129,0.8)]"
                                    : item.marketHealth === 'Yellow'
                                    ? "bg-secondary shadow-[0_0_10px_rgba(217,119,6,0.8)]"
                                    : "bg-destructive shadow-[0_0_10px_rgba(239,68,68,0.8)]"
                                )} />
                                <span className="text-xs font-bold text-white/80">{item.marketHealth}</span>
                              </div>
                            </td>
                            <td className="p-5 text-right pr-6">
                              <Link
                                href={`/market-hub/${item.id}`}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-primary border border-white/10 hover:border-primary rounded-xl text-sm font-bold text-white transition-all shadow-sm"
                              >
                                Data Room <ChevronRight className="w-4 h-4" />
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {filteredData.length > 0 && (
                  <div className="px-6 py-3 border-t border-white/5 text-xs text-muted-foreground">
                    Showing {filteredData.length} of {commodities?.length ?? 0} commodities
                  </div>
                )}
              </div>
            </>
          )}

          {sidebarView === "alerts" && (
            <div>
              <div className="mb-8">
                <h1 className="text-4xl font-display font-bold text-white tracking-tight">Market Alerts</h1>
                <p className="text-muted-foreground mt-2 text-lg">Live anomaly detection from regional intelligence nodes.</p>
              </div>

              {!alerts || alerts.length === 0 ? (
                <div className="glass-panel rounded-3xl p-16 text-center border-white/10">
                  <Bell className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <div className="text-white font-medium text-lg mb-2">No active alerts</div>
                  <div className="text-muted-foreground text-sm">All monitored markets are stable.</div>
                </div>
              ) : (
                <div className="space-y-4">
                  {alerts.map(alert => (
                    <div
                      key={alert.id}
                      className={clsx(
                        "p-5 rounded-2xl border flex items-start gap-4 glass-panel",
                        alert.severity === 'critical' ? "border-destructive/30 bg-destructive/5" :
                        alert.severity === 'high' ? "border-secondary/30 bg-secondary/5" :
                        alert.severity === 'medium' ? "border-blue-500/30 bg-blue-500/5" :
                        "border-white/10"
                      )}
                    >
                      <div className={clsx(
                        "p-3 rounded-xl flex-shrink-0",
                        alert.severity === 'critical' ? "bg-destructive/20 text-destructive" :
                        alert.severity === 'high' ? "bg-secondary/20 text-secondary" :
                        alert.severity === 'medium' ? "bg-blue-500/20 text-blue-400" :
                        "bg-white/10 text-white/60"
                      )}>
                        {alert.type === 'price_spike' ? <TrendingUp className="w-5 h-5" /> :
                         alert.type === 'supply_gap' ? <AlertTriangle className="w-5 h-5" /> :
                         alert.type === 'high_demand' ? <Activity className="w-5 h-5" /> :
                         <Bell className="w-5 h-5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap mb-1">
                          <span className={clsx(
                            "text-xs font-bold uppercase px-2 py-0.5 rounded",
                            alert.severity === 'critical' ? "bg-destructive/20 text-destructive" :
                            alert.severity === 'high' ? "bg-secondary/20 text-secondary" :
                            "bg-white/10 text-white/60"
                          )}>{alert.severity}</span>
                          <h4 className="font-bold text-white text-sm">{alert.commodity}</h4>
                          <span className="text-xs text-muted-foreground font-mono ml-auto">{new Date(alert.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-white/80 text-sm">{alert.message}</p>
                        <div className="text-xs font-medium mt-2 text-muted-foreground">
                          Region: {alert.region} · Type: {alert.type.replace(/_/g, ' ')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Market Alerts Footer Bar */}
        {alerts && alerts.length > 0 && (
          <div className="h-12 border-t border-white/10 bg-card flex items-center px-4 overflow-hidden relative z-20 flex-shrink-0">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mr-4 flex-shrink-0">LIVE</span>
            <div className="flex items-center gap-6 animate-ticker whitespace-nowrap overflow-hidden">
              {[...alerts, ...alerts].map((alert, i) => (
                <div key={i} className={clsx(
                  "flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold flex-shrink-0",
                  alert.severity === 'critical' ? "bg-destructive/20 text-destructive" :
                  alert.severity === 'high' ? "bg-secondary/20 text-secondary" :
                  "bg-blue-500/20 text-blue-400"
                )}>
                  <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                  {alert.commodity}: {alert.message}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Exit Dialog */}
      <Dialog open={exitOpen} onOpenChange={setExitOpen}>
        <DialogContent className="bg-card border-white/10 text-white sm:max-w-md rounded-3xl p-8">
          <DialogHeader>
            <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center mb-4">
              <LogOut className="w-6 h-6 text-destructive" />
            </div>
            <DialogTitle className="text-2xl font-display">Exit Market Hub?</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground mt-2 mb-6">Your secure session will be terminated and you will need to re-enter your PIN to access Market Hub again.</p>
          <DialogFooter className="flex gap-3 sm:justify-start">
            <button onClick={() => setExitOpen(false)} className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 font-bold hover:bg-white/10 transition-colors">Cancel</button>
            <button onClick={() => { setExitOpen(false); logout(); }} className="flex-1 py-3 rounded-xl bg-destructive text-white font-bold hover:bg-destructive/90 transition-colors">Exit Hub</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
