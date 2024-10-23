import React, { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area,
  AreaChart, RadialBarChart, RadialBar
} from 'recharts';
import { ChevronDownIcon, Phone, Mail, Clock, MapPin, Package, Users } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const MedicalShopDashboard = ({ data = { medical_shops: [] } }) => {
  const [selectedShop, setSelectedShop] = useState(data.medical_shops[0]?.id || '');
  const [selectedView, setSelectedView] = useState('inventory');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Get all unique categories from inventory across all shops
  const categories = useMemo(() => {
    const categorySet = new Set();
    categorySet.add('All');
    data.medical_shops.forEach(shop => {
      shop.inventory?.forEach(item => {
        categorySet.add(item.category);
      });
    });
    return Array.from(categorySet);
  }, [data]);

  // Get current shop data
  const currentShop = useMemo(() => {
    return data.medical_shops.find(shop => shop.id === selectedShop) || data.medical_shops[0];
  }, [data, selectedShop]);

  // Process inventory data for charts
  const inventoryData = useMemo(() => {
    if (!currentShop?.inventory) return [];
    return currentShop.inventory
      .filter(item => selectedCategory === 'All' || item.category === selectedCategory)
      .map(item => ({
        name: item.medicine_name,
        stock: item.current_stock,
        sold: item.total_sold_last_month,
        revenue: item.unit_price * item.total_sold_last_month,
        reorderLevel: item.reorder_level
      }));
  }, [currentShop, selectedCategory]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    if (!currentShop) return {};
    
    const totalInventory = currentShop.inventory?.reduce((sum, item) => sum + item.current_stock, 0) || 0;
    const totalSold = currentShop.inventory?.reduce((sum, item) => sum + item.total_sold_last_month, 0) || 0;
    const totalRevenue = currentShop.sales_summary?.monthly_revenue || 0;
    
    return {
      totalInventory,
      totalSold,
      totalRevenue,
      averageDaily: currentShop.sales_summary?.average_daily_customers || 0
    };
  }, [currentShop]);

  // Category distribution data
  const categoryData = useMemo(() => {
    if (!currentShop?.inventory) return [];
    const distribution = {};
    currentShop.inventory.forEach(item => {
      distribution[item.category] = (distribution[item.category] || 0) + item.current_stock;
    });
    return Object.entries(distribution).map(([name, value]) => ({ name, value }));
  }, [currentShop]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Medical Shop Analytics Dashboard</h2>
        
        {/* Shop Selection and Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Medical Shop</label>
            <div className="relative">
              <select
                value={selectedShop}
                onChange={(e) => setSelectedShop(Number(e.target.value))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {data.medical_shops.map(shop => (
                  <option key={shop.id} value={shop.id}>{shop.name}</option>
                ))}
              </select>
              <ChevronDownIcon className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">View</label>
            <div className="relative">
              <select
                value={selectedView}
                onChange={(e) => setSelectedView(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="inventory">Inventory Analysis</option>
                <option value="sales">Sales Analysis</option>
                <option value="performance">Performance Metrics</option>
              </select>
              <ChevronDownIcon className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Category Filter</label>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <ChevronDownIcon className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Shop Information Card */}
        {currentShop && (
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                <div className="text-sm">
                  <p className="font-semibold">Address</p>
                  <p className="text-gray-600">{currentShop.address}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-blue-600" />
                <div className="text-sm">
                  <p className="font-semibold">Contact</p>
                  <p className="text-gray-600">{currentShop.contact.phone}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <div className="text-sm">
                  <p className="font-semibold">Hours</p>
                  <p className="text-gray-600">{currentShop.operating_hours}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <div className="text-sm">
                  <p className="font-semibold">Staff Count</p>
                  <p className="text-gray-600">{currentShop.staff_count} members</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800">Total Inventory</h3>
            <p className="text-3xl font-bold text-green-600">{summaryStats.totalInventory}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800">Items Sold</h3>
            <p className="text-3xl font-bold text-blue-600">{summaryStats.totalSold}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-800">Monthly Revenue</h3>
            <p className="text-3xl font-bold text-purple-600">₹{summaryStats.totalRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-orange-800">Daily Customers</h3>
            <p className="text-3xl font-bold text-orange-600">{summaryStats.averageDaily}</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Inventory/Sales Chart */}
        <div className="bg-white p-4 rounded-lg shadow h-[400px]">
          <h3 className="text-lg font-semibold mb-4">
            {selectedView === 'inventory' ? 'Inventory Levels' : 'Sales Analysis'}
          </h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={inventoryData}
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
                dataKey={selectedView === 'inventory' ? 'stock' : 'sold'}
                fill="#8884d8"
                name={selectedView === 'inventory' ? 'Current Stock' : 'Units Sold'}
              />
              <Bar
                dataKey="reorderLevel"
                fill="#82ca9d"
                name="Reorder Level"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-white p-4 rounded-lg shadow h-[400px]">
          <h3 className="text-lg font-semibold mb-4">Category Distribution</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={130}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Trend */}
        <div className="bg-white p-4 rounded-lg shadow h-[400px]">
          <h3 className="text-lg font-semibold mb-4">Revenue by Product</h3>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={inventoryData}
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
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#8884d8"
                fill="#8884d8"
                name="Revenue (₹)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Stock vs Reorder Level */}
        <div className="bg-white p-4 rounded-lg shadow h-[400px]">
          <h3 className="text-lg font-semibold mb-4">Stock vs Reorder Level</h3>
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              data={inventoryData}
              cx="50%"
              cy="50%"
              innerRadius="10%"
              outerRadius="80%"
              barSize={10}
            >
              <RadialBar
                minAngle={15}
                label={{ position: 'insideStart', fill: '#fff' }}
                background
                dataKey="stock"
                name="Current Stock"
              />
              <Tooltip />
              <Legend />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default MedicalShopDashboard;