import numpy as np

# the end correlation summary
def build_correlation_summary(pivot_df, window=60):

    recent = pivot_df.tail(window)
    corr_matrix = recent.corr()

    upper_triangle = corr_matrix.where(
        np.triu(np.ones(corr_matrix.shape), k=1).astype(bool)
    )

    avg_corr = upper_triangle.stack().mean()
    std_corr = upper_triangle.stack().std()

    return round(avg_corr, 3), round(std_corr, 3)

