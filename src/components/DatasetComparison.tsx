
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  GitCompare, 
  Plus, 
  Trash2, 
  Upload,
  Download,
  BarChart3
} from 'lucide-react';
import { useVisualization } from '@/contexts/VisualizationContext';
import { toast } from 'sonner';
import CSVUploader from './CSVUploader';

const DatasetComparison = () => {
  const { 
    activeDataset,
    comparisonDatasets,
    addComparisonDataset,
    removeComparisonDataset,
    clearComparisonDatasets,
    importComparisonData
  } = useVisualization();

  const [showUploader, setShowUploader] = React.useState(false);
  const [comparisonName, setComparisonName] = React.useState('');

  const handleAddCurrentDataset = () => {
    if (!activeDataset) {
      toast.error("No active dataset to add for comparison");
      return;
    }
    
    addComparisonDataset(activeDataset);
  };

  const handleImportComparison = () => {
    if (!comparisonName.trim()) {
      toast.error("Please enter a name for the comparison dataset");
      return;
    }
    
    setShowUploader(true);
  };

  const getComparisonData = () => {
    if (comparisonDatasets.length === 0) return [];
    
    // Create comparison data structure
    const categories = new Set<string>();
    comparisonDatasets.forEach(dataset => {
      dataset.data.forEach(item => {
        const category = item.category || item.Category || item.name || 'Uncategorized';
        categories.add(category);
      });
    });
    
    return Array.from(categories).map(category => {
      const dataPoint: any = { category };
      
      comparisonDatasets.forEach(dataset => {
        const categoryData = dataset.data.filter(item => 
          (item.category || item.Category || item.name || 'Uncategorized') === category
        );
        
        // Calculate total value for this category in this dataset
        const total = categoryData.reduce((sum, item) => {
          const numericValues = Object.values(item).filter(val => typeof val === 'number');
          return sum + numericValues.reduce((a: any, b: any) => a + b, 0);
        }, 0);
        
        dataPoint[dataset.name] = total;
      });
      
      return dataPoint;
    });
  };

  const exportComparison = () => {
    if (comparisonDatasets.length === 0) {
      toast.error("No datasets to export");
      return;
    }
    
    try {
      const comparisonData = getComparisonData();
      const csvContent = [
        ['Category', ...comparisonDatasets.map(d => d.name)].join(','),
        ...comparisonData.map(row => [
          row.category,
          ...comparisonDatasets.map(d => row[d.name] || 0)
        ].join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `dataset_comparison_${new Date().toISOString().slice(0,10)}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Comparison data exported successfully");
    } catch (error) {
      console.error("Error exporting comparison:", error);
      toast.error("Failed to export comparison data");
    }
  };

  const comparisonData = getComparisonData();
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe'];

  return (
    <Card className="bg-slate-800/50 border-cyan-500/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-cyan-400">
            <GitCompare className="h-5 w-5" />
            Dataset Comparison
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-cyan-500/30 text-cyan-400">
              {comparisonDatasets.length} datasets
            </Badge>
            {comparisonDatasets.length > 0 && (
              <Button
                size="sm"
                onClick={exportComparison}
                className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-90"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Dataset Section */}
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button
              onClick={handleAddCurrentDataset}
              disabled={!activeDataset}
              variant="outline"
              className="border-cyan-500/30 hover:border-cyan-500 hover:bg-cyan-500/10"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Current Dataset
            </Button>
            <div className="flex gap-2 flex-1">
              <Input
                placeholder="Name for comparison dataset..."
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
                Import New
              </Button>
            </div>
          </div>
          
          {showUploader && (
            <div className="border border-slate-600 rounded-lg p-4">
              <h4 className="text-sm font-medium mb-2">Import Comparison Dataset</h4>
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

        {/* Dataset List */}
        {comparisonDatasets.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-slate-300">Datasets in Comparison:</h4>
            {comparisonDatasets.map((dataset, index) => (
              <div key={dataset.id} className="flex items-center justify-between bg-slate-700/30 rounded p-3">
                <div>
                  <h5 className="font-medium">{dataset.name}</h5>
                  <p className="text-sm text-slate-400">{dataset.description}</p>
                  <Badge 
                    variant="outline" 
                    className="mt-1 text-xs"
                    style={{ borderColor: colors[index % colors.length] }}
                  >
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
              Clear All
            </Button>
          </div>
        )}

        {/* Comparison Visualization */}
        {comparisonData.length > 0 ? (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Comparison Chart
            </h4>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="category" 
                    stroke="#9CA3AF"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  {comparisonDatasets.map((dataset, index) => (
                    <Bar
                      key={dataset.id}
                      dataKey={dataset.name}
                      fill={colors[index % colors.length]}
                      name={dataset.name}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <GitCompare className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-lg mb-2">No datasets for comparison</p>
            <p className="text-sm text-slate-400">
              Add your current dataset or import new ones to start comparing
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DatasetComparison;
