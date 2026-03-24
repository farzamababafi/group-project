"use client";
import React from "react";
import { AnimatePresence } from "framer-motion";
import { type PeriodKey } from "./types";
import { CrisisCard } from "./CrisisCard";
import { CustomCard } from "./CustomCard";
import { DetailPanel, CustomDatePanel } from "./DetailPanel";

export function CrisisButtonGroup({
  className = "",
  selectedPeriod = null,
  onSelectPeriod,
  onCustomDates,
}: {
  className?: string;
  selectedPeriod?: PeriodKey | null;
  onSelectPeriod?: (period: PeriodKey | null) => void;
  onCustomDates?: (dates: { start_date: string; end_date: string } | null) => void;
}) {
  const [internalSelected, setInternalSelected] = React.useState<PeriodKey | null>(null);
  const [customStart, setCustomStart] = React.useState("");
  const [customEnd, setCustomEnd] = React.useState("");

  const isControlled = onSelectPeriod != null;
  const selected = isControlled ? selectedPeriod ?? null : internalSelected;
  const setSelected = isControlled
    ? (v: PeriodKey | null) => onSelectPeriod?.(v)
    : setInternalSelected;

  const MIN_DATE = "1970-01-01";
  const MAX_DATE = "2022-12-31";

  React.useEffect(() => {
    const valid =
      customStart && customEnd &&
      customStart < customEnd &&
      customStart >= MIN_DATE && customStart <= MAX_DATE &&
      customEnd >= MIN_DATE && customEnd <= MAX_DATE;
    onCustomDates?.(valid ? { start_date: customStart, end_date: customEnd } : null);
  }, [customStart, customEnd]);

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
        <CustomCard
          selected={selected === "custom"}
          dimmed={selected !== null && selected !== "custom"}
          onClick={() => {
            if (selected === "custom") { setSelected(null); onCustomDates?.(null); }
            else setSelected("custom");
          }}
          startDate={customStart || undefined}
          endDate={customEnd || undefined}
        />
      </div>

      <AnimatePresence mode="wait">
        {selected && selected !== "custom" && <DetailPanel key={selected} variant={selected} />}
        {selected === "custom" && (
          <CustomDatePanel key="custom" start={customStart} end={customEnd} onStartChange={setCustomStart} onEndChange={setCustomEnd} />
        )}
      </AnimatePresence>
    </div>
  );
}
