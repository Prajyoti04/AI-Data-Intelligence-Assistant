from fpdf import FPDF

def create_pdf_report(df, insights, task):

    pdf = FPDF()

    pdf.add_page()

    pdf.set_font("Arial", "B", 16)

    pdf.cell(
        200,
        10,
        txt="AI Data Intelligence Report",
        ln=True,
        align="C"
    )

    pdf.ln(10)

    pdf.set_font("Arial", size=12)

    pdf.cell(
        200,
        10,
        txt=f"Rows: {df.shape[0]}",
        ln=True
    )

    pdf.cell(
        200,
        10,
        txt=f"Columns: {df.shape[1]}",
        ln=True
    )

    pdf.cell(
        200,
        10,
        txt=f"Missing Values: {df.isnull().sum().sum()}",
        ln=True
    )

    pdf.cell(
        200,
        10,
        txt=f"Duplicate Rows: {df.duplicated().sum()}",
        ln=True
    )

    pdf.ln(10)

    pdf.set_font("Arial", "B", 14)

    pdf.cell(
        200,
        10,
        txt="Insights",
        ln=True
    )

    pdf.set_font("Arial", size=12)

    for insight in insights:
        pdf.multi_cell(
            0,
            10,
            insight
        )

    pdf.ln(5)

    pdf.set_font("Arial", "B", 14)

    pdf.cell(
        200,
        10,
        txt="ML Recommendation",
        ln=True
    )

    pdf.set_font("Arial", size=12)

    pdf.cell(
        200,
        10,
        txt=task,
        ln=True
    )

    report_path = "analysis_report.pdf"

    pdf.output(report_path)

    return report_path