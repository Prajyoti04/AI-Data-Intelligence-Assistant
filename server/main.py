from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from server.routes.upload import router as upload_router
from server.routes.chat import router as chat_router
from server.routes.report import router as report_router
from server.routes.pdf_report import router as pdf_router
from server.routes.predict import (router as predict_router)
from server.routes.clean import router as clean_router
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router)
app.include_router(chat_router)
app.include_router(report_router)
app.include_router(pdf_router)
app.include_router(predict_router)
app.include_router(clean_router)
@app.get("/")
def home():
    return {
        "message": "AI Data Intelligence Platform API"
    }