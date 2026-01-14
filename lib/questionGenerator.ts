import { formatResistance } from './resistorUtils';

const colorCodes = {
  digit: { black: 0, brown: 1, red: 2, orange: 3, yellow: 4, green: 5, blue: 6, violet: 7, gray: 8, white: 9 },
  multiplier: { black: 1, brown: 10, red: 100, orange: 1000, yellow: 10000, green: 100000, blue: 1000000 },
  tolerance: { brown: '±1%', red: '±2%', green: '±0.5%', blue: '±0.25%', violet: '±0.1%', gray: '±0.05%', gold: '±5%', silver: '±10%' }
};

export interface Question {
  bands: string[];
  correctAnswer: string;
  correctBands?: string[];
  options?: string[];
  resistorValue: number;
  tolerance: string;
  questionType: 'normal' | 'reverse';
}

export function generateQuestion(
  type: string,
  isReverse: boolean = false,
  optionCount: number = 4,
  difficulty: 'easy' | 'medium' | 'hard' = 'medium'
): Question {
  if (isReverse) {
    if (type === 'FIVE_BAND') {
      const firstDigitColors = Object.keys(colorCodes.digit).filter(color => color !== 'black');
      const bands = [
        firstDigitColors[Math.floor(Math.random() * firstDigitColors.length)],
        Object.keys(colorCodes.digit)[Math.floor(Math.random() * Object.keys(colorCodes.digit).length)],
        Object.keys(colorCodes.digit)[Math.floor(Math.random() * Object.keys(colorCodes.digit).length)],
        Object.keys(colorCodes.multiplier)[Math.floor(Math.random() * Object.keys(colorCodes.multiplier).length)],
        Object.keys(colorCodes.tolerance)[Math.floor(Math.random() * Object.keys(colorCodes.tolerance).length)]
      ] as string[];

      const value = `${colorCodes.digit[bands[0] as keyof typeof colorCodes.digit]}${colorCodes.digit[bands[1] as keyof typeof colorCodes.digit]}${colorCodes.digit[bands[2] as keyof typeof colorCodes.digit]}`;
      const multiplier = colorCodes.multiplier[bands[3] as keyof typeof colorCodes.multiplier];
      const tolerance = colorCodes.tolerance[bands[4] as keyof typeof colorCodes.tolerance];
      const resistorValue = parseInt(value) * multiplier;
      const correctAnswer = formatResistance(resistorValue, tolerance);

      return { bands: [], correctAnswer, correctBands: bands, resistorValue, tolerance, questionType: 'reverse' };
    } else {
      const firstDigitColors = Object.keys(colorCodes.digit).filter(color => color !== 'black');
      const bands = [
        firstDigitColors[Math.floor(Math.random() * firstDigitColors.length)],
        Object.keys(colorCodes.digit)[Math.floor(Math.random() * Object.keys(colorCodes.digit).length)],
        Object.keys(colorCodes.multiplier)[Math.floor(Math.random() * Object.keys(colorCodes.multiplier).length)],
        Object.keys(colorCodes.tolerance)[Math.floor(Math.random() * Object.keys(colorCodes.tolerance).length)]
      ] as string[];

      const value = `${colorCodes.digit[bands[0] as keyof typeof colorCodes.digit]}${colorCodes.digit[bands[1] as keyof typeof colorCodes.digit]}`;
      const multiplier = colorCodes.multiplier[bands[2] as keyof typeof colorCodes.multiplier];
      const tolerance = colorCodes.tolerance[bands[3] as keyof typeof colorCodes.tolerance];
      const resistorValue = parseInt(value) * multiplier;
      const correctAnswer = formatResistance(resistorValue, tolerance);

      return { bands: [], correctAnswer, correctBands: bands, resistorValue, tolerance, questionType: 'reverse' };
    }
  }

  if (type === 'FIVE_BAND') {
    const firstDigitColors = Object.keys(colorCodes.digit).filter(color => color !== 'black');
    const bands = [
      firstDigitColors[Math.floor(Math.random() * firstDigitColors.length)],
      Object.keys(colorCodes.digit)[Math.floor(Math.random() * Object.keys(colorCodes.digit).length)],
      Object.keys(colorCodes.digit)[Math.floor(Math.random() * Object.keys(colorCodes.digit).length)],
      Object.keys(colorCodes.multiplier)[Math.floor(Math.random() * Object.keys(colorCodes.multiplier).length)],
      Object.keys(colorCodes.tolerance)[Math.floor(Math.random() * Object.keys(colorCodes.tolerance).length)]
    ] as string[];

    const value = `${colorCodes.digit[bands[0] as keyof typeof colorCodes.digit]}${colorCodes.digit[bands[1] as keyof typeof colorCodes.digit]}${colorCodes.digit[bands[2] as keyof typeof colorCodes.digit]}`;
    const multiplier = colorCodes.multiplier[bands[3] as keyof typeof colorCodes.multiplier];
    const tolerance = colorCodes.tolerance[bands[4] as keyof typeof colorCodes.tolerance];
    const resistorValue = parseInt(value) * multiplier;
    const correctAnswer = formatResistance(resistorValue, tolerance);

    const wrongAnswers = generateWrongAnswers(resistorValue, tolerance, optionCount, type, difficulty).filter(a => a !== correctAnswer);
    const options = [correctAnswer, ...wrongAnswers.slice(0, optionCount - 1)].sort(() => Math.random() - 0.5);

    return { bands, correctAnswer, options, questionType: 'normal', resistorValue, tolerance };
  } else {
    const firstDigitColors = Object.keys(colorCodes.digit).filter(color => color !== 'black');
    const bands = [
      firstDigitColors[Math.floor(Math.random() * firstDigitColors.length)],
      Object.keys(colorCodes.digit)[Math.floor(Math.random() * Object.keys(colorCodes.digit).length)],
      Object.keys(colorCodes.multiplier)[Math.floor(Math.random() * Object.keys(colorCodes.multiplier).length)],
      Object.keys(colorCodes.tolerance)[Math.floor(Math.random() * Object.keys(colorCodes.tolerance).length)]
    ] as string[];

    const value = `${colorCodes.digit[bands[0] as keyof typeof colorCodes.digit]}${colorCodes.digit[bands[1] as keyof typeof colorCodes.digit]}`;
    const multiplier = colorCodes.multiplier[bands[2] as keyof typeof colorCodes.multiplier];
    const tolerance = colorCodes.tolerance[bands[3] as keyof typeof colorCodes.tolerance];
    const resistorValue = parseInt(value) * multiplier;
    const correctAnswer = formatResistance(resistorValue, tolerance);

    const wrongAnswers = generateWrongAnswers(resistorValue, tolerance, optionCount, type, difficulty).filter(a => a !== correctAnswer);
    const options = [correctAnswer, ...wrongAnswers.slice(0, optionCount - 1)].sort(() => Math.random() - 0.5);

    return { bands, correctAnswer, options, questionType: 'normal', resistorValue, tolerance };
  }
}

