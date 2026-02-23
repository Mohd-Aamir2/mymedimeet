from fastapi import FastAPI, Body, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import joblib
import numpy as np
import os

app = FastAPI()

# ----------------------------
# CORS Configuration
# ----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------
# Safe Model Path Setup
# ----------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def load_file(filename):
    file_path = os.path.join(BASE_DIR, filename)
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"{filename} not found in backend folder")
    return joblib.load(file_path)

# ----------------------------
# Load Models at Startup
# ----------------------------
try:
    heart_model = load_file("heart_model.pkl")
    heart_scaler = load_file("heart_scaler.pkl")
    heart_features = load_file("heart_features.pkl")

    diabetes_model = load_file("diabetes_model.pkl")
    diabetes_scaler = load_file("diabetes_scaler.pkl")
    diabetes_features = load_file("diabetes_features.pkl")

    stroke_model = load_file("stroke_model.pkl")
    stroke_scaler = load_file("stroke_scaler.pkl")
    stroke_features = load_file("stroke_features.pkl")

    print("✅ All ML models loaded successfully")

except Exception as e:
    print(f"❌ Error loading models: {e}")
    raise e


# ----------------------------
# Health Check Route
# ----------------------------
@app.get("/")
def health_check():
    return {"status": "Backend is running successfully"}


# ----------------------------
# Prediction Route
# ----------------------------
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
        raise HTTPException(status_code=400, detail="Invalid disease type")

    try:
        # Ensure feature order
        ordered_data = [data.get(feature, 0) for feature in features]

        input_array = np.array([ordered_data])
        input_scaled = scaler.transform(input_array)

        prediction_proba = model.predict_proba(input_scaled)[0][1]
        risk_percentage = round(prediction_proba * 100, 2)

        return {"risk_percentage": risk_percentage}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
