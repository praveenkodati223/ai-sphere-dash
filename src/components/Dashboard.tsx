
import React, { useState } from 'react';
import { useVisualization } from '@/contexts/VisualizationContext';
import DataImport from './DataImport';
import Visualizations from './Visualizations';
import FilterPanel from './FilterPanel';
import AIPrompt from './AIPrompt';
import QueryInput from './QueryInput';
import DataPreview from './DataPreview';
import SmartInsights from './SmartInsights';
import MLInsights from './MLInsights';
import DatasetComparison from './DatasetComparison';
import HelpAssistant from './HelpAssistant';
import GoalTracker from './GoalTracker';
import EnhancedFilterPanel from './EnhancedFilterPanel';
import DashboardManager from './DashboardManager';
import ThemeSwitcher from './ThemeSwitcher';
import VoiceInput from './VoiceInput';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, ChartBar, MessageSquare, Download, Share2, Sparkles, LineChart, BarChart3, PieChart, Activity, Info, Target, GitCompare, HelpCircle, TrendingUp, Settings, Mic, Palette } from 'lucide-react';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription } from '@/components/ui/card';

const Dashboard = () => {
  const { activeDataset, exportData, selectedChart, setSelectedChart, analyzeData, setCurrentView } = useVisualization();
  const [activeTab, setActiveTab] = useState<string>('visualize');
  const [voiceEnabled, setVoiceEnabled] = useState(false);
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

  // Voice command handler
  const handleVoiceCommand = (command: string) => {
    switch (command) {
      case 'bar_chart':
        setSelectedChart('bar');
        setActiveTab('visualize');
        toast.success('Switched to bar chart');
        break;
      case 'line_chart':
        setSelectedChart('line');
        setActiveTab('visualize');
        toast.success('Switched to line chart');
        break;
      case 'pie_chart':
        setSelectedChart('pie');
        setActiveTab('visualize');
        toast.success('Switched to pie chart');
        break;
      case 'show_data':
        setActiveTab('data');
        toast.success('Showing data view');
        break;
      case 'clear_filters':
        // This would trigger filter clearing
        toast.success('Filters cleared');
        break;
      case 'export_data':
        handleExport();
        break;
      case 'compare_datasets':
        setActiveTab('compare');
        toast.success('Switched to dataset comparison');
        break;
      case 'save_dashboard':
        setActiveTab('manage');
        toast.success('Opened dashboard manager');
        break;
      case 'start_analysis':
        analyzeData();
        toast.success('Starting data analysis');
        break;
      case 'show_chart':
        setCurrentView('chart');
        setActiveTab('visualize');
        break;
      case 'dark_mode':
        document.documentElement.classList.add('dark');
        toast.success('Switched to dark mode');
        break;
      case 'light_mode':
        document.documentElement.classList.remove('dark');
        toast.success('Switched to light mode');
        break;
      default:
        toast.info(`Voice command "${command}" not recognized`);
    }
  };

  const handleVoiceTranscript = (transcript: string) => {
    // You could integrate this with the QueryInput component
    console.log('Voice transcript:', transcript);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#121624] to-slate-900 text-white">
      <div className="container mx-auto py-8 px-4">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
            SphereAI Dashboard 2.0
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Next-generation data visualization with AI-powered insights, voice commands, and advanced analytics
          </p>
        </div>
        
        {/* Features Overview */}
        {!activeDataset && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-slate-800/50 border-cyan-500/20 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <CardContent className="p-6">
                <div className="mb-4 p-3 bg-cyan-500/20 rounded-full w-fit">
                  <Mic className="h-6 w-6 text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Voice Commands</h3>
                <CardDescription className="text-gray-300">
                  Control your dashboard hands-free with natural voice commands and speech recognition.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-purple-500/20 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <CardContent className="p-6">
                <div className="mb-4 p-3 bg-purple-500/20 rounded-full w-fit">
                  <Palette className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Custom Themes</h3>
                <CardDescription className="text-gray-300">
                  Personalize your experience with custom color schemes and light/dark mode options.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 border-blue-500/20 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <CardContent className="p-6">
                <div className="mb-4 p-3 bg-blue-500/20 rounded-full w-fit">
                  <TrendingUp className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Predictive Analytics</h3>
                <CardDescription className="text-gray-300">
                  Machine learning-powered trend predictions and anomaly detection for your data.
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
                {activeDataset && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setVoiceEnabled(!voiceEnabled)}
                    className={`border-purple-500/30 ${voiceEnabled ? 'bg-purple-500/20' : ''}`}
                  >
                    <Mic className="h-4 w-4 mr-2" />
                    Voice {voiceEnabled ? 'On' : 'Off'}
                  </Button>
                )}
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
            {/* Smart Insights and Voice Input */}
            <div className="grid grid-cols-12 gap-6 mt-6">
              <div className="col-span-12 md:col-span-8">
                <SmartInsights />
              </div>
              <div className="col-span-12 md:col-span-4">
                {voiceEnabled ? (
                  <VoiceInput 
                    onTranscript={handleVoiceTranscript}
                    onCommand={handleVoiceCommand}
                  />
                ) : (
                  <HelpAssistant />
                )}
              </div>
            </div>
            
            {/* Query and Tools Section */}
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
                <TabsList className="grid w-full max-w-4xl grid-cols-7 bg-slate-800/50 p-1">
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
                    value="filters"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white"
                  >
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4" /> 
                      <span>Filters</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="compare"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white"
                  >
                    <div className="flex items-center gap-2">
                      <GitCompare className="h-4 w-4" /> 
                      <span>Compare</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="goals"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white"
                  >
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4" /> 
                      <span>Goals</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="manage"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white"
                  >
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4" /> 
                      <span>Manage</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="insights"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white"
                  >
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" /> 
                      <span>ML</span>
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

              <TabsContent value="filters" className="mt-0">
                <EnhancedFilterPanel />
              </TabsContent>
              
              <TabsContent value="compare" className="mt-0">
                <DatasetComparison />
              </TabsContent>
              
              <TabsContent value="goals" className="mt-0">
                <GoalTracker />
              </TabsContent>

              <TabsContent value="manage" className="mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <DashboardManager />
                  <ThemeSwitcher />
                </div>
              </TabsContent>
              
              <TabsContent value="insights" className="mt-0">
                <MLInsights />
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
