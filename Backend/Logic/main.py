import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from stockMarketLoader import load_sector_index
from cleaner import dataCleaning_engine
from engine2.engine import engine
import pandas as pd

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

def analyze_all_sectors():
    results = []
    
    for sector_name, ticker in SECTORS.items():
        print(f"\nAnalyzing {sector_name} ({ticker})...")
        try:
            data = load_sector_index(ticker)
            data = dataCleaning_engine(data)
            result = engine(data, sector_name)
            results.append(result)
            print(f"✓ {sector_name} completed")
        except Exception as e:
            print(f"✗ {sector_name} failed: {e}")
    
    final_df = pd.concat(results, ignore_index=True)
    final_df = final_df.sort_values('Future_Structural_Bias', ascending=False)
    
    print("\n" + "="*80)
    print("FINAL MARKET ANALYSIS - ALL SECTORS")
    print("="*80)
    print(final_df.to_string(index=False))
    
    return final_df

if __name__ == "__main__":
    analyze_all_sectors()
