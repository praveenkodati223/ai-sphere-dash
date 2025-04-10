import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DataSet, sampleDatasets, generateSampleData, generateCustomData } from '@/services/dataService';
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
  importCustomData: (name: string, description: string) => void;
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
  const clearDatasets = useCallback(() => {
    setDatasets([]);
    setActiveDataset(null);
    setAnalyzedData(null);
    setAvailableCategories([]);
    setAvailableRegions([]);
  }, []);

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
      
      // Reset filters
      setCategory('all');
      setRegion('all');
      
      // Calculate min and max values from dataset
      const values = activeDataset.data.map(item => item.value || 
        (item.q1 + item.q2 + item.q3 + item.q4));
      
      const min = Math.floor(Math.min(...values));
      const max = Math.ceil(Math.max(...values));
      
      setMinValue(min.toString());
      setMaxValue(max.toString());
      
      // Auto analyze when dataset changes
      analyzeData();
    }
  }, [activeDataset]);

  const loadDataset = useCallback((datasetId: string) => {
    const dataset = datasets.find(d => d.id === datasetId);
    if (dataset) {
      setActiveDataset(dataset);
      toast.success(`Loaded dataset: ${dataset.name}`);
      // Analysis will be triggered by the useEffect
    } else {
      toast.error('Dataset not found');
    }
  }, [datasets]);

  const importSampleData = useCallback((datasetId: string, name?: string, description?: string) => {
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
  }, []);

  const importCustomData = useCallback((name: string, description: string) => {
    // Create a custom dataset with unique categories and regions
    const customData = generateCustomData(name);
    
    const newDataset: DataSet = {
      id: `custom-${Date.now()}`,
      name: name,
      description: description,
      data: customData,
      lastUpdated: new Date()
    };
    
    // Add to datasets
    setDatasets(prev => [...prev, newDataset]);
    
    // Set as active dataset
    setActiveDataset(newDataset);
    
    // Make sure we reset the analysis data
    setAnalyzedData(null);
    
    console.log("Custom dataset imported and activated:", newDataset);
    return true;
  }, []);

  const analyzeData = useCallback(() => {
    if (!activeDataset) {
      toast.error('No dataset available for analysis');
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
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
          // Create basic metrics common to all analysis types
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
          
          // Generate different insights and data based on analysis type
          switch(analysisType) {
            case 'trends':
              // For trends analysis, focus on growth rates and patterns
              const trendGrowthRate = Math.round((Math.random() * 20) + 5);
              let trendCategories = [...filteredData].sort((a, b) => 
                (b.q4 - b.q1) - (a.q4 - a.q1)
              );
              
              let topGrowthCategory = trendCategories[0]?.category || 'Main category';
              let bottomGrowthCategory = trendCategories[trendCategories.length - 1]?.category || 'Last category';
              
              result.trendData = {
                growthRate: trendGrowthRate,
                seasonality: Math.random() > 0.5 ? "Strong" : "Moderate",
                forecast: trendGrowthRate > 15 ? "Strongly Upward" : "Moderately Upward",
                topCategory: topGrowthCategory,
                bottomCategory: bottomGrowthCategory
              };
              result.insights = [
                `${topGrowthCategory} shows the highest upward trend with ${trendGrowthRate}% growth`,
                `Strong upward trend detected in recent data periods`,
                `${bottomGrowthCategory} shows the lowest growth trend`,
                `Month-over-month growth is ${trendGrowthRate > 15 ? 'accelerating' : 'steady'}`
              ];
              break;
            
            case 'predictions':
              // For predictions, focus on future forecasts and confidence intervals
              const predictedGrowth = Math.round(Math.random() * 25 + 10);
              const confidenceLow = Math.round(result.metrics.average * 0.85);
              const confidenceHigh = Math.round(result.metrics.average * 1.15);
              
              result.predictionData = {
                confidenceInterval: [confidenceLow, confidenceHigh],
                forecastPeriod: "Next Quarter",
                predictedGrowth: predictedGrowth,
                riskFactor: Math.round(Math.random() * 100),
                marketConditions: predictedGrowth > 20 ? "Highly Favorable" : "Favorable",
                predictedValues: {
                  nextMonth: Math.round(result.metrics.average * (1 + (predictedGrowth/100))),
                  nextQuarter: Math.round(result.metrics.average * (1 + (predictedGrowth/100) * 3)),
                  nextYear: Math.round(result.metrics.average * (1 + (predictedGrowth/100) * 12))
                }
              };
              result.insights = [
                `Future growth projected at ${result.predictionData.predictedGrowth}% for next quarter`,
                `Market conditions suggest ${result.predictionData.marketConditions} environment for expansion`,
                `Predicted value range: ${result.predictionData.confidenceInterval[0].toLocaleString()}-${result.predictionData.confidenceInterval[1].toLocaleString()}`,
                `Risk assessment score: ${result.predictionData.riskFactor}/100`,
                `Next month's predicted value: ${result.predictionData.predictedValues.nextMonth.toLocaleString()}`
              ];
              break;
            
            case 'correlations':
              // For correlations, focus on relationships between variables
              const correlation = (Math.round(Math.random() * 50 + 50) / 100).toFixed(2);
              const factorsAnalyzed = Math.round(Math.random() * 10 + 5);
              const topCategory = result.breakdown[0]?.category || 'Unknown';
              
              // Create correlation pairs
              const correlationPairs = [];
              for (let i = 0; i < Math.min(filteredData.length - 1, 5); i++) {
                if (filteredData[i] && filteredData[i+1]) {
                  const corrValue = (Math.round(Math.random() * 80 + 20) / 100).toFixed(2);
                  correlationPairs.push({
                    pair: `${filteredData[i].category} - ${filteredData[i+1].category}`,
                    value: corrValue,
                    strength: Number(corrValue) > 0.7 ? "Strong" : "Moderate"
                  });
                }
              }
              
              result.correlationData = {
                strongestCorrelation: correlation,
                factorsAnalyzed: factorsAnalyzed,
                primaryDriver: topCategory,
                secondaryFactors: filteredData.length > 1 ? 
                  filteredData.slice(1, 3).map(item => item.category) : 
                  ['Market conditions', 'Seasonal factors'],
                correlationPairs: correlationPairs
              };
              result.insights = [
                `Strong correlation (${result.correlationData.strongestCorrelation}) found between categories`,
                `${result.correlationData.primaryDriver} is the primary driver of overall performance`,
                `${correlationPairs[0]?.pair} shows ${correlationPairs[0]?.strength} correlation of ${correlationPairs[0]?.value}`,
                `${result.correlationData.factorsAnalyzed} different factors analyzed for relationships`
              ];
              break;
            
            case 'anomalies':
              // For anomalies, focus on outliers and unusual patterns
              const anomalyCount = Math.floor(Math.random() * 3) + 1;
              const confidence = Math.round(Math.random() * 30 + 70);
              const impactScore = Math.round(Math.random() * 100);
              
              // Find actual outliers in the data
              const values = filteredData.map(item => item.value || (item.q1 + item.q2 + item.q3 + item.q4));
              const avg = values.reduce((a, b) => a + b, 0) / values.length;
              const stdDev = Math.sqrt(values.map(x => Math.pow(x - avg, 2)).reduce((a, b) => a + b, 0) / values.length);
              
              // Items that are more than 2 standard deviations from the mean
              const outliers = filteredData.filter(item => {
                const val = item.value || (item.q1 + item.q2 + item.q3 + item.q4);
                return Math.abs(val - avg) > (stdDev * 2);
              }).map(item => item.category);
              
              const affectedCategories = outliers.length > 0 ? outliers : 
                filteredData.slice(0, anomalyCount).map(item => item.category);
              
              result.anomalyData = {
                anomaliesDetected: outliers.length || anomalyCount,
                confidence: confidence,
                impactScore: impactScore,
                detectionMethod: "Statistical outlier detection",
                affectedCategories: affectedCategories,
                deviation: Math.round(stdDev),
                threshold: Math.round(avg + (stdDev * 2))
              };
              result.insights = [
                `${result.anomalyData.anomaliesDetected} anomalies detected in ${result.anomalyData.affectedCategories.join(", ")}`,
                `Anomaly detection confidence: ${result.anomalyData.confidence}%`,
                `Values exceeding ${result.anomalyData.threshold.toLocaleString()} are considered outliers`,
                `Impact score of detected anomalies: ${result.anomalyData.impactScore}/100`,
                `Standard deviation in dataset: ${result.anomalyData.deviation.toLocaleString()}`
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
    } catch (error) {
      console.error("Error during filter application:", error);
      toast.error("Error applying filters. Please try again.");
      setIsAnalyzing(false);
    }
  }, [activeDataset, analysisType, category, region, minValue, maxValue, analyzedData, setCurrentView]);

  return (
    <VisualizationContext.Provider
      value={{
        activeDataset,
        datasets,
        selectedChart,
        setSelectedChart,
        loadDataset,
        importSampleData,
        importCustomData,
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
