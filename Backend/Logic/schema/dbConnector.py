import mysql.connector
import pandas as pd
import numpy as np
# Create a connection
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="root",
    database="treadcasterdb" 
)

# Create a cursor to execute SQL queries
def createConnection():
    cursor = conn.cursor()
    print("Connected to MySQL database")
    return cursor

def allFromTable(tableName):
    cursor = createConnection()
    query = f"SELECT * FROM {tableName}"
    cursor.execute(query)
    result = cursor.fetchall()
    closeConnection(cursor)
    return result
    
def assetsViseConstrains(tableName , asset ):
    cursor = createConnection()
    query = f"SELECT * FROM {tableName} WHERE Asset = '{asset}'"
    cursor.execute(query)
    result = cursor.fetchall()
    closeConnection(cursor)
    return result

import mysql.connector
from datetime import datetime

def insertIntoTable(tableName, data):
    # Replace NaN/NaT with None properly
    data = data.replace({pd.NaT: None, np.nan: None, np.inf: None, -np.inf: None})
    data = data.astype(object).where(pd.notnull(data), None)

    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",
        database="treadcasterdb"
    )
    cursor = conn.cursor()

    cols = ", ".join(data.columns)
    placeholders = ", ".join(["%s"] * len(data.columns))
    update_clause = ", ".join([f"{col} = VALUES({col})" for col in data.columns if col != 'Date' and col != 'Asset'])
    query = f"""
    INSERT INTO {tableName} ({cols})
    VALUES ({placeholders})
    ON DUPLICATE KEY UPDATE
    {update_clause}
    """

    data_tuples = [tuple(row) for row in data.to_numpy()]

    cursor.executemany(query, data_tuples)
    conn.commit()
    print(f"{len(data_tuples)} rows inserted successfully!")
    cursor.close()
    conn.close()
    
def closeConnection(cursor):
    cursor.close()
    conn.close()
    print("MySQL connection closed")
def fetchTableAsDataFrame(tableName):

    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",
        database="treadcasterdb"
    )

    query = f"SELECT * FROM {tableName}"

    df = pd.read_sql(query, conn)

    conn.close()

    return df

def insert_pca_factors(factor_df):

    import mysql.connector
    import pandas as pd
    import numpy as np

    factor_df = factor_df.reset_index()
    factor_df = factor_df.rename(columns={"Date": "date"})

    factor_df = factor_df.replace({pd.NaT: None, np.nan: None})

    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",
        database="treadcasterdb"
    )

    cursor = conn.cursor()

    query = """
    INSERT INTO PCA_macro_factors
    (date, pc1, pc2, pc3, pc4, pc5)
    VALUES (%s,%s,%s,%s,%s,%s)
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
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",
        database="treadcasterdb"
    )
    cursor = conn.cursor()
    # Corrected spelling: user had 'market_strucutre_daily' and 'data' earlier
    query = """
    INSERT INTO market_structure_daily (date, avg_cross_asset_correlation_60d, correlation_dispersion_60d)
    VALUES (%s, %s, %s)
    ON DUPLICATE KEY UPDATE
        avg_cross_asset_correlation_60d = VALUES(avg_cross_asset_correlation_60d),
        correlation_dispersion_60d = VALUES(correlation_dispersion_60d)
    """
    cursor.execute(query, (date_val, avg_corr, std_corr))
    conn.commit()
    print("Market structure inserted")
    cursor.close()
    conn.close()

def insert_sector_ranking(date_val, sector_ranking):
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",
        database="treadcasterdb"
    )
    cursor = conn.cursor()
    query = """
    INSERT INTO sector_ranking_daily (date, rank_position, asset, score)
    VALUES (%s, %s, %s, %s)
    ON DUPLICATE KEY UPDATE
        rank_position = VALUES(rank_position),
        score         = VALUES(score)
    """
    data_tuples = [(date_val, row["rank"], row["asset"], row["score"]) for row in sector_ranking]
    cursor.executemany(query, data_tuples)
    conn.commit()
    print(f"{len(data_tuples)} sector ranking rows processed")
    cursor.close()
    conn.close()