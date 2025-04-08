
import React, { createContext, useContext, useState, useEffect } from 'react';
import { DataSet, sampleDatasets, generateSampleData } from '@/services/dataService';
import { toast } from "sonner";

export type ChartType = 
  | 'bar' 
  | 'stackedBar' 
  | 'clusteredBar' 
  | 'line' 
  | 'area' 
  | 'stackedArea' 
  | 'pie' 
  | 'donut' 
  | 'scatter' 
  | 'bubble' 
  | 'radar' 
  | 'treemap' 
  | 'funnel' 
  | 'gauge' 
  | 'kpi' 
  | 'table' 
  | 'heatmap'
  | 'waterfall';

interface VisualizationContextType {
  activeDataset: DataSet | null;
  datasets: DataSet[];
  selectedChart: ChartType;
  setSelectedChart: (chart: ChartType) => void;
  loadDataset: (datasetId: string) => void;
  importSampleData: (datasetId: string, name?: string, description?: string) => void;
  currentView: string;
  setCurrentView: (view: string) => void;
  dateRange: [number, number];
  setDateRange: (range: [number, number]) => void;
  analyzedData: any | null;
  analyzeData: () => void;
  analysisType: string;
  setAnalysisType: (type: string) => void;
  isAnalyzing: boolean;
  clearDatasets: () => void;
  availableCategories: string[];
  availableRegions: string[];
  showOutliers: boolean;
  setShowOutliers: (value: boolean) => void;
  minValue: string;
  setMinValue: (value: string) => void;
  maxValue: string;
  setMaxValue: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  region: string;
  setRegion: (value: string) => void;
}

const VisualizationContext = createContext<VisualizationContextType | undefined>(undefined);

