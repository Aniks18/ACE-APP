import React, { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line,
  AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { AlertCircle, Activity, Users, Hospital, Thermometer, TrendingUp, Shield } from 'lucide-react';

const COLORS = ['#ff7c43', '#00b4d8', '#023e8a', '#0077b6', '#48cae4', '#90e0ef'];
const GENDER_COLORS = {
  male: '#0077b6',
  female: '#ff7c43'
};

const PandemicDashboard = ({ data }) => {
  const [selectedDisease, setSelectedDisease] = useState('heart_disease');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('all');
  const [selectedView, setSelectedView] = useState('overview');

  const diseases = useMemo(() => {
    return Object.entries(data.city_health_data.disease_statistics).map(([key, value]) => ({
      id: key,
      name: key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      total: value.total_cases,
      growth: value.yearly_growth_rate
    }));
  }, [data]);

  const currentDisease = useMemo(() => {
    return data.city_health_data.disease_statistics[selectedDisease];
  }, [data, selectedDisease]);

  // Prepare data for age-gender distribution
  const ageGenderData = useMemo(() => {
    if (!currentDisease?.cases_by_age_gender) return [];
    return currentDisease.cases_by_age_gender.map(group => ({
      name: group.age_group,
      male: group.male_cases,
      female: group.female_cases,
      total: group.male_cases + group.female_cases
    }));
  }, [currentDisease]);

  // Calculate total cases by gender
  const genderDistribution = useMemo(() => {
    if (!currentDisease?.cases_by_age_gender) return [];
    const totals = currentDisease.cases_by_age_gender.reduce(
      (acc, group) => ({
        male: acc.male + group.male_cases,
        female: acc.female + group.female_cases
      }),
      { male: 0, female: 0 }
    );
    return [
      { name: 'Male', value: totals.male },
      { name: 'Female', value: totals.female }
    ];
  }, [currentDisease]);

  // Prepare risk factors data
  const riskFactorsData = useMemo(() => {
    const factors = data.city_health_data.risk_factors;
    return [
      ...factors.environmental.map(factor => ({ name: factor, category: 'Environmental', value: 75 })),
      ...factors.lifestyle.map(factor => ({ name: factor, category: 'Lifestyle', value: 85 })),
      ...factors.socioeconomic.map(factor => ({ name: factor, category: 'Socioeconomic', value: 65 }))
    ];
  }, [data]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Pandemic Health Dashboard</h2>
          <div className="flex space-x-2">
            <span className="text-sm text-gray-500">Last Updated: {data.city_health_data.metadata.last_updated}</span>
            <AlertCircle className="h-5 w-5 text-red-500" />
          </div>
        </div>

        {/* Key Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-semibold">Total Population</p>
                <p className="text-2xl font-bold text-blue-800">{data.city_health_data.total_population.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-red-50 p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 text-sm font-semibold">Active Cases</p>
                <p className="text-2xl font-bold text-red-800">{currentDisease?.total_cases.toLocaleString()}</p>
              </div>
              <Thermometer className="h-8 w-8 text-red-500" />
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-semibold">Healthcare Centers</p>
                <p className="text-2xl font-bold text-green-800">{data.city_health_data.healthcare_infrastructure.hospitals}</p>
              </div>
              <Hospital className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-semibold">Growth Rate</p>
                <p className="text-2xl font-bold text-purple-800">{currentDisease?.yearly_growth_rate}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <select
              value={selectedDisease}
              onChange={(e) => setSelectedDisease(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {diseases.map(disease => (
                <option key={disease.id} value={disease.id}>{disease.name}</option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <select
              value={selectedView}
              onChange={(e) => setSelectedView(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="overview">Overview</option>
              <option value="demographics">Demographics</option>
              <option value="trends">Trends & Patterns</option>
              <option value="risk">Risk Analysis</option>
            </select>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Age-Gender Distribution */}
          <div className="bg-white p-4 rounded-lg shadow h-[400px]">
            <h3 className="text-lg font-semibold mb-4">Age-Gender Distribution</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ageGenderData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="male" name="Male Cases" fill={GENDER_COLORS.male} stackId="a" />
                <Bar dataKey="female" name="Female Cases" fill={GENDER_COLORS.female} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Gender Distribution Pie Chart */}
          <div className="bg-white p-4 rounded-lg shadow h-[400px]">
            <h3 className="text-lg font-semibold mb-4">Gender Distribution</h3>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={130}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {genderDistribution.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === 0 ? GENDER_COLORS.male : GENDER_COLORS.female} 
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Risk Factors Radar Chart */}
          <div className="bg-white p-4 rounded-lg shadow h-[400px]">
            <h3 className="text-lg font-semibold mb-4">Risk Factors Analysis</h3>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={riskFactorsData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar
                  name="Risk Level"
                  dataKey="value"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Healthcare Infrastructure */}
          <div className="bg-white p-4 rounded-lg shadow h-[400px]">
            <h3 className="text-lg font-semibold mb-4">Healthcare Infrastructure</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  {
                    name: 'Hospitals',
                    value: data.city_health_data.healthcare_infrastructure.hospitals
                  },
                  {
                    name: 'Primary Centers',
                    value: data.city_health_data.healthcare_infrastructure.primary_health_centers
                  },
                  {
                    name: 'Specialized Clinics',
                    value: data.city_health_data.healthcare_infrastructure.specialized_clinics
                  },
                  {
                    name: 'Diagnostic Centers',
                    value: data.city_health_data.healthcare_infrastructure.diagnostic_centers
                  }
                ]}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#4C51BF" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Risk Factors</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-700">Environmental</h4>
                <ul className="list-disc list-inside text-sm text-gray-600">
                  {data.city_health_data.risk_factors.environmental.map(factor => (
                    <li key={factor}>{factor}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Lifestyle</h4>
                <ul className="list-disc list-inside text-sm text-gray-600">
                  {data.city_health_data.risk_factors.lifestyle.map(factor => (
                    <li key={factor}>{factor}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Healthcare Notes</h3>
            <p className="text-sm text-gray-600">{data.city_health_data.metadata.notes}</p>
            <div className="mt-4">
              <span className="text-xs text-gray-500">
                Data Source: {data.city_health_data.metadata.data_source}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PandemicDashboard;