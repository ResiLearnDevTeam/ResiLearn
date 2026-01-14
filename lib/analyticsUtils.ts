// Deep Analytics Utilities for Practice Sessions
// Calculates detailed analytics from question history

import { formatResistance } from './resistorUtils';

export interface DeepAnalytics {
  resistorTypeErrors: {
    FOUR_BAND: { correct: number; incorrect: number; accuracy: number };
    FIVE_BAND: { correct: number; incorrect: number; accuracy: number };
  };
  digitPositionErrors: {
    position1: {
      total: number;
      errors: number;
      errorRate: number;
      commonMistakes: { [correctColor: string]: { [wrongColor: string]: number } };
    };
    position2: {
      total: number;
      errors: number;
      errorRate: number;
      commonMistakes: { [correctColor: string]: { [wrongColor: string]: number } };
    };
    position3: {
      total: number;
      errors: number;
      errorRate: number;
      commonMistakes: { [correctColor: string]: { [wrongColor: string]: number } };
    };
    multiplier: {
      total: number;
      errors: number;
      errorRate: number;
      commonMistakes: { [correctColor: string]: { [wrongColor: string]: number } };
    };
    tolerance: {
      total: number;
      errors: number;
      errorRate: number;
      commonMistakes: { [correctColor: string]: { [wrongColor: string]: number } };
    };
  };
  colorConfusion: {
    [correctColor: string]: {
      [wrongColor: string]: number;
    };
  };
  questionTypeErrors: {
    [questionType: string]: {
      correct: number;
      incorrect: number;
      accuracy: number;
    };
  };
  resistorValueErrors: {
    [resistorValue: string]: {
      correct: number;
      incorrect: number;
      accuracy: number;
      commonWrongAnswers: { [wrongValue: string]: number };
    };
  };
  toleranceErrors: {
    [correctTolerance: string]: {
      correct: number;
      incorrect: number;
      accuracy: number;
      commonWrongAnswers: { [wrongTolerance: string]: number };
    };
  };
}

/**
 * Extract resistor value from formatted string (e.g., "1kΩ ±5%" -> "1kΩ")
 */
function extractResistorValue(formatted: string): string {
  return formatted.split(' ')[0] || formatted;
}

/**
 * Extract tolerance from formatted string (e.g., "1kΩ ±5%" -> "±5%")
 */
function extractTolerance(formatted: string): string {
  const parts = formatted.split(' ');
  return parts.length > 1 ? parts[1] : '';
}

/**
 * Parse bands from string (e.g., "brown-black-red-gold" -> ["brown", "black", "red", "gold"])
 */
function parseBands(bands: string | string[]): string[] {
  if (Array.isArray(bands)) return bands;
  return bands.split('-').filter(b => b.trim());
}

/**
 * Calculate deep analytics from question history
 */
