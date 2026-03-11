"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

// ─── Mock line data generators ────────────────────────────────────────────────

function makeLine(base: number, volatility: number, points = 12) {
  let v = base;
  return Array.from({ length: points }, (_, i) => {
    v = v + (Math.random() - 0.48) * volatility;
    return {
      m: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
      v: parseFloat(v.toFixed(2)),
    };
  });
}

// ─── Section definitions ──────────────────────────────────────────────────────

type ChartDef = { id: string; title: string; sub: string; data: { m: string; v: number }[] };

type SectionDef = {
  metric: { label: string; value: string; change: number; caption: string };
  charts: ChartDef[];
};

const SECTIONS: Record<string, SectionDef> = {
  basic: {
    metric: {
      label: "Current Price",
      value: "$189.42",
      change: 1.24,
      caption: "AAPL · NASDAQ · Live",
    },
    charts: [
      { id: "price",    title: "Price History",      sub: "12-month · USD",         data: makeLine(180, 8)    },
      { id: "volume",   title: "Trading Volume",     sub: "Avg daily · M shares",   data: makeLine(62, 12)    },
      { id: "mktcap",   title: "Market Cap",         sub: "Trillion USD",           data: makeLine(2.9, 0.15) },
      { id: "eps",      title: "Earnings Per Share", sub: "Quarterly · USD",        data: makeLine(6.1, 0.4)  },
      { id: "revenue",  title: "Revenue",            sub: "Quarterly · $B",         data: makeLine(94, 6)     },
      { id: "divyield", title: "Dividend Yield",     sub: "Annual · %",             data: makeLine(0.52, 0.04)},
    ],
  },
  featured: {
    metric: {
      label: "P/E Ratio",
      value: "29.4×",
      change: -0.88,
      caption: "vs S&P avg 22.1× · Premium",
    },
    charts: [
      { id: "pe",       title: "P/E Ratio Trend",     sub: "Trailing 12M",           data: makeLine(28, 2)     },
      { id: "rsi",      title: "RSI Momentum",        sub: "14-day · Overbought >70", data: makeLine(54, 8)    },
      { id: "52wk",     title: "52-Week Range",       sub: "Price vs High/Low",      data: makeLine(172, 10)   },
      { id: "beta",     title: "Beta Coefficient",    sub: "vs S&P 500",             data: makeLine(1.18, 0.06)},
      { id: "shortint", title: "Short Interest",      sub: "% of float",             data: makeLine(0.8, 0.1)  },
      { id: "insthold", title: "Institutional Hold",  sub: "% ownership",            data: makeLine(58, 1.5)   },
    ],
  },
};

// ─── Color palette (Apple-aligned) ───────────────────────────────────────────

const PALETTE = [
  { line: "#0071e3", area: "rgba(0,113,227,0.08)", areaDark: "rgba(0,113,227,0.01)" },
  { line: "#30d158", area: "rgba(48,209,88,0.08)",  areaDark: "rgba(48,209,88,0.01)"  },
  { line: "#ff9f0a", area: "rgba(255,159,10,0.08)", areaDark: "rgba(255,159,10,0.01)" },
  { line: "#bf5af2", area: "rgba(191,90,242,0.08)", areaDark: "rgba(191,90,242,0.01)" },
  { line: "#ff375f", area: "rgba(255,55,95,0.08)",  areaDark: "rgba(255,55,95,0.01)"  },
  { line: "#5ac8fa", area: "rgba(90,200,250,0.08)", areaDark: "rgba(90,200,250,0.01)" },
];

// ─── Line Chart Card ──────────────────────────────────────────────────────────

