/**
 * Utility functions for chart calculations and predictions
 */

export interface ChartDataPoint {
  name: string;
  accuracy: number;
  date?: Date;
  isPrediction?: boolean;
  [key: string]: any;
}

/**
 * Calculate moving average for a data series
 * @param data Array of data points
 * @param windowSize Size of the moving window (default: 5)
 * @returns Array of moving average values
 */
export function calculateMovingAverage(
  data: ChartDataPoint[],
  windowSize: number = 5
): number[] {
  if (data.length === 0) return [];
  
  return data.map((_, index) => {
    const window = Math.min(windowSize, index + 1);
    const start = Math.max(0, index - window + 1);
    const windowData = data.slice(start, index + 1);
    const sum = windowData.reduce((acc, point) => acc + (point.accuracy || 0), 0);
    return Math.round(sum / windowData.length);
  });
}

/**
 * Generate predictions for future dates using linear regression
 * @param data Array of historical data points
 * @param lastDate Date object of the last data point (for accurate date calculation)
 * @param days Number of days to predict ahead
 * @returns Array of predicted data points
 */
export function generatePredictions(
  data: ChartDataPoint[],
  lastDate: Date,
  days: number = 5
): ChartDataPoint[] {
  if (data.length < 2) {
    // Not enough data for prediction, return empty array
    return [];
  }

  // Simple linear regression
  const n = data.length;
  const xValues = Array.from({ length: n }, (_, i) => i);
  const yValues = data.map(d => d.accuracy || 0);

  // Calculate slope and intercept
  const sumX = xValues.reduce((a, b) => a + b, 0);
  const sumY = yValues.reduce((a, b) => a + b, 0);
  const sumXY = xValues.reduce((sum, x, i) => sum + x * yValues[i], 0);
  const sumXX = xValues.reduce((sum, x) => sum + x * x, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // Generate predictions
  const predictions: ChartDataPoint[] = [];
  
  for (let i = 1; i <= days; i++) {
    const futureDate = new Date(lastDate);
    futureDate.setDate(futureDate.getDate() + i);
    
    const predictedValue = Math.max(0, Math.min(100, Math.round(slope * (n + i - 1) + intercept)));
    
    predictions.push({
      name: futureDate.toLocaleDateString('th-TH', { month: 'short', day: 'numeric' }),
      accuracy: predictedValue,
      isPrediction: true,
    });
  }

  return predictions;
}

/**
 * Calculate average accuracy from data
 * @param data Array of data points
 * @returns Average accuracy
 */
export function calculateAverage(data: ChartDataPoint[]): number {
  if (data.length === 0) return 0;
  const sum = data.reduce((acc, point) => acc + (point.accuracy || 0), 0);
  return Math.round(sum / data.length);
}

/**
 * Calculate improvement rate comparing first half vs second half
 * @param data Array of data points
 * @returns Improvement rate in percentage
 */
export function calculateImprovementRate(data: ChartDataPoint[]): number {
  if (data.length < 4) return 0; // Need at least 4 data points

  const midPoint = Math.floor(data.length / 2);
  const firstHalf = data.slice(0, midPoint);
  const secondHalf = data.slice(midPoint);

  const firstAvg = calculateAverage(firstHalf);
  const secondAvg = calculateAverage(secondHalf);

  if (firstAvg === 0) return secondAvg > 0 ? 100 : 0;
  
  const improvement = ((secondAvg - firstAvg) / firstAvg) * 100;
  return Math.round(improvement);
}

/**
 * Determine trend direction from data
 * @param data Array of data points
 * @returns 'up' | 'down' | 'stable'
 */
export function determineTrend(data: ChartDataPoint[]): 'up' | 'down' | 'stable' {
  if (data.length < 3) return 'stable';

  // Compare first third vs last third
  const third = Math.floor(data.length / 3);
  const firstThird = data.slice(0, third);
  const lastThird = data.slice(-third);

  const firstAvg = calculateAverage(firstThird);
  const lastAvg = calculateAverage(lastThird);

  const diff = lastAvg - firstAvg;
  const threshold = 2; // 2% threshold for stability

  if (Math.abs(diff) < threshold) return 'stable';
  return diff > 0 ? 'up' : 'down';
}

/**
 * Calculate best and worst accuracy values
 * @param data Array of data points
 * @returns Object with best and worst values
 */
export function calculateBestWorst(data: ChartDataPoint[]): { best: number; worst: number } {
  if (data.length === 0) return { best: 0, worst: 0 };

  const accuracies = data.map(d => d.accuracy || 0);
  return {
    best: Math.max(...accuracies),
    worst: Math.min(...accuracies),
  };
}

/**
 * Calculate statistics summary for chart data
 * @param data Array of data points
 * @returns Statistics object
 */
export function calculateStatistics(data: ChartDataPoint[]) {
  const average = calculateAverage(data);
  const improvement = calculateImprovementRate(data);
  const { best, worst } = calculateBestWorst(data);
  const trend = determineTrend(data);

  return {
    average,
    improvement,
    best,
    worst,
    trend,
  };
}
