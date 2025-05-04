import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, BrainCircuit, BarChart, LineChart, PieChart, ListFilter, AlertTriangle } from "lucide-react";
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

// Define the data insights response structure
interface DataInsightsResponse {
  summary: string;
  trends: string[];
  outliers: string[];
  topPerformers: string[];
  keyInsights: string[];
}

const AIPrompt = () => {
  const [promptInput, setPromptInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dataInsights, setDataInsights] = useState<DataInsightsResponse | null>(null);
  const [showApiKeyInfo, setShowApiKeyInfo] = useState(false);
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
    "Show total sales by category",
    "Analyze this dataset for key insights"
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

  // Generate AI insights based on the current dataset
  const generateDataInsights = () => {
    if (!activeDataset || !activeDataset.data || activeDataset.data.length === 0) {
      toast.error("No dataset available for analysis");
      return null;
    }

    setIsAnalyzing(true);
    
    // Simulate AI processing time
    setTimeout(() => {
      try {
        const data = activeDataset.data;
        
        // Calculate basic statistics
        const totalsByCategory = new Map();
        const valuesByCategory = new Map();
        const quarters = ['q1', 'q2', 'q3', 'q4'];
        
        // Collect data by category
        data.forEach(item => {
          const category = item.category;
          const total = item.value || (item.q1 + item.q2 + item.q3 + item.q4);
          
          if (!totalsByCategory.has(category)) {
            totalsByCategory.set(category, total);
            valuesByCategory.set(category, []);
          } else {
            totalsByCategory.set(category, totalsByCategory.get(category) + total);
          }
          
          valuesByCategory.get(category).push(total);
        });
        
        // Find trends across quarters
        const quarterTotals = quarters.map(q => 
          data.reduce((sum, item) => sum + (item[q as keyof typeof item] as number || 0), 0)
        );
        
        const trends = [];
        if (quarterTotals[3] > quarterTotals[0]) {
          const growth = Math.round(((quarterTotals[3] - quarterTotals[0]) / quarterTotals[0]) * 100);
          trends.push(`Overall growth of ${growth}% from Q1 to Q4`);
        } else {
          const decline = Math.round(((quarterTotals[0] - quarterTotals[3]) / quarterTotals[0]) * 100);
          trends.push(`Overall decline of ${decline}% from Q1 to Q4`);
        }
        
        // Find quarter with highest growth
        let maxGrowthQuarter = 0;
        let maxGrowth = 0;
        for (let i = 1; i < quarterTotals.length; i++) {
          const growth = quarterTotals[i] - quarterTotals[i-1];
          if (growth > maxGrowth) {
            maxGrowth = growth;
            maxGrowthQuarter = i;
          }
        }
        
        if (maxGrowth > 0) {
          trends.push(`Strongest growth observed in Q${maxGrowthQuarter+1}`);
        }
        
        // Find top performers
        const sortedCategories = Array.from(totalsByCategory.entries())
          .sort((a, b) => b[1] - a[1]);
        
        const topPerformers = sortedCategories.slice(0, 3).map(([category, total]) => 
          `${category}: ${total.toLocaleString()} (${Math.round((total / quarterTotals.reduce((a, b) => a + b, 0)) * 100)}% of total)`
        );
        
        // Find outliers
        const allValues = Array.from(valuesByCategory.values()).flat();
        const mean = allValues.reduce((sum, val) => sum + val, 0) / allValues.length;
        const stdDev = Math.sqrt(
          allValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / allValues.length
        );
        
        const outliers = [];
        valuesByCategory.forEach((values, category) => {
          values.forEach(value => {
            if (Math.abs(value - mean) > stdDev * 2) {
              outliers.push(`${category} has an outlier value of ${value.toLocaleString()}`);
            }
          });
        });
        
        // Generate key insights
        const keyInsights = [];
        
        // Check for category concentration
        if (sortedCategories[0][1] > quarterTotals.reduce((a, b) => a + b, 0) * 0.4) {
          keyInsights.push(`High concentration: ${sortedCategories[0][0]} represents over 40% of total value`);
        }
        
        // Check quarter-over-quarter growth
        const qoqGrowth = [];
        for (let i = 1; i < quarterTotals.length; i++) {
          const growth = Math.round(((quarterTotals[i] - quarterTotals[i-1]) / quarterTotals[i-1]) * 100);
          qoqGrowth.push(growth);
        }
        
        if (qoqGrowth.every(g => g > 0)) {
          keyInsights.push("Consistent growth across all quarters");
        } else if (qoqGrowth.every(g => g < 0)) {
          keyInsights.push("Consistent decline across all quarters - requires attention");
        }
        
        // Check for regional patterns if region data exists
        const regions = Array.from(new Set(data.filter(item => item.region).map(item => item.region)));
        if (regions.length > 0) {
          const regionTotals = new Map();
          
          data.forEach(item => {
            if (!item.region) return;
            
            const total = item.value || (item.q1 + item.q2 + item.q3 + item.q4);
            if (!regionTotals.has(item.region)) {
              regionTotals.set(item.region, total);
            } else {
              regionTotals.set(item.region, regionTotals.get(item.region) + total);
            }
          });
          
          const topRegion = Array.from(regionTotals.entries())
            .sort((a, b) => b[1] - a[1])[0];
            
          keyInsights.push(`${topRegion[0]} is the top-performing region`);
        }

        const insights: DataInsightsResponse = {
          summary: `Analysis of ${activeDataset.name} - ${data.length} data points across ${totalsByCategory.size} categories`,
          trends: trends.slice(0, 3),
          outliers: outliers.slice(0, 3),
          topPerformers: topPerformers,
          keyInsights: keyInsights
        };
        
        setDataInsights(insights);
        setIsAnalyzing(false);
        toast.success("Analysis complete!");

      } catch (error) {
        console.error("Error analyzing data:", error);
        toast.error("Error generating insights. Please try again.");
        setIsAnalyzing(false);
      }
    }, 1500);
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
    
    // Check if OpenAI API key is configured
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
      toast.error("OpenAI API key is not configured");
      setShowApiKeyInfo(true);
      return;
    }
    
    setIsProcessing(true);
    setDataInsights(null);
    
    // Check if the prompt is asking for data insights/analysis
    if (
      promptInput.toLowerCase().includes('analyze') || 
      promptInput.toLowerCase().includes('insights') ||
      promptInput.toLowerCase().includes('summarize') ||
      promptInput.toLowerCase().includes('overview')
    ) {
      // Handle the data insights request
      setTimeout(() => {
        generateDataInsights();
        setCurrentView('insights');
        setIsProcessing(false);
        setPromptInput('');
      }, 1000);
      return;
    }
    
    // Process the query as a visualization request
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
  
  const handleRunInsightsAnalysis = () => {
    setPromptInput("Analyze this dataset for key insights");
    
    setTimeout(() => {
      handlePromptSubmit({
        preventDefault: () => {}
      } as React.FormEvent);
    }, 100);
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
      
      {showApiKeyInfo && (
        <div className="bg-yellow-900/20 border border-yellow-600/50 p-3 rounded-lg mb-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-500">OpenAI API Key Required</h4>
              <p className="text-sm text-yellow-500/90 mb-2">
                To use the AI features, you need to add your OpenAI API key to the environment variables.
              </p>
              <ol className="list-decimal list-inside text-xs text-yellow-500/80 space-y-1">
                <li>Create a <code>.env</code> file in the root of your project</li>
                <li>Add this line: <code>VITE_OPENAI_API_KEY=your_api_key_here</code></li>
                <li>Restart the application</li>
              </ol>
              <Button 
                className="mt-2 bg-yellow-600/50 hover:bg-yellow-600 text-xs"
                onClick={() => setShowApiKeyInfo(false)}
                size="sm"
              >
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handlePromptSubmit} className="mb-4">
        <div className="flex gap-2">
          <Input
            placeholder="Describe the insights you want..."
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            className="flex-1"
            disabled={isProcessing || isAnalyzing}
          />
          <Button 
            type="submit" 
            disabled={isProcessing || isAnalyzing || !promptInput.trim()}
            className="bg-gradient-to-r from-sphere-purple to-sphere-cyan hover:opacity-90"
          >
            {isProcessing || isAnalyzing ? "Processing..." : <ArrowRight className="h-5 w-5" />}
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
      
      {dataInsights && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-sphere-cyan">Dataset Analysis</h4>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={handleRunInsightsAnalysis}
            >
              Refresh Analysis
            </Button>
          </div>
          
          <div className="text-sm">
            <p className="mb-2">{dataInsights.summary}</p>
            
            {dataInsights.trends.length > 0 && (
              <div className="mb-2">
                <span className="font-semibold flex items-center gap-1">
                  <LineChart className="h-3 w-3" /> Trends:
                </span>
                <ul className="list-disc pl-5 mt-1">
                  {dataInsights.trends.map((trend, i) => (
                    <li key={i}>{trend}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {dataInsights.topPerformers.length > 0 && (
              <div className="mb-2">
                <span className="font-semibold flex items-center gap-1">
                  <BarChart className="h-3 w-3" /> Top Performers:
                </span>
                <ul className="list-disc pl-5 mt-1">
                  {dataInsights.topPerformers.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {dataInsights.outliers.length > 0 && (
              <div className="mb-2">
                <span className="font-semibold flex items-center gap-1">
                  <ListFilter className="h-3 w-3" /> Outliers:
                </span>
                <ul className="list-disc pl-5 mt-1">
                  {dataInsights.outliers.map((outlier, i) => (
                    <li key={i}>{outlier}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {dataInsights.keyInsights.length > 0 && (
              <div>
                <span className="font-semibold flex items-center gap-1">
                  <PieChart className="h-3 w-3" /> Key Insights:
                </span>
                <ul className="list-disc pl-5 mt-1">
                  {dataInsights.keyInsights.map((insight, i) => (
                    <li key={i}>{insight}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIPrompt;
