
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useVisualization } from '@/contexts/VisualizationContext';
import { Filter, Eye, Download } from "lucide-react";
import { toast } from "sonner";

const FilterPanel = () => {
  const { activeDataset, exportData } = useVisualization();
  const [isOpen, setIsOpen] = useState(false);
  
  const handleExportData = () => {
    if (!activeDataset) {
      toast.error("No data to export");
      return;
    }
    exportData();
    toast.success("Data exported successfully");
  };
  
  if (!activeDataset) {
    return null;
  }
  
  // Get column names from the first row of data
  const columnNames = activeDataset.data.length > 0 ? Object.keys(activeDataset.data[0]) : [];
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="border-sphere-cyan/30 hover:border-sphere-cyan hover:bg-sphere-cyan/10"
        >
          <Filter className="h-4 w-4 mr-1" />
          Data ({activeDataset.data.length} rows)
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[600px] max-h-[400px] overflow-auto bg-slate-900 border border-sphere-cyan/20">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium text-sphere-cyan">{activeDataset.name}</h4>
              <p className="text-xs text-slate-400">{activeDataset.description}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportData}
              className="text-xs flex items-center gap-1 border-sphere-cyan/30"
            >
              <Download className="h-3 w-3" /> Export
            </Button>
          </div>
          
          <div className="border border-sphere-cyan/20 rounded-md overflow-auto max-h-64">
            <Table>
              <TableHeader>
                <TableRow>
                  {columnNames.map((column, idx) => (
                    <TableHead key={idx} className="text-sphere-cyan">{column}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeDataset.data.slice(0, 10).map((item, idx) => (
                  <TableRow key={idx} className="border-sphere-cyan/10">
                    {columnNames.map((column, colIdx) => (
                      <TableCell key={`${idx}-${colIdx}`} className="text-slate-300">
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
          
          {activeDataset.data.length > 10 && (
            <p className="text-xs text-slate-400 text-center">
              Showing first 10 rows of {activeDataset.data.length} total rows
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FilterPanel;
