import { motion } from "framer-motion";
import { RadioDot } from "./RadioDot";
import { DotComIcon } from "./DotComIcon";
import { FinancialIcon } from "./FinancialIcon";
import { CovidIcon } from "./CovidIcon";

export type ThemeKey = "dotcom" | "financial" | "covid";

const themes = {
  dotcom: {
    label: "Dot-Com Crash",
    sublabel: "2000–2002",
    description: "End of the late-1990s internet boom; many unprofitable tech companies failed or were acquired.",
    accent: "#9333ea",
    accentRgb: "147,51,234",
    Icon: DotComIcon,
  },
  financial: {
    label: "Financial Crisis",
    sublabel: "2007–2009",
    description: "Lehman collapse and credit freeze triggered a global selloff and deep recession.",
    accent: "#c2410c",
    accentRgb: "194,65,12",
    Icon: FinancialIcon,
  },
  covid: {
    label: "COVID-19 Crash",
    sublabel: "Mar 2020",
    description: "Sharp V-shaped selloff and recovery as pandemic lockdowns and stimulus reshaped markets.",
    accent: "#059669",
    accentRgb: "5,150,105",
    Icon: CovidIcon,
  },
};

const sparklines = {
  dotcom: "M0,40 L8,36 L16,28 L24,22 L32,30 L40,18 L48,10 L56,14 L64,8 L72,16 L80,32 L88,38 L96,42 L104,44",
  financial: "M0,20 L12,18 L24,16 L36,14 L48,24 L56,40 L60,52 L64,60 L68,56 L76,50 L88,44 L100,40 L104,38",
  covid: "M0,30 L16,28 L32,26 L44,24 L52,50 L56,62 L60,50 L68,38 L80,28 L92,20 L104,14",
};

export function CrisisCard({ variant, selected, dimmed, onClick }: { variant: ThemeKey; selected: boolean; dimmed: boolean; onClick: () => void }) {
  const theme = themes[variant];
  const { Icon } = theme;

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
        background: selected
          ? `rgba(${theme.accentRgb}, 0.07)`
          : "rgba(255,255,255,0.6)",
        border: selected
          ? `1.5px solid rgba(${theme.accentRgb}, 0.28)`
          : "1.5px solid rgba(0,0,0,0.08)",
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
      {/* Top inset gloss */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 1,
        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.9) 30%, rgba(255,255,255,0.9) 70%, transparent)",
        zIndex: 2, pointerEvents: "none",
      }} />

      {/* Sparkline */}
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

      {/* Content */}
      <div style={{ padding: "22px 24px 24px", display: "flex", flexDirection: "column", gap: 14, position: "relative", zIndex: 1 }}>
        {/* Icon row + Radio (always visible) */}
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

        {/* Year */}
        <span style={{
          fontSize: 13, fontWeight: 600, letterSpacing: "0.07em",
          textTransform: "uppercase",
          color: selected ? theme.accent : "rgba(0,0,0,0.3)",
          fontFamily: "-apple-system, 'SF Pro Text', BlinkMacSystemFont, sans-serif",
          transition: "color 0.25s ease",
        }}>{theme.sublabel}</span>

        {/* Name */}
        <div style={{
          fontSize: 17.5, fontWeight: 600, letterSpacing: "-0.022em",
          color: selected ? "rgba(0,0,0,0.9)" : "rgba(0,0,0,0.72)",
          fontFamily: "-apple-system, 'SF Pro Display', BlinkMacSystemFont, sans-serif",
          lineHeight: 1.25, marginTop: -4,
          transition: "color 0.2s ease",
        }}>{theme.label}</div>
      </div>

      {/* Bottom accent bar */}
      <motion.div
        animate={{ scaleX: selected ? 1 : 0, opacity: selected ? 1 : 0 }}
        initial={{ scaleX: 0, opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
        style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 4,
          background: theme.accent, transformOrigin: "left",
        }}
      />
    </motion.button>
  );
}
