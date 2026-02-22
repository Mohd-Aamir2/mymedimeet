"use client"
import { useState, useEffect } from "react";
import { ArrowRight, Stethoscope } from "lucide-react";

function App() {

  const fieldConfig = {
    heart: {
      age: { label: "Age", min: 20, max: 100 },
      sex: { label: "Sex (0=Female,1=Male)", min: 0, max: 1 },
      cp: { label: "Chest Pain Type (0-3)", min: 0, max: 3 },
      trestbps: { label: "Resting BP", min: 80, max: 200 },
      chol: { label: "Cholesterol", min: 100, max: 600 },
      fbs: { label: "Fasting Blood Sugar (0-1)", min: 0, max: 1 },
      restecg: { label: "Rest ECG (0-2)", min: 0, max: 2 },
      thalach: { label: "Max Heart Rate", min: 60, max: 220 },
      exang: { label: "Exercise Angina (0-1)", min: 0, max: 1 },
      oldpeak: { label: "ST Depression", min: 0, max: 6 },
      slope: { label: "Slope (0-2)", min: 0, max: 2 },
      ca: { label: "Major Vessels (0-4)", min: 0, max: 4 },
      thal: { label: "Thalassemia (0-3)", min: 0, max: 3 }
    },
    diabetes: {
      Pregnancies: { label: "Pregnancies", min: 0, max: 20 },
      Glucose: { label: "Glucose Level", min: 70, max: 300 },
      BloodPressure: { label: "Blood Pressure", min: 40, max: 200 },
      SkinThickness: { label: "Skin Thickness", min: 0, max: 100 },
      Insulin: { label: "Insulin", min: 0, max: 900 },
      BMI: { label: "BMI", min: 10, max: 70 },
      DiabetesPedigreeFunction: { label: "DPF", min: 0, max: 3 },
      Age: { label: "Age", min: 18, max: 100 }
    },
    stroke: {
      age: { label: "Age", min: 18, max: 100 },
      hypertension: { label: "Hypertension (0-1)", min: 0, max: 1 },
      heart_disease: { label: "Heart Disease (0-1)", min: 0, max: 1 },
      avg_glucose_level: { label: "Avg Glucose", min: 50, max: 300 },
      bmi: { label: "BMI", min: 10, max: 70 },
      gender_Male: { label: "Male (0-1)", min: 0, max: 1 },
      ever_married_Yes: { label: "Married (0-1)", min: 0, max: 1 },
      work_type_Private: { label: "Private Job (0-1)", min: 0, max: 1 },
      Residence_type_Urban: { label: "Urban (0-1)", min: 0, max: 1 },
      "smoking_status_formerly smoked": { label: "Former Smoker (0-1)", min: 0, max: 1 },
      "smoking_status_never smoked": { label: "Never Smoked (0-1)", min: 0, max: 1 },
      smoking_status_smokes: { label: "Currently Smokes (0-1)", min: 0, max: 1 }
    }
  };

  const [disease, setDisease] = useState("heart");
  const [formData, setFormData] = useState({});
  const [result, setResult] = useState(null);
  const [animatedRisk, setAnimatedRisk] = useState(0);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: parseFloat(e.target.value)
    });
  };

  const handleSubmit = async () => {
    const response = await fetch(
      `http://127.0.0.1:8000/predict/${disease}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      }
    );
    const data = await response.json();
    setResult(data);
  };

  // Animated counter
  useEffect(() => {
    if (!result) return;
    let start = 0;
    const end = result.risk_percentage;
    const duration = 800;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setAnimatedRisk(Math.floor(start));
    }, 16);

    return () => clearInterval(timer);
  }, [result]);

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (animatedRisk / 100) * circumference;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-black to-emerald-800 text-white flex flex-col items-center p-6">

      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3 text-center">
        <Stethoscope className="text-emerald-400 animate-pulse" />
        AI Multi-Disease Risk Predictor
      </h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {["heart", "diabetes", "stroke"].map((item) => (
          <button
            key={item}
            onClick={() => {
              setDisease(item);
              setResult(null);
              setFormData({});
            }}
            className={`px-6 py-2 rounded-full transition-all duration-300
              ${
                disease === item
                  ? "bg-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.8)]"
                  : "bg-emerald-900/40 hover:shadow-[0_0_20px_rgba(16,185,129,0.6)]"
              }`}
          >
            {item.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="w-full max-w-6xl backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] transition-all duration-500">

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Object.entries(fieldConfig[disease]).map(([field, config]) => (
            <div key={field} className="flex flex-col">
              <label className="text-sm mb-2 text-emerald-300 font-medium">
                {config.label}
              </label>

              <input
                type="number"
                name={field}
                min={config.min}
                max={config.max}
                step="any"
                placeholder=""
                onChange={handleChange}
                className="p-2 rounded-md bg-white/10 border border-white/20 
                           focus:outline-none focus:ring-2 focus:ring-emerald-400 
                           transition-all"
              />

              <span className="text-xs text-gray-400 mt-1">
                Range: {config.min} – {config.max}
              </span>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={handleSubmit}
            className="px-8 py-3 bg-emerald-500 rounded-full font-medium flex items-center gap-2
              shadow-[0_0_25px_rgba(16,185,129,0.6)]
              hover:shadow-[0_0_35px_rgba(16,185,129,1)]
              transition-all duration-300"
          >
            Predict <ArrowRight size={18} />
          </button>
        </div>

        {result && (
          <div className="flex flex-col items-center mt-12">

            <div className="relative">
              <svg width="180" height="180">
                <circle
                  stroke="rgba(255,255,255,0.2)"
                  fill="transparent"
                  strokeWidth="12"
                  r={radius}
                  cx="90"
                  cy="90"
                />
                <circle
                  stroke="#10B981"
                  fill="transparent"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  r={radius}
                  cx="90"
                  cy="90"
                  style={{ transition: "stroke-dashoffset 0.5s ease" }}
                />
              </svg>

              <div className="absolute inset-0 flex items-center justify-center text-3xl font-bold">
                {animatedRisk}%
              </div>
            </div>

            <p className="mt-4 text-lg opacity-80">
              {animatedRisk < 30
                ? "Low Risk"
                : animatedRisk < 60
                ? "Moderate Risk"
                : "High Risk"}
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;