
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
    
    // Simulate analysis process
    setTimeout(() => {
      try {
        // Generate analysis based on current dataset and analysis type
        const result = {
          summary: `Analysis of ${activeDataset.name} - ${analysisType}`,
          metrics: {
            total: activeDataset.data.reduce((sum, item) => sum + (item.value || 
              (item.q1 + item.q2 + item.q3 + item.q4)), 0),
            average: Math.round(activeDataset.data.reduce((sum, item) => sum + (item.value || 
              (item.q1 + item.q2 + item.q3 + item.q4)), 0) / activeDataset.data.length),
            max: Math.max(...activeDataset.data.map(item => item.value || 
              (item.q1 + item.q2 + item.q3 + item.q4))),
            min: Math.min(...activeDataset.data.map(item => item.value || 
              (item.q1 + item.q2 + item.q3 + item.q4)))
          },
          breakdown: activeDataset.data.map(item => ({
            category: item.category,
            value: item.value || (item.q1 + item.q2 + item.q3 + item.q4),
            percentage: Math.round(((item.value || (item.q1 + item.q2 + item.q3 + item.q4)) / 
              activeDataset.data.reduce((sum, i) => sum + (i.value || (i.q1 + i.q2 + i.q3 + i.q4)), 0)) * 100)
          })).sort((a, b) => b.value - a.value),
          insights: generateInsights(activeDataset, analysisType)
        };
        
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
  
  // Helper function to generate insights based on the dataset and analysis type
  const generateInsights = (dataset: DataSet, type: string) => {
    const insights = [];
    
    // Sort data by value to find top performers
    const sortedData = [...dataset.data].sort((a, b) => 
      (b.value || (b.q1 + b.q2 + b.q3 + b.q4)) - 
      (a.value || (a.q1 + a.q2 + a.q3 + a.q4))
    );
    
    const topCategory = sortedData[0]?.category || 'Unknown';
    const topValue = sortedData[0]?.value || (sortedData[0]?.q1 + sortedData[0]?.q2 + 
      sortedData[0]?.q3 + sortedData[0]?.q4) || 0;
    
    insights.push(`${topCategory} shows the highest performance with ${topValue.toLocaleString()} units`);
    
    // Add insight based on analysis type
    switch (type) {
      case 'trends':
        insights.push('Strong upward trend detected in recent data');
        insights.push('Consider exploring seasonal patterns in the data');
        break;
      case 'predictions':
        insights.push('Future growth projected at 15-20%');
        insights.push('Consider exploring future market conditions');
        break;
      case 'correlations':
        insights.push('Strong correlation detected between categories');
        insights.push('Consider exploring causal relationships in the data');
        break;
      case 'anomalies':
        insights.push('Several anomalies detected in recent transactions');
        insights.push('Consider exploring potential fraud indicators');
        break;
    }
    
    return insights;
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
        availableRegions
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
