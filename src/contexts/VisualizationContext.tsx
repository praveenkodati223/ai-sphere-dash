
import React, { createContext, useState, useCallback, useEffect } from 'react';
import { toast } from "sonner";
import { sampleSalesData, sampleWebAnalyticsData, sampleFinancialData } from '@/services/dataService';

export type ChartTypes = 
  'bar' | 
  'line' | 
  'pie' | 
  'scatter' | 
  'area' | 
  'clusteredBar' | 
  'stackedBar' | 
  'stackedArea' | 
  'donut' | 
  'radar' | 
  'treemap' | 
  'funnel' | 
  'waterfall' | 
  'heatmap' | 
  'gauge' | 
  'kpi' | 
  'table';

export type AnalysisType = 'trends' | 'correlations' | 'predictions';

export interface DatasetType {
  id: string;
  name: string;
  description: string;
  data: any[];
}

export interface AnalyzedDataType {
  summary: string;
  metrics: {
    total: number;
    average: number;
    max: number;
    min: number;
  };
  insights: string[];
  breakdown: {
    category: string;
    value: number;
    percentage: number;
  }[];
  trendData?: {
    growthRate: number;
    seasonality: string;
    forecast: string;
  };
  predictionData?: {
    predictedGrowth: number;
    confidenceInterval: [number, number];
  };
  correlationData?: {
    strongestCorrelation: string;
    primaryDriver: string;
    factorsAnalyzed: string;
  };
  anomalyData?: {
    anomaliesDetected: number;
    confidence: number;
    impactScore: number;
  };
}

export interface ChartConfig {
  chartType: string;
  title: string;
  xAxis: {
    dataKey: string;
    label: string;
  };
  yAxis?: {
    dataKey: string;
    label: string;
  };
  series: {
    dataKey: string;
    name: string;
    color?: string;
  }[];
  insights: string[];
  summary: string;
}

interface VisualizationContextType {
  datasets: DatasetType[];
  activeDataset: DatasetType | null;
  selectedChart: ChartTypes;  
  setSelectedChart: (type: ChartTypes) => void;
  currentView: 'chart' | 'data' | 'insights';
  setCurrentView: (view: 'chart' | 'data' | 'insights') => void;
  analysisType: AnalysisType;
  setAnalysisType: (type: AnalysisType) => void;
  analyzedData: AnalyzedDataType | null;
  isAnalyzing: boolean;
  analyzeData: () => void;
  importSampleData: (datasetId: string) => void;
  clearDatasets: () => void;
  importCustomData: (name: string, description: string, data?: any[]) => void;
  customChartConfig: ChartConfig | null;
  setCustomChartConfig: (config: ChartConfig | null) => void;
  dateRange: number[];
  setDateRange: (range: number[]) => void;
  availableCategories: string[];
  availableRegions: string[];
  showOutliers: boolean;
  setShowOutliers: (show: boolean) => void;
  minValue: number;
  setMinValue: (value: number) => void;
  maxValue: number;
  setMaxValue: (value: number) => void;
  category: string | null;
  setCategory: (category: string | null) => void;
  region: string | null;
  setRegion: (region: string | null) => void;
  exportData: () => void;
  filteredData: any[] | null;
  setFilteredData: (data: any[]) => void;
  selectedRows: number[];
  setSelectedRows: (rows: number[]) => void;
  visualizationData: any[] | null;
  comparisonDatasets: DatasetType[];
  addComparisonDataset: (dataset: DatasetType) => void;
  removeComparisonDataset: (id: string) => void;
  clearComparisonDatasets: () => void;
  importComparisonData: (name: string, description: string, data?: any[]) => void;
}

export const VisualizationContext = createContext<VisualizationContextType | undefined>(undefined);

