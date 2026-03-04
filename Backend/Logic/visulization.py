import matplotlib.pyplot as plt
import seaborn as sns

# Engine 2 visualization
def visualize_engine(df):
    fig, axes = plt.subplots(2, 2, figsize=(14, 8))

    axes[0,0].plot(df['Date'], df['Close'])
    axes[0,0].set_title("Close Price Over Time")
    axes[0,0].set_xlabel("Date")
    axes[0,0].set_ylabel("Close")

    sns.histplot(df['Close'], kde=True, color="Blue", ax=axes[0,1])
    axes[0,1].set_title("Close Distribution")

    axes[1,0].plot(df['Date'], df['Volume'])
    axes[1,0].set_title("Volume Over Time")
    axes[1,0].set_xlabel("Date")
    axes[1,0].set_ylabel("Volume")

    sns.histplot(df['Volume'], kde=True, color="Green", ax=axes[1,1])
    axes[1,1].set_title("Volume Distribution")

    plt.tight_layout()
    plt.show()
