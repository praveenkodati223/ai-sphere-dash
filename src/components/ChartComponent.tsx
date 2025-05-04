
import React from 'react';
import { useVisualization } from '@/contexts/VisualizationContext';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, ScatterChart, Scatter, 
  AreaChart, Area, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { CHART_COLORS } from '@/services/dataService';
import { ChartContainer, ChartTooltipContent } from './ui/chart';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 px-3 py-2 rounded text-sm">
        <p className="text-white">{`${label}: ${payload[0].value !== undefined ? payload[0].value.toLocaleString() : 'N/A'}`}</p>
      </div>
    );
  }
  return null;
};

interface ChartComponentProps {
  type: string; 
}

const ChartComponent: React.FC<ChartComponentProps> = ({ type }) => {
  const { 
    activeDataset,
    analyzedData, 
    isAnalyzing,
    customChartConfig 
  } = useVisualization();
  
  if (!activeDataset || !activeDataset.data || activeDataset.data.length === 0) {
    return <div>No data available</div>;
  }
  
  if (isAnalyzing) {
    return <div className="text-center">Analyzing data...</div>;
  }

  // Use customChartConfig if available
  if (customChartConfig && activeDataset) {
    // Get appropriate chart based on customChartConfig.chartType
    switch (customChartConfig.chartType.toLowerCase()) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={activeDataset.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis 
                dataKey={customChartConfig.xAxis.dataKey} 
                label={{ value: customChartConfig.xAxis.label, position: 'insideBottom', offset: -5 }} 
              />
              <YAxis 
                label={customChartConfig.yAxis ? { 
                  value: customChartConfig.yAxis.label, 
                  angle: -90, 
                  position: 'insideLeft' 
                } : undefined} 
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {customChartConfig.series.map((series, index) => (
                <Line
                  key={index}
                  type="monotone"
                  dataKey={series.dataKey}
                  name={series.name}
                  stroke={series.color || CHART_COLORS[index % CHART_COLORS.length]}
                  activeDot={{ r: 8 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activeDataset.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis 
                dataKey={customChartConfig.xAxis.dataKey} 
                label={{ value: customChartConfig.xAxis.label, position: 'insideBottom', offset: -5 }} 
              />
              <YAxis 
                label={customChartConfig.yAxis ? { 
                  value: customChartConfig.yAxis.label, 
                  angle: -90, 
                  position: 'insideLeft' 
                } : undefined} 
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {customChartConfig.series.map((series, index) => (
                <Bar
                  key={index}
                  dataKey={series.dataKey}
                  name={series.name}
                  fill={series.color || CHART_COLORS[index % CHART_COLORS.length]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
        
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={activeDataset.data}
                dataKey={customChartConfig.series[0].dataKey}
                nameKey={customChartConfig.xAxis.dataKey}
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(entry) => entry.name || ''}
              >
                {activeDataset.data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={CHART_COLORS[index % CHART_COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
        
      case 'area':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activeDataset.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis 
                dataKey={customChartConfig.xAxis.dataKey} 
                label={{ value: customChartConfig.xAxis.label, position: 'insideBottom', offset: -5 }} 
              />
              <YAxis 
                label={customChartConfig.yAxis ? { 
                  value: customChartConfig.yAxis.label, 
                  angle: -90, 
                  position: 'insideLeft' 
                } : undefined} 
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {customChartConfig.series.map((series, index) => (
                <Area
                  key={index}
                  type="monotone"
                  dataKey={series.dataKey}
                  name={series.name}
                  stroke={series.color || CHART_COLORS[index % CHART_COLORS.length]}
                  fill={series.color || CHART_COLORS[index % CHART_COLORS.length]}
                  fillOpacity={0.3}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );
      
      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis 
                dataKey={customChartConfig.xAxis.dataKey} 
                name={customChartConfig.xAxis.label} 
                label={{ value: customChartConfig.xAxis.label, position: 'insideBottom', offset: -5 }} 
              />
              <YAxis 
                dataKey={customChartConfig.yAxis?.dataKey} 
                name={customChartConfig.yAxis?.label} 
                label={{ value: customChartConfig.yAxis?.label, angle: -90, position: 'insideLeft' }} 
              />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Legend />
              {customChartConfig.series.map((series, index) => (
                <Scatter
                  key={index}
                  name={series.name}
                  data={activeDataset.data}
                  fill={series.color || CHART_COLORS[index % CHART_COLORS.length]}
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        );
        
      default:
        // Fallback to standard chart
        break;
    }
  }
  
  // Default chart rendering based on type
  switch (type) {
    case 'line':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={activeDataset.data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="q1" 
              name="Q1"
              stroke={CHART_COLORS[0]} 
              activeDot={{ r: 8 }} 
              connectNulls
            />
            <Line 
              type="monotone" 
              dataKey="q2" 
              name="Q2"
              stroke={CHART_COLORS[1]} 
              activeDot={{ r: 8 }} 
              connectNulls
            />
            <Line 
              type="monotone" 
              dataKey="q3" 
              name="Q3"
              stroke={CHART_COLORS[2]} 
              activeDot={{ r: 8 }} 
              connectNulls
            />
            <Line 
              type="monotone" 
              dataKey="q4" 
              name="Q4"
              stroke={CHART_COLORS[3]} 
              activeDot={{ r: 8 }} 
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      );
      
    case 'bar':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={activeDataset.data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="q1" name="Q1" fill={CHART_COLORS[0]} />
            <Bar dataKey="q2" name="Q2" fill={CHART_COLORS[1]} />
            <Bar dataKey="q3" name="Q3" fill={CHART_COLORS[2]} />
            <Bar dataKey="q4" name="Q4" fill={CHART_COLORS[3]} />
          </BarChart>
        </ResponsiveContainer>
      );
      
    case 'pie':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={activeDataset.data}
              dataKey="q1"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={(entry) => entry.name || ''}
            >
              {activeDataset.data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      );
      
    case 'scatter':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="q1" name="Quarter 1" />
            <YAxis dataKey="q2" name="Quarter 2" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Legend />
            <Scatter name="Q1 vs Q2" data={activeDataset.data} fill="#8884d8" />
          </ScatterChart>
        </ResponsiveContainer>
      );
      
    case 'area':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={activeDataset.data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="q1" 
              name="Q1"
              stroke={CHART_COLORS[0]} 
              fill={CHART_COLORS[0]} 
              fillOpacity={0.3} 
              connectNulls
            />
            <Area 
              type="monotone" 
              dataKey="q2" 
              name="Q2"
              stroke={CHART_COLORS[1]} 
              fill={CHART_COLORS[1]} 
              fillOpacity={0.3} 
              connectNulls
            />
            <Area 
              type="monotone" 
              dataKey="q3" 
              name="Q3"
              stroke={CHART_COLORS[2]} 
              fill={CHART_COLORS[2]} 
              fillOpacity={0.3} 
              connectNulls
            />
            <Area 
              type="monotone" 
              dataKey="q4" 
              name="Q4"
              stroke={CHART_COLORS[3]} 
              fill={CHART_COLORS[3]} 
              fillOpacity={0.3} 
              connectNulls
            />
          </AreaChart>
        </ResponsiveContainer>
      );

    case 'radar':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={activeDataset.data}>
            <PolarGrid stroke="#444" />
            <PolarAngleAxis dataKey="category" stroke="#fff" />
            <PolarRadiusAxis stroke="#fff" />
            <Radar name="Q1" dataKey="q1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            <Legend stroke="#fff" />
          </RadarChart>
        </ResponsiveContainer>
      );
      
    default:
      return <div>Unsupported chart type: {type}</div>;
  }
};

export default ChartComponent;
