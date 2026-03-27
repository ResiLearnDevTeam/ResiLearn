// Utility functions for generating step-by-step explanations for resistor questions

import { colorCodes, formatResistance, getBandLabel } from './resistorUtils';

/**
 * Get Thai color name
 */
function getColorName(color: string | undefined | null): string {
  if (!color || color.trim() === '') return '';
  
  const nameMap: { [key: string]: string } = {
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
    silver: 'เงิน',
  };
  return nameMap[color.toLowerCase()] || color;
}

/**
 * Format multiplier for display
 */
function formatMultiplier(multiplier: number): string {
  if (multiplier >= 1000000000) return '×1G';
  if (multiplier >= 100000000) return '×100M';
  if (multiplier >= 10000000) return '×10M';
  if (multiplier >= 1000000) return '×1M';
  if (multiplier >= 100000) return '×100K';
  if (multiplier >= 10000) return '×10K';
  if (multiplier >= 1000) return '×1K';
  if (multiplier === 0.1) return '×0.1';
  if (multiplier === 0.01) return '×0.01';
  return `×${multiplier}`;
}

/**
 * Generate step-by-step explanation for resistor calculation
 */
export function generateStepByStepExplanation(
  bands: string[],
  resistorType: 'FOUR_BAND' | 'FIVE_BAND',
  resistorValue: number,
  tolerance: string
): string {
  if (!bands || bands.length === 0) {
    return 'ไม่สามารถสร้างเฉลยได้ เนื่องจากไม่มีข้อมูลแถบสี';
  }
  
  const is5Band = resistorType === 'FIVE_BAND';
  const steps: string[] = [];
  
  // Step 1: Explain each band
  if (is5Band) {
    // 5-band resistor
    if (bands.length < 5) {
      return 'ไม่สามารถสร้างเฉลยได้ เนื่องจากข้อมูลแถบสีไม่ครบ (ต้องมี 5 แถบ)';
    }
    
    const digit1 = colorCodes.digit[bands[0] as keyof typeof colorCodes.digit] ?? 0;
    const digit2 = colorCodes.digit[bands[1] as keyof typeof colorCodes.digit] ?? 0;
    const digit3 = colorCodes.digit[bands[2] as keyof typeof colorCodes.digit] ?? 0;
    const multiplier = colorCodes.multiplier[bands[3] as keyof typeof colorCodes.multiplier] ?? 1;
    const tol = colorCodes.tolerance[bands[4] as keyof typeof colorCodes.tolerance] ?? tolerance;
    
    steps.push(`1. แถบที่ 1 (หลักที่ 1): สี${getColorName(bands[0])} = ${digit1}`);
    steps.push(`2. แถบที่ 2 (หลักที่ 2): สี${getColorName(bands[1])} = ${digit2}`);
    steps.push(`3. แถบที่ 3 (หลักที่ 3): สี${getColorName(bands[2])} = ${digit3}`);
    steps.push(`4. แถบที่ 4 (ตัวคูณ): สี${getColorName(bands[3])} = ${formatMultiplier(multiplier)}`);
    steps.push(`5. แถบที่ 5 (ความคลาดเคลื่อน): สี${getColorName(bands[4])} = ${tol}`);
    
    const value = `${digit1}${digit2}${digit3}`;
    const calculatedValue = parseInt(value) * multiplier;
    steps.push('');
    steps.push(`การคำนวณ:`);
    steps.push(`${value} × ${multiplier} = ${calculatedValue}Ω = ${formatResistance(resistorValue, tolerance)}`);
  } else {
    // 4-band resistor
    if (bands.length < 4) {
      return 'ไม่สามารถสร้างเฉลยได้ เนื่องจากข้อมูลแถบสีไม่ครบ (ต้องมี 4 แถบ)';
    }
    
    const digit1 = colorCodes.digit[bands[0] as keyof typeof colorCodes.digit] ?? 0;
    const digit2 = colorCodes.digit[bands[1] as keyof typeof colorCodes.digit] ?? 0;
    const multiplier = colorCodes.multiplier[bands[2] as keyof typeof colorCodes.multiplier] ?? 1;
    const tol = colorCodes.tolerance[bands[3] as keyof typeof colorCodes.tolerance] ?? tolerance;
    
    steps.push(`1. แถบที่ 1 (หลักที่ 1): สี${getColorName(bands[0])} = ${digit1}`);
    steps.push(`2. แถบที่ 2 (หลักที่ 2): สี${getColorName(bands[1])} = ${digit2}`);
    steps.push(`3. แถบที่ 3 (ตัวคูณ): สี${getColorName(bands[2])} = ${formatMultiplier(multiplier)}`);
    steps.push(`4. แถบที่ 4 (ความคลาดเคลื่อน): สี${getColorName(bands[3])} = ${tol}`);
    
    const value = `${digit1}${digit2}`;
    const calculatedValue = parseInt(value) * multiplier;
    steps.push('');
    steps.push(`การคำนวณ:`);
    steps.push(`${value} × ${multiplier} = ${calculatedValue}Ω = ${formatResistance(resistorValue, tolerance)}`);
  }
  
  return steps.join('\n');
}

