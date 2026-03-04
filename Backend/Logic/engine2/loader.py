import pandas as pd
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from engine import engine
from stockMarketLoader import load_sector_index 
from cleaner import normalize_features,create_composite_score

pd.set_option('display.max_columns', None)

def execute_engine(ticker):
    
    print(f"Loading data for {ticker}...")
    data = load_sector_index(ticker)
    result = engine(data, ticker)
    scalledDf = normalize_features(result)
    finalDf = create_composite_score(scalledDf)
    print("Shape of the final data frame is : ",data.shape)
    print("Shape of the final data frame is : ",result.shape)
    print("Shape of the final data frame is : ",scalledDf.shape)
    print("Shape of the final data frame is : ",finalDf.shape)
    print("\nDone for {ticker} Section !")
    return finalDf

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
    
    
    for sector_name, ticker in SECTORS.items():
        print(f"\nAnalyzing {sector_name} ({ticker})...")
        try:
            data = execute_engine(ticker)
            print(data.tail())
            print(f"✓ {sector_name} completed")
        except Exception as e:
            print(f"✗ {sector_name} failed: {e}")
    

