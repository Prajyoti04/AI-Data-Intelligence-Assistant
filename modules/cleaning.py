import pandas as pd

def data_quality_report(df):

    missing_values = df.isnull().sum()

    duplicates = df.duplicated().sum()

    return {
        "missing_values": missing_values,
        "duplicates": duplicates
    }

def detect_outliers(df, column):

    Q1 = df[column].quantile(0.25)
    Q3 = df[column].quantile(0.75)

    IQR = Q3 - Q1

    lower = Q1 - 1.5 * IQR
    upper = Q3 + 1.5 * IQR

    outliers = df[
        (df[column] < lower) |
        (df[column] > upper)
    ]

    return outliers