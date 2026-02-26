from fileinput import filename
import pandas as pd
from datetime import date
from pathlib import Path

    


DATA_DIR = Path(__file__).resolve().parents[3] / "data"
def raw_data_extraction(stock_name: str , start_date:str=None , end_date:str=None):
    file_name = DATA_DIR / f"{stock_name}.csv"

    if start_date is None or end_date is None:
        raise ValueError("Both start_date and end_date must be provided")
    
    if not file_name.exists():
        raise FileNotFoundError(f"Stock file {file_name} not found")

    df = pd.read_csv(file_name)
    
    df['Date'] = pd.to_datetime(df['Date'], dayfirst=True)

    


    start = pd.to_datetime(start_date)
    end = pd.to_datetime(end_date)


    min_date = df["Date"].min()
    max_date = df["Date"].max()

    if start>=end:
        raise ValueError("start_date must be strictly earlier than end_date")

    if start< min_date and end>max_date:
        raise ValueError(f"Date out of range. Available range: {min_date.date()} to {max_date.date()}")
         
    df = df[(df['Date']>=start)&(df['Date']<=end)]

    df['Date'] = df['Date'].dt.strftime('%Y-%m-%d')
    return df.to_dict(orient="records") 


