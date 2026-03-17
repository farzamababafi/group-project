"use client";

import React, { useState, useCallback, useRef } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
  ReferenceLine,
} from "recharts";
import type { StockTimePoint } from "@/lib/types";
// #knnxnd
type Props = {
  data: StockTimePoint[];
  stockName?: string | null;
};

type MetricKey = keyof Pick<
  StockTimePoint,
  "Open" | "High" | "Low" | "Close" | "Volume" | "Adjusted Close"
>;

const METRICS: {
  key: MetricKey;
  label: string;
  sublabel: string;
  color: string;
  light: string;
}[] = [
  { key: "Open",          label: "Open",      sublabel: "Opening price",    color: "#2563EB", light: "rgba(37,99,235,0.12)"  },
  { key: "High",          label: "High",      sublabel: "Session high",     color: "#059669", light: "rgba(5,150,105,0.12)"  },
  { key: "Low",           label: "Low",       sublabel: "Session low",      color: "#DC2626", light: "rgba(220,38,38,0.10)"  },
  { key: "Close",         label: "Close",     sublabel: "Closing price",    color: "#7C3AED", light: "rgba(124,58,237,0.12)" },
  { key: "Adjusted Close",label: "Adj. Close",sublabel: "Adjusted closing", color: "#EA580C", light: "rgba(234,88,12,0.10)"  },
  { key: "Volume",        label: "Volume",    sublabel: "Trade volume",     color: "#0E7490", light: "rgba(14,116,144,0.12)" },
];

const METRIC_MAP = METRICS.reduce(
  (acc, m) => { acc[m.key] = m; return acc; },
  {} as Record<MetricKey, typeof METRICS[number]>
);

function fmtTick(value: string) {
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleString("en-US", { month: "short", year: "numeric" });
}

