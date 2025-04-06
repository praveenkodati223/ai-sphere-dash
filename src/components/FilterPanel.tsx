
import React, { useEffect } from 'react';
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
import { useVisualization } from '@/contexts/VisualizationContext';
import { toast } from "sonner";

const FilterPanel = () => {
  const { 
    dateRange, 
    setDateRange, 
    availableCategories, 
    availableRegions,
    activeDataset,
    analyzeData
  } = useVisualization();
  
  const [showOutliers, setShowOutliers] = React.useState<boolean>(false);
  const [minValue, setMinValue] = React.useState<string>('0');
  const [maxValue, setMaxValue] = React.useState<string>('1000');
  const [category, setCategory] = React.useState<string>('all');
  const [region, setRegion] = React.useState<string>('all');
  
  // Reset filters when dataset changes
  useEffect(() => {
    if (activeDataset) {
      // Calculate min and max values from dataset
      const values = activeDataset.data.map(item => item.value || 
        (item.q1 + item.q2 + item.q3 + item.q4));
      
      const min = Math.floor(Math.min(...values));
      const max = Math.ceil(Math.max(...values));
      
      setMinValue(min.toString());
      setMaxValue(max.toString());
      setCategory('all');
      setRegion('all');
      
      // Also reset date range to default
      setDateRange([30, 90]);
    }
  }, [activeDataset, setDateRange]);
  
  const handleReset = () => {
    if (activeDataset) {
      const values = activeDataset.data.map(item => item.value || 
        (item.q1 + item.q2 + item.q3 + item.q4));
      
      const min = Math.floor(Math.min(...values));
      const max = Math.ceil(Math.max(...values));
      
      setShowOutliers(false);
      setMinValue(min.toString());
      setMaxValue(max.toString());
      setCategory('all');
      setRegion('all');
      setDateRange([30, 90]);
      toast.success("Filters reset to match your imported data");
    } else {
      setShowOutliers(false);
      setMinValue('0');
      setMaxValue('1000');
      setCategory('all');
      setRegion('all');
      setDateRange([30, 90]);
      toast.success("Filters reset to default");
    }
  };
  
  const handleApply = () => {
    // Trigger a new analysis with the current filters
    analyzeData();
    toast.success("Filters applied to visualization");
  };
  
  return (
    <div className="glass p-6 rounded-lg space-y-5">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Filters</h3>
        {activeDataset && (
          <span className="text-xs text-sphere-cyan">
            {activeDataset.name}
          </span>
        )}
      </div>
      
      <div className="space-y-5">
        {availableCategories.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {availableCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        {availableRegions.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="region">Region</Label>
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger id="region">
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {availableRegions.map((reg) => (
                  <SelectItem key={reg} value={reg}>{reg}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            onValueChange={setDateRange as any}
            className="my-4"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="min-value">Minimum Value</Label>
          <Input 
            id="min-value" 
            type="number" 
            placeholder="0"
            value={minValue}
            onChange={(e) => setMinValue(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="max-value">Maximum Value</Label>
          <Input 
            id="max-value" 
            type="number" 
            placeholder="1000"
            value={maxValue}
            onChange={(e) => setMaxValue(e.target.value)}
          />
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
          >
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
