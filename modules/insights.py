def generate_insights(df):

    insights = []

    rows = df.shape[0]
    cols = df.shape[1]

    insights.append(
        f"Dataset contains {rows} rows and {cols} columns."
    )

    missing = df.isnull().sum().sum()

    insights.append(
        f"Total missing values found: {missing}"
    )

    duplicates = df.duplicated().sum()

    insights.append(
        f"Duplicate records found: {duplicates}"
    )

    return insights