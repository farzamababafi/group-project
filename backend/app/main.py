from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.router import api_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)
'''from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
#from .routers import stock_data

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],)
#app.include_router(stock_data.router, prefix="/api/stock-data", tags=["stock-data"])
DATA_DIR = Path(__file__).parent.parent / "data"  # points to backend/data

@app.get("/api/csv-files")
def list_csv_files():
    if not DATA_DIR.exists():
        return {"files": [], "message": "Data folder does not exist"}
    
    csv_files = sorted([f.name[:-4] for f in DATA_DIR.glob("*.csv")])
    return {"files": csv_files}'''