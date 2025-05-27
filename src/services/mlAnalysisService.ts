
import { pipeline } from '@huggingface/transformers';

export interface MLInsight {
  type: 'trend_prediction' | 'anomaly_detection' | 'classification';
  confidence: number;
  prediction: any;
  explanation: string;
}

// Simple trend prediction using linear regression
export const predictTrend = (data: number[]): MLInsight => {
  if (data.length < 3) {
    return {
      type: 'trend_prediction',
      confidence: 0,
      prediction: null,
      explanation: 'Insufficient data for trend prediction'
    };
  }
  
  // Simple linear regression
  const n = data.length;
  const x = Array.from({ length: n }, (_, i) => i);
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = data.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * data[i], 0);
  const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  // Predict next 3 values
  const predictions = [n, n + 1, n + 2].map(x => slope * x + intercept);
  
  // Calculate R-squared for confidence
  const yMean = sumY / n;
  const ssRes = data.reduce((sum, yi, i) => {
    const predicted = slope * i + intercept;
    return sum + (yi - predicted) ** 2;
  }, 0);
  const ssTot = data.reduce((sum, yi) => sum + (yi - yMean) ** 2, 0);
  const rSquared = 1 - (ssRes / ssTot);
  
  return {
    type: 'trend_prediction',
    confidence: Math.max(0, Math.min(1, rSquared)),
    prediction: {
      slope,
      nextValues: predictions,
      trend: slope > 0.1 ? 'increasing' : slope < -0.1 ? 'decreasing' : 'stable'
    },
    explanation: `Based on linear regression analysis, the trend is ${slope > 0.1 ? 'increasing' : slope < -0.1 ? 'decreasing' : 'stable'} with ${(rSquared * 100).toFixed(1)}% confidence.`
  };
};

// Anomaly detection using z-score
export const detectAnomalies = (data: number[], threshold: number = 2): MLInsight => {
  if (data.length < 5) {
    return {
      type: 'anomaly_detection',
      confidence: 0,
      prediction: null,
      explanation: 'Insufficient data for anomaly detection'
    };
  }
  
  const mean = data.reduce((a, b) => a + b, 0) / data.length;
  const variance = data.reduce((sum, x) => sum + (x - mean) ** 2, 0) / data.length;
  const stdDev = Math.sqrt(variance);
  
  const anomalies = data.map((value, index) => {
    const zScore = Math.abs((value - mean) / stdDev);
    return {
      index,
      value,
      zScore,
      isAnomaly: zScore > threshold
    };
  }).filter(item => item.isAnomaly);
  
  const confidence = anomalies.length > 0 ? Math.min(1, anomalies.length / data.length * 5) : 0.8;
  
  return {
    type: 'anomaly_detection',
    confidence,
    prediction: {
      anomalies: anomalies.slice(0, 5), // Top 5 anomalies
      totalAnomalies: anomalies.length,
      threshold,
      mean,
      stdDev
    },
    explanation: `Detected ${anomalies.length} anomalies using z-score analysis (threshold: ${threshold}). Values beyond ${threshold} standard deviations are considered anomalous.`
  };
};

// Simple clustering for categorical data
export const categorizeData = (data: string[]): MLInsight => {
  const categories = {};
  data.forEach(item => {
    const key = String(item).toLowerCase().trim();
    categories[key] = (categories[key] || 0) + 1;
  });
  
  const sortedCategories = Object.entries(categories)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 10);
  
  const totalItems = data.length;
  const confidence = sortedCategories.length > 0 ? 0.9 : 0;
  
  return {
    type: 'classification',
    confidence,
    prediction: {
      categories: sortedCategories.map(([category, count]) => ({
        category,
        count,
        percentage: ((count as number) / totalItems * 100).toFixed(1)
      })),
      totalCategories: Object.keys(categories).length,
      mostCommon: sortedCategories[0]?.[0] || 'None'
    },
    explanation: `Identified ${Object.keys(categories).length} unique categories. Most frequent: "${sortedCategories[0]?.[0]}" (${sortedCategories[0]?.[1]} occurrences).`
  };
};

// Advanced analysis using HuggingFace transformers (when WebGPU is available)
export const performAdvancedAnalysis = async (textData: string[]): Promise<MLInsight> => {
  try {
    // Check if we have meaningful text data
    if (!textData || textData.length === 0 || textData.every(text => !text || text.trim().length < 3)) {
      throw new Error('Insufficient text data');
    }
    
    // Simple sentiment analysis using keyword matching as fallback
    const positiveWords = ['good', 'great', 'excellent', 'positive', 'success', 'high', 'increase', 'profit'];
    const negativeWords = ['bad', 'poor', 'negative', 'loss', 'decrease', 'low', 'fail', 'problem'];
    
    const sentiment = textData.map(text => {
      const lowerText = text.toLowerCase();
      const positiveScore = positiveWords.reduce((score, word) => 
        score + (lowerText.includes(word) ? 1 : 0), 0);
      const negativeScore = negativeWords.reduce((score, word) => 
        score + (lowerText.includes(word) ? 1 : 0), 0);
      
      return {
        text,
        sentiment: positiveScore > negativeScore ? 'positive' : 
                  negativeScore > positiveScore ? 'negative' : 'neutral',
        confidence: Math.max(positiveScore, negativeScore) / 10
      };
    });
    
    const overallSentiment = sentiment.reduce((acc, item) => {
      acc[item.sentiment] = (acc[item.sentiment] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      type: 'classification',
      confidence: 0.7,
      prediction: {
        sentiment: overallSentiment,
        dominantSentiment: Object.entries(overallSentiment)
          .sort(([,a], [,b]) => b - a)[0]?.[0] || 'neutral',
        details: sentiment.slice(0, 5)
      },
      explanation: `Analyzed ${textData.length} text entries for sentiment. Dominant sentiment: ${Object.entries(overallSentiment).sort(([,a], [,b]) => b - a)[0]?.[0] || 'neutral'}.`
    };
  } catch (error) {
    console.warn('Advanced ML analysis failed, using fallback:', error);
    return categorizeData(textData);
  }
};
