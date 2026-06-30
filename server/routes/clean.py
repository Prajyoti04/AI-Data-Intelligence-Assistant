from fastapi import APIRouter
from fastapi.responses import FileResponse
import pandas as pd
import os

router = APIRouter()


@router.post("/clean")
async def clean_dataset():

    if not os.path.exists("uploaded_dataset.csv"):
        return {
            "error": "Upload dataset first"
        }

    current_df = pd.read_csv("uploaded_dataset.csv")

    cleaned_df = current_df.copy()

    before_rows = len(cleaned_df)

    # Remove duplicate rows
    cleaned_df = cleaned_df.drop_duplicates()

    duplicates_removed = before_rows - len(cleaned_df)

    # Fill missing numeric values with mean
    for col in cleaned_df.select_dtypes(include="number").columns:
        cleaned_df[col] = cleaned_df[col].fillna(
            cleaned_df[col].mean()
        )

    # Fill missing text values with mode
    for col in cleaned_df.select_dtypes(exclude="number").columns:

        mode = (
            cleaned_df[col].mode()[0]
            if not cleaned_df[col].mode().empty
            else "Unknown"
        )

        cleaned_df[col] = cleaned_df[col].fillna(mode)

    # Save cleaned dataset
    cleaned_df.to_csv(
        "cleaned_dataset.csv",
        index=False
    )

    return {
        "rows_before": before_rows,
        "rows_after": len(cleaned_df),
        "duplicates_removed": duplicates_removed,
        "missing_after": int(
            cleaned_df.isnull().sum().sum()
        )
    }


@router.get("/download-cleaned")
async def download_cleaned():

    if not os.path.exists("cleaned_dataset.csv"):
        return {
            "error": "No cleaned dataset available"
        }

    return FileResponse(
        "cleaned_dataset.csv",
        filename="cleaned_dataset.csv",
        media_type="text/csv"
    )