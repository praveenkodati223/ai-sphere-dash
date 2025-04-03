
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

const AIPrompt = () => {
  const [promptInput, setPromptInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([
    "Show me sales trends over the last 3 months",
    "Compare regional performance in a bar chart",
    "Identify top-performing products",
    "Create a dashboard for customer demographics"
  ]);
  
  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!promptInput.trim()) {
      toast.error("Please enter a prompt");
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      toast.success("AI visualization generated successfully");
      setIsProcessing(false);
      setPromptInput('');
    }, 2000);
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setPromptInput(suggestion);
  };
  
  return (
    <div className="glass p-6 rounded-lg">
      <h3 className="text-xl font-semibold mb-4">
        <span className="text-gradient">AI</span> Insights
      </h3>
      
      <form onSubmit={handlePromptSubmit} className="mb-4">
        <div className="flex gap-2">
          <Input
            placeholder="Describe the visualization you want..."
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            className="flex-1"
            disabled={isProcessing}
          />
          <Button 
            type="submit" 
            disabled={isProcessing}
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
