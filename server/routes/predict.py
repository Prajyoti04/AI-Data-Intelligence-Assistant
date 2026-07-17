from fastapi import APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from sklearn.linear_model import LinearRegression
import pandas as pd
from typing import Dict

from server.services.dataset_store import get_dataset

router = APIRouter()


class PredictionRequest(BaseModel):
    upload_id: str
    target: str
    inputs: Dict[str, float]


@router.post("/predict")
async def predict(data: PredictionRequest):
    print("[/predict] request", {"upload_id": data.upload_id, "target": data.target, "inputs": data.inputs})
    try:
        current_df = get_dataset(data.upload_id)
    except KeyError:
        return JSONResponse(
            status_code=404,
            content={"error": "Dataset not found. Please upload a file first."},
        )

    target = data.target

    if target not in current_df.columns:
        return JSONResponse(
            status_code=400,
            content={"error": f"Column '{target}' not found in dataset."},
        )

    numeric_columns = list(current_df.select_dtypes(include="number").columns)
    features = [col for col in numeric_columns if col != target]

    if not features:
        return JSONResponse(
            status_code=400,
            content={"error": "No numeric feature columns available for prediction."},
        )

    missing = [col for col in features if col not in data.inputs]
    if missing:
        return JSONResponse(
            status_code=400,
            content={"error": f"Missing input values for: {', '.join(missing)}"},
        )

    model_df = current_df[features + [target]].dropna()
    if model_df.empty:
        return JSONResponse(
            status_code=400,
            content={"error": "No complete numeric rows available for prediction."},
        )

    X = model_df[features]
    y = model_df[target]

    model = LinearRegression()
    model.fit(X, y)

    input_df = pd.DataFrame([[data.inputs[col] for col in features]], columns=features)
    prediction = model.predict(input_df)

    return {
        "prediction": round(float(prediction[0]), 4),
        "features": features,
        "target": target,
    }
