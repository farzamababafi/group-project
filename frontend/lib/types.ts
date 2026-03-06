export interface Helloworld {
  message: string;
  status: string;
}

// ─── Stock / Crisis API ───────────────────────────────────────────────────────

/** Crisis period key (matches UI buttons). */
export type CrisisPeriodKey = "dotcom" | "financial" | "covid";

/** Request body for POST /api/stockreq */
export interface StockRequestBody {
  stock_name: string;
  start_date: string; // YYYY-MM-DD
  end_date: string;   // YYYY-MM-DD
}

/** Single time‑series point returned from POST /api/stockreq */
export interface StockTimePoint {
  Date: string;          // "YYYY-MM-DD"
  Open: number;
  High: number;
  Low: number;
  Close: number;
  Volume: number;
  "Adjusted Close": number;
}

/** Date range for a crisis period */
export interface CrisisPeriodDates {
  start_date: string;
  end_date: string;
}

/** Map of crisis period key → date range */
export const CRISIS_PERIOD_DATES: Record<CrisisPeriodKey, CrisisPeriodDates> = {
  dotcom:    { start_date: "2000-01-01", end_date: "2002-12-31" }, // Dot-com burst 2000–2002
  financial: { start_date: "2007-01-01", end_date: "2009-12-31" }, // Global financial crisis 2008
  covid:     { start_date: "2020-01-01", end_date: "2021-12-31" }, // Pandemic 2020–2021
};
