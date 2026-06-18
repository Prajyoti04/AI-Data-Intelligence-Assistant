def remove_duplicates(df):
    return df.drop_duplicates()

def fill_missing_values(df):
    return df.fillna(df.mean(numeric_only=True))

def drop_missing_values(df):
    return df.dropna()