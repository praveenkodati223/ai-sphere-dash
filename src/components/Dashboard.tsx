
import React, { useEffect } from 'react';
import Visualizations from './Visualizations';
import FilterPanel from './FilterPanel';
import AIPrompt from './AIPrompt';
import DataImport from './DataImport';
import { useVisualization } from '@/contexts/VisualizationContext';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from 'lucide-react';

const Dashboard = () => {
  const { activeDataset, analyzeData, isAnalyzing } = useVisualization();
  
  // Make sure we analyze data when the dashboard is loaded
  useEffect(() => {
    if (activeDataset && !isAnalyzing) {
      analyzeData();
    }
  }, [activeDataset, isAnalyzing, analyzeData]);
  
  return (
    <section id="dashboard" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Interactive <span className="text-gradient">Dashboard</span>
          </h2>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto">
            Explore your data through customizable visualizations. Use the AI assistant for instant insights, or manually configure your view with filters and chart options.
          </p>
        </div>
        
        {!activeDataset ? (
          <div className="glass p-6 rounded-lg mb-6">
            <Alert className="bg-blue-950/40 border-blue-500/30">
              <InfoIcon className="h-4 w-4 text-blue-500" />
              <AlertTitle>Getting Started</AlertTitle>
              <AlertDescription>
                Import a dataset below to start exploring your data with interactive visualizations.
              </AlertDescription>
            </Alert>
            <div className="mt-6">
              <DataImport />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <div className="space-y-6">
                <FilterPanel />
                <AIPrompt />
              </div>
            </div>
            
            <div className="lg:col-span-3">
              <div className="space-y-6">
                <Visualizations />
              </div>
            </div>
          </div>
        )}
        
        {activeDataset && (
          <div className="mt-8 text-center">
            <p className="text-green-400">Currently visualizing: {activeDataset.name}</p>
            <p className="text-xs text-slate-400 mt-1">{activeDataset.description}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Dashboard;
