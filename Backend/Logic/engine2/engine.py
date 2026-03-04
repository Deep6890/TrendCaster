import numpy as np
import pandas as pd
def engine(df: pd.DataFrame, sector: str):

    finalScoredDf = pd.DataFrame()

    df = df.copy()
    df['Date'] = pd.to_datetime(df['Date'])
    df = df.sort_values('Date').set_index('Date')

    # Returns
    df['ret'] = np.log(df['Close'] / df['Close'].shift(1))

    # Trend strength max days taken is 150
    df['ma50'] = df['Close'].rolling(50).mean()
    df['ma150'] = df['Close'].rolling(150).mean()
    finalScoredDf['trend_strength'] = (df['ma50'] - df['ma150']) / df['ma150']

    # Trend consistency max days taken 150
    def trend_consistency_func(x):
        log_price = np.log(x)
        slope = np.polyfit(range(len(log_price)), log_price, 1)[0]
        noise = np.std(np.diff(log_price))
        return slope / noise if noise != 0 else 0

    finalScoredDf['trend_consistency'] = (
        df['Close']
        .rolling(150)
        .apply(trend_consistency_func, raw=False)
    )

    # Volatality regmi max days taken 150
    vol_30 = df['ret'].rolling(30).std()
    vol_150 = df['ret'].rolling(150).std()
    vol_ratio = vol_30 / (vol_150 + 1e-8)

    finalScoredDf['volatility_regime'] = (1 - vol_ratio)

    # Finding the accelaration max days take 90 for sort term 
    roc_30 = np.log(df['Close'] / df['Close'].shift(30))
    roc_90 = np.log(df['Close'] / df['Close'].shift(90))
    finalScoredDf['momentum_acceleration'] = (roc_30 - roc_90)

    # Finding the psoition for max 252 
    high_1y = df['Close'].rolling(252).max()
    low_1y = df['Close'].rolling(252).min()
    position_in_range = (df['Close'] - low_1y) / (high_1y - low_1y + 1e-8)

    finalScoredDf['cycle_position'] = position_in_range - 0.5

    # Final data frame 
    finalScoredDf.index = df.index  
    finalScoredDf['sector'] = sector 

    finalScoredDf = finalScoredDf.reset_index() 
    finalScoredDf.rename(columns={'index': 'Date'}, inplace=True)

    # So the final complated dataframe 
    finalScoredDf = finalScoredDf.dropna()

    return finalScoredDf