/**
 * Generate explanation for a specific band (for band-by-band practice)
 */
export function generateBandExplanation(
  bandIndex: number,
  bandColor: string | undefined | null,
  resistorType: 'FOUR_BAND' | 'FIVE_BAND',
  bandValue?: string | number
): string {
  if (!bandColor || bandColor.trim() === '') {
    return `แถบที่ ${bandIndex + 1}: ไม่มีข้อมูลสี`;
  }
  
  const bandLabel = getBandLabel(bandIndex, resistorType);
  const colorName = getColorName(bandColor);
  const is5Band = resistorType === 'FIVE_BAND';
  
  if (is5Band) {
    if (bandIndex <= 2) {
      // Digit band
      const digit = colorCodes.digit[bandColor as keyof typeof colorCodes.digit];
      if (digit === undefined) return `แถบที่ ${bandIndex + 1} (${bandLabel}): สี${colorName}`;
      return `แถบที่ ${bandIndex + 1} (${bandLabel}): สี${colorName} = ${digit}`;
    } else if (bandIndex === 3) {
      // Multiplier band
      const multiplier = colorCodes.multiplier[bandColor as keyof typeof colorCodes.multiplier];
      if (multiplier === undefined) return `แถบที่ ${bandIndex + 1} (${bandLabel}): สี${colorName}`;
      return `แถบที่ ${bandIndex + 1} (${bandLabel}): สี${colorName} = ${formatMultiplier(multiplier)}`;
    } else if (bandIndex === 4) {
      // Tolerance band
      const tolerance = colorCodes.tolerance[bandColor as keyof typeof colorCodes.tolerance];
      if (tolerance === undefined) return `แถบที่ ${bandIndex + 1} (${bandLabel}): สี${colorName}`;
      return `แถบที่ ${bandIndex + 1} (${bandLabel}): สี${colorName} = ${tolerance}`;
    }
  } else {
    if (bandIndex <= 1) {
      // Digit band
      const digit = colorCodes.digit[bandColor as keyof typeof colorCodes.digit];
      if (digit === undefined) return `แถบที่ ${bandIndex + 1} (${bandLabel}): สี${colorName}`;
      return `แถบที่ ${bandIndex + 1} (${bandLabel}): สี${colorName} = ${digit}`;
    } else if (bandIndex === 2) {
      // Multiplier band
      const multiplier = colorCodes.multiplier[bandColor as keyof typeof colorCodes.multiplier];
      if (multiplier === undefined) return `แถบที่ ${bandIndex + 1} (${bandLabel}): สี${colorName}`;
      return `แถบที่ ${bandIndex + 1} (${bandLabel}): สี${colorName} = ${formatMultiplier(multiplier)}`;
    } else if (bandIndex === 3) {
      // Tolerance band
      const tolerance = colorCodes.tolerance[bandColor as keyof typeof colorCodes.tolerance];
      if (tolerance === undefined) return `แถบที่ ${bandIndex + 1} (${bandLabel}): สี${colorName}`;
      return `แถบที่ ${bandIndex + 1} (${bandLabel}): สี${colorName} = ${tolerance}`;
    }
  }
  
  return `แถบที่ ${bandIndex + 1} (${bandLabel}): สี${colorName}`;
}

