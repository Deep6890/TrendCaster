import pandas as pd
import numpy as np
import json
import sys
import os

from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from engine import engine
from stockMarketLoader import load_sector_index
from cleaner import normalize_features, create_composite_score

pd.set_option("display.max_columns", None)



# Calling the exact function 

def execute_engine(ticker, asset_name):

    print(f"Loading data for {asset_name} ({ticker})...")

    data = load_sector_index(ticker)
    result = engine(data, ticker)

    scaled_df = normalize_features(result)
    final_df = create_composite_score(scaled_df)

    final_df["Asset"] = asset_name

    print(f"Done for {asset_name}")
    return final_df

# fatching all the sector data
def run_full_engine(ticker_dict):

    all_results = []

    for asset_name, ticker in ticker_dict.items():
        print(f"\nProcessing {asset_name}...")
        df = execute_engine(ticker, asset_name)
        all_results.append(df)

    master_df = pd.concat(all_results, ignore_index=True)
    master_df = master_df.dropna()

    return master_df

# building pivot matrix
def build_pivot_matrix(master_df):

    pivot_df = master_df.pivot_table(
        index="Date",
        columns="Asset",
        values=[
            "trend_strength_z",
            "trend_consistency_z",
            "momentum_acceleration_z",
            "cycle_position_z",
            "volatility_regime_z"
        ]
    )

    pivot_df = pivot_df.sort_index()
    pivot_df = pivot_df.ffill().dropna()

    pivot_df.columns = [
        f"{feature}_{asset}"
        for feature, asset in pivot_df.columns
    ]

    print("Final Feature Matrix Shape:", pivot_df.shape)
    return pivot_df

# finding rolling pca vector 
def rolling_pca(pivot_df, n_components=5, window=252):

    factor_list = []
    dates = []

    for i in range(window, len(pivot_df)):

        window_data = pivot_df.iloc[i-window:i]

        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(window_data)

        pca = PCA(n_components=n_components)
        pca.fit(X_scaled)

        latest_vector = X_scaled[-1].reshape(1, -1)
        factors = pca.transform(latest_vector)

        factor_list.append(factors[0])
        dates.append(pivot_df.index[i])

    factor_df = pd.DataFrame(
        factor_list,
        index=dates,
        columns=[f"PC{i+1}" for i in range(n_components)]
    )

    print("Rolling PCA Complete.")
    return factor_df

# the end correlation summary
def build_correlation_summary(pivot_df, window=60):

    recent = pivot_df.tail(window)
    corr_matrix = recent.corr()

    upper_triangle = corr_matrix.where(
        np.triu(np.ones(corr_matrix.shape), k=1).astype(bool)
    )

    avg_corr = upper_triangle.stack().mean()
    std_corr = upper_triangle.stack().std()

    return round(avg_corr, 3), round(std_corr, 3)

def build_llm_input(master_df, factor_df, pivot_df):

    latest_date = master_df["Date"].max()

    # current day for macro sector 
    latest_factors = factor_df.iloc[-1].round(3).to_dict()

    # Factor history 
    factor_history_df = factor_df.tail(10).round(3).copy()

    # Convert Timestamp index to string
    factor_history_df.index = factor_history_df.index.astype(str)

    factor_history = factor_history_df.to_dict(orient="index")

    # Correlation Summary
    avg_corr, std_corr = build_correlation_summary(pivot_df)

    # Snap shot 
    latest_assets = master_df[
        master_df["Date"] == latest_date
    ][[
        "Asset",
        "trend_strength_z",
        "trend_consistency_z",
        "momentum_acceleration_z",
        "cycle_position_z",
        "volatility_regime_z"
    ]].round(3)

    asset_dict = {}

    for _, row in latest_assets.iterrows():
        asset_dict[str(row["Asset"])] = {
            "trend_strength": float(row["trend_strength_z"]),
            "trend_consistency": float(row["trend_consistency_z"]),
            "momentum_acceleration": float(row["momentum_acceleration_z"]),
            "cycle_position": float(row["cycle_position_z"]),
            "volatility_regime": float(row["volatility_regime_z"])
        }

    #finding the ranking
    ranking_df = latest_assets.sort_values(
        "trend_strength_z", ascending=False
    )

    strongest_assets = ranking_df["Asset"].head(3).astype(str).tolist()
    weakest_assets = ranking_df["Asset"].tail(3).astype(str).tolist()

    # Final llm input strucutre json
    llm_input = {
        "date": str(latest_date),

        "macro_regime": {
            "current_factors": {k: float(v) for k, v in latest_factors.items()},
            "recent_factor_trend": factor_history
        },

        "market_structure": {
            "average_cross_asset_correlation_60d": float(avg_corr),
            "correlation_dispersion_60d": float(std_corr)
        },

        "asset_states": asset_dict,

        "leaders_laggards": {
            "strongest_assets": strongest_assets,
            "weakest_assets": weakest_assets
        }
    }

    return llm_input

# execustion
if __name__ == "__main__":

    SECTORS = {
        "Nifty": "^NSEI",
        "Sensex": "^BSESN",
        "Bank Nifty": "^NSEBANK",
        "IT Sector": "^CNXIT",
        "Auto Sector": "^CNXAUTO",
        "Metal Sector": "^CNXMETAL",
        "Realty Sector": "^CNXREALTY",
        "FMCG Sector": "^CNXFMCG",
        "Pharma Sector": "^CNXPHARMA",
        "Energy Sector": "^CNXENERGY",
        "Gold": "GC=F",
        "Crude Oil": "CL=F",
        "USD-INR": "INR=X",
        "India VIX": "^INDIAVIX"
    }

    print("Running Full Macro Structural Engine...\n")

    master_data = run_full_engine(SECTORS)

    print("\nBuilding Pivot Matrix...\n")
    pivot_matrix = build_pivot_matrix(master_data)

    print("\nRunning Rolling PCA...\n")
    factor_df = rolling_pca(pivot_matrix, n_components=5)

    print("\nBuilding Smart LLM Input...\n")
    llm_input = build_llm_input(master_data, factor_df, pivot_matrix)

    print(json.dumps(llm_input, indent=2))

    with open("llm_market_state.json", "w") as f:
        json.dump(llm_input, f, indent=2)

    print("\nSystem Complete. LLM input ready.")
