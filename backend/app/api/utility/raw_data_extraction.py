from turtle import st

import pandas as pd
from pathlib import Path
from datetime import datetime


DATA_DIR = Path(__file__).resolve().parents[3] / "data"
def raw_data_extraction(stock_name: str , start_date:str=None , end_date:str=None):
    
    file_name = DATA_DIR / f"{stock_name}.csv"
    start = pd.to_datetime(start_date)
    end = pd.to_datetime(end_date)
    
    df = pd.read_csv(file_name)
    df['Date'] = pd.to_datetime(df['Date'], dayfirst=True)
    
    min_date = df["Date"].min()
    max_date = df["Date"].max()
    print(type(min_date), type(start), type(max_date), type(end))
    if start < min_date or end > max_date:
        raise ValueError(f"Date out of range. Available range: {min_date.date()} to {max_date.date()}")


    df = df[(df['Date']>=start)&(df['Date']<=end)]

    df['Date'] = df['Date'].dt.strftime('%Y-%m-%d')
    return df.to_dict(orient="records") 


