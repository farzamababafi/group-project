/**
 * Dummy per-year sector data — mirrors the shape of GET /api/per-year:
 *   { data: Array<Record<string, string>> }
 *
 * Each entry represents one calendar year's average OHLCV for a given sector.
 * Replace with real API calls once the backend is updated.
 */

import type { SectorKey } from "@/components/global/SectorSelector";
import type { StockTimePoint } from "@/lib/types";

// Raw shape returned by the /per-year endpoint (all strings, from CSV DictReader)
type RawYearRow = Record<string, string>;

interface PerYearResponse {
  data: RawYearRow[];
}

// ─── Yearly close prices per sector (index, 1995 = 100) ──────────────────────
// Each number is the annual "close" value. Reflects real sector dynamics:
//   - Dot-com crash:      2000-2002 (IT, Communication Services hard hit)
//   - Financial crisis:   2007-2009 (Financials, Real Estate, Industrials)
//   - Covid crash/rally:  2020-2021 (broad dip then recovery)

const CLOSE_INDEX: Record<SectorKey, number[]> = {
  //                      95   96   97   98   99   00   01   02   03   04   05   06   07   08   09   10   11   12   13   14   15   16   17   18   19   20   21   22
  information_technology: [100, 125, 162, 200, 280, 230, 160, 105, 130, 158, 185, 215, 240, 155, 120, 165, 195, 220, 265, 305, 340, 370, 440, 480, 560, 490, 680, 580],
  communication_services: [100, 118, 142, 172, 220, 180, 130,  90, 108, 125, 140, 158, 170, 115,  95, 120, 135, 148, 172, 190, 205, 215, 245, 260, 295, 260, 340, 295],
  financials:             [100, 112, 128, 138, 152, 165, 158, 145, 155, 172, 192, 215, 230, 115,  72,  95, 110, 118, 140, 162, 168, 180, 210, 220, 240, 195, 255, 215],
  real_estate:            [100, 108, 118, 126, 135, 142, 148, 145, 155, 172, 195, 225, 245, 145,  95, 110, 120, 128, 148, 168, 172, 185, 210, 215, 235, 195, 265, 215],
  health_care:            [100, 110, 122, 130, 140, 148, 155, 150, 158, 170, 182, 195, 205, 175, 158, 175, 190, 210, 240, 275, 295, 310, 345, 365, 400, 380, 445, 410],
  consumer_staples:       [100, 108, 116, 122, 128, 132, 136, 132, 138, 146, 155, 165, 172, 155, 145, 158, 168, 178, 195, 210, 218, 225, 240, 248, 258, 245, 275, 255],
  utilities:              [100, 106, 112, 116, 120, 122, 118, 112, 118, 124, 130, 138, 145, 130, 122, 130, 136, 142, 152, 160, 158, 165, 175, 178, 188, 178, 200, 182],
  industrials:            [100, 112, 126, 136, 148, 158, 152, 140, 150, 165, 182, 205, 222, 155, 110, 142, 162, 178, 205, 228, 235, 250, 285, 298, 325, 278, 355, 305],
  consumer_discretionary: [100, 112, 128, 138, 152, 160, 150, 136, 148, 168, 188, 210, 228, 158, 115, 155, 175, 195, 228, 258, 272, 290, 330, 342, 382, 330, 465, 375],
  materials:              [100, 108, 118, 124, 132, 138, 128, 118, 125, 140, 158, 180, 198, 145, 102, 130, 145, 155, 175, 188, 182, 198, 225, 228, 242, 210, 275, 230],
  energy:                 [100, 106, 112, 102, 108, 118, 112, 105, 115, 135, 162, 195, 225, 165, 115, 138, 148, 152, 165, 158, 135, 128, 150, 162, 175, 140, 200, 172],
};

const YEARS = [
  1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006,
  2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018,
  2019, 2020, 2021, 2022,
];

// Derive Open, High, Low, Volume from the close index
function buildRows(closes: number[]): RawYearRow[] {
  return closes.map((close, i) => {
    const prev  = i === 0 ? close * 0.97 : closes[i - 1];
    const open  = prev;
    const spread = close * 0.06;
    const high  = (Math.max(open, close) + spread).toFixed(2);
    const low   = (Math.min(open, close) - spread).toFixed(2);
    const adjClose = (close * 0.98).toFixed(2); // slight dividend adj
    const volume = Math.round(1_000_000 + close * 50_000 * (0.8 + Math.random() * 0.4));
    return {
      Date: `${YEARS[i]}-01-01`,
      Open: open.toFixed(2),
      High: high,
      Low:  low,
      Close: close.toFixed(2),
      "Adjusted Close": adjClose,
      Volume: String(volume),
    };
  });
}

// Raw per-sector API responses (format mirrors GET /per-year)
export const SECTOR_RAW_DATA: Record<SectorKey, PerYearResponse> = Object.fromEntries(
  (Object.keys(CLOSE_INDEX) as SectorKey[]).map((key) => [
    key,
    { data: buildRows(CLOSE_INDEX[key]) },
  ])
) as Record<SectorKey, PerYearResponse>;

// ─── Normalised StockTimePoint[] — ready for <StockCharts> ────────────────────
export function getSectorTimeSeries(sector: SectorKey): StockTimePoint[] {
  return SECTOR_RAW_DATA[sector].data.map((row) => ({
    Date:             String(row.Date),
    Open:             Number(row.Open),
    High:             Number(row.High),
    Low:              Number(row.Low),
    Close:            Number(row.Close),
    Volume:           Number(row.Volume),
    "Adjusted Close": Number(row["Adjusted Close"]),
  }));
}
