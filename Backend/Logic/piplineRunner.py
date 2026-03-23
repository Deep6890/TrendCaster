import os
import json
from datetime import datetime
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env"))

from loader import run_full_engine
from processor.pivotmaker import build_pivot_matrix
from processor.pcaMaker import rolling_pca
from LLMinput.inputGenerator import build_llm_input
from schema.dbConnector import insertIntoTable, fetchTableAsDataFrame, insert_pca_factors, insert_market_structure, insert_sector_ranking
from Rag.ragRunner import run_rag_pipeline

# Sector fatching 
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

# COlumns fatching
DB_COLUMNS = [
    'Date','Close','High','Low','Open','Volume',
    'trend_strength','trend_consistency','volatility_regime',
    'momentum_acceleration','cycle_position','sector',
    'trend_strength_z','trend_consistency_z','volatility_regime_z',
    'momentum_acceleration_z','cycle_position_z',
    'composite_score','Asset','created_at'
]

# main system runner
def run_system():

    print("\nStarting TrendCaster Macro Engine\n")
    # Build Master Dataset
    master_data = run_full_engine(SECTORS)
    master_data['created_at'] = datetime.now()

    print("Master data created")
    print(master_data.shape)
    # Store in Database
    # enforce DB schema order
    missing = [c for c in DB_COLUMNS if c not in master_data.columns]

    if missing:
        raise ValueError(f"Missing columns before DB insert: {missing}")

    master_data = master_data[DB_COLUMNS]

    insertIntoTable("mainprocesseddailyfeatures", master_data)

    print("Database Insert Completed")
    
    # physical cleared
    master_data = ""
    
    # Build Pivot Matrix
    print("Fetching stored data from database...")

    analysis_df = fetchTableAsDataFrame("mainProcessedDailyFeatures")

    analysis_df = analysis_df.drop(columns=["id","created_at"])

    pivot_matrix = build_pivot_matrix(analysis_df)
    print("Pivot Matrix Built")
    print(pivot_matrix.shape)

    # Rolling PCA
    factor_df = rolling_pca(pivot_matrix, n_components=5)
    print("PCA Completed")
    print(factor_df.head())
    factor_df = rolling_pca(pivot_matrix, n_components=5)

    insert_pca_factors(factor_df)
    factor_df=""

    # all data from the database
    master_data = fetchTableAsDataFrame("mainProcessedDailyFeatures")
    master_data = master_data.drop(columns=["id", "created_at"])
    factor_df = fetchTableAsDataFrame("pca_macro_factors")
    factor_df = factor_df.drop(columns=["id"])
    
    
    print("Building LLM Input...")
    llm_input = build_llm_input(master_data, factor_df, pivot_matrix)

    # RAG pipeline - convert JSON to doc + rebuild index
    run_rag_pipeline(llm_input)
    print("\nRAG Pipeline Complete")

    # Insert into new tables
    date_val = llm_input["date"]
    avg_corr = llm_input["market_structure"]["average_cross_asset_correlation_60d"]
    std_corr = llm_input["market_structure"]["correlation_dispersion_60d"]
    insert_market_structure(date_val, avg_corr, std_corr)

    insert_sector_ranking(date_val, llm_input["sector_ranking"])
    
    print("All Processes Completed Successfully")
    # all raw processing is complited
if __name__ == "__main__":
    run_system()