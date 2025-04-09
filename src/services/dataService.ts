
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

// Generate custom data based on a seed (filename or other identifier)
export const generateCustomData = (seed: string): DataPoint[] => {
  // Use the seed to generate unique categories
  const customCategories = generateCustomCategories(seed);
  const customRegions = ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East'];
  
  return customCategories.map(category => {
    // Use the seed and category to create somewhat deterministic but random-looking values
    const seedNum = Array.from(seed + category).reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const randomMultiplier = (seedNum % 10) + 1;
    
    const q1 = Math.floor(Math.random() * 500 * randomMultiplier) + 100;
    const q2 = Math.floor(Math.random() * 500 * randomMultiplier) + 100;
    const q3 = Math.floor(Math.random() * 500 * randomMultiplier) + 100;
    const q4 = Math.floor(Math.random() * 500 * randomMultiplier) + 100;
    
    return {
      category,
      q1,
      q2,
      q3,
      q4,
      value: q1 + q2 + q3 + q4, // Calculated total for convenience
      region: customRegions[Math.floor(Math.random() * customRegions.length)],
      subCategory: ['Premium', 'Standard', 'Economy'][Math.floor(Math.random() * 3)]
    };
  });
};

// Generate unique categories based on seed
function generateCustomCategories(seed: string): string[] {
  // Use the seed to make different but realistic looking categories
  const businessCategories = [
    'Sales', 'Marketing', 'Finance', 'Operations', 'HR', 'IT', 
    'Product', 'Customer Support', 'R&D', 'Legal', 'Engineering',
    'Manufacturing', 'Logistics', 'Design', 'Quality Assurance'
  ];
  
  const productCategories = [
    'Smartphones', 'Laptops', 'Tablets', 'Wearables', 'Smart Home', 
    'Audio', 'Accessories', 'Cameras', 'Gaming', 'TVs',
    'Appliances', 'Office Equipment', 'Network Devices'
  ];
  
  const retailCategories = [
    'Apparel', 'Footwear', 'Jewelry', 'Beauty', 'Home Goods',
    'Food & Beverage', 'Electronics', 'Sports', 'Toys', 'Books',
    'Health', 'Automotive', 'Garden', 'Pet Supplies'
  ];
  
  // Choose category set based on seed content
  let categorySet: string[];
  if (seed.toLowerCase().includes('business') || seed.toLowerCase().includes('report')) {
    categorySet = businessCategories;
  } else if (seed.toLowerCase().includes('product') || seed.toLowerCase().includes('tech')) {
    categorySet = productCategories;
  } else {
    categorySet = retailCategories;
  }
  
  // Shuffle and select 5-10 categories based on seed length
  const shuffled = categorySet.sort(() => 0.5 - Math.random());
  const numCategories = Math.max(5, Math.min(10, seed.length % 10 + 5));
  return shuffled.slice(0, numCategories);
}

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
  },
  {
    id: 'financial',
    name: 'Financial Data',
    description: 'Revenue and expense data with quarterly breakdown',
    data: generateSampleData(),
    lastUpdated: new Date(),
    analysis: {
      trend: 'Upward',
      insights: [
        'Revenue increased by 12% year over year',
        'Cost reduction measures showing positive results',
        'Q3 showed strongest performance across all categories'
      ]
    }
  },
  {
    id: 'imported-data',
    name: 'Imported Dataset',
    description: 'User imported dataset',
    data: generateSampleData(),
    lastUpdated: new Date(),
    analysis: {
      trend: 'Mixed',
      insights: [
        'Dataset requires detailed analysis',
        'Multiple patterns detected across categories',
        'Consider filtering by region for more insights'
      ]
    }
  },
  {
    id: 'api-data',
    name: 'API Data',
    description: 'Data imported from external API',
    data: generateSampleData(),
    lastUpdated: new Date(),
    analysis: {
      trend: 'Variable',
      insights: [
        'External data shows interesting patterns',
        'Consider refreshing regularly for latest trends',
        'Multiple anomalies detected worth investigating'
      ]
    }
  }
];

// Function to generate data with specific patterns for demo purposes
export const generatePatternedData = (pattern: string): DataPoint[] => {
  switch (pattern) {
    case 'seasonal':
      return sampleCategories.map(category => ({
        category,
        q1: Math.floor(Math.random() * 500) + 100,
        q2: Math.floor(Math.random() * 900) + 600, // Peak in Q2
        q3: Math.floor(Math.random() * 700) + 300,
        q4: Math.floor(Math.random() * 500) + 100,
        region: ['North', 'South', 'East', 'West'][Math.floor(Math.random() * 4)],
        subCategory: ['Premium', 'Standard', 'Economy'][Math.floor(Math.random() * 3)]
      }));

    case 'growing':
      return sampleCategories.map(category => ({
        category,
        q1: Math.floor(Math.random() * 300) + 100,
        q2: Math.floor(Math.random() * 300) + 300,
        q3: Math.floor(Math.random() * 300) + 500,
        q4: Math.floor(Math.random() * 300) + 700, // Growing each quarter
        region: ['North', 'South', 'East', 'West'][Math.floor(Math.random() * 4)],
        subCategory: ['Premium', 'Standard', 'Economy'][Math.floor(Math.random() * 3)]
      }));
      
    case 'anomalies':
      return sampleCategories.map((category, idx) => {
        // Add a big spike to one random category
        const isAnomaly = idx === Math.floor(Math.random() * sampleCategories.length);
        return {
          category,
          q1: Math.floor(Math.random() * 500) + 200,
          q2: Math.floor(Math.random() * 500) + 200,
          q3: isAnomaly ? Math.floor(Math.random() * 2000) + 1500 : Math.floor(Math.random() * 500) + 200, // Anomaly in Q3
          q4: Math.floor(Math.random() * 500) + 200,
          region: ['North', 'South', 'East', 'West'][Math.floor(Math.random() * 4)],
          subCategory: ['Premium', 'Standard', 'Economy'][Math.floor(Math.random() * 3)]
        };
      });
      
    default:
      return generateSampleData();
  }
};
