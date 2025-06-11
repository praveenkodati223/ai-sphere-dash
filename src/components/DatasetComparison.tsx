
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, GitCompare, CheckCircle, XCircle, AlertCircle, Download } from 'lucide-react';
import { useVisualization } from '@/contexts/VisualizationContext';
import { DatasetType } from '@/contexts/VisualizationContext';
import { parseCSVFile } from '@/services/csvService';
import { toast } from 'sonner';

interface ComparisonResult {
  commonColumns: string[];
  dataset1OnlyColumns: string[];
  dataset2OnlyColumns: string[];
  rowCountDiff: number;
  sampleComparison: any[];
  dataQuality: {
    dataset1Quality: number;
    dataset2Quality: number;
  };
  trends: {
    dataset1Trend: string;
    dataset2Trend: string;
  };
}

const DatasetComparison = () => {
  const { activeDataset } = useVisualization();
  const [secondDataset, setSecondDataset] = useState<DatasetType | null>(null);
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      toast.info('Loading comparison dataset...');
      const csvData = await parseCSVFile(file);
      const dataset: DatasetType = {
        id: `comparison-${Date.now()}`,
        name: file.name,
        description: 'Comparison dataset',
        data: csvData.data
      };
      setSecondDataset(dataset);
      toast.success('Second dataset loaded successfully');
    } catch (error) {
      console.error('Error loading comparison dataset:', error);
      toast.error('Failed to load comparison dataset');
    }
  };
  
  const calculateDataQuality = (dataset: DatasetType) => {
    const data = dataset.data;
    if (!data || data.length === 0) return 0;
    
    const totalCells = data.length * Object.keys(data[0] || {}).length;
    let validCells = 0;
    
    data.forEach(row => {
      Object.values(row).forEach(value => {
        if (value !== null && value !== undefined && value !== '') {
          validCells++;
        }
      });
    });
    
    return Math.round((validCells / totalCells) * 100);
  };
  
  const analyzeTrend = (dataset: DatasetType) => {
    const data = dataset.data;
    if (!data || data.length < 2) return 'insufficient_data';
    
    // Look for numeric columns to analyze trends
    const numericColumns = Object.keys(data[0] || {}).filter(key => {
      return data.some(row => typeof row[key] === 'number' || !isNaN(Number(row[key])));
    });
    
    if (numericColumns.length === 0) return 'no_numeric_data';
    
    // Analyze the first numeric column
    const values = data.map(row => Number(row[numericColumns[0]])).filter(val => !isNaN(val));
    if (values.length < 2) return 'insufficient_numeric_data';
    
    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));
    
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    
    const changePercent = ((secondAvg - firstAvg) / firstAvg) * 100;
    
    if (changePercent > 5) return 'increasing';
    if (changePercent < -5) return 'decreasing';
    return 'stable';
  };
  
  const compareDatasets = async () => {
    if (!activeDataset || !secondDataset) {
      toast.error('Both datasets are required for comparison');
      return;
    }
    
    setIsComparing(true);
    toast.info('Comparing datasets...');
    
    try {
      // Add artificial delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const dataset1Columns = Object.keys(activeDataset.data[0] || {});
      const dataset2Columns = Object.keys(secondDataset.data[0] || {});
      
      const commonColumns = dataset1Columns.filter(col => dataset2Columns.includes(col));
      const dataset1OnlyColumns = dataset1Columns.filter(col => !dataset2Columns.includes(col));
      const dataset2OnlyColumns = dataset2Columns.filter(col => !dataset1Columns.includes(col));
      
      const rowCountDiff = activeDataset.data.length - secondDataset.data.length;
      
      // Enhanced sample comparison for common columns
      const sampleComparison = commonColumns.slice(0, 5).map(column => {
        const dataset1Values = activeDataset.data.slice(0, 3).map(row => row[column]);
        const dataset2Values = secondDataset.data.slice(0, 3).map(row => row[column]);
        
        return {
          column,
          dataset1Values,
          dataset2Values,
          different: JSON.stringify(dataset1Values) !== JSON.stringify(dataset2Values)
        };
      });
      
      // Calculate data quality
      const dataQuality = {
        dataset1Quality: calculateDataQuality(activeDataset),
        dataset2Quality: calculateDataQuality(secondDataset)
      };
      
      // Analyze trends
      const trends = {
        dataset1Trend: analyzeTrend(activeDataset),
        dataset2Trend: analyzeTrend(secondDataset)
      };
      
      const result: ComparisonResult = {
        commonColumns,
        dataset1OnlyColumns,
        dataset2OnlyColumns,
        rowCountDiff,
        sampleComparison,
        dataQuality,
        trends
      };
      
      setComparison(result);
      toast.success('Dataset comparison completed successfully');
    } catch (error) {
      console.error('Comparison failed:', error);
      toast.error('Failed to compare datasets');
    } finally {
      setIsComparing(false);
    }
  };
  
  const exportComparison = () => {
    if (!comparison || !activeDataset || !secondDataset) {
      toast.error('No comparison data to export');
      return;
    }
    
    const reportData = {
      timestamp: new Date().toISOString(),
      dataset1: activeDataset.name,
      dataset2: secondDataset.name,
      summary: {
        commonColumns: comparison.commonColumns.length,
        uniqueToDataset1: comparison.dataset1OnlyColumns.length,
        uniqueToDataset2: comparison.dataset2OnlyColumns.length,
        rowCountDifference: comparison.rowCountDiff,
        dataset1Quality: comparison.dataQuality.dataset1Quality,
        dataset2Quality: comparison.dataQuality.dataset2Quality
      },
      details: comparison
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dataset_comparison_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Comparison report exported successfully');
  };
  
  if (!activeDataset) {
    return (
      <Card className="bg-slate-800/50 border-cyan-500/20">
        <CardContent className="p-6 text-center">
          <Upload className="h-12 w-12 mx-auto mb-4 text-slate-400" />
          <p className="text-slate-400">Import a dataset first to enable comparison</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="bg-slate-800/50 border-cyan-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-cyan-400">
          <GitCompare className="h-5 w-5" />
          Dataset Comparison
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium">Dataset 1 (Active)</h4>
            <Badge variant="outline" className="border-cyan-500/30">
              {activeDataset.name} ({activeDataset.data.length} rows)
            </Badge>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Dataset 2 (Compare)</h4>
            {secondDataset ? (
              <Badge variant="outline" className="border-green-500/30">
                {secondDataset.name} ({secondDataset.data.length} rows)
              </Badge>
            ) : (
              <div>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="comparison-upload"
                />
                <label htmlFor="comparison-upload">
                  <Button variant="outline" className="cursor-pointer" asChild>
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload CSV
                    </span>
                  </Button>
                </label>
              </div>
            )}
          </div>
        </div>
        
        {secondDataset && (
          <div className="flex gap-2">
            <Button 
              onClick={compareDatasets} 
              disabled={isComparing}
              className="flex-1"
            >
              {isComparing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Comparing...
                </>
              ) : (
                <>
                  <GitCompare className="h-4 w-4 mr-2" />
                  Compare Datasets
                </>
              )}
            </Button>
            {comparison && (
              <Button variant="outline" onClick={exportComparison}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            )}
          </div>
        )}
        
        {comparison && (
          <div className="space-y-4 mt-6">
            {/* Enhanced comparison results */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-green-500/10 border-green-500/20">
                <CardContent className="p-3 text-center">
                  <CheckCircle className="h-6 w-6 mx-auto mb-2 text-green-400" />
                  <h5 className="font-medium text-green-400">Common</h5>
                  <p className="text-2xl font-bold">{comparison.commonColumns.length}</p>
                  <p className="text-xs text-green-300">columns</p>
                </CardContent>
              </Card>
              
              <Card className="bg-yellow-500/10 border-yellow-500/20">
                <CardContent className="p-3 text-center">
                  <AlertCircle className="h-6 w-6 mx-auto mb-2 text-yellow-400" />
                  <h5 className="font-medium text-yellow-400">Unique #1</h5>
                  <p className="text-2xl font-bold">{comparison.dataset1OnlyColumns.length}</p>
                  <p className="text-xs text-yellow-300">columns</p>
                </CardContent>
              </Card>
              
              <Card className="bg-red-500/10 border-red-500/20">
                <CardContent className="p-3 text-center">
                  <XCircle className="h-6 w-6 mx-auto mb-2 text-red-400" />
                  <h5 className="font-medium text-red-400">Unique #2</h5>
                  <p className="text-2xl font-bold">{comparison.dataset2OnlyColumns.length}</p>
                  <p className="text-xs text-red-300">columns</p>
                </CardContent>
              </Card>
              
              <Card className="bg-blue-500/10 border-blue-500/20">
                <CardContent className="p-3 text-center">
                  <div className="text-blue-400 text-2xl mb-2">📊</div>
                  <h5 className="font-medium text-blue-400">Rows Diff</h5>
                  <p className="text-2xl font-bold">{Math.abs(comparison.rowCountDiff)}</p>
                  <p className="text-xs text-blue-300">
                    {comparison.rowCountDiff > 0 ? 'more in #1' : comparison.rowCountDiff < 0 ? 'more in #2' : 'equal'}
                  </p>
                </CardContent>
              </Card>
            </div>
            
            {/* Data Quality Comparison */}
            <Card className="bg-slate-700/30 border-purple-500/20">
              <CardContent className="p-4">
                <h5 className="font-medium mb-3">Data Quality Analysis</h5>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-slate-300">Dataset 1 Quality</div>
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-bold text-cyan-400">{comparison.dataQuality.dataset1Quality}%</div>
                      <div className="text-sm text-slate-400">complete</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-300">Dataset 2 Quality</div>
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-bold text-purple-400">{comparison.dataQuality.dataset2Quality}%</div>
                      <div className="text-sm text-slate-400">complete</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Sample Data Preview */}
            {comparison.sampleComparison.length > 0 && (
              <Card className="bg-slate-700/30 border-cyan-500/20">
                <CardContent className="p-4">
                  <h5 className="font-medium mb-3">Sample Data Preview</h5>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {comparison.sampleComparison.map((sample, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="font-medium">{sample.column}</span>
                        <Badge variant={sample.different ? "destructive" : "secondary"} className="text-xs">
                          {sample.different ? "Different" : "Similar"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DatasetComparison;
