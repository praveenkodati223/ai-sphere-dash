
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, BrainCircuit } from "lucide-react";
import { toast } from "sonner";
import { useVisualization } from '@/contexts/VisualizationContext';

const AIPrompt = () => {
  const [promptInput, setPromptInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { activeDataset, setSelectedChart, setAnalysisType, analyzeData, setCurrentView } = useVisualization();
  
  const aiSuggestions = [
    "Show me sales trends over the last 3 months",
    "Compare regional performance in a bar chart",
    "Identify top-performing products",
    "Find any anomalies in the data"
  ];
  
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
    
    // Process the AI query based on content
    setTimeout(() => {
      const lowercasePrompt = promptInput.toLowerCase();
      
      // Simple pattern matching to determine what the user wants
      if (lowercasePrompt.includes('trend') || lowercasePrompt.includes('over time')) {
        setSelectedChart('line');
        setAnalysisType('trends');
        toast.success("Showing trend analysis in line chart");
      } 
      else if (lowercasePrompt.includes('compare') || lowercasePrompt.includes('comparison')) {
        setSelectedChart('bar');
        toast.success("Showing comparison in bar chart");
      }
      else if (lowercasePrompt.includes('region') || lowercasePrompt.includes('geographical')) {
        setSelectedChart('pie');
        toast.success("Showing regional breakdown in pie chart");
      }
      else if (lowercasePrompt.includes('anomaly') || lowercasePrompt.includes('unusual')) {
        setSelectedChart('scatter');
        setAnalysisType('anomalies');
        toast.success("Running anomaly detection");
      }
      else if (lowercasePrompt.includes('predict') || lowercasePrompt.includes('forecast')) {
        setSelectedChart('area');
        setAnalysisType('predictions');
        toast.success("Showing predictions with area chart");
      }
      else if (lowercasePrompt.includes('correlate') || lowercasePrompt.includes('relationship')) {
        setSelectedChart('scatter');
        setAnalysisType('correlations');
        toast.success("Analyzing correlations with scatter plot");
      }
      else {
        // Default behavior
        setSelectedChart('bar');
        toast.success("Showing data visualization");
      }
      
      // Run analysis and show the insights tab
      analyzeData();
      setCurrentView('insights');
      
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
