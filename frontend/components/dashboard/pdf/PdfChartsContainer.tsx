"use client";

/**
 * Renders all stock metric charts with fixed dimensions (no ResponsiveContainer)
 * so they can be mounted off-screen and captured as SVG images for PDF export.
 */

import React from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import type { StockTimePoint } from "@/lib/types";

export const CHART_WIDTH = 740;
export const CHART_HEIGHT = 240;

type MetricKey = keyof Pick<
  StockTimePoint,
  "Open" | "High" | "Low" | "Close" | "Volume" | "Adjusted Close"
>;

const METRICS: { key: MetricKey; label: string; color: string }[] = [
  { key: "Open",           label: "Open",       color: "#2563EB" },
  { key: "High",           label: "High",       color: "#059669" },
  { key: "Low",            label: "Low",        color: "#DC2626" },
  { key: "Close",          label: "Close",      color: "#7C3AED" },
  { key: "Adjusted Close", label: "Adj. Close", color: "#EA580C" },
  { key: "Volume",         label: "Volume",     color: "#0E7490" },
];

export const PDF_CHART_CONFIGS: { key: MetricKey | null; label: string }[] = [
  { key: null,              label: "All Metrics" },
  { key: "Open",            label: "Open" },
  { key: "High",            label: "High" },
  { key: "Low",             label: "Low" },
  { key: "Close",           label: "Close" },
  { key: "Adjusted Close",  label: "Adj. Close" },
  { key: "Volume",          label: "Volume" },
];

const axisStyle = {
  fontSize: 10,
  fill: "rgba(0,0,0,0.4)",
  fontFamily: "monospace",
};

function fmtTick(v: string) {
  const d = new Date(v);
  return isNaN(d.getTime()) ? v : d.toLocaleString("en-US", { month: "short", year: "numeric" });
}

function fmtCompact(v: number) {
  if (v >= 1e9) return `${(v / 1e9).toFixed(1)}B`;
  if (v >= 1e6) return `${(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `${(v / 1e3).toFixed(0)}K`;
  return v.toFixed(0);
}

const PRICE_METRIC_KEYS: MetricKey[] = ["Open", "High", "Low", "Close", "Adjusted Close"];
const METRIC_COLOR: Record<MetricKey, string> = Object.fromEntries(
  METRICS.map((m) => [m.key, m.color])
) as Record<MetricKey, string>;

const MARGIN = { top: 8, right: 24, left: 0, bottom: 8 };

function AllChart({ data }: { data: StockTimePoint[] }) {
  return (
    <LineChart width={CHART_WIDTH} height={CHART_HEIGHT} data={data} margin={MARGIN}>
      <CartesianGrid strokeDasharray="3 0" stroke="rgba(0,0,0,0.05)" vertical={false} />
      <XAxis dataKey="Date" tickFormatter={fmtTick} tick={axisStyle} axisLine={false} tickLine={false} minTickGap={60} />
      <YAxis tickFormatter={(v) => `$${fmtCompact(v)}`} tick={axisStyle} axisLine={false} tickLine={false} width={44} domain={["auto", "auto"]} />
      {PRICE_METRIC_KEYS.map((k) => (
        <Line key={k} type="monotone" dataKey={k} stroke={METRIC_COLOR[k]} strokeWidth={1.5} dot={false} isAnimationActive={false} />
      ))}
    </LineChart>
  );
}

function SingleChart({ data, metricKey }: { data: StockTimePoint[]; metricKey: MetricKey }) {
  const color = METRIC_COLOR[metricKey];
  const isVol = metricKey === "Volume";
  const gradId = `pdf-grad-${metricKey.replace(" ", "-")}`;

  if (isVol) {
    return (
      <LineChart width={CHART_WIDTH} height={CHART_HEIGHT} data={data} margin={MARGIN}>
        <CartesianGrid strokeDasharray="3 0" stroke="rgba(0,0,0,0.05)" vertical={false} />
        <XAxis dataKey="Date" tickFormatter={fmtTick} tick={axisStyle} axisLine={false} tickLine={false} minTickGap={60} />
        <YAxis tickFormatter={fmtCompact} tick={axisStyle} axisLine={false} tickLine={false} width={48} />
        <Line type="monotone" dataKey="Volume" stroke={color} strokeWidth={1.75} dot={false} isAnimationActive={false} />
      </LineChart>
    );
  }

  return (
    <AreaChart width={CHART_WIDTH} height={CHART_HEIGHT} data={data} margin={MARGIN}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.18} />
          <stop offset="88%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 0" stroke="rgba(0,0,0,0.05)" vertical={false} />
      <XAxis dataKey="Date" tickFormatter={fmtTick} tick={axisStyle} axisLine={false} tickLine={false} minTickGap={60} />
      <YAxis tickFormatter={(v) => `$${fmtCompact(v)}`} tick={axisStyle} axisLine={false} tickLine={false} width={44} domain={["auto", "auto"]} />
      <Area type="monotone" dataKey={metricKey} stroke={color} strokeWidth={1.75} fill={`url(#${gradId})`} dot={false} isAnimationActive={false} />
    </AreaChart>
  );
}

export function PdfChartsContainer({ data }: { data: StockTimePoint[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0, background: "#fff" }}>
      {PDF_CHART_CONFIGS.map((cfg) => (
        <div
          key={String(cfg.key)}
          data-pdf-chart={String(cfg.key)}
          style={{ background: "#fff", padding: "8px 0" }}
        >
          {cfg.key === null ? (
            <AllChart data={data} />
          ) : (
            <SingleChart data={data} metricKey={cfg.key} />
          )}
        </div>
      ))}
    </div>
  );
}
