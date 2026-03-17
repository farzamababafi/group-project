"use client";

import type { StockMetrics } from "@/lib/types";

interface MetricsAccordionProps {
  metrics: StockMetrics | null;
}

export function MetricsAccordion({ metrics }: MetricsAccordionProps) {
  if (!metrics) {
    return (
      <div style={{ fontSize: 13, color: "rgba(15,23,42,0.6)", fontFamily: "'DM Sans', system-ui, -apple-system, BlinkMacSystemFont" }}>
        Metrics will appear here after you run a request.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 32,
          justifyItems: "center",
          alignItems: "center",
        }}
      >
        <MetricCard label="Volatility" value={(metrics.volatility * 100).toFixed(2) + "%"} sub="Price fluctuation" />
        <MetricCard label="Avg Log Return" value={(metrics.avg_log_return * 100).toFixed(2) + "%"} sub="Average daily return" />
        <MetricCard label="ROI Ratio" value={(metrics.roi_ratio * 100).toFixed(2) + "%"} sub="Return on investment" />
        <MetricCard label="Recovery Duration" value={metrics.recovery_duration + " days"} sub="Loss recovery time" />
      </div>
    </div>
  );
}

function MetricCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      padding: "24px 32px",
      borderRadius: 28,
      background: "rgba(255,255,255,0.7)",
      backdropFilter: "blur(10px)",
      border: "0.5px solid rgba(0,0,0,0.07)",
      boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
      gap: 6,
      minWidth: 240,
      maxWidth: 360,
    }}>
      <span style={{ fontSize: 20, color: "rgba(0,0,0,0.4)", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "SF Mono, ui-monospace, monospace" }}>{label}</span>
      <span style={{ fontSize: 30, fontWeight: 650, color: "rgba(0,0,0,0.88)", letterSpacing: "-0.03em" }}>{value}</span>
      <span style={{ fontSize: 20, color: "rgba(0,0,0,0.38)", letterSpacing: "0.02em" }}>{sub}</span>
    </div>
  );
}
