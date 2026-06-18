def recommend_ml_task(df):

    target = df.columns[-1]

    unique_values = df[target].nunique()

    if unique_values < 10:
        return "Classification"

    elif unique_values > 20:
        return "Regression"

    else:
        return "Clustering"