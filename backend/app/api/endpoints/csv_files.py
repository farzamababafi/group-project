import csv
from fastapi import APIRouter
from pathlib import Path
from app.api.utility.raw_data_extraction import raw_data_extraction

from app.api.classes.Stock import StockRequest

router = APIRouter()

DATA_DIR = Path(__file__).resolve().parents[3] / "data"


        
@router.get("/csv-files")
def list_csv_files():
    if not DATA_DIR.exists():
        return {"files": [], "message": "Data folder does not exist"}

    csv_files = sorted(f.stem for f in DATA_DIR.glob("*.csv"))
    return {"files": csv_files}
        
@router.get("/recommendation")
#def list_recommendation():
    #return {"recommendation": get_recommendations()}

@router.get("/per-year")
def list_per_year():
    output_file = DATA_DIR / "processed_data" /"yearly_average.csv"
    if not output_file.exists():
        return {"data": [], "message": "Yearly average file not generated"}

    data = []

    with open(output_file, mode="r", newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            data.append(row)

    return {"data": data}

@router.post("/stockreq")
def get_data(request: StockRequest):
    data = raw_data_extraction(request.stock_name, request.start_date, request.end_date)
    return {"data": data}