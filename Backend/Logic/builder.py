import pandas as pd
import json
import sys
import os
import matplotlib.pyplot as plt 

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from engine2.engine import engine
from fatcher.stockMarketLoader import load_sector_index
from processor.cleaner import normalize_features, create_composite_score
from visulizationAndSummary.visulization import visualize_engine
from processor.pivotmaker import build_pivot_matrix
from processor.pcaMaker import rolling_pca
from LLMinput.inputGenerator import build_llm_input
from loader import run_full_engine

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


# execustion
if __name__ == "__main__":
    
    master_data = run_full_engine(SECTORS)

    print("\nBuilding Pivot Matrix...\n")
    pivot_matrix = build_pivot_matrix(master_data)

    print(pivot_matrix.columns)
    print("\nRunning Rolling PCA...\n")
    factor_df = rolling_pca(pivot_matrix, n_components=5)

    print("\nBuilding Smart LLM Input...\n")
    llm_input = build_llm_input(master_data, factor_df, pivot_matrix)

    print(json.dumps(llm_input, indent=2))

    with open("llm_market_state.json", "w") as f:
        json.dump(llm_input, f, indent=2)

    print("\nSystem Complete. LLM input ready.")

    finalCrude = load_sector_index("CL=F")
    plt.plot(finalCrude['Close'])
    plt.title("Crude Oil Price")
    plt.show()