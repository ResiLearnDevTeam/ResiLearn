// Utility functions for resistor color code calculations

export const colorCodes = {
  digit: { black: 0, brown: 1, red: 2, orange: 3, yellow: 4, green: 5, blue: 6, violet: 7, gray: 8, white: 9 },
  multiplier: { black: 1, brown: 10, red: 100, orange: 1000, yellow: 10000, green: 100000, blue: 1000000 },
  tolerance: { brown: '±1%', red: '±2%', green: '±0.5%', blue: '±0.25%', violet: '±0.1%', gray: '±0.05%', gold: '±5%', silver: '±10%' }
};

export interface ResistorQuestion {
  bands: string[];
  correctAnswer: string;
  correctBands?: string[];
  options?: string[];
  resistorValue: number;
  tolerance: string;
  questionType: 'normal' | 'reverse';
  explanation: string;
}

/**
 * Format resistance value with unit and tolerance
 */
export function formatResistance(value: number, tolerance: string): string {
  if (value >= 1000000) {
    const megaOhm = value / 1000000;
    const formatted = megaOhm % 1 === 0 ? megaOhm.toString() : megaOhm.toString().replace(/\.?0+$/, '');
    return `${formatted}MΩ ${tolerance}`;
  } else if (value >= 1000) {
    const kiloOhm = value / 1000;
    const formatted = kiloOhm % 1 === 0 ? kiloOhm.toString() : kiloOhm.toString().replace(/\.?0+$/, '');
    return `${formatted}kΩ ${tolerance}`;
  } else {
    return `${value}Ω ${tolerance}`;
  }
}

/**
 * Generate a question: Color to Value (แสดงสี → ถามค่า)
 */
export function generateColorToValueQuestion(
  resistorType: 'FOUR_BAND' | 'FIVE_BAND',
  optionCount: number = 4,
  difficulty: 'easy' | 'medium' | 'hard' = 'medium'
): ResistorQuestion {
  const is5Band = resistorType === 'FIVE_BAND';
  
  // Generate random bands
  const firstDigitColors = Object.keys(colorCodes.digit).filter(color => color !== 'black');
  
  let bands: string[];
  let value: string;
  let multiplier: number;
  let tolerance: string;
  
  if (is5Band) {
    bands = [
      firstDigitColors[Math.floor(Math.random() * firstDigitColors.length)],
      Object.keys(colorCodes.digit)[Math.floor(Math.random() * Object.keys(colorCodes.digit).length)],
      Object.keys(colorCodes.digit)[Math.floor(Math.random() * Object.keys(colorCodes.digit).length)],
      Object.keys(colorCodes.multiplier)[Math.floor(Math.random() * Object.keys(colorCodes.multiplier).length)],
      Object.keys(colorCodes.tolerance)[Math.floor(Math.random() * Object.keys(colorCodes.tolerance).length)]
    ] as string[];
    
    value = `${colorCodes.digit[bands[0] as keyof typeof colorCodes.digit]}${colorCodes.digit[bands[1] as keyof typeof colorCodes.digit]}${colorCodes.digit[bands[2] as keyof typeof colorCodes.digit]}`;
    multiplier = colorCodes.multiplier[bands[3] as keyof typeof colorCodes.multiplier];
    tolerance = colorCodes.tolerance[bands[4] as keyof typeof colorCodes.tolerance];
  } else {
    bands = [
      firstDigitColors[Math.floor(Math.random() * firstDigitColors.length)],
      Object.keys(colorCodes.digit)[Math.floor(Math.random() * Object.keys(colorCodes.digit).length)],
      Object.keys(colorCodes.multiplier)[Math.floor(Math.random() * Object.keys(colorCodes.multiplier).length)],
      Object.keys(colorCodes.tolerance)[Math.floor(Math.random() * Object.keys(colorCodes.tolerance).length)]
    ] as string[];
    
    value = `${colorCodes.digit[bands[0] as keyof typeof colorCodes.digit]}${colorCodes.digit[bands[1] as keyof typeof colorCodes.digit]}`;
    multiplier = colorCodes.multiplier[bands[2] as keyof typeof colorCodes.multiplier];
    tolerance = colorCodes.tolerance[bands[3] as keyof typeof colorCodes.tolerance];
  }
  
  const resistorValue = parseInt(value) * multiplier;
  const correctAnswer = formatResistance(resistorValue, tolerance);
  
  // Generate wrong answers
  const wrongAnswers = generateWrongAnswers(resistorValue, tolerance, optionCount, resistorType, difficulty);
  const options = [correctAnswer, ...wrongAnswers.filter(a => a !== correctAnswer).slice(0, optionCount - 1)].sort(() => Math.random() - 0.5);
  
  const explanation = is5Band
    ? `${bands[0]}(${colorCodes.digit[bands[0] as keyof typeof colorCodes.digit]}) - ${bands[1]}(${colorCodes.digit[bands[1] as keyof typeof colorCodes.digit]}) - ${bands[2]}(${colorCodes.digit[bands[2] as keyof typeof colorCodes.digit]}) - ${bands[3]}(×${multiplier}) = ${value} × ${multiplier} = ${formatResistance(resistorValue, tolerance)}, ${bands[4]}(${tolerance})`
    : `${bands[0]}(${colorCodes.digit[bands[0] as keyof typeof colorCodes.digit]}) - ${bands[1]}(${colorCodes.digit[bands[1] as keyof typeof colorCodes.digit]}) - ${bands[2]}(×${multiplier}) = ${value} × ${multiplier} = ${formatResistance(resistorValue, tolerance)}, ${bands[3]}(${tolerance})`;
  
  return {
    bands,
    correctAnswer,
    options,
    resistorValue,
    tolerance,
    questionType: 'normal',
    explanation
  };
}

