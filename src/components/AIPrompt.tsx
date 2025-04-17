
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, BrainCircuit } from "lucide-react";
import { toast } from "sonner";
import { useVisualization } from '@/contexts/VisualizationContext';

// Define the visualization query parser response structure
interface QueryParserResponse {
  chart_type: string;
  x_axis: string;
  y_axis: string;
  aggregation: 'sum' | 'avg' | 'count' | 'min' | 'max';
  title: string;
}

const AIPrompt = () => {
  const [promptInput, setPromptInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { 
    activeDataset, 
    setSelectedChart, 
    setAnalysisType, 
    analyzeData, 
    setCurrentView 
  } = useVisualization();
  
  const aiSuggestions = [
    "Show me sales trends over the last 3 months",
    "Compare regional performance in a bar chart",
    "Identify top-performing products",
    "Show total sales by category"
  ];
  
  // Parse natural language query to determine visualization parameters
  const parseQuery = (query: string): QueryParserResponse => {
    // Convert to lowercase for easier pattern matching
    const lowercaseQuery = query.toLowerCase();
    
    // Default response
    let response: QueryParserResponse = {
      chart_type: "bar",
      x_axis: "Category",
      y_axis: "Value",
      aggregation: "sum",
      title: "Data Visualization"
    };
    
    // Detect chart type
    if (lowercaseQuery.includes('trend') || lowercaseQuery.includes('over time')) {
      response.chart_type = 'line';
    } else if (lowercaseQuery.includes('compare') || lowercaseQuery.includes('comparison')) {
      response.chart_type = 'bar';
    } else if (lowercaseQuery.includes('distribution') || lowercaseQuery.includes('breakdown')) {
      response.chart_type = 'pie';
    } else if (lowercaseQuery.includes('correlation') || lowercaseQuery.includes('relationship')) {
      response.chart_type = 'scatter';
    } else if (lowercaseQuery.includes('proportion') || lowercaseQuery.includes('percentage')) {
      response.chart_type = 'pie';
    }
    
    // Detect aggregation method
    if (lowercaseQuery.includes('average') || lowercaseQuery.includes('mean')) {
      response.aggregation = 'avg';
    } else if (lowercaseQuery.includes('count')) {
      response.aggregation = 'count';
    } else if (lowercaseQuery.includes('minimum') || lowercaseQuery.includes('min')) {
      response.aggregation = 'min';
    } else if (lowercaseQuery.includes('maximum') || lowercaseQuery.includes('max')) {
      response.aggregation = 'max';
    } else {
      response.aggregation = 'sum';  // Default to sum
    }
    
    // Detect axes and title based on common patterns
    if (lowercaseQuery.includes('by')) {
      const parts = lowercaseQuery.split('by');
      if (parts.length >= 2) {
        // Try to determine y-axis (what to measure)
        const measure = parts[0].trim();
        if (measure.includes('sales')) {
          response.y_axis = 'Sales';
        } else if (measure.includes('revenue')) {
          response.y_axis = 'Revenue';
        } else if (measure.includes('profit')) {
          response.y_axis = 'Profit';
        } else if (measure.includes('cost')) {
          response.y_axis = 'Cost';
        }
        
        // Try to determine x-axis (how to group)
        const dimension = parts[1].trim();
        if (dimension.includes('category') || dimension.includes('categories')) {
          response.x_axis = 'Category';
        } else if (dimension.includes('region') || dimension.includes('location')) {
          response.x_axis = 'Region';
        } else if (dimension.includes('month') || dimension.includes('time')) {
          response.x_axis = 'Month';
          response.chart_type = 'line'; // Time series are usually best as line charts
        } else if (dimension.includes('product')) {
          response.x_axis = 'Product';
        }
        
        // Generate a sensible title
        response.title = `${response.y_axis} by ${response.x_axis}`;
      }
    }
    
    console.log("Query parser output:", response);
    return response;
  };

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!activeDataset) {
      toast.error("Please import a dataset first");
      return;
    }
    
    if (!promptInput.trim()) {
      toast.error("Please enter a prompt");
      return;
    }
    
    setIsProcessing(true);
    
    // Process the query and get visualization parameters
    const queryAnalysis = parseQuery(promptInput);
    
    // Using setTimeout to simulate processing time
    setTimeout(() => {
      // Map the chart type from the query parser to our app's chart types
      switch(queryAnalysis.chart_type) {
        case 'line':
          setSelectedChart('line');
          setAnalysisType('trends');
          toast.success(`Showing ${queryAnalysis.title} as a line chart`);
          break;
        case 'bar':
          setSelectedChart('bar');
          setAnalysisType(queryAnalysis.aggregation === 'sum' ? 'trends' : 'correlations');
          toast.success(`Showing ${queryAnalysis.title} as a bar chart`);
          break;
        case 'pie':
          setSelectedChart('pie');
          setAnalysisType('trends');
          toast.success(`Showing ${queryAnalysis.title} as a pie chart`);
          break;
        case 'scatter':
          setSelectedChart('scatter');
          setAnalysisType('correlations');
          toast.success(`Showing ${queryAnalysis.title} as a scatter plot`);
          break;
        default:
          setSelectedChart('bar'); // Default to bar chart
          toast.success(`Showing ${queryAnalysis.title}`);
      }
      
      // Output the visualization configuration to console for debugging
      console.log("Visualization configuration:", {
        chart_type: queryAnalysis.chart_type,
        x_axis: queryAnalysis.x_axis,
        y_axis: queryAnalysis.y_axis,
        aggregation: queryAnalysis.aggregation,
        title: queryAnalysis.title
      });
      
      // Run analysis and show the chart
      analyzeData();
      setCurrentView('chart');
      
      setIsProcessing(false);
      setPromptInput('');
    }, 1500);
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setPromptInput(suggestion);
  };
  
  if (!activeDataset) {
    return null; // Don't render AI prompt if no dataset
  }
  
  return (
    <div className="glass p-6 rounded-lg">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <BrainCircuit className="text-sphere-cyan" />
        <span className="text-gradient">AI</span> Insights
      </h3>
      
      <form onSubmit={handlePromptSubmit} className="mb-4">
        <div className="flex gap-2">
          <Input
            placeholder="Describe the insights you want..."
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            className="flex-1"
            disabled={isProcessing}
          />
          <Button 
            type="submit" 
            disabled={isProcessing || !promptInput.trim()}
            className="bg-gradient-to-r from-sphere-purple to-sphere-cyan hover:opacity-90"
          >
            {isProcessing ? "Processing..." : <ArrowRight className="h-5 w-5" />}
          </Button>
        </div>
      </form>
      
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground mb-2">Try these examples:</p>
        <div className="flex flex-wrap gap-2">
          {aiSuggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="text-xs border-sphere-cyan/30 hover:border-sphere-cyan hover:bg-sphere-cyan/10"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIPrompt;
