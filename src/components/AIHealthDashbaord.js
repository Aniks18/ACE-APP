import React, { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line,
  AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { 
  AlertCircle, Activity, Users, Hospital, Thermometer, TrendingUp, Shield,
  Heart, Syringe, UserCheck, AlertTriangle, Globe, Clock, Stethoscope, 
  Calendar, Brain
} from 'lucide-react';

const COLORS = ['#ff7c43', '#00b4d8', '#023e8a', '#0077b6', '#48cae4', '#90e0ef'];

const AIHealthDashboard = ({ healthCardData }) => {
  const [timeRange, setTimeRange] = useState('7days');

  const statsData = useMemo(() => {
    // Enhanced stats calculation using metadata
    return {
      totalPatients: healthCardData.metadata.totalCitizens,
      highRiskCount: calculateHighRiskPatients(healthCardData.citizens),
      recentVisits: healthCardData.metadata.hospitalVisitFrequency,
      conditions: healthCardData.metadata.commonConditions,
      vaccinations: healthCardData.metadata.vaccinationStats,
      demographics: {
        age: healthCardData.metadata.ageDistribution,
        gender: healthCardData.metadata.genderDistribution,
        bloodGroups: healthCardData.metadata.bloodGroupDistribution
      },
      visitPatterns: {
        weekly: healthCardData.metadata.hospitalVisitFrequency.weekly,
        monthly: healthCardData.metadata.hospitalVisitFrequency.monthly,
        quarterly: healthCardData.metadata.hospitalVisitFrequency.quarterly,
        annual: healthCardData.metadata.hospitalVisitFrequency.annually
      },
      epidemicIndicators: calculateEpidemicIndicators(healthCardData)
    };
  }, [healthCardData]);

  // Enhanced stat card component with subtitle and trend
  const StatCard = ({ icon: Icon, title, value, subtitle, trend, color }) => (
    <div className="bg-white rounded-lg p-6 shadow-lg border-l-4 hover:shadow-xl transition-all" style={{ borderLeftColor: color }}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-600 text-sm mb-1">{title}</p>
          <h3 className="text-2xl font-bold" style={{ color }}>{value}</h3>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className="bg-opacity-20 p-3 rounded-full" style={{ backgroundColor: `${color}20` }}>
          <Icon size={24} color={color} />
        </div>
      </div>
      {trend && (
        <div className="mt-2 flex items-center text-sm">
          <TrendingUp size={16} className={trend > 0 ? "text-green-500" : "text-red-500"} />
          <span className={`ml-1 ${trend > 0 ? "text-green-500" : "text-red-500"}`}>
            {Math.abs(trend)}% vs last week
          </span>
        </div>
      )}
    </div>
  );

  // Create data for epidemic monitoring chart
  const epidemicData = healthCardData.metadata.commonConditions.map(condition => ({
    name: condition.name,
    cases: condition.count,
    trend: Math.floor(Math.random() * 20) - 10 // Simulated trend data
  }));

  // Calculate vaccination progress
  const vaccinationProgress = [
    { name: 'COVID First Dose', value: statsData.vaccinations.covidFirstDose },
    { name: 'COVID Second Dose', value: statsData.vaccinations.covidSecondDose },
    { name: 'COVID Booster', value: statsData.vaccinations.covidBooster },
    { name: 'Flu Shot', value: statsData.vaccinations.fluShot }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Regional Health Analytics</h1>
            <p className="text-gray-600 mt-2">Prayagraj Region Health Monitoring System</p>
          </div>
          <div className="flex gap-4">
            {['7days', '30days', '90days'].map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg ${
                  timeRange === range 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {range === '7days' ? 'Week' : range === '30days' ? 'Month' : 'Quarter'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Users}
          title="Monitored Population"
          value={statsData.totalPatients}
          subtitle="Active health cards"
          color="#0ea5e9"
        />
        <StatCard
          icon={AlertCircle}
          title="High Risk Cases"
          value={statsData.highRiskCount}
          subtitle="Immediate attention needed"
          trend={12}
          color="#dc2626"
        />
        <StatCard
          icon={Hospital}
          title="Weekly Hospital Visits"
          value={statsData.recentVisits.weekly}
          subtitle="Last 7 days"
          trend={-5}
          color="#8b5cf6"
        />
        <StatCard
          icon={Syringe}
          title="Vaccination Coverage"
          value={`${statsData.vaccinations.covidSecondDose}%`}
          subtitle="Fully vaccinated"
          color="#059669"
        />
      </div>

      {/* Secondary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={Heart}
          title="Most Common Condition"
          value={statsData.conditions[0].name}
          subtitle={`${statsData.conditions[0].count} active cases`}
          color="#f97316"
        />
        <StatCard
          icon={Clock}
          title="Average Response Time"
          value="2.4 hrs"
          subtitle="Emergency response"
          color="#0891b2"
        />
        <StatCard
          icon={Brain}
          title="AI Risk Predictions"
          value={`${Math.floor(statsData.highRiskCount / statsData.totalPatients * 100)}%`}
          subtitle="Potential risk cases"
          color="#6366f1"
        />
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Disease Prevalence */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <Stethoscope className="mr-2" size={20} />
            Disease Prevalence
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statsData.conditions}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Vaccination Progress */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <Shield className="mr-2" size={20} />
            Vaccination Progress
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={vaccinationProgress}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#059669" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Age Demographics */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <Users className="mr-2" size={20} />
            Age Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={Object.entries(statsData.demographics.age).map(([k, v]) => ({
                  name: k,
                  value: v
                }))}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {Object.entries(statsData.demographics.age).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Factors */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <AlertTriangle className="mr-2" size={20} />
            Risk Factor Analysis
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
              { subject: 'Elderly Population', A: statsData.demographics.age['70+'], fullMark: 100 },
              { subject: 'Chronic Conditions', A: statsData.conditions[0].count, fullMark: 100 },
              { subject: 'Weekly Visits', A: statsData.visitPatterns.weekly, fullMark: 100 },
              { subject: 'Emergency Cases', A: statsData.highRiskCount, fullMark: 100 },
              { subject: 'Unvaccinated', A: 100 - statsData.vaccinations.covidSecondDose, fullMark: 100 }
            ]}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis />
              <Radar name="Risk Factors" dataKey="A" stroke="#dc2626" fill="#dc2626" fillOpacity={0.4} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Insights Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Brain className="mr-2" size={20} />
          AI-Powered Health Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {generateHealthInsights(statsData).map((insight, index) => (
            <div key={index} className={`p-4 rounded-lg flex items-start space-x-3 ${insight.bgColor}`}>
              <insight.icon size={20} className={insight.iconColor} />
              <div>
                <h3 className={`font-semibold ${insight.textColor}`}>{insight.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{insight.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper functions
const calculateHighRiskPatients = (citizens) => {
  return citizens.reduce((count, citizen) => {
    const riskScore = calculateRiskScore(citizen);
    return count + (riskScore > 7 ? 1 : 0);
  }, 0);
};

const calculateEpidemicIndicators = (data) => {
  return {
    riskLevel: 'Moderate',
    trendDirection: 'Stable',
    hotspots: ['Civil Lines', 'Georgetown'],
    recommendedActions: [
      'Increase monitoring in high-risk areas',
      'Boost vaccination coverage',
      'Enhance community awareness'
    ]
  };
};

const calculateRiskScore = (citizen) => {
  let score = 0;
  
  if (citizen.age > 60) score += 3;
  if (citizen.medicalHistory?.length > 0) score += citizen.medicalHistory.length;
  if (citizen.recentVisits?.[0]?.reason?.toLowerCase().includes('fever')) score += 2;
  
  const chronicConditions = ['diabetes', 'hypertension', 'heart disease'];
  if (citizen.medicalHistory?.some(h => 
    chronicConditions.includes(h.condition.toLowerCase()))) score += 2;
  
  return score;
};

const generateHealthInsights = (stats) => [
  {
    icon: AlertCircle,
    title: 'High Risk Population',
    description: `${stats.highRiskCount} citizens require immediate attention`,
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    iconColor: 'text-red-600'
  },
  {
    icon: Activity,
    title: 'Disease Patterns',
    description: `${stats.conditions[0].name} shows highest prevalence`,
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    iconColor: 'text-blue-600'
  },
  {
    icon: Shield,
    title: 'Vaccination Status',
    description: `${stats.vaccinations.covidSecondDose}% fully vaccinated`,
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    iconColor: 'text-green-600'
  }
];

export default AIHealthDashboard;