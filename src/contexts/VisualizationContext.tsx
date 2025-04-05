
import React, { createContext, useContext, useState } from 'react';
import { DataSet, sampleDatasets, generateSampleData } from '@/services/dataService';
import { toast } from "sonner";

interface VisualizationContextType {
  activeDataset: DataSet | null;
  datasets: DataSet[];
  selectedChart: string;
  setSelectedChart: (chart: string) => void;
  loadDataset: (datasetId: string) => void;
  importSampleData: (datasetId: string) => void;
  currentView: string;
  setCurrentView: (view: string) => void;
  dateRange: [number, number];
  setDateRange: (range: [number, number]) => void;
}

const VisualizationContext = createContext<VisualizationContextType | undefined>(undefined);

export const VisualizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [datasets, setDatasets] = useState<DataSet[]>(sampleDatasets);
  const [activeDataset, setActiveDataset] = useState<DataSet | null>(null);
  const [selectedChart, setSelectedChart] = useState('bar');
  const [currentView, setCurrentView] = useState('chart');
  const [dateRange, setDateRange] = useState<[number, number]>([30, 90]);

  const loadDataset = (datasetId: string) => {
    const dataset = datasets.find(d => d.id === datasetId);
    if (dataset) {
      setActiveDataset(dataset);
      toast.success(`Loaded dataset: ${dataset.name}`);
    } else {
      toast.error('Dataset not found');
    }
  };

  const importSampleData = (datasetId: string) => {
    const dataset = sampleDatasets.find(d => d.id === datasetId);
    if (dataset) {
      // Create a fresh copy with new random data
      const newDataset = {
        ...dataset,
        data: generateSampleData()
      };
      
      setActiveDataset(newDataset);
      
      // Also add to datasets if not already there
      if (!datasets.some(d => d.id === datasetId)) {
        setDatasets(prev => [...prev, newDataset]);
      }
      
      toast.success(`Imported: ${dataset.name}`);
    }
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
