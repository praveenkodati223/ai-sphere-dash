
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { HelpCircle, Search, ChevronDown, Upload, BarChart, PieChart, LineChart, Download } from 'lucide-react';

const helpData = [
  {
    category: 'Getting Started',
    icon: <Upload className="h-4 w-4" />,
    questions: [
      {
        question: 'How do I upload data?',
        answer: 'Click on "Import Sample Data" or use the CSV uploader. Supported formats: CSV files with headers. Make sure your data has column names in the first row.'
      },
      {
        question: 'What file formats are supported?',
        answer: 'Currently we support CSV files. Your CSV should have headers in the first row and data should be properly formatted with commas as separators.'
      },
      {
        question: 'How large can my dataset be?',
        answer: 'For optimal performance, we recommend datasets under 10,000 rows. Larger datasets may take longer to process.'
      }
    ]
  },
  {
    category: 'Visualizations',
    icon: <BarChart className="h-4 w-4" />,
    questions: [
      {
        question: 'What chart types are available?',
        answer: 'We support bar charts, line charts, pie charts, scatter plots, area charts, and more. Choose the type that best represents your data relationships.'
      },
      {
        question: 'How do I create a custom chart?',
        answer: 'Use the Query Input to describe what you want to visualize. For example: "Show sales by month as a line chart" or "Compare revenue by region".'
      },
      {
        question: 'Can I customize chart colors?',
        answer: 'Yes, charts automatically use our color scheme, but you can request specific colors in your query like "Show sales in blue" or "Use red for expenses".'
      }
    ]
  },
  {
    category: 'Data Analysis',
    icon: <PieChart className="h-4 w-4" />,
    questions: [
      {
        question: 'What does the smart analysis show?',
        answer: 'Smart analysis detects missing data, duplicates, outliers, and trends in your dataset. It provides warnings and insights automatically.'
      },
      {
        question: 'How are outliers detected?',
        answer: 'We use the Interquartile Range (IQR) method to identify values that fall outside 1.5 times the IQR from the first and third quartiles.'
      },
      {
        question: 'What trends can be detected?',
        answer: 'We analyze increasing, decreasing, or stable trends by comparing the first and second half of your data for numeric columns.'
      }
    ]
  },
  {
    category: 'Export & Sharing',
    icon: <Download className="h-4 w-4" />,
    questions: [
      {
        question: 'How do I export my data?',
        answer: 'Click the Export button in the top right. This will download your current dataset as a CSV file.'
      },
      {
        question: 'Can I save my dashboards?',
        answer: 'Yes, use the saved dashboards feature to save your current visualization setup and reload it later.'
      },
      {
        question: 'How do I share my visualizations?',
        answer: 'Click the Share button to generate a shareable link. You can also export charts as images or save dashboards for later access.'
      }
    ]
  },
  {
    category: 'Troubleshooting',
    icon: <HelpCircle className="h-4 w-4" />,
    questions: [
      {
        question: 'Why are my charts not showing?',
        answer: 'Make sure your data is imported correctly and has numeric columns for chart generation. Check the data preview to verify your data structure.'
      },
      {
        question: 'My CSV upload failed, what should I do?',
        answer: 'Ensure your CSV file has proper headers, uses comma separators, and doesn\'t contain special characters that might break parsing.'
      },
      {
        question: 'How do I fix data quality issues?',
        answer: 'Review the smart analysis insights. Remove duplicates, fill missing values, and address outliers before creating visualizations.'
      }
    ]
  }
];

const HelpAssistant = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openCategories, setOpenCategories] = useState<string[]>([]);
  
  const filteredData = helpData.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => 
        q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);
  
  const toggleCategory = (categoryName: string) => {
    setOpenCategories(prev => 
      prev.includes(categoryName)
        ? prev.filter(name => name !== categoryName)
        : [...prev, categoryName]
    );
  };
  
  return (
    <Card className="bg-slate-800/50 border-blue-500/20 h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-400">
          <HelpCircle className="h-5 w-5" />
          Help Assistant
        </CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search help topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-700/50 border-slate-600"
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-3 max-h-96 overflow-y-auto">
        {filteredData.map((category) => (
          <Collapsible key={category.category} 
            open={openCategories.includes(category.category)}
            onOpenChange={() => toggleCategory(category.category)}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
              <div className="flex items-center gap-2">
                {category.icon}
                <span className="font-medium">{category.category}</span>
                <Badge variant="secondary" className="ml-2">
                  {category.questions.length}
                </Badge>
              </div>
              <ChevronDown className="h-4 w-4 transition-transform data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 mt-2">
              {category.questions.map((qa, index) => (
                <div key={index} className="pl-6 pb-3 border-l-2 border-slate-600">
                  <h4 className="font-medium text-sm mb-1 text-blue-300">{qa.question}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{qa.answer}</p>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        ))}
        
        {filteredData.length === 0 && searchTerm && (
          <div className="text-center py-8">
            <HelpCircle className="h-12 w-12 mx-auto mb-4 text-slate-400" />
            <p className="text-slate-400">No help topics found for "{searchTerm}"</p>
            <p className="text-xs text-slate-500 mt-2">Try different keywords or browse categories above</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HelpAssistant;
