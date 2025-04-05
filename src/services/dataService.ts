
// Sample data for visualizations
export const sampleCategories = ['Electronics', 'Clothing', 'Food', 'Furniture', 'Toys', 'Books', 'Sports'];

export interface DataPoint {
  category: string;
  q1: number;
  q2: number;
  q3: number;
  q4: number;
}

export interface DataSet {
  id: string;
  name: string;
  description: string;
  data: DataPoint[];
}

// Generate random sample data
export const generateSampleData = (): DataPoint[] => {
  return sampleCategories.map(category => ({
    category,
    q1: Math.floor(Math.random() * 1000),
    q2: Math.floor(Math.random() * 1000),
    q3: Math.floor(Math.random() * 1000),
    q4: Math.floor(Math.random() * 1000),
  }));
};

// Sample datasets
export const sampleDatasets: DataSet[] = [
  {
    id: 'sales-data',
    name: 'Sales Data',
    description: 'Monthly sales data with products and categories',
    data: generateSampleData()
  },
  {
    id: 'web-analytics',
    name: 'Website Analytics',
    description: 'Visitor traffic, sources, and conversion rates',
    data: generateSampleData()
  },
  {
    id: 'inventory',
    name: 'Inventory Levels',
    description: 'Current inventory levels across categories',
    data: generateSampleData()
  }
];
