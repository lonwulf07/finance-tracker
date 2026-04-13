import os
from flask import Flask, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import pandas as pd
from sklearn.ensemble import IsolationForest
from dotenv import load_dotenv
from bson.objectid import ObjectId

load_dotenv()

client = MongoClient(os.getenv("MONGO_URI"))
db = client['test']
transactions_collection = db['transactions']

app = Flask(__name__)
CORS(app) 

@app.route('/api/anomalies/<user_id>', methods=['GET'])
def get_anomalies(user_id):
    try:
        transactions = list(transactions_collection.find({"user": ObjectId(user_id)}))
        
        if len(transactions) < 5:
            return jsonify({"success": True, "anomalies": [], "message": "Not enough data"})

        df = pd.DataFrame(transactions)
        df['amount'] = pd.to_numeric(df['amount'])
        
        expense_df = df[df['type'] == 'expense'].copy()
        
        if len(expense_df) < 5:
            return jsonify({"success": True, "anomalies": []})

        expense_df['category'] = expense_df['category'].str.lower().str.strip()

        features_df = expense_df[['amount', 'category']].copy()
        encoded_features = pd.get_dummies(features_df, columns=['category'])

        model = IsolationForest(contamination=0.1, random_state=42)
        
        expense_df['anomaly_score'] = model.fit_predict(encoded_features)
        
        anomalies = expense_df[expense_df['anomaly_score'] == -1]
        anomaly_ids = [str(id) for id in anomalies['_id'].tolist()]

        return jsonify({
            "success": True,
            "anomalies": anomaly_ids
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001, debug=True)