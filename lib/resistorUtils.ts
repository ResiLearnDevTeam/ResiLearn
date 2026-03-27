// Utility functions for resistor color code calculations

export const colorCodes = {
  digit: { black: 0, brown: 1, red: 2, orange: 3, yellow: 4, green: 5, blue: 6, violet: 7, gray: 8, white: 9 },
  multiplier: { 
    black: 1, 
    brown: 10, 
    red: 100, 
    orange: 1000, 
    yellow: 10000, 
    green: 100000, 
    blue: 1000000,
    violet: 10000000,
    gray: 100000000,
    white: 1000000000,
    gold: 0.1,
    silver: 0.01
  },
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
 * Generate all possible resistor values from valid color code combinations
 */
function generateAllPossibleResistorValues(
  resistorType: 'FOUR_BAND' | 'FIVE_BAND',
  maxOptions: number = 50
): string[] {
  const firstDigitColors = Object.keys(colorCodes.digit).filter(color => color !== 'black');
  const allOptions: string[] = [];
  const usedValues = new Set<string>();
  
  const is5Band = resistorType === 'FIVE_BAND';
  const hasLimit = maxOptions !== Infinity;
  
  if (is5Band) {
    // 5-band: Generate all combinations
    for (const digit1Color of firstDigitColors) {
      for (const digit2Color of Object.keys(colorCodes.digit)) {
        for (const digit3Color of Object.keys(colorCodes.digit)) {
          for (const multiplierColor of Object.keys(colorCodes.multiplier)) {
            for (const toleranceColor of Object.keys(colorCodes.tolerance)) {
              const digit1 = colorCodes.digit[digit1Color as keyof typeof colorCodes.digit];
              const digit2 = colorCodes.digit[digit2Color as keyof typeof colorCodes.digit];
              const digit3 = colorCodes.digit[digit3Color as keyof typeof colorCodes.digit];
              const multiplier = colorCodes.multiplier[multiplierColor as keyof typeof colorCodes.multiplier];
              const tolerance = colorCodes.tolerance[toleranceColor as keyof typeof colorCodes.tolerance];
              
              const value = parseInt(`${digit1}${digit2}${digit3}`) * multiplier;
              const formatted = formatResistance(value, tolerance);
              
              if (!usedValues.has(formatted)) {
                usedValues.add(formatted);
                allOptions.push(formatted);
                
                if (hasLimit && allOptions.length >= maxOptions) {
                  return allOptions;
                }
              }
            }
          }
        }
      }
    }
  } else {
    // 4-band: Generate all combinations
    for (const digit1Color of firstDigitColors) {
      for (const digit2Color of Object.keys(colorCodes.digit)) {
        for (const multiplierColor of Object.keys(colorCodes.multiplier)) {
          for (const toleranceColor of Object.keys(colorCodes.tolerance)) {
            const digit1 = colorCodes.digit[digit1Color as keyof typeof colorCodes.digit];
            const digit2 = colorCodes.digit[digit2Color as keyof typeof colorCodes.digit];
            const multiplier = colorCodes.multiplier[multiplierColor as keyof typeof colorCodes.multiplier];
            const tolerance = colorCodes.tolerance[toleranceColor as keyof typeof colorCodes.tolerance];
            
            const value = parseInt(`${digit1}${digit2}`) * multiplier;
            const formatted = formatResistance(value, tolerance);
            
            if (!usedValues.has(formatted)) {
              usedValues.add(formatted);
              allOptions.push(formatted);
              
              if (hasLimit && allOptions.length >= maxOptions) {
                return allOptions;
              }
            }
          }
        }
      }
    }
  }
  
  return allOptions;
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
  
  // Generate ALL possible resistor values from valid color code combinations
  // No limit - get all possible values
  const allPossibleValues = generateAllPossibleResistorValues(resistorType, Infinity);
  
  // Remove duplicates and ensure correct answer is included
  const uniqueValues = Array.from(new Set(allPossibleValues));
  
  // If correct answer is not in the list, add it
  if (!uniqueValues.includes(correctAnswer)) {
    uniqueValues.push(correctAnswer);
  }
  
  // Sort values for consistent display (sort by numeric value, from smallest to largest)
  const sortedOptions = uniqueValues.sort((a, b) => {
    // Extract numeric value from formatted string (e.g., "1kΩ ±5%" -> 1000)
    const getNumericValue = (str: string): number => {
      const match = str.match(/^([\d.]+)([kMG]?)/);
      if (!match) return 0;
      const num = parseFloat(match[1]);
      const unit = match[2];
      if (unit === 'k') return num * 1000;
      if (unit === 'M') return num * 1000000;
      if (unit === 'G') return num * 1000000000;
      return num;
    };
    const valueA = getNumericValue(a);
    const valueB = getNumericValue(b);
    
    // If same numeric value, sort by tolerance (smaller tolerance first)
    if (valueA === valueB) {
      const getTolerance = (str: string): number => {
        const tolMatch = str.match(/±([\d.]+)%/);
        return tolMatch ? parseFloat(tolMatch[1]) : 0;
      };
      return getTolerance(a) - getTolerance(b);
    }
    
    return valueA - valueB;
  });
  
  // Use all options (no random selection)
  const options = sortedOptions;
  
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
    if (index === 0) return 'หลักที่ 1';
    if (index === 1) return 'หลักที่ 2';
    if (index === 2) return 'หลักที่ 3';
    if (index === 3) return 'ตัวคูณ';
    if (index === 4) return 'ความคลาดเคลื่อน';
  } else {
    if (index === 0) return 'หลักที่ 1';
    if (index === 1) return 'หลักที่ 2';
    if (index === 2) return 'ตัวคูณ';
    if (index === 3) return 'ความคลาดเคลื่อน';
  }
  
  return '';
}

