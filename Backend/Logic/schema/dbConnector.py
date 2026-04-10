"""
schema/dbConnector.py
Centralised MySQL I/O for TrendCaster.
All credentials come from environment variables (set in .env).
No global connection object — every function opens and closes its own connection.
"""

import os
import mysql.connector
import pandas as pd
import numpy as np
from dotenv import load_dotenv

# Load .env from project root (two levels up from this file)
_ENV_PATH = os.path.join(os.path.dirname(__file__), "..", "..", ".env")
load_dotenv(_ENV_PATH)


def _get_conn():
    """Return a fresh MySQL connection using .env credentials."""
    return mysql.connector.connect(
        host=os.getenv("DB_HOST", "localhost"),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASS", "root"),
        database=os.getenv("DB_NAME", "treadcasterdb"),
    )


def createConnection():
    """Legacy helper — returns (conn, cursor) tuple."""
    conn = _get_conn()
    cursor = conn.cursor()
    print("Connected to MySQL database")
    return conn, cursor


def closeConnection(cursor, conn=None):
    cursor.close()
    if conn:
        conn.close()
    print("MySQL connection closed")


# ── Read helpers ─────────────────────────────────────────────────────────────

def allFromTable(tableName):
    conn = _get_conn()
    cursor = conn.cursor()
    cursor.execute(f"SELECT * FROM {tableName}")
    result = cursor.fetchall()
    cursor.close()
    conn.close()
    return result


def assetsViseConstrains(tableName, asset):
    conn = _get_conn()
    cursor = conn.cursor()
    cursor.execute(f"SELECT * FROM {tableName} WHERE Asset = %s", (asset,))
    result = cursor.fetchall()
    cursor.close()
    conn.close()
    return result


def fetchTableAsDataFrame(tableName):
    conn = _get_conn()
    df = pd.read_sql(f"SELECT * FROM {tableName}", conn)
    conn.close()
    return df


# ── Write helpers ─────────────────────────────────────────────────────────────

def insertIntoTable(tableName, data: pd.DataFrame):
    """Upsert a DataFrame into tableName."""
    data = data.replace({pd.NaT: None, np.nan: None, np.inf: None, -np.inf: None})
    data = data.astype(object).where(pd.notnull(data), None)

    conn = _get_conn()
    cursor = conn.cursor()

    cols = ", ".join(data.columns)
    placeholders = ", ".join(["%s"] * len(data.columns))
    update_clause = ", ".join(
        [f"{col} = VALUES({col})" for col in data.columns if col not in ("Date", "Asset")]
    )

    query = f"""
    INSERT INTO {tableName} ({cols})
    VALUES ({placeholders})
    ON DUPLICATE KEY UPDATE
    {update_clause}
    """

    data_tuples = [tuple(row) for row in data.to_numpy()]
    cursor.executemany(query, data_tuples)
    conn.commit()
    print(f"{len(data_tuples)} rows inserted/updated in '{tableName}'")
    cursor.close()
    conn.close()


def insert_pca_factors(factor_df: pd.DataFrame):
    factor_df = factor_df.reset_index()
    factor_df = factor_df.rename(columns={"Date": "date"})
    factor_df = factor_df.replace({pd.NaT: None, np.nan: None})

    conn = _get_conn()
    cursor = conn.cursor()

    query = """
    INSERT INTO PCA_macro_factors (date, pc1, pc2, pc3, pc4, pc5)
    VALUES (%s, %s, %s, %s, %s, %s)
    ON DUPLICATE KEY UPDATE
        pc1 = VALUES(pc1),
        pc2 = VALUES(pc2),
        pc3 = VALUES(pc3),
        pc4 = VALUES(pc4),
        pc5 = VALUES(pc5)
    """

    data_tuples = [tuple(row) for row in factor_df.to_numpy()]
    cursor.executemany(query, data_tuples)
    conn.commit()
    print(f"{cursor.rowcount} PCA rows processed")
    cursor.close()
    conn.close()


def insert_market_structure(date_val, avg_corr, std_corr):
    conn = _get_conn()
    cursor = conn.cursor()
    query = """
    INSERT INTO market_structure_daily
        (date, avg_cross_asset_correlation_60d, correlation_dispersion_60d)
    VALUES (%s, %s, %s)
    ON DUPLICATE KEY UPDATE
        avg_cross_asset_correlation_60d = VALUES(avg_cross_asset_correlation_60d),
        correlation_dispersion_60d      = VALUES(correlation_dispersion_60d)
    """
    cursor.execute(query, (date_val, avg_corr, std_corr))
    conn.commit()
    print("Market structure inserted")
    cursor.close()
    conn.close()


def insert_sector_ranking(date_val, sector_ranking: list):
    conn = _get_conn()
    cursor = conn.cursor()
    query = """
    INSERT INTO sector_ranking_daily (date, rank_position, asset, score)
    VALUES (%s, %s, %s, %s)
    ON DUPLICATE KEY UPDATE
        rank_position = VALUES(rank_position),
        score         = VALUES(score)
    """
    data_tuples = [
        (date_val, row["rank"], row["asset"], row["score"])
        for row in sector_ranking
    ]
    cursor.executemany(query, data_tuples)
    conn.commit()
    print(f"{len(data_tuples)} sector ranking rows processed")
    cursor.close()
    conn.close()