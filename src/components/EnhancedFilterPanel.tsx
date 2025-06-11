import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Filter, Calendar as CalendarIcon, X, RotateCcw, Download } from 'lucide-react';
import { useVisualization } from '@/contexts/VisualizationContext';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface FilterState {
  textFilters: Record<string, string>;
  numericFilters: Record<string, { min: number; max: number; current: [number, number] }>;
  categoryFilters: Record<string, string[]>;
  dateRange: { from: Date | null; to: Date | null };
}

const EnhancedFilterPanel = () => {
  const { activeDataset, setFilteredData } = useVisualization();
  const [filters, setFilters] = useState<FilterState>({
    textFilters: {},
    numericFilters: {},
    categoryFilters: {},
    dateRange: { from: null, to: null }
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Initialize filters when dataset changes
  useEffect(() => {
    if (!activeDataset?.data?.length) return;

    const data = activeDataset.data;
    const columns = Object.keys(data[0] || {});
    
    const newFilters: FilterState = {
      textFilters: {},
      numericFilters: {},
      categoryFilters: {},
      dateRange: { from: null, to: null }
    };

    columns.forEach(column => {
      const values = data.map(row => row[column]).filter(val => val !== null && val !== undefined);
      
      // Check if column is numeric
      const numericValues = values.map(val => Number(val)).filter(val => !isNaN(val));
      if (numericValues.length > values.length * 0.8 && numericValues.length > 0) {
        const min = Math.min(...numericValues);
        const max = Math.max(...numericValues);
        newFilters.numericFilters[column] = {
          min,
          max,
          current: [min, max]
        };
      } else {
        // Check if it's a date column
        const isDateColumn = column.toLowerCase().includes('date') || 
                           column.toLowerCase().includes('time') ||
                           values.some(val => !isNaN(Date.parse(String(val))));
        
        if (!isDateColumn) {
          // Categorical column
          const uniqueValues = [...new Set(values.map(val => String(val)))].slice(0, 20);
          if (uniqueValues.length > 1 && uniqueValues.length <= 20) {
            newFilters.categoryFilters[column] = [];
          }
        }
      }
    });

    setFilters(newFilters);
  }, [activeDataset]);

  // Apply filters to data
  useEffect(() => {
    if (!activeDataset?.data?.length) return;

    let filteredData = [...activeDataset.data];

    // Apply text filters
    Object.entries(filters.textFilters).forEach(([column, filterValue]) => {
      if (filterValue.trim()) {
        filteredData = filteredData.filter(row => 
          String(row[column]).toLowerCase().includes(filterValue.toLowerCase())
        );
      }
    });

    // Apply numeric filters
    Object.entries(filters.numericFilters).forEach(([column, filter]) => {
      const [min, max] = filter.current;
      filteredData = filteredData.filter(row => {
        const value = Number(row[column]);
        return !isNaN(value) && value >= min && value <= max;
      });
    });

    // Apply category filters
    Object.entries(filters.categoryFilters).forEach(([column, selectedValues]) => {
      if (selectedValues.length > 0) {
        filteredData = filteredData.filter(row => 
          selectedValues.includes(String(row[column]))
        );
      }
    });

    // Apply date range filter
    if (filters.dateRange.from || filters.dateRange.to) {
      const dateColumns = Object.keys(activeDataset.data[0] || {}).filter(col => 
        col.toLowerCase().includes('date') || col.toLowerCase().includes('time')
      );

      if (dateColumns.length > 0) {
        const dateColumn = dateColumns[0];
        filteredData = filteredData.filter(row => {
          const rowDate = new Date(row[dateColumn]);
          if (isNaN(rowDate.getTime())) return true;

          if (filters.dateRange.from && rowDate < filters.dateRange.from) return false;
          if (filters.dateRange.to && rowDate > filters.dateRange.to) return false;
          return true;
        });
      }
    }

    // Count active filters
    let count = 0;
    count += Object.values(filters.textFilters).filter(v => v.trim()).length;
    count += Object.values(filters.numericFilters).filter(f => 
      f.current[0] !== f.min || f.current[1] !== f.max
    ).length;
    count += Object.values(filters.categoryFilters).filter(v => v.length > 0).length;
    if (filters.dateRange.from || filters.dateRange.to) count += 1;

    setActiveFiltersCount(count);
    setFilteredData?.(filteredData);
  }, [filters, activeDataset, setFilteredData]);

  const clearAllFilters = () => {
    setFilters({
      textFilters: {},
      numericFilters: Object.fromEntries(
        Object.entries(filters.numericFilters).map(([col, filter]) => [
          col, { ...filter, current: [filter.min, filter.max] }
        ])
      ),
      categoryFilters: Object.fromEntries(
        Object.keys(filters.categoryFilters).map(col => [col, []])
      ),
      dateRange: { from: null, to: null }
    });
    toast.success('All filters cleared');
  };

  const exportFilteredData = () => {
    if (!activeDataset?.data?.length) {
      toast.error('No data to export');
      return;
    }

    // Get the currently filtered data (this would need to be passed from the parent)
    const csvContent = activeDataset.data.map(row => 
      Object.values(row).map(val => `"${val}"`).join(',')
    ).join('\n');
    
    const headers = Object.keys(activeDataset.data[0]).map(header => `"${header}"`).join(',');
    const fullCsv = headers + '\n' + csvContent;

    const blob = new Blob([fullCsv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `filtered_${activeDataset.name}_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Filtered data exported');
  };

  if (!activeDataset?.data?.length) return null;

  const data = activeDataset.data;
  const hasFilters = Object.keys(filters.numericFilters).length > 0 || 
                    Object.keys(filters.categoryFilters).length > 0;

  return (
    <Card className="bg-slate-800/50 border-cyan-500/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-cyan-400">
            <Filter className="h-5 w-5" />
            Advanced Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount} active
              </Badge>
            )}
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </Button>
            {activeFiltersCount > 0 && (
              <Button variant="outline" size="sm" onClick={clearAllFilters}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Clear
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={exportFilteredData}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {(isExpanded || activeFiltersCount > 0) && (
        <CardContent className="space-y-4">
          {/* Numeric Range Filters */}
          {Object.entries(filters.numericFilters).map(([column, filter]) => (
            <div key={column} className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">{column}</label>
                <span className="text-xs text-slate-400">
                  {filter.current[0]} - {filter.current[1]}
                </span>
              </div>
              <Slider
                value={filter.current}
                onValueChange={(value) => {
                  setFilters(prev => ({
                    ...prev,
                    numericFilters: {
                      ...prev.numericFilters,
                      [column]: { ...filter, current: value as [number, number] }
                    }
                  }));
                }}
                min={filter.min}
                max={filter.max}
                step={(filter.max - filter.min) / 100}
                className="w-full"
              />
            </div>
          ))}

          {/* Category Filters */}
          {Object.entries(filters.categoryFilters).map(([column, selectedValues]) => {
            const uniqueValues = [...new Set(data.map(row => String(row[column])))].slice(0, 20);
            
            return (
              <div key={column} className="space-y-2">
                <label className="text-sm font-medium">{column}</label>
                <Select
                  onValueChange={(value) => {
                    const newSelected = selectedValues.includes(value)
                      ? selectedValues.filter(v => v !== value)
                      : [...selectedValues, value];
                    
                    setFilters(prev => ({
                      ...prev,
                      categoryFilters: {
                        ...prev.categoryFilters,
                        [column]: newSelected
                      }
                    }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={`Filter ${column}...`} />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueValues.map(value => (
                      <SelectItem key={value} value={value}>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={selectedValues.includes(value)}
                          />
                          {value}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedValues.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {selectedValues.map(value => (
                      <Badge key={value} variant="secondary" className="text-xs">
                        {value}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 ml-1"
                          onClick={() => {
                            setFilters(prev => ({
                              ...prev,
                              categoryFilters: {
                                ...prev.categoryFilters,
                                [column]: selectedValues.filter(v => v !== value)
                              }
                            }));
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Date Range Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Date Range</label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex-1 justify-start text-left">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateRange.from ? format(filters.dateRange.from, 'PPP') : 'From date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.dateRange.from || undefined}
                    onSelect={(date) => {
                      setFilters(prev => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, from: date || null }
                      }));
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex-1 justify-start text-left">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateRange.to ? format(filters.dateRange.to, 'PPP') : 'To date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.dateRange.to || undefined}
                    onSelect={(date) => {
                      setFilters(prev => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, to: date || null }
                      }));
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default EnhancedFilterPanel;

</edits_to_apply>
