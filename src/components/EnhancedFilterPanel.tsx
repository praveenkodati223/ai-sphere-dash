
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Filter, RotateCcw, Download } from 'lucide-react';
import { useVisualization } from '@/contexts/VisualizationContext';
import { format } from 'date-fns';
import { toast } from 'sonner';

const EnhancedFilterPanel = () => {
  const { 
    activeDataset, 
    setFilteredData,
    availableCategories, 
    availableRegions,
    exportData
  } = useVisualization();
  
  const [dateRange, setDateRange] = useState<Date[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [valueRange, setValueRange] = useState<number[]>([0, 1000]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

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
    
    // Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(item => {
        const category = item.category || item.Category || item.CATEGORY;
        return selectedCategories.includes(category);
      });
    }
    
    // Apply region filter
    if (selectedRegions.length > 0) {
      filtered = filtered.filter(item => {
        const region = item.region || item.Region || item.REGION;
        return selectedRegions.includes(region);
      });
    }
    
    // Apply value range filter
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
  }, [activeDataset, searchTerm, selectedCategories, selectedRegions, valueRange, sortBy, sortOrder, setFilteredData]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setSelectedRegions([]);
    setValueRange([0, 1000]);
    setSortBy('');
    setSortOrder('asc');
    setDateRange([]);
    if (activeDataset) {
      setFilteredData(activeDataset.data);
    }
    toast.info('All filters reset');
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

        {/* Category Filter */}
        {availableCategories.length > 0 && (
          <div className="space-y-2">
            <Label>Categories ({selectedCategories.length} selected)</Label>
            <div className="max-h-32 overflow-y-auto space-y-1 border border-slate-600 rounded p-2">
              {availableCategories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedCategories([...selectedCategories, category]);
                      } else {
                        setSelectedCategories(selectedCategories.filter(c => c !== category));
                      }
                    }}
                  />
                  <Label className="text-sm">{category}</Label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Region Filter */}
        {availableRegions.length > 0 && (
          <div className="space-y-2">
            <Label>Regions ({selectedRegions.length} selected)</Label>
            <div className="max-h-32 overflow-y-auto space-y-1 border border-slate-600 rounded p-2">
              {availableRegions.map((region) => (
                <div key={region} className="flex items-center space-x-2">
                  <Checkbox
                    checked={selectedRegions.includes(region)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedRegions([...selectedRegions, region]);
                      } else {
                        setSelectedRegions(selectedRegions.filter(r => r !== region));
                      }
                    }}
                  />
                  <Label className="text-sm">{region}</Label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Value Range Filter */}
        <div className="space-y-2">
          <Label>Value Range: {valueRange[0]} - {valueRange[1]}</Label>
          <Slider
            value={valueRange}
            onValueChange={setValueRange}
            max={1000}
            min={0}
            step={10}
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
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedFilterPanel;