export function calculateDeepAnalytics(questionHistory: any[]): DeepAnalytics {
  // Initialize structures
  const resistorTypeErrors = {
    FOUR_BAND: { correct: 0, incorrect: 0, accuracy: 0 },
    FIVE_BAND: { correct: 0, incorrect: 0, accuracy: 0 }
  };

  const digitPositionErrors = {
    position1: { total: 0, errors: 0, errorRate: 0, commonMistakes: {} as any },
    position2: { total: 0, errors: 0, errorRate: 0, commonMistakes: {} as any },
    position3: { total: 0, errors: 0, errorRate: 0, commonMistakes: {} as any },
    multiplier: { total: 0, errors: 0, errorRate: 0, commonMistakes: {} as any },
    tolerance: { total: 0, errors: 0, errorRate: 0, commonMistakes: {} as any }
  };

  const colorConfusion: { [correctColor: string]: { [wrongColor: string]: number } } = {};
  const questionTypeErrors: { [questionType: string]: { correct: number; incorrect: number; accuracy: number } } = {};
  const resistorValueErrors: { [resistorValue: string]: { correct: number; incorrect: number; accuracy: number; commonWrongAnswers: { [wrongValue: string]: number } } } = {};
  const toleranceErrors: { [correctTolerance: string]: { correct: number; incorrect: number; accuracy: number; commonWrongAnswers: { [wrongTolerance: string]: number } } } = {};

  if (!questionHistory || questionHistory.length === 0) {
    return {
      resistorTypeErrors,
      digitPositionErrors,
      colorConfusion,
      questionTypeErrors,
      resistorValueErrors,
      toleranceErrors
    };
  }

  questionHistory.forEach((q: any) => {
    const resistorType = q.resistorType || 'FOUR_BAND';
    const is5Band = resistorType === 'FIVE_BAND';
    const isCorrect = q.isCorrect || false;

    // 1. Resistor Type Errors
    if (resistorType === 'FOUR_BAND') {
      if (isCorrect) {
        resistorTypeErrors.FOUR_BAND.correct++;
      } else {
        resistorTypeErrors.FOUR_BAND.incorrect++;
      }
    } else if (resistorType === 'FIVE_BAND') {
      if (isCorrect) {
        resistorTypeErrors.FIVE_BAND.correct++;
      } else {
        resistorTypeErrors.FIVE_BAND.incorrect++;
      }
    }

    // 2. Question Type Errors
    const questionType = q.questionType || 'normal';
    if (!questionTypeErrors[questionType]) {
      questionTypeErrors[questionType] = { correct: 0, incorrect: 0, accuracy: 0 };
    }
    if (isCorrect) {
      questionTypeErrors[questionType].correct++;
    } else {
      questionTypeErrors[questionType].incorrect++;
    }

    // 3. Resistor Value Errors
    if (q.resistorValue !== undefined) {
      const correctValue = extractResistorValue(q.correctAnswer || formatResistance(q.resistorValue, q.correctTolerance || '±5%'));
      const userValue = q.userResistorValue !== undefined 
        ? extractResistorValue(formatResistance(q.userResistorValue, q.userTolerance || '±5%'))
        : extractResistorValue(q.userAnswer || '');

      if (!resistorValueErrors[correctValue]) {
        resistorValueErrors[correctValue] = {
          correct: 0,
          incorrect: 0,
          accuracy: 0,
          commonWrongAnswers: {}
        };
      }

      if (isCorrect) {
        resistorValueErrors[correctValue].correct++;
      } else {
        resistorValueErrors[correctValue].incorrect++;
        if (userValue && userValue !== correctValue) {
          resistorValueErrors[correctValue].commonWrongAnswers[userValue] = 
            (resistorValueErrors[correctValue].commonWrongAnswers[userValue] || 0) + 1;
        }
      }
    }

    // 4. Tolerance Errors
    const correctTol = q.correctTolerance || extractTolerance(q.correctAnswer || '');
    const userTol = q.userTolerance || extractTolerance(q.userAnswer || '');

    if (correctTol) {
      if (!toleranceErrors[correctTol]) {
        toleranceErrors[correctTol] = {
          correct: 0,
          incorrect: 0,
          accuracy: 0,
          commonWrongAnswers: {}
        };
      }

      const toleranceCorrect = correctTol === userTol;
      if (toleranceCorrect) {
        toleranceErrors[correctTol].correct++;
      } else {
        toleranceErrors[correctTol].incorrect++;
        if (userTol && userTol !== correctTol) {
          toleranceErrors[correctTol].commonWrongAnswers[userTol] = 
            (toleranceErrors[correctTol].commonWrongAnswers[userTol] || 0) + 1;
        }
      }
    }

    // 5. Digit Position Errors and Color Confusion
    // Handle both color_selection mode (with correctBands/userBands) and other modes
    const correctBands = q.correctBands || (q.bands ? parseBands(q.bands) : []);
    const userBands = q.userBands || (q.userAnswer && q.answerType === 'color_selection' ? parseBands(q.userAnswer) : []);

    // If we have band-by-band comparison data
    if (q.digitPositions) {
      const positions = q.digitPositions;
      
      // Position 1 (First digit)
      if (positions.position1) {
        digitPositionErrors.position1.total++;
        if (positions.position1.correct !== positions.position1.user) {
          digitPositionErrors.position1.errors++;
          const correct = positions.position1.correct;
          const wrong = positions.position1.user;
          if (!digitPositionErrors.position1.commonMistakes[correct]) {
            digitPositionErrors.position1.commonMistakes[correct] = {};
          }
          digitPositionErrors.position1.commonMistakes[correct][wrong] = 
            (digitPositionErrors.position1.commonMistakes[correct][wrong] || 0) + 1;
          
          // Color confusion
          if (!colorConfusion[correct]) {
            colorConfusion[correct] = {};
          }
          colorConfusion[correct][wrong] = (colorConfusion[correct][wrong] || 0) + 1;
        }
      }

      // Position 2 (Second digit)
      if (positions.position2) {
        digitPositionErrors.position2.total++;
        if (positions.position2.correct !== positions.position2.user) {
          digitPositionErrors.position2.errors++;
          const correct = positions.position2.correct;
          const wrong = positions.position2.user;
          if (!digitPositionErrors.position2.commonMistakes[correct]) {
            digitPositionErrors.position2.commonMistakes[correct] = {};
          }
          digitPositionErrors.position2.commonMistakes[correct][wrong] = 
            (digitPositionErrors.position2.commonMistakes[correct][wrong] || 0) + 1;
          
          if (!colorConfusion[correct]) {
            colorConfusion[correct] = {};
          }
          colorConfusion[correct][wrong] = (colorConfusion[correct][wrong] || 0) + 1;
        }
      }

      // Position 3 (Third digit - 5-band only)
      if (positions.position3) {
        digitPositionErrors.position3.total++;
        if (positions.position3.correct !== positions.position3.user) {
          digitPositionErrors.position3.errors++;
          const correct = positions.position3.correct;
          const wrong = positions.position3.user;
          if (!digitPositionErrors.position3.commonMistakes[correct]) {
            digitPositionErrors.position3.commonMistakes[correct] = {};
          }
          digitPositionErrors.position3.commonMistakes[correct][wrong] = 
            (digitPositionErrors.position3.commonMistakes[correct][wrong] || 0) + 1;
          
          if (!colorConfusion[correct]) {
            colorConfusion[correct] = {};
          }
          colorConfusion[correct][wrong] = (colorConfusion[correct][wrong] || 0) + 1;
        }
      }

      // Multiplier
      if (positions.multiplier) {
        digitPositionErrors.multiplier.total++;
        if (positions.multiplier.correct !== positions.multiplier.user) {
          digitPositionErrors.multiplier.errors++;
          const correct = positions.multiplier.correct;
          const wrong = positions.multiplier.user;
          if (!digitPositionErrors.multiplier.commonMistakes[correct]) {
            digitPositionErrors.multiplier.commonMistakes[correct] = {};
          }
          digitPositionErrors.multiplier.commonMistakes[correct][wrong] = 
            (digitPositionErrors.multiplier.commonMistakes[correct][wrong] || 0) + 1;
          
          if (!colorConfusion[correct]) {
            colorConfusion[correct] = {};
          }
          colorConfusion[correct][wrong] = (colorConfusion[correct][wrong] || 0) + 1;
        }
      }

      // Tolerance
      if (positions.tolerance) {
        digitPositionErrors.tolerance.total++;
        if (positions.tolerance.correct !== positions.tolerance.user) {
          digitPositionErrors.tolerance.errors++;
          const correct = positions.tolerance.correct;
          const wrong = positions.tolerance.user;
          if (!digitPositionErrors.tolerance.commonMistakes[correct]) {
            digitPositionErrors.tolerance.commonMistakes[correct] = {};
          }
          digitPositionErrors.tolerance.commonMistakes[correct][wrong] = 
            (digitPositionErrors.tolerance.commonMistakes[correct][wrong] || 0) + 1;
          
          if (!colorConfusion[correct]) {
            colorConfusion[correct] = {};
          }
          colorConfusion[correct][wrong] = (colorConfusion[correct][wrong] || 0) + 1;
        }
      }
    } else if (correctBands.length > 0 && userBands.length > 0 && !isCorrect) {
      // Fallback: Compare bands directly if digitPositions not available
      const maxBands = Math.max(correctBands.length, userBands.length);
      for (let i = 0; i < maxBands; i++) {
        const correctBand = correctBands[i];
        const userBand = userBands[i];
        
        if (correctBand && userBand && correctBand !== userBand) {
          // Determine position type
          let positionKey: 'position1' | 'position2' | 'position3' | 'multiplier' | 'tolerance' = 'position1';
          
          if (is5Band) {
            if (i === 0) positionKey = 'position1';
            else if (i === 1) positionKey = 'position2';
            else if (i === 2) positionKey = 'position3';
            else if (i === 3) positionKey = 'multiplier';
            else if (i === 4) positionKey = 'tolerance';
          } else {
            if (i === 0) positionKey = 'position1';
            else if (i === 1) positionKey = 'position2';
            else if (i === 2) positionKey = 'multiplier';
            else if (i === 3) positionKey = 'tolerance';
          }

          digitPositionErrors[positionKey].total++;
          digitPositionErrors[positionKey].errors++;
          
          if (!digitPositionErrors[positionKey].commonMistakes[correctBand]) {
            digitPositionErrors[positionKey].commonMistakes[correctBand] = {};
          }
          digitPositionErrors[positionKey].commonMistakes[correctBand][userBand] = 
            (digitPositionErrors[positionKey].commonMistakes[correctBand][userBand] || 0) + 1;
          
          if (!colorConfusion[correctBand]) {
            colorConfusion[correctBand] = {};
          }
          colorConfusion[correctBand][userBand] = (colorConfusion[correctBand][userBand] || 0) + 1;
        }
      }
    }
  });

  // Calculate accuracy percentages
  const calcAccuracy = (correct: number, incorrect: number) => {
    const total = correct + incorrect;
    return total > 0 ? (correct / total) * 100 : 0;
  };

  resistorTypeErrors.FOUR_BAND.accuracy = calcAccuracy(
    resistorTypeErrors.FOUR_BAND.correct,
    resistorTypeErrors.FOUR_BAND.incorrect
  );
  resistorTypeErrors.FIVE_BAND.accuracy = calcAccuracy(
    resistorTypeErrors.FIVE_BAND.correct,
    resistorTypeErrors.FIVE_BAND.incorrect
  );

  // Calculate error rates for positions
  Object.keys(digitPositionErrors).forEach((key) => {
    const pos = digitPositionErrors[key as keyof typeof digitPositionErrors];
    pos.errorRate = pos.total > 0 ? (pos.errors / pos.total) * 100 : 0;
  });

  // Calculate accuracy for question types
  Object.keys(questionTypeErrors).forEach((key) => {
    const qt = questionTypeErrors[key];
    qt.accuracy = calcAccuracy(qt.correct, qt.incorrect);
  });

  // Calculate accuracy for resistor values
  Object.keys(resistorValueErrors).forEach((key) => {
    const rv = resistorValueErrors[key];
    rv.accuracy = calcAccuracy(rv.correct, rv.incorrect);
  });

  // Calculate accuracy for tolerances
  Object.keys(toleranceErrors).forEach((key) => {
    const tol = toleranceErrors[key];
    tol.accuracy = calcAccuracy(tol.correct, tol.incorrect);
  });

  return {
    resistorTypeErrors,
    digitPositionErrors,
    colorConfusion,
    questionTypeErrors,
    resistorValueErrors,
    toleranceErrors
  };
}

