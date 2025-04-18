
import React from 'react';
import { useVisualization } from '@/contexts/VisualizationContext';
import DataImport from './DataImport';
import Visualizations from './Visualizations';
import FilterPanel from './FilterPanel';
import AIPrompt from './AIPrompt';
import QueryInput from './QueryInput';

const Dashboard = () => {
  const { activeDataset } = useVisualization();
  
  return (
    <div className="min-h-screen bg-sphere-dark text-white">
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-12 gap-4 mb-4">
          <div className="col-span-12">
            <DataImport />
          </div>
        </div>
        
        {activeDataset && (
          <>
            <div className="grid grid-cols-12 gap-4 mb-4">
              <div className="col-span-12 md:col-span-7">
                <QueryInput />
              </div>
              <div className="col-span-12 md:col-span-5">
                <AIPrompt />
              </div>
            </div>
            
            <div className="grid grid-cols-12 gap-4 mb-4">
              <div className="col-span-12 md:col-span-3">
                <FilterPanel />
              </div>
              <div className="col-span-12 md:col-span-9">
                <Visualizations />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
