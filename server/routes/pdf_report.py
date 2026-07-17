from fastapi import APIRouter
from fastapi.responses import StreamingResponse, JSONResponse
from pydantic import BaseModel
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors
from datetime import datetime
import io

from server.services.dataset_store import get_dataset

router = APIRouter()


class DownloadReportRequest(BaseModel):
    upload_id: str


@router.post("/download-report")
async def download_report(data: DownloadReportRequest):
    try:
        current_df = get_dataset(data.upload_id)
    except KeyError:
        return JSONResponse(
            status_code=404,
            content={"error": "Dataset not found. Please upload a file first."},
        )

    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer)
    styles = getSampleStyleSheet()
    content = []

    content.append(Paragraph("AI Data Intelligence Platform", styles["Title"]))
    content.append(Paragraph("Automated Data Analysis Report", styles["Heading2"]))
    content.append(Spacer(1, 12))
    content.append(
        Paragraph(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}", styles["Normal"])
    )
    content.append(Spacer(1, 12))

    # Overview table
    overview_data = [
        ["Metric", "Value"],
        ["Total Rows", str(len(current_df))],
        ["Total Columns", str(len(current_df.columns))],
        ["Missing Values", str(current_df.isnull().sum().sum())],
        ["Duplicate Rows", str(current_df.duplicated().sum())],
    ]
    t = Table(overview_data, colWidths=[200, 200])
    t.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1E3A5F")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
                ("BACKGROUND", (0, 1), (-1, -1), colors.HexColor("#F8FAFC")),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#EFF6FF")]),
            ]
        )
    )
    content.append(t)
    content.append(Spacer(1, 20))

    content.append(Paragraph("Column Names", styles["Heading2"]))
    for col in current_df.columns:
        content.append(Paragraph(f"• {col}", styles["Normal"]))

    content.append(Spacer(1, 15))

    numeric_cols = current_df.select_dtypes(include=["int64", "float64"]).columns
    if len(numeric_cols) > 0:
        content.append(Paragraph("Summary Statistics", styles["Heading2"]))
        summary = current_df[numeric_cols].describe()

        for col in numeric_cols:
            content.append(Paragraph(f"{col}", styles["Heading3"] if "Heading3" in styles else styles["Heading2"]))
            content.append(Paragraph(f"Mean: {round(summary[col]['mean'], 4)}", styles["Normal"]))
            content.append(Paragraph(f"Min: {round(summary[col]['min'], 4)}", styles["Normal"]))
            content.append(Paragraph(f"Max: {round(summary[col]['max'], 4)}", styles["Normal"]))
            content.append(Paragraph(f"Std Dev: {round(summary[col]['std'], 4)}", styles["Normal"]))
            content.append(Spacer(1, 8))

    doc.build(content)
    buffer.seek(0)

    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=analytics_report.pdf"},
    )
