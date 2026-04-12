import json
from pathlib import Path

import pandas as pd

from app.api.utility.yearly_data_average import PROCESSED_DIR, yearly_data_average


STOCK_DETAILS_FILE = PROCESSED_DIR / "stocks_details.csv"
OUTPUT_FILE = PROCESSED_DIR / "sector_yearly_average.json"


def generate_sector_yearly_averages() -> dict[str, list[dict]]:
    if not STOCK_DETAILS_FILE.exists():
        raise FileNotFoundError(f"Stock details file not found: {STOCK_DETAILS_FILE}")

    stock_details = pd.read_csv(STOCK_DETAILS_FILE)

    if "stock_name" not in stock_details.columns or "sector" not in stock_details.columns:
        raise ValueError("stocks_details.csv must contain 'stock_name' and 'sector' columns")

    sector_results: dict[str, list[dict]] = {}
    sector_groups = (
        stock_details[["stock_name", "sector"]]
        .dropna(subset=["stock_name", "sector"])
        .assign(
            stock_name=lambda df: df["stock_name"].astype(str).str.strip(),
            sector=lambda df: df["sector"].astype(str).str.strip(),
        )
    )

    for sector, group in sector_groups.groupby("sector"):
        if not sector:
            continue

        file_names = group["stock_name"].drop_duplicates().tolist()
        yearly_data = yearly_data_average(save_to_csv=False, file_names=file_names)

        if not yearly_data:
            continue

        sector_results[sector] = yearly_data

    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as json_file:
        json.dump(sector_results, json_file, indent=2)

    return sector_results


if __name__ == "__main__":
    data = generate_sector_yearly_averages()
    print(f"Generated sector yearly averages for {len(data)} sectors.")
