import { motion } from "framer-motion";
import { DotComIcon } from "./DotComIcon";
import { FinancialIcon } from "./FinancialIcon";
import { CovidIcon } from "./CovidIcon";
import type { ThemeKey } from "./CrisisCard";

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

export function DetailPanel({ variant }: { variant: ThemeKey }) {
  const theme = themes[variant];
  return (
    <motion.div
      key={variant}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.22, ease: [0.25, 1, 0.5, 1] }}
      style={{
        display: "flex", alignItems: "center",
        padding: "12px 18px", borderRadius: 14, gap: 10,
        background: `rgba(${theme.accentRgb}, 0.06)`,
        border: `1px solid rgba(${theme.accentRgb}, 0.14)`,
      }}
    >
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: theme.accent, flexShrink: 0 }} />
      <span style={{
        fontSize: 14, fontWeight: 500, letterSpacing: "-0.01em",
        color: "rgba(0,0,0,0.55)",
        fontFamily: "-apple-system, 'SF Pro Text', BlinkMacSystemFont, sans-serif",
      }}>
        <span style={{ fontWeight: 600, color: "rgba(0,0,0,0.8)" }}>{theme.label}</span>
        &ensp;·&ensp;{theme.description}
      </span>
    </motion.div>
  );
}
