
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
      // Extract unique categories
      const categories = Array.from(new Set(activeDataset.data.map(item => item.category)));
      setAvailableCategories(categories);
      
      // Extract unique regions
      const regions = Array.from(new Set(activeDataset.data
        .filter(item => item.region)
        .map(item => item.region as string)
      ));
      setAvailableRegions(regions);
      
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
      // Analysis will be triggered by the useEffect
      setCurrentView('chart');
    }
  };

  const analyzeData = () => {
    if (!activeDataset) return;
    
    setIsAnalyzing(true);
    
    // Simulate analysis process
    setTimeout(() => {
      // Generate dummy analysis based on current dataset and analysis type
      const result = {
        summary: `Analysis of ${activeDataset.name} - ${analysisType}`,
        metrics: {
          total: activeDataset.data.reduce((sum, item) => sum + item.value!, 0),
          average: Math.round(activeDataset.data.reduce((sum, item) => sum + item.value!, 0) / activeDataset.data.length),
          max: Math.max(...activeDataset.data.map(item => item.value!)),
          min: Math.min(...activeDataset.data.map(item => item.value!))
        },
        breakdown: activeDataset.data.map(item => ({
          category: item.category,
          value: item.value,
          percentage: Math.round((item.value! / activeDataset.data.reduce((sum, i) => sum + i.value!, 0)) * 100)
        })).sort((a, b) => b.value! - a.value!),
        insights: [
          `${activeDataset.data[0].category} shows the highest performance with ${activeDataset.data[0].value} units`,
          `${analysisType === 'trends' ? 'Strong upward trend detected in recent data' : 
            analysisType === 'predictions' ? 'Future growth projected at 15-20%' :
            analysisType === 'correlations' ? 'Strong correlation between categories detected' :
            'Several anomalies detected in recent transactions'}`,
          `Consider exploring ${analysisType === 'trends' ? 'seasonal patterns' : 
            analysisType === 'predictions' ? 'future market conditions' :
            analysisType === 'correlations' ? 'causal relationships' :
            'potential fraud indicators'} in the data`
        ]
      };
      
      setAnalyzedData(result);
      setIsAnalyzing(false);
      toast.success('Analysis complete!');
    }, 800);
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
