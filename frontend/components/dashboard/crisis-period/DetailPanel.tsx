"use client";
import React from "react";
import { motion } from "framer-motion";
import { themes, type ThemeKey, CUSTOM_ACCENT, CUSTOM_ACCENT_RGB } from "./types";

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

export function CustomDatePanel({ start, end, onStartChange, onEndChange }: {
  start: string;
  end: string;
  onStartChange: (v: string) => void;
  onEndChange: (v: string) => void;
}) {
  const startRef = React.useRef<HTMLInputElement>(null);
  const endRef = React.useRef<HTMLInputElement>(null);

  const inputStyle: React.CSSProperties = {
    border: `1px solid rgba(${CUSTOM_ACCENT_RGB}, 0.25)`,
    borderRadius: 10,
    padding: "8px 12px",
    fontSize: 14,
    fontFamily: "'DM Mono', monospace",
    color: "rgba(0,0,0,0.8)",
    background: "rgba(255,255,255,0.8)",
    outline: "none",
    cursor: "pointer",
    flex: 1,
  };

  const isInvalid = start && end && start >= end;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.22, ease: [0.25, 1, 0.5, 1] }}
      style={{
        padding: "14px 18px",
        borderRadius: 14,
        background: `rgba(${CUSTOM_ACCENT_RGB}, 0.06)`,
        border: `1px solid rgba(${CUSTOM_ACCENT_RGB}, 0.14)`,
        display: "flex", flexDirection: "column", gap: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: CUSTOM_ACCENT, flexShrink: 0 }} />
        <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(0,0,0,0.7)", fontFamily: "-apple-system, 'SF Pro Text', BlinkMacSystemFont, sans-serif" }}>
          Select your date range
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <input ref={startRef} type="date" value={start} min="1970-01-01" max="2022-12-31" onChange={(e) => onStartChange(e.target.value)} onClick={() => startRef.current?.showPicker()} style={inputStyle} />
        <span style={{ fontSize: 13, color: "rgba(0,0,0,0.35)", flexShrink: 0 }}>to</span>
        <input ref={endRef} type="date" value={end} min="1970-01-01" max="2022-12-31" onChange={(e) => onEndChange(e.target.value)} onClick={() => endRef.current?.showPicker()} style={inputStyle} />
      </div>
      {isInvalid && (
        <span style={{ fontSize: 12, color: "#dc2626", fontFamily: "'DM Sans', sans-serif" }}>
          End date must be after start date.
        </span>
      )}
    </motion.div>
  );
}
