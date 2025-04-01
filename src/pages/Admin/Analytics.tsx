
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { 
  ClockIcon, 
  TrendingUp, 
  MapPin, 
  Activity,
  Calendar,
  CalendarDays 
} from 'lucide-react';

// Mock data for response time chart
const responseTimeData = [
  { name: 'Jan', police: 8.2, ambulance: 12.4, target: 10 },
  { name: 'Feb', police: 7.5, ambulance: 11.8, target: 10 },
  { name: 'Mar', police: 8.1, ambulance: 10.9, target: 10 },
  { name: 'Apr', police: 7.8, ambulance: 10.2, target: 10 },
  { name: 'May', police: 6.9, ambulance: 9.8, target: 10 },
  { name: 'Jun', police: 6.5, ambulance: 9.1, target: 10 },
  { name: 'Jul', police: 6.8, ambulance: 9.5, target: 10 },
  { name: 'Aug', police: 7.2, ambulance: 10.1, target: 10 },
  { name: 'Sep', police: 7.9, ambulance: 10.8, target: 10 },
  { name: 'Oct', police: 8.5, ambulance: 11.2, target: 10 },
  { name: 'Nov', police: 9.1, ambulance: 12.3, target: 10 },
  { name: 'Dec', police: 9.8, ambulance: 13.1, target: 10 },
];

// Mock data for incident types pie chart
const incidentTypesData = [
  { name: 'Vehicle Collision', value: 45 },
  { name: 'Pedestrian Accident', value: 15 },
  { name: 'Motorcycle Accident', value: 20 },
  { name: 'Bicycle Accident', value: 10 },
  { name: 'Other', value: 10 },
];

// Mock data for district statistics
const districtStatsData = [
  { name: 'Downtown', incidents: 78, responseTime: 6.2 },
  { name: 'North District', incidents: 52, responseTime: 8.7 },
  { name: 'East District', incidents: 43, responseTime: 9.3 },
  { name: 'South District', incidents: 65, responseTime: 7.8 },
  { name: 'West District', incidents: 39, responseTime: 10.2 },
];

// Mock data for severity distribution over time
const severityTimeData = [
  { month: 'Jan', Critical: 12, High: 24, Medium: 35, Low: 45 },
  { month: 'Feb', Critical: 15, High: 28, Medium: 32, Low: 41 },
  { month: 'Mar', Critical: 18, High: 31, Medium: 29, Low: 38 },
  { month: 'Apr', Critical: 14, High: 26, Medium: 37, Low: 43 },
  { month: 'May', Critical: 11, High: 22, Medium: 41, Low: 48 },
  { month: 'Jun', Critical: 13, High: 25, Medium: 38, Low: 44 },
];

// Colors for charts
const COLORS = {
  police: '#1EAEDB',
  ambulance: '#ea384c',
  target: '#888888',
  critical: '#FF3A41',
  high: '#FF8C42',
  medium: '#FFC857', 
  low: '#4F8FCA',
};

// Pie chart colors
const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Analytics = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">System Analytics</h1>
        <p className="text-gray-600">
          Performance metrics and statistics for emergency response system
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Avg. Response Time</p>
                <p className="text-3xl font-bold">8.2 min</p>
              </div>
              <div className="rounded-full p-2 bg-blue-100 text-blue-700">
                <ClockIcon className="h-5 w-5" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm text-gray-500">
              <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
              <span className="text-green-500 font-medium">12%</span>
              <span className="ml-1">improvement from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Total Incidents</p>
                <p className="text-3xl font-bold">842</p>
              </div>
              <div className="rounded-full p-2 bg-red-100 text-red-700">
                <Activity className="h-5 w-5" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm text-gray-500">
              <TrendingUp className="h-4 w-4 mr-1 text-red-500" />
              <span className="text-red-500 font-medium">8%</span>
              <span className="ml-1">increase from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Critical Incidents</p>
                <p className="text-3xl font-bold">127</p>
              </div>
              <div className="rounded-full p-2 bg-orange-100 text-orange-700">
                <Activity className="h-5 w-5" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm text-gray-500">
              <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
              <span className="text-green-500 font-medium">5%</span>
              <span className="ml-1">decrease from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Hotspot Districts</p>
                <p className="text-3xl font-bold">3</p>
              </div>
              <div className="rounded-full p-2 bg-purple-100 text-purple-700">
                <MapPin className="h-5 w-5" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm text-gray-500">
              <span className="text-gray-700 font-medium">Downtown, South, North</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Response Time Trends</CardTitle>
                <CardDescription>
                  Average emergency response times by month
                </CardDescription>
              </div>
              <Tabs 
                defaultValue="month" 
                value={timeRange}
                onValueChange={(value) => setTimeRange(value as 'week' | 'month' | 'year')}
              >
                <TabsList className="grid w-[250px] grid-cols-3">
                  <TabsTrigger value="week">
                    <Calendar className="h-4 w-4 mr-2" />
                    Week
                  </TabsTrigger>
                  <TabsTrigger value="month">
                    <Calendar className="h-4 w-4 mr-2" />
                    Month
                  </TabsTrigger>
                  <TabsTrigger value="year">
                    <CalendarDays className="h-4 w-4 mr-2" />
                    Year
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  name="Police"
                  dataKey="police"
                  stroke={COLORS.police}
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  name="Ambulance"
                  dataKey="ambulance"
                  stroke={COLORS.ambulance}
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  name="Target"
                  dataKey="target"
                  stroke={COLORS.target}
                  strokeDasharray="5 5"
                  strokeWidth={1}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Incident Types</CardTitle>
            <CardDescription>
              Distribution of incident types reported
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={incidentTypesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {incidentTypesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>District Statistics</CardTitle>
            <CardDescription>
              Incidents and response times by district
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={districtStatsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke={COLORS.ambulance} />
                <YAxis yAxisId="right" orientation="right" stroke={COLORS.police} />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="left"
                  name="Incidents"
                  dataKey="incidents"
                  fill={COLORS.ambulance}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  yAxisId="right"
                  name="Response Time (min)"
                  dataKey="responseTime"
                  fill={COLORS.police}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Incident Severity Distribution</CardTitle>
            <CardDescription>
              Monthly breakdown by severity levels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={severityTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Critical" stackId="a" fill={COLORS.critical} radius={[4, 4, 0, 0]} />
                <Bar dataKey="High" stackId="a" fill={COLORS.high} />
                <Bar dataKey="Medium" stackId="a" fill={COLORS.medium} />
                <Bar dataKey="Low" stackId="a" fill={COLORS.low} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
