
import { toast } from "sonner";

interface OpenAIChartRequest {
  query: string;
  dataInfo: {
    rowCount: number;
    columns: string[];
    columnTypes: Record<string, string>;
    sampleRows: Record<string, any>[];
  };
}

export interface ChartConfig {
  chartType: string;
  title: string;
  xAxis: {
    dataKey: string;
    label: string;
  };
  yAxis?: {
    dataKey: string;
    label: string;
  };
  series: {
    dataKey: string;
    name: string;
    color?: string;
  }[];
  insights: string[];
  summary: string;
}

// Get the OpenAI API key from environment variables
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

// Function to generate chart configuration from user query
export const generateChartFromQuery = async (
  query: string,
  dataInfo: OpenAIChartRequest["dataInfo"]
): Promise<ChartConfig | null> => {
  if (!OPENAI_API_KEY) {
    toast.error("OpenAI API key is not configured. Please check your environment variables.");
    return null;
  }

  try {
    toast.info("Analyzing your data and generating visualization...");
    
    // Determine if this is a question or a chart request
    const isQuestion = /^(what|who|why|how|when|where|can|could|does|do|is|are|will|should)\b/i.test(query.trim());
    
    const prompt = isQuestion
      ? `
Answer the following question about the data:

DATA INFORMATION:
- Row count: ${dataInfo.rowCount}
- Columns: ${dataInfo.columns.join(', ')}
- Column types: ${JSON.stringify(dataInfo.columnTypes)}
- Sample data: ${JSON.stringify(dataInfo.sampleRows)}

USER QUESTION: "${query}"

Respond concisely with insights from the data. Be specific with numbers and trends. Limit your answer to 3-5 sentences.
`
      : `
Based on the following CSV data and user request, generate a chart configuration:

DATA INFORMATION:
- Row count: ${dataInfo.rowCount}
- Columns: ${dataInfo.columns.join(', ')}
- Column types: ${JSON.stringify(dataInfo.columnTypes)}
- Sample data: ${JSON.stringify(dataInfo.sampleRows)}

USER REQUEST: "${query}"

Based on this data and request, provide:
1. An insightful visualization configuration in JSON
2. Key observations about the data (3-4 bullet points)
3. A concise summary (1-2 sentences)

Return ONLY a valid JSON object with the following structure:
{
  "chartType": "bar|line|pie|scatter|area|donut",
  "title": "Chart title",
  "xAxis": {
    "dataKey": "column_name",
    "label": "X-Axis Label"
  },
  "yAxis": {
    "dataKey": "column_name", 
    "label": "Y-Axis Label"
  },
  "series": [
    {
      "dataKey": "column_name",
      "name": "Series Name",
      "color": "#hexcolor"
    }
  ],
  "insights": [
    "Key insight 1 about the data",
    "Key insight 2 about the data",
    "Key insight 3 about the data"
  ],
  "summary": "A brief summary of what the chart shows"
}

Choose appropriate chart type based on the query and data types. For time series use line charts, for categories use bar charts, for parts of a whole use pie charts, etc.
Make sure all "dataKey" values correspond to actual column names in the dataset.
`;

    console.log("Sending request to OpenAI API with API key:", OPENAI_API_KEY ? "API key exists" : "No API key");
    
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: isQuestion 
              ? "You are a data analyst expert. Your task is to analyze data and provide concise, insightful answers to questions. Focus on patterns, trends, and actionable insights."
              : "You are a data visualization expert. Your task is to generate chart configurations based on CSV data and user queries. Provide both visualization settings and meaningful insights."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("OpenAI API Error:", error);
      throw new Error(`OpenAI API Error: ${error.error?.message || "Unknown error"}`);
    }

    const data = await response.json();
    console.log("OpenAI API Response:", data);
    
    const content = data.choices[0].message.content;
    
    // Handle direct questions differently than visualization requests
    if (isQuestion) {
      toast.success("Analysis complete");
      
      // Create a simplified chart config for questions
      return {
        chartType: "none",
        title: "Data Analysis",
        xAxis: {
          dataKey: "",
          label: ""
        },
        series: [],
        insights: [content.split('\n\n').join(' ')],
        summary: "Analysis of your question about the data"
      };
    }
    
    // For visualization requests, process the JSON response
    try {
      // Extract JSON from response (handle cases where GPT might wrap it in code blocks)
      const jsonMatch = content.match(/```json\n([\s\S]*)\n```/) || content.match(/```([\s\S]*)```/) || [null, content];
      const jsonString = jsonMatch[1] || content;
      
      try {
        const chartConfig = JSON.parse(jsonString);
        console.log("Generated chart config:", chartConfig);
        toast.success("Visualization generated successfully!");
        return chartConfig;
      } catch (jsonError) {
        console.error("Failed to parse JSON from OpenAI response:", jsonString);
        toast.error("Failed to parse chart configuration from AI response");
        return null;
      }
    } catch (error) {
      console.error("OpenAI API error:", error);
      toast.error(`Failed to generate chart: ${error instanceof Error ? error.message : "Unknown error"}`);
      return null;
    }
  } catch (error) {
    console.error("OpenAI API error:", error);
    toast.error(`Failed to generate visualization: ${error instanceof Error ? error.message : "Unknown error"}`);
    return null;
  }
};
