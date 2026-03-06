"use client";

import React, { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  ReferenceLine,
  Area,
  AreaChart,
} from "recharts";
import type { StockTimePoint } from "@/lib/types";

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
  gradientFrom: string;
  gradientTo: string;
  type: "area" | "line";
}[] = [
  {
    key: "Open",
    label: "Open",
    sublabel: "Opening price",
    color: "#2563EB",
    gradientFrom: "rgba(37,99,235,0.18)",
    gradientTo: "rgba(37,99,235,0.0)",
    type: "area",
  },
  {
    key: "High",
    label: "High",
    sublabel: "Session high",
    color: "#059669",
    gradientFrom: "rgba(5,150,105,0.18)",
    gradientTo: "rgba(5,150,105,0.0)",
    type: "area",
  },
  {
    key: "Low",
    label: "Low",
    sublabel: "Session low",
    color: "#DC2626",
    gradientFrom: "rgba(220,38,38,0.15)",
    gradientTo: "rgba(220,38,38,0.0)",
    type: "area",
  },
  {
    key: "Close",
    label: "Close",
    sublabel: "Closing price",
    color: "#7C3AED",
    gradientFrom: "rgba(124,58,237,0.18)",
    gradientTo: "rgba(124,58,237,0.0)",
    type: "area",
  },
  {
    key: "Adjusted Close",
    label: "Adj. Close",
    sublabel: "Adjusted closing",
    color: "#EA580C",
    gradientFrom: "rgba(234,88,12,0.16)",
    gradientTo: "rgba(234,88,12,0.0)",
    type: "area",
  },
  {
    key: "Volume",
    label: "Volume",
    sublabel: "Trade volume",
    color: "#0E7490",
    gradientFrom: "rgba(14,116,144,0.5)",
    gradientTo: "rgba(14,116,144,0.05)",
    type: "line",
  },
];

function formatDateTick(value: string) {
  return value?.slice(0, 7) ?? value;
}

function formatValue(val: number, isVolume: boolean) {
  if (isVolume) {
    if (val >= 1_000_000_000) return `${(val / 1_000_000_000).toFixed(1)}B`;
    if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 1_000) return `${(val / 1_000).toFixed(0)}K`;
    return val.toLocaleString();
  }
  return `$${val.toFixed(2)}`;
}

// Note: props are `any`-typed here to stay compatible with Recharts' internal Tooltip payload shape.
const CustomTooltip = ({
  active,
  payload,
  label,
  color,
  isVolume,
}: any) => {
  if (!active || !payload?.length || payload[0].value == null) return null;
  const val = Number(payload[0].value);
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.98)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(15,23,42,0.08)",
        borderRadius: 12,
        padding: "10px 14px",
        boxShadow: "0 18px 45px rgba(15,23,42,0.12)",
      }}
    >
      <div
        style={{
          fontSize: 10,
          color: "rgba(15,23,42,0.6)",
          letterSpacing: "0.10em",
          textTransform: "uppercase",
          fontFamily: "'SF Mono', 'DM Mono', monospace",
          marginBottom: 5,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 18,
          fontWeight: 650,
          letterSpacing: "-0.04em",
          color: color,
          fontFamily: "'DM Sans', system-ui, sans-serif",
        }}
      >
        {formatValue(val, isVolume)}
      </div>
    </div>
  );
};

function StatPill({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        padding: "7px 12px",
        borderRadius: 10,
        background: "rgba(255,255,255,0.055)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <span
        style={{
          fontSize: 9.5,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "rgba(15,23,42,0.55)",
          fontFamily: "'SF Mono', 'DM Mono', monospace",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 13.5,
          fontWeight: 650,
          letterSpacing: "-0.03em",
          color: color,
          fontFamily: "'DM Sans', system-ui, sans-serif",
        }}
      >
        {value}
      </span>
    </div>
  );
}

