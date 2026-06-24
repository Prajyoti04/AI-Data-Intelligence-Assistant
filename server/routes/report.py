from fastapi import APIRouter
import pandas as pd

router = APIRouter()

current_df = None

def set_dataframe(df):
    global current_df
    current_df = df

@router.get("/report")
async def generate_report():

    global current_df

    if current_df is None:
        return {
            "error": "No dataset uploaded"
        }

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