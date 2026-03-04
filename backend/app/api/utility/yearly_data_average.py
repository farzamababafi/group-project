import pandas as pd
from datetime import date
from pathlib import Path


DATA_DIR = Path(__file__).resolve().parents[3] / "data"

def yearly_data_average():

    if not DATA_DIR.exists():
        raise FileNotFoundError(f"DATA_DIR not found: {DATA_DIR}")

    # We'll maintain an accumulator of per-year sums and counts so we can
    # merge each file's statistics incrementally without keeping all rows in
    # memory at once.
    numeric_cols = ["Low", "Open", "Volume", "High", "Close", "Adjusted Close"]
    accum = None  # DataFrame with columns Year, <col>_sum, <col>_count

    for file in DATA_DIR.iterdir():
        try:
            df = pd.read_csv(file)
        except Exception as exc:
            print(f"Skipping {file.name}: cannot read CSV ({exc})")
            continue

        if "Date" not in df.columns:
            print(f"Skipping {file.name}: no 'Date' column")
            continue

        df["Date"] = pd.to_datetime(df["Date"], dayfirst=True)
        df = df.dropna(subset=["Date"])
        if df.empty:
            continue
        df["Year"] = df["Date"].dt.year

        # compute per-file sums and counts
        grouped = df.groupby("Year")[numeric_cols].agg(["sum", "count"])
        # flatten MultiIndex columns
        grouped.columns = [f"{col}_{agg}" for col, agg in grouped.columns]
        grouped = grouped.reset_index()

        if accum is None:
            accum = grouped
        else:
            # merge existing accum with new statistics
            accum = pd.merge(accum, grouped, on="Year", how="outer", suffixes=("", "_new"))
            # for each numeric column add sums and counts
            for col in numeric_cols:
                sum_col = f"{col}_sum"
                cnt_col = f"{col}_count"
                new_sum = f"{sum_col}_new"
                new_cnt = f"{cnt_col}_new"

                accum[sum_col] = accum[sum_col].fillna(0) + accum.get(new_sum, 0).fillna(0)
                accum[cnt_col] = accum[cnt_col].fillna(0) + accum.get(new_cnt, 0).fillna(0)

                # drop the temporary columns if they exist
                if new_sum in accum.columns:
                    accum.drop(columns=[new_sum], inplace=True)
                if new_cnt in accum.columns:
                    accum.drop(columns=[new_cnt], inplace=True)

    if accum is None or accum.empty:
        return []

    # produce the average from sums and counts
    yearly_avg = accum[["Year"] + numeric_cols].copy()
    for col in numeric_cols:
        yearly_avg[col] = (accum[f"{col}_sum"] / accum[f"{col}_count"]).round(2)

    # Convert to list of dictionaries
    result = yearly_avg.to_dict(orient="records")

    return result



