"""
POST /dataset

Returns the full dataset rows for a given upload_id.
Called lazily by the Visualizations page when it first mounts — not during
upload — so the initial upload response stays lightweight.
"""
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import pandas as pd

from server.services.dataset_store import get_dataset

router = APIRouter()


class DatasetRequest(BaseModel):
    upload_id: str


@router.post("/dataset")
async def get_dataset_rows(data: DatasetRequest):
    print("[/dataset] request", {"upload_id": data.upload_id})
    try:
        df = get_dataset(data.upload_id)
    except KeyError:
        return JSONResponse(
            status_code=404,
            content={"error": "Dataset not found. The server may have restarted — please re-upload your file."},
        )

    # Return up to 2000 rows for client-side charting.
    # Large datasets are sampled so the JSON payload stays reasonable.
    sample = df.head(2000)
    rows = sample.astype(object).where(pd.notnull(sample), None).to_dict(orient="records")
    response = {"dataset": rows, "total_rows": int(len(df))}
    print("[/dataset] response", {"rows": len(rows), "total_rows": response["total_rows"]})

    return response
