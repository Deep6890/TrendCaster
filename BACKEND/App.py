from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app) 

@app.route("/api/data")
def send_data():
    
    df = pd.read_csv("../DATA/ITDATA.CSV")
    df = df.to_json(orient="records")
    
    return jsonify(df)

if __name__ == "__main__":
    app.run(debug=True)