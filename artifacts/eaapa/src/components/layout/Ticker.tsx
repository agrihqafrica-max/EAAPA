import { useListMarketAlerts } from "@workspace/api-client-react";
import { TrendingUp, AlertTriangle, Activity } from "lucide-react";

export function Ticker() {
  const { data: alerts } = useListMarketAlerts();
  
  const mockTickerData = [
    { text: "Maize demand surging in Central Region", type: "high_demand" },
    { text: "Avocado exports up 14% this quarter", type: "forecast" },
    { text: "Coffee prices stabilizing at $3.40/kg", type: "stable" },
    { text: "Supply gap detected: Macadamia (Nairobi)", type: "supply_gap" },
  ];

  const items = alerts || mockTickerData;

  return (
    <div className="w-full bg-primary/10 border-b border-primary/20 text-xs font-medium py-2 overflow-hidden flex whitespace-nowrap">
      <div className="flex animate-ticker gap-8 items-center pl-8">
        {[...items, ...items, ...items].map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-primary-foreground/80">
            {item.type === 'supply_gap' || item.type === 'price_spike' ? (
              <AlertTriangle className="w-3 h-3 text-secondary" />
            ) : item.type === 'forecast' ? (
              <TrendingUp className="w-3 h-3 text-primary" />
            ) : (
              <Activity className="w-3 h-3 text-blue-400" />
            )}
            <span>{(item as any).message ?? (item as any).text ?? ""}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
