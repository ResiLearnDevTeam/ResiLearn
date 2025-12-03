'use client';

interface ColorBandSelectorProps {
  bands: string[];
  onBandChange: (index: number, color: string) => void;
  resistorType: 'FOUR_BAND' | 'FIVE_BAND';
  disabled?: boolean;
  showLabels?: boolean;
}

export default function ColorBandSelector({
  bands,
  onBandChange,
  resistorType,
  disabled = false,
  showLabels = true
}: ColorBandSelectorProps) {
  const is5Band = resistorType === 'FIVE_BAND';
  
  const colorOptions = {
    digit: ['black', 'brown', 'red', 'orange', 'yellow', 'green', 'blue', 'violet', 'gray', 'white'],
    multiplier: ['black', 'brown', 'red', 'orange', 'yellow', 'green', 'blue'],
    tolerance: ['brown', 'red', 'green', 'blue', 'violet', 'gray', 'gold', 'silver']
  };

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

  const getBandLabel = (index: number): string => {
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
  };

  const getAvailableColors = (index: number): string[] => {
    if (is5Band) {
      if (index === 0) {
        // First digit cannot be black
        return colorOptions.digit.filter(c => c !== 'black');
      } else if (index >= 1 && index <= 2) {
        return colorOptions.digit;
      } else if (index === 3) {
        return colorOptions.multiplier;
      } else if (index === 4) {
        return colorOptions.tolerance;
      }
    } else {
      if (index === 0) {
        // First digit cannot be black
        return colorOptions.digit.filter(c => c !== 'black');
      } else if (index === 1) {
        return colorOptions.digit;
      } else if (index === 2) {
        return colorOptions.multiplier;
      } else if (index === 3) {
        return colorOptions.tolerance;
      }
    }
    return [];
  };

  const getColorName = (color: string): string => {
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
  };

  return (
    <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
      {bands.map((band, index) => {
        const availableColors = getAvailableColors(index);
        const currentColor = band || availableColors[0];
        
        return (
          <div key={index} className="space-y-1.5">
            {showLabels && (
              <label className="block text-xs font-bold text-gray-800 mb-1">
                {getBandLabel(index)}
              </label>
            )}
            <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-10 gap-2">
              {availableColors.map((color) => {
                const isSelected = band === color;
                const colorCode = getColorCode(color);
                
                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => !disabled && onBandChange(index, color)}
                    disabled={disabled}
                    className={`
                      relative flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-lg border-2 transition-all
                      ${isSelected
                        ? 'border-orange-600 bg-orange-100 shadow-md ring-2 ring-orange-300'
                        : 'border-gray-300 bg-white hover:border-orange-400 hover:bg-orange-50 hover:shadow-sm'
                      }
                      ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'}
                    `}
                    title={getColorName(color)}
                  >
                    <div
                      className="w-10 h-10 rounded-lg border-2 border-gray-400 flex-shrink-0 shadow-sm"
                      style={{ backgroundColor: colorCode }}
                    />
                    <span className="text-xs font-semibold text-gray-900 text-center leading-tight">
                      {getColorName(color)}
                    </span>
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-600 rounded-full flex items-center justify-center shadow-md">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

