"use client";
import React from "react";
import { AnimatePresence } from "framer-motion";
import { CrisisCard, ThemeKey } from "./time-cards/CrisisCard";
import { DetailPanel } from "./time-cards/DetailPanel";

export function CrisisButtonGroup({
  className = "",
  selectedPeriod = null,
  onSelectPeriod,
}: {
  className?: string;
  selectedPeriod?: ThemeKey | null;
  onSelectPeriod?: (period: ThemeKey | null) => void;
}) {
  const [internalSelected, setInternalSelected] = React.useState<ThemeKey | null>(null);
  const isControlled = onSelectPeriod != null;
  const selected = isControlled ? selectedPeriod ?? null : internalSelected;
  const setSelected = isControlled
    ? (v: ThemeKey | null) => onSelectPeriod?.(v)
    : setInternalSelected;

  return (
    <div className={className} style={{
      display: "flex", flexDirection: "column", gap: 10,
      width: "100%", maxWidth: 1280,
      fontFamily: "-apple-system, 'SF Pro Display', BlinkMacSystemFont, sans-serif",
    }}>
      <div style={{ paddingBottom: 6 }}>
        <div style={{ fontSize: 19, fontWeight: 600, letterSpacing: "-0.02em", color: "#1a1a1a", lineHeight: 1.3 }}>
          Crisis periods
        </div>
        <div style={{ fontSize: 15, color: "rgba(0,0,0,0.5)", marginTop: 4, fontWeight: 400, lineHeight: 1.4 }}>
          Pick a period, then choose a stock to compare metrics
        </div>
      </div>

      <div style={{ display: "flex", gap: 20 }}>
        {(["dotcom", "financial", "covid"] as const).map((v) => (
          <CrisisCard
            key={v}
            variant={v}
            selected={selected === v}
            dimmed={selected !== null && selected !== v}
            onClick={() => setSelected(selected === v ? null : v)}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {selected && <DetailPanel key={selected} variant={selected} />}
      </AnimatePresence>
    </div>
  );
}
