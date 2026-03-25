import { useState } from "react";
import { useMarketAuth } from "@/store/use-auth";
import { useVerifyMarketPin, useListCommodities } from "@workspace/api-client-react";
import { Shield, Lock, ChevronRight, Activity, Globe, DollarSign } from "lucide-react";
import { Link } from "wouter";
import { LoadingScreen } from "@/components/ui/Loading";
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
    <div className="min-h-[80vh] flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 z-0">
        <img src={`${import.meta.env.BASE_URL}images/auth-bg.png`} className="w-full h-full object-cover opacity-20" alt="auth bg" />
      </div>
      <div className="glass-panel p-8 md:p-12 rounded-3xl w-full max-w-md relative z-10 border-primary/20 shadow-2xl shadow-primary/5">
        <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-6">
          <Shield className="w-8 h-8 text-secondary" />
        </div>
        <h2 className="text-2xl font-display font-bold text-center text-white mb-2">Restricted Access</h2>
        <p className="text-center text-muted-foreground mb-8 text-sm">Enter your executive PIN to access the Market Hub Intelligence Layer.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="password"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full bg-background border-2 border-white/10 rounded-xl py-4 pl-12 pr-4 text-center text-2xl tracking-[0.5em] text-white focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all outline-none"
                placeholder="••••"
              />
            </div>
            {error && <p className="text-destructive text-sm mt-2 text-center">{error}</p>}
          </div>
          
          <button 
            type="submit" 
            disabled={isPending || pin.length < 4}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-emerald-600 text-white font-bold text-lg hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50 transition-all"
          >
            {isPending ? "Decrypting..." : "Access Data Room"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function MarketHub() {
  const { isVerified } = useMarketAuth();
  const { data: commodities, isLoading } = useListCommodities();

  if (!isVerified) return <PinEntry />;
  if (isLoading) return <LoadingScreen />;

  return (
    <div className="flex min-h-[calc(100vh-80px)]">
      {/* Sidebar */}
      <div className="w-64 border-r border-white/5 bg-card/30 hidden md:block">
        <div className="p-6">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">Intelligence Layers</h3>
          <div className="space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary font-medium border border-primary/20">
              <Activity className="w-4 h-4" /> Market Scan
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-white/5 hover:text-white transition-colors">
              <Globe className="w-4 h-4" /> Buyer Network
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-white/5 hover:text-white transition-colors">
              <DollarSign className="w-4 h-4" /> Contract Engine
            </button>
          </div>
        </div>
      </div>

      {/* Main Panel */}
      <div className="flex-1 p-6 md:p-10">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-white">Layer 1: Market Scan Dashboard</h1>
          <p className="text-muted-foreground mt-2">Real-time commodity prices, demand levels, and health indicators.</p>
        </div>

        <div className="bg-card border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-sm font-semibold text-muted-foreground">
                  <th className="p-4">Commodity</th>
                  <th className="p-4">Avg Price</th>
                  <th className="p-4">Demand</th>
                  <th className="p-4">Market Size</th>
                  <th className="p-4">Trend</th>
                  <th className="p-4">Health</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {commodities?.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-white">{item.name}</div>
                      <div className="text-xs text-muted-foreground">{item.category}</div>
                    </td>
                    <td className="p-4 font-mono font-medium text-white">
                      {item.avgPrice.toLocaleString()} {item.currency}
                    </td>
                    <td className="p-4">
                      <span className={clsx(
                        "px-2.5 py-1 rounded-md text-xs font-bold uppercase",
                        item.demandLevel === 'Very_High' || item.demandLevel === 'High' ? "bg-primary/20 text-primary" :
                        item.demandLevel === 'Medium' ? "bg-secondary/20 text-secondary" : "bg-white/10 text-white/70"
                      )}>
                        {item.demandLevel.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-sm text-white/80">
                      ${(item.marketSizeUsd / 1000000).toFixed(1)}M
                    </td>
                    <td className="p-4">
                      {item.trend === 'up' && <span className="text-primary font-bold">↑</span>}
                      {item.trend === 'down' && <span className="text-destructive font-bold">↓</span>}
                      {item.trend === 'stable' && <span className="text-muted-foreground font-bold">→</span>}
                    </td>
                    <td className="p-4">
                      <div className={clsx(
                        "w-3 h-3 rounded-full shadow-[0_0_8px]",
                        item.marketHealth === 'Green' ? "bg-primary shadow-primary/50" :
                        item.marketHealth === 'Yellow' ? "bg-secondary shadow-secondary/50" : "bg-destructive shadow-destructive/50"
                      )} />
                    </td>
                    <td className="p-4 text-right">
                      <Link href={`/market-hub/${item.id}`} className="inline-flex items-center gap-1 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium text-white transition-all">
                        Data Room <ChevronRight className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
