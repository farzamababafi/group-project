import pandas as pd
from datetime import date
from pathlib import Path


DATA_DIR = Path(__file__).resolve().parents[3] / "data"

def yearly_data_average():

    if not DATA_DIR.exists():
        raise FileNotFoundError(f"DATA_DIR not found: {DATA_DIR}")

    all_data = []  # will store all rows from all CSV files

    # Loop through every CSV file
    for file in DATA_DIR.iterdir():
        df = pd.read_csv(file)

        # Convert Date column to datetime
        df["Date"] = pd.to_datetime(df["Date"], dayfirst=True)

        # Extract year
        df["Year"] = df["Date"].dt.year

        all_data.append(df)

    if not all_data:
        return []

    combined_df = pd.concat(all_data, ignore_index=True) # Combine all data into a single DataFrame

    # Group by year and compute averages
    yearly_avg = (
        combined_df
        .groupby("Year")[["Low", "Open", "Volume", "High", "Close", "Adjusted Close"]]
        .mean()
        .reset_index()
    )

    # Formatting the columns to 2 decimal places
    for col in ["Low", "Open", "Volume", "High", "Close", "Adjusted Close"]:
        yearly_avg[col] = yearly_avg[col].round(2)

    # Convert to list of dictionaries
    result = yearly_avg.to_dict(orient="records")

    # Convert Year to string
    for row in result:
        row["Year"] = str(row["Year"])

    return result



