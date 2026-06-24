from fastapi import APIRouter
from fastapi.responses import FileResponse
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer
)
from reportlab.lib.styles import getSampleStyleSheet
from datetime import datetime

router = APIRouter()

current_df = None

def set_pdf_dataframe(df):
    global current_df
    current_df = df


@router.get("/download-report")
async def download_report():

    global current_df

    if current_df is None:
        return {"error": "No dataset uploaded"}

    pdf_file = "analytics_report.pdf"

    doc = SimpleDocTemplate(pdf_file)

    styles = getSampleStyleSheet()

    content = []

    content.append(
        Paragraph(
            "AI Data Intelligence Platform",
            styles["Title"]
        )
    )

    content.append(
        Paragraph(
            "Automated Data Analysis Report",
            styles["Heading2"]
        )
    )

    content.append(Spacer(1, 12))

    content.append(
        Paragraph(
            f"Generated On: {datetime.now()}",
            styles["Normal"]
        )
    )

    content.append(Spacer(1, 12))

    content.append(
        Paragraph(
            f"Rows: {len(current_df)}",
            styles["Normal"]
        )
    )

    content.append(
        Paragraph(
            f"Columns: {len(current_df.columns)}",
            styles["Normal"]
        )
    )

    content.append(
        Paragraph(
            f"Missing Values: {current_df.isnull().sum().sum()}",
            styles["Normal"]
        )
    )

    content.append(
        Paragraph(
            f"Duplicates: {current_df.duplicated().sum()}",
            styles["Normal"]
        )
    )

    content.append(Spacer(1, 15))

    content.append(
        Paragraph(
            "Column Names",
            styles["Heading2"]
        )
    )

    for col in current_df.columns:
        content.append(
            Paragraph(
                f"• {col}",
                styles["Normal"]
            )
        )

    content.append(Spacer(1, 15))

    numeric_cols = current_df.select_dtypes(
        include=["int64", "float64"]
    ).columns

    if len(numeric_cols) > 0:

        content.append(
            Paragraph(
                "Summary Statistics",
                styles["Heading2"]
            )
        )

        summary = current_df[numeric_cols].describe()

        for col in numeric_cols:

            content.append(
                Paragraph(
                    f"<b>{col}</b>",
                    styles["Normal"]
                )
            )

            content.append(
                Paragraph(
                    f"Mean: {round(summary[col]['mean'],2)}",
                    styles["Normal"]
                )
            )

            content.append(
                Paragraph(
                    f"Min: {summary[col]['min']}",
                    styles["Normal"]
                )
            )

            content.append(
                Paragraph(
                    f"Max: {summary[col]['max']}",
                    styles["Normal"]
                )
            )

            content.append(Spacer(1, 8))

    doc.build(content)

    return FileResponse(
        pdf_file,
        media_type="application/pdf",
        filename="analytics_report.pdf"
    )