'use client';

interface ResistorDisplayProps {
  bands: string[];
  showAnswer?: boolean;
  answer?: string;
  isCorrect?: boolean;
}

export default function ResistorDisplay({ bands, showAnswer = false, answer, isCorrect }: ResistorDisplayProps) {
  return (
    <div className="flex justify-center items-center py-6">
      <div className="relative">
        {/* Resistor Display - To be implemented */}
        
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
