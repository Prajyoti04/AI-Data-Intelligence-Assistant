from fastapi import APIRouter
import pandas as pd
import os

router = APIRouter()


@router.get("/report")
async def generate_report():

    if not os.path.exists("uploaded_dataset.csv"):
        return {
            "error": "No dataset uploaded"
        }

    current_df = pd.read_csv("uploaded_dataset.csv")

    numeric_cols = current_df.select_dtypes(
        include=["int64", "float64"]
    ).columns.tolist()

    return {
        "rows": len(current_df),
        "columns": len(current_df.columns),
        "missing_values": int(
            current_df.isnull().sum().sum()
        ),
        "duplicates": int(
            current_df.duplicated().sum()
        ),
        "numeric_columns": numeric_cols,
        "summary": current_df.describe().to_dict()
    }