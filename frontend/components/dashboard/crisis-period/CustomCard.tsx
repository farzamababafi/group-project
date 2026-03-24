"use client";
import { motion } from "framer-motion";
import { CUSTOM_ACCENT, CUSTOM_ACCENT_RGB } from "./types";
import { CalendarIcon } from "./icons";
import { RadioDot } from "./RadioDot";

function formatDate(iso: string) {
  const [year, month, day] = iso.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[parseInt(month) - 1]} ${parseInt(day)}, ${year}`;
}

export function CustomCard({ selected, dimmed, onClick, startDate, endDate }: { selected: boolean; dimmed: boolean; onClick: () => void; startDate?: string; endDate?: string }) {
  const hasDates = startDate && endDate;
  return (
    <motion.button
      onClick={onClick}
      animate={{
        opacity: dimmed ? 0.4 : 1,
        scale: dimmed ? 0.98 : 1,
        filter: dimmed ? "saturate(0.3)" : "saturate(1)",
      }}
      whileTap={{ scale: selected ? 0.974 : 0.97 }}
      transition={{ duration: 0.28, ease: [0.25, 1, 0.5, 1] }}
      style={{
        all: "unset",
        position: "relative",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minWidth: 0,
        borderRadius: 26,
        overflow: "hidden",
        background: selected ? `rgba(${CUSTOM_ACCENT_RGB}, 0.07)` : "rgba(255,255,255,0.6)",
        border: selected ? `1.5px solid rgba(${CUSTOM_ACCENT_RGB}, 0.28)` : "1.5px solid rgba(0,0,0,0.08)",
        backdropFilter: "blur(32px) saturate(200%)",
        WebkitBackdropFilter: "blur(32px) saturate(200%)",
        boxShadow: selected
          ? `0 0 0 4px rgba(${CUSTOM_ACCENT_RGB}, 0.08), 0 8px 30px rgba(${CUSTOM_ACCENT_RGB}, 0.1), 0 2px 8px rgba(0,0,0,0.05)`
          : "0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
        userSelect: "none",
        textAlign: "left",
        padding: 0,
        transition: "background 0.25s ease, border 0.25s ease, box-shadow 0.25s ease",
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.9) 30%, rgba(255,255,255,0.9) 70%, transparent)", zIndex: 2, pointerEvents: "none" }} />

      <div style={{ padding: "22px 24px 24px", display: "flex", flexDirection: "column", gap: 14, position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: selected ? `rgba(${CUSTOM_ACCENT_RGB}, 0.12)` : "rgba(0,0,0,0.05)",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background 0.25s ease",
          }}>
            <CalendarIcon color={selected ? CUSTOM_ACCENT : "rgba(0,0,0,0.4)"} size={21} />
          </div>
          <RadioDot selected={selected} accent={CUSTOM_ACCENT} accentRgb={CUSTOM_ACCENT_RGB} />
        </div>

        <span style={{
          fontSize: 13, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase",
          color: selected ? CUSTOM_ACCENT : "rgba(0,0,0,0.3)",
          fontFamily: "-apple-system, 'SF Pro Text', BlinkMacSystemFont, sans-serif",
          transition: "color 0.25s ease",
        }}>{ hasDates ? `${formatDate(startDate!)} – ${formatDate(endDate!)}` : "Custom" }</span>

        <div style={{
          fontSize: 17.5, fontWeight: 600, letterSpacing: "-0.022em",
          color: selected ? "rgba(0,0,0,0.9)" : "rgba(0,0,0,0.72)",
          fontFamily: "-apple-system, 'SF Pro Display', BlinkMacSystemFont, sans-serif",
          lineHeight: 1.25, marginTop: -4,
          transition: "color 0.2s ease",
        }}>Custom Range</div>
      </div>

      <motion.div
        animate={{ scaleX: selected ? 1 : 0, opacity: selected ? 1 : 0 }}
        initial={{ scaleX: 0, opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
        style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4, background: CUSTOM_ACCENT, transformOrigin: "left" }}
      />
    </motion.button>
  );
}
