
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Info, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import { useVisualization } from '@/contexts/VisualizationContext';
import { generateSmartInsights, AnalysisResult } from '@/services/analysisService';

const SmartInsights = () => {
  const { activeDataset } = useVisualization();
  
  if (!activeDataset) return null;
  
  const insights = generateSmartInsights(activeDataset);
  
  const getIcon = (type: AnalysisResult['type']) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'error': return <XCircle className="h-4 w-4" />;
      case 'success': return <CheckCircle className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };
  
  const getSeverityColor = (severity: AnalysisResult['severity']) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };
  
  return (
    <Card className="bg-slate-800/50 border-purple-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-400">
          <TrendingUp className="h-5 w-5" />
          Smart Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.length === 0 ? (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              No issues detected. Your data looks clean and healthy!
            </AlertDescription>
          </Alert>
        ) : (
          insights.map((insight, index) => (
            <Alert key={index} className="border-l-4 border-l-purple-500">
              {getIcon(insight.type)}
              <div className="ml-2 flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-sm">{insight.title}</h4>
                  <Badge variant={getSeverityColor(insight.severity) as any} className="text-xs">
                    {insight.severity}
                  </Badge>
                </div>
                <AlertDescription className="text-sm">{insight.message}</AlertDescription>
              </div>
            </Alert>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default SmartInsights;
