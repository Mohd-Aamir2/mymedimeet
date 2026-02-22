import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier


# =========================
# HEART MODEL
# =========================

heart_df = pd.read_csv("heart.csv")

X_heart = heart_df.drop("target", axis=1)
y_heart = heart_df["target"]

X_train, X_test, y_train, y_test = train_test_split(
    X_heart, y_heart, test_size=0.2, random_state=42
)

heart_scaler = StandardScaler()
X_train_scaled = heart_scaler.fit_transform(X_train)

heart_model = RandomForestClassifier()
heart_model.fit(X_train_scaled, y_train)

joblib.dump(heart_model, "heart_model.pkl")
joblib.dump(heart_scaler, "heart_scaler.pkl")
joblib.dump(X_heart.columns.tolist(), "heart_features.pkl")

print("Heart model trained ✅")


# =========================
# DIABETES MODEL
# =========================

diabetes_df = pd.read_csv("diabetes.csv")

X_diabetes = diabetes_df.drop("Outcome", axis=1)
y_diabetes = diabetes_df["Outcome"]

X_train, X_test, y_train, y_test = train_test_split(
    X_diabetes, y_diabetes, test_size=0.2, random_state=42
)

diabetes_scaler = StandardScaler()
X_train_scaled = diabetes_scaler.fit_transform(X_train)

diabetes_model = RandomForestClassifier()
diabetes_model.fit(X_train_scaled, y_train)

joblib.dump(diabetes_model, "diabetes_model.pkl")
joblib.dump(diabetes_scaler, "diabetes_scaler.pkl")
joblib.dump(X_diabetes.columns.tolist(), "diabetes_features.pkl")

print("Diabetes model trained ✅")


# =========================
# STROKE MODEL
# =========================

stroke_df = pd.read_csv("healthcare-dataset-stroke-data.csv")

stroke_df = stroke_df.drop("id", axis=1)
stroke_df = stroke_df.dropna()

stroke_df = pd.get_dummies(stroke_df, drop_first=True)

X_stroke = stroke_df.drop("stroke", axis=1)
y_stroke = stroke_df["stroke"]

X_train, X_test, y_train, y_test = train_test_split(
    X_stroke, y_stroke, test_size=0.2, random_state=42
)

stroke_scaler = StandardScaler()
X_train_scaled = stroke_scaler.fit_transform(X_train)

stroke_model = RandomForestClassifier()
stroke_model.fit(X_train_scaled, y_train)

joblib.dump(stroke_model, "stroke_model.pkl")
joblib.dump(stroke_scaler, "stroke_scaler.pkl")
joblib.dump(X_stroke.columns.tolist(), "stroke_features.pkl")

print("Stroke model trained ✅")

print("\n🎉 All models trained successfully!")