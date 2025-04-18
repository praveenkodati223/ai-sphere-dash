import React, { createContext, useState, useCallback } from 'react';
import { toast } from "sonner";
import { sampleSalesData, sampleWebAnalyticsData, sampleInventoryData, sampleFinancialData } from '@/services/dataService';

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
}

export const VisualizationContext = createContext<VisualizationContextType | undefined>(undefined);

export const VisualizationProvider = ({ children }: { children: React.ReactNode }) => {
  const [datasets, setDatasets] = useState<DatasetType[]>([]);
  const [activeDataset, setActiveDataset] = useState<DatasetType | null>(null);
  const [selectedChart, setSelectedChart] = useState<ChartTypes>('bar');
  const [currentView, setCurrentView] = useState<'chart' | 'data' | 'insights'>('chart');
  const [analysisType, setAnalysisType] = useState<AnalysisType>('trends');
  const [analyzedData, setAnalyzedData] = useState<AnalyzedDataType | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  
  // Add this new state for custom chart configuration
  const [customChartConfig, setCustomChartConfig] = useState<ChartConfig | null>(null);
  
  const analyzeData = useCallback(() => {
    if (!activeDataset || !activeDataset.data || activeDataset.data.length === 0) {
      toast.error("No dataset available for analysis");
      return;
    }
    
    setIsAnalyzing(true);
    
    // Simulate analysis
    setTimeout(() => {
      try {
        const data = activeDataset.data;
        
        // Calculate basic metrics
        const total = data.reduce((sum, item) => sum + (item.value || item.q1 + item.q2 + item.q3 + item.q4), 0);
        const average = total / data.length;
        const max = Math.max(...data.map(item => item.value || item.q1 + item.q2 + item.q3 + item.q4));
        const min = Math.min(...data.map(item => item.value || item.q1 + item.q2 + item.q3 + item.q4));
        
        // Generate insights
        const insights = [
          `Total value: ${total.toLocaleString()}`,
          `Average value: ${average.toLocaleString()}`,
          `Maximum value: ${max.toLocaleString()}`,
          `Minimum value: ${min.toLocaleString()}`
        ];
        
        // Category breakdown
        const categoryTotals: { [key: string]: number } = {};
        data.forEach(item => {
          const category = item.category || 'Unknown';
          categoryTotals[category] = (categoryTotals[category] || 0) + (item.value || item.q1 + item.q2 + item.q3 + item.q4);
        });
        
        const breakdown = Object.entries(categoryTotals).map(([category, value]) => ({
          category,
          value,
          percentage: Math.round((value / total) * 100)
        }));
        
        // Trend analysis (example)
        const trendData = {
          growthRate: 5,
          seasonality: 'Winter',
          forecast: 'Positive'
        };
        
        // Prediction data (example)
        const predictionData = {
          predictedGrowth: 7,
          confidenceInterval: [1000, 1500]
        };
        
        // Correlation data (example)
        const correlationData = {
          strongestCorrelation: 'Category vs Sales',
          primaryDriver: 'Marketing Spend',
          factorsAnalyzed: 'Sales, Marketing, Seasonality'
        };
        
        // Anomaly detection (example)
        const anomalyData = {
          anomaliesDetected: 3,
          confidence: 95,
          impactScore: 75
        };
        
        const analyzed: AnalyzedDataType = {
          summary: `Analysis of ${activeDataset.name} - ${data.length} data points`,
          metrics: { total, average, max, min },
          insights,
          breakdown,
          trendData,
          predictionData,
          correlationData,
          anomalyData
        };
        
        setAnalyzedData(analyzed);
        toast.success("Data analysis complete!");
      } catch (error) {
        console.error("Error analyzing data:", error);
        toast.error("Error analyzing data. Please try again.");
      } finally {
        setIsAnalyzing(false);
      }
    }, 1500);
  }, [activeDataset]);
  
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
      case 'inventory':
        data = sampleInventoryData;
        name = 'Sample Inventory Data';
        description = 'Stock levels across categories and locations';
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
    
    setDatasets([newDataset]);
    setActiveDataset(newDataset);
    toast.success(`Imported ${name}`);
  };
  
  const clearDatasets = () => {
    setDatasets([]);
    setActiveDataset(null);
    setAnalyzedData(null);
    setCustomChartConfig(null);
    toast.info("All datasets cleared");
  };
  
  const importCustomData = (name: string, description: string, data?: any[]) => {
    const id = name.toLowerCase().replace(/\s+/g, '-');
    
    // If no data is provided, generate random data
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
  };

  // Add customChartConfig to the context value
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
    setCustomChartConfig
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
