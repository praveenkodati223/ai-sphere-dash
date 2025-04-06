
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Visualizations from '../components/Visualizations';
import AIPrompt from '../components/AIPrompt';
import FilterPanel from '../components/FilterPanel';
import { useVisualization } from '@/contexts/VisualizationContext';
import DataImport from '../components/DataImport';
import { PlayCircleIcon, BookOpenIcon, InfoIcon } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

const Analytics = () => {
  const location = useLocation();
  const { 
    activeDataset, 
    setAnalysisType, 
    analyzeData, 
    analysisType, 
    isAnalyzing,
    setCurrentView
  } = useVisualization();
  
  // Parse URL params to check for view parameter
  const params = new URLSearchParams(location.search);
  const viewParam = params.get('view');
  
  // Re-analyze data when analysis type changes or when data is imported (via search param refresh)
  useEffect(() => {
    if (activeDataset) {
      analyzeData();
    }
  }, [analysisType, activeDataset, location.search]);
  
  // Set current view from URL parameter if present
  useEffect(() => {
    if (viewParam === 'visualization' || viewParam === 'insights' || viewParam === 'data') {
      setCurrentView(viewParam);
    }
  }, [viewParam, setCurrentView]);
  
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
          
          {activeDataset ? (
            <>
              <Alert className="mb-6 bg-blue-950/40 border-blue-500/30">
                <InfoIcon className="h-4 w-4 text-blue-500" />
                <AlertDescription className="flex items-center justify-between">
                  <span>Working with <span className="font-semibold">{activeDataset.name}</span>. Select visualization type and explore insights.</span>
                  <div className="flex gap-2">
                    <a href="#demo-video" className="text-xs flex items-center gap-1 text-sphere-cyan hover:underline">
                      <PlayCircleIcon className="h-3 w-3" /> Watch demo
                    </a>
                    <a href="#docs" className="text-xs flex items-center gap-1 text-sphere-cyan hover:underline">
                      <BookOpenIcon className="h-3 w-3" /> View docs
                    </a>
                  </div>
                </AlertDescription>
              </Alert>
              
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
                          Identify patterns and trends in your {activeDataset.name} over time. See how key metrics 
                          have evolved and make informed decisions based on historical performance.
                        </p>
                        <Visualizations />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="predictions" className="mt-0">
                      <div className="glass p-6 mb-6">
                        <h3 className="text-xl font-semibold mb-4">Predictive Analytics</h3>
                        <p className="mb-6 text-slate-300">
                          Leverage AI to forecast future trends in {activeDataset.name} based on historical data. 
                          Our predictive models help you anticipate market changes and customer behavior.
                        </p>
                        <Visualizations />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="correlations" className="mt-0">
                      <div className="glass p-6 mb-6">
                        <h3 className="text-xl font-semibold mb-4">Correlation Analysis</h3>
                        <p className="mb-6 text-slate-300">
                          Discover relationships between different metrics in {activeDataset.name} and understand how 
                          variables influence each other. Identify key drivers of your success.
                        </p>
                        <Visualizations />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="anomalies" className="mt-0">
                      <div className="glass p-6 mb-6">
                        <h3 className="text-xl font-semibold mb-4">Anomaly Detection</h3>
                        <p className="mb-6 text-slate-300">
                          Automatically identify outliers and unusual patterns in {activeDataset.name}. 
                          Get alerted to potential issues or opportunities that require attention.
                        </p>
                        <Visualizations />
                      </div>
                    </TabsContent>
                  </div>
                </div>
              </Tabs>
              
              <div id="demo-video" className="glass p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4">How to Use Sphere Analytics</h3>
                <div className="aspect-video bg-slate-900 flex items-center justify-center rounded-lg border border-white/10 mb-4">
                  <div className="text-center">
                    <PlayCircleIcon className="h-16 w-16 mx-auto text-sphere-cyan mb-4" />
                    <p className="text-slate-300">Watch our tutorial to learn how to get the most out of Sphere Analytics</p>
                    <button className="mt-4 px-4 py-2 bg-sphere-cyan/20 border border-sphere-cyan/50 rounded-md text-sphere-cyan hover:bg-sphere-cyan/30 transition-colors">
                      Watch Tutorial
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-white/5">
                    <h4 className="font-medium mb-2">1. Import Your Data</h4>
                    <p className="text-slate-300">Upload CSV, Excel files or connect to APIs to visualize your data.</p>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-white/5">
                    <h4 className="font-medium mb-2">2. Choose Visualization</h4>
                    <p className="text-slate-300">Select from multiple chart types to best represent your data.</p>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded-lg border border-white/5">
                    <h4 className="font-medium mb-2">3. Get AI Insights</h4>
                    <p className="text-slate-300">Let our AI analyze your data and provide actionable insights.</p>
                  </div>
                </div>
              </div>
              
              <div id="docs" className="glass p-6">
                <h3 className="text-xl font-semibold mb-4">Documentation & Resources</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Getting Started</h4>
                    <ul className="list-disc pl-5 space-y-2 text-slate-300">
                      <li><a href="#" className="text-sphere-cyan hover:underline">Importing data guide</a></li>
                      <li><a href="#" className="text-sphere-cyan hover:underline">Understanding chart types</a></li>
                      <li><a href="#" className="text-sphere-cyan hover:underline">Working with filters</a></li>
                      <li><a href="#" className="text-sphere-cyan hover:underline">Exporting visualizations</a></li>
                      <li><a href="#" className="text-sphere-cyan hover:underline">AI-powered analysis</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Advanced Features</h4>
                    <ul className="list-disc pl-5 space-y-2 text-slate-300">
                      <li><a href="#" className="text-sphere-cyan hover:underline">Custom chart creation</a></li>
                      <li><a href="#" className="text-sphere-cyan hover:underline">Data transformation techniques</a></li>
                      <li><a href="#" className="text-sphere-cyan hover:underline">Working with large datasets</a></li>
                      <li><a href="#" className="text-sphere-cyan hover:underline">Collaboration features</a></li>
                      <li><a href="#" className="text-sphere-cyan hover:underline">API integration</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="glass p-6 mb-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-semibold mb-4">Import Data to Begin Visualization</h3>
                <p className="text-slate-300 max-w-2xl mx-auto">
                  To get started with analytics and visualization, please import your data using one of the methods below.
                  Once imported, you'll be able to analyze and visualize your data with our powerful tools.
                </p>
              </div>
              <DataImport />
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass p-4 text-center">
                  <h4 className="text-lg font-medium mb-2">PowerBI Alternative</h4>
                  <p className="text-sm text-slate-300 mb-4">
                    Sphere Analytics provides similar capabilities to PowerBI with an easier learning curve.
                  </p>
                  <a href="#" className="text-xs text-sphere-cyan hover:underline">Learn more</a>
                </div>
                
                <div className="glass p-4 text-center">
                  <h4 className="text-lg font-medium mb-2">AI-Powered Analysis</h4>
                  <p className="text-sm text-slate-300 mb-4">
                    Our AI automatically analyzes your data and provides insights you might have missed.
                  </p>
                  <a href="#" className="text-xs text-sphere-cyan hover:underline">Learn more</a>
                </div>
                
                <div className="glass p-4 text-center">
                  <h4 className="text-lg font-medium mb-2">Interactive Dashboards</h4>
                  <p className="text-sm text-slate-300 mb-4">
                    Create custom dashboards with drag-and-drop controls and real-time updates.
                  </p>
                  <a href="#" className="text-xs text-sphere-cyan hover:underline">Learn more</a>
                </div>
              </div>
            </div>
          )}
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
