import React, { useState } from 'react';
import axios from 'axios';

interface FormData {
  age: number;
  gender: number;
  cp: number;
  trestbps: number;
  chol: number;
  fbs: number;
  restecg: number;
  thalach: number;
  exang: number;
  oldpeak: number;
  ca: number;
}

interface PredictionResult {
  risk_score: number;
  probability: number;
}

const CVDRiskForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    age: 0,
    gender: 0,
    cp: 0,
    trestbps: 0,
    chol: 0,
    fbs: 0,
    restecg: 0,
    thalach: 0,
    exang: 0,
    oldpeak: 0,
    ca: 0,
  });

  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log('Sending request to backend with data:', formData);
      const response = await axios.post('http://localhost:8000/predict/xgb', formData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout: 5000, // 5 second timeout
      });
      console.log('Received response:', response.data);
      setPrediction(response.data);
    } catch (err) {
      console.error('Detailed error:', err);
      if (axios.isAxiosError(err)) {
        if (err.code === 'ERR_NETWORK') {
          setError('Cannot connect to the server. Please make sure the backend server is running on http://localhost:8000');
        } else if (err.response) {
          setError(`Server Error: ${err.response.data?.detail || err.message}`);
        } else if (err.request) {
          setError('No response from server. Please make sure the backend server is running.');
        } else {
          setError(`Error: ${err.message}`);
        }
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">CVD Risk Prediction</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">Select Gender</option>
              <option value="0">Female</option>
              <option value="1">Male</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Chest Pain Type</label>
            <select
              name="cp"
              value={formData.cp}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">Select Chest Pain Type</option>
              <option value="0">Typical Angina</option>
              <option value="1">Atypical Angina</option>
              <option value="2">Non-anginal Pain</option>
              <option value="3">Asymptomatic</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Resting Blood Pressure</label>
            <input
              type="number"
              name="trestbps"
              value={formData.trestbps}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Serum Cholesterol</label>
            <input
              type="number"
              name="chol"
              value={formData.chol}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Fasting Blood Sugar</label>
            <select
              name="fbs"
              value={formData.fbs}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">Select Fasting Blood Sugar</option>
              <option value="0">≤ 120 mg/dl</option>
              <option value="1">&gt; 120 mg/dl</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Resting ECG</label>
            <select
              name="restecg"
              value={formData.restecg}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">Select Resting ECG</option>
              <option value="0">Normal</option>
              <option value="1">ST-T Wave Abnormality</option>
              <option value="2">Left Ventricular Hypertrophy</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Maximum Heart Rate</label>
            <input
              type="number"
              name="thalach"
              value={formData.thalach}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Exercise Induced Angina</label>
            <select
              name="exang"
              value={formData.exang}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">Select Exercise Induced Angina</option>
              <option value="0">No</option>
              <option value="1">Yes</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">ST Depression (Oldpeak)</label>
            <input
              type="number"
              step="0.1"
              name="oldpeak"
              value={formData.oldpeak}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Number of Major Vessels</label>
            <select
              name="ca"
              value={formData.ca}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">Select Number of Major Vessels</option>
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Calculating...' : 'Calculate Risk'}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {prediction && (
        <div className="mt-6 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Prediction Results</h2>
          <div className="space-y-2">
            <p className="text-lg">
              {/* <span className="font-medium">Risk Score:</span> {prediction.risk_score.toFixed(2)} */}
            </p>
            <p className="text-lg">
              <span className="font-medium">Probability of CVD:</span> {prediction.probability.toFixed(2)}%
            </p>
            <div className="mt-4 p-4 bg-blue-50 rounded-md">
              <h3 className="font-medium text-blue-800 mb-2">Interpretation:</h3>
              <p className="text-blue-700">
                {prediction.probability < 30 
                  ? "Low risk of cardiovascular disease"
                  : prediction.probability < 60
                  ? "Moderate risk of cardiovascular disease"
                  : "High risk of cardiovascular disease"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CVDRiskForm; 