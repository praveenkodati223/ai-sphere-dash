import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { 
  ArrowRight, 
  BrainCircuit, 
  Loader2, 
  Sparkles, 
  LineChart, 
  BarChart, 
  PieChart, 
  Wand2,
  AlertTriangle
} from "lucide-react";
import { useVisualization } from '@/contexts/VisualizationContext';
import { generateChartFromQuery } from '@/services/openaiService';
import { prepareDataSummary } from '@/services/csvService';

const QueryInput = () => {
  const [query, setQuery] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [recentQueries, setRecentQueries] = useState<string[]>([]);
  const [showAIFeatures, setShowAIFeatures] = useState<boolean>(false);
  const [apiKeyConfigured, setApiKeyConfigured] = useState<boolean>(false);
  
  const { 
    activeDataset, 
    setSelectedChart,
    setCurrentView, 
    analyzeData,
    setCustomChartConfig
  } = useVisualization();
  
  // Check if OpenAI API key is configured
  useEffect(() => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    setApiKeyConfigured(!!apiKey);
  }, []);

  // Example queries for users to try
  const exampleQueries = [
    "Show sales trends over the last year",
    "Compare performance by region in a bar chart",
    "What were the top 3 products by revenue?",
    "Show me monthly growth rates as a line chart",
    "Create a pie chart of sales by category"
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

    // Check if OpenAI API key is configured
    if (!apiKeyConfigured) {
      toast.error("OpenAI API key is not configured");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Save query to recent queries
      setRecentQueries(prev => {
        const newQueries = [query, ...prev];
        return newQueries.slice(0, 5); // Keep only 5 most recent
      });
      
      const columns = Object.keys(activeDataset.data[0]);
      const dataSummary = prepareDataSummary(activeDataset.data, columns);
      
      toast.info("Analyzing your request...", { duration: 2000 });
      
      // Add some artificial delay to make it seem like AI is thinking
      setTimeout(async () => {
        try {
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
      }, 800);
    } catch (error) {
      console.error("Error processing query:", error);
      toast.error(`Failed to process query: ${error instanceof Error ? error.message : "Unknown error"}`);
      setIsProcessing(false);
    }
  };
  
  const handleExampleClick = (example: string) => {
    setQuery(example);
  };
  
  const handleRecentQueryClick = (recentQuery: string) => {
    setQuery(recentQuery);
    
    // Auto submit after a small delay
    setTimeout(() => {
      const formEvent = new Event('submit', { bubbles: true, cancelable: true }) as unknown as React.FormEvent;
      handleQuerySubmit(formEvent);
    }, 300);
  };
  
  const handleQuickCommand = (command: string) => {
    let newQuery = "";
    
    switch(command) {
      case 'trends':
        newQuery = `Show me trends in ${activeDataset?.name || 'the data'} over time`;
        break;
      case 'compare':
        newQuery = `Compare ${availableCategories()} in a bar chart`;
        break;
      case 'distribution':
        newQuery = `Create a pie chart showing distribution of ${activeDataset?.name || 'data'}`;
        break;
      case 'insights':
        newQuery = `Analyze this dataset and provide key insights`;
        break;
      default:
        newQuery = "Analyze this dataset";
    }
    
    setQuery(newQuery);
  };
  
  // Helper function to get categories for prompts
  const availableCategories = () => {
    if (!activeDataset?.data?.[0]) return 'categories';
    
    const categories = Object.keys(activeDataset.data[0])
      .filter(key => key !== 'q1' && key !== 'q2' && key !== 'q3' && key !== 'q4' && key !== 'category');
      
    if (categories.length > 0) return categories.join(' and ');
    return 'categories';
  };
  
  if (!activeDataset) {
    return null; // Don't render if no dataset
  }
  
  return (
    <div className="glass p-6 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <BrainCircuit className="text-sphere-cyan" />
          <span className="text-gradient">Ask</span> your data
        </h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setShowAIFeatures(!showAIFeatures)}
          className="border-sphere-cyan/30 hover:border-sphere-cyan hover:bg-sphere-cyan/10"
        >
          <Sparkles className="h-4 w-4 mr-2 text-sphere-cyan" />
          AI Tools
        </Button>
      </div>

      {!apiKeyConfigured && (
        <div className="bg-yellow-900/20 border border-yellow-600/50 p-3 rounded-lg mb-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-500">OpenAI API Key Required</h4>
              <p className="text-sm text-yellow-500/90 mb-1">
                To use the AI features, you need to add your OpenAI API key to the environment variables.
              </p>
              <ol className="list-decimal list-inside text-xs text-yellow-500/80 space-y-1">
                <li>Create a <code>.env</code> file in the root of your project</li>
                <li>Add this line: <code>VITE_OPENAI_API_KEY=your_api_key_here</code></li>
                <li>Restart the application</li>
              </ol>
            </div>
          </div>
        </div>
      )}
      
      {showAIFeatures && (
        <div className="mb-4 bg-slate-800/50 rounded-md p-3 border border-sphere-cyan/20">
          <div className="text-sm font-medium mb-2 flex items-center gap-2">
            <Wand2 className="h-4 w-4 text-sphere-cyan" />
            Quick Commands
          </div>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2 text-xs border-sphere-cyan/30"
              onClick={() => handleQuickCommand('trends')}
            >
              <LineChart className="h-3 w-3 text-sphere-cyan" /> 
              Show Trends
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2 text-xs border-sphere-cyan/30"
              onClick={() => handleQuickCommand('compare')}
            >
              <BarChart className="h-3 w-3 text-sphere-cyan" /> 
              Compare Categories
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2 text-xs border-sphere-cyan/30"
              onClick={() => handleQuickCommand('distribution')}
            >
              <PieChart className="h-3 w-3 text-sphere-cyan" /> 
              Show Distribution
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2 text-xs border-sphere-cyan/30"
              onClick={() => handleQuickCommand('insights')}
            >
              <Sparkles className="h-3 w-3 text-sphere-cyan" /> 
              Get Insights
            </Button>
          </div>
        </div>
      )}
      
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
            disabled={isProcessing || !query.trim() || !apiKeyConfigured}
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
      
      {recentQueries.length > 0 && (
        <div className="space-y-2 mb-4">
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <LineChart className="h-3 w-3" /> Recent queries:
          </p>
          <div className="flex flex-wrap gap-2">
            {recentQueries.map((recentQuery, index) => (
              <Button
                key={`recent-${index}`}
                variant="outline"
                size="sm"
                onClick={() => handleRecentQueryClick(recentQuery)}
                className="text-xs border-sphere-purple/30 hover:border-sphere-purple hover:bg-sphere-purple/10"
              >
                {recentQuery.length > 25 ? `${recentQuery.substring(0, 25)}...` : recentQuery}
              </Button>
            ))}
          </div>
        </div>
      )}
      
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Try asking:</p>
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