export const VisualizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [datasets, setDatasets] = useState<DataSet[]>([]);
  const [activeDataset, setActiveDataset] = useState<DataSet | null>(null);
  const [selectedChart, setSelectedChart] = useState<ChartType>('bar');
  const [currentView, setCurrentView] = useState('chart');
  const [dateRange, setDateRange] = useState<[number, number]>([30, 90]);
  const [analyzedData, setAnalyzedData] = useState<any | null>(null);
  const [analysisType, setAnalysisType] = useState('trends');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableRegions, setAvailableRegions] = useState<string[]>([]);
  
  // Filter state
  const [showOutliers, setShowOutliers] = useState<boolean>(false);
  const [minValue, setMinValue] = useState<string>('0');
  const [maxValue, setMaxValue] = useState<string>('1000');
  const [category, setCategory] = useState<string>('all');
  const [region, setRegion] = useState<string>('all');

  // Clear all datasets
  const clearDatasets = () => {
    setDatasets([]);
    setActiveDataset(null);
    setAnalyzedData(null);
    setAvailableCategories([]);
    setAvailableRegions([]);
  };

  // Extract available categories and regions when dataset changes
  useEffect(() => {
    if (activeDataset) {
      console.log("Active dataset changed:", activeDataset.name);
      
      // Extract unique categories
      const categories = Array.from(new Set(activeDataset.data
        .filter(item => item.category)
        .map(item => item.category)
      ));
      setAvailableCategories(categories);
      console.log("Available categories:", categories);
      
      // Extract unique regions
      const regions = Array.from(new Set(activeDataset.data
        .filter(item => item.region)
        .map(item => item.region as string)
      ));
      setAvailableRegions(regions);
      console.log("Available regions:", regions);
      
      // Set default chart based on dataset type
      if (categories.length > 10) {
        setSelectedChart('table');
      } else if (regions.length > 0 && categories.length <= 5) {
        setSelectedChart('pie');
      } else {
        setSelectedChart('bar');
      }
      
      // When dataset changes, make sure we're showing the chart view
      setCurrentView('chart');
      
      // Auto analyze when dataset changes
      analyzeData();
    }
  }, [activeDataset]);

  const loadDataset = (datasetId: string) => {
    const dataset = datasets.find(d => d.id === datasetId);
    if (dataset) {
      setActiveDataset(dataset);
      toast.success(`Loaded dataset: ${dataset.name}`);
      // Analysis will be triggered by the useEffect
    } else {
      toast.error('Dataset not found');
    }
  };

  const importSampleData = (datasetId: string, name?: string, description?: string) => {
    const sampleDataset = sampleDatasets.find(d => d.id === datasetId);
    if (sampleDataset) {
      // Create a fresh copy with new random data
      const newDataset = {
        ...sampleDataset,
        name: name || sampleDataset.name,
        description: description || sampleDataset.description,
        data: generateSampleData(),
        lastUpdated: new Date()
      };
      
      // Add to datasets, replacing previous import with same ID
      setDatasets(prev => {
        const filteredDatasets = prev.filter(d => d.id !== datasetId);
        return [...filteredDatasets, newDataset];
      });
      
      // Set as active dataset
      setActiveDataset(newDataset);
      
      toast.success(`Imported: ${newDataset.name}`);
      
      // Make sure we reset the analysis data
      setAnalyzedData(null);
      
      console.log("Dataset imported and activated:", newDataset);
      return true;
    }
    
    console.error("Sample dataset not found:", datasetId);
    return false;
  };

  const analyzeData = () => {
    if (!activeDataset) {
      toast.error('No dataset available for analysis');
      return;
    }
    
    setIsAnalyzing(true);
    
    // Apply filters to get filtered data
    let filteredData = [...activeDataset.data];
    
    // Apply category filter
    if (category !== 'all') {
      filteredData = filteredData.filter(item => item.category === category);
    }
    
    // Apply region filter
    if (region !== 'all') {
      filteredData = filteredData.filter(item => item.region === region);
    }
    
    // Apply min/max value filters
    const minValueNum = parseFloat(minValue);
    const maxValueNum = parseFloat(maxValue);
    
    if (!isNaN(minValueNum)) {
      filteredData = filteredData.filter(item => {
        const itemValue = item.value || (item.q1 + item.q2 + item.q3 + item.q4);
        return itemValue >= minValueNum;
      });
    }
    
    if (!isNaN(maxValueNum)) {
      filteredData = filteredData.filter(item => {
        const itemValue = item.value || (item.q1 + item.q2 + item.q3 + item.q4);
        return itemValue <= maxValueNum;
      });
    }
    
    // Check if we have data after filtering
    if (filteredData.length === 0) {
      setIsAnalyzing(false);
      toast.error('No data matches your filter criteria');
      return;
    }
    
    // Simulate analysis process
    setTimeout(() => {
      try {
        // Generate different analysis results based on analysis type
        let result: any = {
          summary: `Analysis of ${activeDataset.name} - ${analysisType}`,
          metrics: {
            total: filteredData.reduce((sum, item) => sum + (item.value || 
              (item.q1 + item.q2 + item.q3 + item.q4)), 0),
            average: Math.round(filteredData.reduce((sum, item) => sum + (item.value || 
              (item.q1 + item.q2 + item.q3 + item.q4)), 0) / filteredData.length),
            max: Math.max(...filteredData.map(item => item.value || 
              (item.q1 + item.q2 + item.q3 + item.q4))),
            min: Math.min(...filteredData.map(item => item.value || 
              (item.q1 + item.q2 + item.q3 + item.q4)))
          },
          breakdown: filteredData.map(item => ({
            category: item.category,
            value: item.value || (item.q1 + item.q2 + item.q3 + item.q4),
            percentage: Math.round(((item.value || (item.q1 + item.q2 + item.q3 + item.q4)) / 
              filteredData.reduce((sum, i) => sum + (i.value || (i.q1 + i.q2 + i.q3 + i.q4)), 0)) * 100)
          })).sort((a, b) => b.value - a.value),
          insights: []
        };
        
        // Generate different insights based on analysis type
        switch(analysisType) {
          case 'trends':
            result.trendData = {
              growthRate: Math.round(Math.random() * 20 + 5),
              seasonality: Math.random() > 0.5 ? "Strong" : "Moderate",
              forecast: "Upward"
            };
            result.insights = [
              `${result.breakdown[0]?.category || 'Product'} shows the highest upward trend with ${result.trendData.growthRate}% growth`,
              'Strong upward trend detected in recent data',
              'Consider investigating seasonal patterns in the time series data',
              'Month-over-month growth is accelerating'
            ];
            break;
          
          case 'predictions':
            result.predictionData = {
              confidenceInterval: [Math.round(result.metrics.average * 0.85), Math.round(result.metrics.average * 1.15)],
              forecastPeriod: "Next Quarter",
              predictedGrowth: Math.round(Math.random() * 25 + 10),
              riskFactor: Math.round(Math.random() * 100)
            };
            result.insights = [
              `Future growth projected at ${result.predictionData.predictedGrowth}% for next quarter`,
              'Market conditions suggest favorable environment for expansion',
              `Predicted value range: ${result.predictionData.confidenceInterval[0]}-${result.predictionData.confidenceInterval[1]}`,
              `Risk assessment score: ${result.predictionData.riskFactor}/100`
            ];
            break;
          
          case 'correlations':
            result.correlationData = {
              strongestCorrelation: (Math.round(Math.random() * 50 + 50) / 100).toFixed(2),
              factorsAnalyzed: Math.round(Math.random() * 10 + 5),
              primaryDriver: result.breakdown[Math.floor(Math.random() * Math.min(result.breakdown.length, 3))]?.category || 'Unknown'
            };
            result.insights = [
              `Strong correlation (${result.correlationData.strongestCorrelation}) found between categories`,
              `${result.correlationData.primaryDriver} is the primary driver of overall performance`,
              'Consider exploring causal relationships beyond correlation',
              `${result.correlationData.factorsAnalyzed} different factors analyzed for relationships`
            ];
            break;
          
          case 'anomalies':
            const anomalyCount = Math.floor(Math.random() * 5) + 1;
            result.anomalyData = {
              anomaliesDetected: anomalyCount,
              confidence: Math.round(Math.random() * 30 + 70),
              impactScore: Math.round(Math.random() * 100),
              detectionMethod: "Statistical outlier detection"
            };
            result.insights = [
              `${anomalyCount} anomalies detected in recent transactions`,
              `Anomaly detection confidence: ${result.anomalyData.confidence}%`,
              'Consider investigating potential data quality issues or fraud',
              `Impact score of detected anomalies: ${result.anomalyData.impactScore}/100`
            ];
            break;
        }
        
        setAnalyzedData(result);
        setIsAnalyzing(false);
        toast.success('Analysis complete!');
        
        // After successful analysis, ensure insights are visible
        // Only switch to insights view on initial analysis
        if (!analyzedData) {
          setCurrentView('insights');
        }
        
      } catch (error) {
        console.error("Error analyzing data:", error);
        toast.error('Error analyzing data. Please try again.');
        setIsAnalyzing(false);
      }
    }, 1200);
  };

  return (
    <VisualizationContext.Provider
      value={{
        activeDataset,
        datasets,
        selectedChart,
        setSelectedChart,
        loadDataset,
        importSampleData,
        currentView,
        setCurrentView,
        dateRange,
        setDateRange,
        analyzedData,
        analyzeData,
        analysisType,
        setAnalysisType,
        isAnalyzing,
        clearDatasets,
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
        setRegion
      }}
    >
      {children}
    </VisualizationContext.Provider>
  );
};

export const useVisualization = () => {
  const context = useContext(VisualizationContext);
  
  if (context === undefined) {
    throw new Error('useVisualization must be used within a VisualizationProvider');
  }
  
  return context;
};
