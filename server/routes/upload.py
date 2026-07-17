from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse
import pandas as pd
import json

from server.services.dataset_store import create_dataset

router = APIRouter()


def _recommend_ml_task(df: pd.DataFrame) -> dict:
    target = df.columns[-1]
    unique_values = df[target].nunique()
    if unique_values < 10:
        return {"task": "Classification",
                "algorithms": ["Logistic Regression", "Random Forest", "XGBoost"]}
    elif unique_values > 20:
        return {"task": "Regression",
                "algorithms": ["Linear Regression", "Random Forest Regressor", "XGBoost Regressor"]}
    else:
        return {"task": "Clustering",
                "algorithms": ["KMeans", "DBSCAN", "Hierarchical Clustering"]}


@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        filename = file.filename.lower()
        if filename.endswith(".csv"):
            df = pd.read_csv(file.file)
        elif filename.endswith((".xlsx", ".xls")):
            df = pd.read_excel(file.file, engine="openpyxl")
        else:
            return JSONResponse(status_code=400,
                                content={"error": "Only CSV and Excel files are supported."})

        upload_id = create_dataset(df)

        numeric_df = df.select_dtypes(include="number")
        correlation_matrix = (
            numeric_df.corr().fillna(0).round(2).to_dict()
            if not numeric_df.empty else {}
        )

        # Return lightweight metadata only — no full dataset rows.
        # The full dataset is served via POST /dataset when a page needs it.
        preview = json.loads(df.head(10).fillna("").astype(str).to_json(orient="records"))

        return JSONResponse(content={
            "upload_id":        upload_id,
            "rows":             int(len(df)),
            "columns":          int(len(df.columns)),
            "missing_values":   int(df.isnull().sum().sum()),
            "duplicates":       int(df.duplicated().sum()),
            "preview":          preview,
            "column_names":     list(df.columns.astype(str)),
            "numeric_columns":  list(numeric_df.columns.astype(str)),
            "correlation_matrix": correlation_matrix,
            "recommended_task": _recommend_ml_task(df),
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"error": str(e)})
