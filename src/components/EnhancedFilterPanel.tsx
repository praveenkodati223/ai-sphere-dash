
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, RotateCcw, Download, Share2 } from 'lucide-react';
import { useVisualization } from '@/contexts/VisualizationContext';
import { toast } from 'sonner';

const EnhancedFilterPanel = () => {
  const { 
    activeDataset, 
    setFilteredData,
    exportData
  } = useVisualization();
  
  const [selectedColumns, setSelectedColumns] = useState<{[key: string]: string[]}>({});
  const [valueRange, setValueRange] = useState<number[]>([0, 1000]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Get all unique values for each column
  const getColumnValues = (columnName: string) => {
    if (!activeDataset) return [];
    return Array.from(new Set(
      activeDataset.data
        .map(item => item[columnName])
        .filter(value => value !== null && value !== undefined && value !== '')
        .map(value => String(value))
    )).sort();
  };

  // Apply filters whenever filter values change
  useEffect(() => {
    if (!activeDataset) return;
    
    let filtered = [...activeDataset.data];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    // Apply column-based filters
    Object.entries(selectedColumns).forEach(([column, selectedValues]) => {
      if (selectedValues.length > 0) {
        filtered = filtered.filter(item => {
          const itemValue = String(item[column] || '');
          return selectedValues.includes(itemValue);
        });
      }
    });
    
    // Apply value range filter for numeric columns
    filtered = filtered.filter(item => {
      const numericValues = Object.values(item).filter(val => typeof val === 'number');
      if (numericValues.length === 0) return true;
      const maxValue = Math.max(...numericValues as number[]);
      return maxValue >= valueRange[0] && maxValue <= valueRange[1];
    });
    
    // Apply sorting
    if (sortBy) {
      filtered.sort((a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];
        
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
        }
        
        const aStr = String(aVal).toLowerCase();
        const bStr = String(bVal).toLowerCase();
        
        if (sortOrder === 'asc') {
          return aStr.localeCompare(bStr);
        } else {
          return bStr.localeCompare(aStr);
        }
      });
    }
    
    setFilteredData(filtered);
    toast.success(`Applied filters: ${filtered.length} rows shown`);
  }, [activeDataset, searchTerm, selectedColumns, valueRange, sortBy, sortOrder, setFilteredData]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedColumns({});
    setValueRange([0, 1000]);
    setSortBy('');
    setSortOrder('asc');
    if (activeDataset) {
      setFilteredData(activeDataset.data);
    }
    toast.info('All filters reset');
  };

  const handleColumnValueSelect = (column: string, value: string, checked: boolean) => {
    setSelectedColumns(prev => {
      const currentValues = prev[column] || [];
      if (checked) {
        return { ...prev, [column]: [...currentValues, value] };
      } else {
        return { ...prev, [column]: currentValues.filter(v => v !== value) };
      }
    });
  };

  const shareData = async () => {
    if (!activeDataset) {
      toast.error("No data to share");
      return;
    }
    
    try {
      const shareData = {
        title: `${activeDataset.name} - Sphere AI Visualization`,
        text: `Check out this data visualization: ${activeDataset.description}`,
        url: window.location.href
      };
      
      if (navigator.share) {
        await navigator.share(shareData);
        toast.success("Data shared successfully");
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
        toast.success("Share link copied to clipboard");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      toast.error("Failed to share data");
    }
  };

  if (!activeDataset) {
    return (
      <Card className="bg-slate-800/50 border-cyan-500/20">
        <CardContent className="p-6">
          <p className="text-slate-400">Import data to access filtering options</p>
        </CardContent>
      </Card>
    );
  }

  const columnNames = Object.keys(activeDataset.data[0] || {});

  return (
    <Card className="bg-slate-800/50 border-cyan-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-cyan-400">
          <Filter className="h-5 w-5" />
          Advanced Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search Filter */}
        <div className="space-y-2">
          <Label>Search Data</Label>
          <Input
            placeholder="Search across all columns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-700 border-slate-600"
          />
        </div>

        {/* Dynamic Column Filters */}
        {columnNames.map((column) => {
          const columnValues = getColumnValues(column);
          const selectedValues = selectedColumns[column] || [];
          
          if (columnValues.length === 0) return null;
          
          return (
            <div key={column} className="space-y-2">
              <Label>{column} ({selectedValues.length} selected)</Label>
              <div className="max-h-32 overflow-y-auto space-y-1 border border-slate-600 rounded p-2">
                {columnValues.slice(0, 20).map((value) => (
                  <div key={value} className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedValues.includes(value)}
                      onCheckedChange={(checked) => 
                        handleColumnValueSelect(column, value, !!checked)
                      }
                    />
                    <Label className="text-sm">{value}</Label>
                  </div>
                ))}
                {columnValues.length > 20 && (
                  <p className="text-xs text-slate-400">
                    Showing first 20 of {columnValues.length} values
                  </p>
                )}
              </div>
            </div>
          );
        })}

        {/* Value Range Filter */}
        <div className="space-y-2">
          <Label>Value Range: {valueRange[0]} - {valueRange[1]}</Label>
          <Slider
            value={valueRange}
            onValueChange={setValueRange}
            max={10000}
            min={0}
            step={100}
            className="w-full"
          />
        </div>

        {/* Sort Options */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label>Sort By</Label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-slate-700 border-slate-600">
                <SelectValue placeholder="Select column" />
              </SelectTrigger>
              <SelectContent>
                {columnNames.map((column) => (
                  <SelectItem key={column} value={column}>
                    {column}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Order</Label>
            <Select value={sortOrder} onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}>
              <SelectTrigger className="bg-slate-700 border-slate-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button
            onClick={resetFilters}
            variant="outline"
            className="flex-1 border-slate-600 hover:bg-slate-700"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button
            onClick={exportData}
            variant="outline"
            className="flex-1 border-cyan-500/30 hover:border-cyan-500 hover:bg-cyan-500/10"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            onClick={shareData}
            variant="outline"
            className="flex-1 border-purple-500/30 hover:border-purple-500 hover:bg-purple-500/10"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedFilterPanel;
