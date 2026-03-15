import pandas as pd
import numpy as np


def build_llm_input(master_df, factor_df, pivot_matrix):

    # -----------------------------
    # 1. Normalize dates
    # -----------------------------
    master_df["date"] = pd.to_datetime(master_df["date"]).dt.normalize()
    factor_df["date"] = pd.to_datetime(factor_df["date"]).dt.normalize()

    latest_date = master_df["date"].max()

    print(f"\n[INFO] Latest date detected: {latest_date}")

    # -----------------------------
    # 2. Macro PCA Factors
    # -----------------------------
    factor_df = factor_df.sort_values("date")

    latest_factors = (
        factor_df[["pc1", "pc2", "pc3", "pc4", "pc5"]]
        .iloc[-1]
        .round(3)
        .to_dict()
    )

    factor_history = (
        factor_df.tail(10)
        .assign(date=lambda x: x["date"].astype(str))
        .set_index("date")[["pc1", "pc2", "pc3", "pc4", "pc5"]]
        .round(3)
        .to_dict(orient="index")
    )

    # -----------------------------
    # 3. Market Structure (Correlation)
    # -----------------------------
    last_60_days = pivot_matrix.tail(60)

    corr_matrix = last_60_days.corr()

    mask = np.triu(np.ones(corr_matrix.shape), k=1).astype(bool)

    correlations = corr_matrix.where(mask).stack()

    if not correlations.empty:
        avg_corr = round(float(correlations.mean()), 3)
        std_corr = round(float(correlations.std()), 3)
    else:
        avg_corr = 0.0
        std_corr = 0.0

    # -----------------------------
    # 4. Latest Asset States
    # -----------------------------
    z_cols = [
        "trend_strength_z",
        "trend_consistency_z",
        "momentum_acceleration_z",
        "cycle_position_z",
        "volatility_regime_z",
        "composite_score"
    ]

    # IMPORTANT: get latest row PER ASSET
    latest_assets_raw = (
        master_df
        .sort_values("date")
        .groupby("Asset")
        .tail(1)[["Asset"] + z_cols]
    )

    print("\n[DEBUG] Assets before cleaning:")
    print(latest_assets_raw["Asset"].tolist())

    print("\n[DEBUG] NaN counts:")
    print(latest_assets_raw[z_cols].isna().sum())

    # Drop rows where ALL signal columns are NaN
    latest_assets = latest_assets_raw.dropna(subset=z_cols, how="all").round(3)

    print("\n[DEBUG] Assets after cleaning:")
    print(latest_assets["Asset"].tolist())

    print(f"[DEBUG] Total assets surviving: {len(latest_assets)}")

    # -----------------------------
    # 5. Safe float helper
    # -----------------------------
    from typing import Optional

    def safe_float(val) -> Optional[float]:
        try:
            f = float(val)
            if np.isnan(f) or np.isinf(f):
                return None
            return round(f, 3)
        except Exception:
            return None

    # -----------------------------
    # 6. Build Asset State Dictionary
    # -----------------------------
    asset_states = {}

    for _, row in latest_assets.iterrows():

        asset_states[str(row["Asset"])] = {
            "trend_strength": safe_float(row["trend_strength_z"]),
            "trend_consistency": safe_float(row["trend_consistency_z"]),
            "momentum_acceleration": safe_float(row["momentum_acceleration_z"]),
            "cycle_position": safe_float(row["cycle_position_z"]),
            "volatility_regime": safe_float(row["volatility_regime_z"]),
            "score": safe_float(row["composite_score"])
        }

    # Sort DESC, reset index so row 0 = rank 1 — no ambiguity
    ranking_df = (
        latest_assets
        .dropna(subset=["composite_score"])
        .sort_values(by="composite_score", ascending=False)
        .reset_index(drop=True)          # ← critical: clean 0-based index
    )

    # Dense rank handles ties: two assets with same score get same rank
    ranking_df["rank_position"] = (
        ranking_df["composite_score"]
        .rank(method="dense", ascending=False)
        .astype(int)
    )

    sector_ranking = [
        {
            "rank": int(row["rank_position"]),
            "asset": str(row["Asset"]),
            "score": safe_float(row["composite_score"])
        }
        for _, row in ranking_df.iterrows()
    ]

    print("\n[DEBUG] Final sector ranking:")
    for entry in sector_ranking:
        print(f"  Rank {entry['rank']:>2} | {entry['asset']:<20} | score={entry['score']}")

    # Optional summaries (top/weak assets for LLM context)
    _names: list = [str(x["asset"]) for x in sector_ranking]   # plain list[str] — no Pyre2 ambiguity
    top_assets  = _names[:5]
    weak_assets = _names[-5:]

    # -----------------------------
    # 9. Final JSON
    # -----------------------------
    llm_input = {

        "date": str(latest_date.date()),

        "macro_regime": {
            "current_factors": {k.upper(): float(v) for k, v in latest_factors.items()},
            "recent_factor_trend": factor_history
        },

        "market_structure": {
            "average_cross_asset_correlation_60d": avg_corr,
            "correlation_dispersion_60d": std_corr
        },

        "asset_states": asset_states,

        "sector_ranking": sector_ranking,

        "market_summary": {
            "top_assets": top_assets,
            "weak_assets": weak_assets
        }
    }

    return llm_input