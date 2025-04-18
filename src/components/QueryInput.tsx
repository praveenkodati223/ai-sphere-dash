
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowRight, BrainCircuit, Loader2 } from "lucide-react";
import { useVisualization } from '@/contexts/VisualizationContext';
import { generateChartFromQuery } from '@/services/openaiService';
import { prepareDataSummary } from '@/services/csvService';

const QueryInput = () => {
  const [query, setQuery] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  const { 
    activeDataset, 
    setSelectedChart,
    setCurrentView, 
    analyzeData,
    setCustomChartConfig
  } = useVisualization();
  
  // Example queries for users to try
  const exampleQueries = [
    "Show sales trends over the last year",
    "Compare performance by region",
    "What were the top products by revenue?",
    "Show me monthly growth rates",
    "Compare performance across quarters"
  ];
  
  const handleQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!activeDataset?.data || activeDataset.data.length === 0) {
      toast.error("Please import a dataset first");
      return;
    }
    
    if (!query.trim()) {
      toast.error("Please enter a question");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const columns = Object.keys(activeDataset.data[0]);
      const dataSummary = prepareDataSummary(activeDataset.data, columns);
      
      const chartConfig = await generateChartFromQuery(query, dataSummary);
      
      if (chartConfig) {
        // Map the chart type from OpenAI to our app's chart types
        switch(chartConfig.chartType.toLowerCase()) {
          case 'line':
            setSelectedChart('line');
            break;
          case 'bar':
            setSelectedChart('bar');
            break;
          case 'pie':
          case 'donut':
            setSelectedChart('pie');
            break;
          case 'scatter':
            setSelectedChart('scatter');
            break;
          case 'area':
            setSelectedChart('area');
            break;
          default:
            setSelectedChart('bar'); // Default to bar chart
        }
        
        // Apply the custom chart configuration
        setCustomChartConfig(chartConfig);
        
        // Run analysis and show the chart
        setCurrentView('chart');
        analyzeData();
        
        toast.success(`Generated "${chartConfig.title}" visualization`);
      }
    } catch (error) {
      console.error("Error generating chart:", error);
      toast.error(`Failed to process query: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleExampleClick = (example: string) => {
    setQuery(example);
  };
  
  if (!activeDataset) {
    return null; // Don't render if no dataset
  }
  
  return (
    <div className="glass p-6 rounded-lg">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <BrainCircuit className="text-sphere-cyan" />
        <span className="text-gradient">Ask</span> your data
      </h3>
      
      <form onSubmit={handleQuerySubmit} className="mb-4">
        <div className="flex gap-2">
          <Input
            placeholder="Ask a question about your data..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1"
            disabled={isProcessing}
          />
          <Button 
            type="submit" 
            disabled={isProcessing || !query.trim()}
            className="bg-gradient-to-r from-sphere-purple to-sphere-cyan hover:opacity-90"
          >
            {isProcessing ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <ArrowRight className="h-5 w-5" />
            )}
          </Button>
        </div>
      </form>
      
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground mb-2">Try asking:</p>
        <div className="flex flex-wrap gap-2">
          {exampleQueries.map((example, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="text-xs border-sphere-cyan/30 hover:border-sphere-cyan hover:bg-sphere-cyan/10"
              onClick={() => handleExampleClick(example)}
            >
              {example}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QueryInput;
