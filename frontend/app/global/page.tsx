"use client";

import { useState, useEffect } from "react";
import { CrisisButtonGroup } from "@/components/dashboard/CrisisSelector";
import { SectorSelector, type SectorKey } from "@/components/global/SectorSelector";
import { StockCharts } from "@/components/dashboard/StockCharts";
import { getPerYear } from "@/lib/stockApi";
import { AppleAlert } from "@/components/ui/AppleAlert";
import type { CrisisPeriodKey, StockTimePoint } from "@/lib/types";

const SECTOR_LABELS: Record<SectorKey, string> = {
  health_care:            "Health Care",
  information_technology: "Information Technology",
  industrials:            "Industrials",
  financials:             "Financials",
  consumer_discretionary: "Consumer Discretionary",
  real_estate:            "Real Estate",
  utilities:              "Utilities",
  consumer_staples:       "Consumer Staples",
  materials:              "Materials",
  communication_services: "Communication Services",
  energy:                 "Energy",
};

export default function GlobalPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<CrisisPeriodKey | null>(null);
  const [, setCustomDates] = useState<{ start_date: string; end_date: string } | null>(null);
  const [selectedSector, setSelectedSector] = useState<SectorKey | null>(null);
  const [apiData, setApiData] = useState<Record<string, StockTimePoint[]> | null>(null);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    getPerYear()
      .then((data) => { setApiData(data); setFetchError(false); })
      .catch(() => { setFetchError(true); });
  }, []);

  const chartData = selectedSector && apiData
    ? (apiData[SECTOR_LABELS[selectedSector]] ?? null)
    : null;

  return (
    <main className="min-h-screen flex flex-col items-center px-8 gap-6">
      {/* ── Top bar ── */}
      <div
        className="w-full sticky top-0 z-10 py-4 flex items-center gap-3"
        style={{
          borderBottom: "1px solid rgba(0,0,0,0.05)",
          background: "rgba(247,247,247,0.85)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          marginLeft: "-2rem",
          marginRight: "-2rem",
          paddingLeft: "2rem",
          paddingRight: "2rem",
          width: "calc(100% + 4rem)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
          <span style={{ fontSize: "11px", fontFamily: "'DM Mono', monospace", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(0,0,0,0.28)" }}>
            Dashboard
          </span>
          <h2 style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "-0.03em", color: "rgba(0,0,0,0.82)", lineHeight: 1, fontFamily: "'DM Sans', sans-serif" }}>
            Global
          </h2>
        </div>
      </div>

      {/* ── Fetch error ── */}
      {fetchError && (
        <div className="w-full max-w-7xl">
          <AppleAlert
            title="Failed to load sector data."
            message="Could not reach the server. Please check the backend is running and try again."
          />
        </div>
      )}

      {/* ── Crisis period selector ── */}
      <div className="w-full max-w-9xl flex flex-col items-center gap-4">
        <CrisisButtonGroup
          selectedPeriod={selectedPeriod}
          onSelectPeriod={(p) => setSelectedPeriod(p)}
          onCustomDates={setCustomDates}
        />
      </div>

      {/* ── Sector selector ── */}
      <div className="w-full max-w-9xl flex flex-col items-center gap-4">
        <SectorSelector
          selectedSector={selectedSector}
          onSelectSector={setSelectedSector}
        />
      </div>

      {/* ── Charts ── */}
      {chartData && chartData.length > 0 && (
        <div className="w-full max-w-7xl pb-10">
          <StockCharts data={chartData} stockName={SECTOR_LABELS[selectedSector!]} yearOnly />
        </div>
      )}
    </main>
  );
}
