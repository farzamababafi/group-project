export type ThemeKey = "dotcom" | "financial" | "covid";
export type PeriodKey = ThemeKey | "custom";

export const CUSTOM_ACCENT = "#2563eb";
export const CUSTOM_ACCENT_RGB = "37,99,235";

export const themes = {
  dotcom: {
    label: "Dot-Com Crash",
    sublabel: "2000–2002",
    description: "End of the late-1990s internet boom; many unprofitable tech companies failed or were acquired.",
    accent: "#9333ea",
    accentRgb: "147,51,234",
  },
  financial: {
    label: "Financial Crisis",
    sublabel: "2007–2009",
    description: "Lehman collapse and credit freeze triggered a global selloff and deep recession.",
    accent: "#c2410c",
    accentRgb: "194,65,12",
  },
  covid: {
    label: "COVID-19 Crash",
    sublabel: "Mar 2020",
    description: "Sharp V-shaped selloff and recovery as pandemic lockdowns and stimulus reshaped markets.",
    accent: "#059669",
    accentRgb: "5,150,105",
  },
};

export const sparklines: Record<ThemeKey, string> = {
  dotcom: "M0,40 L8,36 L16,28 L24,22 L32,30 L40,18 L48,10 L56,14 L64,8 L72,16 L80,32 L88,38 L96,42 L104,44",
  financial: "M0,20 L12,18 L24,16 L36,14 L48,24 L56,40 L60,52 L64,60 L68,56 L76,50 L88,44 L100,40 L104,38",
  covid: "M0,30 L16,28 L32,26 L44,24 L52,50 L56,62 L60,50 L68,38 L80,28 L92,20 L104,14",
};
