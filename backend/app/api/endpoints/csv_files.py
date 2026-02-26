from fastapi import APIRouter
from pathlib import Path

router = APIRouter()

DATA_DIR = Path(__file__).resolve().parents[3] / "data"

@router.get("/csv-files")
def list_csv_files():
    if not DATA_DIR.exists():
        return {"files": [], "message": "Data folder does not exist"}

    csv_files = sorted(f.stem for f in DATA_DIR.glob("*.csv"))
    print (csv_files)
    return {"files": csv_files}


@router.get("/example1")
def list_csv_files():
    return {"files": "Hi"}

@router.get("/example")
def list_csv_files():
    return {"files": "Hello"}

# from app.api.utility.raw_data_extraction import raw_data_extraction,StockRequest

# @router.post("/stockreq")
# def get_data(request: StockRequest):
#     data = raw_data_extraction(request.stock_name, request.start_date, request.end_date)
#     return {"data": data}