function fmtDate(value: string) {
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

function fmtVal(val: number, isVol: boolean) {
  if (isVol) {
    if (val >= 1e9) return `${(val / 1e9).toFixed(2)}B`;
    if (val >= 1e6) return `${(val / 1e6).toFixed(2)}M`;
    if (val >= 1e3) return `${(val / 1e3).toFixed(0)}K`;
    return val.toLocaleString();
  }
  return `$${val.toFixed(2)}`;
}

function fmtCompact(val: number) {
  if (val >= 1e9) return `${(val / 1e9).toFixed(1)}B`;
  if (val >= 1e6) return `${(val / 1e6).toFixed(1)}M`;
  if (val >= 1e3) return `${(val / 1e3).toFixed(0)}K`;
  return val.toFixed(0);
}

/* ─── Tooltip ─── */
const AllTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const pt = payload[0]?.payload as any;
  const priceKeys: MetricKey[] = ["Open", "High", "Low", "Close", "Adjusted Close"];
  return (
    <div style={{
      background: "rgba(255,255,255,0.88)",
      backdropFilter: "saturate(180%) blur(20px)",
      WebkitBackdropFilter: "saturate(180%) blur(20px)",
      border: "0.5px solid rgba(0,0,0,0.08)",
      borderRadius: 14,
      padding: "12px 16px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 0 0 0.5px rgba(0,0,0,0.04)",
      minWidth: 180,
    }}>
      <p style={{ margin: "0 0 8px", fontSize: 11, color: "rgba(0,0,0,0.45)", letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "SF Mono, ui-monospace, monospace" }}>
        {fmtDate(label)}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {priceKeys.map(k => {
          const m = METRIC_MAP[k];
          const v = pt?.[k];
          if (v == null) return null;
          return (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24 }}>
              <span style={{ fontSize: 11, color: "rgba(0,0,0,0.5)", letterSpacing: "0.02em" }}>{m.label}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: m.color, fontVariantNumeric: "tabular-nums", fontFamily: "SF Mono, ui-monospace, monospace" }}>
                {fmtVal(Number(v), false)}
              </span>
            </div>
          );
        })}
        {pt?.Volume != null && (
          <div style={{ borderTop: "0.5px solid rgba(0,0,0,0.08)", marginTop: 4, paddingTop: 6, display: "flex", justifyContent: "space-between", gap: 24 }}>
            <span style={{ fontSize: 11, color: "rgba(0,0,0,0.5)" }}>Volume</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: METRIC_MAP["Volume"].color, fontVariantNumeric: "tabular-nums", fontFamily: "SF Mono, ui-monospace, monospace" }}>
              {fmtVal(Number(pt.Volume), true)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const SingleTooltip = ({ active, payload, label, color, isVol }: any) => {
  if (!active || !payload?.length || payload[0].value == null) return null;
  return (
    <div style={{
      background: "rgba(255,255,255,0.88)",
      backdropFilter: "saturate(180%) blur(20px)",
      WebkitBackdropFilter: "saturate(180%) blur(20px)",
      border: "0.5px solid rgba(0,0,0,0.08)",
      borderRadius: 14,
      padding: "10px 14px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
    }}>
      <p style={{ margin: "0 0 5px", fontSize: 11, color: "rgba(0,0,0,0.45)", letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "SF Mono, ui-monospace, monospace" }}>
        {fmtDate(label)}
      </p>
      <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color, letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums" }}>
        {fmtVal(Number(payload[0].value), isVol)}
      </p>
    </div>
  );
};

/* ─── Segmented Control ─── */
const SegmentedControl = ({ options, value, onChange }: {
  options: { key: MetricKey | null; label: string; color?: string }[];
  value: MetricKey | null;
  onChange: (k: MetricKey | null) => void;
}) => (
  <div style={{
    display: "inline-flex",
    background: "rgba(118,118,128,0.12)",
    borderRadius: 10,
    padding: 2,
    gap: 1,
  }}>
    {options.map(o => {
      const active = value === o.key;
      return (
        <button key={String(o.key)} onClick={() => onChange(o.key)} style={{
          fontSize: 12,
          fontWeight: active ? 600 : 500,
          padding: "5px 12px",
          borderRadius: 8,
          border: "none",
          background: active ? "#fff" : "transparent",
          color: active ? (o.color ?? "rgba(0,0,0,0.9)") : "rgba(0,0,0,0.55)",
          cursor: "pointer",
          boxShadow: active ? "0 1px 4px rgba(0,0,0,0.12), 0 0 0 0.5px rgba(0,0,0,0.06)" : "none",
          transition: "all 0.18s cubic-bezier(0.4,0,0.2,1)",
          letterSpacing: active ? "-0.02em" : "0",
          whiteSpace: "nowrap",
        }}>{o.label}</button>
      );
    })}
  </div>
);

/* ─── KPI Card ─── */
const KpiCard = ({ label, value, sub }: { label: string; value: string; sub?: string }) => (
  <div style={{
    display: "flex",
    flexDirection: "column",
    padding: "12px 16px",
    borderRadius: 14,
    background: "rgba(255,255,255,0.7)",
    backdropFilter: "blur(10px)",
    border: "0.5px solid rgba(0,0,0,0.07)",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    gap: 3,
    minWidth: 90,
  }}>
    <span style={{ fontSize: 10, color: "rgba(0,0,0,0.4)", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "SF Mono, ui-monospace, monospace" }}>{label}</span>
    <span style={{ fontSize: 15, fontWeight: 650, color: "rgba(0,0,0,0.88)", letterSpacing: "-0.03em" }}>{value}</span>
    {sub && <span style={{ fontSize: 10, color: "rgba(0,0,0,0.38)", letterSpacing: "0.02em" }}>{sub}</span>}
  </div>
);

/* ─── Main ─── */
export function StockCharts({ data, stockName }: Props) {
  const [active, setActive] = useState<MetricKey | null>(null);

  if (!data?.length) return null;

  const closes = data.map(d => d.Close).filter(Boolean);
  const first = closes[0];
  const last = closes[closes.length - 1];
  const change = last - first;
  const pct = ((change / first) * 100).toFixed(2);
  const up = change >= 0;

  const allMetrics = METRICS;
  const current = active ? METRIC_MAP[active] : null;
  const isVol = active === "Volume";
  const vals = active ? data.map(d => d[active] as number).filter(Boolean) : [];
  const gradId = `g-${active?.replace(" ", "-")}`;

  const segOptions: { key: MetricKey | null; label: string; color?: string }[] = [
    { key: null, label: "All" },
    ...METRICS.map(m => ({ key: m.key, label: m.label, color: m.color })),
  ];

  const axisStyle = {
    fontSize: 10,
    fill: "rgba(0,0,0,0.4)",
    fontFamily: "SF Mono, ui-monospace, monospace",
  };

  return (
    <section style={{
      width: "100%",
      borderRadius: 20,
      background: "linear-gradient(180deg, #f5f5f7 0%, #ffffff 100%)",
      border: "0.5px solid rgba(0,0,0,0.1)",
      boxShadow: "0 2px 8px rgba(0,0,0,0.06), 0 24px 64px rgba(0,0,0,0.10)",
      overflow: "hidden",
      fontFamily: "-apple-system, 'SF Pro Display', 'SF Pro Text', BlinkMacSystemFont, sans-serif",
    }}>

      {/* ── Header Bar ── */}
      <div style={{
        padding: "24px 24px 0",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}>
        {/* Top row: name + badge + price */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, color: "rgba(0,0,0,0.38)", letterSpacing: "0.10em", textTransform: "uppercase", fontFamily: "SF Mono, ui-monospace, monospace", marginBottom: 4 }}>
              Price · Volume
            </div>
            <h2 style={{ margin: 0, fontSize: 28, fontWeight: 700, letterSpacing: "-0.06em", color: "rgba(0,0,0,0.9)" }}>
              {stockName ?? "Selected Stock"}
            </h2>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginTop: 4 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.05em", color: "rgba(0,0,0,0.88)", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
                {last ? `$${last.toFixed(2)}` : "—"}
              </div>
              <div style={{
                marginTop: 5,
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                fontSize: 12,
                fontWeight: 600,
                padding: "3px 8px",
                borderRadius: 6,
                background: up ? "rgba(52,199,89,0.15)" : "rgba(255,59,48,0.15)",
                color: up ? "#1c7430" : "#c0392b",
              }}>
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  {up
                    ? <path d="M4 1L7 6H1L4 1Z" fill="currentColor"/>
                    : <path d="M4 7L1 2H7L4 7Z" fill="currentColor"/>
                  }
                </svg>
                {Math.abs(Number(pct))}%
              </div>
            </div>
          </div>
        </div>

        {/* KPI row */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <KpiCard label="Data points" value={data.length.toLocaleString()} />
          <KpiCard label="From" value={data[0].Date?.slice(0, 7) ?? "—"} />
          <KpiCard label="To" value={data[data.length - 1].Date?.slice(0, 7) ?? "—"} />
          {active && vals.length > 0 && (
            <KpiCard
              label="Range"
              value={isVol
                ? `${fmtVal(Math.min(...vals), true)} – ${fmtVal(Math.max(...vals), true)}`
                : `$${Math.min(...vals).toFixed(2)} – $${Math.max(...vals).toFixed(2)}`
              }
            />
          )}
        </div>

        {/* Segmented control */}
        <div style={{ overflowX: "auto", paddingBottom: 4 }}>
          <SegmentedControl options={segOptions} value={active} onChange={setActive} />
        </div>
      </div>

      {/* ── Chart Area ── */}
      <div style={{ padding: "12px 8px 0" }}>

        {/* ALL view */}
        {active === null && (
          <div style={{
            borderRadius: 16,
            background: "#fff",
            border: "0.5px solid rgba(0,0,0,0.06)",
            padding: "16px 8px 10px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          }}>
            <p style={{ margin: "0 0 2px 44px", fontSize: 12, fontWeight: 600, color: "rgba(0,0,0,0.6)", letterSpacing: "-0.01em" }}>
              Open · High · Low · Close · Adj. Close
            </p>
            <div style={{ width: "100%", height: 340 }}>
              <ResponsiveContainer>
                <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 24 }}>
                  <CartesianGrid strokeDasharray="3 0" stroke="rgba(0,0,0,0.05)" vertical={false} />
                  <XAxis dataKey="Date" tickFormatter={fmtTick} tick={axisStyle} axisLine={false} tickLine={false} minTickGap={40} angle={-30} textAnchor="end" />
                  <YAxis tickFormatter={v => `$${fmtCompact(v)}`} tick={axisStyle} axisLine={false} tickLine={false} width={44} domain={["auto","auto"]} />
                  <Tooltip content={<AllTooltip />} cursor={{ stroke: "rgba(0,0,0,0.12)", strokeWidth: 1, strokeDasharray: "4 3" }} />
                  {(["Open","High","Low","Close","Adjusted Close"] as MetricKey[]).map(k => (
                    <Line key={k} type="monotone" dataKey={k} stroke={METRIC_MAP[k].color} strokeWidth={1.5} dot={false} activeDot={{ r: 3.5, fill: METRIC_MAP[k].color, stroke: "#fff", strokeWidth: 2 }} />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div style={{ display: "flex", gap: 16, paddingLeft: 44, flexWrap: "wrap", marginTop: 4 }}>
              {(["Open","High","Low","Close","Adjusted Close"] as MetricKey[]).map(k => (
                <div key={k} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 18, height: 2, borderRadius: 2, background: METRIC_MAP[k].color }} />
                  <span style={{ fontSize: 10, color: "rgba(0,0,0,0.45)", fontFamily: "SF Mono, ui-monospace, monospace", letterSpacing: "0.04em" }}>
                    {k === "Adjusted Close" ? "Adj.C" : k}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SINGLE metric view */}
        {active && current && (
          <div style={{
            borderRadius: 16,
            background: "#fff",
            border: "0.5px solid rgba(0,0,0,0.06)",
            padding: "16px 8px 10px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          }}>
            {/* Metric header */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, paddingLeft: 44, marginBottom: 4 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: current.color, boxShadow: `0 0 0 3px ${current.light}` }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(0,0,0,0.75)", letterSpacing: "-0.02em" }}>{current.label}</span>
              <span style={{ fontSize: 11, color: "rgba(0,0,0,0.38)" }}>—</span>
              <span style={{ fontSize: 11, color: "rgba(0,0,0,0.38)" }}>{current.sublabel}</span>
            </div>

            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                {isVol ? (
                  <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 24 }}>
                    <CartesianGrid strokeDasharray="3 0" stroke="rgba(0,0,0,0.05)" vertical={false} />
                    <XAxis dataKey="Date" tickFormatter={fmtTick} tick={axisStyle} axisLine={false} tickLine={false} minTickGap={40} angle={-30} textAnchor="end" />
                    <YAxis tickFormatter={v => fmtVal(v, true)} tick={axisStyle} axisLine={false} tickLine={false} width={48} />
                    <Tooltip content={(p: any) => <SingleTooltip {...p} color={current.color} isVol />} cursor={{ stroke: "rgba(0,0,0,0.12)", strokeWidth: 1, strokeDasharray: "4 3" }} />
                    <Line type="monotone" dataKey="Volume" stroke={current.color} strokeWidth={1.75} dot={false} activeDot={{ r: 4, fill: current.color, stroke: "#fff", strokeWidth: 2 }} />
                  </LineChart>
                ) : (
                  <AreaChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 24 }}>
                    <defs>
                      <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={current.color} stopOpacity={0.18} />
                        <stop offset="88%" stopColor={current.color} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 0" stroke="rgba(0,0,0,0.05)" vertical={false} />
                    <XAxis dataKey="Date" tickFormatter={fmtTick} tick={axisStyle} axisLine={false} tickLine={false} minTickGap={40} angle={-30} textAnchor="end" />
                    <YAxis tickFormatter={v => `$${fmtCompact(v)}`} tick={axisStyle} axisLine={false} tickLine={false} width={44} domain={["auto","auto"]} />
                    <Tooltip content={(p: any) => <SingleTooltip {...p} color={current.color} isVol={false} />} cursor={{ stroke: "rgba(0,0,0,0.12)", strokeWidth: 1, strokeDasharray: "4 3" }} />
                    <Area type="monotone" dataKey={active} stroke={current.color} strokeWidth={1.75} fill={`url(#${gradId})`} dot={false} activeDot={{ r: 5, fill: current.color, stroke: "#fff", strokeWidth: 2.5 }} />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <div style={{
        padding: "14px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 8,
        borderTop: "0.5px solid rgba(0,0,0,0.06)",
      }}>
        <span style={{ fontSize: 10, color: "rgba(0,0,0,0.3)", fontFamily: "SF Mono, ui-monospace, monospace", letterSpacing: "0.04em" }}>
          {active === null && "Volume visible on hover · "}Historical data · {data.length.toLocaleString()} points
        </span>
        <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(52,199,89,1)" }} />
          <span style={{ fontSize: 10, color: "rgba(0,0,0,0.35)", fontFamily: "SF Mono, ui-monospace, monospace", marginLeft: 4, letterSpacing: "0.04em" }}>Live</span>
        </div>
      </div>
    </section>
  );
}