def recommend_ml_task(df):

    target = df.columns[-1]

    unique_values = df[target].nunique()

    if unique_values < 10:
        return {
            "task": "Classification",
            "algorithms": [
                "Logistic Regression",
                "Random Forest",
                "XGBoost"
            ]
        }

    elif unique_values > 20:
        return {
            "task": "Regression",
            "algorithms": [
                "Linear Regression",
                "Random Forest Regressor",
                "XGBoost Regressor"
            ]
        }

    else:
        return {
            "task": "Clustering",
            "algorithms": [
                "KMeans",
                "DBSCAN",
                "Hierarchical Clustering"
            ]
        }