import { Accordion } from "@/components/dashboard/Accordion";

const FAQ_ITEMS = [
  {
    id: "about",
    label: "What is this dashboard?",
    sublabel: "Overview · Platform",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" />
      </svg>
    ),
    content:
      "A real-time market analysis dashboard tracking S&P 500 stocks, major crisis periods, and key economic indicators.",
  },
  {
    id: "crisis",
    label: "What are crisis periods?",
    sublabel: "Dot-com · 2008 · COVID",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    content:
      "Crisis periods highlight historical market downturns — Dot-com (2000), Financial Crisis (2008), and COVID-19 (2020). Select one to explore its timeline and economic impact.",
  },
  {
    id: "data",
    label: "Is the data real-time?",
    sublabel: "Data · Refresh rate",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
        <path d="M21 2v6h-6" />
        <path d="M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6" />
        <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
      </svg>
    ),
    content:
      "Stock data updates every 15 seconds during market hours (9:30am–4:00pm ET). Crisis data is historical and static.",
  },
  {
    id: "search",
    label: "How does stock search work?",
    sublabel: "Search · 100 stocks",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
    ),
    content:
      "Type a ticker (AAPL, NVDA) or company name to instantly filter 100 S&P 500 stocks. Use ↑↓ to navigate, ↵ to select, Esc to close.",
  },
];
