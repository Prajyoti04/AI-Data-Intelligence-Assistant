from fastapi import APIRouter, UploadFile, File
import pandas as pd
import os

router = APIRouter()


def recommend_ml_task(df):
    target = df.columns[-1]
    unique_values = df[target].nunique()

    if unique_values < 10:
        return {
            "task": "Classification",
            "algorithms": [
                "Logistic Regression",
                "Random Forest",
                "XGBoost"
            ]
        }

    elif unique_values > 20:
        return {
            "task": "Regression",
            "algorithms": [
                "Linear Regression",
                "Random Forest Regressor",
                "XGBoost Regressor"
            ]
        }

    else:
        return {
            "task": "Clustering",
            "algorithms": [
                "KMeans",
                "DBSCAN",
                "Hierarchical Clustering"
            ]
        }


@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):

    if file.filename.endswith(".csv"):
        df = pd.read_csv(file.file)
    else:
        df = pd.read_excel(file.file)

    # Save uploaded dataset
    df.to_csv("uploaded_dataset.csv", index=False)

    preview = df.head(10).fillna("").to_dict(orient="records")

    dataset = df.head(100).fillna("").to_dict(orient="records")

    numeric_df = df.select_dtypes(include="number")

    correlation_matrix = (
        numeric_df.corr()
        .fillna(0)
        .round(2)
        .to_dict()
    )

    return {
        "rows": len(df),
        "columns": len(df.columns),
        "missing_values": int(df.isnull().sum().sum()),
        "duplicates": int(df.duplicated().sum()),
        "preview": preview,
        "column_names": list(df.columns),
        "numeric_columns": list(numeric_df.columns),
        "dataset": dataset,
        "correlation_matrix": correlation_matrix,
        "recommended_task": recommend_ml_task(df)
    }