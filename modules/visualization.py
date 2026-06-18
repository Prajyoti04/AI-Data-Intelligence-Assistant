import plotly.express as px
import seaborn as sns
import matplotlib.pyplot as plt

def create_histogram(df, column):

    fig = px.histogram(
        df,
        x=column
    )

    return fig


import plotly.express as px
import seaborn as sns
import matplotlib.pyplot as plt

def create_histogram(df, column):

    fig = px.histogram(
        df,
        x=column
    )

    return fig


def correlation_heatmap(df):

    corr = df.corr(numeric_only=True)

    fig, ax = plt.subplots(figsize=(8, 5))

    sns.heatmap(
        corr,
        annot=True,
        fmt=".2f",
        linewidths=0.5,
        ax=ax
    )

    ax.set_title("Feature Correlation Matrix")

    return fig
def create_boxplot(df, column):

    fig = px.box(
        df,
        y=column
    )

    return fig
def create_scatter(df, x_col, y_col):

    fig = px.scatter(
        df,
        x=x_col,
        y=y_col
    )

    return fig
