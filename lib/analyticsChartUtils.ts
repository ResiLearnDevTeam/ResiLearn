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

export interface GroupedBarChartData {
  name: string;
  correct: number;
  incorrect: number;
  accuracy: number;
  total: number;
}

export interface PieChartData {
  name: string;
  value: number;
  fill?: string;
  [key: string]: string | number | undefined;
}

/**
 * Get Thai label for question type
 */
function getQuestionTypeLabel(key: string): string {
  const labelMap: { [key: string]: string } = {
    'normal': 'แบบปกติ',
    'color_to_value_band_by_band': 'สี→ค่า (ทีละแถบ)',
    'color_to_value_full': 'สี→ค่า (เต็ม)',
    'value_to_color_band_by_band': 'ค่า→สี (ทีละแถบ)',
    'value_to_color_full': 'ค่า→สี (เต็ม)',
    'multiple_choice': 'ตัวเลือก',
    'fill_in': 'เติมคำ',
    'color_select': 'เลือกสี'
  };
  return labelMap[key] || key;
}

/**
 * Format deep analytics data for Radar Chart
 * จำกัดแสดงเฉพาะ categories หลัก ไม่เกิน 6 อัน
 */
export function formatRadarData(deepAnalytics: DeepAnalytics): RadarChartData[] {
  const data: RadarChartData[] = [];
  const fullMark = 100;

  // 1. Resistor Type Accuracy (รวมเป็นหมวดเดียว)
  const fourBand = deepAnalytics.resistorTypeErrors.FOUR_BAND;
  const fiveBand = deepAnalytics.resistorTypeErrors.FIVE_BAND;
  
  if (fourBand.correct + fourBand.incorrect > 0) {
    data.push({
      category: '4 แถบ',
      value: fourBand.accuracy,
      fullMark
    });
  }
  if (fiveBand.correct + fiveBand.incorrect > 0) {
    data.push({
      category: '5 แถบ',
      value: fiveBand.accuracy,
      fullMark
    });
  }

  // 2. Question Type Accuracy (เลือกเฉพาะหลัก)
  const questionTypeKeys = Object.keys(deepAnalytics.questionTypeErrors);
  questionTypeKeys.forEach((key) => {
    const qt = deepAnalytics.questionTypeErrors[key];
    if (qt.correct + qt.incorrect > 0) {
      data.push({
        category: getQuestionTypeLabel(key),
        value: qt.accuracy,
        fullMark
      });
    }
  });

  // 3. ตำแหน่งที่มีปัญหา (เลือกเฉพาะตำแหน่งหลัก)
  const positions = [
    { key: 'position1', label: 'หลักที่ 1' },
    { key: 'position2', label: 'หลักที่ 2' },
    { key: 'multiplier', label: 'ตัวคูณ' },
    { key: 'tolerance', label: 'ค่าความคลาดเคลื่อน' }
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

  // จำกัดไม่เกิน 8 categories และเรียงตาม value
  return data.slice(0, 8);
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
): GroupedBarChartData[] {
  const data: GroupedBarChartData[] = [];

  Object.keys(questionTypeErrors).forEach((key) => {
    const qt = questionTypeErrors[key];
    const total = qt.correct + qt.incorrect;
    if (total > 0) {
      data.push({
        name: getQuestionTypeLabel(key),
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