/**
 * Generate a question: Value to Color (แสดงค่า → ถามสี)
 */
export function generateValueToColorQuestion(
  resistorType: 'FOUR_BAND' | 'FIVE_BAND'
): ResistorQuestion {
  const is5Band = resistorType === 'FIVE_BAND';
  const firstDigitColors = Object.keys(colorCodes.digit).filter(color => color !== 'black');
  
  let bands: string[];
  let value: string;
  let multiplier: number;
  let tolerance: string;
  
  if (is5Band) {
    bands = [
      firstDigitColors[Math.floor(Math.random() * firstDigitColors.length)],
      Object.keys(colorCodes.digit)[Math.floor(Math.random() * Object.keys(colorCodes.digit).length)],
      Object.keys(colorCodes.digit)[Math.floor(Math.random() * Object.keys(colorCodes.digit).length)],
      Object.keys(colorCodes.multiplier)[Math.floor(Math.random() * Object.keys(colorCodes.multiplier).length)],
      Object.keys(colorCodes.tolerance)[Math.floor(Math.random() * Object.keys(colorCodes.tolerance).length)]
    ] as string[];
    
    value = `${colorCodes.digit[bands[0] as keyof typeof colorCodes.digit]}${colorCodes.digit[bands[1] as keyof typeof colorCodes.digit]}${colorCodes.digit[bands[2] as keyof typeof colorCodes.digit]}`;
    multiplier = colorCodes.multiplier[bands[3] as keyof typeof colorCodes.multiplier];
    tolerance = colorCodes.tolerance[bands[4] as keyof typeof colorCodes.tolerance];
  } else {
    bands = [
      firstDigitColors[Math.floor(Math.random() * firstDigitColors.length)],
      Object.keys(colorCodes.digit)[Math.floor(Math.random() * Object.keys(colorCodes.digit).length)],
      Object.keys(colorCodes.multiplier)[Math.floor(Math.random() * Object.keys(colorCodes.multiplier).length)],
      Object.keys(colorCodes.tolerance)[Math.floor(Math.random() * Object.keys(colorCodes.tolerance).length)]
    ] as string[];
    
    value = `${colorCodes.digit[bands[0] as keyof typeof colorCodes.digit]}${colorCodes.digit[bands[1] as keyof typeof colorCodes.digit]}`;
    multiplier = colorCodes.multiplier[bands[2] as keyof typeof colorCodes.multiplier];
    tolerance = colorCodes.tolerance[bands[3] as keyof typeof colorCodes.tolerance];
  }
  
  const resistorValue = parseInt(value) * multiplier;
  const correctAnswer = formatResistance(resistorValue, tolerance);
  
  const explanation = is5Band
    ? `แถบสีที่ถูกต้อง: ${bands[0]}(${colorCodes.digit[bands[0] as keyof typeof colorCodes.digit]}) - ${bands[1]}(${colorCodes.digit[bands[1] as keyof typeof colorCodes.digit]}) - ${bands[2]}(${colorCodes.digit[bands[2] as keyof typeof colorCodes.digit]}) - ${bands[3]}(×${multiplier}) = ${value} × ${multiplier} = ${formatResistance(resistorValue, tolerance)}, ${bands[4]}(${tolerance})`
    : `แถบสีที่ถูกต้อง: ${bands[0]}(${colorCodes.digit[bands[0] as keyof typeof colorCodes.digit]}) - ${bands[1]}(${colorCodes.digit[bands[1] as keyof typeof colorCodes.digit]}) - ${bands[2]}(×${multiplier}) = ${value} × ${multiplier} = ${formatResistance(resistorValue, tolerance)}, ${bands[3]}(${tolerance})`;
  
  return {
    bands: [],
    correctAnswer,
    correctBands: bands,
    resistorValue,
    tolerance,
    questionType: 'reverse',
    explanation
  };
}

