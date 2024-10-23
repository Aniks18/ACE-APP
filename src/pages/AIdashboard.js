import React, { useState, useEffect, useCallback } from 'react';
import SymptomPredictor from '../components/SymptomPredictor';
import { ArrowPathIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import IndiaDiseaseMap from '../components/IndiaDiseaseMap';
import diseaseData from '../components/diseaseData';
import SymptomAnalyzer from '../components/SymptomAnalyzer';
import LocationHealthNews from '../components/LocationHealthNews';
import HospitalStatistics from '../components/HospitalStatistics';
import hospitalData from '../assets/hospitals.json';
import MedicalShopDashboard from '../components/MedicalShopDashboard';
import medicalShopsData from '../assets/medicalshops.json';
import PandemicDashboard from '../components/PendemicDashboard';
import pandemicData from '../assets/citizen.json';
import AIHealthDashboard from '../components/AIHealthDashbaord';
import yourHealthCardData from '../assets/SwasthyaCard.json';
import {
  BookOpen,
  Activity,
  Map,
  Newspaper,
  Building2,
  Brain,
  HelpCircle,
  Stethoscope
} from 'lucide-react';

const AIDashboard = () => {
  const [location, setLocation] = useState(null);
  const [areaName, setAreaName] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedDisease, setSelectedDisease] = useState('Malaria');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Activity },
    { id: 'analysis', name: 'Health Analysis', icon: Brain },
    { id: 'hospitals', name: 'Healthcare', icon: Building2 },
    { id: 'statistics', name: 'Disease Statistics', icon: Brain },
  ];

  const requestLocation = useCallback(() => {
    setIsRefreshing(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setLocation(newLocation);
          localStorage.setItem('userLocation', JSON.stringify(newLocation));
          fetchAreaName(newLocation.latitude, newLocation.longitude);
          setIsRefreshing(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocation({ error: "Unable to retrieve location" });
          setIsRefreshing(false);
        }
      );
    } else {
      setLocation({ error: "Geolocation is not supported by this browser" });
      setIsRefreshing(false);
    }
  }, []);

  const fetchAreaName = async (lat, lng) => {
    const apiKey = 'a765827074be4fe1826ddc54d42af795';
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        const formattedAddress = result.formatted;
        setAreaName(formattedAddress);
      } else {
        setAreaName("Area name not found");
      }
    } catch (error) {
      console.error("Error fetching area name:", error);
      setAreaName("Error fetching area name");
    }
  };

  useEffect(() => {
    const storedLocation = localStorage.getItem('userLocation');
    if (storedLocation) {
      const parsedLocation = JSON.parse(storedLocation);
      setLocation(parsedLocation);
      fetchAreaName(parsedLocation.latitude, parsedLocation.longitude);
    } else {
      requestLocation();
    }
  }, [requestLocation]);

  const handleRefresh = () => {
    localStorage.removeItem('userLocation');
    requestLocation();
  };

  const handleDiseaseChange = (disease) => {
    setSelectedDisease(disease);
    setIsDropdownOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Stethoscope className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold text-primary">AI Health Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              {location && !location.error && (
                <span className="text-sm text-gray-600 flex items-center">
                  <Map className="h-4 w-4 mr-1" />
                  {areaName?.split(',')[0]}
                </span>
              )}
              <button 
                onClick={handleRefresh}
                className="bg-primary hover:bg-primary-dark text-white px-3 py-1 rounded-md flex items-center text-sm"
              >
                <ArrowPathIcon className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Location Alert */}
      {location && !location.error && (
        <div className="container mx-auto px-4 py-4">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-blue-700 flex items-center">
                  <Map className="h-5 w-5 mr-2" />
                  Current Location
                </p>
                <p className="text-blue-600 mt-1">Lat: {location.latitude.toFixed(4)}, Long: {location.longitude.toFixed(4)}</p>
                {areaName && (
                  <p className="text-blue-600 mt-1">
                    <span className="font-semibold">Area:</span> {areaName}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="container mx-auto px-4 py-4">
        <nav className="flex space-x-2 bg-white p-1 rounded-lg shadow-sm">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-primary text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-4">
        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <>
              {/* AI Prediction Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-2xl font-semibold mb-4 flex items-center">
                    <Brain className="h-6 w-6 mr-2 text-primary" />
                    AI-Powered Health Predictions
                  </h2>
                  <SymptomPredictor />
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-2xl font-semibold mb-4 flex items-center">
                    <Activity className="h-6 w-6 mr-2 text-primary" />
                    Symptom Analysis
                  </h2>
                  <SymptomAnalyzer />
                </div>
              </div>

              {/* News and Updates */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-2xl font-semibold mb-4 flex items-center">
                    <BookOpen className="h-6 w-6 mr-2 text-primary" />
                    Latest Research
                  </h2>
                  <ul className="space-y-3">
                    <li className="hover:bg-gray-50 p-2 rounded-md transition-colors">
                      <button className="text-accent hover:underline text-left w-full">
                        New study on AI in early disease detection
                      </button>
                    </li>
                    <li className="hover:bg-gray-50 p-2 rounded-md transition-colors">
                      <button className="text-accent hover:underline text-left w-full">
                        ML models improve drug discovery process
                      </button>
                    </li>
                    <li className="hover:bg-gray-50 p-2 rounded-md transition-colors">
                      <button className="text-accent hover:underline text-left w-full">
                        AI-assisted treatment plans show promising results
                      </button>
                    </li>
                  </ul>
                </div>
                {areaName && (
                  <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4 flex items-center">
                      <Newspaper className="h-6 w-6 mr-2 text-primary" />
                      Local Health Updates
                    </h2>
                    <LocationHealthNews cityName={areaName.split(',')[0]} />
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'analysis' && (
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <PandemicDashboard data={pandemicData} />
              </div>
              <AIHealthDashboard healthCardData={yourHealthCardData} />
            </div>
          )}

          {activeTab === 'hospitals' && (
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <HospitalStatistics hospitalData={hospitalData} />
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <MedicalShopDashboard data={medicalShopsData} />
              </div>
              
            </div>
          )}

          {activeTab === 'statistics' && (
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <Map className="h-6 w-6 mr-2 text-primary" />
                  Disease Map of India
                </h2>
                <div className="mb-4 relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Disease:
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <span className="block truncate">{selectedDisease}</span>
                      <ChevronDownIcon className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                    </button>
                    {isDropdownOpen && (
                      <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 ring-1 ring-black ring-opacity-5 overflow-auto">
                        {Object.keys(diseaseData).map((disease) => (
                          <button
                            key={disease}
                            onClick={() => handleDiseaseChange(disease)}
                            className={`${
                              disease === selectedDisease
                                ? 'bg-primary text-white'
                                : 'text-gray-900 hover:bg-gray-50'
                            } w-full px-4 py-2 text-left`}
                          >
                            {disease}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-full lg:w-3/4 mx-auto" style={{ height: '500px' }}>
                  <IndiaDiseaseMap diseaseData={diseaseData} selectedDisease={selectedDisease} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Section */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <HelpCircle className="h-6 w-6 mr-2 text-primary" />
            AI in Healthcare: What's Next?
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Artificial Intelligence is revolutionizing healthcare by improving diagnosis accuracy, 
            treatment effectiveness, and patient care. From predictive analytics to robotic surgery, 
            AI is paving the way for more personalized and efficient healthcare solutions.
          </p>
          <button className="mt-4 bg-secondary hover:bg-secondary-dark text-white py-2 px-6 rounded-md transition-colors duration-200 flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIDashboard;