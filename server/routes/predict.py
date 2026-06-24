from fastapi import APIRouter
from pydantic import BaseModel
from sklearn.linear_model import LinearRegression
import pandas as pd

router = APIRouter()

current_df = None

def set_prediction_dataframe(df):
    global current_df
    current_df = df


from typing import Dict

class PredictionRequest(BaseModel):
    target: str
    inputs: Dict[str, float]


@router.post("/predict")
async def predict(data: PredictionRequest):

    global current_df

    if current_df is None:
        return {
            "error": "Upload dataset first"
        }

    target = data.target
    if target not in current_df.columns:
        return {
            "error": "Invalid target column"
        }

    numeric_columns = list(
        current_df.select_dtypes(
            include="number"
        ).columns
    )

    features = [
        col
        for col in numeric_columns
        if col != target
    ]

    X = current_df[features]

    y = current_df[target]

    model = LinearRegression()
    model.fit(X, y)

    input_values = []

    for col in features:

        if col not in data.inputs:
            return {
                "error":
                f"Missing value for {col}"
            }

        input_values.append(
            data.inputs[col]
        )

    input_df = pd.DataFrame(
        [input_values],
        columns=features
    )

    prediction = model.predict(input_df)

    return {
        "prediction":
            round(float(prediction[0]), 2),
        "features": features
    }