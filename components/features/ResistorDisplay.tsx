'use client';

import Image from 'next/image';

interface ResistorDisplayProps {
  bands: string[];
  showAnswer?: boolean;
  answer?: string;
  isCorrect?: boolean;
  type?: '4-band' | '5-band' | 'FOUR_BAND' | 'FIVE_BAND';
  highlightBand?: number; // Index of band to highlight (for band-by-band practice)
  partialBands?: boolean; // If true, show empty bands as gray/transparent
}

export default function ResistorDisplay({ bands, showAnswer = false, answer, isCorrect, type, highlightBand, partialBands = false }: ResistorDisplayProps) {
  // Normalize bands - handle string, null, undefined, or array
  let normalizedBands: string[] = [];
  try {
    if (Array.isArray(bands)) {
      // When partialBands is true, preserve empty strings for highlighted bands
      // Otherwise, filter out empty values
      if (partialBands && highlightBand !== undefined && highlightBand !== null) {
        // Preserve all bands including empty strings, but ensure array has correct length
        normalizedBands = bands.map((b: any) => {
          if (b == null) return '';
          return String(b).trim();
        });
        // Ensure array has correct length based on type
        const expectedLength = (type === '5-band' || type === 'FIVE_BAND') ? 5 : 4;
        while (normalizedBands.length < expectedLength) {
          normalizedBands.push('');
        }
      } else {
        // Filter out any null/undefined/empty values and ensure all are strings
        normalizedBands = bands
          .filter((b: any) => b != null && b !== '')
          .map((b: any) => String(b).trim())
          .filter((b: string) => b.length > 0);
      }
    } else if (bands !== null && bands !== undefined && typeof bands === 'string') {
      // Parse string like "brown-black-red-gold" to array
      const bandsStr = String(bands).trim();
      if (bandsStr.length > 0) {
        normalizedBands = bandsStr.split('-').map((b: string) => b.trim()).filter((b: string) => b.length > 0);
      }
    }
    // If normalizedBands is still empty and we have answer, try to parse from answer
    if (normalizedBands.length === 0 && answer && typeof answer === 'string') {
      const answerStr = String(answer).trim();
      if (answerStr.includes('-')) {
        normalizedBands = answerStr.split('-').map((b: string) => b.trim()).filter((b: string) => b.length > 0);
      }
    }
  } catch (error) {
    // Safety fallback - if anything goes wrong, use empty array
    normalizedBands = [];
  }
  
  // Determine if it's a 5-band resistor based on bands.length or type prop
  const is5Band = type === '5-band' || type === 'FIVE_BAND' || normalizedBands.length === 5;
  
  const getColorCode = (color: string | undefined | null, index?: number): string => {
    
    if (!color || typeof color !== 'string' || color.trim() === '') {
      // If partialBands is true, show empty bands as semi-transparent gray
      if (partialBands) {
        return 'rgba(204, 204, 204, 0.3)';
      }
      return '#CCCCCC'; // Default gray color for empty/undefined bands
    }
    const colorMap: { [key: string]: string } = {
      black: '#000000',
      brown: '#8B4513',
      red: '#DC143C',
      orange: '#FF6600',
      yellow: '#FFFF00',
      green: '#008000',
      blue: '#0000FF',
      violet: '#8B00FF',
      purple: '#8B00FF', // Alias for violet
      gray: '#808080',
      grey: '#808080', // Alias for gray
      white: '#FFFFFF',
      gold: '#FFD700',
      silver: '#C0C0C0',
    };
    const colorLower = color.toLowerCase().trim();
    const result = colorMap[colorLower] || '#CCCCCC';
    return result;
  };

  return (
    <div className="flex justify-center items-center py-2">
      <div className="relative w-full max-w-xl">
        {/* Template Background */}
        <div className="relative w-full">
          <Image
            src="/resistor-template.png"
            alt="Resistor Template"
            width={600}
            height={150}
            className="w-full h-auto"
            priority
          />
          
          {/* Overlay Color Bands - Positioned absolutely over template */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-[72%] max-w-[460px]">
              {/* SVG overlay for precise positioning */}
              {/* Expanded viewBox to accommodate taller bands */}
              <svg 
                className="w-full h-full" 
                viewBox="0 -200 400 500"
                preserveAspectRatio="xMidYMid meet"
              >
                {is5Band ? (
                  <>
                    {/* 5-Band: Band 1 */}
                    {(normalizedBands.length >= 1 || highlightBand === 0) && (
                      <rect
                        x="24"
                        y="-3"
                        width="35"
                        height="105"
                        fill={getColorCode(normalizedBands[0], 0)}
                        stroke={highlightBand === 0 ? "#FF6600" : "none"}
                        strokeWidth={highlightBand === 0 ? "4" : "0"}
                        opacity={highlightBand === 0 ? (partialBands && !normalizedBands[0] ? 0.8 : 1) : (partialBands && !normalizedBands[0] ? 0.5 : 1)}
                      />
                    )}
                    
                    {/* 5-Band: Band 2 */}
                    {(normalizedBands.length >= 2 || highlightBand === 1) && (
                      <rect
                        x="85"
                        y="7"
                        width="35"
                        height="87"
                        fill={getColorCode(normalizedBands[1], 1)}
                        stroke={highlightBand === 1 ? "#FF6600" : "none"}
                        strokeWidth={highlightBand === 1 ? "4" : "0"}
                        opacity={highlightBand === 1 ? (partialBands && !normalizedBands[1] ? 0.8 : 1) : (partialBands && !normalizedBands[1] ? 0.5 : 1)}
                      />
                    )}
                    
                    {/* 5-Band: Band 3 */}
                    {(normalizedBands.length >= 3 || highlightBand === 2) && (
                      <rect
                        x="150"
                        y="7"
                        width="35"
                        height="87"
                        fill={getColorCode(normalizedBands[2], 2)}
                        stroke={highlightBand === 2 ? "#FF6600" : "none"}
                        strokeWidth={highlightBand === 2 ? "4" : "0"}
                        opacity={highlightBand === 2 ? (partialBands && !normalizedBands[2] ? 0.8 : 1) : (partialBands && !normalizedBands[2] ? 0.5 : 1)}
                      />
                    )}
                    
                    {/* 5-Band: Band 4 */}
                    {(normalizedBands.length >= 4 || highlightBand === 3) && (
                      <rect
                        x="220"
                        y="7"
                        width="35"
                        height="87"
                        fill={getColorCode(normalizedBands[3], 3)}
                        stroke={highlightBand === 3 ? "#FF6600" : "none"}
                        strokeWidth={highlightBand === 3 ? "4" : "0"}
                        opacity={highlightBand === 3 ? (partialBands && !normalizedBands[3] ? 0.8 : 1) : (partialBands && !normalizedBands[3] ? 0.5 : 1)}
                      />
                    )}
                    
                    {/* 5-Band: Band 5 - Tolerance (taller) */}
                    {(normalizedBands.length >= 5 || highlightBand === 4) && (
                      <rect
                        x="345"
                        y="-3"
                        width="35"
                        height="105"
                        fill={getColorCode(normalizedBands[4], 4)}
                        stroke={highlightBand === 4 ? "#FF6600" : "none"}
                        strokeWidth={highlightBand === 4 ? "4" : "0"}
                        opacity={highlightBand === 4 ? (partialBands && !normalizedBands[4] ? 0.8 : 1) : (partialBands && !normalizedBands[4] ? 0.5 : 1)}
                      />
                    )}
                  </>
                ) : (
                  <>
                    {/* 4-Band: Band 1 */}
                    {(normalizedBands.length >= 1 || highlightBand === 0) && (
                      <rect
                        x="80"
                        y="7"
                        width="35"
                        height="87"
                        fill={getColorCode(normalizedBands[0], 0)}
                        stroke={highlightBand === 0 ? "#FF6600" : "none"}
                        strokeWidth={highlightBand === 0 ? "4" : "0"}
                        opacity={highlightBand === 0 ? (partialBands && !normalizedBands[0] ? 0.8 : 1) : (partialBands && !normalizedBands[0] ? 0.5 : 1)}
                      />
                    )}
                    
                    {/* 4-Band: Band 2 */}
                    {(normalizedBands.length >= 2 || highlightBand === 1) && (
                      <rect
                        x="150"
                        y="7"
                        width="35"
                        height="87"
                        fill={getColorCode(normalizedBands[1], 1)}
                        stroke={highlightBand === 1 ? "#FF6600" : "none"}
                        strokeWidth={highlightBand === 1 ? "4" : "0"}
                        opacity={highlightBand === 1 ? (partialBands && !normalizedBands[1] ? 0.8 : 1) : (partialBands && !normalizedBands[1] ? 0.5 : 1)}
                      />
                    )}
                    
                    {/* 4-Band: Band 3 - Multiplier */}
                    {(normalizedBands.length >= 3 || highlightBand === 2) && (
                      <rect
                        x="220"
                        y="7"
                        width="35"
                        height="87"
                        fill={getColorCode(normalizedBands[2], 2)}
                        stroke={highlightBand === 2 ? "#FF6600" : "none"}
                        strokeWidth={highlightBand === 2 ? "4" : "0"}
                        opacity={highlightBand === 2 ? (partialBands && !normalizedBands[2] ? 0.8 : 1) : (partialBands && !normalizedBands[2] ? 0.5 : 1)}
                      />
                    )}
                    
                    {/* 4-Band: Band 4 - Tolerance (taller) */}
                    {(normalizedBands.length >= 4 || highlightBand === 3) && (
                      <rect
                        x="345"
                        y="-3"
                        width="35"
                        height="105"
                        fill={getColorCode(normalizedBands[3], 3)}
                        stroke={highlightBand === 3 ? "#FF6600" : "none"}
                        strokeWidth={highlightBand === 3 ? "4" : "0"}
                        opacity={highlightBand === 3 ? (partialBands && !normalizedBands[3] ? 0.8 : 1) : (partialBands && !normalizedBands[3] ? 0.5 : 1)}
                      />
                    )}
                  </>
                )}
              </svg>
            </div>
          </div>
        </div>

        {/* Answer Display */}
        {showAnswer && answer && (
          <div className={`absolute left-1/2 -translate-x-1/2 top-full mt-4 whitespace-nowrap rounded-lg px-3 py-2 sm:px-4 text-sm sm:text-base text-center font-bold shadow-lg ${
            isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {answer}
          </div>
        )}
      </div>
    </div>
  );
}
