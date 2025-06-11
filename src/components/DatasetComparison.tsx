
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useVisualization } from '@/contexts/VisualizationContext';
import { GitCompare, TrendingUp, AlertTriangle, BarChart3, Download, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { predictTrend, detectAnomalies, categorizeData } from '@/services/mlAnalysisService';

interface ComparisonResult {
  dataset1: string;
  dataset2: string;
  similarities: string[];
  differences: string[];
  insights: string[];
  recommendations: string[];
  correlations: {
    metric: string;
    correlation: number;
    significance: string;
  }[];
  predictions: {
    dataset: string;
    prediction: any;
    confidence: number;
  }[];
}

const DatasetComparison = () => {
  const { datasets, activeDataset, importSampleData } = useVisualization();
  const [selectedDataset1, setSelectedDataset1] = useState<string>('');
  const [selectedDataset2, setSelectedDataset2] = useState<string>('');
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const [isComparing, setIsComparing] = useState(false);

  // Auto-import sample datasets if none exist
  useEffect(() => {
    if (datasets.length === 0) {
      // Import multiple sample datasets for comparison
      importSampleData('sales-data');
      setTimeout(() => importSampleData('web-analytics'), 500);
      setTimeout(() => importSampleData('financial'), 1000);
      toast.info('Loaded sample datasets for comparison');
    }
  }, [datasets.length, importSampleData]);

  const performComparison = async () => {
    if (!selectedDataset1 || !selectedDataset2) {
      toast.error('Please select two datasets to compare');
      return;
    }

    if (selectedDataset1 === selectedDataset2) {
      toast.error('Please select two different datasets');
      return;
    }

    setIsComparing(true);
    
    try {
      const dataset1 = datasets.find(d => d.id === selectedDataset1);
      const dataset2 = datasets.find(d => d.id === selectedDataset2);
      
      if (!dataset1 || !dataset2) {
        throw new Error('Selected datasets not found');
      }

      // Perform ML analysis on both datasets
      const data1Values = dataset1.data
        .map(item => Object.values(item).filter(val => typeof val === 'number'))
        .flat() as number[];
      
      const data2Values = dataset2.data
        .map(item => Object.values(item).filter(val => typeof val === 'number'))
        .flat() as number[];

      // Get predictions for both datasets
      const prediction1 = predictTrend(data1Values);
      const prediction2 = predictTrend(data2Values);
      
      // Detect anomalies
      const anomalies1 = detectAnomalies(data1Values);
      const anomalies2 = detectAnomalies(data2Values);

      // Calculate basic statistics
      const stats1 = {
        mean: data1Values.reduce((a, b) => a + b, 0) / data1Values.length,
        max: Math.max(...data1Values),
        min: Math.min(...data1Values),
        count: dataset1.data.length
      };

      const stats2 = {
        mean: data2Values.reduce((a, b) => a + b, 0) / data2Values.length,
        max: Math.max(...data2Values),
        min: Math.min(...data2Values),
        count: dataset2.data.length
      };

      // Generate comparison insights
      const similarities = [];
      const differences = [];
      const insights = [];
      const recommendations = [];

      // Compare data sizes
      if (Math.abs(stats1.count - stats2.count) < stats1.count * 0.1) {
        similarities.push(`Both datasets have similar record counts (${stats1.count} vs ${stats2.count})`);
      } else {
        differences.push(`Significant difference in record counts: ${stats1.count} vs ${stats2.count}`);
      }

      // Compare averages
      if (Math.abs(stats1.mean - stats2.mean) < Math.max(stats1.mean, stats2.mean) * 0.2) {
        similarities.push(`Average values are similar (${stats1.mean.toFixed(2)} vs ${stats2.mean.toFixed(2)})`);
      } else {
        differences.push(`Different average values: ${stats1.mean.toFixed(2)} vs ${stats2.mean.toFixed(2)}`);
      }

      // Generate insights based on trends
      if (prediction1.prediction?.trend === prediction2.prediction?.trend) {
        insights.push(`Both datasets show ${prediction1.prediction?.trend} trends`);
      } else {
        insights.push(`Contrasting trends: ${dataset1.name} is ${prediction1.prediction?.trend}, ${dataset2.name} is ${prediction2.prediction?.trend}`);
      }

      // Anomaly comparison
      const anomalyCount1 = anomalies1.prediction?.totalAnomalies || 0;
      const anomalyCount2 = anomalies2.prediction?.totalAnomalies || 0;
      
      if (anomalyCount1 > anomalyCount2) {
        insights.push(`${dataset1.name} has more anomalies (${anomalyCount1}) than ${dataset2.name} (${anomalyCount2})`);
        recommendations.push(`Investigate anomalies in ${dataset1.name} for data quality issues`);
      } else if (anomalyCount2 > anomalyCount1) {
        insights.push(`${dataset2.name} has more anomalies (${anomalyCount2}) than ${dataset1.name} (${anomalyCount1})`);
        recommendations.push(`Investigate anomalies in ${dataset2.name} for data quality issues`);
      } else {
        similarities.push(`Both datasets have similar anomaly patterns`);
      }

      // Generate recommendations
      if (prediction1.confidence > 0.7 && prediction2.confidence > 0.7) {
        recommendations.push('Both datasets show reliable trend patterns - suitable for forecasting');
      }

      if (stats1.mean > stats2.mean * 1.5) {
        recommendations.push(`Consider normalizing ${dataset1.name} values for better comparison`);
      }

      // Calculate correlations (simplified)
      const correlations = [
        {
          metric: 'Average Values',
          correlation: Math.abs(stats1.mean - stats2.mean) / Math.max(stats1.mean, stats2.mean),
          significance: Math.abs(stats1.mean - stats2.mean) < Math.max(stats1.mean, stats2.mean) * 0.1 ? 'High' : 'Low'
        },
        {
          metric: 'Data Variability',
          correlation: Math.abs((stats1.max - stats1.min) - (stats2.max - stats2.min)) / Math.max((stats1.max - stats1.min), (stats2.max - stats2.min)),
          significance: Math.abs((stats1.max - stats1.min) - (stats2.max - stats2.min)) < Math.max((stats1.max - stats1.min), (stats2.max - stats2.min)) * 0.2 ? 'High' : 'Low'
        }
      ];

      const result: ComparisonResult = {
        dataset1: dataset1.name,
        dataset2: dataset2.name,
        similarities,
        differences,
        insights,
        recommendations,
        correlations,
        predictions: [
          {
            dataset: dataset1.name,
            prediction: prediction1.prediction,
            confidence: prediction1.confidence
          },
          {
            dataset: dataset2.name,
            prediction: prediction2.prediction,
            confidence: prediction2.confidence
          }
        ]
      };

      setComparisonResult(result);
      toast.success('Dataset comparison completed with ML insights!');
      
    } catch (error) {
      console.error('Comparison error:', error);
      toast.error('Failed to compare datasets');
    } finally {
      setIsComparing(false);
    }
  };

  const exportComparison = () => {
    if (!comparisonResult) return;
    
    const reportData = {
      comparison: comparisonResult,
      timestamp: new Date().toISOString(),
      datasets: [selectedDataset1, selectedDataset2]
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dataset-comparison-${Date.now()}.json`;
    link.click();
    
    toast.success('Comparison report exported');
  };

  return (
    <Card className="bg-slate-800/50 border-cyan-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-cyan-400">
          <GitCompare className="h-5 w-5" />
          ML-Powered Dataset Comparison
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Dataset Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">First Dataset</label>
            <Select value={selectedDataset1} onValueChange={setSelectedDataset1}>
              <SelectTrigger className="bg-slate-700 border-slate-600">
                <SelectValue placeholder="Select first dataset" />
              </SelectTrigger>
              <SelectContent>
                {datasets.map((dataset) => (
                  <SelectItem key={dataset.id} value={dataset.id}>
                    {dataset.name} ({dataset.data.length} records)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Second Dataset</label>
            <Select value={selectedDataset2} onValueChange={setSelectedDataset2}>
              <SelectTrigger className="bg-slate-700 border-slate-600">
                <SelectValue placeholder="Select second dataset" />
              </SelectTrigger>
              <SelectContent>
                {datasets.map((dataset) => (
                  <SelectItem key={dataset.id} value={dataset.id}>
                    {dataset.name} ({dataset.data.length} records)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={performComparison}
            disabled={isComparing || !selectedDataset1 || !selectedDataset2}
            className="flex-1 bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-90"
          >
            {isComparing ? 'Analyzing...' : 'Compare with ML Insights'}
          </Button>
          
          {datasets.length < 3 && (
            <Button
              onClick={() => importSampleData('inventory')}
              variant="outline"
              className="border-cyan-500/30"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Dataset
            </Button>
          )}
        </div>

        {/* Comparison Results */}
        {comparisonResult && (
          <Tabs defaultValue="insights" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="insights">Insights</TabsTrigger>
              <TabsTrigger value="similarities">Similarities</TabsTrigger>
              <TabsTrigger value="differences">Differences</TabsTrigger>
              <TabsTrigger value="predictions">Predictions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="insights" className="space-y-4">
              <Card className="bg-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-400" />
                    ML-Generated Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {comparisonResult.insights.map((insight, idx) => (
                    <div key={idx} className="p-2 bg-slate-600/50 rounded text-sm">
                      {insight}
                    </div>
                  ))}
                </CardContent>
              </Card>
              
              <Card className="bg-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-400" />
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {comparisonResult.recommendations.map((rec, idx) => (
                    <div key={idx} className="p-2 bg-yellow-500/10 border border-yellow-500/20 rounded text-sm">
                      {rec}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="similarities" className="space-y-2">
              {comparisonResult.similarities.map((similarity, idx) => (
                <Badge key={idx} variant="secondary" className="w-full justify-start p-3">
                  {similarity}
                </Badge>
              ))}
            </TabsContent>
            
            <TabsContent value="differences" className="space-y-2">
              {comparisonResult.differences.map((difference, idx) => (
                <Badge key={idx} variant="destructive" className="w-full justify-start p-3">
                  {difference}
                </Badge>
              ))}
            </TabsContent>
            
            <TabsContent value="predictions" className="space-y-4">
              {comparisonResult.predictions.map((pred, idx) => (
                <Card key={idx} className="bg-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-sm">{pred.dataset}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div>Trend: <Badge>{pred.prediction?.trend || 'Unknown'}</Badge></div>
                      <div>Confidence: <Badge variant="outline">{(pred.confidence * 100).toFixed(1)}%</Badge></div>
                      {pred.prediction?.nextValues && (
                        <div>Next Values: {pred.prediction.nextValues.slice(0, 3).map((v: number) => v.toFixed(2)).join(', ')}</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        )}

        {comparisonResult && (
          <Button
            onClick={exportComparison}
            variant="outline"
            className="w-full border-cyan-500/30 hover:border-cyan-500"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Comparison Report
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default DatasetComparison;
