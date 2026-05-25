import { useState } from "react";
import { useMarketAuth } from "@/store/use-auth";
import { useVerifyMarketPin, useListCommodities, useListMarketAlerts } from "@workspace/api-client-react";
import { Shield, Lock, ChevronRight, Activity, Globe, DollarSign, LogOut, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { Link } from "wouter";
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
      onError: () => setError("Verification failed")
    });
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 z-0">
        <img src={`${import.meta.env.BASE_URL}images/auth-bg.png`} className="w-full h-full object-cover opacity-10" alt="auth bg" />
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
                onChange={(e) => setPin(e.target.value)}
                className="w-full bg-background/50 border-2 border-white/10 rounded-2xl py-5 pl-14 pr-4 text-center text-3xl tracking-[0.5em] text-white focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all outline-none"
                placeholder="••••"
              />
            </div>
            {error && <p className="text-destructive text-sm mt-3 text-center font-medium">{error}</p>}
          </div>
          
          <button 
            type="submit" 
            disabled={isPending || pin.length < 4}
            className="w-full py-5 rounded-2xl bg-gradient-to-r from-primary to-emerald-600 text-white font-bold text-lg hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] disabled:opacity-50 transition-all"
          >
            {isPending ? "Decrypting..." : "Access Data Room"}
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

