import React, { useState } from 'react';

const SymptomAnalyzer = () => {
  const [symptoms, setSymptoms] = useState({
    primarySymptom: '',
    secondarySymptom: '',
    optionalSymptom: ''
  });
  const [medicationType, setMedicationType] = useState('allopathy');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeSymptoms = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyA6206mZepQktTDaSI_x6-Y1LNvy9cqKHs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `As a medical expert, analyze these symptoms and provide detailed medical analysis:
              Primary Symptom: ${symptoms.primarySymptom}
              Secondary Symptom: ${symptoms.secondarySymptom}
              ${symptoms.optionalSymptom ? `Additional Symptom: ${symptoms.optionalSymptom}` : ''}
              Medicine Type Preferred: ${medicationType}

              Provide analysis in this exact format:
              {
                "conditions": [
                  {
                    "name": "Condition Name",
                    "probability": 85,
                    "medications": ["Medicine 1", "Medicine 2"],
                    "precautions": ["Precaution 1", "Precaution 2"]
                  }
                ]
              }`
            }]
          }]
        })
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (data.error) {
        throw new Error(data.error.message);
      }

      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        try {
          const results = JSON.parse(data.candidates[0].content.parts[0].text);
          setAnalysisResults(results);
        } catch (parseError) {
          console.error('Parsing error:', parseError);
          console.log('Raw response:', data.candidates[0].content.parts[0].text);
          setError('Error processing the response. Please try again.');
        }
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setError(`Failed to analyze symptoms: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={analyzeSymptoms} className="space-y-4">
        <div className="space-y-4">
          <input
            type="text"
            value={symptoms.primarySymptom}
            onChange={(e) => setSymptoms(prev => ({ ...prev, primarySymptom: e.target.value }))}
            placeholder="Primary Symptom (Required)"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />

          <input
            type="text"
            value={symptoms.secondarySymptom}
            onChange={(e) => setSymptoms(prev => ({ ...prev, secondarySymptom: e.target.value }))}
            placeholder="Secondary Symptom (Required)"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />

          <input
            type="text"
            value={symptoms.optionalSymptom}
            onChange={(e) => setSymptoms(prev => ({ ...prev, optionalSymptom: e.target.value }))}AV
            placeholder="Additional Symptom (Optional)"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-4 items-center">
          <select
            value={medicationType}
            onChange={(e) => setMedicationType(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[120px]"
          >
            <option value="allopathy">Allopathy</option>
            <option value="homeopathy">Homeopathy</option>
            <option value="ayurvedic">Ayurvedic</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="flex-grow md:flex-grow-0 px-6 py-2 text-white rounded-lg transition-colors whitespace-nowrap bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Analyzing...' : 'Analyze Symptoms'}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          {error}
        </div>
      )}

      {analysisResults && (
        <div className="mt-6 space-y-4">
          {analysisResults.conditions.map((condition, index) => (
            <div key={index} className="p-4 bg-blue-50 rounded-lg shadow">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-blue-800">{condition.name}</h3>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {condition.probability}% Likely
                </span>
              </div>

              <div className="mt-3">
                <h4 className="font-medium text-gray-700 mb-2">Recommended Medications:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {condition.medications.map((med, idx) => (
                    <li key={idx} className="text-gray-600">{med}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-3">
                <h4 className="font-medium text-gray-700 mb-2">Precautions:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {condition.precautions.map((precaution, idx) => (
                    <li key={idx} className="text-gray-600">{precaution}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SymptomAnalyzer;