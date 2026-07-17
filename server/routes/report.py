from fastapi import APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from server.services.dataset_store import get_dataset

router = APIRouter()


class ReportRequest(BaseModel):
    upload_id: str


@router.post("/report")
async def generate_report(data: ReportRequest):
    try:
        current_df = get_dataset(data.upload_id)
    except KeyError:
        return JSONResponse(
            status_code=404,
            content={"error": "Dataset not found. Please upload a file first."},
        )

    numeric_cols = current_df.select_dtypes(include=["int64", "float64"]).columns.tolist()

    return {
        "rows": len(current_df),
        "columns": len(current_df.columns),
        "missing_values": int(current_df.isnull().sum().sum()),
        "duplicates": int(current_df.duplicated().sum()),
        "numeric_columns": numeric_cols,
        "summary": current_df.describe().fillna(0).to_dict(),
    }
