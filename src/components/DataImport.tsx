
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useVisualization } from '@/contexts/VisualizationContext';

const DataImport = () => {
  const [fileName, setFileName] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [apiUrl, setApiUrl] = useState<string>('');
  const { importSampleData } = useVisualization();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };
  
  const handleUpload = () => {
    if (!fileName) {
      toast.error("Please select a file to upload");
      return;
    }
    
    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      toast.success(`Successfully imported ${fileName}`);
      setIsUploading(false);
      setFileName('');
      
      // Generate a random dataset
      importSampleData('sales-data');
    }, 1500);
  };
  
  const handleApiConnect = () => {
    if (!apiUrl) {
      toast.error("Please enter an API URL");
      return;
    }
    
    setIsUploading(true);
    
    // Simulate API connection
    setTimeout(() => {
      toast.success("Successfully connected to API");
      setIsUploading(false);
      
      // Generate a random dataset
      importSampleData('web-analytics');
    }, 1500);
  };
  
  const handleSampleDataLoad = (datasetId: string) => {
    setIsUploading(true);
    
    // Simulate loading sample data
    setTimeout(() => {
      importSampleData(datasetId);
      setIsUploading(false);
    }, 1000);
  };
  
  return (
    <div className="glass p-6 rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Import Data</h3>
      
      <Tabs defaultValue="file" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="file">File Upload</TabsTrigger>
          <TabsTrigger value="url">URL / API</TabsTrigger>
          <TabsTrigger value="sample">Sample Data</TabsTrigger>
        </TabsList>
        
        <TabsContent value="file" className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Input 
                type="file" 
                accept=".csv,.xlsx,.json" 
                className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                onChange={handleFileChange}
              />
              <div className="w-full px-4 py-2 border border-dashed border-sphere-cyan/50 rounded-md text-muted-foreground">
                {fileName || "Choose CSV, Excel or JSON file"}
              </div>
            </div>
            
            <Button 
              onClick={handleUpload} 
              disabled={!fileName || isUploading}
              className="bg-gradient-to-r from-sphere-purple to-sphere-cyan hover:opacity-90"
            >
              {isUploading ? "Uploading..." : "Import"}
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground">
            Supported formats: CSV, Excel (.xlsx), JSON. Max size: 10MB
          </p>
        </TabsContent>
        
        <TabsContent value="url" className="space-y-4">
          <div className="flex gap-4">
            <Input 
              type="text" 
              placeholder="Enter API URL or data source link"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              className="flex-1"
            />
            <Button 
              variant="outline" 
              className="border-sphere-cyan/50 hover:border-sphere-cyan hover:bg-sphere-cyan/10"
              disabled={isUploading}
              onClick={handleApiConnect}
            >
              Connect
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground">
            Connect to REST APIs, Google Sheets, or public datasets
          </p>
        </TabsContent>
        
        <TabsContent value="sample" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline" 
              className="border-sphere-cyan/50 hover:border-sphere-cyan hover:bg-sphere-cyan/10 h-auto p-4 justify-start"
              onClick={() => handleSampleDataLoad('sales-data')}
              disabled={isUploading}
            >
              <div className="text-left">
                <div className="font-medium">Sales Data</div>
                <div className="text-xs text-muted-foreground">Monthly sales data with products and categories</div>
              </div>
            </Button>
            
            <Button
              variant="outline" 
              className="border-sphere-cyan/50 hover:border-sphere-cyan hover:bg-sphere-cyan/10 h-auto p-4 justify-start"
              onClick={() => handleSampleDataLoad('web-analytics')}
              disabled={isUploading}
            >
              <div className="text-left">
                <div className="font-medium">Website Analytics</div>
                <div className="text-xs text-muted-foreground">Visitor traffic, sources, and conversion rates</div>
              </div>
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataImport;
