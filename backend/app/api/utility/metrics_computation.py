import pandas as pd
import numpy as np
import raw_data_extraction as single_stock_data

def calculate_volatility(df):
    df["Date"] = pd.to_datetime(df["Date"])
    df = df.sort_values("Date")
    log_returns = np.log(df["Close"] / df["Close"].shift(1)).dropna()
    volatility = log_returns.std(ddof=1) * np.sqrt(252)
    return volatility

def calculate_avg_log_returns(df):
    df["Date"] = pd.to_datetime(df["Date"])
    df = df.sort_values("Date")
    avg_log_return = (np.log(df["Close"] / df["Close"].shift(1)).dropna()).mean()
    return avg_log_return

def calculate_roi(df, stock_name, pre_crisis_start, pre_crisis_end):
    pre_crisis = pd.DataFrame(single_stock_data.raw_data_extraction(stock_name, pre_crisis_start, pre_crisis_end))
    r_pre_crisis = (pre_crisis["Close"].iloc[-1] - pre_crisis["Close"].iloc[0]) / pre_crisis["Close"].iloc[0]
    r_crisis = (df["Close"].iloc[-1] - df["Close"].iloc[0]) / df["Close"].iloc[0]
    roi_ratio = r_crisis / r_pre_crisis
    return roi_ratio

def calculate_recovery_duration(df, crisis_start, crisis_end):
    crisis_start_dt = pd.to_datetime(crisis_start)
    crisis_end_dt = pd.to_datetime(crisis_end)
    pre_crisis_start = crisis_start_dt.replace(year=crisis_start_dt.year - 1)
    
    pre_crisis = df[(df["Date"] >= pre_crisis_start) & (df["Date"] < crisis_start_dt)]
    peak_price = pre_crisis["Close"].max()
    
    crisis = df[(df["Date"] >= crisis_start_dt) & (df["Date"] <= crisis_end_dt)]
    t_bottom = crisis.loc[crisis["Close"].idxmin(), "Date"]
    
    post_bottom = df[df["Date"] > t_bottom]
    recovery = post_bottom[post_bottom["Close"] >= peak_price]
    
    if recovery.empty:
        return None
    
    t_recovery = recovery.iloc[0]["Date"]
    T_recovery = len(df[(df["Date"] > t_bottom) & (df["Date"] <= t_recovery)])
    return T_recovery

def main(stock_name, start_date, end_date):

    # create data frame of crisis period
    df = pd.DataFrame(single_stock_data.raw_data_extraction(stock_name, start_date, end_date))
    df["Date"] = pd.to_datetime(df["Date"])
    df = df.sort_values("Date")

    start_date_dt = pd.to_datetime(start_date)
    pre_crisis_start = start_date_dt.replace(year=start_date_dt.year - 1)
    pre_crisis_end = start_date_dt - pd.Timedelta(days=1)

    return {
        "volatility": calculate_volatility(df),
        "avg_log_return": calculate_avg_log_returns(df),
        "roi_ratio": calculate_roi(df, stock_name, pre_crisis_start, pre_crisis_end),
        "recovery_duration": calculate_recovery_duration(df, start_date, end_date)
    }