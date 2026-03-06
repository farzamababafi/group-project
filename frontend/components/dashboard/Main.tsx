"use client";

import { useState, useEffect, useRef } from "react";
import { CrisisButtonGroup } from "@/components/dashboard/buttons";
import { StockSearchBar, type Stock } from "@/components/dashboard/stocksearchbar";
import { Accordion } from "@/components/dashboard/Accordion";
import { postStockRequest, getCrisisDates } from "@/lib/stockApi";
import type { CrisisPeriodKey, StockTimePoint } from "@/lib/types";
import {Chat} from "./chat"
import { StockCharts } from "./StockCharts";
import { AppleAlert } from "@/components/ui/AppleAlert";

export default function Dashboard() {
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<CrisisPeriodKey | null>(null);
  const [requestStatus, setRequestStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [detailsFetched, setDetailsFetched] = useState(false);
  const [stockSeries, setStockSeries] = useState<StockTimePoint[] | null>(null);
  const [errorInfo, setErrorInfo] = useState<{
    status?: number;
    message: string;
    raw?: any;
  } | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toast, setToast] = useState<null | {
    tone: "success" | "error";
    title: string;
    statusCode?: number;
    message: string;
    action?: { label: string; kind: "change-stock" };
  }>(null);
  const toastTimerRef = useRef<number | null>(null);


  const step = !selectedPeriod ? 1 : !selectedStock ? 2 : 3;

  function hideToast() {
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = null;
    setToastVisible(false);
  }

  function showToast(nextToast: NonNullable<typeof toast>, ms: number) {
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = null;
    setToast(nextToast);
    setToastVisible(true);
    toastTimerRef.current = window.setTimeout(() => {
      setToastVisible(false);
    }, ms);
  }

  useEffect(() => {
    if (step !== 3) {
      setDetailsFetched(false);
      setErrorInfo(null);
      setStockSeries(null);
      setRequestStatus("idle");
      return;
    }
    const dates = getCrisisDates(selectedPeriod!);
    setRequestStatus("loading");
    setErrorInfo(null);
    hideToast();
    postStockRequest({
      stock_name: selectedStock!.ticker,
      start_date: dates.start_date,
      end_date: dates.end_date,
    })
      .then((data) => {
        setStockSeries(data);
        setRequestStatus("done");
        setDetailsFetched(true);
        showToast(
          {
            tone: "success",
            title: "Data loaded.",
            message: `Showing ${selectedStock!.ticker} · ${selectedStock!.name} for the selected period.`,
          },
          1600
        );
      })
      .catch((err: any) => {
        setStockSeries(null);
        let status: number | undefined;
        let message = "Something went wrong while loading this stock.";
        let raw: unknown;

        if (err && typeof err === "object") {
          const axiosErr = err as any;
          status = axiosErr?.response?.status;
          raw = axiosErr?.response?.data ?? axiosErr?.message ?? String(err);

          const backendDetail =
            axiosErr?.response?.data?.detail ??
            axiosErr?.response?.data?.message ??
            (typeof axiosErr?.response?.data === "string"
              ? axiosErr.response.data
              : undefined);

          if (backendDetail) {
            message = String(backendDetail);
          } else if (axiosErr?.message) {
            message = String(axiosErr.message);
          }
        }

        setErrorInfo({ status, message, raw });
        setRequestStatus("error");

        // Friendly handling for common backend validations
        const isOutOfRange = /Date out of range/i.test(message);
        if (isOutOfRange) {
          const match = message.match(/Available range:\s*([0-9-]+)\s*to\s*([0-9-]+)/i);
          const rangeText = match ? `Available: ${match[1]} → ${match[2]}.` : "";

          showToast(
            {
              tone: "error",
              title: "No data for this period.",
              message: `This stock doesn’t have data for the selected period. ${rangeText} Choose another stock.`,
              action: { label: "Choose another stock", kind: "change-stock" },
            },
            2600
          );

          // Move user back to stock selection immediately
          setSelectedStock(null);
          return;
        }

        showToast(
          {
            tone: "error",
            title: "Couldn’t load this stock.",
            message,
            action: { label: "Choose another stock", kind: "change-stock" },
          },
          2600
        );
      });
  }, [selectedPeriod, selectedStock, step]);

  const accordionItems = [
    {
      id: "basic",
      label: "Basic Metrics",
      sublabel: "Price · Volume · EPS · Revenue",
      icon: (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        >
          <rect x="2" y="7" width="6" height="14" />
          <rect x="9" y="3" width="6" height="18" />
          <rect x="16" y="10" width="6" height="11" />
        </svg>
      ),
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {stockSeries && stockSeries.length > 0 ? (
            <StockCharts
              data={stockSeries}
              stockName={selectedStock?.name ?? null}
            />
          ) : (
            <p
              style={{
                fontSize: 13,
                color: "rgba(15,23,42,0.6)",
                fontFamily: "'DM Sans', system-ui, -apple-system, BlinkMacSystemFont",
              }}
            >
              Run a request above to see basic price and volume charts for this
              stock.
            </p>
          )}
        </div>
      ),
    },
    {
      id: "featured",
      label: "Featured Metrics",
      sublabel: "P/E · RSI · Beta · Short Interest",
      icon: (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
    },
  ];

  return (
    <main className="min-h-screen flex flex-col items-center px-8 gap-6">
      {/* ── Top bar (always) ── */}
      <div
        className="w-full sticky top-0 z-10 py-4 flex items-center gap-3"
        style={{
          borderBottom: "1px solid rgba(0,0,0,0.05)",
          background: "rgba(247,247,247,0.85)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          marginLeft: "-2rem",
          marginRight: "-2rem",
          paddingLeft: "2rem",
          paddingRight: "2rem",
          width: "calc(100% + 4rem)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
          <span
            style={{
              fontSize: "11px",
              fontFamily: "'DM Mono', monospace",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(0,0,0,0.28)",
            }}
          >
            Dashboard
          </span>
          <h2
            style={{
              fontSize: "18px",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "rgba(0,0,0,0.82)",
              lineHeight: 1,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Home
          </h2>
        </div>
      </div>

      {/* ── Step 1: Crisis period (always shown) ── */}
      <div className="w-full max-w-9xl flex flex-col items-center gap-4">
        <CrisisButtonGroup
          selectedPeriod={selectedPeriod}
          onSelectPeriod={setSelectedPeriod}
        />

        {step === 1 && (
          <p
            className="text-sm text-black/40 font-medium"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Select a time period above, then choose a stock to see details.
          </p>
        )}
      </div>

      {/* ── Step 2: Stock search (only after period selected) ── */}
      {step >= 2 && (
        <>
          <div className="flex items-center gap-4 w-full max-w-4xl">
            <div className="flex-1 h-px bg-black/[0.06]" />
            <span className="text-[10px] font-medium tracking-[0.14em] uppercase text-black/25 font-mono">
              {step === 2 ? "Now select a stock" : "Stock selected"}
            </span>
            <div className="flex-1 h-px bg-black/[0.06]" />
          </div>

          <div className="w-full max-w-7xl flex flex-col gap-2" style={{ minHeight: 80 }}>
            {step === 2 ? (
              <StockSearchBar
                onSelect={setSelectedStock}
                onClear={() => setSelectedStock(null)}
              />
            ) : (
              /* Step 3: show selected stock + option to change */
              <div
                className="w-full flex items-center justify-between gap-4 rounded-2xl px-5 py-4"
                style={{
                  background: "rgba(255,255,255,0.85)",
                  border: "1px solid rgba(0,0,0,0.08)",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontWeight: 700,
                      fontSize: 15,
                      color: "rgba(0,0,0,0.85)",
                    }}
                  >
                    {selectedStock!.ticker}
                  </span>
                  <span style={{ fontSize: 14, color: "rgba(0,0,0,0.5)" }}>
                    {selectedStock!.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedStock(null)}
                  className="text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                  style={{
                    background: "rgba(0,0,0,0.06)",
                    color: "rgba(0,0,0,0.7)",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Select different stock
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* ── Step 3: Details in a separate card (after period + stock selected) ── */}
      {step === 3 && (
        <>
          {requestStatus === "loading" && (
            <p className="text-xs font-mono text-black/50">
              Retrieving details for this period…
            </p>
          )}

          {/* Charts + metrics */}
          <div className="w-full max-w-7xl pb-10 flex flex-col gap-8">
            <Accordion
              items={accordionItems}
              allowMultiple
              stockName={selectedStock?.name ?? null}
            />
          </div>

          <div className="w-full max-w-7xl pb-16">
            <Chat />
          </div>
        </>
      )}

      {/* Floating toast (success + errors) */}
      {toastVisible && toast && (
        <div
          style={{
            position: "fixed",
            top: 88,
            right: 24,
            zIndex: 40,
            maxWidth: 360,
            transition: "opacity 0.25s ease, transform 0.25s ease",
            opacity: toastVisible ? 1 : 0,
            transform: toastVisible ? "translateY(0)" : "translateY(-8px)",
          }}
        >
          <AppleAlert
            tone={toast.tone}
            title={toast.title}
            statusCode={toast.statusCode}
            message={toast.message}
            actionLabel={toast.action?.label}
            onAction={
              toast.action?.kind === "change-stock"
                ? () => setSelectedStock(null)
                : undefined
            }
          />
        </div>
      )}
    </main>
  );
}
