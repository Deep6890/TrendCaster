import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA

# finding rolling pca vector 
def rolling_pca(pivot_df, n_components=5, window=252):

    factor_list = []
    dates = []

    for i in range(window, len(pivot_df)):

        window_data = pivot_df.iloc[i-window:i]

        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(window_data)

        pca = PCA(n_components=n_components)
        pca.fit(X_scaled)

        latest_vector = X_scaled[-1].reshape(1, -1)
        factors = pca.transform(latest_vector)

        factor_list.append(factors[0])
        dates.append(pivot_df.index[i])

    factor_df = pd.DataFrame(
        factor_list,
        index=dates,
        columns=[f"PC{i+1}" for i in range(n_components)]
    )

    print("Rolling PCA Complete.")
    return factor_df
