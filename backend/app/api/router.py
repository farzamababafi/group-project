from fastapi import APIRouter
from app.api.endpoints import csv_files

api_router = APIRouter()

api_router.include_router(
    csv_files.router,
    prefix="/api",
    tags=["csv-files"],
)

