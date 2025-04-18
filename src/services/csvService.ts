
import { toast } from "sonner";
import Papa from "papaparse";

export interface CSVData {
  columns: string[];
  data: Record<string, any>[];
  fileName: string;
}

// Parse CSV file into structured data
export const parseCSVFile = (file: File): Promise<CSVData> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors && results.errors.length > 0) {
          toast.error(`Error parsing CSV: ${results.errors[0].message}`);
          reject(results.errors[0]);
          return;
        }
        
        const columns = results.meta.fields || [];
        const data = results.data as Record<string, any>[];
        
        resolve({
          columns,
          data,
          fileName: file.name
        });
      },
      error: (error) => {
        toast.error(`Failed to parse CSV: ${error.message}`);
        reject(error);
      }
    });
  });
};

// Analyze data types in CSV to help with visualization
export const analyzeDataTypes = (data: Record<string, any>[], columns: string[]) => {
  const columnTypes: Record<string, string> = {};
  
  columns.forEach(column => {
    // Check first 10 values (or all if less than 10)
    const sampleSize = Math.min(data.length, 10);
    let numericCount = 0;
    let dateCount = 0;
    
    for (let i = 0; i < sampleSize; i++) {
      const value = data[i][column];
      
      // Skip empty values
      if (value === null || value === undefined || value === '') continue;
      
      // Try to parse as number
      if (!isNaN(Number(value))) {
        numericCount++;
      }
      
      // Try to parse as date
      if (!isNaN(Date.parse(String(value)))) {
        dateCount++;
      }
    }
    
    // Determine type based on majority
    if (numericCount > sampleSize * 0.7) {
      columnTypes[column] = 'numeric';
    } else if (dateCount > sampleSize * 0.7) {
      columnTypes[column] = 'date';
    } else {
      columnTypes[column] = 'categorical';
    }
  });
  
  return columnTypes;
};

// Prepare data summary for OpenAI
export const prepareDataSummary = (data: Record<string, any>[], columns: string[]) => {
  const columnTypes = analyzeDataTypes(data, columns);
  const rowCount = data.length;
  
  // Get some sample data
  const sampleRows = data.slice(0, 3);
  
  return {
    rowCount,
    columns,
    columnTypes,
    sampleRows
  };
};
