import { useListMarketAlerts } from "@workspace/api-client-react";
import { TrendingUp, AlertTriangle, Sprout, Activity } from "lucide-react";

const FALLBACK = [
  { text: "Avocado exports up 14% this quarter — Rift Valley corridor leading", type: "forecast" },
  { text: "Coffee prices stabilizing at $3.40/kg across Nairobi & Kampala hubs", type: "stable" },
  { text: "Supply gap detected: Macadamia demand exceeds supply by 23% in Nairobi region", type: "supply_gap" },
  { text: "New export window open: Vanilla to Shanghai — quota available for certified producers", type: "forecast" },
  { text: "Maize demand surging in Central Region — 500 tonne offtake opportunity flagged by buyers", type: "high_demand" },
  { text: "GlobalGAP compliance window closing 15 June — apply now via EAAPA portal", type: "stable" },
  { text: "EU SPS alert: updated MRL limits for fresh vegetables effective Q3 2025", type: "supply_gap" },
  { text: "AfDB AgriFinance facility open — USD 50M available for registered cooperatives", type: "forecast" },
  { text: "Hass avocado spot price: $1.82/kg — 3-week high on Rotterdam exchange", type: "stable" },
  { text: "KEPHIS fast-track certification now available for export-ready agripreneurs", type: "forecast" },
];

export function Ticker() {
  const { data: alerts } = useListMarketAlerts();

  const rawItems = alerts && alerts.length > 0
    ? alerts.map((a: any) => ({ text: a.message ?? a.text ?? "", type: a.type ?? "stable" }))
    : FALLBACK;

  // Triplicate for seamless infinite loop with no gap at wrap-around
  const items = [...rawItems, ...rawItems, ...rawItems];

  return (
    <div
      className="w-full border-b overflow-hidden flex whitespace-nowrap select-none h-9"
      style={{
        background: "hsl(152 55% 36% / 0.06)",
        borderColor: "hsl(152 55% 36% / 0.14)",
      }}
    >
      <div
        className="flex items-center gap-12 pl-8 shrink-0"
        style={{ animation: "ticker 120s linear infinite", willChange: "transform" }}
      >
        {items.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2 text-[11.5px] font-medium shrink-0"
            style={{ color: "hsl(215 18% 72%)" }}
          >
            {item.type === "supply_gap" || item.type === "price_spike" ? (
              <AlertTriangle className="w-3 h-3 shrink-0" style={{ color: "hsl(38 80% 52%)" }} />
            ) : item.type === "forecast" || item.type === "high_demand" ? (
              <TrendingUp className="w-3 h-3 shrink-0" style={{ color: "hsl(152 55% 46%)" }} />
            ) : item.type === "stable" ? (
              <Sprout className="w-3 h-3 shrink-0" style={{ color: "hsl(152 55% 46%)" }} />
            ) : (
              <Activity className="w-3 h-3 shrink-0" style={{ color: "hsl(210 80% 62%)" }} />
            )}
            {item.text}
            <span style={{ color: "hsl(220 22% 28%)", marginLeft: "1.25rem" }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
