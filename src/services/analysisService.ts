
import { DatasetType } from '@/contexts/VisualizationContext';

export interface AnalysisResult {
  type: 'warning' | 'info' | 'error' | 'success';
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
}

export interface DataQualityReport {
  missingData: {
    columns: string[];
    percentage: number;
  };
  duplicates: {
    count: number;
    percentage: number;
  };
  outliers: {
    column: string;
    values: number[];
    count: number;
  }[];
  trends: {
    column: string;
    trend: 'increasing' | 'decreasing' | 'stable';
    changePercentage: number;
  }[];
}

export const analyzeDataQuality = (dataset: DatasetType): DataQualityReport => {
  const data = dataset.data;
  
  // Detect missing data
  const missingData = detectMissingData(data);
  
  // Detect duplicates
  const duplicates = detectDuplicates(data);
  
  // Detect outliers
  const outliers = detectOutliers(data);
  
  // Analyze trends
  const trends = analyzeTrends(data);
  
  return {
    missingData,
    duplicates,
    outliers,
    trends
  };
};

export const generateSmartInsights = (dataset: DatasetType): AnalysisResult[] => {
  const insights: AnalysisResult[] = [];
  const quality = analyzeDataQuality(dataset);
  
  // Missing data warnings
  if (quality.missingData.percentage > 10) {
    insights.push({
      type: 'warning',
      title: 'Missing Data Detected',
      message: `${quality.missingData.percentage.toFixed(1)}% of your data is missing in columns: ${quality.missingData.columns.join(', ')}`,
      severity: quality.missingData.percentage > 30 ? 'high' : 'medium'
    });
  }
  
  // Duplicate warnings
  if (quality.duplicates.count > 0) {
    insights.push({
      type: 'warning',
      title: 'Duplicate Records Found',
      message: `Found ${quality.duplicates.count} duplicate records (${quality.duplicates.percentage.toFixed(1)}% of total data)`,
      severity: quality.duplicates.percentage > 5 ? 'medium' : 'low'
    });
  }
  
  // Trend insights
  quality.trends.forEach(trend => {
    if (Math.abs(trend.changePercentage) > 20) {
      const direction = trend.trend === 'increasing' ? 'increased' : 'decreased';
      insights.push({
        type: trend.trend === 'decreasing' ? 'warning' : 'info',
        title: `Significant Trend Detected`,
        message: `${trend.column} has ${direction} by ${Math.abs(trend.changePercentage).toFixed(1)}%`,
        severity: Math.abs(trend.changePercentage) > 40 ? 'high' : 'medium'
      });
    }
  });
  
  // Outlier detection
  quality.outliers.forEach(outlier => {
    if (outlier.count > 0) {
      insights.push({
        type: 'info',
        title: 'Outliers Detected',
        message: `Found ${outlier.count} outliers in ${outlier.column}`,
        severity: 'low'
      });
    }
  });
  
  return insights;
};

const detectMissingData = (data: any[]): { columns: string[]; percentage: number } => {
  if (data.length === 0) return { columns: [], percentage: 0 };
  
  const columns = Object.keys(data[0]);
  const missingColumns: string[] = [];
  let totalMissing = 0;
  
  columns.forEach(column => {
    const missing = data.filter(row => 
      row[column] === null || 
      row[column] === undefined || 
      row[column] === '' ||
      (typeof row[column] === 'string' && row[column].trim() === '')
    ).length;
    
    if (missing > data.length * 0.1) { // More than 10% missing
      missingColumns.push(column);
    }
    totalMissing += missing;
  });
  
  return {
    columns: missingColumns,
    percentage: (totalMissing / (data.length * columns.length)) * 100
  };
};

const detectDuplicates = (data: any[]): { count: number; percentage: number } => {
  const seen = new Set();
  let duplicates = 0;
  
  data.forEach(row => {
    const key = JSON.stringify(row);
    if (seen.has(key)) {
      duplicates++;
    } else {
      seen.add(key);
    }
  });
  
  return {
    count: duplicates,
    percentage: (duplicates / data.length) * 100
  };
};

const detectOutliers = (data: any[]): { column: string; values: number[]; count: number }[] => {
  if (data.length === 0) return [];
  
  const numericColumns = Object.keys(data[0]).filter(key => 
    data.some(row => typeof row[key] === 'number')
  );
  
  return numericColumns.map(column => {
    const values = data
      .map(row => row[column])
      .filter(val => typeof val === 'number') as number[];
    
    if (values.length === 0) return { column, values: [], count: 0 };
    
    // Using IQR method for outlier detection
    values.sort((a, b) => a - b);
    const q1 = values[Math.floor(values.length * 0.25)];
    const q3 = values[Math.floor(values.length * 0.75)];
    const iqr = q3 - q1;
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;
    
    const outliers = values.filter(val => val < lowerBound || val > upperBound);
    
    return {
      column,
      values: outliers,
      count: outliers.length
    };
  });
};

const analyzeTrends = (data: any[]): { column: string; trend: 'increasing' | 'decreasing' | 'stable'; changePercentage: number }[] => {
  if (data.length < 2) return [];
  
  const numericColumns = Object.keys(data[0]).filter(key => 
    data.some(row => typeof row[key] === 'number')
  );
  
  return numericColumns.map(column => {
    const values = data
      .map(row => row[column])
      .filter(val => typeof val === 'number') as number[];
    
    if (values.length < 2) {
      return { column, trend: 'stable' as const, changePercentage: 0 };
    }
    
    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));
    
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    
    const changePercentage = ((secondAvg - firstAvg) / firstAvg) * 100;
    
    let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
    if (Math.abs(changePercentage) > 5) {
      trend = changePercentage > 0 ? 'increasing' : 'decreasing';
    }
    
    return { column, trend, changePercentage };
  });
};
