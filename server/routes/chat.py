from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class ChatRequest(BaseModel):
    question: str

@router.post("/chat")
async def chat(request: ChatRequest):

    question = request.question.lower()

    if "records" in question:
        answer = "Dataset contains records."

    elif "female" in question:
        answer = "Female employee count analysis coming soon."

    elif "male" in question:
        answer = "Male employee count analysis coming soon."

    else:
        answer = "I don't understand that question yet."

    return {
        "answer": answer
    }