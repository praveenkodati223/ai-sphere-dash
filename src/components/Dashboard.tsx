
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
import { Database, ChartBar, Filter, MessageSquare, Download, Share2 } from 'lucide-react';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';

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
    <div className="min-h-screen bg-sphere-dark text-white">
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-12 gap-4 mb-4">
          <div className="col-span-12">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Data Visualization</h2>
              {activeDataset && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleExport}
                    className="border-sphere-cyan/30 hover:border-sphere-cyan hover:bg-sphere-cyan/10"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleShare}
                    className="border-sphere-cyan/30 hover:border-sphere-cyan hover:bg-sphere-cyan/10"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
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
            <div className="grid grid-cols-12 gap-4 mb-4">
              <div className="col-span-12 md:col-span-7">
                <QueryInput />
              </div>
              <div className="col-span-12 md:col-span-5">
                <AIPrompt />
              </div>
            </div>
            
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mb-4">
              <div className="flex justify-center">
                <TabsList className="grid w-full max-w-md grid-cols-3">
                  <TabsTrigger value="data" className="flex items-center gap-1">
                    <Database className="h-4 w-4" /> Data
                  </TabsTrigger>
                  <TabsTrigger value="visualize" className="flex items-center gap-1">
                    <ChartBar className="h-4 w-4" /> Visualize
                  </TabsTrigger>
                  <TabsTrigger value="insights" className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" /> Insights
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="data" className="mt-4">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 md:col-span-3">
                    <FilterPanel />
                  </div>
                  <div className="col-span-12 md:col-span-9">
                    <div className="glass p-6 rounded-lg">
                      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Database className="text-sphere-cyan" />
                        Data Preview & Selection
                      </h3>
                      <DataPreview />
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="visualize" className="mt-4">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 md:col-span-3">
                    <FilterPanel />
                  </div>
                  <div className="col-span-12 md:col-span-9">
                    <Visualizations />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="insights" className="mt-4">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12">
                    <div className="glass p-6 rounded-lg">
                      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <MessageSquare className="text-sphere-cyan" />
                        AI Insights
                      </h3>
                      <p className="mb-4 text-slate-300">
                        Ask the AI to analyze your data and provide insights, or use the query input to generate visualizations.
                      </p>
                      <div className="flex flex-col gap-4 items-center mb-4">
                        <Button 
                          onClick={() => setActiveTab('visualize')}
                          className="bg-gradient-to-r from-sphere-purple to-sphere-cyan hover:opacity-90"
                        >
                          Generate AI-Powered Visualizations
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => navigate('/analytics')}
                          className="border-sphere-cyan/30 hover:border-sphere-cyan hover:bg-sphere-cyan/10"
                        >
                          View Detailed Analytics
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
