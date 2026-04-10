"""
Logic/piplineRunner.py

TrendCaster Master Orchestrator.
Runs the full pipeline in order:
    1. Fetch & compute signals for all sectors
    2. Insert into MySQL
    3. Build pivot matrix + rolling PCA
    4. Insert PCA factors
    5. Build LLM-ready JSON (market state)
    6. Run RAG pipeline (update doc + rebuild vector indexes)
    7. Insert market structure + sector ranking into DB
"""

import os
import sys
import json
from datetime import datetime
from dotenv import load_dotenv

# Load .env from project root
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env"))

# Ensure Logic/ is importable from here
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from loader import run_full_engine
from processor.pivotmaker import build_pivot_matrix
from processor.pcaMaker import rolling_pca
from LLMinput.inputGenerator import build_llm_input
from schema.dbConnector import (
    insertIntoTable,
    fetchTableAsDataFrame,
    insert_pca_factors,
    insert_market_structure,
    insert_sector_ranking,
)

# ── Add Rag/ to path so ragRunner can be imported ────────────────────────────
_RAG_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "Rag")
sys.path.insert(0, _RAG_DIR)
from ragRunner import run_rag_pipeline


# ── Sector registry (single source of truth) ─────────────────────────────────
SECTORS = {
    "Nifty":          "^NSEI",
    "Sensex":         "^BSESN",
    "Bank Nifty":     "^NSEBANK",
    "IT Sector":      "^CNXIT",
    "Auto Sector":    "^CNXAUTO",
    "Metal Sector":   "^CNXMETAL",
    "Realty Sector":  "^CNXREALTY",
    "FMCG Sector":    "^CNXFMCG",
    "Pharma Sector":  "^CNXPHARMA",
    "Energy Sector":  "^CNXENERGY",
    "Gold":           "GC=F",
    "Crude Oil":      "CL=F",
    "USD-INR":        "INR=X",
    "India VIX":      "^INDIAVIX",
}

# ── DB column order must match MySQL table schema ─────────────────────────────
DB_COLUMNS = [
    "Date", "Close", "High", "Low", "Open", "Volume",
    "trend_strength", "trend_consistency", "volatility_regime",
    "momentum_acceleration", "cycle_position", "sector",
    "trend_strength_z", "trend_consistency_z", "volatility_regime_z",
    "momentum_acceleration_z", "cycle_position_z",
    "composite_score", "Asset", "created_at",
]


def run_system():
    print("\n" + "=" * 60)
    print("  TrendCaster Macro Engine  —  Starting")
    print("=" * 60)

    # ── 1. Build Master Dataset ───────────────────────────────────
    master_data = run_full_engine(SECTORS)
    master_data["created_at"] = datetime.now()

    print(f"\n[pipeline] Master DataFrame: {master_data.shape}")

    # ── 2. Validate & Insert ──────────────────────────────────────
    missing = [c for c in DB_COLUMNS if c not in master_data.columns]
    if missing:
        raise ValueError(f"Missing columns before DB insert: {missing}")

    master_data = master_data[DB_COLUMNS]
    insertIntoTable("mainprocesseddailyfeatures", master_data)
    print("[pipeline] DB insert complete")

    # Free raw data from memory
    master_data = None

    # ── 3. Pivot Matrix ───────────────────────────────────────────
    print("[pipeline] Fetching stored data for pivot matrix...")
    analysis_df  = fetchTableAsDataFrame("mainProcessedDailyFeatures")
    analysis_df  = analysis_df.drop(columns=["id", "created_at"])

    pivot_matrix = build_pivot_matrix(analysis_df)
    print(f"[pipeline] Pivot matrix: {pivot_matrix.shape}")

    # ── 4. Rolling PCA ────────────────────────────────────────────
    factor_df = rolling_pca(pivot_matrix, n_components=5)
    print(f"[pipeline] PCA complete — {len(factor_df)} factor rows")

    insert_pca_factors(factor_df)
    factor_df = None

    # ── 5. Build LLM Input JSON ───────────────────────────────────
    master_data = fetchTableAsDataFrame("mainProcessedDailyFeatures")
    master_data = master_data.drop(columns=["id", "created_at"])
    factor_df   = fetchTableAsDataFrame("pca_macro_factors")
    factor_df   = factor_df.drop(columns=["id"])

    print("[pipeline] Building LLM input JSON...")
    llm_input = build_llm_input(master_data, factor_df, pivot_matrix)

    # Optionally save JSON for debugging
    _json_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "llm_market_state.json")
    with open(_json_path, "w") as f:
        json.dump(llm_input, f, indent=2, default=str)
    print(f"[pipeline] LLM JSON saved → {_json_path}")

    # ── 6. RAG Pipeline ───────────────────────────────────────────
    run_rag_pipeline(llm_input)
    print("[pipeline] RAG pipeline complete")

    # ── 7. Insert market structure + sector ranking ───────────────
    date_val = llm_input["date"]
    avg_corr = llm_input["market_structure"]["average_cross_asset_correlation_60d"]
    std_corr = llm_input["market_structure"]["correlation_dispersion_60d"]
    insert_market_structure(date_val, avg_corr, std_corr)
    insert_sector_ranking(date_val, llm_input["sector_ranking"])

    print("\n" + "=" * 60)
    print("  TrendCaster Macro Engine  —  All Processes Completed ✅")
    print("=" * 60)


if __name__ == "__main__":
    run_system()