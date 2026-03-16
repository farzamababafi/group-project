import pandas as pd
import numpy as np
from app.api.utility import raw_data_extraction as single_stock_data

def calculate_volatility(df):

    log_returns = np.log(df["Close"] / df["Close"].shift(1)).dropna()
    volatility = log_returns.std(ddof=1) * np.sqrt(252)  # standard deviation on log_returns

    return volatility


def calculate_avg_log_returns(df):

    # same as log_returns in volatility but with .mean()
    avg_log_return = (np.log(df["Close"] / df["Close"].shift(1)).dropna()).mean()

    return avg_log_return


def calculate_roi(df, pre_crisis):

    if pre_crisis.empty:
        return None

    r_pre_crisis = (
        pre_crisis["Close"].iloc[-1] - pre_crisis["Close"].iloc[0]
    ) / pre_crisis["Close"].iloc[0]
    if r_pre_crisis == 0:
        return None
    r_crisis = (
        df["Close"].iloc[-1] - df["Close"].iloc[0]
    ) / df["Close"].iloc[0]

    roi_ratio = r_crisis / r_pre_crisis

    return roi_ratio


def calculate_recovery_duration(df, crisis_start, crisis_end, pre_crisis):
    
    # crisis dates
    crisis_start_dt = pd.to_datetime(crisis_start)
    crisis_end_dt = pd.to_datetime(crisis_end)
    
    # peak price before crisis using the pre_crisis slice
    peak_price = pre_crisis["Close"].max()
    
    # lowest closing price during crisis
    crisis = df[(df["Date"] >= crisis_start_dt) & (df["Date"] <= crisis_end_dt)]
    t_bottom = crisis.loc[crisis["Close"].idxmin(), "Date"]
    
    # separate data frame starting lowest closing price date
    post_bottom = df[df["Date"] > t_bottom]
    recovery = post_bottom[post_bottom["Close"] >= peak_price]
    
    if recovery.empty:
        return None
    
    t_recovery = recovery.iloc[0]["Date"]
    T_recovery = len(df[(df["Date"] > t_bottom) & (df["Date"] <= t_recovery)])
    
    return T_recovery

def main(data, stock_name, start_date, end_date):

    df = pd.DataFrame(data)
    df["Date"] = pd.to_datetime(df["Date"])
    df = df.sort_values("Date")

    start_date_dt = pd.to_datetime(start_date)
    pre_crisis_start = start_date_dt.replace(year=start_date_dt.year - 1)
    pre_crisis_end = start_date_dt - pd.Timedelta(days=1)
    # Extract pre-crisis data **once**
    pre_crisis = pd.DataFrame(
        single_stock_data.raw_data_extraction(
            stock_name,
            pre_crisis_start,
            pre_crisis_end
        )
    )

    return {
        "volatility": calculate_volatility(df),
        "avg_log_return": calculate_avg_log_returns(df),
        "roi_ratio": calculate_roi(df, pre_crisis),
        "recovery_duration": calculate_recovery_duration(df, start_date, end_date, pre_crisis)
    }