
import React from 'react';
import DataImport from './DataImport';
import QueryInput from './QueryInput';
import Visualizations from './Visualizations';
import DatasetComparison from './DatasetComparison';
import EnhancedFilterPanel from './EnhancedFilterPanel';
import AIAssistant from './AIAssistant';

const Dashboard = () => {
  
  return (
    <div className="min-h-screen text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="mb-4">
          <h2 className="text-2xl font-bold">Data Visualization Dashboard</h2>
          <p className="text-slate-400">Explore, analyze, and visualize your data with ease</p>
          <QueryInput />
        </div>
        
        {/* Single column layout - everything centered */}
        <div className="space-y-6">
          <DataImport />
          <AIAssistant />
          <EnhancedFilterPanel />
          <Visualizations />
          <DatasetComparison />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
