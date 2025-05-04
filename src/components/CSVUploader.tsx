
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { FileIcon, Upload, FileSpreadsheetIcon, Loader2 } from "lucide-react";
import { CSVData, parseCSVFile } from '@/services/csvService';
import { useVisualization } from '@/contexts/VisualizationContext';

const CSVUploader = () => {
  const [fileName, setFileName] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const { importCustomData, analyzeData, setAnalysisType, setCurrentView } = useVisualization();
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === "text/csv") {
        handleCSVUpload(file, file.name.split('.').slice(0, -1).join('.'));
      } else {
        toast.error("Please upload only CSV files");
      }
    }
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileName(file.name);
      
      // Validate file size (100MB limit)
      const fileSizeInMB = file.size / (1024 * 1024);
      if (fileSizeInMB > 100) {
        toast.error(`File size exceeds 100MB limit (${fileSizeInMB.toFixed(2)}MB)`);
        setFileName('');
        return;
      }
      
      // Extract name without extension for dataset name
      const nameWithoutExt = file.name.split('.').slice(0, -1).join('.');
      
      handleCSVUpload(file, nameWithoutExt || file.name);
    }
  };
  
  const handleCSVUpload = async (file: File, datasetName: string) => {
    if (!file) {
      toast.error("Please select a CSV file to upload");
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Parse the CSV file
      const csvData = await parseCSVFile(file);
      
      // Import the raw data directly without transformation
      importCustomData(datasetName, `Imported from ${file.name}`, csvData.data);
      
      // Set the analysis type and switch to data view first
      setAnalysisType('trends');
      setCurrentView('data');
      
      // Force analysis to run
      setTimeout(() => {
        analyzeData();
      }, 500);
      
      toast.success(`Successfully imported ${file.name}`);
    } catch (error) {
      console.error('CSV parsing error:', error);
      toast.error(`Failed to parse CSV file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
      setFileName('');
    }
  };
  
  return (
    <div 
      className={`flex gap-4 ${dragActive ? 'opacity-50' : ''}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <div className="relative flex-1">
        <Input 
          type="file" 
          accept=".csv" 
          className="absolute inset-0 opacity-0 cursor-pointer z-10" 
          onChange={handleFileChange}
          disabled={isUploading}
        />
        <div className={`w-full px-4 py-2 border border-dashed ${dragActive ? 'border-sphere-cyan' : 'border-sphere-cyan/50'} rounded-md text-muted-foreground flex items-center gap-2`}>
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FileSpreadsheetIcon className="h-4 w-4" />
          )}
          {isUploading ? "Processing..." : dragActive ? "Drop CSV file here" : fileName || "Choose CSV file to import"}
        </div>
      </div>
      
      <Button 
        disabled={!fileName || isUploading}
        className="bg-gradient-to-r from-sphere-purple to-sphere-cyan hover:opacity-90 flex gap-2 items-center whitespace-nowrap"
        onClick={() => fileName && document.querySelector<HTMLInputElement>('input[type="file"]')?.files?.[0] && 
          handleCSVUpload(document.querySelector<HTMLInputElement>('input[type="file"]')!.files![0], 
          fileName.split('.').slice(0, -1).join('.'))}
      >
        {isUploading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Upload className="h-4 w-4" />
            Import CSV
          </>
        )}
      </Button>
    </div>
  );
};

export default CSVUploader;
