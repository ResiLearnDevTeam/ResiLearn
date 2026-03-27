'use client';

import { Lightbulb } from 'lucide-react';

interface SolutionExplanationProps {
  explanation: string;
  className?: string;
}

/**
 * Component for displaying step-by-step solution explanation
 * Shows when user answers incorrectly to help them understand the solution
 */
export default function SolutionExplanation({
  explanation,
  className = '',
}: SolutionExplanationProps) {
  if (!explanation) return null;

  // Split explanation by newlines to display as steps
  const lines = explanation.split('\n').filter(line => line.trim());

  return (
    <div className={`rounded-xl border-2 border-blue-200 bg-blue-50 p-4 lg:p-6 ${className}`}>
      <div className="flex items-start gap-3 mb-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white">
          <Lightbulb className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-bold text-blue-900">เฉลยวิธีทำ</h3>
      </div>
      
      <div className="space-y-2 text-gray-800">
        {lines.map((line, index) => {
          // Check if line is a step (starts with number)
          const isStep = /^\d+\./.test(line.trim());
          // Check if line is a section header
          const isHeader = line.trim().endsWith(':') && !isStep;
          
          if (isHeader) {
            return (
              <div key={index} className="font-bold text-blue-800 mt-3 mb-1">
                {line}
              </div>
            );
          } else if (isStep) {
            return (
              <div key={index} className="flex items-start gap-2">
                <span className="text-blue-600 font-semibold shrink-0">
                  {line.match(/^\d+\./)?.[0]}
                </span>
                <span className="flex-1">{line.replace(/^\d+\.\s*/, '')}</span>
              </div>
            );
          } else if (line.trim() === '') {
            return <div key={index} className="h-2" />;
          } else {
            return (
              <div key={index} className="pl-4">
                {line}
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}
