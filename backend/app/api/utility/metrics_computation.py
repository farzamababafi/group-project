from fileinput import filename
import pandas as pd
from datetime import date
from pathlib import Path
import numpy as np
import raw_data_extraction as single_stock_data

def calculate_log_returns(stock_name, start_date, end_date):

    df = pd.DataFrame(single_stock_data.raw_data_extraction(stock_name, start_date, end_date))
    df["Date"] = pd.to_datetime(df["Date"])
    df = df.sort_values("Date")

    log_returns = np.log(df["Close"] / df["Close"].shift(1)).dropna()
    volatility = log_returns.std(ddof=1) * np.sqrt(252)
    
    return volatility