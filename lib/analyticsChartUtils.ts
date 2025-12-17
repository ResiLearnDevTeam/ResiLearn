// Helper functions for formatting deep analytics data for charts
import { DeepAnalytics } from './analyticsUtils';

export interface RadarChartData {
  category: string;
  value: number;
  fullMark: number;
}

export interface HeatmapData {
  correct: string;
  user: string;
  count: number;
}

export interface BarChartData {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface PieChartData {
  name: string;
  value: number;
  fill?: string;
}

/**
 * Format deep analytics data for Radar Chart
 */
export function formatRadarData(deepAnalytics: DeepAnalytics): RadarChartData[] {
  const data: RadarChartData[] = [];
  const fullMark = 100;

  // Resistor Type Accuracy
  if (deepAnalytics.resistorTypeErrors.FOUR_BAND.correct + deepAnalytics.resistorTypeErrors.FOUR_BAND.incorrect > 0) {
    data.push({
      category: '4-Band',
      value: deepAnalytics.resistorTypeErrors.FOUR_BAND.accuracy,
      fullMark
    });
  }
  if (deepAnalytics.resistorTypeErrors.FIVE_BAND.correct + deepAnalytics.resistorTypeErrors.FIVE_BAND.incorrect > 0) {
    data.push({
      category: '5-Band',
      value: deepAnalytics.resistorTypeErrors.FIVE_BAND.accuracy,
      fullMark
    });
  }

  // Question Type Accuracy
  Object.keys(deepAnalytics.questionTypeErrors).forEach((key) => {
    const qt = deepAnalytics.questionTypeErrors[key];
    if (qt.correct + qt.incorrect > 0) {
      const label = key
        .replace('_', ' ')
        .replace('color to value', 'Color→Value')
        .replace('value to color', 'Value→Color')
        .replace('band by band', 'Band-by-Band')
        .replace('full', 'Full');
      data.push({
        category: label,
        value: qt.accuracy,
        fullMark
      });
    }
  });

  // Digit Position Accuracy (inverse of error rate)
  const positions = [
    { key: 'position1', label: 'หลักที่ 1' },
    { key: 'position2', label: 'หลักที่ 2' },
    { key: 'position3', label: 'หลักที่ 3' },
    { key: 'multiplier', label: 'ตัวคูณ' },
    { key: 'tolerance', label: 'ความคลาดเคลื่อน' }
  ];

  positions.forEach(({ key, label }) => {
    const pos = deepAnalytics.digitPositionErrors[key as keyof typeof deepAnalytics.digitPositionErrors];
    if (pos.total > 0) {
      const accuracy = 100 - pos.errorRate;
      data.push({
        category: label,
        value: accuracy,
        fullMark
      });
    }
  });

  return data;
}

/**
 * Format color confusion matrix for Heatmap
 */
export function formatHeatmapData(colorConfusion: DeepAnalytics['colorConfusion']): HeatmapData[] {
  const data: HeatmapData[] = [];

  Object.keys(colorConfusion).forEach((correctColor) => {
    const wrongColors = colorConfusion[correctColor];
    Object.keys(wrongColors).forEach((userColor) => {
      if (wrongColors[userColor] > 0) {
        data.push({
          correct: correctColor,
          user: userColor,
          count: wrongColors[userColor]
        });
      }
    });
  });

  return data.sort((a, b) => b.count - a.count);
}

/**
 * Format digit position errors for Bar Chart
 */
export function formatBarChartData(
  digitPositionErrors: DeepAnalytics['digitPositionErrors'],
  includeComparison: boolean = false
): BarChartData[] {
  const data: BarChartData[] = [];

  const positions = [
    { key: 'position1', label: 'หลักที่ 1' },
    { key: 'position2', label: 'หลักที่ 2' },
    { key: 'position3', label: 'หลักที่ 3' },
    { key: 'multiplier', label: 'ตัวคูณ' },
    { key: 'tolerance', label: 'ความคลาดเคลื่อน' }
  ];

  positions.forEach(({ key, label }) => {
    const pos = digitPositionErrors[key as keyof typeof digitPositionErrors];
    if (pos.total > 0) {
      const item: BarChartData = {
        name: label,
        value: pos.errorRate
      };
      data.push(item);
    }
  });

  return data;
}

/**
 * Format tolerance errors for Pie Chart
 */
export function formatPieChartData(toleranceErrors: DeepAnalytics['toleranceErrors']): PieChartData[] {
  const data: PieChartData[] = [];
  const colors = [
    '#ef4444', // red
    '#f97316', // orange
    '#eab308', // yellow
    '#10b981', // green
    '#3b82f6', // blue
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#06b6d4'  // cyan
  ];

  let colorIndex = 0;
  Object.keys(toleranceErrors).forEach((tolerance) => {
    const tol = toleranceErrors[tolerance];
    const total = tol.correct + tol.incorrect;
    if (total > 0 && tol.incorrect > 0) {
      data.push({
        name: tolerance,
        value: tol.incorrect,
        fill: colors[colorIndex % colors.length]
      });
      colorIndex++;
    }
  });

  return data.sort((a, b) => b.value - a.value);
}

/**
 * Get top N resistor value errors
 */
export function getTopResistorValueErrors(
  resistorValueErrors: DeepAnalytics['resistorValueErrors'],
  limit: number = 10
): BarChartData[] {
  const data: BarChartData[] = [];

  Object.keys(resistorValueErrors).forEach((value) => {
    const rv = resistorValueErrors[value];
    if (rv.incorrect > 0) {
      data.push({
        name: value,
        value: rv.incorrect,
        accuracy: rv.accuracy
      });
    }
  });

  return data
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

/**
 * Format question type errors for Grouped Bar Chart
 */
export function formatQuestionTypeComparisonData(
  questionTypeErrors: DeepAnalytics['questionTypeErrors']
): BarChartData[] {
  const data: BarChartData[] = [];

  Object.keys(questionTypeErrors).forEach((key) => {
    const qt = questionTypeErrors[key];
    const total = qt.correct + qt.incorrect;
    if (total > 0) {
      const label = key
        .replace('_', ' ')
        .replace('color to value', 'Color→Value')
        .replace('value to color', 'Value→Color')
        .replace('band by band', 'Band-by-Band')
        .replace('full', 'Full');
      
      data.push({
        name: label,
        correct: qt.correct,
        incorrect: qt.incorrect,
        accuracy: qt.accuracy,
        total
      });
    }
  });

  return data.sort((a, b) => (b.accuracy as number) - (a.accuracy as number));
}

/**
 * Get unique colors from confusion matrix
 */
export function getUniqueColors(colorConfusion: DeepAnalytics['colorConfusion']): string[] {
  const colors = new Set<string>();

  Object.keys(colorConfusion).forEach((correctColor) => {
    colors.add(correctColor);
    Object.keys(colorConfusion[correctColor]).forEach((userColor) => {
      colors.add(userColor);
    });
  });

  return Array.from(colors).sort();
}

/**
 * Get color name in Thai
 */
export function getColorNameThai(color: string): string {
  const colorMap: { [key: string]: string } = {
    black: 'ดำ',
    brown: 'น้ำตาล',
    red: 'แดง',
    orange: 'ส้ม',
    yellow: 'เหลือง',
    green: 'เขียว',
    blue: 'น้ำเงิน',
    violet: 'ม่วง',
    gray: 'เทา',
    white: 'ขาว',
    gold: 'ทอง',
    silver: 'เงิน'
  };

  return colorMap[color.toLowerCase()] || color;
}

