from pydantic import BaseModel




class StockRequest(BaseModel):
    stock_name :str
    start_date : str
    end_date : str
