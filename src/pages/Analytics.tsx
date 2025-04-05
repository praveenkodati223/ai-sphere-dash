
import React from 'react';
import Header from '../components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Visualizations from '../components/Visualizations';
import AIPrompt from '../components/AIPrompt';
import FilterPanel from '../components/FilterPanel';
import { useVisualization } from '@/contexts/VisualizationContext';

const Analytics = () => {
  const [analysisType, setAnalysisType] = React.useState('trends');
  const { activeDataset } = useVisualization();
  
  return (
    <div className="min-h-screen bg-sphere-dark">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Advanced Analytics</h1>
            <p className="text-slate-300">
              Explore your data with in-depth analysis tools and AI-powered insights
              {activeDataset && <span> · Currently analyzing: <span className="text-sphere-cyan">{activeDataset.name}</span></span>}
            </p>
          </div>
          
          <Tabs defaultValue={analysisType} onValueChange={setAnalysisType} className="w-full mb-8">
            <TabsList className="grid grid-cols-4 mb-8 w-full max-w-2xl">
              <TabsTrigger value="trends">Trends Analysis</TabsTrigger>
              <TabsTrigger value="predictions">Predictions</TabsTrigger>
              <TabsTrigger value="correlations">Correlations</TabsTrigger>
              <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
            </TabsList>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1">
                <div className="space-y-6">
                  <FilterPanel />
                  <AIPrompt />
                </div>
              </div>
              
              <div className="lg:col-span-3">
                <TabsContent value="trends" className="mt-0">
                  <div className="glass p-6 mb-6">
                    <h3 className="text-xl font-semibold mb-4">Trends Analysis</h3>
                    <p className="mb-6 text-slate-300">
                      Identify patterns and trends in your data over time. See how key metrics 
                      have evolved and make informed decisions based on historical performance.
                    </p>
                    <Visualizations />
                  </div>
                </TabsContent>
                
                <TabsContent value="predictions" className="mt-0">
                  <div className="glass p-6 mb-6">
                    <h3 className="text-xl font-semibold mb-4">Predictive Analytics</h3>
                    <p className="mb-6 text-slate-300">
                      Leverage AI to forecast future trends based on historical data. 
                      Our predictive models help you anticipate market changes and customer behavior.
                    </p>
                    <Visualizations />
                  </div>
                </TabsContent>
                
                <TabsContent value="correlations" className="mt-0">
                  <div className="glass p-6 mb-6">
                    <h3 className="text-xl font-semibold mb-4">Correlation Analysis</h3>
                    <p className="mb-6 text-slate-300">
                      Discover relationships between different metrics and understand how 
                      variables influence each other. Identify key drivers of your success.
                    </p>
                    <Visualizations />
                  </div>
                </TabsContent>
                
                <TabsContent value="anomalies" className="mt-0">
                  <div className="glass p-6 mb-6">
                    <h3 className="text-xl font-semibold mb-4">Anomaly Detection</h3>
                    <p className="mb-6 text-slate-300">
                      Automatically identify outliers and unusual patterns in your data. 
                      Get alerted to potential issues or opportunities that require attention.
                    </p>
                    <Visualizations />
                  </div>
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </div>
      </main>
      
      <footer className="py-6 border-t border-white/10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} Sphere AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Analytics;
