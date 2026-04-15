"use client";

import React from "react";

export type SectorKey =
  | "health_care"
  | "information_technology"
  | "industrials"
  | "financials"
  | "consumer_discretionary"
  | "real_estate"
  | "utilities"
  | "consumer_staples"
  | "materials"
  | "communication_services"
  | "energy";

const SECTORS: {
  key: SectorKey;
  label: string;
  accent: string;
  icon: React.ReactNode;
}[] = [
  {
    key: "health_care",
    label: "Health Care",
    accent: "#e11d48",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    key: "information_technology",
    label: "Information Technology",
    accent: "#2563eb",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
  },
  {
    key: "industrials",
    label: "Industrials",
    accent: "#d97706",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 20h20M4 20V10l4-4 4 4V8l4-4 4 4v12" />
      </svg>
    ),
  },
  {
    key: "financials",
    label: "Financials",
    accent: "#059669",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    key: "consumer_discretionary",
    label: "Consumer Discretionary",
    accent: "#7c3aed",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
  {
    key: "real_estate",
    label: "Real Estate",
    accent: "#b45309",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
        <path d="M9 21V12h6v9" />
      </svg>
    ),
  },
  {
    key: "utilities",
    label: "Utilities",
    accent: "#0e7490",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
  {
    key: "consumer_staples",
    label: "Consumer Staples",
    accent: "#65a30d",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 2h1l1 7H20l1-5H6" />
        <circle cx="9" cy="20" r="1.5" />
        <circle cx="18" cy="20" r="1.5" />
        <path d="M5 9l1.5 8h11" />
      </svg>
    ),
  },
  {
    key: "materials",
    label: "Materials",
    accent: "#9333ea",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
        <line x1="12" y1="22" x2="12" y2="15.5" />
        <polyline points="22 8.5 12 15.5 2 8.5" />
      </svg>
    ),
  },
  {
    key: "communication_services",
    label: "Communication Services",
    accent: "#c2410c",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    key: "energy",
    label: "Energy",
    accent: "#be123c",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 1 0 10 10" />
        <path d="M12 8v4l3 3" />
        <path d="M18 2l4 4-4 4" />
        <path d="M22 2h-4" />
      </svg>
    ),
  },
];

interface SectorCardProps {
  sector: (typeof SECTORS)[number];
  selected: boolean;
  dimmed: boolean;
  onClick: () => void;
}

function SectorCard({ sector, selected, dimmed, onClick }: SectorCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        padding: "16px 18px",
        borderRadius: 16,
        border: selected
          ? `1.5px solid ${sector.accent}`
          : "1.5px solid rgba(0,0,0,0.08)",
        background: selected
          ? `${sector.accent}10`
          : "rgba(255,255,255,0.85)",
        boxShadow: selected
          ? `0 0 0 3px ${sector.accent}20, 0 4px 16px rgba(0,0,0,0.08)`
          : "0 2px 8px rgba(0,0,0,0.05)",
        opacity: dimmed ? 0.4 : 1,
        overflow: "hidden",
        cursor: "pointer",
        textAlign: "left",
        transition: "all 0.18s ease",
        fontFamily: "-apple-system, 'SF Pro Display', BlinkMacSystemFont, sans-serif",
        minWidth: 0,
      }}
    >
      {/* Accent bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 3,
          background: sector.accent,
          opacity: selected ? 1 : 0,
          transition: "opacity 0.18s ease",
        }}
      />

      {/* Icon */}
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: `${sector.accent}15`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: sector.accent,
        }}
      >
        {sector.icon}
      </div>

      {/* Label */}
      <span
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: selected ? sector.accent : "rgba(0,0,0,0.8)",
          letterSpacing: "-0.01em",
          lineHeight: 1.3,
          transition: "color 0.18s ease",
        }}
      >
        {sector.label}
      </span>

      {/* Selected dot */}
      {selected && (
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: sector.accent,
          }}
        />
      )}
    </button>
  );
}

interface SectorSelectorProps {
  selectedSector: SectorKey | null;
  onSelectSector: (sector: SectorKey | null) => void;
}

export function SectorSelector({ selectedSector, onSelectSector }: SectorSelectorProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        width: "100%",
        maxWidth: 1280,
        fontFamily: "-apple-system, 'SF Pro Display', BlinkMacSystemFont, sans-serif",
      }}
    >
      <div style={{ paddingBottom: 6 }}>
        <div style={{ fontSize: 19, fontWeight: 600, letterSpacing: "-0.02em", color: "#1a1a1a", lineHeight: 1.3 }}>
          Sectors
        </div>
        <div style={{ fontSize: 15, color: "rgba(0,0,0,0.5)", marginTop: 4, fontWeight: 400, lineHeight: 1.4 }}>
          Select a sector to view global market performance
        </div>
      </div>

      <style>{`
        .sector-cards-grid {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 14px;
        }
        @media (max-width: 1100px) {
          .sector-cards-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
        }
        @media (max-width: 700px) {
          .sector-cards-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 400px) {
          .sector-cards-grid { grid-template-columns: repeat(1, minmax(0, 1fr)); }
        }
      `}</style>

      <div className="sector-cards-grid">
        {SECTORS.map((sector) => (
          <SectorCard
            key={sector.key}
            sector={sector}
            selected={selectedSector === sector.key}
            dimmed={selectedSector !== null && selectedSector !== sector.key}
            onClick={() => onSelectSector(selectedSector === sector.key ? null : sector.key)}
          />
        ))}
      </div>
    </div>
  );
}
