import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from stockMarketLoader import load_sector_index
# from discribtion import dataDiscribtion
from cleaner import dataCleaning_engine
from visulization import visualize_engine
import matplotlib.pyplot as plt

def run_engine_summary(ticker="INR=X"):
    
    data = load_sector_index(ticker)
    print(f"\nCompany: {ticker}")
    print(f"Data shape: {data.shape}")
    
    data = dataCleaning_engine(data)
    visualize_engine(data)

if __name__ == "__main__":
    print("\n\nRunning Engine 2 Summary...")
    # run_engine2_summary()
    run_engine_summary()