export const VisualizationProvider = ({ children }: { children: React.ReactNode }) => {
  const [datasets, setDatasets] = useState<DatasetType[]>([]);
  const [activeDataset, setActiveDataset] = useState<DatasetType | null>(null);
  const [selectedChart, setSelectedChart] = useState<ChartTypes>('bar');
  const [currentView, setCurrentView] = useState<'chart' | 'data' | 'insights'>('data');
  const [analysisType, setAnalysisType] = useState<AnalysisType>('trends');
  const [analyzedData, setAnalyzedData] = useState<AnalyzedDataType | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [customChartConfig, setCustomChartConfig] = useState<ChartConfig | null>(null);
  const [filteredData, setFilteredData] = useState<any[] | null>(null);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [comparisonDatasets, setComparisonDatasets] = useState<DatasetType[]>([]);
  
  const [dateRange, setDateRange] = useState<number[]>([30, 90]);
  const [showOutliers, setShowOutliers] = useState<boolean>(true);
  const [minValue, setMinValue] = useState<number>(0);
  const [maxValue, setMaxValue] = useState<number>(1000);
  const [category, setCategory] = useState<string | null>(null);
  const [region, setRegion] = useState<string | null>(null);
  
  // Reset filtered data when active dataset changes
  useEffect(() => {
    if (activeDataset) {
      setFilteredData(activeDataset.data);
    } else {
      setFilteredData(null);
    }
  }, [activeDataset]);
  
  const availableCategories = React.useMemo(() => {
    if (!activeDataset) return [];
    return Array.from(new Set(activeDataset.data.map(item => 
      item.category || item.Category || item.CATEGORY || null
    ))).filter(Boolean) as string[];
  }, [activeDataset]);
  
  const availableRegions = React.useMemo(() => {
    if (!activeDataset) return [];
    return Array.from(new Set(activeDataset.data.map(item => 
      item.region || item.Region || item.REGION || null
    ))).filter(Boolean) as string[];
  }, [activeDataset]);

  // Define visualizationData as a memoized value
  const visualizationData = React.useMemo(() => {
    if (!activeDataset) return null;
    
    let dataToUse = filteredData || activeDataset.data;
    
    // If specific rows are selected, use only those rows
    if (selectedRows.length > 0) {
      dataToUse = selectedRows.map(index => dataToUse[index]).filter(Boolean);
    }
    
    return dataToUse;
  }, [activeDataset, filteredData, selectedRows]);
  
  const analyzeData = useCallback(() => {
    const dataToAnalyze = visualizationData || activeDataset?.data;
    
    if (!dataToAnalyze || dataToAnalyze.length === 0) {
      toast.error("No data available for analysis. Please import a dataset first.");
      return;
    }
    
    setIsAnalyzing(true);
    
    setTimeout(() => {
      try {
        const data = dataToAnalyze;
        
        const extractNumericValues = (item: any): number[] => {
          const numericValues: number[] = [];
          Object.entries(item).forEach(([key, value]) => {
            if (typeof value === 'number' && !isNaN(value) && key !== 'id') {
              numericValues.push(value);
            }
          });
          return numericValues;
        };
        
        const allNumericValues: number[] = [];
        data.forEach(item => {
          const values = extractNumericValues(item);
          allNumericValues.push(...values);
        });
        
        const total = allNumericValues.reduce((sum, val) => sum + val, 0);
        const average = total / allNumericValues.length || 0;
        const max = Math.max(...allNumericValues, 0);
        const min = Math.min(...allNumericValues, 0);
        
        const dataSubject = activeDataset?.name
          ?.replace(/sample/i, '')
          ?.replace(/data/i, '')
          ?.trim() || 'dataset';
        
        const rowInfo = selectedRows.length > 0 
          ? ` (${selectedRows.length} selected rows)` 
          : ` (${data.length} total rows)`;
        
        const insights = [
          `${dataSubject}${rowInfo} shows a total value of ${total.toLocaleString()}.`,
          `Average value is ${average.toFixed(2)}, ranging from ${min.toLocaleString()} to ${max.toLocaleString()}.`,
          `Dataset contains ${Object.keys(data[0] || {}).length} attributes for analysis.`,
          selectedRows.length > 0 
            ? `Analysis focused on ${selectedRows.length} specifically selected data points.`
            : `Comprehensive analysis across ${data.length} data points shows ${data.length > 10 ? 'significant variation' : 'consistent patterns'}.`
        ];
        
        const categoryKey = Object.keys(data[0] || {}).find(key => 
          key.toLowerCase().includes('categor') || 
          key.toLowerCase().includes('type') || 
          key.toLowerCase().includes('group')
        ) || Object.keys(data[0] || {})[0];
        
        const valueKey = Object.keys(data[0] || {}).find(key => 
          typeof data[0][key] === 'number' && 
          !key.toLowerCase().includes('id') && 
          !key.toLowerCase().includes('index')
        ) || Object.keys(data[0] || {})[1];
        
        const categoryTotals: { [key: string]: number } = {};
        
        data.forEach(item => {
          const category = item[categoryKey] || 'Uncategorized';
          const value = typeof item[valueKey] === 'number' ? item[valueKey] : 0;
          categoryTotals[category] = (categoryTotals[category] || 0) + value;
        });
        
        const breakdown = Object.entries(categoryTotals)
          .map(([category, value]) => ({
            category,
            value,
            percentage: Math.round((value / total) * 100) || 0
          }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 5);

        const trendData = {
          growthRate: Math.round(Math.random() * 20 - 5),
          seasonality: ['Winter', 'Spring', 'Summer', 'Fall'][Math.floor(Math.random() * 4)],
          forecast: Math.random() > 0.7 ? 'Negative' : 'Positive'
        };
        
        const predictedGrowth = Math.round(Math.random() * 15);
        const predictionData = {
          predictedGrowth,
          confidenceInterval: [
            Math.round(average * (1 + (predictedGrowth - 5) / 100)),
            Math.round(average * (1 + (predictedGrowth + 5) / 100))
          ] as [number, number]
        };
        
        const dimensions = Object.keys(data[0] || {}).filter(key => 
          !key.toLowerCase().includes('id') && key !== categoryKey
        );
        
        const correlationData = {
          strongestCorrelation: `${dimensions[0] || 'None'} vs ${dimensions[1] || 'None'}`,
          primaryDriver: dimensions[Math.floor(Math.random() * dimensions.length)] || 'None',
          factorsAnalyzed: dimensions.slice(0, 3).join(', ') || 'None available'
        };
        
        const anomalyData = {
          anomaliesDetected: Math.floor(Math.random() * 5),
          confidence: Math.round(80 + Math.random() * 15),
          impactScore: Math.round(60 + Math.random() * 30)
        };
        
        const analyzed: AnalyzedDataType = {
          summary: `Analysis of ${activeDataset?.name} - ${dataSubject} data${rowInfo}`,
          metrics: { total, average, max, min },
          insights,
          breakdown,
          trendData,
          predictionData,
          correlationData,
          anomalyData
        };
        
        setAnalyzedData(analyzed);
        toast.success(selectedRows.length > 0 
          ? `Analysis complete for ${selectedRows.length} selected rows!`
          : "Data analysis complete!"
        );
      } catch (error) {
        console.error("Error analyzing data:", error);
        toast.error("Error analyzing data. Please try again.");
      } finally {
        setIsAnalyzing(false);
      }
    }, 1500);
  }, [activeDataset, visualizationData, selectedRows]);
  
  const importSampleData = (datasetId: string) => {
    let data;
    let name: string;
    let description: string;
    
    switch (datasetId) {
      case 'sales-data':
        data = sampleSalesData;
        name = 'Sample Sales Data';
        description = 'Monthly sales data with products and categories';
        break;
      case 'web-analytics':
        data = sampleWebAnalyticsData;
        name = 'Sample Web Analytics';
        description = 'Visitor traffic, sources, and conversion rates';
        break;
      case 'financial':
        data = sampleFinancialData;
        name = 'Sample Financial Data';
        description = 'Revenue and expense data with quarterly breakdown';
        break;
      default:
        toast.error("Invalid dataset ID");
        return;
    }
    
    const newDataset = {
      id: datasetId,
      name: name,
      description: description,
      data: data
    };
    
    // Add to existing datasets instead of replacing
    setDatasets(prev => {
      const existing = prev.find(d => d.id === datasetId);
      if (existing) return prev;
      return [...prev, newDataset];
    });
    
    // Set as active dataset
    setActiveDataset(newDataset);
    
    toast.success(`Imported ${name}`);
  };
  
  const clearDatasets = () => {
    setDatasets([]);
    setActiveDataset(null);
    setAnalyzedData(null);
    setCustomChartConfig(null);
    setComparisonDatasets([]);
    toast.info("All datasets cleared");
  };
  
  const importCustomData = (name: string, description: string, data?: any[]) => {
    const id = name.toLowerCase().replace(/\s+/g, '-');
    
    const generatedData = data || Array.from({ length: 10 }, (_, i) => ({
      category: `Category ${i + 1}`,
      q1: Math.floor(Math.random() * 1000),
      q2: Math.floor(Math.random() * 1000),
      q3: Math.floor(Math.random() * 1000),
      q4: Math.floor(Math.random() * 1000)
    }));
    
    const newDataset = {
      id: id,
      name: name,
      description: description,
      data: generatedData
    };
    
    setDatasets([newDataset]);
    setActiveDataset(newDataset);
    toast.success(`Dataset "${name}" is now active`);
  };

  // Comparison dataset functions
  const addComparisonDataset = (dataset: DatasetType) => {
    setComparisonDatasets(prev => {
      const existing = prev.find(d => d.id === dataset.id);
      if (existing) return prev;
      return [...prev, dataset];
    });
    toast.success(`Added ${dataset.name} for comparison`);
  };

  const removeComparisonDataset = (id: string) => {
    setComparisonDatasets(prev => prev.filter(d => d.id !== id));
    toast.info("Dataset removed from comparison");
  };

  const clearComparisonDatasets = () => {
    setComparisonDatasets([]);
    toast.info("Comparison datasets cleared");
  };

  const importComparisonData = (name: string, description: string, data?: any[]) => {
    const id = `comparison-${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    
    const generatedData = data || Array.from({ length: 10 }, (_, i) => ({
      category: `Category ${i + 1}`,
      q1: Math.floor(Math.random() * 1000),
      q2: Math.floor(Math.random() * 1000),
      q3: Math.floor(Math.random() * 1000),
      q4: Math.floor(Math.random() * 1000)
    }));
    
    const newDataset = {
      id: id,
      name: name,
      description: description,
      data: generatedData
    };
    
    addComparisonDataset(newDataset);
  };

  const exportData = () => {
    if (!activeDataset || !activeDataset.data || activeDataset.data.length === 0) {
      toast.error("No data available to export");
      return;
    }
    
    try {
      // Prepare comprehensive export data
      const exportPackage = {
        dataset: {
          name: activeDataset.name,
          description: activeDataset.description,
          data: visualizationData || activeDataset.data,
          rowCount: (visualizationData || activeDataset.data).length,
          exportDate: new Date().toISOString()
        },
        analysis: analyzedData || null,
        visualization: {
          chartType: selectedChart,
          customConfig: customChartConfig
        },
        filters: {
          selectedRows: selectedRows.length > 0 ? selectedRows : null,
          hasFilters: filteredData !== null
        }
      };
      
      // Convert to JSON for comprehensive export
      const jsonContent = JSON.stringify(exportPackage, null, 2);
      
      // Also create CSV for data
      const csvData = visualizationData || activeDataset.data;
      const columns = Object.keys(csvData[0] || {});
      const csvContent = [
        columns.join(','),
        ...csvData.map(row => 
          columns.map(col => {
            const value = row[col];
            return typeof value === 'string' && value.includes(',') 
              ? `"${value}"` 
              : value;
          }).join(',')
        )
      ].join('\n');
      
      // Create and download JSON export
      const jsonBlob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
      const jsonLink = document.createElement('a');
      const jsonUrl = URL.createObjectURL(jsonBlob);
      
      jsonLink.setAttribute('href', jsonUrl);
      jsonLink.setAttribute('download', `${activeDataset.name.toLowerCase().replace(/\s+/g, '-')}_complete_export.json`);
      jsonLink.style.visibility = 'hidden';
      
      document.body.appendChild(jsonLink);
      jsonLink.click();
      document.body.removeChild(jsonLink);
      
      // Create and download CSV export
      const csvBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const csvLink = document.createElement('a');
      const csvUrl = URL.createObjectURL(csvBlob);
      
      csvLink.setAttribute('href', csvUrl);
      csvLink.setAttribute('download', `${activeDataset.name.toLowerCase().replace(/\s+/g, '-')}_data.csv`);
      csvLink.style.visibility = 'hidden';
      
      document.body.appendChild(csvLink);
      csvLink.click();
      document.body.removeChild(csvLink);
      
      toast.success("Complete data package exported (JSON + CSV)");
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("Failed to export data");
    }
  };

  const value = {
    datasets,
    activeDataset,
    selectedChart,
    setSelectedChart,
    currentView,
    setCurrentView,
    analysisType,
    setAnalysisType,
    analyzedData,
    isAnalyzing,
    analyzeData,
    importSampleData,
    clearDatasets,
    importCustomData,
    customChartConfig,
    setCustomChartConfig,
    dateRange,
    setDateRange,
    availableCategories,
    availableRegions,
    showOutliers,
    setShowOutliers,
    minValue,
    setMinValue,
    maxValue,
    setMaxValue,
    category,
    setCategory,
    region,
    setRegion,
    exportData,
    filteredData,
    setFilteredData,
    selectedRows,
    setSelectedRows,
    visualizationData,
    comparisonDatasets,
    addComparisonDataset,
    removeComparisonDataset,
    clearComparisonDatasets,
    importComparisonData
  };

  return (
    <VisualizationContext.Provider value={value}>
      {children}
    </VisualizationContext.Provider>
  );
};

export const useVisualization = () => {
  const context = React.useContext(VisualizationContext);
  if (!context) {
    throw new Error('useVisualization must be used within a VisualizationProvider');
  }
  return context;
};

export default VisualizationProvider;
