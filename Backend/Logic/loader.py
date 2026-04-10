"""
Logic/loader.py
Executes the signal engine for each sector and assembles the master DataFrame.
SECTORS definition lives only in piplineRunner.py — do not duplicate here.
"""
import pandas as pd
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from engine2.engine import engine
from fatcher.stockMarketLoader import load_sector_index
from processor.cleaner import normalize_features, create_composite_score


pd.set_option("display.max_columns", None)


def execute_engine(ticker: str, asset_name: str):
    """
    Fetch OHLCV data → run signal engine → normalize → score.
    Returns (final_df_with_ohlcv, scored_df).
    """
    print(f"  Loading {asset_name} ({ticker}) ...")

    data = load_sector_index(ticker)
    data["Date"] = pd.to_datetime(data["Date"])

    result      = engine(data, asset_name)
    scaled_df   = normalize_features(result)
    final_df    = create_composite_score(scaled_df)

    # Merge OHLCV back so the DB row has all columns
    merged = data[["Date", "Open", "High", "Low", "Close", "Volume"]].merge(
        final_df, on="Date", how="left"
    )
    merged["Asset"]  = asset_name
    merged["sector"] = asset_name

    print(f"  Done for {asset_name} — {len(merged)} rows")
    return merged, final_df


def run_full_engine(ticker_dict: dict) -> pd.DataFrame:
    """
    Iterate over all sectors, run engine for each, concatenate into master df.
    """
    all_results = []

    for asset_name, ticker in ticker_dict.items():
        print(f"\n[engine] Processing {asset_name} ...")
        df, _ = execute_engine(ticker, asset_name)
        all_results.append(df)

    master_df = pd.concat(all_results, ignore_index=True)
    print(f"\n[engine] Master DataFrame shape: {master_df.shape}")
    return master_df