/**
 * Generate wrong answers for multiple choice
 */
function generateWrongAnswers(
  correctResistorValue: number,
  correctTolerance: string,
  optionCount: number,
  resistorType: string,
  difficulty: 'easy' | 'medium' | 'hard'
): string[] {
  const wrongAnswers: string[] = [];
  const usedValues = new Set<number>([correctResistorValue]);
  
  const generateRandomResistor = (): number => {
    if (resistorType === 'FIVE_BAND') {
      const firstDigitColors = Object.keys(colorCodes.digit).filter(color => color !== 'black');
      const digit1 = colorCodes.digit[firstDigitColors[Math.floor(Math.random() * firstDigitColors.length)] as keyof typeof colorCodes.digit];
      const digit2 = colorCodes.digit[Object.keys(colorCodes.digit)[Math.floor(Math.random() * Object.keys(colorCodes.digit).length)] as keyof typeof colorCodes.digit];
      const digit3 = colorCodes.digit[Object.keys(colorCodes.digit)[Math.floor(Math.random() * Object.keys(colorCodes.digit).length)] as keyof typeof colorCodes.digit];
      const multiplier = colorCodes.multiplier[Object.keys(colorCodes.multiplier)[Math.floor(Math.random() * Object.keys(colorCodes.multiplier).length)] as keyof typeof colorCodes.multiplier];
      return parseInt(`${digit1}${digit2}${digit3}`) * multiplier;
    } else {
      const firstDigitColors = Object.keys(colorCodes.digit).filter(color => color !== 'black');
      const digit1 = colorCodes.digit[firstDigitColors[Math.floor(Math.random() * firstDigitColors.length)] as keyof typeof colorCodes.digit];
      const digit2 = colorCodes.digit[Object.keys(colorCodes.digit)[Math.floor(Math.random() * Object.keys(colorCodes.digit).length)] as keyof typeof colorCodes.digit];
      const multiplier = colorCodes.multiplier[Object.keys(colorCodes.multiplier)[Math.floor(Math.random() * Object.keys(colorCodes.multiplier).length)] as keyof typeof colorCodes.multiplier];
      return parseInt(`${digit1}${digit2}`) * multiplier;
    }
  };
  
  if (difficulty === 'easy') {
    let attempts = 0;
    const maxAttempts = 500;
    
    while (wrongAnswers.length < optionCount - 1 && attempts < maxAttempts) {
      attempts++;
      const randomResistorValue = generateRandomResistor();
      
      if (!usedValues.has(randomResistorValue)) {
        usedValues.add(randomResistorValue);
        const randomTolerance = Object.values(colorCodes.tolerance)[Math.floor(Math.random() * Object.values(colorCodes.tolerance).length)];
        const wrongAnswer = formatResistance(randomResistorValue, randomTolerance);
        
        if (!wrongAnswers.includes(wrongAnswer)) {
          wrongAnswers.push(wrongAnswer);
        }
      }
    }
  } else if (difficulty === 'medium') {
    const numCloseAnswers = Math.floor((optionCount - 1) / 2);
    
    const closeMultipliers = [0.5, 0.8, 1.2, 1.5, 2, 0.7, 1.3, 0.9, 1.1];
    const shuffled = closeMultipliers.sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < numCloseAnswers && i < shuffled.length; i++) {
      const multiplier = shuffled[i];
      const closeValue = Math.round(correctResistorValue * multiplier);
      if (closeValue > 0 && closeValue !== correctResistorValue && !usedValues.has(closeValue)) {
        usedValues.add(closeValue);
        const tolerance = Math.random() < 0.5 ? correctTolerance : Object.values(colorCodes.tolerance)[Math.floor(Math.random() * Object.values(colorCodes.tolerance).length)];
        wrongAnswers.push(formatResistance(closeValue, tolerance));
      }
    }
    
    let attempts = 0;
    const maxAttempts = 500;
    while (wrongAnswers.length < optionCount - 1 && attempts < maxAttempts) {
      attempts++;
      const randomValue = generateRandomResistor();
      if (!usedValues.has(randomValue)) {
        usedValues.add(randomValue);
        const tolerance = Object.values(colorCodes.tolerance)[Math.floor(Math.random() * Object.values(colorCodes.tolerance).length)];
        const answer = formatResistance(randomValue, tolerance);
        if (!wrongAnswers.includes(answer)) {
          wrongAnswers.push(answer);
        }
      }
    }
  } else {
    const veryCloseMultipliers = [0.9, 0.95, 1.05, 1.1, 0.85, 1.15, 0.8, 1.2, 0.92, 1.08, 0.88, 1.12];
    const shuffled = veryCloseMultipliers.sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < optionCount - 1 && i < shuffled.length; i++) {
      const multiplier = shuffled[i];
      const closeValue = Math.round(correctResistorValue * multiplier);
      if (closeValue > 0 && closeValue !== correctResistorValue && !usedValues.has(closeValue)) {
        usedValues.add(closeValue);
        const tolerance = Math.random() < 0.8 ? correctTolerance : Object.values(colorCodes.tolerance)[Math.floor(Math.random() * Object.values(colorCodes.tolerance).length)];
        wrongAnswers.push(formatResistance(closeValue, tolerance));
      }
    }
  }
  
  return wrongAnswers;
}

/**
 * Get band label for display
 */
export function getBandLabel(index: number, resistorType: 'FOUR_BAND' | 'FIVE_BAND'): string {
  const is5Band = resistorType === 'FIVE_BAND';
  
  if (is5Band) {
    if (index === 0) return 'แถบที่ 1 (หลักแรก)';
    if (index === 1) return 'แถบที่ 2 (หลักที่สอง)';
    if (index === 2) return 'แถบที่ 3 (หลักที่สาม)';
    if (index === 3) return 'แถบที่ 4 (ตัวคูณ)';
    if (index === 4) return 'แถบที่ 5 (ความคลาดเคลื่อน)';
  } else {
    if (index === 0) return 'แถบที่ 1 (หลักแรก)';
    if (index === 1) return 'แถบที่ 2 (หลักที่สอง)';
    if (index === 2) return 'แถบที่ 3 (ตัวคูณ)';
    if (index === 3) return 'แถบที่ 4 (ความคลาดเคลื่อน)';
  }
  
  return '';
}

