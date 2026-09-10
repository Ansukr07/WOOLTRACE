import json
from datetime import datetime
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
import xgboost as xgb

ROOT = Path(__file__).resolve().parents[2]
MODEL_DIR = ROOT / "api" / "models" / "mandi"
MODEL_VERSION = "khetsetu-mandi-xgb-v2-delta"


def json_response(status, body):
    return {"statusCode": status, "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST,OPTIONS", "Access-Control-Allow-Headers": "Content-Type, Authorization", "Access-Control-Max-Age": "86400"}, "body": json.dumps(body, default=str)}


def make_features(observations, prep):
    frame = pd.DataFrame(observations).copy()
    required = prep["series_columns"] + ["min_price", "max_price", "modal_price", "price_date"]
    missing = [column for column in required if column not in frame.columns]
    if missing:
        raise ValueError("Missing observation fields: " + ", ".join(missing))
    frame["price_date"] = pd.to_datetime(frame["price_date"], errors="coerce")
    for column in ["min_price", "max_price", "modal_price"]:
        frame[column] = pd.to_numeric(frame[column], errors="coerce")
    frame = frame.dropna(subset=required).sort_values(prep["series_columns"] + ["price_date"]).reset_index(drop=True)
    for column in prep["categorical_columns"]:
        frame[column] = frame[column].fillna("Unknown").astype(str).replace("", "Unknown")
    grouped = frame.groupby(prep["series_columns"], sort=False, observed=True)
    modal = grouped["modal_price"]
    for lag in prep["lags"]:
        frame[f"modal_lag_{lag}"] = modal.shift(lag)
    previous = modal.shift(1)
    previous_grouped = previous.groupby([frame[column] for column in prep["series_columns"]], sort=False, observed=True)
    for window in prep["rolling_mean_windows"]:
        frame[f"modal_mean_{window}"] = previous_grouped.transform(lambda values, size=window: values.rolling(size, min_periods=size).mean())
    for window in prep["rolling_std_windows"]:
        frame[f"modal_std_{window}"] = previous_grouped.transform(lambda values, size=window: values.rolling(size, min_periods=size).std())
    for lag in [1, 3, 7, 14]:
        frame[f"delta_{lag}"] = frame["modal_price"] - frame[f"modal_lag_{lag}"]
    frame["pct_change_1"] = (frame["modal_price"] / frame["modal_lag_1"] - 1).replace([np.inf, -np.inf], np.nan)
    frame["pct_change_7"] = (frame["modal_price"] / frame["modal_lag_7"] - 1).replace([np.inf, -np.inf], np.nan)
    for window in [7, 30]:
        mean = frame[f"modal_mean_{window}"]
        frame[f"distance_from_mean_{window}"] = frame["modal_price"] - mean
        frame[f"relative_to_mean_{window}"] = (frame["modal_price"] / mean - 1).replace([np.inf, -np.inf], np.nan)
    for window in [7, 14, 30]:
        frame[f"cv_{window}"] = (frame[f"modal_std_{window}"] / frame[f"modal_mean_{window}"]).replace([np.inf, -np.inf], np.nan)
    frame["days_since_previous_report"] = (frame["price_date"] - grouped["price_date"].shift(1)).dt.days
    frame["price_spread"] = frame["max_price"] - frame["min_price"]
    frame["month"] = frame["price_date"].dt.month
    frame["day_of_week"] = frame["price_date"].dt.dayofweek
    frame["day_of_year"] = frame["price_date"].dt.dayofyear
    usable = frame.dropna(subset=prep["numeric_features"])
    if usable.empty:
        raise ValueError("At least 31 chronological observations for the same market/commodity series are required")
    return usable.iloc[[-1]]


def handler(request):
    if request.method == "OPTIONS":
        return {"statusCode": 204, "headers": {"Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST,OPTIONS", "Access-Control-Allow-Headers": "Content-Type, Authorization", "Access-Control-Max-Age": "86400"}, "body": ""}
    if request.method != "POST":
        return json_response(405, {"success": False, "message": "Method not allowed"})
    try:
        body = request.get_json(silent=True) or {}
        observations = body.get("observations") or []
        if not isinstance(observations, list) or len(observations) < 31:
            return json_response(400, {"success": False, "message": "At least 31 historical observations are required"})
        prep = joblib.load(MODEL_DIR / "preprocessing.joblib")
        model = xgb.XGBRegressor()
        model.load_model(str(MODEL_DIR / "khetsetu_mandi_xgb_v2_delta.json"))
        latest = make_features(observations, prep)
        categories = prep["encoder"].transform(latest[prep["categorical_columns"]].astype(str))
        from scipy import sparse
        numeric = sparse.csr_matrix(latest[prep["numeric_features"]].to_numpy(dtype=np.float32))
        predicted_delta = float(model.predict(sparse.hstack([numeric, categories], format="csr"))[0])
        current = float(latest.iloc[0]["modal_price"])
        next_price = current + predicted_delta
        return json_response(200, {"success": True, "modelVersion": MODEL_VERSION, "currentModalPrice": current, "predictedDelta": round(predicted_delta, 2), "predictedNextModalPrice": round(next_price, 2), "predictionDate": datetime.utcnow().date().isoformat(), "units": "Rs./quintal"})
    except Exception as error:
        return json_response(500, {"success": False, "message": str(error), "modelVersion": MODEL_VERSION})