export function StockCharts({ data, stockName }: Props) {
  const [activeMetric, setActiveMetric] = useState<MetricKey | null>(null);

  if (!data || data.length === 0) return null;

  const closeValues = data.map((d) => d.Close).filter(Boolean);
  const firstClose = closeValues[0];
  const lastClose = closeValues[closeValues.length - 1];
  const change = lastClose - firstClose;
  const changePct = ((change / firstClose) * 100).toFixed(2);
  const isUp = change >= 0;

  return (
    <section
      style={{
        width: "100%",
        borderRadius: 24,
        background: "linear-gradient(160deg, #ffffff 0%, #f9fafb 55%, #eef2ff 100%)",
        border: "1px solid rgba(15,23,42,0.08)",
        boxShadow:
          "0 0 0 0.5px rgba(15,23,42,0.04), 0 36px 80px rgba(15,23,42,0.16)",
        overflow: "hidden",
        fontFamily: "'DM Sans', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          padding: "28px 28px 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div
            style={{
              fontSize: 10,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(15,23,42,0.45)",
              fontFamily: "'SF Mono', 'DM Mono', monospace",
            }}
          >
            Price & Volume
          </div>
          <h2
            style={{
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: "-0.05em",
              color: "rgba(15,23,42,0.98)",
              margin: 0,
            }}
          >
            {stockName ?? "Selected Stock"}
          </h2>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
            <span
              style={{
                fontSize: 22,
                fontWeight: 650,
                letterSpacing: "-0.04em",
                color: "rgba(15,23,42,0.96)",
              }}
            >
              {lastClose ? `$${lastClose.toFixed(2)}` : "—"}
            </span>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                padding: "3px 9px",
                borderRadius: 999,
                background: isUp
                  ? "rgba(5,150,105,0.18)"
                  : "rgba(220,38,38,0.18)",
                color: isUp ? "#34d399" : "#f87171",
                border: `1px solid ${isUp ? "rgba(52,211,153,0.22)" : "rgba(248,113,113,0.22)"}`,
                letterSpacing: "-0.01em",
              }}
            >
              {isUp ? "▲" : "▼"} {Math.abs(Number(changePct))}%
            </span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
          {data.length > 0 && (
            <>
              <StatPill
                label="Points"
                value={data.length.toLocaleString()}
                color="rgba(15,23,42,0.85)"
              />
              <StatPill
                label="Period start"
                value={data[0].Date?.slice(0, 7) ?? "—"}
                color="rgba(15,23,42,0.85)"
              />
              <StatPill
                label="Period end"
                value={data[data.length - 1].Date?.slice(0, 7) ?? "—"}
                color="rgba(15,23,42,0.85)"
              />
            </>
          )}
        </div>
      </div>

      {/* ── Metric selector pills ── */}
      <div
        style={{
          display: "flex",
          gap: 6,
          padding: "20px 28px 0",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => setActiveMetric(null)}
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "-0.01em",
            padding: "5px 13px",
            borderRadius: 999,
            border: activeMetric === null
              ? "1px solid rgba(15,23,42,0.35)"
              : "1px solid rgba(148,163,184,0.8)",
            background: activeMetric === null
              ? "rgba(59,130,246,0.08)"
              : "rgba(255,255,255,0.9)",
            color: activeMetric === null
              ? "rgba(15,23,42,0.98)"
              : "rgba(15,23,42,0.7)",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          All
        </button>
        {METRICS.map((m) => (
          <button
            key={m.key}
            onClick={() => setActiveMetric(activeMetric === m.key ? null : m.key)}
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "-0.01em",
              padding: "5px 13px",
              borderRadius: 999,
              border: activeMetric === m.key
                ? `1px solid ${m.color}88`
                : "1px solid rgba(148,163,184,0.8)",
              background: activeMetric === m.key
                ? `${m.color}20`
                : "rgba(255,255,255,0.9)",
              color: activeMetric === m.key ? m.color : "rgba(15,23,42,0.7)",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* ── Charts ── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          padding: "16px 16px 20px",
        }}
      >
        {METRICS.filter((m) => !activeMetric || m.key === activeMetric).map((metric, i) => {
          const gradId = `grad-${metric.key.replace(" ", "-")}`;
          const isVolume = metric.key === "Volume";
          const vals = data.map((d) => d[metric.key] as number).filter(Boolean);
          const minVal = Math.min(...vals);
          const maxVal = Math.max(...vals);

          return (
            <div
              key={metric.key}
              style={{
                borderRadius: 18,
                background: "rgba(255,255,255,0.96)",
                border: "1px solid rgba(148,163,184,0.4)",
                padding: "16px 16px 10px",
                transition: "background 0.2s ease",
              }}
            >
              {/* Chart header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 12,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: metric.color,
                      boxShadow: `0 0 8px ${metric.color}88`,
                    }}
                  />
                  <div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 650,
                        letterSpacing: "-0.03em",
                        color: "rgba(15,23,42,0.95)",
                      }}
                    >
                      {metric.label}
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "rgba(100,116,139,0.9)",
                        letterSpacing: "0.04em",
                        marginTop: 1,
                      }}
                    >
                      {metric.sublabel}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontSize: 9.5,
                        color: "rgba(100,116,139,0.9)",
                        letterSpacing: "0.10em",
                        textTransform: "uppercase",
                        fontFamily: "'SF Mono', 'DM Mono', monospace",
                      }}
                    >
                      range
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: metric.color,
                        letterSpacing: "-0.02em",
                        fontFamily: "'SF Mono', 'DM Mono', monospace",
                        opacity: 0.85,
                      }}
                    >
                      {isVolume
                        ? `${formatValue(minVal, true)} – ${formatValue(maxVal, true)}`
                        : `$${minVal.toFixed(2)} – $${maxVal.toFixed(2)}`}
                    </div>
                  </div>
                </div>
              </div>

              {/* Chart */}
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  {isVolume ? (
                    <LineChart data={data} margin={{ top: 2, right: 4, left: 0, bottom: 2 }}>
                      <CartesianGrid
                        strokeDasharray="2 6"
                        stroke="rgba(148,163,184,0.35)"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="Date"
                        tickFormatter={formatDateTick}
                        tick={{ fontSize: 9, fill: "rgba(15,23,42,0.7)", fontFamily: "'SF Mono','DM Mono',monospace" }}
                        axisLine={false}
                        tickLine={false}
                        minTickGap={28}
                      />
                      <YAxis
                        tickFormatter={(v) => formatValue(v, true)}
                        tick={{ fontSize: 9, fill: "rgba(15,23,42,0.7)", fontFamily: "'SF Mono','DM Mono',monospace" }}
                        axisLine={false}
                        tickLine={false}
                        width={48}
                      />
                      <Tooltip
                        content={(props) => (
                          <CustomTooltip
                            {...props}
                            color={metric.color}
                            isVolume={isVolume}
                          />
                        )}
                        cursor={{
                          stroke: "rgba(148,163,184,0.9)",
                          strokeWidth: 1,
                          strokeDasharray: "4 4",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey={metric.key}
                        stroke={metric.color}
                        strokeWidth={1.75}
                        dot={false}
                        activeDot={false}
                      />
                    </LineChart>
                  ) : (
                    <AreaChart data={data} margin={{ top: 2, right: 4, left: 0, bottom: 2 }}>
                      <defs>
                        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={metric.color} stopOpacity={0.22} />
                          <stop offset="100%" stopColor={metric.color} stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="2 6"
                        stroke="rgba(148,163,184,0.35)"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="Date"
                        tickFormatter={formatDateTick}
                        tick={{ fontSize: 9, fill: "rgba(15,23,42,0.7)", fontFamily: "'SF Mono','DM Mono',monospace" }}
                        axisLine={false}
                        tickLine={false}
                        minTickGap={28}
                      />
                      <YAxis
                        tickFormatter={(v) => `$${v.toFixed(0)}`}
                        tick={{ fontSize: 9, fill: "rgba(15,23,42,0.7)", fontFamily: "'SF Mono','DM Mono',monospace" }}
                        axisLine={false}
                        tickLine={false}
                        width={44}
                        domain={["auto", "auto"]}
                      />
                      <Tooltip
                        content={(props) => (
                          <CustomTooltip
                            {...props}
                            color={metric.color}
                            isVolume={false}
                          />
                        )}
                        cursor={{
                          stroke: "rgba(148,163,184,0.9)",
                          strokeWidth: 1,
                          strokeDasharray: "4 4",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey={metric.key}
                        stroke={metric.color}
                        strokeWidth={1.75}
                        fill={`url(#${gradId})`}
                        dot={false}
                        activeDot={{
                          r: 4,
                          fill: metric.color,
                          stroke: "rgba(255,255,255,0.98)",
                          strokeWidth: 2,
                        }}
                      />
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Footer ── */}
      <div
        style={{
          borderTop: "1px solid rgba(148,163,184,0.35)",
          padding: "12px 28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: 10,
            color: "rgba(100,116,139,0.95)",
            letterSpacing: "0.08em",
            fontFamily: "'SF Mono', 'DM Mono', monospace",
          }}
        >
          Historical data · {data.length} data points
        </span>
        <div style={{ display: "flex", gap: 16 }}>
          {METRICS.filter((m) => m.key !== "Volume").map((m) => (
            <div
              key={m.key}
              style={{ display: "flex", alignItems: "center", gap: 5, opacity: 0.55 }}
            >
              <div
                style={{
                  width: 16,
                  height: 2,
                  borderRadius: 999,
                  background: m.color,
                }}
              />
              <span
                style={{
                  fontSize: 9.5,
                  color: "rgba(100,116,139,0.95)",
                  fontFamily: "'SF Mono', 'DM Mono', monospace",
                  letterSpacing: "0.06em",
                }}
              >
                {m.key === "Adjusted Close" ? "Adj.C" : m.key}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}