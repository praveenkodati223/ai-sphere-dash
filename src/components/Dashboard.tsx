
import React, { useState } from 'react';
import { useVisualization } from '@/contexts/VisualizationContext';
import DataImport from './DataImport';
import Visualizations from './Visualizations';
import FilterPanel from './FilterPanel';
import AIPrompt from './AIPrompt';
import QueryInput from './QueryInput';
import DataPreview from './DataPreview';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, ChartBar, MessageSquare, Download, Share2, Sparkles, LineChart, BarChart3, PieChart, Activity, Info } from 'lucide-react';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription } from '@/components/ui/card';

const Dashboard = () => {
  const { activeDataset, exportData } = useVisualization();
  const [activeTab, setActiveTab] = useState<string>('visualize');
  const navigate = useNavigate();
  
  const handleExport = () => {
    if (!activeDataset) {
      toast.error("Please import data first");
      return;
    }
    
    exportData();
    toast.success("Data exported successfully");
  };
  
  const handleShare = () => {
    if (!activeDataset) {
      toast.error("Please import data first");
      return;
    }
    
    // Generate shareable link
    const shareableLink = window.location.origin + '/shared/' + btoa(JSON.stringify({ datasetId: activeDataset.id }));
    navigator.clipboard.writeText(shareableLink);
    toast.success("Shareable link copied to clipboard");
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#121624] to-slate-900 text-white">
      <div className="container mx-auto py-8 px-4">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
            Data Visualization Platform
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Transform your raw data into meaningful insights with AI-powered visualizations
          </p>
        </div>
        
        {/* Features Overview */}
        {!activeDataset && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-slate-800/50 border-cyan-500/20 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <CardContent className="p-6">
                <div className="mb-4 p-3 bg-cyan-500/20 rounded-full w-fit">
                  <LineChart className="h-6 w-6 text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Advanced Visualizations</h3>
                <CardDescription className="text-gray-300">
                  Create stunning charts and graphs with just a few clicks. Choose from bar, line, pie charts and more.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-purple-500/20 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <CardContent className="p-6">
                <div className="mb-4 p-3 bg-purple-500/20 rounded-full w-fit">
                  <Sparkles className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">AI-Powered Insights</h3>
                <CardDescription className="text-gray-300">
                  Get automatic analysis and key insights from your data using our built-in AI capabilities.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-blue-500/20 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <CardContent className="p-6">
                <div className="mb-4 p-3 bg-blue-500/20 rounded-full w-fit">
                  <Database className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Easy Data Import</h3>
                <CardDescription className="text-gray-300">
                  Import data from CSV files or connect directly to external APIs with our simple interface.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Data Import Section */}
          <div className="col-span-12">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-4">
                <Database className="h-5 w-5 text-cyan-400" />
                <h2 className="text-2xl font-bold">Data Workbench</h2>
                {activeDataset && <FilterPanel />}
              </div>
              {activeDataset && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleExport}
                    className="border-cyan-500/30 hover:border-cyan-500 hover:bg-cyan-500/10 flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleShare}
                    className="border-cyan-500/30 hover:border-cyan-500 hover:bg-cyan-500/10 flex items-center gap-2"
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </div>
              )}
            </div>
            <DataImport />
          </div>
        </div>
        
        {activeDataset && (
          <>
            {/* Query and AI Section */}
            <div className="grid grid-cols-12 gap-6 mt-6">
              <div className="col-span-12 md:col-span-7">
                <Card className="bg-slate-800/50 border-purple-500/20 overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-3">
                      <Info className="h-5 w-5 text-purple-400 mr-2" />
                      <h3 className="text-lg font-semibold">Query Your Data</h3>
                    </div>
                    <QueryInput />
                  </CardContent>
                </Card>
              </div>
              <div className="col-span-12 md:col-span-5">
                <Card className="bg-slate-800/50 border-cyan-500/20 overflow-hidden h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-3">
                      <Sparkles className="h-5 w-5 text-cyan-400 mr-2" />
                      <h3 className="text-lg font-semibold">AI Assistant</h3>
                    </div>
                    <AIPrompt />
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {/* Tabs Navigation */}
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mt-6">
              <div className="flex justify-center mb-6">
                <TabsList className="grid w-full max-w-md grid-cols-3 bg-slate-800/50 p-1">
                  <TabsTrigger 
                    value="data" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white"
                  >
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4" /> 
                      <span>Data</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="visualize"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white"
                  >
                    <div className="flex items-center gap-2">
                      <ChartBar className="h-4 w-4" /> 
                      <span>Visualize</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="insights"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white"
                  >
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" /> 
                      <span>Insights</span>
                    </div>
                  </TabsTrigger>
                </TabsList>
              </div>
              
              {/* Tab Content */}
              <TabsContent value="data" className="mt-0">
                <Card className="bg-slate-800/50 border-cyan-500/20">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Database className="text-cyan-400" />
                      Data Preview & Selection
                    </h3>
                    <DataPreview />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="visualize" className="mt-0">
                <Card className="bg-slate-800/50 border-cyan-500/20">
                  <CardContent className="p-2">
                    <Visualizations />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="insights" className="mt-0">
                <Card className="bg-slate-800/50 border-cyan-500/20">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <MessageSquare className="text-cyan-400" />
                      AI Insights
                    </h3>
                    <p className="mb-6 text-slate-300">
                      Discover hidden patterns and valuable insights in your data through advanced AI analysis.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <Card className="bg-slate-800/80 border-purple-500/10 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <BarChart3 className="h-5 w-5 text-purple-400" />
                          <h4 className="font-medium">Data Patterns</h4>
                        </div>
                        <p className="text-sm text-slate-300">
                          Identify trends, seasonality, and cycles in your time-series data
                        </p>
                      </Card>
                      <Card className="bg-slate-800/80 border-cyan-500/10 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Activity className="h-5 w-5 text-cyan-400" />
                          <h4 className="font-medium">Correlations</h4>
                        </div>
                        <p className="text-sm text-slate-300">
                          Discover relationships between different variables in your dataset
                        </p>
                      </Card>
                      <Card className="bg-slate-800/80 border-blue-500/10 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <PieChart className="h-5 w-5 text-blue-400" />
                          <h4 className="font-medium">Anomalies</h4>
                        </div>
                        <p className="text-sm text-slate-300">
                          Detect outliers and unusual patterns that require attention
                        </p>
                      </Card>
                    </div>
                    
                    <div className="flex flex-col gap-4 items-center mb-4">
                      <Button 
                        onClick={() => setActiveTab('visualize')}
                        className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-90 px-6"
                      >
                        Generate AI-Powered Visualizations
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => navigate('/analytics')}
                        className="border-cyan-500/30 hover:border-cyan-500 hover:bg-cyan-500/10"
                      >
                        View Detailed Analytics
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
