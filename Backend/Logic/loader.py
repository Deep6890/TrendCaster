import pandas as pd
import sys
import os
from datetime import datetime
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from engine2.engine import engine
from fatcher.stockMarketLoader import load_sector_index
from processor.cleaner import normalize_features , create_composite_score
# from visulizationAndSummary.visulization import 
from schema.dbConnector import insertIntoTable ,closeConnection ,createConnection

pd.set_option("display.max_columns", None)

# Calling the exact function 

def execute_engine(ticker, asset_name):

    print(f"Loading data for {asset_name} ({ticker})...")

    data = load_sector_index(ticker)
    data['Date'] = pd.to_datetime(data['Date'])
    result = engine(data, asset_name)

    scaled_df = normalize_features(result)
    final_df = create_composite_score(scaled_df)
    master_data = final_df
    # Merge: keep all raw data rows, fill scores where available
    final_df = data[['Date', 'Open', 'High', 'Low', 'Close', 'Volume']].merge(final_df, on='Date', how='left')
    final_df["Asset"] = asset_name
    final_df["sector"] = asset_name
    
    print(f"Done for {asset_name}")
    return final_df , master_data

# fatching all the sector data
def run_full_engine(ticker_dict):

    all_results = []

    for asset_name, ticker in ticker_dict.items():
        print(f"\nProcessing {asset_name}...")
        df, _ = execute_engine(ticker, asset_name)
        all_results.append(df)

    master_df = pd.concat(all_results, ignore_index=True)

    return master_df

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

if __name__ == "__main__":
    print("Running Full Macro Structural Engine...\n")

    master_data = run_full_engine(SECTORS)
    master_data['created_at'] = datetime.now()

    # Column order must match MySQL table
    master_data = master_data[['Date','Close','High','Low','Open','Volume',
                               'trend_strength', 'trend_consistency', 'volatility_regime',
                               'momentum_acceleration','cycle_position','sector',
                               'trend_strength_z','trend_consistency_z','volatility_regime_z',
                               'momentum_acceleration_z','cycle_position_z',
                               'composite_score','Asset','created_at']]

    print(master_data.columns)
    print(master_data.shape)
    print(master_data.head())

    insertIntoTable("mainprocesseddailyfeatures", master_data)
    print("Data Inserted into DB Successfully")
    closeConnection(conn.cursor())