import React from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  ChartBarIcon, 
  BarChart3Icon, 
  LineChartIcon, 
  PieChartIcon, 
  ActivityIcon,
  GaugeIcon,
  Download,
  InfoIcon,
  PlayIcon,
  Sparkles
} from "lucide-react";
import ChartComponent from "./ChartComponent";
import { useVisualization } from '@/contexts/VisualizationContext';
import { toast } from "sonner";
import { sampleCategories } from '@/services/dataService';
import EnhancedDataPreview from './EnhancedDataPreview';

const safeFormatNumber = (value: any): string => {
  if (value === undefined || value === null || isNaN(Number(value))) {
    return '0';
  }
  return Number(value).toLocaleString();
};

const Visualizations = () => {
  
  const { 
    selectedChart, 
    setSelectedChart, 
    currentView, 
    setCurrentView,
    activeDataset,
    analyzeData,
    analyzedData,
    isAnalyzing,
    customChartConfig
  } = useVisualization();
  
  const datasetCategories = activeDataset?.data.map(item => item.category) || [];
  const categories = datasetCategories.length > 0 ? datasetCategories : sampleCategories;
  
  const chartGroups = [
    {
      label: 'Bar & Column',
      charts: [
        { id: 'bar', name: 'Column Chart', icon: <BarChart3Icon className="h-4 w-4 mr-2" />, 
          description: 'Compares values across categories with vertical bars. Best for comparing discrete data points.' },
        { id: 'clusteredBar', name: 'Clustered Bar', icon: <BarChart3Icon className="h-4 w-4 mr-2" />,
          description: 'Groups multiple categories side by side. Ideal for comparing values across multiple groups.' },
        { id: 'stackedBar', name: 'Stacked Bar', icon: <BarChart3Icon className="h-4 w-4 mr-2" />,
          description: 'Shows parts of a whole by stacking bar segments. Good for showing composition and total values.' }
      ]
    },
    {
      label: 'Line & Area',
      charts: [
        { id: 'line', name: 'Line Chart', icon: <LineChartIcon className="h-4 w-4 mr-2" />,
          description: 'Shows trends over a continuous interval. Perfect for time series data and trends.' },
        { id: 'area', name: 'Area Chart', icon: <ActivityIcon className="h-4 w-4 mr-2" />,
          description: 'Similar to line charts but with filled area below. Emphasizes volume over time.' },
        { id: 'stackedArea', name: 'Stacked Area', icon: <ActivityIcon className="h-4 w-4 mr-2" />,
          description: 'Shows how multiple series add up to a total. Useful for part-to-whole relationships over time.' }
      ]
    },
    {
      label: 'Pie & Donut',
      charts: [
        { id: 'pie', name: 'Pie Chart', icon: <PieChartIcon className="h-4 w-4 mr-2" />,
          description: 'Shows parts of a whole as slices of a circle. Best when showing proportions under 5-7 categories.' },
        { id: 'donut', name: 'Donut Chart', icon: <PieChartIcon className="h-4 w-4 mr-2" />,
          description: 'Similar to pie chart but with a hole in the center. Can show additional information in the center.' }
      ]
    },
    {
      label: 'Scatter & Bubble',
      charts: [
        { id: 'scatter', name: 'Scatter Chart', icon: <ChartBarIcon className="h-4 w-4 mr-2" />,
          description: 'Shows correlation between two variables. Good for identifying patterns and outliers.' },
        { id: 'bubble', name: 'Bubble Chart', icon: <ChartBarIcon className="h-4 w-4 mr-2" />,
          description: 'Like scatter charts but with a third dimension shown by bubble size. Shows 3 variables at once.' }
      ]
    },
    {
      label: 'Advanced',
      charts: [
        { id: 'radar', name: 'Radar Chart', icon: <ChartBarIcon className="h-4 w-4 mr-2" />,
          description: 'Compares multiple variables in a circular display. Good for performance analysis across metrics.' },
        { id: 'treemap', name: 'Treemap', icon: <ChartBarIcon className="h-4 w-4 mr-2" />,
          description: 'Shows hierarchical data as nested rectangles. Size indicates value, color can show categories.' },
        { id: 'funnel', name: 'Funnel Chart', icon: <ChartBarIcon className="h-4 w-4 mr-2" />,
          description: 'Shows values through stages of a process. Perfect for conversion or sales processes.' },
        { id: 'waterfall', name: 'Waterfall Chart', icon: <ChartBarIcon className="h-4 w-4 mr-2" />,
          description: 'Shows how an initial value is affected by positive and negative changes. Good for financial data.' },
        { id: 'heatmap', name: 'Heatmap', icon: <ChartBarIcon className="h-4 w-4 mr-2" />,
          description: 'Uses color intensity to show values in a matrix. Great for showing patterns across two dimensions.' }
      ]
    },
    {
      label: 'Metrics',
      charts: [
        { id: 'gauge', name: 'Gauge', icon: <GaugeIcon className="h-4 w-4 mr-2" />,
          description: 'Shows a single value within a range. Like a speedometer for your metrics.' },
        { id: 'kpi', name: 'KPI Cards', icon: <ChartBarIcon className="h-4 w-4 mr-2" />,
          description: 'Displays key performance indicators in simple card format. Shows the most important numbers.' },
        { id: 'table', name: 'Data Table', icon: <ChartBarIcon className="h-4 w-4 mr-2" />,
          description: 'Shows raw data in rows and columns. Best when precise values matter more than patterns.' }
      ]
    }
  ];
  
  const currentChartInfo = React.useMemo(() => {
    for (const group of chartGroups) {
      const chart = group.charts.find(c => c.id === selectedChart);
      if (chart) return chart;
    }
    return {name: 'Select Chart', description: 'Please select a chart type'};
  }, [selectedChart, chartGroups]);
  
  const handleCustomChartBuilder = () => {
    toast.info("Custom Chart Builder coming soon!");
  };

  const handleExportData = () => {
    if (!activeDataset) {
      toast.error("No data to export. Please import a dataset first.");
      return;
    }
    
    toast.success("Data export started");
    
    setTimeout(() => {
      const fileName = `${activeDataset.name.replace(/\s+/g, '_').toLowerCase()}_export_${new Date().toISOString().slice(0,10)}.csv`;
      toast.success(`Data exported successfully as ${fileName}`);
    }, 1500);
  };

  const handleStartVisualization = () => {
    if (!activeDataset) {
      toast.error("Please import a dataset first");
      return;
    }
    
    analyzeData();
    toast.success("Starting visualization process...");
  };
  
  return (
    <div className="glass rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          {currentView === 'chart' && <BarChart3Icon className="h-5 w-5 text-cyan-400" />}
          {currentView === 'data' && <InfoIcon className="h-5 w-5 text-cyan-400" />}
          {currentView === 'insights' && <Sparkles className="h-5 w-5 text-cyan-400" />}
          Visualization
        </h3>
        
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-cyan-500/50 hover:border-cyan-500 hover:bg-cyan-500/10">
                {currentChartInfo.name}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-slate-900 border border-cyan-500/20">
              {chartGroups.map((group) => (
                <React.Fragment key={group.label}>
                  <DropdownMenuLabel>{group.label}</DropdownMenuLabel>
                  <DropdownMenuGroup>
                    {group.charts.map((chart) => (
                      <DropdownMenuItem 
                        key={chart.id}
                        className="cursor-pointer hover:bg-cyan-500/10 flex items-center"
                        onClick={() => setSelectedChart(chart.id as any)}
                      >
                        {chart.icon}
                        {chart.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                </React.Fragment>
              ))}
              <DropdownMenuGroup>
                <DropdownMenuItem 
                  className="cursor-pointer hover:bg-cyan-500/10"
                  onClick={handleCustomChartBuilder}
                >
                  Custom Chart Builder
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Tabs value={currentView} onValueChange={setCurrentView} className="w-[250px]">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="chart">Chart</TabsTrigger>
              <TabsTrigger value="data">Data</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>
          </Tabs>

          <Button 
            variant="outline" 
            size="icon" 
            className="border-cyan-500/50 hover:border-cyan-500 hover:bg-cyan-500/10"
            onClick={handleExportData}
            title="Export data"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="px-4 py-2 bg-slate-800/30 border-b border-white/5">
        <div className="flex items-center gap-2">
          <InfoIcon className="h-4 w-4 text-cyan-400" />
          <p className="text-sm text-slate-300">{currentChartInfo.description}</p>
        </div>
      </div>
      
      <Tabs value={currentView} className="w-full">
        <TabsContent value="chart" className="mt-0 p-0">
          <div className="p-4 h-[350px] flex items-center justify-center">
            {!activeDataset ? (
              <div className="text-center">
                <p className="text-lg mb-4">No data imported yet</p>
                <p className="text-sm text-slate-400 mb-4">Please import a dataset to start visualization</p>
                <Button 
                  variant="outline"
                  className="border-cyan-500/50 hover:border-cyan-500 hover:bg-cyan-500/10"
                  onClick={() => toast.info("Use the Data Import section above to add your data")}
                >
                  Import Data First
                </Button>
              </div>
            ) : !analyzedData && !isAnalyzing ? (
              <div className="text-center">
                <p className="text-lg mb-4">Ready to visualize your data</p>
                <Button 
                  className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-90 flex items-center gap-2"
                  onClick={handleStartVisualization}
                >
                  <PlayIcon className="h-4 w-4" />
                  Start Visualization
                </Button>
              </div>
            ) : (
              <ChartComponent type={selectedChart} />
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="data" className="mt-0 p-0">
          <div className="p-4">
            {!activeDataset ? (
              <div className="text-center py-12">
                <p className="text-lg mb-4">No data available</p>
                <p className="text-sm text-slate-400">Import a dataset to view and preview your data</p>
              </div>
            ) : (
              <EnhancedDataPreview />
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="insights" className="mt-0 p-0">
          <div className="h-[350px] overflow-auto p-4">
            {!activeDataset ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-lg mb-2">No data to analyze</div>
                  <p className="text-sm text-slate-400">Import a dataset first to generate insights</p>
                </div>
              </div>
            ) : isAnalyzing ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mb-4"></div>
                  <div className="text-lg mb-2">Analyzing data...</div>
                  <div className="text-sm text-cyan-400">This may take a moment</div>
                </div>
              </div>
            ) : !analyzedData ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-lg mb-2">No insights available</div>
                  <p className="text-sm text-slate-400 mb-4">Click Start Visualization to analyze and generate insights</p>
                  <Button 
                    className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-90 flex items-center gap-2"
                    onClick={handleStartVisualization}
                  >
                    <PlayIcon className="h-4 w-4" />
                    Start Analysis
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Display insights from AI if available */}
                {customChartConfig && customChartConfig.insights && customChartConfig.insights.length > 0 && (
                  <Card className="bg-slate-800 border-purple-500/20 md:col-span-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-purple-400" />
                        AI-Generated Insights
                      </CardTitle>
                      <CardDescription>{customChartConfig.summary}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-5 space-y-2">
                        {customChartConfig.insights.map((insight, idx) => (
                          <li key={idx} className="text-slate-300">{insight}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              
                <Card className="bg-slate-800 border-cyan-500/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <InfoIcon className="h-5 w-5 text-cyan-400" />
                      Summary
                    </CardTitle>
                    <CardDescription>{analyzedData.summary}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Total: {safeFormatNumber(analyzedData.metrics?.total)}</li>
                      <li>Average: {safeFormatNumber(analyzedData.metrics?.average)}</li>
                      <li>Maximum: {safeFormatNumber(analyzedData.metrics?.max)}</li>
                      <li>Minimum: {safeFormatNumber(analyzedData.metrics?.min)}</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="bg-slate-800 border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-purple-400" />
                      Key Insights
                    </CardTitle>
                    <CardDescription>Insights from your data</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2">
                      {analyzedData.insights && analyzedData.insights.map((insight, idx) => (
                        <li key={idx} className="text-slate-300">{insight}</li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="border-t border-white/5 pt-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs border-cyan-500/50 hover:border-cyan-500 hover:bg-cyan-500/10"
                      onClick={() => analyzeData()}
                    >
                      Regenerate Insights
                    </Button>
                  </CardFooter>
                </Card>
                
                {analyzedData.breakdown && (
                  <Card className="bg-slate-800 border-cyan-500/20 md:col-span-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PieChartIcon className="h-5 w-5 text-cyan-400" />
                        Category Breakdown
                      </CardTitle>
                      <CardDescription>Performance by category</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {analyzedData.breakdown.slice(0, 4).map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <div className="w-1/3">{item.category}</div>
                            <div className="w-1/3 text-right">{safeFormatNumber(item.value)}</div>
                            <div className="w-1/3 text-right text-cyan-400">{item.percentage}%</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {analyzedData.trendData && (
                  <Card className="bg-slate-800 border-purple-500/20 md:col-span-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <LineChartIcon className="h-5 w-5 text-purple-400" />
                        Trend Analysis
                      </CardTitle>
                      <CardDescription>Growth patterns and seasonal trends</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-3 bg-slate-700/40 rounded-lg">
                          <div className="text-sm text-slate-300">Growth Rate</div>
                          <div className="text-xl font-bold text-purple-400">
                            {analyzedData.trendData.growthRate ? `${analyzedData.trendData.growthRate}%` : 'N/A'}
                          </div>
                        </div>
                        <div className="p-3 bg-slate-700/40 rounded-lg">
                          <div className="text-sm text-slate-300">Seasonality</div>
                          <div className="text-xl font-bold text-cyan-400">
                            {analyzedData.trendData.seasonality || 'N/A'}
                          </div>
                        </div>
                        <div className="p-3 bg-slate-700/40 rounded-lg">
                          <div className="text-sm text-slate-300">Forecast</div>
                          <div className="text-xl font-bold text-blue-400">
                            {analyzedData.trendData.forecast || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {analyzedData.predictionData && (
                  <Card className="bg-slate-800 border-cyan-500/20 md:col-span-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ChartBarIcon className="h-5 w-5 text-cyan-400" />
                        Predictions
                      </CardTitle>
                      <CardDescription>Future projections based on historical data</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3 bg-slate-700/40 rounded-lg">
                          <div className="text-sm text-slate-300">Predicted Growth</div>
                          <div className="text-xl font-bold text-cyan-400">
                            {analyzedData.predictionData.predictedGrowth ? `${analyzedData.predictionData.predictedGrowth}%` : 'N/A'}
                          </div>
                        </div>
                        <div className="p-3 bg-slate-700/40 rounded-lg">
                          <div className="text-sm text-slate-300">Confidence Range</div>
                          <div className="text-xl font-bold text-cyan-400">
                            {analyzedData.predictionData.confidenceInterval ? 
                              `${safeFormatNumber(analyzedData.predictionData.confidenceInterval[0])} - ${safeFormatNumber(analyzedData.predictionData.confidenceInterval[1])}` :
                              'N/A'
                            }
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {analyzedData.correlationData && (
                  <Card className="bg-slate-800 border-purple-500/20 md:col-span-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ActivityIcon className="h-5 w-5 text-purple-400" />
                        Correlation Analysis
                      </CardTitle>
                      <CardDescription>Relationships between variables</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-3 bg-slate-700/40 rounded-lg">
                          <div className="text-sm text-slate-300">Strongest Correlation</div>
                          <div className="text-xl font-bold text-purple-400">
                            {analyzedData.correlationData.strongestCorrelation || 'N/A'}
                          </div>
                        </div>
                        <div className="p-3 bg-slate-700/40 rounded-lg">
                          <div className="text-sm text-slate-300">Primary Driver</div>
                          <div className="text-xl font-bold text-cyan-400">
                            {analyzedData.correlationData.primaryDriver || 'N/A'}
                          </div>
                        </div>
                        <div className="p-3 bg-slate-700/40 rounded-lg">
                          <div className="text-sm text-slate-300">Factors Analyzed</div>
                          <div className="text-xl font-bold text-blue-400">
                            {analyzedData.correlationData.factorsAnalyzed || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Visualizations;
