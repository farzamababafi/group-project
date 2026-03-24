"use client";

import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { pdf } from "@react-pdf/renderer";
import { StockReport } from "./StockReport";
import { PdfChartsContainer, PDF_CHART_CONFIGS } from "./PdfChartsContainer";
import type { StockMetrics, StockTimePoint } from "@/lib/types";

interface ExportButtonProps {
  ticker: string;
  period: string;
  startDate: string;
  endDate: string;
  metrics: StockMetrics | null;
  recommendationText: string;
  data: StockTimePoint[];
  accentColor: string;
}

/** Serialize the largest SVG inside a container to a PNG data URL. */
async function svgToPng(container: HTMLElement): Promise<string | null> {
  const svgEls = Array.from(container.querySelectorAll("svg"));
  if (!svgEls.length) return null;

  // Use the SVG with the largest area
  const svg = svgEls.reduce((a, b) => {
    const ra = a.getBoundingClientRect();
    const rb = b.getBoundingClientRect();
    return ra.width * ra.height >= rb.width * rb.height ? a : b;
  });

  const rect = svg.getBoundingClientRect();
  const width = rect.width || Number(svg.getAttribute("width")) || 740;
  const height = rect.height || Number(svg.getAttribute("height")) || 240;

  // Clone as-is — Recharts uses SVG presentation attributes (fill, stroke, etc.)
  // so no need to inline computed styles. Just ensure explicit dimensions.
  const clone = svg.cloneNode(true) as SVGElement;
  clone.setAttribute("width", String(width));
  clone.setAttribute("height", String(height));
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");

  let svgStr = new XMLSerializer().serializeToString(clone);
  // Strip any modern CSS color functions that the SVG renderer may not handle
  svgStr = svgStr
    .replace(/oklch\([^)]+\)/g, "#888")
    .replace(/\blab\([^)]+\)/g, "#888")
    .replace(/\blch\([^)]+\)/g, "#888");

  const blob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = 2;
      const canvas = document.createElement("canvas");
      canvas.width = width * scale;
      canvas.height = height * scale;
      const ctx = canvas.getContext("2d")!;
      ctx.scale(scale, scale);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(null); };
    img.src = url;
  });
}

/** Render all charts off-screen and capture each as a PNG. */
async function captureAllCharts(
  data: StockTimePoint[]
): Promise<{ label: string; url: string }[]> {
  const host = document.createElement("div");
  // opacity:0 keeps the element painted (so Recharts SVGs render fully)
  // but invisible to the user. visibility:hidden skips painting in some browsers.
  host.style.cssText =
    "position:fixed;top:-9999px;left:-9999px;width:760px;pointer-events:none;opacity:0";
  document.body.appendChild(host);

  const root = ReactDOM.createRoot(host);
  root.render(<PdfChartsContainer data={data} />);

  // Wait for Recharts to finish rendering all 7 charts (animations are disabled
  // in PdfChartsContainer, so one React render pass is enough, but we give a
  // small buffer for layout to settle).
  await new Promise((r) => setTimeout(r, 200));

  const chartDivs = Array.from(
    host.querySelectorAll<HTMLElement>("[data-pdf-chart]")
  );

  const images: { label: string; url: string }[] = [];
  for (const div of chartDivs) {
    const key = div.getAttribute("data-pdf-chart") ?? "";
    const cfg = PDF_CHART_CONFIGS.find((c) => String(c.key) === key);
    const url = await svgToPng(div);
    if (url && cfg) images.push({ label: cfg.label, url });
  }

  root.unmount();
  document.body.removeChild(host);
  return images;
}

export function ExportButton({
  ticker,
  period,
  startDate,
  endDate,
  metrics,
  recommendationText,
  data,
  accentColor,
}: ExportButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    setLoading(true);
    try {
      const chartImages = await captureAllCharts(data);

      const generatedAt = new Date().toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      const doc = (
        <StockReport
          ticker={ticker}
          period={period}
          startDate={startDate}
          endDate={endDate}
          metrics={metrics}
          chartImages={chartImages}
          recommendationText={recommendationText}
          generatedAt={generatedAt}
        />
      );

      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${ticker}_${startDate}_${endDate}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={loading}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        padding: "9px 16px",
        borderRadius: 10,
        fontSize: 13,
        fontWeight: 600,
        fontFamily: "'DM Sans', sans-serif",
        cursor: loading ? "default" : "pointer",
        background: loading ? "rgba(0,0,0,0.05)" : `${accentColor}18`,
        color: loading ? "rgba(0,0,0,0.35)" : accentColor,
        border: `1px solid ${accentColor}40`,
        transition: "background 0.15s ease, color 0.15s ease",
      }}
    >
      {loading ? (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"
            style={{ animation: "spin 0.8s linear infinite" }}>
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          Generating PDF…
        </>
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Export PDF
        </>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </button>
  );
}
