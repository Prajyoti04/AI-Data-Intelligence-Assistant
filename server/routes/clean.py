from fastapi import APIRouter
from fastapi.responses import FileResponse
import pandas as pd

router = APIRouter()

current_df = None
cleaned_df = None

def set_clean_dataframe(df):
    global current_df
    current_df = df

@router.post("/clean")
async def clean_dataset():

    global current_df, cleaned_df

    if current_df is None:
        return {"error": "Upload dataset first"}

    cleaned_df = current_df.copy()

    before_rows = len(cleaned_df)

    # remove duplicates
    cleaned_df = cleaned_df.drop_duplicates()

    duplicates_removed = (
        before_rows - len(cleaned_df)
    )

    # numeric columns
    for col in cleaned_df.select_dtypes(include="number"):
        cleaned_df[col] = (
            cleaned_df[col]
            .fillna(cleaned_df[col].mean())
        )

    # text columns
    for col in cleaned_df.select_dtypes(exclude="number"):
        mode = (
            cleaned_df[col].mode()[0]
            if not cleaned_df[col].mode().empty
            else "Unknown"
        )

        cleaned_df[col] = (
            cleaned_df[col].fillna(mode)
        )

    cleaned_df.to_csv(
        "cleaned_dataset.csv",
        index=False
    )

    return {
        "rows_before": before_rows,
        "rows_after": len(cleaned_df),
        "duplicates_removed": duplicates_removed,
        "missing_after":
            int(cleaned_df.isnull().sum().sum())
    }

@router.get("/download-cleaned")
async def download_cleaned():

    return FileResponse(
        "cleaned_dataset.csv",
        filename="cleaned_dataset.csv",
        media_type="text/csv"
    )