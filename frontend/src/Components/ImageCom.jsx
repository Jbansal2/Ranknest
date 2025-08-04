import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import { Users, School, Clock, TrendingUp, Award } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';

const ImageCom = () => {
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState('area');

  const decryptData = (encryptedResponse) => {
    try {
      const { iv, encryptedData } = encryptedResponse;
      if (!iv || !encryptedData) {
        throw new Error('Invalid encrypted response format');
      }
      const key = CryptoJS.enc.Hex.parse(import.meta.env.VITE_ENCRYPTION_KEY);
      const ivParsed = CryptoJS.enc.Hex.parse(iv);
      const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: CryptoJS.enc.Hex.parse(encryptedData) },
        key,
        { iv: ivParsed }
      );
      const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
      if (!decryptedString) {
        throw new Error('Decrypted data is empty or invalid');
      }
      return JSON.parse(decryptedString);
    } catch (err) {
      console.error('Decryption Error:', err);
      throw new Error('Failed to decrypt response data');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const apiUrl = import.meta.env.VITE_API_URL;
      try {
        setLoading(true);
        const response = await fetch(`${apiUrl}/api/auth/students/stats`, {
          headers: {
            'x-api-key': import.meta.env.VITE_API_KEY, 
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (result.success) {
          const decryptedResponse = result.data.iv && result.data.encryptedData 
            ? decryptData(result.data) 
            : result.data;
          setApiData(decryptedResponse); 
        } else {
          throw new Error(result.message || 'Failed to fetch data');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const calculateFailedStudents = () => {
    if (!apiData) return 0;
    const totalStudents = apiData.total_students;
    return Math.floor(totalStudents * 0.15);
  };

  const statsData = apiData ? [
    {
      title: "Total Students",
      value: apiData.total_students.toLocaleString(),
      change: "8.5%",
      isPositive: true,
      icon: Users,
      description: "Active enrolled students"
    },
    {
      title: "Total Programmes",
      value: apiData.by_course.length.toString(),
      change: "1.3%",
      isPositive: true,
      icon: School,
      description: "Available study programs"
    },
    {
      title: "Average SGPA",
      value: apiData.average_sgpa.toFixed(3),
      change: "4.3%",
      isPositive: true,
      icon: Award,
      description: "Overall academic performance"
    },
    {
      title: "At-Risk Students",
      value: calculateFailedStudents().toLocaleString(),
      change: "1.8%",
      isPositive: false,
      icon: Clock,
      description: "Students needing support"
    }
  ] : [];

  const chartData = apiData ? apiData.by_course.map((course) => ({
    courseName: course.course_name.length > 10 ? course.course_name.substring(0, 10) + '...' : course.course_name,
    fullName: course.course_name,
    value: course.count,
    percentage: ((course.count / apiData.total_students) * 100).toFixed(1),
    count: course.count
  })) : [];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white text-black px-3 py-2 sm:px-5 sm:py-4 rounded-2xl shadow-2xl border border-gray-300 backdrop-blur-sm transform transition-all duration-200">
          <div className="font-bold text-black text-sm sm:text-base mb-2">{data.fullName}</div>
          <div className="space-y-1">
            <div className="flex justify-between items-center gap-4">
              <span className="text-xs sm:text-sm text-black">Students:</span>
              <span className="font-semibold text-black">{payload[0].value}</span>
            </div>
            <div className="flex justify-between items-center gap-4">
              <span className="text-xs sm:text-sm text-black">Percentage:</span>
              <span className="font-semibold text-black">{data.percentage}%</span>
            </div>
          </div>
          <div className="w-full h-1 bg-black mt-2 sm:mt-3 rounded-full"></div>
        </div>
      );
    }
    return null;
  };

  const maxValue = chartData.length > 0 ? Math.max(...chartData.map(d => d.value)) : 600;
  const roundedMax = Math.ceil(maxValue / 100) * 100;


  if (error) {
    return (
      <div className='bg-black min-h-screen flex items-center justify-center'>
        <div className="text-red-500 text-lg sm:text-xl">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className='bg-black min-h-screen p-2 sm:p-4 flex justify-center relative overflow-hidden'>
      <div className='bg-zinc-900 w-full max-w-6xl rounded-3xl shadow-lg p-3 sm:p-6 backdrop-blur-sm border border-zinc-800'>
        <div className="fixed inset-0 opacity-10">
          <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-48 sm:w-96 h-48 sm:h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-48 sm:w-96 h-48 sm:h-96 bg-black rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 sm:w-96 h-48 sm:h-96 bg-black rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className='relative z-10 flex flex-col gap-2 sm:gap-3 items-center justify-start mx-auto'>
        
          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
            {statsData.map((stat, index) => (
              <div
                key={index}
                className="group relative overflow-hidden bg-black backdrop-blur-sm rounded-2xl border border-zinc-800 p-4 sm:p-6 cursor-pointer "
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="p-2 sm:p-3 rounded bg-white shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                      <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
                    </div>
                    <div className={`flex items-center text-xs sm:text-sm font-semibold ${stat.isPositive ? 'text-white' : 'text-gray-400'}`}>
                      <TrendingUp className={`w-3 h-3 sm:w-4 sm:h-4 mr-1 ${stat.isPositive ? '' : 'rotate-180'}`} />
                      {stat.change}
                    </div>
                  </div>

                  <div className="mb-2 sm:mb-3">
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 text-left">{stat.value}</p>
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-300 text-left">{stat.title}</h3>
                  </div>

                  <p className="text-xs text-white text-left">{stat.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Chart Section */}
          <div className="w-full">
            <div className="bg-black backdrop-blur-sm rounded-3xl border border-zinc-800 p-4 sm:p-6 lg:p-8 shadow-2xl">
              {/* Chart Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 lg:mb-8 gap-4">
                <div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">Students by Programme</h2>
                  <p className="text-white text-xs sm:text-sm mt-1 text-left">Distribution across academic programs</p>
                </div>

                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="bg-black px-3 sm:px-4 py-1 sm:py-2 rounded-full border border-zinc-800">
                    <span className="text-white text-xs sm:text-sm font-medium">
                      Total: {chartData.reduce((sum, item) => sum + item.value, 0)} students
                    </span>
                  </div>

                  <div className="flex bg-black rounded-lg p-1 border border-zinc-800">
                    <button
                      onClick={() => setChartType('area')}
                      className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium transition-all ${chartType === 'area'
                        ? 'bg-white text-black shadow-lg'
                        : 'text-gray-400 hover:text-white'
                        }`}
                    >
                      Area
                    </button>
                    <button
                      onClick={() => setChartType('bar')}
                      className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium transition-all ${chartType === 'bar'
                        ? 'bg-white text-black shadow-lg'
                        : 'text-gray-400 hover:text-white'
                        }`}
                    >
                      Bar
                    </button>
                  </div>
                </div>
              </div>

              {/* Chart */}
              <div className="w-full h-[300px] sm:h-[400px] lg:h-[500px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'area' ? (
                    <AreaChart
                      data={chartData}
                      margin={{ top: 10, right: 10, left: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#FFFFFF" stopOpacity={0.8} />
                          <stop offset="50%" stopColor="#FFFFFF" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>

                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#374151"
                        opacity={0.3}
                        vertical={false}
                      />

                      <XAxis
                        dataKey="courseName"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fontSize: 10,
                          fill: '#D1D5DB',
                          fontWeight: 500
                        }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                        interval={0}
                      />

                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fontSize: 10,
                          fill: '#D1D5DB',
                          fontWeight: 500
                        }}
                        domain={[0, roundedMax]}
                      />

                      <Tooltip content={<CustomTooltip />} />

                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#FFFFFF"
                        strokeWidth={2}
                        fill="url(#colorGradient)"
                        animationDuration={1500}
                        animationEasing="ease-out"
                      />
                    </AreaChart>
                  ) : (
                    <BarChart
                      data={chartData}
                      margin={{ top: 10, right: 10, left: 0}}
                    >
                      <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#FFFFFF" />
                          <stop offset="50%" stopColor="#D1D5DB" />
                          <stop offset="100%" stopColor="#9CA3AF" />
                        </linearGradient>
                      </defs>

                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#374151"
                        opacity={0.3}
                        vertical={false}
                      />

                      <XAxis
                        dataKey="courseName"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fontSize: 10,
                          fill: '#D1D5DB',
                          fontWeight: 500
                        }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                        interval={0}
                      />

                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fontSize: 10,
                          fill: '#D1D5DB',
                          fontWeight: 500
                        }}
                        domain={[0, roundedMax]}
                      />

                      <Tooltip content={<CustomTooltip />} />

                      <Bar
                        dataKey="value"
                        fill="url(#barGradient)"
                        radius={[4, 4, 0, 0]}
                        animationDuration={1500}
                        animationEasing="ease-out"
                      />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCom;