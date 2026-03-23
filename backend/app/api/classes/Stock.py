from pydantic import BaseModel, model_validator
from datetime import date

class StockRequest(BaseModel):
    stock_name: str
    start_date: date
    end_date: date

    @model_validator(mode="after")
    def validate_dates(self):
        if self.start_date >= self.end_date:
            raise ValueError("start_date must be strictly earlier than end_date")
        return self