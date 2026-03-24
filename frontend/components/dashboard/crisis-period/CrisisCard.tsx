"use client";
import { motion } from "framer-motion";
import { themes, sparklines, type ThemeKey } from "./types";
import { DotComIcon, FinancialIcon, CovidIcon } from "./icons";
import { RadioDot } from "./RadioDot";

const iconMap = { dotcom: DotComIcon, financial: FinancialIcon, covid: CovidIcon };

export function CrisisCard({ variant, selected, dimmed, onClick }: { variant: ThemeKey; selected: boolean; dimmed: boolean; onClick: () => void }) {
  const theme = themes[variant];
  const Icon = iconMap[variant];

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
        background: selected ? `rgba(${theme.accentRgb}, 0.07)` : "rgba(255,255,255,0.6)",
        border: selected ? `1.5px solid rgba(${theme.accentRgb}, 0.28)` : "1.5px solid rgba(0,0,0,0.08)",
        backdropFilter: "blur(32px) saturate(200%)",
        WebkitBackdropFilter: "blur(32px) saturate(200%)",
        boxShadow: selected
          ? `0 0 0 4px rgba(${theme.accentRgb}, 0.08), 0 8px 30px rgba(${theme.accentRgb}, 0.1), 0 2px 8px rgba(0,0,0,0.05)`
          : "0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
        userSelect: "none",
        textAlign: "left",
        padding: 0,
        transition: "background 0.25s ease, border 0.25s ease, box-shadow 0.25s ease",
      }}
    >
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 1,
        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.9) 30%, rgba(255,255,255,0.9) 70%, transparent)",
        zIndex: 2, pointerEvents: "none",
      }} />

      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 100,
        opacity: selected ? 0.18 : 0.07,
        transition: "opacity 0.3s ease",
        pointerEvents: "none", overflow: "hidden",
      }}>
        <svg width="100%" height="100" viewBox="0 0 104 80" preserveAspectRatio="none">
          <path d={sparklines[variant]} stroke={theme.accent} strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      </div>

      <div style={{ padding: "22px 24px 24px", display: "flex", flexDirection: "column", gap: 14, position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: selected ? `rgba(${theme.accentRgb}, 0.12)` : "rgba(0,0,0,0.05)",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background 0.25s ease",
          }}>
            <Icon color={selected ? theme.accent : "rgba(0,0,0,0.4)"} size={21} />
          </div>
          <RadioDot selected={selected} accent={theme.accent} accentRgb={theme.accentRgb} />
        </div>

        <span style={{
          fontSize: 13, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase",
          color: selected ? theme.accent : "rgba(0,0,0,0.3)",
          fontFamily: "-apple-system, 'SF Pro Text', BlinkMacSystemFont, sans-serif",
          transition: "color 0.25s ease",
        }}>{theme.sublabel}</span>

        <div style={{
          fontSize: 17.5, fontWeight: 600, letterSpacing: "-0.022em",
          color: selected ? "rgba(0,0,0,0.9)" : "rgba(0,0,0,0.72)",
          fontFamily: "-apple-system, 'SF Pro Display', BlinkMacSystemFont, sans-serif",
          lineHeight: 1.25, marginTop: -4,
          transition: "color 0.2s ease",
        }}>{theme.label}</div>
      </div>

      <motion.div
        animate={{ scaleX: selected ? 1 : 0, opacity: selected ? 1 : 0 }}
        initial={{ scaleX: 0, opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
        style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4, background: theme.accent, transformOrigin: "left" }}
      />
    </motion.button>
  );
}
