import pandas as pd
from pathlib import Path
from datetime import datetime
from fastapi import HTTPException
    


DATA_DIR = Path(__file__).resolve().parents[3] / "data"
def raw_data_extraction(stock_name: str , start_date:str=None , end_date:str=None):
    file_name = DATA_DIR / f"{stock_name}.csv"

    try:

        if not file_name.exists():
            raise HTTPException(status_code=404, detail=f"Stock file {file_name} not found")

        if start_date is None or end_date is None:
            raise HTTPException(status_code=400, detail="Both start_date and end_date must be provided")


        
        start = pd.to_datetime(start_date)
        end = pd.to_datetime(end_date)

        if start >= end:
            raise HTTPException(status_code=400, detail="start_date must be strictly earlier than end_date")

        
        try:
            df = pd.read_csv(file_name)
        except pd.errors.EmptyDataError:
            raise HTTPException(status_code=404, detail=f"Stock file {file_name} is empty")
        except pd.errors.ParserError:
            raise HTTPException(status_code=400, detail="CSV file is malformed")
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error reading stock file {file_name}: {str(e)}")

        if "Date" not in df.columns:
            raise HTTPException(status_code=400, detail="CSV file is missing required 'Date' column")

        df["Date"] = pd.to_datetime(df["Date"], dayfirst=True, errors="coerce")
        if df["Date"].isna().all():
            raise HTTPException(status_code=400, detail="CSV file has no valid 'Date' values")

        min_date = df["Date"].min()
        max_date = df["Date"].max()
       
        if start < min_date or end > max_date:
            raise HTTPException(status_code=400, detail=f"Date out of range. Available range: {min_date.date()} to {max_date.date()}")


        df = df[(df['Date']>=start)&(df['Date']<=end)]

        df['Date'] = df['Date'].dt.strftime('%Y-%m-%d')
        return df.to_dict(orient="records") 
    
    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail="Unexpected error while processing this stock's historical data. Please try a different date range or stock.",
        )