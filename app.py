import streamlit as st
import pandas as pd

from modules.cleaning import (
    data_quality_report,
    detect_outliers
)

from modules.visualization import (
    create_histogram,
    correlation_heatmap,
    create_boxplot,
    create_scatter
)
from modules.insights import generate_insights
from modules.ml_recommendation import recommend_ml_task
from modules.report import create_pdf_report
from modules.preprocessing import *
st.set_page_config(
    page_title="AI Data Intelligence Assistant",
    layout="wide"
)

st.title("AI Data Intelligence Assistant")
menu = st.sidebar.radio(
    "Navigation",
    [
        "Dashboard",
        "Visualizations",
        "Insights",
        "Reports"
    ]
)

uploaded_file = st.file_uploader(
    "Upload Dataset",
    type=["csv", "xlsx"]
)

if uploaded_file:

    if uploaded_file.name.endswith(".csv"):
        df = pd.read_csv(uploaded_file)
    else:
        df = pd.read_excel(uploaded_file)

    st.success("Dataset Loaded Successfully")
    
    duplicates = df.duplicated().sum()

    memory = round(
        df.memory_usage(deep=True).sum() / 1024,
        2
    )

    col1, col2, col3, col4, col5 = st.columns(5)

    col1.metric("Rows", df.shape[0])

    col2.metric("Columns", df.shape[1])

    col3.metric(
        "Missing Values",
        df.isnull().sum().sum()
    )

    col4.metric(
        "Duplicates",
        duplicates
    )

    col5.metric(
        "Memory (KB)",
        memory
    )

    # ------------------------
    # Data Quality Report
    # ------------------------

    report = data_quality_report(df)

    st.subheader("Data Quality Report")

    st.write(report["missing_values"])

    st.write(
        f"Duplicate Rows: {report['duplicates']}"
    )

    # ------------------------
    # Outlier Detection
    # ------------------------

    numeric_cols = df.select_dtypes(
        include=['int64', 'float64']
    ).columns

    if len(numeric_cols) > 0:

        selected_col = st.selectbox(
            "Select Column for Outlier Detection",
            numeric_cols
        )

        outliers = detect_outliers(
            df,
            selected_col
        )

        st.subheader("Outlier Detection")

        st.write(
            f"Number of Outliers: {len(outliers)}"
        )

        st.dataframe(outliers)

        # ------------------------
        # Histogram
        # ------------------------

        st.subheader("Histogram")

        fig = create_histogram(
            df,
            selected_col
        )

        st.plotly_chart(fig)

        # ------------------------
        # Correlation Heatmap
        # ------------------------

        st.subheader("Correlation Heatmap")

        heatmap = correlation_heatmap(df)

        st.pyplot(heatmap)
        
        # ------------------------
        # AI Insights
        # ------------------------

        st.subheader("AI Insights")

        insights = generate_insights(df)

        for insight in insights:
            st.info(insight)
        # ------------------------
        # ML Recommendation
        # ------------------------

        st.subheader("Machine Learning Recommendation")

        task = recommend_ml_task(df)

        st.success(f"Recommended ML Task: {task}")
        
        # ------------------------
        # Download Dataset
        # ------------------------

        st.subheader("Download Dataset")

        csv = df.to_csv(index=False)

        st.download_button(
            label="Download Dataset",
            data=csv,
            file_name="processed_dataset.csv",
            mime="text/csv"
        )
        # ------------------------
        # PDF Report
        # ------------------------

        st.subheader("Generate PDF Report")

        report_path = create_pdf_report(
            df,
            insights,
            task
        )

        with open(report_path, "rb") as file:

            st.download_button(
                label="Download PDF Report",
                data=file,
                file_name="analysis_report.pdf",
                mime="application/pdf"
            )
        st.subheader("Data Cleaning Tools")

        if st.button("Remove Duplicates"):
            df = remove_duplicates(df)
            st.success("Duplicates Removed")

        if st.button("Fill Missing Values"):
            df = fill_missing_values(df)
            st.success("Missing Values Filled")

        if st.button("Drop Missing Values"):
            df = drop_missing_values(df)
            st.success("Missing Values Removed")


        # ------------------------
        # Dataset Chat Assistant
        # ------------------------

        st.subheader("Dataset Chat Assistant")

        question = st.text_input(
            "Ask a question about your dataset"
        )

        if question:

            question = question.lower()

            if "rows" in question:
                st.success(
                    f"The dataset contains {df.shape[0]} rows."
                )

            elif "columns" in question:
                st.success(
                    f"The dataset contains {df.shape[1]} columns."
                )

            elif "missing" in question:
                st.success(
                    f"Missing values: {df.isnull().sum().sum()}"
                )

            elif "duplicate" in question:
                st.success(
                    f"Duplicate rows: {df.duplicated().sum()}"
                )

            else:
                st.warning(
                    "Sorry, I don't understand that question yet."
                )