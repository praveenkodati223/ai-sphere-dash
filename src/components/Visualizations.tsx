
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ChartComponent from "./ChartComponent";

const Visualizations = () => {
  const [selectedChart, setSelectedChart] = useState('bar');
  const [currentView, setCurrentView] = useState('chart');
  
  const chartTypes = [
    { id: 'bar', name: 'Bar Chart' },
    { id: 'line', name: 'Line Chart' },
    { id: 'pie', name: 'Pie Chart' },
    { id: 'area', name: 'Area Chart' },
    { id: 'scatter', name: 'Scatter Plot' },
    { id: 'radar', name: 'Radar Chart' },
  ];
  
  return (
    <div className="glass rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <h3 className="text-xl font-semibold">Visualization</h3>
        
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-sphere-cyan/50 hover:border-sphere-cyan hover:bg-sphere-cyan/10">
                {chartTypes.find(c => c.id === selectedChart)?.name || 'Select Chart'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-slate-900 border border-sphere-cyan/20">
              <DropdownMenuGroup>
                {chartTypes.map((chart) => (
                  <DropdownMenuItem 
                    key={chart.id}
                    className="cursor-pointer hover:bg-sphere-cyan/10"
                    onClick={() => setSelectedChart(chart.id)}
                  >
                    {chart.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem className="cursor-pointer hover:bg-sphere-cyan/10">
                  Custom Chart Builder
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Tabs value={currentView} onValueChange={setCurrentView} className="w-[200px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="chart">Chart</TabsTrigger>
              <TabsTrigger value="data">Data</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
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
              </tr>
            </thead>
            <tbody>
              {['Electronics', 'Clothing', 'Food', 'Furniture', 'Toys', 'Books', 'Sports'].map((category, idx) => (
                <tr key={idx} className="border-b border-white/5">
                  <td className="p-2">{category}</td>
                  <td className="p-2">{Math.floor(Math.random() * 1000)}</td>
                  <td className="p-2">{Math.floor(Math.random() * 1000)}</td>
                  <td className="p-2">{Math.floor(Math.random() * 1000)}</td>
                  <td className="p-2">{Math.floor(Math.random() * 1000)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TabsContent>
    </div>
  );
};

export default Visualizations;