/**
 * Generate a question for color to value with specific band (สี → ค่า แบบเลือกแถบ)
 * แสดงแถบสีทั้งหมด แต่ถามเฉพาะค่าของแถบที่เลือก
 * @param digitIndex - สำหรับ digit bands: 0 = หลักแรก, 1 = หลักที่สอง, 2 = หลักที่สาม (5-band only)
 */
export function generateColorToValueBandQuestion(
  resistorType: 'FOUR_BAND' | 'FIVE_BAND',
  bandIndex: number,
  digitIndex?: number | null
): ResistorQuestion & { bandValue: string } {
  const is5Band = resistorType === 'FIVE_BAND';
  const allDigitColors = Object.keys(colorCodes.digit);
  const firstDigitColors = allDigitColors.filter(color => color !== 'black');

  // Prepare a stable base so only the target band is randomized
  const baseBands = is5Band
    ? ['brown', 'black', 'black', 'brown', 'gold']
    : ['brown', 'black', 'brown', 'gold'];

  const bands = [...baseBands];
  const targetBandIndex = (is5Band ? bandIndex <= 2 : bandIndex <= 1) && digitIndex !== null && digitIndex !== undefined
    ? digitIndex
    : bandIndex;

  const randomFrom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

  if (is5Band ? targetBandIndex <= 2 : targetBandIndex <= 1) {
    // Digit bands
    const pool = targetBandIndex === 0 ? firstDigitColors : allDigitColors;
    bands[targetBandIndex] = randomFrom(pool);
  } else if (targetBandIndex === (is5Band ? 3 : 2)) {
    // Multiplier band
    bands[targetBandIndex] = randomFrom(Object.keys(colorCodes.multiplier));
  } else if (targetBandIndex === (is5Band ? 4 : 3)) {
    // Tolerance band
    bands[targetBandIndex] = randomFrom(Object.keys(colorCodes.tolerance));
  }

  const value = is5Band
    ? `${colorCodes.digit[bands[0] as keyof typeof colorCodes.digit]}${colorCodes.digit[bands[1] as keyof typeof colorCodes.digit]}${colorCodes.digit[bands[2] as keyof typeof colorCodes.digit]}`
    : `${colorCodes.digit[bands[0] as keyof typeof colorCodes.digit]}${colorCodes.digit[bands[1] as keyof typeof colorCodes.digit]}`;
  const multiplier = colorCodes.multiplier[bands[is5Band ? 3 : 2] as keyof typeof colorCodes.multiplier];
  const tolerance = colorCodes.tolerance[bands[is5Band ? 4 : 3] as keyof typeof colorCodes.tolerance];

  const resistorValue = parseInt(value) * multiplier;
  const fullAnswer = formatResistance(resistorValue, tolerance);

  // Band-specific value shown to learner
  let bandValue: string;
  const isDigitBand = is5Band ? bandIndex <= 2 : bandIndex <= 1;

  if (isDigitBand && digitIndex !== null && digitIndex !== undefined) {
    bandValue = colorCodes.digit[bands[targetBandIndex] as keyof typeof colorCodes.digit].toString();
  } else if (is5Band) {
    if (bandIndex === 0) {
      bandValue = colorCodes.digit[bands[0] as keyof typeof colorCodes.digit].toString();
    } else if (bandIndex === 1) {
      bandValue = colorCodes.digit[bands[1] as keyof typeof colorCodes.digit].toString();
    } else if (bandIndex === 2) {
      bandValue = colorCodes.digit[bands[2] as keyof typeof colorCodes.digit].toString();
    } else if (bandIndex === 3) {
      // Format multiplier according to table: 1Ω, 10Ω, 100Ω, 1KΩ, 10KΩ, 100KΩ, 1MΩ, 10MΩ, 100MΩ, 1GΩ, 0.1Ω, 0.01Ω
      if (multiplier >= 1000000000) {
        bandValue = '1G';
      } else if (multiplier >= 100000000) {
        bandValue = '100M';
      } else if (multiplier >= 10000000) {
        bandValue = '10M';
      } else if (multiplier >= 1000000) {
        bandValue = '1M';
      } else if (multiplier >= 100000) {
        bandValue = '100K';
      } else if (multiplier >= 10000) {
        bandValue = '10K';
      } else if (multiplier >= 1000) {
        bandValue = '1K';
      } else if (multiplier === 0.1) {
        bandValue = '0.1';
      } else if (multiplier === 0.01) {
        bandValue = '0.01';
      } else {
        bandValue = multiplier.toString();
      }
    } else if (bandIndex === 4) {
      bandValue = tolerance;
    } else {
      bandValue = fullAnswer;
    }
  } else {
    if (bandIndex === 0) {
      bandValue = colorCodes.digit[bands[0] as keyof typeof colorCodes.digit].toString();
    } else if (bandIndex === 1) {
      bandValue = colorCodes.digit[bands[1] as keyof typeof colorCodes.digit].toString();
    } else if (bandIndex === 2) {
      // Format multiplier according to table: 1Ω, 10Ω, 100Ω, 1KΩ, 10KΩ, 100KΩ, 1MΩ, 10MΩ, 100MΩ, 1GΩ, 0.1Ω, 0.01Ω
      if (multiplier >= 1000000000) {
        bandValue = '1G';
      } else if (multiplier >= 100000000) {
        bandValue = '100M';
      } else if (multiplier >= 10000000) {
        bandValue = '10M';
      } else if (multiplier >= 1000000) {
        bandValue = '1M';
      } else if (multiplier >= 100000) {
        bandValue = '100K';
      } else if (multiplier >= 10000) {
        bandValue = '10K';
      } else if (multiplier >= 1000) {
        bandValue = '1K';
      } else if (multiplier === 0.1) {
        bandValue = '0.1';
      } else if (multiplier === 0.01) {
        bandValue = '0.01';
      } else {
        bandValue = multiplier.toString();
      }
    } else if (bandIndex === 3) {
      bandValue = tolerance;
    } else {
      bandValue = fullAnswer;
    }
  }
  
  // Generate ALL possible options based on band type (no random selection)
  let allOptions: string[] = [];
  if (is5Band) {
    if (bandIndex <= 2) {
      // Digit bands - show all possible digits
      if (bandIndex === 0) {
        // First digit: 1-9 (no 0)
        allOptions = Array.from({ length: 9 }, (_, i) => (i + 1).toString());
      } else {
        // Second and third digits: 0-9
        allOptions = Array.from({ length: 10 }, (_, i) => i.toString());
      }
    } else if (bandIndex === 3) {
      // Multiplier band - show all possible multipliers according to table, sorted from smallest to largest
      // Silver: 0.01Ω, Gold: 0.1Ω, Black: 1Ω, Brown: 10Ω, Red: 100Ω, Orange: 1KΩ, Yellow: 10KΩ, Green: 100KΩ, Blue: 1MΩ, Violet: 10MΩ, Grey: 100MΩ, White: 1GΩ
      allOptions = ['0.01', '0.1', '1', '10', '100', '1K', '10K', '100K', '1M', '10M', '100M', '1G'];
    } else {
      // Tolerance band - show all possible tolerances, sorted from smallest to largest
      allOptions = ['±0.05%', '±0.1%', '±0.25%', '±0.5%', '±1%', '±2%', '±5%', '±10%'];
    }
  } else {
    if (bandIndex <= 1) {
      // Digit bands
      if (bandIndex === 0) {
        // First digit: 1-9 (no 0)
        allOptions = Array.from({ length: 9 }, (_, i) => (i + 1).toString());
      } else {
        // Second digit: 0-9
        allOptions = Array.from({ length: 10 }, (_, i) => i.toString());
      }
    } else if (bandIndex === 2) {
      // Multiplier band - show all possible multipliers according to table, sorted from smallest to largest
      // Silver: 0.01Ω, Gold: 0.1Ω, Black: 1Ω, Brown: 10Ω, Red: 100Ω, Orange: 1KΩ, Yellow: 10KΩ, Green: 100KΩ, Blue: 1MΩ, Violet: 10MΩ, Grey: 100MΩ, White: 1GΩ
      allOptions = ['0.01', '0.1', '1', '10', '100', '1K', '10K', '100K', '1M', '10M', '100M', '1G'];
    } else {
      // Tolerance band - show all possible tolerances, sorted from smallest to largest
      allOptions = ['±0.05%', '±0.1%', '±0.25%', '±0.5%', '±1%', '±2%', '±5%', '±10%'];
    }
  }
  
  // Sort options: digits numerically, multipliers and tolerances by numeric value
  if (bandIndex <= (is5Band ? 2 : 1)) {
    // For digit bands, sort numerically (already sorted from Array.from, but ensure it)
    allOptions.sort((a, b) => parseFloat(a) - parseFloat(b));
  } else if (bandIndex === (is5Band ? 3 : 2)) {
    // For multiplier bands, sort by numeric value (already sorted, but ensure it)
    allOptions.sort((a, b) => {
      const getMultiplierValue = (str: string): number => {
        if (str === '0.01') return 0.01;
        if (str === '0.1') return 0.1;
        if (str.endsWith('G')) return parseFloat(str) * 1000000000;
        if (str.endsWith('M')) return parseFloat(str) * 1000000;
        if (str.endsWith('K')) return parseFloat(str) * 1000;
        return parseFloat(str);
      };
      return getMultiplierValue(a) - getMultiplierValue(b);
    });
  } else {
    // For tolerance bands, sort by numeric value (already sorted, but ensure it)
    allOptions.sort((a, b) => {
      const getToleranceValue = (str: string): number => {
        const match = str.match(/±([\d.]+)%/);
        return match ? parseFloat(match[1]) : 0;
      };
      return getToleranceValue(a) - getToleranceValue(b);
    });
  }
  
  const options = allOptions;
  
  const explanation = is5Band
    ? `แถบสี: ${bands[0]}(${colorCodes.digit[bands[0] as keyof typeof colorCodes.digit]}) - ${bands[1]}(${colorCodes.digit[bands[1] as keyof typeof colorCodes.digit]}) - ${bands[2]}(${colorCodes.digit[bands[2] as keyof typeof colorCodes.digit]}) - ${bands[3]}(×${multiplier}) = ${value} × ${multiplier} = ${formatResistance(resistorValue, tolerance)}, ${bands[4]}(${tolerance})`
    : `แถบสี: ${bands[0]}(${colorCodes.digit[bands[0] as keyof typeof colorCodes.digit]}) - ${bands[1]}(${colorCodes.digit[bands[1] as keyof typeof colorCodes.digit]}) - ${bands[2]}(×${multiplier}) = ${value} × ${multiplier} = ${formatResistance(resistorValue, tolerance)}, ${bands[3]}(${tolerance})`;
  
  return {
    bands,
    correctAnswer: bandValue,
    options,
    resistorValue,
    tolerance,
    questionType: 'normal',
    explanation,
    bandValue
  };
}

