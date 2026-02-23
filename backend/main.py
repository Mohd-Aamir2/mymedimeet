from fastapi import FastAPI, Body
import joblib
import numpy as np
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow requests from Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["*"] for all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models and scalers
heart_model = joblib.load("heart_model.pkl")
heart_scaler = joblib.load("heart_scaler.pkl")
heart_features = joblib.load("heart_features.pkl")

diabetes_model = joblib.load("diabetes_model.pkl")
diabetes_scaler = joblib.load("diabetes_scaler.pkl")
diabetes_features = joblib.load("diabetes_features.pkl")

stroke_model = joblib.load("stroke_model.pkl")
stroke_scaler = joblib.load("stroke_scaler.pkl")
stroke_features = joblib.load("stroke_features.pkl")


@app.post("/predict/{disease}")
def predict(disease: str, data: dict = Body(...)):
    if disease == "heart":
        model = heart_model
        scaler = heart_scaler
        features = heart_features
    elif disease == "diabetes":
        model = diabetes_model
        scaler = diabetes_scaler
        features = diabetes_features
    elif disease == "stroke":
        model = stroke_model
        scaler = stroke_scaler
        features = stroke_features
    else:
        return {"error": "Invalid disease type"}

    # Safe feature handling
    ordered_data = [data.get(feature, 0) for feature in features]

    # Convert to numpy
    input_array = np.array([ordered_data])

    # Scale
    input_scaled = scaler.transform(input_array)

    # Predict
    prediction_proba = model.predict_proba(input_scaled)[0][1]
    risk_percentage = round(prediction_proba * 100, 2)

    return {"risk_percentage": risk_percentage}