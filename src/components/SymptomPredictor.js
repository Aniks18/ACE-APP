import React, { useState } from 'react';
import axios from 'axios';

const SymptomPredictor = () => {
  const [formData, setFormData] = useState({
    symptom1: '',
    symptom2: '',
    symptom3: '',
    age: '',
    bmi: '',
    temperature: '',
    season: 'summer',
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://127.0.0.1:5000/predict', {
        params: {
          symptom1: formData.symptom1,
          symptom2: formData.symptom2,
          symptom3: formData.symptom3,
          age: parseInt(formData.age),
          bmi: parseFloat(formData.bmi),
          temperature: parseFloat(formData.temperature),
          season: formData.season,
        },
      });
      setPrediction(response.data);
    } catch (error) {
      console.error('Error fetching prediction:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(`Server error: ${error.response.status} - ${error.response.data}`);
      } else if (error.request) {
        // The request was made but no response was received
        setError('No response received from the server. Please check if the server is running.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError(`Error: ${error.message}`);
      }
    }
    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-primary">Disease Predictor</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="symptom1"
            value={formData.symptom1}
            onChange={handleChange}
            placeholder="Primary Symptom"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            name="symptom2"
            value={formData.symptom2}
            onChange={handleChange}
            placeholder="Secondary Symptom"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            name="symptom3"
            value={formData.symptom3}
            onChange={handleChange}
            placeholder="Tertiary Symptom (optional)"
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="Age"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="number"
            name="bmi"
            value={formData.bmi}
            onChange={handleChange}
            placeholder="BMI"
            step="0.1"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="number"
            name="temperature"
            value={formData.temperature}
            onChange={handleChange}
            placeholder="Temperature (°C)"
            step="0.1"
            className="w-full p-2 border rounded"
            required
          />
          <select
            name="season"
            value={formData.season}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="summer">Summer</option>
            <option value="winter">Winter</option>
            <option value="spring">Spring</option>
            <option value="fall">Fall</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark transition duration-300"
          disabled={loading}
        >
          {loading ? 'Predicting...' : 'Predict Disease'}
        </button>
      </form>
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      {prediction && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Prediction Results:</h3>
          <p className="font-bold">Predicted Disease Group: {prediction.predicted_disease}</p>
          <h4 className="font-semibold mt-2">Probabilities for each disease group:</h4>
          <ul className="list-disc pl-5">
            {Object.entries(prediction.probabilities).map(([disease, probability]) => (
              <li key={disease}>
                {disease}: {(probability * 100).toFixed(2)}%
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SymptomPredictor;