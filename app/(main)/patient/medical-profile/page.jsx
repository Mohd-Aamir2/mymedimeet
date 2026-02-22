"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

import { useRouter } from "next/navigation"; 
import { CheckCircle, Moon, Sun } from "lucide-react"

export default function MedicalProfilePage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    height: "",
    weight: "",
    allergies: "",
    medicalHistory: "",
    smoking: false,
    alcohol: false,
    activityLevel: "",
    sleepHours: "",
  })

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode)
  }, [darkMode])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const calculateBMI = () => {
    const { height, weight } = formData
    if (!height || !weight) return null
    return (weight / ((height / 100) ** 2)).toFixed(1)
  }

  const bmi = calculateBMI()

  // 🔥 AI Health Score Calculation
  const calculateHealthScore = () => {
    let score = 100

    if (formData.smoking) score -= 20
    if (formData.alcohol) score -= 10
    if (bmi && (bmi < 18.5 || bmi > 30)) score -= 15
    if (formData.sleepHours && formData.sleepHours < 6) score -= 10
    if (formData.activityLevel === "Low") score -= 10

    return Math.max(score, 0)
  }

  const healthScore = calculateHealthScore()

  const nextStep = () => setStep((prev) => prev + 1)
  const prevStep = () => setStep((prev) => prev - 1)

  const handleSubmit = async () => {
  try {
    const res = await fetch("http://127.0.0.1:8000/predict/heart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData),
      
    })

    if (!res.ok) {
      const errorText = await res.text()
      console.error("Server error:", errorText)
      throw new Error(`HTTP ${res.status}`)

   
    }
    // ✅ Show success message
    alert("Saved successfully ✅")

    // ✅ Redirect to doctors page
    router.push("/doctors")
    const data = await res.json()
    console.log("Success:", data)

  } catch (error) {
    console.error("Submit failed:", error)
    alert("Something went wrong. Check console.")
  }
}

  const inputStyle =
    "w-full border border-emerald-200 dark:border-emerald-800 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all bg-white/60 dark:bg-emerald-950"

  const radius = 70
  const circumference = 2 * Math.PI * radius
  const bmiPercentage = bmi ? Math.min((bmi / 40) * 100, 100) : 0
  const strokeDashoffset =
    circumference - (bmiPercentage / 100) * circumference

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-emerald-50 via-white to-emerald-100 dark:from-emerald-950 dark:via-black dark:to-emerald-900 transition-all">

      <div className="w-full max-w-4xl bg-white/70 dark:bg-black/40 backdrop-blur-2xl shadow-[0_20px_60px_rgba(16,185,129,0.2)] rounded-3xl p-8 border border-white/40 dark:border-emerald-800">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
            Medical Profile
          </h1>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        {/* Progress */}
        <div className="w-full h-2 bg-emerald-100 dark:bg-emerald-800 rounded-full mb-8">
          <div
            className="h-full bg-emerald-600 transition-all duration-500"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-8">

          {/* LEFT SIDE FORM */}
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                {step === 1 && (
                  <>
                    <input
                      type="number"
                      name="age"
                      placeholder="Age"
                      value={formData.age}
                      onChange={handleChange}
                      className={inputStyle}
                    />
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className={inputStyle}
                    >
                      <option value="">Gender</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </>
                )}

                {step === 2 && (
                  <>
                    <input
                      type="number"
                      name="height"
                      placeholder="Height (cm)"
                      value={formData.height}
                      onChange={handleChange}
                      className={inputStyle}
                    />
                    <input
                      type="number"
                      name="weight"
                      placeholder="Weight (kg)"
                      value={formData.weight}
                      onChange={handleChange}
                      className={inputStyle}
                    />
                  </>
                )}

                {step === 3 && (
                  <>
                    <textarea
                      name="medicalHistory"
                      placeholder="Medical History"
                      value={formData.medicalHistory}
                      onChange={handleChange}
                      className={inputStyle}
                    />
                    <textarea
                      name="allergies"
                      placeholder="Allergies"
                      value={formData.allergies}
                      onChange={handleChange}
                      className={inputStyle}
                    />
                  </>
                )}

                {step === 4 && (
                  <>
                    <input
                      type="number"
                      name="sleepHours"
                      placeholder="Sleep Hours"
                      value={formData.sleepHours}
                      onChange={handleChange}
                      className={inputStyle}
                    />
                    <select
                      name="activityLevel"
                      value={formData.activityLevel}
                      onChange={handleChange}
                      className={inputStyle}
                    >
                      <option value="">Activity Level</option>
                      <option>Low</option>
                      <option>Moderate</option>
                      <option>High</option>
                    </select>
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Buttons */}
            <div className="flex justify-between mt-6">
              {step > 1 && (
                <button
                  onClick={prevStep}
                  className="px-6 py-2 bg-gray-200 dark:bg-emerald-900 rounded-xl"
                >
                  Back
                </button>
              )}
              {step < 4 ? (
                <button
                  onClick={nextStep}
                  className="px-6 py-2 text-white rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 text-white rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              )}
            </div>
          </div>

          {/* RIGHT SIDE AI CARD */}
          <div className="bg-emerald-50 dark:bg-emerald-950 rounded-2xl p-6 border border-emerald-200 dark:border-emerald-800">

            <h2 className="text-xl font-semibold mb-4 text-emerald-600 dark:text-emerald-400">
              AI Health Score
            </h2>

            <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-4">
              {healthScore}/100
            </div>

            {/* Circular BMI Indicator */}
            <div className="flex justify-center mb-6">
              <svg width="180" height="180">
                <circle
                  cx="90"
                  cy="90"
                  r={radius}
                  stroke="#d1fae5"
                  strokeWidth="12"
                  fill="transparent"
                />
                <motion.circle
                  cx="90"
                  cy="90"
                  r={radius}
                  stroke="#10b981"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1 }}
                />
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dy=".3em"
                  className="fill-emerald-600 dark:fill-emerald-400 text-lg font-bold"
                >
                  BMI {bmi || "--"}
                </text>
              </svg>
            </div>

            <p className="text-sm text-emerald-700 dark:text-emerald-300">
              Score is calculated based on BMI, sleep, activity, and habits.
            </p>

            {success && (
              <div className="mt-4 flex items-center gap-2 text-emerald-900 dark:text-emerald-400">
                <CheckCircle size={18} />
                Profile Saved
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}