/**
 * Aggregate deep analytics from multiple sessions
 */
export function aggregateDeepAnalytics(sessions: any[]): DeepAnalytics & {
  overall: {
    totalSessions: number;
    totalQuestions: number;
    overallAccuracy: number;
  };
  topWeakAreas: Array<{
    type: string;
    description: string;
    errorRate: number;
  }>;
} {
  const allQuestions: any[] = [];
  let totalCorrect = 0;
  let totalIncorrect = 0;

  sessions.forEach((session: any) => {
    const questions = session.questions || [];
    allQuestions.push(...questions);
    
    totalCorrect += session.correctAnswers || 0;
    totalIncorrect += session.incorrectAnswers || 0;
  });

  const deepAnalytics = calculateDeepAnalytics(allQuestions);

  // Calculate top weak areas
  const weakAreas: Array<{ type: string; description: string; errorRate: number }> = [];

  // Add position errors - simplified descriptions
  const positionTranslations: { [key: string]: string } = {
    'position1': 'หลักที่ 1',
    'position2': 'หลักที่ 2',
    'position3': 'หลักที่ 3',
    'multiplier': 'ตัวคูณ',
    'tolerance': 'ค่าความคลาดเคลื่อน'
  };
  
  Object.keys(deepAnalytics.digitPositionErrors).forEach((key) => {
    const pos = deepAnalytics.digitPositionErrors[key as keyof typeof deepAnalytics.digitPositionErrors];
    if (pos.total > 0 && pos.errorRate > 0) {
      weakAreas.push({
        type: 'digit_position',
        description: positionTranslations[key] || key,
        errorRate: pos.errorRate
      });
    }
  });

  // Add question type errors - with Thai translations
  const questionTypeTranslations: { [key: string]: string } = {
    'normal': 'แบบปกติ',
    'color_to_value_band_by_band': 'สี→ค่า (ทีละแถบ)',
    'color_to_value_full': 'สี→ค่า (เต็ม)',
    'value_to_color_band_by_band': 'ค่า→สี (ทีละแถบ)',
    'value_to_color_full': 'ค่า→สี (เต็ม)',
    'multiple_choice': 'ตัวเลือก',
    'fill_in': 'เติมคำ',
    'color_select': 'เลือกสี'
  };
  
  Object.keys(deepAnalytics.questionTypeErrors).forEach((key) => {
    const qt = deepAnalytics.questionTypeErrors[key];
    const total = qt.correct + qt.incorrect;
    if (total > 0) {
      const errorRate = 100 - qt.accuracy;
      if (errorRate > 0) {
        const translatedType = questionTypeTranslations[key] || key;
        weakAreas.push({
          type: 'question_type',
          description: translatedType,
          errorRate
        });
      }
    }
  });

  // Sort by error rate descending
  weakAreas.sort((a, b) => b.errorRate - a.errorRate);

  const overallAccuracy = totalCorrect + totalIncorrect > 0
    ? (totalCorrect / (totalCorrect + totalIncorrect)) * 100
    : 0;

  return {
    ...deepAnalytics,
    overall: {
      totalSessions: sessions.length,
      totalQuestions: totalCorrect + totalIncorrect,
      overallAccuracy
    },
    topWeakAreas: weakAreas.slice(0, 10) // Top 10 weak areas
  };
}

