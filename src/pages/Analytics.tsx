
import React from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import Dashboard from '@/components/Dashboard';
import { useVisualization } from '@/contexts/VisualizationContext';

const Analytics = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-slate-400">Explore your data with AI-powered visualizations</p>
        </div>
        
        <Tabs defaultValue="dashboard" className="space-y-4">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-4">
            <Dashboard />
          </TabsContent>
          
          <TabsContent value="reports" className="space-y-4">
            <ReportsContent />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const ReportsContent = () => {
  const { setCurrentView } = useVisualization();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle>Saved Reports</CardTitle>
          <CardDescription>Access your previously generated reports</CardDescription>
        </CardHeader>
        <CardContent>
          <p>No saved reports yet. Generate and save reports from your data visualizations.</p>
        </CardContent>
        <CardFooter>
          <Button 
            variant="outline" 
            onClick={() => setCurrentView('chart')}
            className="border-sphere-cyan/50 hover:border-sphere-cyan hover:bg-sphere-cyan/10"
          >
            Create Report
          </Button>
        </CardFooter>
      </Card>
      
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle>Scheduled Reports</CardTitle>
          <CardDescription>Reports that run on a schedule</CardDescription>
        </CardHeader>
        <CardContent>
          <p>No scheduled reports configured. Set up automated reporting for your dashboards.</p>
        </CardContent>
        <CardFooter>
          <Button 
            variant="outline" 
            className="border-sphere-cyan/50 hover:border-sphere-cyan hover:bg-sphere-cyan/10"
          >
            Configure Schedule
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Analytics;
