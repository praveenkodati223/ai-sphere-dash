
// Sample data for visualizations
export const sampleCategories = ['Electronics', 'Clothing', 'Food', 'Furniture', 'Toys', 'Books', 'Sports'];

export interface DataPoint {
  category: string;
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  value?: number; // For simple charts
  region?: string; // For geographical data
  subCategory?: string; // For hierarchical data
}

export interface DataSet {
  id: string;
  name: string;
  description: string;
  data: DataPoint[];
  lastUpdated?: Date;
  analysis?: {
    trend: string;
    insights: string[];
  };
}

// Generate random sample data
export const generateSampleData = (): DataPoint[] => {
  return sampleCategories.map(category => {
    const q1 = Math.floor(Math.random() * 1000);
    const q2 = Math.floor(Math.random() * 1000);
    const q3 = Math.floor(Math.random() * 1000);
    const q4 = Math.floor(Math.random() * 1000);
    
    return {
      category,
      q1,
      q2,
      q3,
      q4,
      value: q1 + q2 + q3 + q4, // Calculated total for convenience
      region: ['North', 'South', 'East', 'West'][Math.floor(Math.random() * 4)],
      subCategory: ['Premium', 'Standard', 'Economy'][Math.floor(Math.random() * 3)]
    };
  });
};

// Generate hierarchical data for treemap
export const generateTreemapData = () => {
  return sampleCategories.flatMap(category => {
    return ['Premium', 'Standard', 'Economy'].map(subCategory => ({
      category,
      subCategory,
      value: Math.floor(Math.random() * 1000),
    }));
  });
};

// Sample datasets
export const sampleDatasets: DataSet[] = [
  {
    id: 'sales-data',
    name: 'Sales Data',
    description: 'Monthly sales data with products and categories',
    data: generateSampleData(),
    lastUpdated: new Date(),
    analysis: {
      trend: 'Upward',
      insights: [
        'Electronics sales increased by 15% in Q3',
        'Furniture shows seasonal patterns with peaks in Q2',
        'Books remain stable across all quarters'
      ]
    }
  },
  {
    id: 'web-analytics',
    name: 'Website Analytics',
    description: 'Visitor traffic, sources, and conversion rates',
    data: generateSampleData(),
    lastUpdated: new Date(),
    analysis: {
      trend: 'Fluctuating',
      insights: [
        'Mobile traffic surpassed desktop in Q4',
        'Social media referrals increased by 22%',
        'Average session duration decreased slightly'
      ]
    }
  },
  {
    id: 'inventory',
    name: 'Inventory Levels',
    description: 'Current inventory levels across categories',
    data: generateSampleData(),
    lastUpdated: new Date(),
    analysis: {
      trend: 'Stable',
      insights: [
        'Clothing inventory levels are optimal',
        'Electronics stock requires attention due to supply chain issues',
        'Sports equipment showing higher than needed levels'
      ]
    }
  }
];