export default function MarketHub() {
  const { isVerified, logout } = useMarketAuth();
  const [currency, setCurrency] = useState("USD");
  const [exitOpen, setExitOpen] = useState(false);
  
  // Filters
  const [category, setCategory] = useState("All");
  const [region, setRegion] = useState("All");
  
  const { data: commodities, isLoading } = useListCommodities();
  const { data: alerts } = useListMarketAlerts();

  if (!isVerified) return <PinEntry />;
  if (isLoading) return <LoadingScreen />;

  const filteredData = commodities?.filter(c => {
    if (category !== "All" && c.category !== category) return false;
    if (region !== "All" && c.region !== region) return false;
    return true;
  });

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden bg-background">
      {/* Sidebar */}
      <div className="w-72 border-r border-white/5 bg-card/30 flex flex-col z-20 relative">
        <div className="p-6 pb-2 border-b border-white/5">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-secondary" />
            <div>
              <div className="font-display font-bold text-white leading-tight">MARKET HUB</div>
              <div className="text-[10px] font-mono text-primary tracking-widest uppercase">Secured Session</div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-1 no-scrollbar">
          <div className="text-xs font-bold text-muted-foreground mb-3 px-3 mt-4">INTELLIGENCE LAYERS</div>
          <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-primary/10 text-primary font-bold border border-primary/20">
            <span className="flex items-center gap-3"><Activity className="w-4 h-4" /> Market Scan</span>
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/5 hover:text-white font-medium transition-colors">
            <Globe className="w-4 h-4" /> Category Data Rooms
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/5 hover:text-white font-medium transition-colors">
            <DollarSign className="w-4 h-4" /> AI Automation
          </button>
          
          <div className="text-xs font-bold text-muted-foreground mb-3 px-3 mt-8">OPERATIONS</div>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/5 hover:text-white font-medium transition-colors">
             Buyer Network
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/5 hover:text-white font-medium transition-colors">
             Contract Engine
          </button>
          <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-white/70 hover:bg-white/5 hover:text-white font-medium transition-colors">
             Market Alerts
             <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-destructive text-white">3</span>
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

          {/* Super Filters */}
          <div className="flex flex-wrap gap-3 mb-6 bg-card border border-white/10 p-4 rounded-2xl">
            <select value={category} onChange={e=>setCategory(e.target.value)} className="bg-background border border-white/10 rounded-lg px-4 py-2 text-sm text-white outline-none">
              <option value="All">All Categories</option>
              <option value="Horticulture">Horticulture</option>
              <option value="Beverages">Beverages</option>
              <option value="Cereals">Cereals</option>
              <option value="Dairy">Dairy</option>
            </select>
            <select value={region} onChange={e=>setRegion(e.target.value)} className="bg-background border border-white/10 rounded-lg px-4 py-2 text-sm text-white outline-none">
              <option value="All">All Regions</option>
              <option value="Central Kenya">Central Kenya</option>
              <option value="Rift Valley">Rift Valley</option>
              <option value="Uganda">Uganda</option>
            </select>
            <div className="h-10 w-px bg-white/10 mx-2" />
            <button className="px-4 py-2 rounded-lg bg-white/5 text-sm text-white/70 hover:bg-white/10 transition-colors">Export Only</button>
            <button className="px-4 py-2 rounded-lg bg-white/5 text-sm text-white/70 hover:bg-white/10 transition-colors">Organic</button>
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
                  {filteredData?.map((item, idx) => {
                    const price = item.avgPrice * (currency === "USD" ? 1 : CONVERSION_RATES[currency]);
                    return (
                      <tr key={item.id} className="hover:bg-white/[0.03] transition-colors group">
                        <td className="p-5 pl-6 text-sm text-white/40">{idx+1}</td>
                        <td className="p-5">
                          <div className="font-bold text-white text-base group-hover:text-primary transition-colors">{item.name}</div>
                          <div className="text-xs text-muted-foreground">{item.category}</div>
                        </td>
                        <td className="p-5">
                          <div className="font-mono font-bold text-white text-base">
                            {price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                          </div>
                          <div className={clsx("text-xs flex items-center font-medium mt-0.5", (item.priceChange7d || 0) > 0 ? "text-primary" : "text-destructive")}>
                            {(item.priceChange7d || 0) > 0 ? <ArrowUpRight className="w-3 h-3 mr-0.5"/> : <ArrowDownRight className="w-3 h-3 mr-0.5"/>}
                            {Math.abs(item.priceChange7d || 0)}% 7d
                          </div>
                        </td>
                        <td className="p-5">
                          <span className={clsx(
                            "px-3 py-1.5 rounded-lg text-xs font-bold uppercase",
                            item.demandLevel === 'Very High' || item.demandLevel === 'High' ? "bg-primary/10 text-primary border border-primary/20" :
                            item.demandLevel === 'Medium' ? "bg-secondary/10 text-secondary border border-secondary/20" : "bg-white/5 text-white/60 border border-white/10"
                          )}>
                            {item.demandLevel.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-5 font-mono text-sm text-white/80">
                          ${(item.marketSizeUsd / 1000000).toFixed(1)}M
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
                              item.marketHealth === 'Green' ? "bg-primary shadow-[0_0_10px_rgba(16,185,129,0.8)]" :
                              item.marketHealth === 'Yellow' ? "bg-secondary shadow-[0_0_10px_rgba(217,119,6,0.8)]" : "bg-destructive shadow-[0_0_10px_rgba(239,68,68,0.8)]"
                            )} />
                            <span className="text-xs font-bold text-white/80">{item.marketHealth}</span>
                          </div>
                        </td>
                        <td className="p-5 text-right pr-6">
                          <Link href={`/market-hub/${item.id}`} className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-primary border border-white/10 hover:border-primary rounded-xl text-sm font-bold text-white transition-all shadow-sm">
                            Data Room <ChevronRight className="w-4 h-4" />
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Market Alerts Bar */}
        <div className="h-14 border-t border-white/10 bg-card flex items-center px-4 overflow-hidden relative z-20">
          <div className="flex items-center gap-4 animate-ticker whitespace-nowrap">
            {alerts?.map((alert, i) => (
              <div key={i} className={clsx(
                "flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold",
                alert.severity === 'critical' ? "bg-destructive/20 text-destructive" :
                alert.severity === 'high' ? "bg-secondary/20 text-secondary" : "bg-blue-500/20 text-blue-400"
              )}>
                <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                {alert.commodity}: {alert.message}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={exitOpen} onOpenChange={setExitOpen}>
        <DialogContent className="bg-card border-white/10 text-white sm:max-w-md rounded-3xl p-8">
          <DialogHeader>
            <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center mb-4">
              <LogOut className="w-6 h-6 text-destructive" />
            </div>
            <DialogTitle className="text-2xl font-display">Exit Market Hub?</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground mt-2 mb-6">Are you sure you want to exit? Your secure session will be terminated and you will need to re-enter your PIN.</p>
          <DialogFooter className="flex gap-3 sm:justify-start">
            <button onClick={() => setExitOpen(false)} className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 font-bold hover:bg-white/10 transition-colors">Cancel</button>
            <button onClick={() => { setExitOpen(false); logout(); }} className="flex-1 py-3 rounded-xl bg-destructive text-white font-bold hover:bg-destructive/90 transition-colors">Exit Hub</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
