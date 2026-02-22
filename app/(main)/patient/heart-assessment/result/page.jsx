"use client";

import { useEffect, useState } from "react";
import jsPDF from "jspdf";

export default function ResultPage() {
  const [result, setResult] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("heartResult");
    if (stored) {
      setResult(JSON.parse(stored));
    }
  }, []);

  if (!result)
    return <div>No result available.</div>;

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Heart Disease Medical Report", 20, 20);
    doc.text(
      `Risk Level: ${
        result.prediction === 1 ? "High Risk" : "Low Risk"
      }`,
      20,
      40
    );
    doc.text(
      `Confidence: ${result.confidence}%`,
      20,
      50
    );
    doc.save("heart_report.pdf");
  };

  return (
    <div className="bg-emerald-900 shadow-xl rounded-xl p-8 max-w-3xl mx-auto">

      <h2 className="text-2xl font-bold mb-6">
        📊 Assessment Result
      </h2>

      {/* Risk Card */}
      <div
        className={`p-6 rounded-lg mb-6 ${
          result.prediction === 1
            ? "bg-red-500"
            : "bg-green-600"
        }`}
      >
        <h3 className="text-xl font-semibold">
          {result.prediction === 1
            ? "⚠️ High Risk"
            : "✅ Low Risk"}
        </h3>

        {/* Risk Bar */}
        <div className="w-full bg-gray-300 rounded-full h-6 mt-4">
          <div
            className={`h-6 rounded-full text-white text-center ${
              result.prediction === 1
                ? "bg-red-500"
                : "bg-green-500"
            }`}
            style={{
              width: `${result.confidence}%`,
            }}
          >
            {result.confidence}%
          </div>
        </div>
      </div>

      {/* AI Explanation */}
      <div className="mb-6">
        <h4 className="font-semibold">
          🧠 AI Explanation
        </h4>
        <p>
          Main affecting factor:{" "}
          {result.top_factor || "N/A"}
        </p>
      </div>

      {/* Recommendation */}
      <div className="mb-6">
        <h4 className="font-semibold">
          🩺 Recommendation
        </h4>
        <p>
          Maintain balanced diet, exercise regularly,
          and consult cardiologist if needed.
        </p>
      </div>

      <button
        onClick={downloadPDF}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
      >
        📄 Download Report
      </button>
    </div>
  );
}