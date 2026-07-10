from fastapi import APIRouter, UploadFile, File
import pandas as pd

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
    try:

        # Read uploaded file
        if file.filename.lower().endswith(".csv"):
            df = pd.read_csv(file.file)

        elif file.filename.lower().endswith((".xlsx", ".xls")):
            df = pd.read_excel(file.file, engine="openpyxl")

        else:
            return {
                "error": "Only CSV and Excel files are supported."
            }

        # Save uploaded dataset
        try:
            df.to_csv("uploaded_dataset.csv", index=False)
        except Exception as e:
            print("CSV Save Error:", e)

        # Preview data
        preview = (
            df.head(10)
            .fillna("")
            .astype(str)
            .to_dict(orient="records")
        )

        dataset = (
            df.head(100)
            .fillna("")
            .astype(str)
            .to_dict(orient="records")
        )

        # Numeric columns
        numeric_df = df.select_dtypes(include="number")

        if numeric_df.empty:
            correlation_matrix = {}
        else:
            correlation_matrix = (
                numeric_df.corr()
                .fillna(0)
                .round(2)
                .to_dict()
            )

        response = {
            "rows": int(len(df)),
            "columns": int(len(df.columns)),
            "missing_values": int(df.isnull().sum().sum()),
            "duplicates": int(df.duplicated().sum()),
            "preview": preview,
            "column_names": list(df.columns.astype(str)),
            "numeric_columns": list(numeric_df.columns.astype(str)),
            "dataset": dataset,
            "correlation_matrix": correlation_matrix,
            "recommended_task": recommend_ml_task(df)
        }

        print("Upload Successful")
        print("Keys:", response.keys())

        from fastapi.responses import JSONResponse

return JSONResponse(content=response)

    except Exception as e:
        import traceback

        print("=" * 60)
        print("UPLOAD ERROR")
        traceback.print_exc()
        print("=" * 60)

        return {
            "error": str(e)
        }