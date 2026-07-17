from fastapi import APIRouter
from fastapi.responses import StreamingResponse, JSONResponse
from pydantic import BaseModel
import pandas as pd
import io

from server.services.dataset_store import get_dataset, update_dataset

router = APIRouter()


class CleanRequest(BaseModel):
    upload_id: str


class DownloadCleanedRequest(BaseModel):
    upload_id: str


@router.post("/clean")
async def clean_dataset(data: CleanRequest):
    try:
        current_df = get_dataset(data.upload_id)
    except KeyError:
        return JSONResponse(
            status_code=404,
            content={"error": "Dataset not found. Please upload a file first."},
        )

    cleaned_df = current_df.copy()
    before_rows = len(cleaned_df)

    cleaned_df = cleaned_df.drop_duplicates()
    duplicates_removed = before_rows - len(cleaned_df)

    for col in cleaned_df.select_dtypes(include="number").columns:
        cleaned_df[col] = cleaned_df[col].fillna(cleaned_df[col].mean())

    for col in cleaned_df.select_dtypes(exclude="number").columns:
        mode_vals = cleaned_df[col].mode()
        mode = mode_vals[0] if not mode_vals.empty else "Unknown"
        cleaned_df[col] = cleaned_df[col].fillna(mode)

    update_dataset(data.upload_id, cleaned_df)

    return {
        "rows_before": before_rows,
        "rows_after": len(cleaned_df),
        "duplicates_removed": duplicates_removed,
        "missing_after": int(cleaned_df.isnull().sum().sum()),
    }


@router.post("/download-cleaned")
async def download_cleaned(data: DownloadCleanedRequest):
    try:
        cleaned_df = get_dataset(data.upload_id)
    except KeyError:
        return JSONResponse(
            status_code=404,
            content={"error": "Dataset not found. Please upload a file first."},
        )

    csv_bytes = cleaned_df.to_csv(index=False).encode("utf-8")
    return StreamingResponse(
        io.BytesIO(csv_bytes),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=cleaned_dataset.csv"},
    )
