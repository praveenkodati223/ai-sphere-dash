
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useVisualization } from '@/contexts/VisualizationContext';
import { AlertCircle, FileIcon, InfoIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const DataImport = () => {
  const [fileName, setFileName] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [apiUrl, setApiUrl] = useState<string>('');
  const [datasetName, setDatasetName] = useState<string>('');
  const { importSampleData, clearDatasets, analyzeData, setAnalysisType } = useVisualization();
  const navigate = useNavigate();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileName(file.name);
      
      // Extract name without extension for dataset name
      const nameWithoutExt = file.name.split('.').slice(0, -1).join('.');
      setDatasetName(nameWithoutExt || file.name);
      
      // Validate file size (100MB limit)
      const fileSizeInMB = file.size / (1024 * 1024);
      if (fileSizeInMB > 100) {
        toast.error(`File size exceeds 100MB limit (${fileSizeInMB.toFixed(2)}MB)`);
        setFileName('');
        return;
      }
    }
  };
  
  const handleUpload = () => {
    if (!fileName) {
      toast.error("Please select a file to upload");
      return;
    }
    
    setIsUploading(true);
    
    // First clear existing datasets
    clearDatasets();
    
    // Simulate upload process with longer timeout to emulate large file processing
    setTimeout(() => {
      const name = datasetName || fileName.split('.')[0];
      
      // Generate a random dataset with the file name
      importSampleData('imported-data', name, `Imported from ${fileName}`);
      
      toast.success(`Successfully imported ${fileName}`);
      setIsUploading(false);
      setFileName('');
      setDatasetName('');
      
      // Set the analysis type to trends by default
      setAnalysisType('trends');
      
      // Navigate to analytics page and force a refresh
      navigate('/analytics?refresh=' + Date.now());
    }, 1500);
  };
  
  const handleApiConnect = () => {
    if (!apiUrl) {
      toast.error("Please enter an API URL");
      return;
    }
    
    setIsUploading(true);
    
    // First clear existing datasets
    clearDatasets();
    
    // Simulate API connection
    setTimeout(() => {
      try {
        // Use API URL as the dataset name
        const apiName = new URL(apiUrl).hostname.replace('www.', '');
        
        importSampleData('api-data', `${apiName} Data`, `Imported from API: ${apiUrl}`);
        
        toast.success("Successfully connected to API");
        setIsUploading(false);
        setApiUrl('');
        
        // Set the analysis type to trends by default
        setAnalysisType('trends');
        
        // Navigate to analytics page and force a refresh
        navigate('/analytics?refresh=' + Date.now() + '&view=visualization');
      } catch (error) {
        toast.error("Invalid URL format");
        setIsUploading(false);
      }
    }, 1500);
  };
  
  const handleSampleDataLoad = (datasetId: string) => {
    setIsUploading(true);
    
    // First clear existing datasets
    clearDatasets();
    
    // Simulate loading sample data
    setTimeout(() => {
      importSampleData(datasetId);
      setIsUploading(false);
      
      // Set the analysis type to trends by default
      setAnalysisType('trends');
      
      // Navigate to analytics page and force a refresh - include view=visualization to ensure visualization is shown
      navigate('/analytics?refresh=' + Date.now() + '&view=visualization');
    }, 1000);
  };
  
  return (
    <div className="glass p-6 rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Import Data</h3>
      
      <Alert className="mb-4 bg-blue-950/40 border-blue-500/30">
        <InfoIcon className="h-4 w-4 text-blue-500" />
        <AlertTitle>Pro Tip</AlertTitle>
        <AlertDescription>
          After importing data, you'll be taken to the visualization page where you can explore your data with various chart types and analysis tools.
        </AlertDescription>
      </Alert>
      
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
                accept=".csv,.xlsx,.json,.xls,.txt,.xml,.parquet" 
                className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                onChange={handleFileChange}
              />
              <div className="w-full px-4 py-2 border border-dashed border-sphere-cyan/50 rounded-md text-muted-foreground flex items-center gap-2">
                <FileIcon className="h-4 w-4" />
                {fileName || "Choose file to import"}
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
          
          {fileName && (
            <div className="flex gap-2 items-center">
              <Input
                type="text"
                placeholder="Dataset name (optional)"
                value={datasetName}
                onChange={(e) => setDatasetName(e.target.value)}
                className="flex-1"
              />
            </div>
          )}
          
          <p className="text-xs text-muted-foreground">
            Supported formats: CSV, Excel (.xlsx, .xls), JSON, XML, TXT, Parquet. Max size: 100MB
          </p>
          
          <div className="grid grid-cols-3 gap-2 text-xs mt-2">
            <div className="p-2 rounded bg-slate-800/50 border border-white/5">
              <div className="font-semibold mb-1">CSV</div>
              <div className="text-slate-400">Comma-separated values</div>
            </div>
            <div className="p-2 rounded bg-slate-800/50 border border-white/5">
              <div className="font-semibold mb-1">Excel</div>
              <div className="text-slate-400">Spreadsheet files</div>
            </div>
            <div className="p-2 rounded bg-slate-800/50 border border-white/5">
              <div className="font-semibold mb-1">JSON</div>
              <div className="text-slate-400">Structured data</div>
            </div>
          </div>
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
          
          <div className="grid grid-cols-2 gap-2 text-xs mt-2">
            <div className="p-2 rounded bg-slate-800/50 border border-white/5">
              <div className="font-semibold mb-1">REST APIs</div>
              <div className="text-slate-400">Connect to JSON endpoints</div>
            </div>
            <div className="p-2 rounded bg-slate-800/50 border border-white/5">
              <div className="font-semibold mb-1">Web Services</div>
              <div className="text-slate-400">Live data feeds</div>
            </div>
          </div>
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
            
            <Button
              variant="outline" 
              className="border-sphere-cyan/50 hover:border-sphere-cyan hover:bg-sphere-cyan/10 h-auto p-4 justify-start"
              onClick={() => handleSampleDataLoad('inventory')}
              disabled={isUploading}
            >
              <div className="text-left">
                <div className="font-medium">Inventory Data</div>
                <div className="text-xs text-muted-foreground">Stock levels across categories and locations</div>
              </div>
            </Button>
            
            <Button
              variant="outline" 
              className="border-sphere-cyan/50 hover:border-sphere-cyan hover:bg-sphere-cyan/10 h-auto p-4 justify-start"
              onClick={() => handleSampleDataLoad('financial')}
              disabled={isUploading}
            >
              <div className="text-left">
                <div className="font-medium">Financial Data</div>
                <div className="text-xs text-muted-foreground">Revenue and expense data with quarterly breakdown</div>
              </div>
            </Button>
          </div>
          
          <Alert className="mt-2 bg-slate-800/50 border border-white/5">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Sample datasets are perfect for exploring Sphere's visualization capabilities before importing your own data.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataImport;
