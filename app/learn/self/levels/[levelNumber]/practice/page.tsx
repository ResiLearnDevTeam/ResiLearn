'use client';

import LeftSidebar from '@/components/layout/LeftSidebar';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import ResistorDisplay from '@/components/features/ResistorDisplay';
import Image from 'next/image';

function LevelPracticeContent() {
  const params = useParams();
  const levelNumber = params.levelNumber as string;
  
  const [level, setLevel] = useState<any>(null);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLevelData();
  }, [levelNumber]);

  const fetchLevelData = async () => {
    try {
      const response = await fetch('/api/levels');
      if (response.ok) {
        const levels = await response.json();
        const foundLevel = levels.find((l: any) => l.number === parseInt(levelNumber));
        if (foundLevel) {
          setLevel(foundLevel);
        }
      }
    } catch (error) {
      console.error('Error fetching level:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Color tutorials for Level 1
  const lessons = [
    {
      title: 'Introduction to Resistor Colors',
      description: 'Learn how to read resistor color codes step by step',
      content: (
        <div className="space-y-6">
          <div className="rounded-lg bg-orange-50 p-4 border-2 border-orange-200">
            <h3 className="text-lg font-bold text-orange-900 mb-2">What are Resistor Color Codes?</h3>
            <p className="text-gray-700 leading-relaxed">
              Resistor color codes are a system used to identify the resistance value of a resistor. 
              Each color represents a number or multiplier that we combine to calculate the final resistance.
            </p>
          </div>
          
          <div className="rounded-lg bg-blue-50 p-4 border-2 border-blue-200">
            <h3 className="text-lg font-bold text-blue-900 mb-2">🎯 Learning Goals</h3>
            <ul className="text-gray-700 space-y-2">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Recognize the 12 standard resistor colors</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Understand the digit value of each color</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Learn how colors are used in calculations</span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: 'Digit Colors (0-9)',
      description: 'Learn the first 10 colors and their numeric values',
      content: (
        <div className="space-y-6">
          <div className="rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 p-6 border-2 border-purple-200">
            <h3 className="text-xl font-bold text-purple-900 mb-4">Digit Colors</h3>
            <p className="text-gray-700 mb-4">
              These colors are used for the <strong>first digit</strong> (and second digit in 4-band, or second and third in 5-band) of the resistance value.
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {[
                { color: 'black', value: 0, bg: 'bg-black', text: 'text-white' },
                { color: 'brown', value: 1, bg: 'bg-amber-800', text: 'text-white' },
                { color: 'red', value: 2, bg: 'bg-red-600', text: 'text-white' },
                { color: 'orange', value: 3, bg: 'bg-orange-500', text: 'text-white' },
                { color: 'yellow', value: 4, bg: 'bg-yellow-400', text: 'text-gray-900' },
                { color: 'green', value: 5, bg: 'bg-green-600', text: 'text-white' },
                { color: 'blue', value: 6, bg: 'bg-blue-600', text: 'text-white' },
                { color: 'violet', value: 7, bg: 'bg-purple-600', text: 'text-white' },
                { color: 'gray', value: 8, bg: 'bg-gray-500', text: 'text-white' },
                { color: 'white', value: 9, bg: 'bg-white', text: 'text-gray-900', border: 'border-2 border-gray-300' },
              ].map((item) => (
                <div 
                  key={item.color}
                  className={`rounded-lg ${item.bg} ${item.border || ''} p-3 text-center shadow-md`}
                >
                  <div className="font-bold text-lg mb-1">{item.value}</div>
                  <div className={`text-xs font-semibold uppercase ${item.text}`}>
                    {item.color}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 rounded-lg bg-white p-4 shadow-sm">
              <p className="text-sm text-gray-600">
                <strong>💡 Tip:</strong> Notice that these colors follow the spectrum from black (0) to white (9). 
                Brown follows black because it represents "1".
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Example: Reading a 4-Band Resistor',
      description: 'See how colors translate to resistance values',
      content: (
        <div className="space-y-6">
          <div className="rounded-lg bg-green-50 p-6 border-2 border-green-200">
            <h3 className="text-xl font-bold text-green-900 mb-4">Real Example</h3>
            
            <div className="mb-4">
              <ResistorDisplay 
                bands={['brown', 'red', 'orange', 'gold']}
                type="FOUR_BAND"
              />
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-amber-800 flex items-center justify-center text-white font-bold text-xl">
                  1
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Band 1: Brown</div>
                  <div className="text-sm text-gray-600">First digit = 1</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold text-xl">
                  2
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Band 2: Red</div>
                  <div className="text-sm text-gray-600">Second digit = 2</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-orange-500 flex items-center justify-center text-white font-bold text-xl">
                  3
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Band 3: Orange</div>
                  <div className="text-sm text-gray-600">Multiplier = 1000 (×1000)</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-yellow-400 flex items-center justify-center text-gray-900 font-bold">
                  ±5%
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Band 4: Gold</div>
                  <div className="text-sm text-gray-600">Tolerance = ±5%</div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <div className="text-sm font-semibold mb-1">Calculation:</div>
              <div className="text-2xl font-bold">
                12 × 1000 = <strong>12,000Ω</strong>
              </div>
              <div className="text-sm mt-1">or <strong>12kΩ ±5%</strong></div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Practice: Try to Read This',
      description: 'Test your understanding with an interactive example',
      content: (
        <div className="space-y-6">
          <div className="rounded-lg bg-indigo-50 p-6 border-2 border-indigo-200">
            <h3 className="text-xl font-bold text-indigo-900 mb-4">Your Turn!</h3>
            
            <div className="mb-6">
              <ResistorDisplay 
                bands={['red', 'blue', 'yellow', 'gold']}
                type="FOUR_BAND"
              />
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-bold text-gray-900 mb-3">Try to calculate:</h4>
              <div className="space-y-2 text-gray-700">
                <div className="flex items-center gap-2">
                  <div className="w-24 text-sm">Band 1 (Red):</div>
                  <input type="text" className="flex-1 border border-gray-300 rounded px-3 py-2" placeholder="?" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 text-sm">Band 2 (Blue):</div>
                  <input type="text" className="flex-1 border border-gray-300 rounded px-3 py-2" placeholder="?" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 text-sm">Band 3 (Yellow):</div>
                  <input type="text" className="flex-1 border border-gray-300 rounded px-3 py-2" placeholder="×?" />
                </div>
              </div>
              
              <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-center">
                <div className="text-sm font-semibold mb-1">Answer:</div>
                <div className="text-2xl font-bold">26 × 10,000 = 260kΩ ±5%</div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Summary & Next Steps',
      description: 'You learned the basics! Ready for practice?',
      content: (
        <div className="space-y-6">
          <div className="rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 p-6 border-2 border-green-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-green-900">Congratulations!</h3>
            </div>
            
            <div className="bg-white rounded-lg p-4 mb-4">
              <h4 className="font-bold text-gray-900 mb-3">What You've Learned:</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                  </svg>
                  <span>The 10 digit colors (0-9) and their meanings</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                  </svg>
                  <span>How to read a 4-band resistor step by step</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                  </svg>
                  <span>Basic calculation: digits × multiplier = resistance</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
              <h4 className="font-bold text-orange-900 mb-2">🚀 Ready for Next Level?</h4>
              <p className="text-sm text-orange-800">
                You've mastered the basics! Now practice with unlimited questions to build your skills. 
                When you're confident, take the Quiz to unlock the next level.
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const handleNext = () => {
    if (currentLesson < lessons.length - 1) {
      setCurrentLesson(currentLesson + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrev = () => {
    if (currentLesson > 0) {
      setCurrentLesson(currentLesson - 1);
      window.scrollTo(0, 0);
    }
  };

  if (isLoading || !level) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        <LeftSidebar />
        <div className="flex-1 lg:ml-64 flex items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-600 border-r-transparent"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  const currentLessonData = lessons[currentLesson];
  const progress = ((currentLesson + 1) / lessons.length) * 100;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <LeftSidebar />

      <div className="flex-1 lg:ml-64">
        <main className="container mx-auto px-4 py-4 sm:py-6 lg:px-8 max-w-4xl">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-md">
            <Link href="/learn/self/learningpath" className="flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-medium">Back to Learning Path</span>
            </Link>
            
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">Level {levelNumber}: {level.name}</div>
              <div className="text-sm text-gray-500">Lesson {currentLesson + 1} of {lessons.length}</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Lesson Card */}
          <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">{currentLessonData.title}</h2>
            <p className="text-lg text-gray-600 mb-6">{currentLessonData.description}</p>
            
            {currentLessonData.content}
          </div>

          {/* Navigation Buttons */}
          <div className="mt-6 flex justify-between gap-4">
            <button
              onClick={handlePrev}
              disabled={currentLesson === 0}
              className={`flex items-center gap-2 rounded-xl px-6 py-3 font-semibold transition-all ${
                currentLesson === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 shadow-md hover:bg-gray-50'
              }`}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            {currentLesson < lessons.length - 1 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:from-orange-600 hover:to-orange-700"
              >
                Next
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <Link
                href={`/learn/self/levels/${levelNumber}/quiz`}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-green-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:from-green-600 hover:to-green-700"
              >
                Start Quiz
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function LevelPracticePage() {
  return <LevelPracticeContent />;
}