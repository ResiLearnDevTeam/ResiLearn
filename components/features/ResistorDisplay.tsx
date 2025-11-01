'use client';

import Image from 'next/image';

interface ResistorDisplayProps {
  bands: string[];
  showAnswer?: boolean;
  answer?: string;
  isCorrect?: boolean;
}

export default function ResistorDisplay({ bands, showAnswer = false, answer, isCorrect }: ResistorDisplayProps) {
  const getColorCode = (color: string): string => {
    const colorMap: { [key: string]: string } = {
      black: '#000000',
      brown: '#8B4513',
      red: '#DC143C',
      orange: '#FF6600',
      yellow: '#FFFF00',
      green: '#008000',
      blue: '#0000FF',
      violet: '#8B00FF',
      gray: '#808080',
      white: '#FFFFFF',
      gold: '#FFD700',
      silver: '#C0C0C0',
    };
    return colorMap[color.toLowerCase()] || '#CCCCCC';
  };

  // Debug: Log bands array and individual band colors
  console.log('ResistorDisplay bands:', bands);
  console.log('Band 1 color:', getColorCode(bands[0]));
  console.log('Band 2 color:', getColorCode(bands[1]));
  console.log('Band 3 color:', getColorCode(bands[2]));
  console.log('Band 4 color:', getColorCode(bands[3]));
  console.log('Answer:', answer, 'isCorrect:', isCorrect);

  return (
    <div className="flex justify-center items-center py-6">
      <div className="relative w-full max-w-lg">
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
            <div className="relative w-[60%] max-w-[360px]">
              {/* SVG overlay for precise positioning */}
              {/* Expanded viewBox to accommodate taller bands */}
              <svg 
                className="w-full h-full" 
                viewBox="0 -200 400 500"
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Band 1 */}
                <rect
                  x="80"
                  y="0"
                  width="35"
                  height="100"
                  fill={getColorCode(bands[0])}
                  stroke="#000000"
                  strokeWidth="1"
                />
                
                {/* Band 2 */}
                <rect
                  x="150"
                  y="0"
                  width="35"
                  height="100"
                  fill={getColorCode(bands[1])}
                  stroke="#000000"
                  strokeWidth="1"
                />
                
                {/* Band 3 */}
                <rect
                  x="220"
                  y="0"
                  width="35"
                  height="100"
                  fill={getColorCode(bands[2])}
                  stroke="#000000"
                  strokeWidth="1"
                />
                
                {/* Band 4 - Taller */}
                <rect
                  x="365"
                  y="-13"
                  width="35"
                  height="127"
                  fill={getColorCode(bands[3])}
                  stroke="#000000"
                  strokeWidth="1"
                />
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
