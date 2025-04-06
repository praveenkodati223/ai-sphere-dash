
import React, { useEffect } from 'react';
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
  Download
} from "lucide-react";
import ChartComponent from "./ChartComponent";
import { useVisualization } from '@/contexts/VisualizationContext';
import { toast } from "sonner";
import { sampleCategories } from '@/services/dataService';

const Visualizations = () => {
  const { 
    selectedChart, 
    setSelectedChart, 
    currentView, 
    setCurrentView,
    activeDataset,
    analyzeData,
    analyzedData,
    isAnalyzing
  } = useVisualization();
  
  useEffect(() => {
    // Trigger analysis when component mounts or activeDataset changes
    if (activeDataset && !analyzedData) {
      analyzeData();
    }
  }, [activeDataset, analyzedData]);
  
  // Create a fallback for sample data in case sampleCategories is not available
  const fallbackCategories = ['Electronics', 'Clothing', 'Food', 'Furniture', 'Toys', 'Books', 'Sports'];
  const categories = sampleCategories || fallbackCategories;
  
  const chartGroups = [
    {
      label: 'Bar & Column',
      charts: [
        { id: 'bar', name: 'Column Chart', icon: <BarChart3Icon className="h-4 w-4 mr-2" /> },
        { id: 'clusteredBar', name: 'Clustered Bar', icon: <BarChart3Icon className="h-4 w-4 mr-2" /> },
        { id: 'stackedBar', name: 'Stacked Bar', icon: <BarChart3Icon className="h-4 w-4 mr-2" /> }
      ]
    },
    {
      label: 'Line & Area',
      charts: [
        { id: 'line', name: 'Line Chart', icon: <LineChartIcon className="h-4 w-4 mr-2" /> },
        { id: 'area', name: 'Area Chart', icon: <ActivityIcon className="h-4 w-4 mr-2" /> },
        { id: 'stackedArea', name: 'Stacked Area', icon: <ActivityIcon className="h-4 w-4 mr-2" /> }
      ]
    },
    {
      label: 'Pie & Donut',
      charts: [
        { id: 'pie', name: 'Pie Chart', icon: <PieChartIcon className="h-4 w-4 mr-2" /> },
        { id: 'donut', name: 'Donut Chart', icon: <PieChartIcon className="h-4 w-4 mr-2" /> }
      ]
    },
    {
      label: 'Scatter & Bubble',
      charts: [
        { id: 'scatter', name: 'Scatter Chart', icon: <ChartBarIcon className="h-4 w-4 mr-2" /> },
        { id: 'bubble', name: 'Bubble Chart', icon: <ChartBarIcon className="h-4 w-4 mr-2" /> },
      ]
    },
    {
      label: 'Advanced',
      charts: [
        { id: 'radar', name: 'Radar Chart', icon: <ChartBarIcon className="h-4 w-4 mr-2" /> },
        { id: 'treemap', name: 'Treemap', icon: <ChartBarIcon className="h-4 w-4 mr-2" /> },
        { id: 'funnel', name: 'Funnel Chart', icon: <ChartBarIcon className="h-4 w-4 mr-2" /> },
        { id: 'waterfall', name: 'Waterfall Chart', icon: <ChartBarIcon className="h-4 w-4 mr-2" /> },
        { id: 'heatmap', name: 'Heatmap', icon: <ChartBarIcon className="h-4 w-4 mr-2" /> }
      ]
    },
    {
      label: 'Metrics',
      charts: [
        { id: 'gauge', name: 'Gauge', icon: <GaugeIcon className="h-4 w-4 mr-2" /> },
        { id: 'kpi', name: 'KPI Cards', icon: <ChartBarIcon className="h-4 w-4 mr-2" /> },
        { id: 'table', name: 'Data Table', icon: <ChartBarIcon className="h-4 w-4 mr-2" /> }
      ]
    }
  ];
  
  const currentChartName = React.useMemo(() => {
    for (const group of chartGroups) {
      const chart = group.charts.find(c => c.id === selectedChart);
      if (chart) return chart.name;
    }
    return 'Select Chart';
  }, [selectedChart, chartGroups]);
  
  const handleCustomChartBuilder = () => {
    toast.info("Custom Chart Builder coming soon!");
  };

  const handleExportData = () => {
    toast.success("Data export started");
    setTimeout(() => {
      toast.success("Data exported successfully");
    }, 1500);
  };
  
  return (
    <div className="glass rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <h3 className="text-xl font-semibold">Visualization</h3>
        
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-sphere-cyan/50 hover:border-sphere-cyan hover:bg-sphere-cyan/10">
                {currentChartName}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-slate-900 border border-sphere-cyan/20">
              {chartGroups.map((group) => (
                <React.Fragment key={group.label}>
                  <DropdownMenuLabel>{group.label}</DropdownMenuLabel>
                  <DropdownMenuGroup>
                    {group.charts.map((chart) => (
                      <DropdownMenuItem 
                        key={chart.id}
                        className="cursor-pointer hover:bg-sphere-cyan/10 flex items-center"
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
                  className="cursor-pointer hover:bg-sphere-cyan/10"
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
            className="border-sphere-cyan/50 hover:border-sphere-cyan hover:bg-sphere-cyan/10"
            onClick={handleExportData}
            title="Export data"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Tabs value={currentView} className="w-full">
        <TabsContent value="chart" className="mt-0 p-0">
          <div className="p-4 h-[350px] flex items-center justify-center">
            <ChartComponent type={selectedChart} />
          </div>
        </TabsContent>
        
        <TabsContent value="data" className="mt-0 p-0">
          <div className="h-[350px] overflow-auto px-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-2">Category</th>
                  <th className="text-left p-2">Q1</th>
                  <th className="text-left p-2">Q2</th>
                  <th className="text-left p-2">Q3</th>
                  <th className="text-left p-2">Q4</th>
                  <th className="text-left p-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {activeDataset ? (
                  activeDataset.data.map((item, idx) => {
                    const total = item.q1 + item.q2 + item.q3 + item.q4;
                    return (
                      <tr key={idx} className="border-b border-white/5">
                        <td className="p-2">{item.category}</td>
                        <td className="p-2">{item.q1.toLocaleString()}</td>
                        <td className="p-2">{item.q2.toLocaleString()}</td>
                        <td className="p-2">{item.q3.toLocaleString()}</td>
                        <td className="p-2">{item.q4.toLocaleString()}</td>
                        <td className="p-2 font-bold">{total.toLocaleString()}</td>
                      </tr>
                    );
                  })
                ) : (
                  categories.map((category, idx) => (
                    <tr key={idx} className="border-b border-white/5">
                      <td className="p-2">{category}</td>
                      <td className="p-2">{Math.floor(Math.random() * 1000)}</td>
                      <td className="p-2">{Math.floor(Math.random() * 1000)}</td>
                      <td className="p-2">{Math.floor(Math.random() * 1000)}</td>
                      <td className="p-2">{Math.floor(Math.random() * 1000)}</td>
                      <td className="p-2">-</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>
        
        <TabsContent value="insights" className="mt-0 p-0">
          <div className="h-[350px] overflow-auto p-4">
            {isAnalyzing ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-lg mb-2">Analyzing data...</div>
                  <div className="animate-pulse text-sphere-cyan">This may take a moment</div>
                </div>
              </div>
            ) : analyzedData ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-slate-800 border-sphere-cyan/20">
                  <CardHeader>
                    <CardTitle>Summary</CardTitle>
                    <CardDescription>{analyzedData.summary}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Total: {analyzedData.metrics.total.toLocaleString()}</li>
                      <li>Average: {analyzedData.metrics.average.toLocaleString()}</li>
                      <li>Max: {analyzedData.metrics.max.toLocaleString()}</li>
                      <li>Min: {analyzedData.metrics.min.toLocaleString()}</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="bg-slate-800 border-sphere-cyan/20">
                  <CardHeader>
                    <CardTitle>Key Insights</CardTitle>
                    <CardDescription>AI-generated insights from your data</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2">
                      {analyzedData.insights.map((insight, idx) => (
                        <li key={idx}>{insight}</li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="border-t border-white/5 pt-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs border-sphere-cyan/50 hover:border-sphere-cyan hover:bg-sphere-cyan/10"
                      onClick={() => analyzeData()}
                    >
                      Regenerate Insights
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="bg-slate-800 border-sphere-cyan/20 md:col-span-2">
                  <CardHeader>
                    <CardTitle>Category Breakdown</CardTitle>
                    <CardDescription>Performance by category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {analyzedData.breakdown.slice(0, 4).map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <div className="w-1/3">{item.category}</div>
                          <div className="w-1/3 text-right">{item.value.toLocaleString()}</div>
                          <div className="w-1/3 text-right text-sphere-cyan">{item.percentage}%</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-lg mb-2">No data analysis available</div>
                  <Button 
                    onClick={() => analyzeData()} 
                    className="bg-sphere-cyan hover:bg-sphere-cyan/80"
                  >
                    Analyze Data
                  </Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Visualizations;
