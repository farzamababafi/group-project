/**
 * Stock search & data request API.
 * - GET /api/csv-files → list of available stocks (for search bar).
 * - POST /api/stockreq → request stock data for a period (after selecting period + stock).
 */

import api from "@/lib/axios";
import type { StockRequestBody, CrisisPeriodKey, StockTimePoint, StockRequestResponse } from "@/lib/types";
import { CRISIS_PERIOD_DATES } from "@/lib/types";

// ─── GET /api/csv-files ───────────────────────────────────────────────────────

/** Backend returns { "files": ["A", "AAALY", "AAPL", ...] } — list of ticker symbols. */
export type CsvFileListItem = string;

export async function getCsvFiles(): Promise<CsvFileListItem[]> {
  const response = await api.get<unknown>("/api/csv-files");
  const data = response.data;
  // Backend returns { files: string[] }
  if (data && typeof data === "object" && "files" in data && Array.isArray((data as { files: unknown }).files))
    return (data as { files: CsvFileListItem[] }).files;
  if (Array.isArray(data)) return data as CsvFileListItem[];
  if (data && typeof data === "object" && "csv_files" in data && Array.isArray((data as { csv_files: unknown }).csv_files))
    return (data as { csv_files: CsvFileListItem[] }).csv_files;
  return [];
}

/** Normalize API list to { ticker, name } for UI. Strips .csv if present. */
export function csvListToStocks(files: CsvFileListItem[]): { ticker: string; name: string }[] {
  return files.map((item) => {
    const ticker = item.replace(/\.csv$/i, "").trim() || item;
    return { ticker, name: ticker };
  });
}

// ─── POST /api/stockreq ───────────────────────────────────────────────────────

/**
 * Request raw time‑series data for a stock within a crisis period.
 *
 * Backend returns:
 *   { data: Array<{ Date, Open, High, Low, Close, Volume, "Adjusted Close" }> }
 */

export async function postStockRequest(body: StockRequestBody): Promise<StockRequestResponse> {
  const response = await api.post<unknown>("/api/stockreq", body);
  const payload: any = response.data as any;

  const recommendationText: string = payload?.recommendation ?? "Placeholder";
  const rawArray: any[] = Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload)
      ? payload
      : [];

  // Normalize types so Recharts always gets numbers + ISO date strings
  const dataArray = rawArray.map((row) => ({
    Date: String(row.Date),
    Open: Number(row.Open),
    High: Number(row.High),
    Low: Number(row.Low),
    Close: Number(row.Close),
    Volume: Number(row.Volume),
    "Adjusted Close": Number(row["Adjusted Close"]),
  }));

  return {
    dataArray,
    recommendationText,
  };
}

// ─── Crisis period dates (re-export for convenience) ───────────────────────────

export type { CrisisPeriodKey };
export { CRISIS_PERIOD_DATES };

export function getCrisisDates(period: CrisisPeriodKey) {
  return CRISIS_PERIOD_DATES[period];
}
