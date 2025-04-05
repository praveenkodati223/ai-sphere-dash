
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
  Treemap,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
  FunnelChart,
  Funnel,
  ComposedChart,
  ReferenceLine,
  Brush
} from 'recharts';
import { useVisualization } from '@/contexts/VisualizationContext';
import { ChartContainer, ChartTooltipContent, ChartTooltip, ChartLegend } from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// Sample data for special charts
const scatterData = [
  { x: 100, y: 200, z: 200, name: 'Group A' },
  { x: 120, y: 100, z: 260, name: 'Group B' },
  { x: 170, y: 300, z: 400, name: 'Group C' },
  { x: 140, y: 250, z: 280, name: 'Group D' },
  { x: 150, y: 400, z: 500, name: 'Group E' },
  { x: 110, y: 280, z: 200, name: 'Group F' },
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

const COLORS = ['#8b5cf6', '#06b6d4', '#D946EF', '#3730a3', '#0ea5e9', '#f43f5e', '#10b981', '#f97316', '#14b8a6', '#8b5cf6', '#06b6d4'];

interface ChartComponentProps {
  type: string;
}

const ChartComponent: React.FC<ChartComponentProps> = ({ type }) => {
  const { activeDataset, analyzedData } = useVisualization();
  
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
      value: item.value || (item.q1 + item.q2 + item.q3 + item.q4),
      q1: item.q1,
      q2: item.q2,
      q3: item.q3,
      q4: item.q4,
      category: item.category,
      region: item.region || 'Unknown',
      subCategory: item.subCategory || 'Standard'
    }));
  }, [activeDataset]);

  // Special data formats for different chart types
  const treemapData = React.useMemo(() => {
    if (!activeDataset) return [];
    
    // Group by category and subCategory
    const result = [];
    activeDataset.data.forEach(item => {
      const existing = result.find(r => r.name === item.category);
      if (existing) {
        existing.children.push({
          name: item.subCategory || 'Standard',
          size: item.value || (item.q1 + item.q2 + item.q3 + item.q4),
        });
      } else {
        result.push({
          name: item.category,
          children: [{
            name: item.subCategory || 'Standard',
            size: item.value || (item.q1 + item.q2 + item.q3 + item.q4),
          }]
        });
      }
    });
    return result;
  }, [activeDataset]);

  const waterfallData = React.useMemo(() => {
    if (!activeDataset) return [];
    let balance = 0;
    return activeDataset.data.map((item, index) => {
      const value = item.value || (item.q1 + item.q2 + item.q3 + item.q4);
      const start = balance;
      balance += value;
      return {
        name: item.category,
        start,
        end: balance,
        value
      };
    });
  }, [activeDataset]);
  
  // Generate funnel data based on categories
  const funnelData = React.useMemo(() => {
    if (!activeDataset) return [];
    
    // Sort by value in descending order
    return [...chartData]
      .sort((a, b) => b.value - a.value)
      .map((item, index) => ({
        name: item.name,
        value: item.value,
        fill: COLORS[index % COLORS.length]
      }));
  }, [chartData]);

  // KPI calculation
  const kpiValue = React.useMemo(() => {
    if (!activeDataset || !analyzedData) return { value: 0, target: 0 };
    
    const total = analyzedData.metrics?.total || 0;
    const target = total * 1.1; // 10% higher as sample target
    
    return {
      value: total,
      target,
      percentage: Math.min((total / target) * 100, 100)
    };
  }, [activeDataset, analyzedData]);
  
  const renderTooltipContent = (props: any) => {
    const { active, payload } = props;
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="bg-slate-900 border border-sphere-cyan/20 p-2 rounded-md shadow-lg">
        <p className="font-medium">{payload[0].name}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`item-${index}`} style={{ color: entry.color }}>
            {entry.dataKey}: {entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  };

  switch(type) {
    case 'bar':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip 
              content={renderTooltipContent}
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

    case 'clusteredBar':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis type="number" stroke="#94a3b8" />
            <YAxis dataKey="name" type="category" stroke="#94a3b8" />
            <Tooltip content={renderTooltipContent} />
            <Legend />
            <Bar dataKey="q1" name="Q1" fill={COLORS[0]} />
            <Bar dataKey="q2" name="Q2" fill={COLORS[1]} />
            <Bar dataKey="q3" name="Q3" fill={COLORS[2]} />
            <Bar dataKey="q4" name="Q4" fill={COLORS[3]} />
          </BarChart>
        </ResponsiveContainer>
      );

    case 'stackedBar':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis type="number" stroke="#94a3b8" />
            <YAxis dataKey="name" type="category" stroke="#94a3b8" />
            <Tooltip content={renderTooltipContent} />
            <Legend />
            <Bar dataKey="q1" name="Q1" stackId="a" fill={COLORS[0]} />
            <Bar dataKey="q2" name="Q2" stackId="a" fill={COLORS[1]} />
            <Bar dataKey="q3" name="Q3" stackId="a" fill={COLORS[2]} />
            <Bar dataKey="q4" name="Q4" stackId="a" fill={COLORS[3]} />
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
            <Tooltip content={renderTooltipContent} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="value" 
              name="Total" 
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
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={renderTooltipContent} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      );

    case 'donut':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={renderTooltipContent} />
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
            <Tooltip content={renderTooltipContent} />
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

    case 'stackedArea':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip content={renderTooltipContent} />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="q1" 
              name="Q1" 
              stackId="1"
              stroke={COLORS[0]} 
              fill={COLORS[0]}
            />
            <Area 
              type="monotone" 
              dataKey="q2" 
              name="Q2" 
              stackId="1"
              stroke={COLORS[1]} 
              fill={COLORS[1]}
            />
            <Area 
              type="monotone" 
              dataKey="q3" 
              name="Q3" 
              stackId="1"
              stroke={COLORS[2]} 
              fill={COLORS[2]}
            />
            <Area 
              type="monotone" 
              dataKey="q4" 
              name="Q4" 
              stackId="1"
              stroke={COLORS[3]} 
              fill={COLORS[3]}
            />
          </AreaChart>
        </ResponsiveContainer>
      );
    
    case 'scatter':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="q1" name="Q1" stroke="#94a3b8" />
            <YAxis dataKey="q2" name="Q2" stroke="#94a3b8" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} content={renderTooltipContent} />
            <Legend />
            <Scatter name="Categories" data={chartData} fill="#8b5cf6">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      );

    case 'bubble':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="q1" name="Q1" stroke="#94a3b8" />
            <YAxis dataKey="q3" name="Q3" stroke="#94a3b8" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} content={renderTooltipContent} />
            <Legend />
            <Scatter 
              name="Categories" 
              data={chartData} 
              fill="#8b5cf6"
              shape="circle"
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      );
    
    case 'radar':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
            <PolarGrid stroke="rgba(255,255,255,0.2)" />
            <PolarAngleAxis dataKey="name" stroke="#94a3b8" />
            <PolarRadiusAxis stroke="#94a3b8" />
            <Radar 
              name="Q1" 
              dataKey="q1" 
              stroke={COLORS[0]} 
              fill={COLORS[0]} 
              fillOpacity={0.6} 
            />
            <Radar 
              name="Q2" 
              dataKey="q2" 
              stroke={COLORS[1]} 
              fill={COLORS[1]} 
              fillOpacity={0.6} 
            />
            <Legend />
            <Tooltip content={renderTooltipContent} />
          </RadarChart>
        </ResponsiveContainer>
      );

    case 'treemap':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={treemapData}
            dataKey="size"
            ratio={4/3}
            stroke="#fff"
            fill="#8884d8"
            content={({ root, depth, x, y, width, height, index, payload, colors, rank, name }) => {
              return (
                <g>
                  <rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    style={{
                      fill: COLORS[index % COLORS.length],
                      stroke: '#fff',
                      strokeWidth: 2 / (depth + 1e-10),
                      strokeOpacity: 1 / (depth + 1e-10),
                    }}
                  />
                  {depth === 1 ? (
                    <text
                      x={x + width / 2}
                      y={y + height / 2 + 7}
                      textAnchor="middle"
                      fill="#fff"
                      fontSize={14}
                    >
                      {name}
                    </text>
                  ) : null}
                  {depth === 1 ? (
                    <text
                      x={x + 4}
                      y={y + 18}
                      fill="#fff"
                      fontSize={16}
                      fillOpacity={0.9}
                    >
                      {index + 1}
                    </text>
                  ) : null}
                </g>
              );
            }}
          />
        </ResponsiveContainer>
      );

    case 'funnel':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <FunnelChart>
            <Tooltip content={renderTooltipContent} />
            <Funnel
              dataKey="value"
              data={funnelData}
              isAnimationActive
            >
              <Legend />
              {funnelData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
      );

    case 'gauge':
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="text-3xl font-bold mb-2">
            {kpiValue.percentage.toFixed(0)}%
          </div>
          <div className="w-full max-w-md">
            <Progress value={kpiValue.percentage} className="h-6" />
          </div>
          <div className="mt-4 text-center">
            <div className="text-sm text-slate-400">Current: {kpiValue.value.toLocaleString()}</div>
            <div className="text-sm text-slate-400">Target: {kpiValue.target.toLocaleString()}</div>
          </div>
        </div>
      );

    case 'kpi':
      return (
        <div className="grid grid-cols-2 gap-4 h-full">
          {analyzedData && (
            <>
              <Card className="bg-slate-800 border-sphere-cyan/20">
                <CardHeader>
                  <CardTitle>Total</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {analyzedData.metrics.total.toLocaleString()}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-800 border-sphere-cyan/20">
                <CardHeader>
                  <CardTitle>Average</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {analyzedData.metrics.average.toLocaleString()}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-800 border-sphere-cyan/20">
                <CardHeader>
                  <CardTitle>Maximum</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-500">
                    {analyzedData.metrics.max.toLocaleString()}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-800 border-sphere-cyan/20">
                <CardHeader>
                  <CardTitle>Minimum</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-500">
                    {analyzedData.metrics.min.toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      );

    case 'table':
      return (
        <div className="h-full overflow-auto">
          {activeDataset ? (
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-slate-800">
                <tr className="border-b border-white/10">
                  <th className="text-left p-2">Category</th>
                  <th className="text-left p-2">Q1</th>
                  <th className="text-left p-2">Q2</th>
                  <th className="text-left p-2">Q3</th>
                  <th className="text-left p-2">Q4</th>
                  <th className="text-left p-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {activeDataset.data.map((item, idx) => (
                  <tr key={idx} className="border-b border-white/5">
                    <td className="p-2 font-medium">{item.category}</td>
                    <td className="p-2">{item.q1.toLocaleString()}</td>
                    <td className="p-2">{item.q2.toLocaleString()}</td>
                    <td className="p-2">{item.q3.toLocaleString()}</td>
                    <td className="p-2">{item.q4.toLocaleString()}</td>
                    <td className="p-2 font-bold">{(item.q1 + item.q2 + item.q3 + item.q4).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-800 sticky bottom-0">
                <tr className="border-t border-white/10">
                  <td className="p-2 font-bold">Total</td>
                  <td className="p-2 font-bold">
                    {activeDataset.data.reduce((sum, item) => sum + item.q1, 0).toLocaleString()}
                  </td>
                  <td className="p-2 font-bold">
                    {activeDataset.data.reduce((sum, item) => sum + item.q2, 0).toLocaleString()}
                  </td>
                  <td className="p-2 font-bold">
                    {activeDataset.data.reduce((sum, item) => sum + item.q3, 0).toLocaleString()}
                  </td>
                  <td className="p-2 font-bold">
                    {activeDataset.data.reduce((sum, item) => sum + item.q4, 0).toLocaleString()}
                  </td>
                  <td className="p-2 font-bold">
                    {activeDataset.data.reduce((sum, item) => sum + item.q1 + item.q2 + item.q3 + item.q4, 0).toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="text-slate-400">No data available</span>
            </div>
          )}
        </div>
      );

    case 'heatmap':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            <CartesianGrid stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" scale="band" />
            <YAxis />
            <Tooltip content={renderTooltipContent} />
            <Legend />
            {['q1', 'q2', 'q3', 'q4'].map((quarter, i) => (
              <Bar 
                key={quarter}
                dataKey={quarter} 
                barSize={20} 
                fill={COLORS[i]} 
                stackId="a"
              />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      );

    case 'waterfall':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={waterfallData}
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            <CartesianGrid stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={renderTooltipContent} />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
            {waterfallData.map((entry, index) => (
              <ReferenceLine
                key={`ref-${index}`}
                y={entry.start}
                stroke="rgba(255,255,255,0.5)"
                strokeDasharray="3 3"
              />
            ))}
          </ComposedChart>
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
