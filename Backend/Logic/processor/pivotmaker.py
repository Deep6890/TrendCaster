# building pivot matrix
def build_pivot_matrix(master_df):

    pivot_df = master_df.pivot_table(
        index="date",
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