function LineCard({ chart, colorIdx }: { chart: ChartDef; colorIdx: number }) {
  const pal = PALETTE[colorIdx % PALETTE.length];
  const config: ChartConfig = {
    v: { label: chart.title, color: pal.line },
  };

  const first = chart.data[0]?.v ?? 0;
  const last  = chart.data[chart.data.length - 1]?.v ?? 0;
  const delta = ((last - first) / first) * 100;
  const isUp  = delta >= 0;
  const gradId = `grad-${chart.id}`;

  return (
    <motion.div
      style={{
        borderRadius: "16px",
        background: "rgba(255,255,255,0.78)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        boxShadow:
          "0 0 0 0.5px rgba(0,0,0,0.09), 0 2px 10px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.95)",
        padding: "14px 14px 8px",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        overflow: "hidden",
      }}
      whileHover={{ scale: 1.02, boxShadow: "0 0 0 0.5px rgba(0,0,0,0.12), 0 8px 28px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.95)" }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 0 0 0.5px rgba(0,0,0,0.12), 0 8px 28px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.95)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 0 0 0.5px rgba(0,0,0,0.09), 0 2px 10px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.95)";
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
          <span style={{
            fontSize: "12px",
            fontWeight: 590,
            fontFamily: "-apple-system, 'SF Pro Text', 'Helvetica Neue', sans-serif",
            color: "#1d1d1f",
            letterSpacing: "-0.018em",
          }}>
            {chart.title}
          </span>
          <span style={{
            fontSize: "10px",
            fontFamily: "-apple-system, 'SF Pro Text', sans-serif",
            color: "rgba(60,60,67,0.45)",
            letterSpacing: "-0.005em",
          }}>
            {chart.sub}
          </span>
        </div>

        {/* Delta pill — Apple green/red */}
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "3px",
          fontSize: "11px",
          fontWeight: 600,
          fontFamily: "-apple-system, 'SF Pro Text', sans-serif",
          color: isUp ? "#1c8a43" : "#c0392b",
          background: isUp ? "rgba(52,199,89,0.1)" : "rgba(255,59,48,0.09)",
          border: `0.5px solid ${isUp ? "rgba(52,199,89,0.22)" : "rgba(255,59,48,0.2)"}`,
          borderRadius: "7px",
          padding: "3px 7px",
          flexShrink: 0,
          letterSpacing: "-0.01em",
        }}>
          {isUp ? "▲" : "▼"} {isUp ? "+" : ""}{delta.toFixed(1)}%
        </span>
      </div>

      {/* Chart */}
      <ChartContainer config={config} className="h-[96px] w-full">
        <AreaChart data={chart.data} margin={{ top: 4, right: 4, left: -30, bottom: 0 }}>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={pal.line} stopOpacity={0.18} />
              <stop offset="100%" stopColor={pal.line} stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            vertical={false}
            stroke="rgba(60,60,67,0.06)"
            strokeDasharray="0"
          />
          <XAxis
            dataKey="m"
            tick={{ fontSize: 8.5, fill: "rgba(60,60,67,0.3)", fontFamily: "-apple-system, SF Pro Text, sans-serif" }}
            axisLine={false}
            tickLine={false}
            interval={2}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(label) => (
                  <span style={{ fontFamily: "-apple-system, sans-serif" }}>
                    {String(label ?? "")} · 12-month
                  </span>
                )}
                formatter={(value, _name, _item, _index) =>
                  typeof value === "number" ? value.toFixed(2) : String(value ?? "")
                }
              />
            }
            cursor={{ stroke: "rgba(60,60,67,0.12)", strokeWidth: 1 }}
          />
          <Area
            dataKey="v"
            type="monotone"
            stroke={pal.line}
            strokeWidth={1.6}
            fill={`url(#${gradId})`}
            dot={false}
            activeDot={{ r: 3, fill: pal.line, strokeWidth: 0 }}
          />
        </AreaChart>
      </ChartContainer>
    </motion.div>
  );
}

// ─── Featured Metric Card ─────────────────────────────────────────────────────

function FeaturedMetric({ metric }: { metric: SectionDef["metric"] }) {
  const isUp = metric.change >= 0;

  return (
    <div
      style={{
        borderRadius: "16px",
        background: "rgba(255,255,255,0.82)",
        backdropFilter: "blur(28px) saturate(190%)",
        WebkitBackdropFilter: "blur(28px) saturate(190%)",
        boxShadow:
          "0 0 0 0.5px rgba(0,0,0,0.1), 0 2px 14px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.95)",
        padding: "18px 22px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "12px",
      }}
    >
      {/* Left */}
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        <span style={{
          fontSize: "10px",
          fontFamily: "-apple-system, 'SF Pro Text', sans-serif",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "rgba(60,60,67,0.4)",
          fontWeight: 500,
        }}>
          {metric.caption}
        </span>
        <span style={{
          fontSize: "13px",
          fontWeight: 500,
          fontFamily: "-apple-system, 'SF Pro Text', sans-serif",
          color: "rgba(60,60,67,0.6)",
          letterSpacing: "-0.015em",
        }}>
          {metric.label}
        </span>
      </div>

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <span style={{
          fontSize: "32px",
          fontWeight: 700,
          fontFamily: "-apple-system, 'SF Pro Display', sans-serif",
          letterSpacing: "-0.05em",
          color: "#1d1d1f",
        }}>
          {metric.value}
        </span>

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "5px",
          padding: "6px 13px",
          borderRadius: "10px",
          background: isUp ? "rgba(52,199,89,0.09)" : "rgba(255,59,48,0.09)",
          border: `0.5px solid ${isUp ? "rgba(52,199,89,0.22)" : "rgba(255,59,48,0.22)"}`,
        }}>
          {isUp
            ? <TrendingUp size={13} color="#1c8a43" strokeWidth={2.2} />
            : <TrendingDown size={13} color="#c0392b" strokeWidth={2.2} />
          }
          <span style={{
            fontSize: "13px",
            fontWeight: 600,
            fontFamily: "-apple-system, 'SF Pro Text', sans-serif",
            letterSpacing: "-0.015em",
            color: isUp ? "#1c8a43" : "#c0392b",
          }}>
            {isUp ? "+" : ""}{metric.change.toFixed(2)}%
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Section label ─────────────────────────────────────────────────────────────

function SectionLabel({ text }: { text: string }) {
  return (
    <div style={{
      fontSize: "11px",
      fontWeight: 500,
      fontFamily: "-apple-system, 'SF Pro Text', sans-serif",
      color: "rgba(60,60,67,0.4)",
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      padding: "0 2px",
      marginBottom: "8px",
    }}>
      {text}
    </div>
  );
}

// ─── MetricSection (exported) ─────────────────────────────────────────────────

export function MetricSection({
  sectionId,
  stockName = null,
}: {
  sectionId: string;
  stockName?: string | null;
}) {
  const section = SECTIONS[sectionId];
  if (!section) return null;

  const metric =
    sectionId === "basic" && stockName
      ? { ...section.metric, label: stockName }
      : section.metric;

  return (
    <div style={{ fontFamily: "-apple-system, 'SF Pro Text', 'Helvetica Neue', sans-serif" }}>
      
      

      <SectionLabel text="Performance Metrics" />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "10px",
        }}
      >
        {section.charts.map((chart, i) => (
          <LineCard key={chart.id} chart={chart} colorIdx={i} />
        ))}
      </div>
    </div>
  );
}