export function generateWrongAnswers(
  correctResistorValue: number,
  correctTolerance: string,
  optionCount: number,
  resType: string,
  difficulty: 'easy' | 'medium' | 'hard'
): string[] {
  const wrongAnswers: string[] = [];
  const usedValues = new Set<number>([correctResistorValue]);
  
  const generateRandomResistor = (): number => {
    const firstDigitColors = Object.keys(colorCodes.digit).filter(color => color !== 'black');
    if (resType === 'FIVE_BAND') {
      const digit1 = colorCodes.digit[firstDigitColors[Math.floor(Math.random() * firstDigitColors.length)] as keyof typeof colorCodes.digit];
      const digit2 = colorCodes.digit[Object.keys(colorCodes.digit)[Math.floor(Math.random() * Object.keys(colorCodes.digit).length)] as keyof typeof colorCodes.digit];
      const digit3 = colorCodes.digit[Object.keys(colorCodes.digit)[Math.floor(Math.random() * Object.keys(colorCodes.digit).length)] as keyof typeof colorCodes.digit];
      const multiplier = colorCodes.multiplier[Object.keys(colorCodes.multiplier)[Math.floor(Math.random() * Object.keys(colorCodes.multiplier).length)] as keyof typeof colorCodes.multiplier];
      return parseInt(`${digit1}${digit2}${digit3}`) * multiplier;
    } else {
      const digit1 = colorCodes.digit[firstDigitColors[Math.floor(Math.random() * firstDigitColors.length)] as keyof typeof colorCodes.digit];
      const digit2 = colorCodes.digit[Object.keys(colorCodes.digit)[Math.floor(Math.random() * Object.keys(colorCodes.digit).length)] as keyof typeof colorCodes.digit];
      const multiplier = colorCodes.multiplier[Object.keys(colorCodes.multiplier)[Math.floor(Math.random() * Object.keys(colorCodes.multiplier).length)] as keyof typeof colorCodes.multiplier];
      return parseInt(`${digit1}${digit2}`) * multiplier;
    }
  };

  if (difficulty === 'easy') {
    let attempts = 0;
    while (wrongAnswers.length < optionCount - 1 && attempts < 500) {
      attempts++;
      const randomValue = generateRandomResistor();
      if (!usedValues.has(randomValue)) {
        usedValues.add(randomValue);
        const tolerance = Object.values(colorCodes.tolerance)[Math.floor(Math.random() * Object.values(colorCodes.tolerance).length)];
        wrongAnswers.push(formatResistance(randomValue, tolerance));
      }
    }
  } else if (difficulty === 'medium') {
    const numCloseAnswers = Math.floor((optionCount - 1) / 2);
    const closeMultipliers = [0.5, 0.8, 1.2, 1.5, 2, 0.7, 1.3, 0.9, 1.1].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < numCloseAnswers && i < closeMultipliers.length; i++) {
      const multiplier = closeMultipliers[i];
      const closeValue = Math.round(correctResistorValue * multiplier);
      if (closeValue > 0 && closeValue !== correctResistorValue && !usedValues.has(closeValue)) {
        usedValues.add(closeValue);
        const tolerance = Math.random() < 0.5 ? correctTolerance : Object.values(colorCodes.tolerance)[Math.floor(Math.random() * Object.values(colorCodes.tolerance).length)];
        wrongAnswers.push(formatResistance(closeValue, tolerance));
      }
    }
    
    let attempts = 0;
    while (wrongAnswers.length < optionCount - 1 && attempts < 500) {
      attempts++;
      const randomValue = generateRandomResistor();
      if (!usedValues.has(randomValue)) {
        usedValues.add(randomValue);
        const tolerance = Object.values(colorCodes.tolerance)[Math.floor(Math.random() * Object.values(colorCodes.tolerance).length)];
        wrongAnswers.push(formatResistance(randomValue, tolerance));
      }
    }
  } else {
    const veryCloseMultipliers = [0.9, 0.95, 1.05, 1.1, 0.85, 1.15, 0.8, 1.2, 0.92, 1.08, 0.88, 1.12].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < optionCount - 1 && i < veryCloseMultipliers.length; i++) {
      const multiplier = veryCloseMultipliers[i];
      const closeValue = Math.round(correctResistorValue * multiplier);
      if (closeValue > 0 && closeValue !== correctResistorValue && !usedValues.has(closeValue)) {
        usedValues.add(closeValue);
        const tolerance = Math.random() < 0.8 ? correctTolerance : Object.values(colorCodes.tolerance)[Math.floor(Math.random() * Object.values(colorCodes.tolerance).length)];
        wrongAnswers.push(formatResistance(closeValue, tolerance));
      }
    }
    
    while (wrongAnswers.length < optionCount - 1) {
      const multiplier = 0.85 + Math.random() * 0.3;
      const closeValue = Math.round(correctResistorValue * multiplier);
      if (closeValue > 0 && !usedValues.has(closeValue)) {
        usedValues.add(closeValue);
        const tolerance = correctTolerance;
        wrongAnswers.push(formatResistance(closeValue, tolerance));
      }
    }
  }
  
  return wrongAnswers;
}

export function generateQuestions(
  resistorType: string,
  answerType: string,
  totalQuestions: number | null,
  optionCount: number,
  difficulty: 'easy' | 'medium' | 'hard'
): Question[] {
  const questionCount = totalQuestions || 10;
  const isReverse = answerType === 'color_selection';
  return Array.from({ length: questionCount }, () => generateQuestion(resistorType, isReverse, optionCount, difficulty));
}
