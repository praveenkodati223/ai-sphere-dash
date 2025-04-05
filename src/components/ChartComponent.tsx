
import React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  ScatterChart,
  Scatter,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend
} from 'recharts';
import { useVisualization } from '@/contexts/VisualizationContext';

// Sample data for scatter and radar charts
const scatterData = [
  { x: 100, y: 200, z: 200 },
  { x: 120, y: 100, z: 260 },
  { x: 170, y: 300, z: 400 },
  { x: 140, y: 250, z: 280 },
  { x: 150, y: 400, z: 500 },
  { x: 110, y: 280, z: 200 },
];

const radarData = [
  {
    subject: 'Sales',
    A: 120,
    B: 110,
    fullMark: 150,
  },
  {
    subject: 'Marketing',
    A: 98,
    B: 130,
    fullMark: 150,
  },
  {
    subject: 'Development',
    A: 86,
    B: 130,
    fullMark: 150,
  },
  {
    subject: 'Support',
    A: 99,
    B: 100,
    fullMark: 150,
  },
  {
    subject: 'HR',
    A: 85,
    B: 90,
    fullMark: 150,
  },
  {
    subject: 'Admin',
    A: 65,
    B: 85,
    fullMark: 150,
  },
];

const COLORS = ['#8b5cf6', '#06b6d4', '#D946EF', '#3730a3', '#0ea5e9', '#f43f5e'];

interface ChartComponentProps {
  type: string;
}

const ChartComponent: React.FC<ChartComponentProps> = ({ type }) => {
  const { activeDataset } = useVisualization();
  
  // Transform data for charts
  const chartData = React.useMemo(() => {
    if (!activeDataset) {
      return [
        { name: 'Jan', value: 400, category: 'Electronics' },
        { name: 'Feb', value: 300, category: 'Clothing' },
        { name: 'Mar', value: 600, category: 'Food' },
        { name: 'Apr', value: 800, category: 'Home' },
        { name: 'May', value: 500, category: 'Electronics' },
        { name: 'Jun', value: 900, category: 'Clothing' },
      ];
    }
    
    return activeDataset.data.map(item => ({
      name: item.category,
      value: item.q1 + item.q2 + item.q3 + item.q4,
      q1: item.q1,
      q2: item.q2,
      q3: item.q3,
      q4: item.q4,
      category: item.category
    }));
  }, [activeDataset]);
  
  switch(type) {
    case 'bar':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(6, 182, 212, 0.2)' }}
              itemStyle={{ color: '#f8fafc' }}
            />
            <Legend />
            <Bar dataKey="value" name="Sales" fill="#8b5cf6">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      );
    
    case 'line':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(6, 182, 212, 0.2)' }}
              itemStyle={{ color: '#f8fafc' }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="value" 
              name="Trend" 
              stroke="#06b6d4" 
              strokeWidth={2}
              dot={{ stroke: '#8b5cf6', strokeWidth: 2, r: 4, fill: '#0f172a' }}
              activeDot={{ r: 6, stroke: '#D946EF', strokeWidth: 2, fill: '#0f172a' }}
            />
          </LineChart>
        </ResponsiveContainer>
      );
    
    case 'pie':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              innerRadius={40}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(6, 182, 212, 0.2)' }}
              itemStyle={{ color: '#f8fafc' }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      );
    
    case 'area':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(6, 182, 212, 0.2)' }}
              itemStyle={{ color: '#f8fafc' }}
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="value" 
              name="Volume" 
              stroke="#8b5cf6" 
              fill="url(#colorGradient)"
              strokeWidth={2}
            />
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.2}/>
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      );
    
    case 'scatter':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="x" name="Sales" stroke="#94a3b8" />
            <YAxis dataKey="y" name="Profit" stroke="#94a3b8" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(6, 182, 212, 0.2)' }}
              itemStyle={{ color: '#f8fafc' }}
              cursor={{ strokeDasharray: '3 3' }}
            />
            <Legend />
            <Scatter name="Products" data={scatterData} fill="#8b5cf6">
              {scatterData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      );
    
    case 'radar':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
            <PolarGrid stroke="rgba(255,255,255,0.2)" />
            <PolarAngleAxis dataKey="subject" stroke="#94a3b8" />
            <PolarRadiusAxis stroke="#94a3b8" />
            <Radar 
              name="Team A" 
              dataKey="A" 
              stroke="#8b5cf6" 
              fill="#8b5cf6" 
              fillOpacity={0.6} 
            />
            <Radar 
              name="Team B" 
              dataKey="B" 
              stroke="#06b6d4" 
              fill="#06b6d4" 
              fillOpacity={0.6} 
            />
            <Legend />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(6, 182, 212, 0.2)' }}
              itemStyle={{ color: '#f8fafc' }}
            />
          </RadarChart>
        </ResponsiveContainer>
      );
    
    default:
      return (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          Select a chart type to visualize data
        </div>
      );
  }
};

export default ChartComponent;
