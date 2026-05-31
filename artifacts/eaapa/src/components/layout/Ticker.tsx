import { useState, useRef } from "react";
import { useListMarketAlerts } from "@workspace/api-client-react";
import { TrendingUp, AlertTriangle, Sprout, Activity } from "lucide-react";
import { Link } from "wouter";

const FALLBACK = [
  { text: "Avocado exports up 14% this quarter — Rift Valley corridor leading the surge in EU market share", type: "forecast" },
  { text: "Coffee prices stabilizing at $3.40/kg across Nairobi & Kampala commodity hubs — buyers actively seeking supply", type: "stable" },
  { text: "Supply gap detected: Macadamia demand exceeds regional supply by 23% — certified exporters encouraged to list", type: "supply_gap" },
  { text: "Export window open: Vanilla to Shanghai — quota available for EAAPA certified producers until end of quarter", type: "forecast" },
  { text: "Maize demand surging in Central Region — 500 tonne offtake opportunity flagged by processors", type: "high_demand" },
  { text: "GlobalGAP compliance window closing 15 June — fast-track support available through EAAPA portal", type: "stable" },
  { text: "EU SPS alert: updated Maximum Residue Level limits for fresh vegetables effective Q3 2025", type: "supply_gap" },
  { text: "AfDB AgriFinance facility open — USD 50M available for registered cooperatives and agribusinesses", type: "forecast" },
  { text: "Hass avocado spot price: $1.82/kg — 3-week high reported at Rotterdam exchange", type: "stable" },
  { text: "EAAPA Annual Summit 2025 registrations now open — early bird closes May 1", type: "forecast" },
];

export function Ticker() {
  const { data: alerts } = useListMarketAlerts();
  const [paused, setPaused] = useState(false);
  const touchRef = useRef<number | null>(null);

  const rawItems = alerts && alerts.length > 0
    ? alerts.map((a: any) => ({ text: a.message ?? a.text ?? "", type: a.type ?? "stable" }))
    : FALLBACK;

  // Triple for seamless loop
  const items = [...rawItems, ...rawItems, ...rawItems];

  function handleTouchStart() {
    setPaused(true);
    if (touchRef.current) clearTimeout(touchRef.current);
  }
  function handleTouchEnd() {
    touchRef.current = window.setTimeout(() => setPaused(false), 2000);
  }

  return (
    <div
      className={`w-full border-b overflow-hidden flex whitespace-nowrap select-none h-9 cursor-pointer${paused ? " ticker-paused" : ""}`}
      style={{ background: "hsl(152 52% 26% / 0.06)", borderColor: "hsl(152 52% 26% / 0.14)" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      title="Hover to pause"
    >
      <div
        className="ticker-track flex items-center gap-12 pl-8 shrink-0"
        style={{ animation: "ticker 220s linear infinite", willChange: "transform" }}
      >
        {items.map((item, i) => (
          <Link
            key={i}
            href="/community"
            className="inline-flex items-center gap-2 text-[11.5px] font-medium shrink-0 hover:opacity-80 transition-opacity"
            style={{ color: "hsl(24 22% 38%)" }}
          >
            {item.type === "supply_gap" || item.type === "price_spike" ? (
              <AlertTriangle className="w-3 h-3 shrink-0" style={{ color: "hsl(38 74% 45%)" }} />
            ) : item.type === "forecast" || item.type === "high_demand" ? (
              <TrendingUp className="w-3 h-3 shrink-0" style={{ color: "hsl(152 52% 32%)" }} />
            ) : item.type === "stable" ? (
              <Sprout className="w-3 h-3 shrink-0" style={{ color: "hsl(152 52% 32%)" }} />
            ) : (
              <Activity className="w-3 h-3 shrink-0" style={{ color: "hsl(215 60% 50%)" }} />
            )}
            {item.text}
            <span style={{ color: "hsl(42 18% 78%)", marginLeft: "1.25rem" }}>◆</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
