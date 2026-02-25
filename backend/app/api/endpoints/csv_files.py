from fastapi import APIRouter
from pathlib import Path

router = APIRouter()

DATA_DIR = Path(__file__).resolve().parents[3] / "data"

@router.get("/csv-files")
def list_csv_files():
    if not DATA_DIR.exists():
        return {"files": [], "message": "Data folder does not exist"}

    csv_files = sorted(f.stem for f in DATA_DIR.glob("*.csv"))
    return {"files": csv_files}

@router.get("/example1")
def list_csv_files():
    return {"files": "World"}

@router.get("/example")
def list_csv_files():
    return {"files": "random text"}