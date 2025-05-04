
import React from 'react';
import { useVisualization } from '@/contexts/VisualizationContext';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, ScatterChart, Scatter, 
  AreaChart, Area, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { CHART_COLORS } from '@/services/dataService';
import { ChartContainer, ChartTooltipContent } from './ui/chart';

// Helper function to safely format numbers
const safeFormatNumber = (value: any): string => {
  if (value === undefined || value === null || isNaN(Number(value))) {
    return '0';
  }
  return Number(value).toLocaleString();
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const value = payload[0].value !== undefined && payload[0].value !== null 
      ? safeFormatNumber(payload[0].value)
      : 'N/A';
      
    return (
      <div className="bg-slate-800 border border-slate-700 px-3 py-2 rounded text-sm">
        <p className="text-white">{`${label}: ${value}`}</p>
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
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-300">
        <div className="text-lg mb-2">No data available for visualization</div>
        <p className="text-sm text-slate-400">Please import data or select a dataset</p>
      </div>
    );
  }
  
  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sphere-cyan mb-4"></div>
        <div className="text-center">Analyzing data...</div>
        <div className="text-sm text-slate-400 mt-2">This may take a moment</div>
      </div>
    );
  }

  // Use customChartConfig if available
  if (customChartConfig && activeDataset) {
    try {
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
    } catch (error) {
      console.error("Error rendering custom chart:", error);
      return (
        <div className="flex flex-col items-center justify-center h-full text-slate-300">
          <div className="text-lg mb-2">Error rendering visualization</div>
          <p className="text-sm text-slate-400">{String(error)}</p>
        </div>
      );
    }
  }
  
  // Default chart rendering based on type with error handling
  try {
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
              {Object.keys(activeDataset.data[0] || {}).filter(key => 
                typeof activeDataset.data[0][key] === 'number' && key !== 'id'
              ).map((key, index) => (
                <Line 
                  key={key}
                  type="monotone" 
                  dataKey={key} 
                  name={key}
                  stroke={CHART_COLORS[index % CHART_COLORS.length]} 
                  activeDot={{ r: 8 }} 
                  connectNulls
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
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {Object.keys(activeDataset.data[0] || {}).filter(key => 
                typeof activeDataset.data[0][key] === 'number' && key !== 'id'
              ).map((key, index) => (
                <Bar 
                  key={key}
                  dataKey={key} 
                  name={key}
                  fill={CHART_COLORS[index % CHART_COLORS.length]} 
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
                dataKey={Object.keys(activeDataset.data[0] || {}).find(key => 
                  typeof activeDataset.data[0][key] === 'number' && key !== 'id'
                ) || ''}
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(entry) => entry.name || entry.category || ''}
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
        const numericKeys = Object.keys(activeDataset.data[0] || {}).filter(key => 
          typeof activeDataset.data[0][key] === 'number' && key !== 'id'
        );
        
        return (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey={numericKeys[0] || ''} name={numericKeys[0] || ''} />
              <YAxis dataKey={numericKeys[1] || ''} name={numericKeys[1] || ''} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Legend />
              <Scatter name={`${numericKeys[0]} vs ${numericKeys[1]}`} data={activeDataset.data} fill="#8884d8" />
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
              {Object.keys(activeDataset.data[0] || {}).filter(key => 
                typeof activeDataset.data[0][key] === 'number' && key !== 'id'
              ).map((key, index) => (
                <Area 
                  key={key}
                  type="monotone" 
                  dataKey={key} 
                  name={key}
                  stroke={CHART_COLORS[index % CHART_COLORS.length]} 
                  fill={CHART_COLORS[index % CHART_COLORS.length]} 
                  fillOpacity={0.3} 
                  connectNulls
                />
              ))}
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
              <Radar 
                name={Object.keys(activeDataset.data[0] || {}).find(key => 
                  typeof activeDataset.data[0][key] === 'number' && key !== 'id'
                ) || ''}
                dataKey={Object.keys(activeDataset.data[0] || {}).find(key => 
                  typeof activeDataset.data[0][key] === 'number' && key !== 'id'
                ) || ''}
                stroke="#8884d8" 
                fill="#8884d8" 
                fillOpacity={0.6} 
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        );
        
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-slate-300">
            <div className="text-lg mb-2">Unsupported chart type: {type}</div>
            <p className="text-sm text-slate-400">Please select a different chart type</p>
          </div>
        );
    }
  } catch (error) {
    console.error("Error rendering default chart:", error);
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-300">
        <div className="text-lg mb-2">Error rendering visualization</div>
        <p className="text-sm text-slate-400">{String(error)}</p>
      </div>
    );
  }
};

export default ChartComponent;
