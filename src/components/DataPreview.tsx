import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useVisualization } from '@/contexts/VisualizationContext';
import { 
  Search, 
  SlidersHorizontal, 
  Check, 
  X, 
  Download,
  RefreshCw
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const DataPreview = () => {
  const { activeDataset, analyzeData, exportData } = useVisualization();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [showOnlySelected, setShowOnlySelected] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  if (!activeDataset) return null;
  
  const handleRowSelect = (index: number) => {
    if (selectedRows.includes(index)) {
      setSelectedRows(selectedRows.filter(i => i !== index));
    } else {
      setSelectedRows([...selectedRows, index]);
    }
  };
  
  const handleSelectAll = () => {
    if (selectedRows.length === filteredData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredData.map((_, i) => i));
    }
  };
  
  const handleApply = () => {
    toast.promise(
      async () => {
        await analyzeData();
        return "Selection applied successfully";
      },
      {
        loading: 'Applying selection...',
        success: `Applied selection of ${selectedRows.length} rows`,
        error: 'Failed to apply selection'
      }
    );
  };
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      analyzeData();
      setIsRefreshing(false);
      toast.success("Data refreshed successfully");
    }, 1000);
  };
  
  const handleExport = () => {
    toast.promise(
      async () => {
        await exportData();
        return "Data exported successfully";
      },
      {
        loading: 'Exporting data...',
        success: 'Data exported successfully',
        error: 'Failed to export data'
      }
    );
  };
  
  const filteredData = activeDataset.data
    .filter((item, index) => {
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return Object.values(item).some(val => 
          String(val).toLowerCase().includes(searchLower)
        );
      }
      
      if (showOnlySelected) {
        return selectedRows.includes(index);
      }
      
      return true;
    });
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search data..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSearchTerm('')}
            disabled={!searchTerm}
            className="border-sphere-cyan/30"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center space-x-2">
            <Switch
              id="show-selected"
              checked={showOnlySelected}
              onCheckedChange={setShowOnlySelected}
            />
            <Label htmlFor="show-selected" className="text-xs">Show Selected Only</Label>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
            className="border-sphere-cyan/30"
          >
            {selectedRows.length === filteredData.length ? "Deselect All" : "Select All"}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="border-sphere-cyan/30"
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="border-sphere-cyan/30"
          >
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="bg-slate-900 border border-sphere-cyan/20 rounded-md overflow-auto max-h-[350px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10 text-center">
                <SlidersHorizontal className="h-4 w-4 mx-auto" />
              </TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Q1</TableHead>
              <TableHead>Q2</TableHead>
              <TableHead>Q3</TableHead>
              <TableHead>Q4</TableHead>
              <TableHead>Total</TableHead>
              {activeDataset.data[0]?.region && <TableHead>Region</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item, idx) => {
              const total = item.q1 + item.q2 + item.q3 + item.q4;
              
              return (
                <TableRow 
                  key={idx}
                  className={selectedRows.includes(idx) ? "bg-sphere-cyan/10" : ""}
                >
                  <TableCell>
                    <div className="flex items-center justify-center">
                      <Switch 
                        checked={selectedRows.includes(idx)} 
                        onCheckedChange={() => handleRowSelect(idx)}
                      />
                    </div>
                  </TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.q1.toLocaleString()}</TableCell>
                  <TableCell>{item.q2.toLocaleString()}</TableCell>
                  <TableCell>{item.q3.toLocaleString()}</TableCell>
                  <TableCell>{item.q4.toLocaleString()}</TableCell>
                  <TableCell className="font-semibold">{total.toLocaleString()}</TableCell>
                  {item.region && <TableCell>{item.region}</TableCell>}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      
      {selectedRows.length > 0 && (
        <div className="flex justify-between items-center bg-sphere-purple/10 p-2 rounded-md">
          <span className="text-sm">
            {selectedRows.length} of {activeDataset.data.length} rows selected
          </span>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSelectedRows([])}
              className="text-xs"
            >
              <X className="h-3 w-3 mr-1" /> Clear
            </Button>
            <Button 
              size="sm" 
              onClick={handleApply}
              className="text-xs bg-gradient-to-r from-sphere-purple to-sphere-cyan"
            >
              <Check className="h-3 w-3 mr-1" /> Use Selected
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataPreview;
