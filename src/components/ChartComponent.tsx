
import React from 'react';
import { useVisualization } from '@/contexts/VisualizationContext';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, ScatterChart, Scatter, 
  AreaChart, Area, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Treemap, FunnelChart, Funnel, ComposedChart
} from 'recharts';
import { CHART_COLORS } from '@/services/dataService';

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
        <p className="text-white">{`${label || 'Value'}: ${value}`}</p>
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
    customChartConfig,
    visualizationData
  } = useVisualization();
  
  // Use visualizationData (which includes row selection) instead of activeDataset.data
  const data = visualizationData || activeDataset?.data || [];
  
  if (!activeDataset || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-300">
        <div className="text-lg mb-2">No data available for visualization</div>
        <p className="text-sm text-slate-400">Please import data or select rows to visualize</p>
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
  
  // Ensure data is formatted properly for charting
  const prepareData = () => {
    if (!data || data.length === 0) return [];
    
    // Return a clean copy of the data to avoid reference issues
    return data.map(item => ({...item}));
  };
  
  const preparedData = prepareData();
  
  // Check for data format and choose appropriate keys
  const getAvailableKeys = () => {
    if (!preparedData || preparedData.length === 0) return { categories: [], metrics: [] };
    
    const firstItem = preparedData[0];
    const categories: string[] = [];
    const metrics: string[] = [];
    
    Object.entries(firstItem).forEach(([key, value]) => {
      if (typeof value === 'number' && key !== 'id' && !isNaN(value)) {
        metrics.push(key);
      } else if (typeof value === 'string' || typeof value === 'boolean') {
        categories.push(key);
      }
    });
    
    return { categories, metrics };
  };
  
  const { categories, metrics } = getAvailableKeys();
  
  // Determine best category for charts
  const bestCategory = categories.find(cat => 
    cat.toLowerCase().includes('category') || 
    cat.toLowerCase().includes('name') || 
    cat.toLowerCase().includes('product') ||
    cat.toLowerCase().includes('region') ||
    cat.toLowerCase().includes('date') ||
    cat.toLowerCase().includes('month')
  ) || categories[0] || 'category';
  
  // If data has no metrics, try to make it work with what we have
  if (metrics.length === 0 && preparedData.length > 0) {
    console.log('No numeric metrics found. Creating artificial metrics.');
    // Add index as a numeric metric for visualization
    preparedData.forEach((item, index) => {
      item.value = index + 1;
    });
  }

  // Use customChartConfig if available
  if (customChartConfig && preparedData.length > 0) {
    try {
      // Get appropriate chart based on customChartConfig.chartType
      switch (customChartConfig.chartType.toLowerCase()) {
        case 'line':
          return (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={preparedData}>
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
              <BarChart data={preparedData}>
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
                  data={preparedData}
                  dataKey={customChartConfig.series[0].dataKey}
                  nameKey={customChartConfig.xAxis.dataKey}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => entry.name || entry[customChartConfig.xAxis.dataKey] || ''}
                >
                  {preparedData.map((entry, index) => (
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
              <AreaChart data={preparedData}>
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
                    data={preparedData}
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
            <LineChart data={preparedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey={bestCategory} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {metrics.slice(0, 3).map((key, index) => (
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
            <BarChart data={preparedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey={bestCategory} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {metrics.slice(0, 3).map((key, index) => (
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
                data={preparedData}
                dataKey={metrics[0] || 'value'}
                nameKey={bestCategory}
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={entry => entry[bestCategory] || ''}
              >
                {preparedData.map((entry, index) => (
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
              <XAxis dataKey={metrics[0] || 'value'} name={metrics[0] || 'Value'} />
              <YAxis dataKey={metrics[1] || metrics[0] || 'value'} name={metrics[1] || metrics[0] || 'Value'} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Legend />
              <Scatter 
                name={`${metrics[0] || 'X'} vs ${metrics[1] || metrics[0] || 'Y'}`} 
                data={preparedData} 
                fill="#8884d8" 
              />
            </ScatterChart>
          </ResponsiveContainer>
        );
        
      case 'area':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={preparedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey={bestCategory} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {metrics.slice(0, 3).map((key, index) => (
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

      case 'clusteredBar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={preparedData} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey={bestCategory} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {metrics.slice(0, 4).map((key, index) => (
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

      case 'stackedBar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={preparedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey={bestCategory} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {metrics.slice(0, 4).map((key, index) => (
                <Bar 
                  key={key}
                  dataKey={key} 
                  name={key}
                  stackId="stack"
                  fill={CHART_COLORS[index % CHART_COLORS.length]} 
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'stackedArea':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={preparedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey={bestCategory} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {metrics.slice(0, 4).map((key, index) => (
                <Area 
                  key={key}
                  type="monotone" 
                  dataKey={key} 
                  name={key}
                  stackId="stack"
                  stroke={CHART_COLORS[index % CHART_COLORS.length]} 
                  fill={CHART_COLORS[index % CHART_COLORS.length]} 
                  fillOpacity={0.6} 
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'donut':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={preparedData}
                dataKey={metrics[0] || 'value'}
                nameKey={bestCategory}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={100}
                label={entry => entry[bestCategory] || ''}
              >
                {preparedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'treemap':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <Treemap
              data={preparedData}
              dataKey={metrics[0] || 'value'}
              stroke="#444"
              fill="#8884d8"
            />
          </ResponsiveContainer>
        );

      case 'funnel':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <FunnelChart>
              <Funnel
                dataKey={metrics[0] || 'value'}
                data={preparedData}
                isAnimationActive
              >
                {preparedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Funnel>
              <Tooltip />
            </FunnelChart>
          </ResponsiveContainer>
        );

      case 'waterfall':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={preparedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey={bestCategory} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey={metrics[0] || 'value'} fill="#8884d8" />
            </ComposedChart>
          </ResponsiveContainer>
        );

      case 'heatmap':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey={metrics[0] || 'value'} />
              <YAxis dataKey={metrics[1] || metrics[0] || 'value'} />
              <Tooltip />
              <Scatter data={preparedData} fill="#8884d8" />
            </ScatterChart>
          </ResponsiveContainer>
        );

      case 'radar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={preparedData}>
              <PolarGrid stroke="#444" />
              <PolarAngleAxis dataKey={bestCategory} stroke="#fff" />
              <PolarRadiusAxis stroke="#fff" />
              <Radar 
                name={metrics[0] || 'Value'}
                dataKey={metrics[0] || 'value'}
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
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={preparedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey={bestCategory} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {metrics.slice(0, 3).map((key, index) => (
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
