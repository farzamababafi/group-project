from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
#from .routers import stock_data

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],)
#app.include_router(stock_data.router, prefix="/api/stock-data", tags=["stock-data"])
@app.get("/api/get-stock-data")
def get_stock_data():
    return {"message": "This is a placeholder for the stock data endpoint."}