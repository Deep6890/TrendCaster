import pandas as pd

# Engine 2 cleaning
def dataCleaning_engine(df):
    data = df.copy()
    data.dropna(inplace=True)
    print(data.shape)
    return data

def normalize_features(df):

    feature_cols = [
        'trend_strength',
        'trend_consistency',
        'volatility_regime',
        'momentum_acceleration',
        'cycle_position'
    ]

    for col in feature_cols:
        rolling_mean = df[col].rolling(252).mean()
        rolling_std = df[col].rolling(252).std()
        df[col + '_z'] = (df[col] - rolling_mean) / (rolling_std + 1e-8)

    return df

def create_composite_score(df):

    z_cols = [col for col in df.columns if '_z' in col]

    df['composite_score'] = df[z_cols].mean(axis=1)

    return df