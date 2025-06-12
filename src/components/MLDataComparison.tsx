
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Brain, 
  Plus, 
  Trash2, 
  Upload,
  Download,
  TrendingUp,
  BarChart3,
  Loader2,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useVisualization } from '@/contexts/VisualizationContext';
import { toast } from 'sonner';
import CSVUploader from './CSVUploader';
import { 
  predictTrend, 
  detectAnomalies, 
  categorizeData, 
  performAdvancedAnalysis, 
  MLInsight 
} from '@/services/mlAnalysisService';

const MLDataComparison = () => {
  const { 
    activeDataset,
    datasets,
    comparisonDatasets,
    addComparisonDataset,
    removeComparisonDataset,
    clearComparisonDatasets
  } = useVisualization();

  const [showUploader, setShowUploader] = useState(false);
  const [comparisonName, setComparisonName] = useState('');
  const [selectedPrimaryDataset, setSelectedPrimaryDataset] = useState<string>('');
  const [selectedComparisonDataset, setSelectedComparisonDataset] = useState<string>('');
  const [mlInsights, setMlInsights] = useState<MLInsight[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [predictions, setPredictions] = useState<any>(null);

  useEffect(() => {
    if (activeDataset) {
      setSelectedPrimaryDataset(activeDataset.id);
    }
  }, [activeDataset]);

  const runMLComparison = async () => {
    if (!selectedPrimaryDataset || !selectedComparisonDataset) {
      toast.error("Please select both datasets for comparison");
      return;
    }

    const primaryDataset = datasets.find(d => d.id === selectedPrimaryDataset) || activeDataset;
    const comparisonDataset = comparisonDatasets.find(d => d.id === selectedComparisonDataset);

    if (!primaryDataset || !comparisonDataset) {
      toast.error("Selected datasets not found");
      return;
    }

    setIsAnalyzing(true);
    const insights: MLInsight[] = [];
    const predictionResults: any = {};

    try {
      // Analyze both datasets
      const primaryColumns = Object.keys(primaryDataset.data[0] || {});
      const comparisonColumns = Object.keys(comparisonDataset.data[0] || {});
      
      // Find common numeric columns
      const commonColumns = primaryColumns.filter(col => 
        comparisonColumns.includes(col) && 
        primaryDataset.data.some(row => typeof row[col] === 'number') &&
        comparisonDataset.data.some(row => typeof row[col] === 'number')
      );

      for (const column of commonColumns) {
        const primaryValues = primaryDataset.data
          .map(row => Number(row[column]))
          .filter(val => !isNaN(val));
        
        const comparisonValues = comparisonDataset.data
          .map(row => Number(row[column]))
          .filter(val => !isNaN(val));

        if (primaryValues.length > 2 && comparisonValues.length > 2) {
          // Trend comparison
          const primaryTrend = predictTrend(primaryValues);
          const comparisonTrend = predictTrend(comparisonValues);
          
          insights.push({
            type: 'trend_prediction',
            confidence: Math.min(primaryTrend.confidence, comparisonTrend.confidence),
            explanation: `${column}: ${primaryDataset.name} shows ${primaryTrend.prediction?.trend || 'stable'} trend vs ${comparisonDataset.name} shows ${comparisonTrend.prediction?.trend || 'stable'} trend`,
            prediction: {
              primary: primaryTrend.prediction,
              comparison: comparisonTrend.prediction,
              column
            }
          });

          // Anomaly comparison
          const primaryAnomalies = detectAnomalies(primaryValues);
          const comparisonAnomalies = detectAnomalies(comparisonValues);
          
          insights.push({
            type: 'anomaly_detection',
            confidence: Math.max(primaryAnomalies.confidence, comparisonAnomalies.confidence),
            explanation: `${column}: ${primaryDataset.name} has ${primaryAnomalies.prediction?.totalAnomalies || 0} anomalies vs ${comparisonDataset.name} has ${comparisonAnomalies.prediction?.totalAnomalies || 0} anomalies`,
            prediction: {
              primary: primaryAnomalies.prediction,
              comparison: comparisonAnomalies.prediction,
              column
            }
          });

          // Statistical comparison
          const primaryMean = primaryValues.reduce((a, b) => a + b, 0) / primaryValues.length;
          const comparisonMean = comparisonValues.reduce((a, b) => a + b, 0) / comparisonValues.length;
          const difference = ((comparisonMean - primaryMean) / primaryMean) * 100;

          predictionResults[column] = {
            primaryMean,
            comparisonMean,
            difference,
            trend: difference > 5 ? 'increasing' : difference < -5 ? 'decreasing' : 'stable'
          };
        }
      }

      // Category comparison if available
      const categoricalColumns = primaryColumns.filter(col => 
        comparisonColumns.includes(col) &&
        typeof primaryDataset.data[0][col] === 'string' &&
        typeof comparisonDataset.data[0][col] === 'string'
      );

      for (const column of categoricalColumns.slice(0, 2)) {
        const primaryCategories = primaryDataset.data.map(row => String(row[column]));
        const comparisonCategories = comparisonDataset.data.map(row => String(row[column]));

        const primaryCategorization = categorizeData(primaryCategories);
        const comparisonCategorization = categorizeData(comparisonCategories);

        insights.push({
          type: 'classification',
          confidence: Math.min(primaryCategorization.confidence, comparisonCategorization.confidence),
          explanation: `${column}: Most common in ${primaryDataset.name} is "${primaryCategorization.prediction?.mostCommon}" vs "${comparisonCategorization.prediction?.mostCommon}" in ${comparisonDataset.name}`,
          prediction: {
            primary: primaryCategorization.prediction,
            comparison: comparisonCategorization.prediction,
            column
          }
        });
      }

      setMlInsights(insights.slice(0, 8)); // Show top 8 insights
      setPredictions(predictionResults);
      toast.success("ML comparison analysis complete!");
      
    } catch (error) {
      console.error('ML Comparison failed:', error);
      toast.error("Failed to perform ML comparison");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImportComparison = () => {
    if (!comparisonName.trim()) {
      toast.error("Please enter a name for the comparison dataset");
      return;
    }
    setShowUploader(true);
  };

  const exportMLComparison = () => {
    if (mlInsights.length === 0) {
      toast.error("No ML insights to export");
      return;
    }

    try {
      const exportData = {
        timestamp: new Date().toISOString(),
        primaryDataset: selectedPrimaryDataset,
        comparisonDataset: selectedComparisonDataset,
        mlInsights,
        predictions,
        summary: {
          totalInsights: mlInsights.length,
          averageConfidence: mlInsights.reduce((acc, insight) => acc + insight.confidence, 0) / mlInsights.length,
          analysisType: 'ML-Powered Dataset Comparison'
        }
      };

      const jsonContent = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `ml_comparison_analysis_${new Date().toISOString().slice(0,10)}.json`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("ML comparison analysis exported successfully");
    } catch (error) {
      console.error("Error exporting ML comparison:", error);
      toast.error("Failed to export ML comparison analysis");
    }
  };

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

  return (
    <Card className="bg-slate-800/50 border-purple-500/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-purple-400">
            <Brain className="h-5 w-5" />
            ML-Powered Dataset Comparison
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-purple-500/30 text-purple-400">
              {mlInsights.length} insights
            </Badge>
            {mlInsights.length > 0 && (
              <Button
                size="sm"
                onClick={exportMLComparison}
                className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-90"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Analysis
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Dataset Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Primary Dataset</label>
            <Select value={selectedPrimaryDataset} onValueChange={setSelectedPrimaryDataset}>
              <SelectTrigger className="bg-slate-700 border-slate-600">
                <SelectValue placeholder="Select primary dataset" />
              </SelectTrigger>
              <SelectContent>
                {datasets.map((dataset) => (
                  <SelectItem key={dataset.id} value={dataset.id}>
                    {dataset.name} ({dataset.data.length} rows)
                  </SelectItem>
                ))}
                {activeDataset && !datasets.find(d => d.id === activeDataset.id) && (
                  <SelectItem value={activeDataset.id}>
                    {activeDataset.name} ({activeDataset.data.length} rows)
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Comparison Dataset</label>
            <Select value={selectedComparisonDataset} onValueChange={setSelectedComparisonDataset}>
              <SelectTrigger className="bg-slate-700 border-slate-600">
                <SelectValue placeholder="Select comparison dataset" />
              </SelectTrigger>
              <SelectContent>
                {comparisonDatasets.map((dataset) => (
                  <SelectItem key={dataset.id} value={dataset.id}>
                    {dataset.name} ({dataset.data.length} rows)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Import New Dataset Section */}
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex gap-2 flex-1">
              <Input
                placeholder="Name for new comparison dataset..."
                value={comparisonName}
                onChange={(e) => setComparisonName(e.target.value)}
                className="bg-slate-700 border-slate-600"
              />
              <Button
                onClick={handleImportComparison}
                variant="outline"
                className="border-purple-500/30 hover:border-purple-500 hover:bg-purple-500/10"
              >
                <Upload className="h-4 w-4 mr-2" />
                Import Dataset
              </Button>
            </div>
          </div>
          
          {showUploader && (
            <div className="border border-slate-600 rounded-lg p-4">
              <h4 className="text-sm font-medium mb-2">Import Dataset for ML Comparison</h4>
              <CSVUploader />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowUploader(false)}
                className="mt-2"
              >
                Cancel
              </Button>
            </div>
          )}
        </div>

        {/* Run Analysis Button */}
        <div className="flex justify-center">
          <Button
            onClick={runMLComparison}
            disabled={!selectedPrimaryDataset || !selectedComparisonDataset || isAnalyzing}
            className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-90"
            size="lg"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="h-5 w-5 mr-2" />
                Run ML Comparison
              </>
            )}
          </Button>
        </div>

        {/* ML Insights Results */}
        {isAnalyzing ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
            <span className="ml-3 text-slate-400">Running ML comparison analysis...</span>
          </div>
        ) : mlInsights.length === 0 ? (
          <div className="text-center py-12">
            <Brain className="h-12 w-12 mx-auto mb-4 text-slate-400" />
            <p className="text-slate-400">No ML insights available</p>
            <p className="text-xs text-slate-500 mt-2">Select datasets and run comparison to see ML-powered insights</p>
          </div>
        ) : (
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-purple-400">ML Insights & Predictions</h4>
            <div className="grid gap-4">
              {mlInsights.map((insight, index) => (
                <Card key={index} className="bg-slate-700/30 border-purple-500/10">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-purple-500/20 rounded-lg">
                        {getInsightIcon(insight.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium capitalize">
                            {insight.type.replace('_', ' ')}
                          </h5>
                          <Badge 
                            variant="outline" 
                            className={`${getConfidenceColor(insight.confidence)} border-current`}
                          >
                            {(insight.confidence * 100).toFixed(0)}% confidence
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-300 mb-3">
                          {insight.explanation}
                        </p>
                        
                        {/* Show detailed predictions */}
                        {insight.prediction && (
                          <div className="text-xs bg-slate-800/50 p-3 rounded space-y-2">
                            {insight.type === 'trend_prediction' && (
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <strong className="text-cyan-400">Primary Dataset:</strong>
                                  <div>Trend: {insight.prediction.primary?.trend || 'N/A'}</div>
                                  {insight.prediction.primary?.nextValues && (
                                    <div>Next values: {insight.prediction.primary.nextValues.slice(0, 3).map(v => v.toFixed(1)).join(', ')}</div>
                                  )}
                                </div>
                                <div>
                                  <strong className="text-purple-400">Comparison Dataset:</strong>
                                  <div>Trend: {insight.prediction.comparison?.trend || 'N/A'}</div>
                                  {insight.prediction.comparison?.nextValues && (
                                    <div>Next values: {insight.prediction.comparison.nextValues.slice(0, 3).map(v => v.toFixed(1)).join(', ')}</div>
                                  )}
                                </div>
                              </div>
                            )}
                            
                            {insight.type === 'anomaly_detection' && (
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <strong className="text-cyan-400">Primary:</strong> {insight.prediction.primary?.totalAnomalies || 0} anomalies
                                </div>
                                <div>
                                  <strong className="text-purple-400">Comparison:</strong> {insight.prediction.comparison?.totalAnomalies || 0} anomalies
                                </div>
                              </div>
                            )}
                            
                            {insight.type === 'classification' && (
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <strong className="text-cyan-400">Primary:</strong> {insight.prediction.primary?.mostCommon || 'N/A'}
                                </div>
                                <div>
                                  <strong className="text-purple-400">Comparison:</strong> {insight.prediction.comparison?.mostCommon || 'N/A'}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Dataset Management */}
        {comparisonDatasets.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-slate-300">Available Comparison Datasets:</h4>
            {comparisonDatasets.map((dataset, index) => (
              <div key={dataset.id} className="flex items-center justify-between bg-slate-700/30 rounded p-3">
                <div>
                  <h5 className="font-medium">{dataset.name}</h5>
                  <p className="text-sm text-slate-400">{dataset.description}</p>
                  <Badge variant="outline" className="mt-1 text-xs">
                    {dataset.data.length} rows
                  </Badge>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeComparisonDataset(dataset.id)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={clearComparisonDatasets}
              className="border-red-500/30 hover:border-red-500 hover:bg-red-500/10 text-red-400"
            >
              Clear All Datasets
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MLDataComparison;