/**
 * Generate explanation for value to color conversion
 */
export function generateValueToColorExplanation(
  resistorValue: number,
  tolerance: string,
  correctBands: string[],
  resistorType: 'FOUR_BAND' | 'FIVE_BAND'
): string {
  const is5Band = resistorType === 'FIVE_BAND';
  const steps: string[] = [];
  
  steps.push(`ค่า: ${formatResistance(resistorValue, tolerance)}`);
  steps.push('');
  steps.push(`วิธีแปลงค่าเป็นสีแถบ:`);
  
  // Extract digits and multiplier from value
  let valueStr = resistorValue.toString();
  let multiplier = 1;
  
  // Find multiplier
  if (valueStr.length > 3) {
    const zeros = valueStr.length - 3;
    multiplier = Math.pow(10, zeros);
    valueStr = valueStr.substring(0, 3);
  }
  
  if (is5Band) {
    const digit1 = parseInt(valueStr[0]);
    const digit2 = parseInt(valueStr[1]);
    const digit3 = parseInt(valueStr[2]);
    
    // Find colors for each digit
    const color1 = Object.keys(colorCodes.digit).find(
      c => colorCodes.digit[c as keyof typeof colorCodes.digit] === digit1
    ) || '';
    const color2 = Object.keys(colorCodes.digit).find(
      c => colorCodes.digit[c as keyof typeof colorCodes.digit] === digit2
    ) || '';
    const color3 = Object.keys(colorCodes.digit).find(
      c => colorCodes.digit[c as keyof typeof colorCodes.digit] === digit3
    ) || '';
    const color4 = Object.keys(colorCodes.multiplier).find(
      c => colorCodes.multiplier[c as keyof typeof colorCodes.multiplier] === multiplier
    ) || '';
    const color5 = Object.keys(colorCodes.tolerance).find(
      c => colorCodes.tolerance[c as keyof typeof colorCodes.tolerance] === tolerance
    ) || '';
    
    steps.push(`1. แถบที่ 1: ${digit1} → สี${getColorName(color1)}`);
    steps.push(`2. แถบที่ 2: ${digit2} → สี${getColorName(color2)}`);
    steps.push(`3. แถบที่ 3: ${digit3} → สี${getColorName(color3)}`);
    steps.push(`4. แถบที่ 4: ×${multiplier} → สี${getColorName(color4)}`);
    steps.push(`5. แถบที่ 5: ${tolerance} → สี${getColorName(color5)}`);
  } else {
    const digit1 = parseInt(valueStr[0]);
    const digit2 = parseInt(valueStr[1]);
    
    // Find colors for each digit
    const color1 = Object.keys(colorCodes.digit).find(
      c => colorCodes.digit[c as keyof typeof colorCodes.digit] === digit1
    ) || '';
    const color2 = Object.keys(colorCodes.digit).find(
      c => colorCodes.digit[c as keyof typeof colorCodes.digit] === digit2
    ) || '';
    const color3 = Object.keys(colorCodes.multiplier).find(
      c => colorCodes.multiplier[c as keyof typeof colorCodes.multiplier] === multiplier
    ) || '';
    const color4 = Object.keys(colorCodes.tolerance).find(
      c => colorCodes.tolerance[c as keyof typeof colorCodes.tolerance] === tolerance
    ) || '';
    
    steps.push(`1. แถบที่ 1: ${digit1} → สี${getColorName(color1)}`);
    steps.push(`2. แถบที่ 2: ${digit2} → สี${getColorName(color2)}`);
    steps.push(`3. แถบที่ 3: ×${multiplier} → สี${getColorName(color3)}`);
    steps.push(`4. แถบที่ 4: ${tolerance} → สี${getColorName(color4)}`);
  }
  
  return steps.join('\n');
}
