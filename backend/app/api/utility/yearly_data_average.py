import pandas as pd
from pathlib import Path
from typing import Iterable


BASE_DIR = Path(__file__).resolve().parents[3]

RAW_DATA_DIR = BASE_DIR / "data"
PROCESSED_DIR = BASE_DIR / "processed_data"

OUTPUT_FILE = PROCESSED_DIR / "yearly_average.csv"
def yearly_data_average(
    save_to_csv: bool = True,
    file_names: Iterable[str] | None = None,
):

    if not RAW_DATA_DIR.exists():
        raise FileNotFoundError(f"RAW_DATA_DIR not found: {RAW_DATA_DIR}")

    # We'll maintain an accumulator of per-year sums and counts so we can
    # merge each file's statistics incrementally without keeping all rows in
    # memory at once.
    numeric_cols = ["Low", "Open", "Volume", "High", "Close", "Adjusted Close"]
    grouped_list = []

    if file_names is None:
        files = RAW_DATA_DIR.glob("*.csv")
    else:
        files = []
        for file_name in file_names:
            path = Path(file_name)
            if path.suffix.lower() != ".csv":
                path = path.with_suffix(".csv")
            files.append(RAW_DATA_DIR / path.name)

    for file in files:
        try:
            df = pd.read_csv(file)
        except Exception:
            continue

        if "Date" not in df.columns:
            continue

        df["Date"] = pd.to_datetime(df["Date"], dayfirst=True)
        df = df.dropna(subset=["Date"])

        if df.empty:
            continue

        df["Year"] = df["Date"].dt.year

        grouped = df.groupby("Year")[numeric_cols].agg(["sum", "count"])
        grouped.columns = [f"{col}_{agg}" for col, agg in grouped.columns]
        grouped = grouped.reset_index()

        grouped_list.append(grouped)

    if not grouped_list:
        return []

    combined = pd.concat(grouped_list, ignore_index=True)
    accum = combined.groupby("Year").sum().reset_index()

    # produce the average from sums and counts
    yearly_avg = accum[["Year"]].copy()
    for col in numeric_cols:
        yearly_avg[col] = (accum[f"{col}_sum"] / accum[f"{col}_count"]).round(2)
    yearly_avg = yearly_avg.sort_values("Year").reset_index(drop=True)
    if save_to_csv:
        PROCESSED_DIR.mkdir(parents=True, exist_ok=True)  # 🔥 critical
        yearly_avg.to_csv(OUTPUT_FILE, index=False)
        return True
    return yearly_avg.to_dict(orient="records")


if __name__ == "__main__":
    df = yearly_data_average(save_to_csv=True)
    print("Yearly average CSV generated.")
