"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getCsvFiles, csvListToStocks } from "@/lib/stockApi";


export type Stock = { ticker: string; name: string; change?: number };

// ─── Skeleton (loading state) ──────────────────────────────────────────────────

function StockSearchSkeleton() {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minWidth: "100%",
        minHeight: "62px",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          padding: "0 22px",
          height: "62px",
          minHeight: "62px",
          borderRadius: "20px",
          background: "rgba(255,255,255,0.9)",
          border: "1px solid rgba(0,0,0,0.1)",
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        <div
          style={{
            width: 19,
            height: 19,
            borderRadius: 4,
            background: "linear-gradient(90deg, rgba(0,0,0,0.06) 25%, rgba(0,0,0,0.12) 50%, rgba(0,0,0,0.06) 75%)",
            backgroundSize: "200% 100%",
            animation: "stock-shimmer 1.2s ease-in-out infinite",
            flexShrink: 0,
          }}
        />
        <div
          style={{
            flex: 1,
            height: 20,
            borderRadius: 6,
            background: "linear-gradient(90deg, rgba(0,0,0,0.06) 25%, rgba(0,0,0,0.12) 50%, rgba(0,0,0,0.06) 75%)",
            backgroundSize: "200% 100%",
            animation: "stock-shimmer 1.2s ease-in-out infinite",
          }}
        />
      </div>
      <style>{`
        @keyframes stock-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}

// ─── Accent color helper ──────────────────────────────────────────────────────

const ACCENT_COLORS: Record<string, string> = {
  A: "#9333ea", B: "#ea580c", C: "#059669", D: "#2563eb",
  E: "#db2777", F: "#d97706", G: "#7c3aed", H: "#0891b2",
  I: "#16a34a", J: "#dc2626", K: "#9333ea", L: "#ea580c",
  M: "#2563eb", N: "#059669", O: "#db2777", P: "#7c3aed",
  Q: "#0891b2", R: "#d97706", S: "#16a34a", T: "#dc2626",
  U: "#9333ea", V: "#ea580c", W: "#2563eb", X: "#059669",
  Y: "#db2777", Z: "#7c3aed",
};

function accentFor(ticker: string) {
  return ACCENT_COLORS[ticker[0]] ?? "#6b7280";
}

// ─── Ticker Badge ─────────────────────────────────────────────────────────────

function TickerBadge({ ticker, size = 40 }: { ticker: string; size?: number }) {
  const color = accentFor(ticker);
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: `${size}px`, height: `${size}px`,
      borderRadius: `${Math.round(size * 0.27)}px`,
      background: `${color}14`, border: `1px solid ${color}26`,
      color, fontSize: size < 34 ? "9px" : "10px",
      fontWeight: 700, letterSpacing: "0.02em", flexShrink: 0,
      fontFamily: "'DM Mono', monospace",
    }}>
      {ticker.length > 4 ? ticker.slice(0, 3) : ticker}
    </span>
  );
}

// ─── Selected Stock Card — shown below the bar ────────────────────────────────

function SelectedCard({ stock, onClear }: { stock: Stock; onClear: () => void }) {
  const change = stock.change ?? 0;
  const isUp = change >= 0;
  const color = accentFor(stock.ticker);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        padding: "14px 18px",
        borderRadius: "18px",
        background: "rgba(255,255,255,0.68)",
        backdropFilter: "blur(24px) saturate(190%)",
        WebkitBackdropFilter: "blur(24px) saturate(190%)",
        border: `1px solid ${color}22`,
        boxShadow: `0 4px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.9)`,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Top glass line */}
      <span style={{
        position: "absolute", inset: 0, top: 0,
        height: "1px", borderRadius: "18px 18px 0 0",
        background: "linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.85) 50%, transparent 90%)",
        pointerEvents: "none",
      }} />

      <TickerBadge ticker={stock.ticker} size={46} />

      {/* Name & ticker */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: "16px", fontWeight: 700,
          color: "rgba(0,0,0,0.85)", letterSpacing: "-0.025em",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {stock.name}
        </div>
        <div style={{
          fontSize: "11px",
          fontFamily: "'DM Mono', monospace",
          color: "rgba(0,0,0,0.32)",
          letterSpacing: "0.06em",
         marginTop: "3px",
        }}>
         NYSE
      </div>
      </div>

      {/* Change pill */}
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "3px",
      }}>
        <span style={{
          fontSize: "15px", fontWeight: 700,
          fontFamily: "'DM Mono', monospace",
          color: isUp ? "#059669" : "#dc2626",
          letterSpacing: "-0.01em",
        }}>
          {isUp ? "▲" : "▼"} {Math.abs(change).toFixed(2)}%
        </span>
        <span style={{
          fontSize: "10px", fontFamily: "'DM Mono', monospace",
          color: "rgba(0,0,0,0.25)", letterSpacing: "0.06em", textTransform: "uppercase",
        }}>
          Today
        </span>
      </div>

      {/* Divider */}
      <div style={{ width: "1px", height: "32px", background: "rgba(0,0,0,0.06)", flexShrink: 0 }} />

      {/* Change button */}
      <button
        onClick={onClear}
        style={{
          all: "unset", cursor: "pointer",
          display: "flex", alignItems: "center", gap: "6px",
          padding: "7px 12px", borderRadius: "10px",
          background: "rgba(0,0,0,0.04)",
          border: "1px solid rgba(0,0,0,0.07)",
          fontSize: "12px", fontWeight: 600,
          color: "rgba(0,0,0,0.45)",
          letterSpacing: "-0.01em",
          transition: "background 0.18s ease, color 0.18s ease",
          flexShrink: 0,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(0,0,0,0.08)";
          e.currentTarget.style.color = "rgba(0,0,0,0.7)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(0,0,0,0.04)";
          e.currentTarget.style.color = "rgba(0,0,0,0.45)";
        }}
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
          strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
        Change
      </button>
    </motion.div>
  );
}

// ─── Search Bar ───────────────────────────────────────────────────────────────

type StockSearchBarProps = {
  initialQuery?: string;
  onSelect?: (stock: Stock) => void;
  onCancel?: () => void;
  pinnedStock?: Stock | null;
};

export function StockSearchBar({ initialQuery = "", onSelect, onCancel, pinnedStock }: StockSearchBarProps = {}) {
  const [query, setQuery] = useState(initialQuery);
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const [selected, setSelected] = useState<Stock | null>(null);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch available stocks from GET /api/csv-files, keep list alphabetical by ticker
  const sortByTicker = (list: Stock[]) =>
    [...list].sort((a, b) => a.ticker.localeCompare(b.ticker, undefined, { sensitivity: "base" }));

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError(false);
    getCsvFiles()
      .then((files) => {
        if (cancelled) return;
        const fromApi = csvListToStocks(files);
        setStocks(sortByTicker(fromApi));
      })
      .catch(() => {
        if (!cancelled) {
          setStocks([]);
          setLoadError(true);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
  setQuery(initialQuery);
  setOpen(true);
  setHighlighted(0);
}, [initialQuery]);

  const MAX_VISIBLE = 80; // Cap rendered rows for 3300+ stocks (keeps DOM fast)

  const normalizedQuery = query.trim().toLowerCase();

  const filtered = sortByTicker(
    stocks.filter((s) =>
      normalizedQuery === ""
        ? true
        : s.ticker.toLowerCase().startsWith(normalizedQuery) ||
          s.name.toLowerCase().startsWith(normalizedQuery)
    )
  );

  // Pin current stock at top (excluding it from the regular list to avoid duplicate)
  const pinnedInResults = pinnedStock ? filtered.find((s) => s.ticker === pinnedStock.ticker) : null;
  const filteredWithoutPinned = pinnedInResults ? filtered.filter((s) => s.ticker !== pinnedStock!.ticker) : filtered;
  const displayed = filteredWithoutPinned.slice(0, MAX_VISIBLE - (pinnedInResults ? 1 : 0));
  const displayedWithPinned = pinnedInResults ? [pinnedInResults, ...displayed] : displayed;

  const totalMatches = filtered.length;
  const hasMore = totalMatches > MAX_VISIBLE;

  const selectStock = (stock: Stock) => {
    setSelected(stock);
    onSelect?.(stock);
    setQuery("");
    setOpen(false);
    setResetting(false);
    inputRef.current?.blur();
    setFocused(false);
  };

  const handleResetClick = () => {
    setResetting(true);
    setQuery("");
    setOpen(true);
    setHighlighted(0);
    setTimeout(() => inputRef.current?.focus(), 80);
  };

  // Close on outside click; if resetting, cancel reset without clearing selection
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setFocused(false);
        if (resetting) {
          setResetting(false);
        } else {
          onCancel?.();
        }
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [resetting, onCancel]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setHighlighted((h) => Math.min(h + 1, displayedWithPinned.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      if (open && displayedWithPinned[highlighted]) selectStock(displayedWithPinned[highlighted]);
    } else if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  useEffect(() => {
    setHighlighted(0);
  }, [query]);

  useEffect(() => {
    setHighlighted((h) => Math.min(h, Math.max(0, displayedWithPinned.length - 1)));
  }, [displayed.length]);

  useEffect(() => {
    const el = listRef.current?.children[highlighted] as HTMLElement;
    el?.scrollIntoView({ block: "nearest" });
  }, [highlighted]);

  if (loading) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        `}</style>
        <StockSearchSkeleton />
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        .stock-scroll::-webkit-scrollbar { width: 0; }
      `}</style>

      <div
        ref={containerRef}
        style={{ position: "relative", width: "100%", fontFamily: "'DM Sans', sans-serif" }}
      >
        {loadError && stocks.length === 0 && (
          <div
            style={{
              marginBottom: 8,
              padding: "8px 14px",
              borderRadius: 10,
              background: "rgba(220,38,38,0.08)",
              border: "1px solid rgba(220,38,38,0.2)",
              fontSize: 13,
              color: "rgba(180,0,0,0.9)",
            }}
          >
            Could not load stocks. Make sure the backend is running at the API URL.
          </div>
        )}
        {/* ── Search input — hidden when stock is selected (and not resetting) ── */}
        <AnimatePresence mode="wait">
          {!selected || resetting ? (
            <motion.div
              key="searchbar"
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {/* ── Input shell ── */}
              <motion.div
                animate={{
                  boxShadow: focused
                    ? "0 0 0 4px rgba(0,0,0,0.05), 0 8px 32px rgba(0,0,0,0.10)"
                    : "0 2px 12px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.04)",
                }}
                transition={{ duration: 0.2 }}
                style={{
                  display: "flex", alignItems: "center", gap: "14px",
                  padding: "0 22px", height: "62px",
                  borderRadius: open ? "20px 20px 0 0" : "20px",
                  background: "rgba(255,255,255,0.75)",
                  backdropFilter: "blur(24px) saturate(180%)",
                  WebkitBackdropFilter: "blur(24px) saturate(180%)",
                  borderTop: `1px solid ${focused ? "rgba(0,0,0,0.12)" : "rgba(0,0,0,0.07)"}`,
                  borderLeft: `1px solid ${focused ? "rgba(0,0,0,0.12)" : "rgba(0,0,0,0.07)"}`,
                  borderRight: `1px solid ${focused ? "rgba(0,0,0,0.12)" : "rgba(0,0,0,0.07)"}`,
                  borderBottom: open
                      ? "1px solid rgba(0,0,0,0.05)"
                      : `1px solid ${focused ? "rgba(0,0,0,0.12)" : "rgba(0,0,0,0.07)"}`,
                  transition: "border-radius 0.15s ease, border-color 0.2s ease",
                }}
              >
                {/* Search icon */}
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  style={{ color: focused ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.25)", flexShrink: 0, transition: "color 0.2s ease" }}>
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>

                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setOpen(true); setHighlighted(0); }}
                  onFocus={() => { setFocused(true); setOpen(true); setHighlighted(0); }}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    loadError && stocks.length === 0
                      ? "Could not load stocks. Is the backend running?"
                      : "Search stocks — AAPL, Tesla, NVDA…"
                  }
                  readOnly={loadError && stocks.length === 0}
                  style={{
                    flex: 1, border: "none", outline: "none",
                    background: "transparent", fontSize: "17px", fontWeight: 500,
                    color: "rgba(0,0,0,0.82)", letterSpacing: "-0.025em",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                />

                {/* Clear query */}
                <AnimatePresence>
                  {query.length > 0 && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.7 }}
                      transition={{ duration: 0.14 }}
                      onClick={() => { setQuery(""); inputRef.current?.focus(); setHighlighted(0); }}
                      style={{
                        all: "unset", cursor: "pointer", display: "flex",
                        alignItems: "center", justifyContent: "center",
                        width: "24px", height: "24px", borderRadius: "50%",
                        background: "rgba(0,0,0,0.08)", flexShrink: 0,
                      }}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                        style={{ color: "rgba(0,0,0,0.45)" }}>
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </motion.button>
                  )}
                </AnimatePresence>

                {/* ⌘K */}
              </motion.div>

              {/* ── Dropdown ── */}
              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    style={{
                      position: "absolute", top: "100%", left: 0, right: 0, zIndex: 50,
                      background: "rgba(255,255,255,0.92)",
                      backdropFilter: "blur(28px) saturate(180%)",
                      WebkitBackdropFilter: "blur(28px) saturate(180%)",
                      border: "1px solid rgba(0,0,0,0.07)", borderTop: "none",
                      borderRadius: "0 0 20px 20px", overflow: "hidden",
                      boxShadow: "0 20px 48px rgba(0,0,0,0.10), 0 4px 12px rgba(0,0,0,0.06)",
                    }}
                  >
                    {/* Section label */}
                    <div style={{
                      padding: "12px 22px 6px", fontSize: "10px",
                      fontFamily: "'DM Mono', monospace", letterSpacing: "0.12em",
                      textTransform: "uppercase", color: "rgba(0,0,0,0.28)",
                    }}>
                      {query.trim()
                        ? hasMore
                          ? `Showing first ${displayed.length} of ${totalMatches.toLocaleString()} matches`
                          : `${totalMatches} result${totalMatches !== 1 ? "s" : ""}`
                        : `Showing first ${displayed.length} of ${stocks.length.toLocaleString()} stocks`}
                    </div>

                    <ul ref={listRef} className="stock-scroll"
                      style={{ listStyle: "none", margin: 0, padding: "0 0 8px", maxHeight: "400px", overflowY: "auto" }}>
                     
                     {displayedWithPinned.length === 0 ? (
                      <li style={{ padding: "28px 22px", textAlign: "center", color: "rgba(0,0,0,0.28)", fontSize: "14px" }}>
                        No results for &ldquo;{query}&rdquo;
                      </li>
                     ) : (
                        displayedWithPinned.map((stock, i) => {
                          const isActive = i === highlighted;
                          const isPinned = pinnedStock?.ticker === stock.ticker && i === 0;
                          return (
                            <motion.li
                              key={stock.ticker}
                              initial={{ opacity: 0, x: -4 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.12 }}
                              onMouseEnter={() => setHighlighted(i)}
                              onClick={() => selectStock(stock)}
                              style={{
                                display: "flex", alignItems: "center", gap: "14px",
                                padding: "10px 14px", margin: "0 8px", borderRadius: "13px",
                                cursor: "pointer",
                                background: isActive ? "rgba(0,0,0,0.04)" : "transparent",
                                transition: "background 0.15s ease",
                              }}
                            >
                              <TickerBadge ticker={stock.ticker} size={42} />

                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{
                                  fontSize: "15px", fontWeight: 600,
                                  color: "rgba(0,0,0,0.85)", letterSpacing: "-0.02em",
                                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                                }}>
                                  {stock.name}
                                </div>
                                <div style={{
                                  fontSize: "11px", fontFamily: "'DM Mono', monospace",
                                  color: "rgba(0,0,0,0.32)", letterSpacing: "0.04em", marginTop: "2px",
                                }}>
                                  {stock.ticker}
                                </div>
                              </div>

                              {isPinned && (
                                <span style={{
                                  fontSize: "10px", fontFamily: "'DM Mono', monospace",
                                  letterSpacing: "0.08em", textTransform: "uppercase",
                                  color: "rgba(0,0,0,0.35)", background: "rgba(0,0,0,0.06)",
                                  border: "1px solid rgba(0,0,0,0.08)", borderRadius: "6px",
                                  padding: "2px 7px", flexShrink: 0,
                                }}>
                                  Current
                                </span>
                              )}
                            </motion.li>
                          );
                        })
                      )}
                    </ul>

                    {/* Footer */}
                    <div style={{
                      padding: "10px 22px", borderTop: "1px solid rgba(0,0,0,0.05)",
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                    }}>
                      <span style={{ fontSize: "11px", fontFamily: "'DM Mono', monospace", color: "rgba(0,0,0,0.22)", letterSpacing: "0.04em" }}>
                        {stocks.length} stocks available
                      </span>
                      <div style={{ display: "flex", gap: "10px" }}>
                        {[["↑↓", "navigate"], ["↵", "select"], ["esc", "close"]].map(([key, label]) => (
                          <span key={key} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <kbd style={{
                              fontSize: "10px", fontFamily: "'DM Mono', monospace",
                              background: "rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.10)",
                              borderRadius: "4px", padding: "2px 6px", color: "rgba(0,0,0,0.38)",
                            }}>{key}</kbd>
                            <span style={{ fontSize: "10px", color: "rgba(0,0,0,0.22)" }}>{label}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

          ) : (
            // ── Selected card replaces the search bar ──
            <motion.div
              key="selectedcard"
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 380, damping: 26 }}
              style={{ position: "relative" }}
            >
              <SelectedCard stock={selected!} onClear={handleResetClick} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default StockSearchBar;
