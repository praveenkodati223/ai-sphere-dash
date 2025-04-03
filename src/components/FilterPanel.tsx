
import React, { useState } from 'react';
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

const FilterPanel = () => {
  const [dateRange, setDateRange] = useState<[number, number]>([30, 90]);
  const [showOutliers, setShowOutliers] = useState<boolean>(false);
  
  return (
    <div className="glass p-6 rounded-lg space-y-5">
      <h3 className="text-xl font-semibold mb-4">Filters</h3>
      
      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select defaultValue="all">
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="electronics">Electronics</SelectItem>
              <SelectItem value="clothing">Clothing</SelectItem>
              <SelectItem value="food">Food & Beverages</SelectItem>
              <SelectItem value="home">Home & Garden</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="region">Region</Label>
          <Select defaultValue="all">
            <SelectTrigger id="region">
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="north">North</SelectItem>
              <SelectItem value="south">South</SelectItem>
              <SelectItem value="east">East</SelectItem>
              <SelectItem value="west">West</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
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
          <Input id="min-value" type="number" placeholder="0" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="max-value">Maximum Value</Label>
          <Input id="max-value" type="number" placeholder="1000" />
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
          >
            Reset
          </Button>
          <Button 
            className="bg-gradient-to-r from-sphere-purple to-sphere-cyan hover:opacity-90 w-1/2"
          >
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
