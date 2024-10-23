import React, { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { ChevronDownIcon } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const HospitalStatistics = ({ hospitalData }) => {
  const [selectedCity, setSelectedCity] = useState('Prayagraj');
  const [selectedView, setSelectedView] = useState('beds');
  const [selectedSpeciality, setSelectedSpeciality] = useState('All');

  // Extract unique specialities from all hospitals
  const allSpecialities = useMemo(() => {
    const specialities = new Set();
    hospitalData.hospitals.forEach(hospital => {
      hospital.specialities.forEach(spec => specialities.add(spec));
    });
    return ['All', ...Array.from(specialities)];
  }, [hospitalData]);

  // Filter and prepare data based on selections
  const processedData = useMemo(() => {
    let filtered = hospitalData.hospitals;

    if (selectedSpeciality !== 'All') {
      filtered = filtered.filter(hospital =>
        hospital.specialities.includes(selectedSpeciality)
      );
    }

    // Prepare data for different view types
    switch (selectedView) {
      case 'beds':
        return filtered.map(hospital => ({
          name: hospital.name.length > 20 ? hospital.name.substring(0, 20) + '...' : hospital.name,
          beds: hospital.totalBeds,
        }));
      case 'doctors':
        return filtered.map(hospital => ({
          name: hospital.name.length > 20 ? hospital.name.substring(0, 20) + '...' : hospital.name,
          doctors: hospital.doctors.length,
        }));
      case 'specialities':
        return filtered.map(hospital => ({
          name: hospital.name.length > 20 ? hospital.name.substring(0, 20) + '...' : hospital.name,
          specialities: hospital.specialities.length,
        }));
      default:
        return filtered;
    }
  }, [hospitalData, selectedSpeciality, selectedView]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => ({
    totalHospitals: processedData.length,
    totalBeds: processedData.reduce((sum, hospital) => sum + hospital.beds, 0),
    averageBeds: Math.round(processedData.reduce((sum, hospital) => sum + hospital.beds, 0) / processedData.length),
  }), [processedData]);

  // Prepare data for specialty distribution pie chart
  const specialtyDistribution = useMemo(() => {
    const distribution = {};
    hospitalData.hospitals.forEach(hospital => {
      hospital.specialities.forEach(specialty => {
        distribution[specialty] = (distribution[specialty] || 0) + 1;
      });
    });
    return Object.entries(distribution).map(([name, value]) => ({ name, value }));
  }, [hospitalData]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Hospital Statistics Dashboard</h2>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800">Total Hospitals</h3>
            <p className="text-3xl font-bold text-blue-600">{summaryStats.totalHospitals}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800">Total Beds</h3>
            <p className="text-3xl font-bold text-green-600">{summaryStats.totalBeds}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-800">Average Beds</h3>
            <p className="text-3xl font-bold text-purple-600">{summaryStats.averageBeds}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <div className="relative">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="Prayagraj">Prayagraj</option>
                {/* Add more cities as they become available */}
              </select>
              <ChevronDownIcon className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">View</label>
            <div className="relative">
              <select
                value={selectedView}
                onChange={(e) => setSelectedView(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="beds">Bed Capacity</option>
                <option value="doctors">Doctor Count</option>
                <option value="specialities">Specialities Count</option>
              </select>
              <ChevronDownIcon className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Speciality</label>
            <div className="relative">
              <select
                value={selectedSpeciality}
                onChange={(e) => setSelectedSpeciality(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {allSpecialities.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
              <ChevronDownIcon className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar Chart */}
        <div className="bg-white p-4 rounded-lg shadow h-[400px]">
          <h3 className="text-lg font-semibold mb-4">Hospital Distribution</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={processedData}
              margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={100}
                interval={0}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey={selectedView}
                fill="#8884d8"
                name={selectedView.charAt(0).toUpperCase() + selectedView.slice(1)}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart for Specialties */}
        <div className="bg-white p-4 rounded-lg shadow h-[400px]">
          <h3 className="text-lg font-semibold mb-4">Specialty Distribution</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={specialtyDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={130}
                fill="#8884d8"
                dataKey="value"
              >
                {specialtyDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default HospitalStatistics;