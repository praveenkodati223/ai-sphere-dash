
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, GitCompare, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
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
}

const DatasetComparison = () => {
  const { activeDataset } = useVisualization();
  const [secondDataset, setSecondDataset] = useState<DatasetType | null>(null);
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      const csvData = await parseCSVFile(file);
      const dataset: DatasetType = {
        id: `comparison-${Date.now()}`,
        name: file.name,
        description: 'Comparison dataset',
        data: csvData.data
      };
      setSecondDataset(dataset);
      toast.success('Second dataset loaded for comparison');
    } catch (error) {
      toast.error('Failed to load comparison dataset');
    }
  };
  
  const compareDatasets = () => {
    if (!activeDataset || !secondDataset) return;
    
    const dataset1Columns = Object.keys(activeDataset.data[0] || {});
    const dataset2Columns = Object.keys(secondDataset.data[0] || {});
    
    const commonColumns = dataset1Columns.filter(col => dataset2Columns.includes(col));
    const dataset1OnlyColumns = dataset1Columns.filter(col => !dataset2Columns.includes(col));
    const dataset2OnlyColumns = dataset2Columns.filter(col => !dataset1Columns.includes(col));
    
    const rowCountDiff = activeDataset.data.length - secondDataset.data.length;
    
    // Sample comparison for common columns
    const sampleComparison = commonColumns.map(column => {
      const dataset1Values = activeDataset.data.slice(0, 5).map(row => row[column]);
      const dataset2Values = secondDataset.data.slice(0, 5).map(row => row[column]);
      
      return {
        column,
        dataset1Values,
        dataset2Values,
        different: JSON.stringify(dataset1Values) !== JSON.stringify(dataset2Values)
      };
    });
    
    setComparison({
      commonColumns,
      dataset1OnlyColumns,
      dataset2OnlyColumns,
      rowCountDiff,
      sampleComparison
    });
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
          <Button onClick={compareDatasets} className="w-full">
            <GitCompare className="h-4 w-4 mr-2" />
            Compare Datasets
          </Button>
        )}
        
        {comparison && (
          <div className="space-y-4 mt-6">
            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-green-500/10 border-green-500/20">
                <CardContent className="p-3 text-center">
                  <CheckCircle className="h-6 w-6 mx-auto mb-2 text-green-400" />
                  <h5 className="font-medium text-green-400">Common Columns</h5>
                  <p className="text-2xl font-bold">{comparison.commonColumns.length}</p>
                </CardContent>
              </Card>
              
              <Card className="bg-yellow-500/10 border-yellow-500/20">
                <CardContent className="p-3 text-center">
                  <AlertCircle className="h-6 w-6 mx-auto mb-2 text-yellow-400" />
                  <h5 className="font-medium text-yellow-400">Only in Dataset 1</h5>
                  <p className="text-2xl font-bold">{comparison.dataset1OnlyColumns.length}</p>
                </CardContent>
              </Card>
              
              <Card className="bg-red-500/10 border-red-500/20">
                <CardContent className="p-3 text-center">
                  <XCircle className="h-6 w-6 mx-auto mb-2 text-red-400" />
                  <h5 className="font-medium text-red-400">Only in Dataset 2</h5>
                  <p className="text-2xl font-bold">{comparison.dataset2OnlyColumns.length}</p>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <h5 className="font-medium mb-2">Row Count Difference</h5>
              <p className="text-sm text-slate-400">
                {comparison.rowCountDiff > 0 
                  ? `Dataset 1 has ${comparison.rowCountDiff} more rows`
                  : comparison.rowCountDiff < 0
                  ? `Dataset 2 has ${Math.abs(comparison.rowCountDiff)} more rows`
                  : 'Both datasets have the same number of rows'
                }
              </p>
            </div>
            
            {comparison.commonColumns.length > 0 && (
              <div>
                <h5 className="font-medium mb-2">Column Details</h5>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {comparison.commonColumns.map(column => (
                    <Badge key={column} variant="outline" className="mr-1 mb-1">
                      {column}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DatasetComparison;
