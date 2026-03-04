/**
 * Stock search & data request API.
 * - GET /api/csv-files → list of available stocks (for search bar).
 * - POST /api/stockreq → request stock data for a period (after selecting period + stock).
 */

import api from "@/lib/axios";
import type { StockRequestBody, CrisisPeriodKey } from "@/lib/types";
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

/** Response is a string (e.g. success message or file path). */
export async function postStockRequest(body: StockRequestBody): Promise<string> {
  const response = await api.post<string>("/api/stockreq", body);
  return typeof response.data === "string" ? response.data : JSON.stringify(response.data);
}

// ─── Crisis period dates (re-export for convenience) ───────────────────────────

export type { CrisisPeriodKey };
export { CRISIS_PERIOD_DATES };

export function getCrisisDates(period: CrisisPeriodKey) {
  return CRISIS_PERIOD_DATES[period];
}
