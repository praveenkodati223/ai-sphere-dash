
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Brain, 
  TrendingUp, 
  AlertCircle,
  Lightbulb,
  Target,
  Zap,
  MessageSquare
} from 'lucide-react';
import { useVisualization } from '@/contexts/VisualizationContext';
import { toast } from 'sonner';

const AIAssistant = () => {
  const [query, setQuery] = useState('');
  const [conversation, setConversation] = useState<Array<{type: 'user' | 'ai', message: string, timestamp: Date}>>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  
  const { activeDataset, analyzedData, selectedChart } = useVisualization();

  const aiSuggestions = [
    "What are the key trends in my data?",
    "Show me anomalies and outliers",
    "Predict future performance",
    "Compare different segments",
    "Generate executive summary",
    "Identify growth opportunities"
  ];

  const smartInsights = [
    {
      icon: <TrendingUp className="h-4 w-4" />,
      title: "Growth Pattern",
      description: "Revenue shows 23% quarter-over-quarter growth",
      confidence: 92
    },
    {
      icon: <AlertCircle className="h-4 w-4" />,
      title: "Anomaly Detected",
      description: "Unusual spike in North region sales",
      confidence: 87
    },
    {
      icon: <Target className="h-4 w-4" />,
      title: "Opportunity",
      description: "Electronics category underperforming",
      confidence: 78
    }
  ];

  const handleQuery = async () => {
    if (!query.trim()) return;
    
    setIsProcessing(true);
    const userMessage = { type: 'user' as const, message: query, timestamp: new Date() };
    setConversation(prev => [...prev, userMessage]);
    
    // Simulate AI processing
    setTimeout(() => {
      const aiResponse = generateAIResponse(query);
      const aiMessage = { type: 'ai' as const, message: aiResponse, timestamp: new Date() };
      setConversation(prev => [...prev, aiMessage]);
      setIsProcessing(false);
      setQuery('');
    }, 1500);
  };

  const generateAIResponse = (userQuery: string): string => {
    const responses = {
      trends: "Based on your data analysis, I've identified 3 key trends: 1) Sales are increasing 15% month-over-month, 2) Electronics category dominates with 45% market share, 3) North region shows strongest performance.",
      anomaly: "I've detected unusual patterns in your data. There's a significant spike in Q3 sales that's 200% above the seasonal average. This could indicate a successful marketing campaign or data quality issue.",
      predict: "Using machine learning models, I predict 18% growth in the next quarter based on current trends. Key drivers include seasonal patterns and regional expansion.",
      summary: `Your dataset contains ${activeDataset?.data.length || 0} records across ${activeDataset ? Object.keys(activeDataset.data[0] || {}).length : 0} dimensions. Key insights: Strong performance in Electronics, Growth opportunity in South region, Seasonal patterns detected.`
    };

    if (userQuery.toLowerCase().includes('trend')) return responses.trends;
    if (userQuery.toLowerCase().includes('anomal') || userQuery.toLowerCase().includes('outlier')) return responses.anomaly;
    if (userQuery.toLowerCase().includes('predict') || userQuery.toLowerCase().includes('forecast')) return responses.predict;
    if (userQuery.toLowerCase().includes('summary')) return responses.summary;
    
    return "I've analyzed your request. Based on the current data patterns, here are my recommendations: Focus on high-performing segments, investigate anomalies, and consider seasonal adjustments for better forecasting.";
  };

  return (
    <div className="space-y-4">
      <Card className="bg-slate-800/50 border-cyan-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-cyan-400">
            <Bot className="h-5 w-5" />
            AI Assistant
            <Badge variant="secondary" className="bg-purple-900/50 text-purple-300">
              Enhanced
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Smart Insights */}
          <div className="grid grid-cols-1 gap-3">
            <h4 className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Smart Insights
            </h4>
            {smartInsights.map((insight, index) => (
              <div key={index} className="bg-slate-700/30 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <div className="text-cyan-400 mt-0.5">{insight.icon}</div>
                  <div className="flex-1">
                    <div className="font-medium text-sm text-white">{insight.title}</div>
                    <div className="text-xs text-slate-300 mt-1">{insight.description}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="h-1 bg-slate-600 rounded-full flex-1">
                        <div 
                          className="h-1 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
                          style={{ width: `${insight.confidence}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-400">{insight.confidence}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Conversation */}
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {conversation.map((msg, index) => (
              <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg p-3 ${
                  msg.type === 'user' 
                    ? 'bg-cyan-600/20 text-cyan-100' 
                    : 'bg-purple-600/20 text-purple-100'
                }`}>
                  <div className="text-sm">{msg.message}</div>
                  <div className="text-xs opacity-70 mt-1">
                    {msg.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-purple-600/20 text-purple-100 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-400"></div>
                    <span className="text-sm">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Suggestions */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-slate-300">Quick Questions</h4>
            <div className="flex flex-wrap gap-2">
              {aiSuggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs border-slate-600 hover:border-cyan-500 hover:bg-cyan-500/10"
                  onClick={() => setQuery(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <Textarea
              placeholder="Ask me anything about your data..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 min-h-[60px] bg-slate-700 border-slate-600"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleQuery();
                }
              }}
            />
            <Button
              onClick={handleQuery}
              disabled={isProcessing || !query.trim()}
              className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAssistant;
