
import React, { useEffect, useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useVisualization } from '@/contexts/VisualizationContext';
import { toast } from "sonner";
import { 
  ChevronDown, 
  ChevronUp, 
  Eye, 
  EyeOff, 
  Filter, 
  Check, 
  X,
  Download,
  RefreshCw
} from "lucide-react";

const FilterPanel = () => {
  const { 
    dateRange, 
    setDateRange, 
    availableCategories, 
    availableRegions,
    activeDataset,
    analyzeData,
    showOutliers,
    setShowOutliers,
    minValue,
    setMinValue,
    maxValue,
    setMaxValue,
    category,
    setCategory,
    region,
    setRegion,
    isAnalyzing,
    exportData
  } = useVisualization();
  
  const [showDataPreview, setShowDataPreview] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [expandedFilters, setExpandedFilters] = useState(true);
  
  // Reset filters when dataset changes
  useEffect(() => {
    if (activeDataset) {
      // Calculate min and max values from dataset
      let minFound = Infinity;
      let maxFound = -Infinity;
      
      activeDataset.data.forEach(item => {
        // Try to find numeric values in any column
        Object.values(item).forEach(value => {
          const numValue = parseFloat(value as string);
          if (!isNaN(numValue)) {
            minFound = Math.min(minFound, numValue);
            maxFound = Math.max(maxFound, numValue);
          }
        });
      });
      
      // Default to 0-1000 if no numeric values found
      if (minFound === Infinity) minFound = 0;
      if (maxFound === -Infinity) maxFound = 1000;
      
      setMinValue(Math.floor(minFound));
      setMaxValue(Math.ceil(maxFound));
      setCategory('all');
      setRegion('all');
      
      // Also reset date range to default
      setDateRange([30, 90]);
      
      // Reset selected rows
      setSelectedRows([]);
    }
  }, [activeDataset, setDateRange, setMinValue, setMaxValue, setCategory, setRegion]);
  
  const handleReset = () => {
    if (activeDataset) {
      let minFound = Infinity;
      let maxFound = -Infinity;
      
      activeDataset.data.forEach(item => {
        Object.values(item).forEach(value => {
          const numValue = parseFloat(value as string);
          if (!isNaN(numValue)) {
            minFound = Math.min(minFound, numValue);
            maxFound = Math.max(maxFound, numValue);
          }
        });
      });
      
      if (minFound === Infinity) minFound = 0;
      if (maxFound === -Infinity) maxFound = 1000;
      
      setShowOutliers(false);
      setMinValue(Math.floor(minFound));
      setMaxValue(Math.ceil(maxFound));
      setCategory('all');
      setRegion('all');
      setDateRange([30, 90]);
      setSelectedRows([]);
      toast.success("Filters reset to match your imported data");
    }
  };
  
  const handleApply = () => {
    // Validate inputs before applying
    const minVal = parseFloat(minValue.toString());
    const maxVal = parseFloat(maxValue.toString());
    
    if (isNaN(minVal) || isNaN(maxVal)) {
      toast.error("Please enter valid numeric values for min and max");
      return;
    }
    
    if (minVal > maxVal) {
      toast.error("Minimum value cannot be greater than maximum value");
      return;
    }
    
    try {
      // Trigger a new analysis with the current filters
      analyzeData();
      toast.success("Filters applied to visualization");
    } catch (error) {
      console.error("Error applying filters:", error);
      toast.error("Failed to apply filters. Please try again.");
    }
  };
  
  const toggleRowSelection = (index: number) => {
    if (selectedRows.includes(index)) {
      setSelectedRows(selectedRows.filter(i => i !== index));
    } else {
      setSelectedRows([...selectedRows, index]);
    }
  };
  
  const selectAllRows = () => {
    if (!activeDataset) return;
    
    if (selectedRows.length === activeDataset.data.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(Array.from({ length: activeDataset.data.length }, (_, i) => i));
    }
  };
  
  const getSelectedDataSummary = () => {
    if (!selectedRows.length || !activeDataset) return "No data selected";
    return `${selectedRows.length} of ${activeDataset.data.length} rows selected`;
  };
  
  const handleExportData = () => {
    exportData();
    toast.success("Data exported successfully");
  };
  
  if (!activeDataset) {
    return null; // Don't render filter panel if no dataset
  }
  
  // Get all column names from the first row of data
  const columnNames = activeDataset.data.length > 0 ? Object.keys(activeDataset.data[0]) : [];
  
  return (
    <div className="glass p-6 rounded-lg space-y-5">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Filters & Data</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setExpandedFilters(!expandedFilters)}
          className="text-sphere-cyan"
        >
          {expandedFilters ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      {activeDataset && (
        <div className="flex justify-between items-center">
          <span className="text-xs text-sphere-cyan">
            {activeDataset.name}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportData}
              className="text-xs flex items-center gap-1 border-sphere-cyan/30"
            >
              <Download className="h-3 w-3" /> Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDataPreview(!showDataPreview)}
              className="text-xs flex items-center gap-1 border-sphere-cyan/30"
            >
              {showDataPreview ? (
                <>
                  <EyeOff className="h-3 w-3" /> Hide Data
                </>
              ) : (
                <>
                  <Eye className="h-3 w-3" /> View Data
                </>
              )}
            </Button>
          </div>
        </div>
      )}
      
      {showDataPreview && activeDataset && (
        <div className="bg-slate-900 border border-sphere-cyan/20 rounded-md overflow-auto max-h-64">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <div className="flex items-center justify-center">
                    <Switch 
                      checked={selectedRows.length === activeDataset.data.length} 
                      onCheckedChange={selectAllRows}
                    />
                  </div>
                </TableHead>
                {columnNames.map((column, idx) => (
                  <TableHead key={idx}>{column}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeDataset.data.map((item, idx) => (
                <TableRow 
                  key={idx}
                  className={selectedRows.includes(idx) ? "bg-sphere-cyan/10" : ""}
                >
                  <TableCell>
                    <div className="flex items-center justify-center">
                      <Switch 
                        checked={selectedRows.includes(idx)} 
                        onCheckedChange={() => toggleRowSelection(idx)}
                      />
                    </div>
                  </TableCell>
                  {columnNames.map((column, colIdx) => (
                    <TableCell key={colIdx}>
                      {typeof item[column] === 'number' 
                        ? (item[column] as number).toLocaleString() 
                        : String(item[column] || '')}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      {selectedRows.length > 0 && (
        <div className="bg-sphere-purple/10 p-2 rounded-md text-sm">
          <div className="flex justify-between items-center">
            <span>{getSelectedDataSummary()}</span>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 text-xs border-sphere-cyan/30" 
                onClick={() => setSelectedRows([])}
              >
                <X className="h-3 w-3 mr-1" /> Clear
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 text-xs bg-sphere-cyan/10 border-sphere-cyan/30" 
                onClick={handleApply}
              >
                <Check className="h-3 w-3 mr-1" /> Use Selected
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {expandedFilters && (
        <div className="space-y-5 border-t border-white/10 pt-4">
          <div className="flex items-center gap-2 mb-2">
            <Filter className="h-4 w-4 text-sphere-cyan" />
            <span className="font-medium">Filter Options</span>
          </div>
          
          {availableCategories && availableCategories.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category || 'all'} onValueChange={setCategory}>
                <SelectTrigger id="category" className="bg-slate-800 border-sphere-cyan/30">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border border-sphere-cyan/20">
                  <SelectItem value="all">All Categories</SelectItem>
                  {availableCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Filter by product or service category</p>
            </div>
          )}
          
          {availableRegions && availableRegions.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              <Select value={region || 'all'} onValueChange={setRegion}>
                <SelectTrigger id="region" className="bg-slate-800 border-sphere-cyan/30">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border border-sphere-cyan/20">
                  <SelectItem value="all">All Regions</SelectItem>
                  {availableRegions.map((reg) => (
                    <SelectItem key={reg} value={reg}>{reg}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Filter by geographic region</p>
            </div>
          )}
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Date Range (Last {dateRange[1]} days)</Label>
              <span className="text-xs text-muted-foreground">{dateRange[0]}-{dateRange[1]} days</span>
            </div>
            <Slider 
              defaultValue={[30, 90]} 
              max={180} 
              min={1} 
              step={1} 
              value={dateRange}
              onValueChange={setDateRange}
              className="my-4"
            />
            <p className="text-xs text-muted-foreground">Filter data by time period</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="min-value">Minimum Value</Label>
            <Input 
              id="min-value" 
              type="number" 
              placeholder="0"
              value={minValue}
              onChange={(e) => setMinValue(Number(e.target.value))}
              className="bg-slate-800 border-sphere-cyan/30"
            />
            <p className="text-xs text-muted-foreground">Set minimum threshold for values</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="max-value">Maximum Value</Label>
            <Input 
              id="max-value" 
              type="number" 
              placeholder="1000"
              value={maxValue}
              onChange={(e) => setMaxValue(Number(e.target.value))}
              className="bg-slate-800 border-sphere-cyan/30"
            />
            <p className="text-xs text-muted-foreground">Set maximum threshold for values</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="show-outliers" 
              checked={showOutliers}
              onCheckedChange={setShowOutliers}
            />
            <Label htmlFor="show-outliers">Show Outliers</Label>
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              className="border-sphere-cyan/50 hover:border-sphere-cyan hover:bg-sphere-cyan/10 w-1/2"
              onClick={handleReset}
            >
              Reset
            </Button>
            <Button 
              className="bg-gradient-to-r from-sphere-purple to-sphere-cyan hover:opacity-90 w-1/2"
              onClick={handleApply}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? "Applying..." : "Apply"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
