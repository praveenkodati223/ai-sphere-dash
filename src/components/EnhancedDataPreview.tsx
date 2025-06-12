
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Eye, 
  BarChart3, 
  CheckSquare, 
  Square,
  Filter,
  Zap,
  TrendingUp
} from 'lucide-react';
import { useVisualization } from '@/contexts/VisualizationContext';
import { toast } from 'sonner';

const EnhancedDataPreview = () => {
  const { 
    activeDataset, 
    selectedRows, 
    setSelectedRows, 
    analyzeData,
    setCurrentView 
  } = useVisualization();
  
  const [selectAll, setSelectAll] = useState(false);
  
  if (!activeDataset || !activeDataset.data.length) {
    return (
      <Card className="bg-slate-800/50 border-cyan-500/20">
        <CardContent className="p-6 text-center">
          <p className="text-slate-400">No data available to preview</p>
        </CardContent>
      </Card>
    );
  }
  
  const data = activeDataset.data;
  const columns = Object.keys(data[0] || {});
  
  const handleRowSelect = (index: number, checked: boolean) => {
    if (checked) {
      setSelectedRows([...selectedRows, index]);
    } else {
      setSelectedRows(selectedRows.filter(i => i !== index));
    }
  };
  
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
      setSelectAll(false);
    } else {
      setSelectedRows(data.map((_, index) => index));
      setSelectAll(true);
    }
  };
  
  const visualizeSelected = () => {
    if (selectedRows.length === 0) {
      toast.error("Please select rows to visualize");
      return;
    }
    
    analyzeData();
    setCurrentView('chart');
    toast.success(`Visualizing ${selectedRows.length} selected rows`);
  };
  
  const getColumnType = (columnName: string) => {
    const firstValue = data[0][columnName];
    if (typeof firstValue === 'number') return 'number';
    if (typeof firstValue === 'boolean') return 'boolean';
    if (firstValue && !isNaN(Date.parse(firstValue))) return 'date';
    return 'text';
  };
  
  return (
    <Card className="bg-slate-800/50 border-cyan-500/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-cyan-400">
            <Eye className="h-5 w-5" />
            Data Preview
            <Badge variant="secondary" className="bg-purple-900/50 text-purple-300">
              Enhanced
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-cyan-500/30 text-cyan-400">
              {selectedRows.length} / {data.length} selected
            </Badge>
            {selectedRows.length > 0 && (
              <Button
                size="sm"
                onClick={visualizeSelected}
                className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-90"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Visualize Selected
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-slate-700/30 rounded-lg p-3">
              <div className="text-sm text-slate-300">Total Rows</div>
              <div className="text-xl font-bold text-cyan-400">{data.length}</div>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-3">
              <div className="text-sm text-slate-300">Columns</div>
              <div className="text-xl font-bold text-purple-400">{columns.length}</div>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-3">
              <div className="text-sm text-slate-300">Selected</div>
              <div className="text-xl font-bold text-green-400">{selectedRows.length}</div>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-3">
              <div className="text-sm text-slate-300">Data Types</div>
              <div className="flex gap-1 mt-1">
                {Array.from(new Set(columns.map(getColumnType))).map(type => (
                  <Badge key={type} variant="outline" className="text-xs">
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          {/* Column Information */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Column Information
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {columns.map(column => (
                <div key={column} className="bg-slate-700/20 rounded p-2">
                  <div className="text-sm font-medium text-white">{column}</div>
                  <Badge variant="outline" className="text-xs mt-1">
                    {getColumnType(column)}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
          
          {/* Data Table */}
          <div className="border border-slate-600 rounded-lg overflow-hidden">
            <div className="max-h-96 overflow-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-slate-700">
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectAll}
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all rows"
                      />
                    </TableHead>
                    <TableHead className="w-16">#</TableHead>
                    {columns.slice(0, 6).map(column => (
                      <TableHead key={column} className="text-cyan-400">
                        {column}
                        <Badge variant="outline" className="ml-2 text-xs">
                          {getColumnType(column)}
                        </Badge>
                      </TableHead>
                    ))}
                    {columns.length > 6 && (
                      <TableHead className="text-slate-400">
                        +{columns.length - 6} more...
                      </TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.slice(0, 50).map((row, index) => (
                    <TableRow 
                      key={index}
                      className={`hover:bg-slate-700/30 ${
                        selectedRows.includes(index) ? 'bg-purple-900/20 border-purple-500/30' : ''
                      }`}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedRows.includes(index)}
                          onCheckedChange={(checked) => handleRowSelect(index, !!checked)}
                          aria-label={`Select row ${index + 1}`}
                        />
                      </TableCell>
                      <TableCell className="text-slate-400">{index + 1}</TableCell>
                      {columns.slice(0, 6).map(column => (
                        <TableCell key={column} className="text-slate-200">
                          {typeof row[column] === 'number' 
                            ? row[column].toLocaleString() 
                            : String(row[column] || '—')}
                        </TableCell>
                      ))}
                      {columns.length > 6 && (
                        <TableCell className="text-slate-400">...</TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          
          {data.length > 50 && (
            <div className="text-center p-4 bg-slate-700/20 rounded-lg">
              <p className="text-sm text-slate-400">
                Showing first 50 rows of {data.length} total rows
              </p>
            </div>
          )}
          
          {/* Quick Actions */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedRows([])}
              className="border-slate-600 hover:bg-slate-700"
            >
              Clear Selection
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedRows(data.map((_, i) => i).slice(0, 10))}
              className="border-cyan-500/30 hover:border-cyan-500 hover:bg-cyan-500/10"
            >
              <Zap className="h-4 w-4 mr-2" />
              Select First 10
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Select rows with highest values in first numeric column
                const numericCol = columns.find(col => getColumnType(col) === 'number');
                if (numericCol) {
                  const sorted = data
                    .map((row, index) => ({ row, index, value: row[numericCol] }))
                    .sort((a, b) => b.value - a.value)
                    .slice(0, 10)
                    .map(item => item.index);
                  setSelectedRows(sorted);
                  toast.success(`Selected top 10 rows by ${numericCol}`);
                }
              }}
              className="border-purple-500/30 hover:border-purple-500 hover:bg-purple-500/10"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Select Top Performers
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedDataPreview;