/**
 * Generate a question for specific band practice (ค่า → สี แบบเลือกแถบ)
 * สุ่มเฉพาะแถบที่เลือก และแสดงเฉพาะค่าของแถบนั้น
 * @param digitIndex - สำหรับ digit bands: 0 = หลักแรก, 1 = หลักที่สอง, 2 = หลักที่สาม (5-band only)
 */
export function generateValueToColorBandQuestion(
  resistorType: 'FOUR_BAND' | 'FIVE_BAND',
  bandIndex: number,
  digitIndex?: number | null
): ResistorQuestion & { bandValue: string } {
  const is5Band = resistorType === 'FIVE_BAND';
  const allDigitColors = Object.keys(colorCodes.digit);
  const firstDigitColors = allDigitColors.filter(color => color !== 'black');

  // Start from a fixed base resistor, then randomize only the target band
  const baseBands = is5Band
    ? ['brown', 'black', 'black', 'brown', 'gold']
    : ['brown', 'black', 'brown', 'gold'];

  const bands = [...baseBands];
  const targetBandIndex = (is5Band ? bandIndex <= 2 : bandIndex <= 1) && digitIndex !== null && digitIndex !== undefined
    ? digitIndex
    : bandIndex;

  const randomFrom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

  if (is5Band ? targetBandIndex <= 2 : targetBandIndex <= 1) {
    const pool = targetBandIndex === 0 ? firstDigitColors : allDigitColors;
    bands[targetBandIndex] = randomFrom(pool);
  } else if (targetBandIndex === (is5Band ? 3 : 2)) {
    bands[targetBandIndex] = randomFrom(Object.keys(colorCodes.multiplier));
  } else if (targetBandIndex === (is5Band ? 4 : 3)) {
    bands[targetBandIndex] = randomFrom(Object.keys(colorCodes.tolerance));
  }

  const value = is5Band
    ? `${colorCodes.digit[bands[0] as keyof typeof colorCodes.digit]}${colorCodes.digit[bands[1] as keyof typeof colorCodes.digit]}${colorCodes.digit[bands[2] as keyof typeof colorCodes.digit]}`
    : `${colorCodes.digit[bands[0] as keyof typeof colorCodes.digit]}${colorCodes.digit[bands[1] as keyof typeof colorCodes.digit]}`;
  const multiplier = colorCodes.multiplier[bands[is5Band ? 3 : 2] as keyof typeof colorCodes.multiplier];
  const tolerance = colorCodes.tolerance[bands[is5Band ? 4 : 3] as keyof typeof colorCodes.tolerance];

  const resistorValue = parseInt(value) * multiplier;
  const fullAnswer = formatResistance(resistorValue, tolerance);

  // Show only the selected band value
  let bandValue: string;
  const isDigitBand = is5Band ? bandIndex <= 2 : bandIndex <= 1;

  if (isDigitBand && digitIndex !== null && digitIndex !== undefined) {
    bandValue = colorCodes.digit[bands[targetBandIndex] as keyof typeof colorCodes.digit].toString();
  } else if (is5Band) {
    if (bandIndex === 0) {
      bandValue = colorCodes.digit[bands[0] as keyof typeof colorCodes.digit].toString();
    } else if (bandIndex === 1) {
      bandValue = colorCodes.digit[bands[1] as keyof typeof colorCodes.digit].toString();
    } else if (bandIndex === 2) {
      bandValue = colorCodes.digit[bands[2] as keyof typeof colorCodes.digit].toString();
    } else if (bandIndex === 3) {
      // Format multiplier according to table: 1Ω, 10Ω, 100Ω, 1KΩ, 10KΩ, 100KΩ, 1MΩ, 10MΩ, 100MΩ, 1GΩ, 0.1Ω, 0.01Ω
      if (multiplier >= 1000000000) {
        bandValue = '×1G';
      } else if (multiplier >= 100000000) {
        bandValue = '×100M';
      } else if (multiplier >= 10000000) {
        bandValue = '×10M';
      } else if (multiplier >= 1000000) {
        bandValue = '×1M';
      } else if (multiplier >= 100000) {
        bandValue = '×100K';
      } else if (multiplier >= 10000) {
        bandValue = '×10K';
      } else if (multiplier >= 1000) {
        bandValue = '×1K';
      } else if (multiplier === 0.1) {
        bandValue = '×0.1';
      } else if (multiplier === 0.01) {
        bandValue = '×0.01';
      } else {
        bandValue = `×${multiplier}`;
      }
    } else if (bandIndex === 4) {
      bandValue = tolerance;
    } else {
      bandValue = fullAnswer;
    }
  } else {
    if (bandIndex === 0) {
      bandValue = colorCodes.digit[bands[0] as keyof typeof colorCodes.digit].toString();
    } else if (bandIndex === 1) {
      bandValue = colorCodes.digit[bands[1] as keyof typeof colorCodes.digit].toString();
    } else if (bandIndex === 2) {
      if (multiplier >= 1000) {
        const k = multiplier / 1000;
        bandValue = k % 1 === 0 ? `×${k}k` : `×${multiplier}`;
      } else {
        bandValue = `×${multiplier}`;
      }
    } else if (bandIndex === 3) {
      bandValue = tolerance;
    } else {
      bandValue = fullAnswer;
    }
  }
  
  const explanation = is5Band
    ? `แถบสีที่ถูกต้อง: ${bands[0]}(${colorCodes.digit[bands[0] as keyof typeof colorCodes.digit]}) - ${bands[1]}(${colorCodes.digit[bands[1] as keyof typeof colorCodes.digit]}) - ${bands[2]}(${colorCodes.digit[bands[2] as keyof typeof colorCodes.digit]}) - ${bands[3]}(×${multiplier}) = ${value} × ${multiplier} = ${formatResistance(resistorValue, tolerance)}, ${bands[4]}(${tolerance})`
    : `แถบสีที่ถูกต้อง: ${bands[0]}(${colorCodes.digit[bands[0] as keyof typeof colorCodes.digit]}) - ${bands[1]}(${colorCodes.digit[bands[1] as keyof typeof colorCodes.digit]}) - ${bands[2]}(×${multiplier}) = ${value} × ${multiplier} = ${formatResistance(resistorValue, tolerance)}, ${bands[3]}(${tolerance})`;
  
  return {
    bands: [],
    correctAnswer: fullAnswer,
    correctBands: bands,
    resistorValue,
    tolerance,
    questionType: 'reverse',
    explanation,
    bandValue // ค่าของแถบที่เลือกเท่านั้น
  };
}


