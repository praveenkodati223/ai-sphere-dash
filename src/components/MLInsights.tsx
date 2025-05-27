
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, TrendingUp, AlertTriangle, BarChart3, Loader2 } from 'lucide-react';
import { useVisualization } from '@/contexts/VisualizationContext';
import { 
  predictTrend, 
  detectAnomalies, 
  categorizeData, 
  performAdvancedAnalysis, 
  MLInsight 
} from '@/services/mlAnalysisService';

const MLInsights = () => {
  const { activeDataset } = useVisualization();
  const [insights, setInsights] = useState<MLInsight[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const runMLAnalysis = async () => {
    if (!activeDataset?.data?.length) return;
    
    setIsAnalyzing(true);
    const newInsights: MLInsight[] = [];
    
    try {
      const data = activeDataset.data;
      const columns = Object.keys(data[0] || {});
      
      // Analyze numeric columns for trends and anomalies
      for (const column of columns) {
        const numericValues = data
          .map(row => Number(row[column]))
          .filter(val => !isNaN(val));
        
        if (numericValues.length > 2) {
          // Trend prediction
          const trendInsight = predictTrend(numericValues);
          if (trendInsight.confidence > 0.3) {
            newInsights.push(trendInsight);
          }
          
          // Anomaly detection
          const anomalyInsight = detectAnomalies(numericValues);
          if (anomalyInsight.confidence > 0.5) {
            newInsights.push(anomalyInsight);
          }
        }
      }
      
      // Analyze categorical columns
      for (const column of columns) {
        const stringValues = data
          .map(row => String(row[column]))
          .filter(val => val && val.trim() !== '');
        
        if (stringValues.length > 1) {
          const categoryInsight = categorizeData(stringValues);
          if (categoryInsight.confidence > 0.5) {
            newInsights.push(categoryInsight);
          }
        }
      }
      
      // Advanced text analysis if we have text data
      const textColumns = columns.filter(col => 
        data.some(row => 
          typeof row[col] === 'string' && 
          row[col].length > 10 && 
          !/^\d+$/.test(row[col])
        )
      );
      
      if (textColumns.length > 0) {
        const textData = data
          .map(row => textColumns.map(col => String(row[col])).join(' '))
          .filter(text => text.trim().length > 10);
        
        if (textData.length > 0) {
          const textInsight = await performAdvancedAnalysis(textData);
          if (textInsight.confidence > 0.4) {
            newInsights.push(textInsight);
          }
        }
      }
      
      setInsights(newInsights.slice(0, 5)); // Show top 5 insights
    } catch (error) {
      console.error('ML Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  useEffect(() => {
    if (activeDataset) {
      runMLAnalysis();
    }
  }, [activeDataset]);
  
  const getInsightIcon = (type: MLInsight['type']) => {
    switch (type) {
      case 'trend_prediction': return <TrendingUp className="h-4 w-4" />;
      case 'anomaly_detection': return <AlertTriangle className="h-4 w-4" />;
      case 'classification': return <BarChart3 className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };
  
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-400';
    if (confidence >= 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };
  
  if (!activeDataset) return null;
  
  return (
    <Card className="bg-slate-800/50 border-purple-500/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-purple-400">
            <Brain className="h-5 w-5" />
            ML-Powered Insights
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={runMLAnalysis}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Brain className="h-4 w-4 mr-2" />
            )}
            {isAnalyzing ? 'Analyzing...' : 'Re-analyze'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAnalyzing ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
            <span className="ml-2 text-slate-400">Running ML analysis...</span>
          </div>
        ) : insights.length === 0 ? (
          <div className="text-center py-8">
            <Brain className="h-12 w-12 mx-auto mb-4 text-slate-400" />
            <p className="text-slate-400">No significant patterns detected</p>
            <p className="text-xs text-slate-500 mt-2">Try with a larger or more varied dataset</p>
          </div>
        ) : (
          insights.map((insight, index) => (
            <Card key={index} className="bg-slate-700/30 border-purple-500/10">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    {getInsightIcon(insight.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium capitalize">
                        {insight.type.replace('_', ' ')}
                      </h4>
                      <Badge 
                        variant="outline" 
                        className={`${getConfidenceColor(insight.confidence)} border-current`}
                      >
                        {(insight.confidence * 100).toFixed(0)}% confidence
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-300 mb-2">
                      {insight.explanation}
                    </p>
                    
                    {/* Show specific predictions */}
                    {insight.prediction && (
                      <div className="text-xs text-slate-400 bg-slate-800/50 p-2 rounded">
                        {insight.type === 'trend_prediction' && insight.prediction.nextValues && (
                          <div>
                            <strong>Predicted next values:</strong> {insight.prediction.nextValues.map(v => v.toFixed(1)).join(', ')}
                          </div>
                        )}
                        {insight.type === 'anomaly_detection' && insight.prediction.anomalies && (
                          <div>
                            <strong>Anomalies found:</strong> {insight.prediction.totalAnomalies} outliers detected
                          </div>
                        )}
                        {insight.type === 'classification' && insight.prediction.categories && (
                          <div>
                            <strong>Top category:</strong> {insight.prediction.mostCommon}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default MLInsights;
