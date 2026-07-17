from fastapi import APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from server.services.dataset_store import get_dataset

router = APIRouter()


class ChatRequest(BaseModel):
    question: str
    upload_id: str | None = None


@router.post("/chat")
async def chat(request: ChatRequest):
    question = request.question.lower().strip()
    print("[/chat] request", {"upload_id": request.upload_id, "question": request.question})

    df = None
    if request.upload_id:
        try:
            df = get_dataset(request.upload_id)
        except KeyError:
            return JSONResponse(
                status_code=404,
                content={"error": "Dataset not found. Please upload a file first."},
            )

    # Route-based simple NLU
    if any(word in question for word in ["how many rows", "records", "row count"]):
        answer = (
            f"Your dataset contains {len(df):,} records."
            if df is not None else
            "Use the dashboard to see the row count after uploading a dataset."
        )
    elif any(word in question for word in ["columns", "features", "fields"]):
        answer = (
            f"Your dataset has {len(df.columns):,} columns: {', '.join(map(str, df.columns[:10]))}{'...' if len(df.columns) > 10 else ''}."
            if df is not None else
            "Check the Dataset Preview section to see all column names."
        )
    elif any(word in question for word in ["missing", "null", "na", "nan"]):
        answer = (
            f"Your dataset has {int(df.isnull().sum().sum()):,} missing values."
            if df is not None else
            "Missing values are shown on the Dashboard metric cards. Use Data Cleaning to fill them automatically."
        )
    elif any(word in question for word in ["duplicate"]):
        answer = (
            f"Your dataset has {int(df.duplicated().sum()):,} duplicate rows."
            if df is not None else
            "Duplicate row counts appear in the Dashboard metrics. Clean them via the Data Cleaning page."
        )
    elif any(word in question for word in ["predict", "machine learning", "ml", "model"]):
        answer = "Go to the Predictions page to run ML predictions using Linear Regression on any numeric target column."
    elif any(word in question for word in ["clean", "fix", "preprocess"]):
        answer = "Use the Data Cleaning page to remove duplicates and fill missing values with mean/mode imputation."
    elif any(word in question for word in ["correlation", "relation", "heatmap"]):
        answer = "The Visualizations page includes a Correlation Heatmap showing relationships between numeric columns."
    elif any(word in question for word in ["chart", "graph", "visual", "plot"]):
        answer = "Navigate to Visualizations to explore Bar, Pie, and Scatter charts, plus a Correlation Heatmap."
    elif any(word in question for word in ["report", "pdf", "download"]):
        answer = "Visit the Reports page to download a full PDF analytics report of your dataset."
    elif any(word in question for word in ["upload", "file", "csv", "excel"]):
        answer = "Upload CSV or Excel files using the Upload area on the Dashboard page."
    elif any(word in question for word in ["hello", "hi", "hey"]):
        answer = "Hello! I'm your AI Data Assistant. Ask me about your dataset, charts, cleaning, or predictions."
    else:
        answer = "I can answer questions about your dataset statistics, cleaning, predictions, and charts. Try asking: 'How do I clean my data?' or 'What is the correlation heatmap?'"

    return {"answer": answer}
