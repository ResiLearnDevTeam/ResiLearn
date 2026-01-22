'use client';

import { FixedQuestion } from '@/types/classroom';
import ResistorDisplay from '@/components/features/ResistorDisplay';
import ColorBandSelector from '@/components/features/ColorBandSelector';
import { formatResistance, colorCodes } from '@/lib/resistorUtils';
import { Plus, Trash2, X } from 'lucide-react';

interface FixedQuestionsEditorProps {
  questions: FixedQuestion[];
  onChange: (questions: FixedQuestion[]) => void;
}

export default function FixedQuestionsEditor({ questions, onChange }: FixedQuestionsEditorProps) {

  const calculateResistance = (bands: string[], resistorType: 'FOUR_BAND' | 'FIVE_BAND'): string => {
    try {
      if (resistorType === 'FIVE_BAND') {
        if (bands.length < 5) return '';
        const digit1 = colorCodes.digit[bands[0] as keyof typeof colorCodes.digit] || 0;
        const digit2 = colorCodes.digit[bands[1] as keyof typeof colorCodes.digit] || 0;
        const digit3 = colorCodes.digit[bands[2] as keyof typeof colorCodes.digit] || 0;
        const multiplier = colorCodes.multiplier[bands[3] as keyof typeof colorCodes.multiplier] || 1;
        const tolerance = colorCodes.tolerance[bands[4] as keyof typeof colorCodes.tolerance] || '±5%';
        const value = parseInt(`${digit1}${digit2}${digit3}`) * multiplier;
        return formatResistance(value, tolerance);
      } else {
        if (bands.length < 4) return '';
        const digit1 = colorCodes.digit[bands[0] as keyof typeof colorCodes.digit] || 0;
        const digit2 = colorCodes.digit[bands[1] as keyof typeof colorCodes.digit] || 0;
        const multiplier = colorCodes.multiplier[bands[2] as keyof typeof colorCodes.multiplier] || 1;
        const tolerance = colorCodes.tolerance[bands[3] as keyof typeof colorCodes.tolerance] || '±5%';
        const value = parseInt(`${digit1}${digit2}`) * multiplier;
        return formatResistance(value, tolerance);
      }
    } catch {
      return '';
    }
  };

  const handleAddQuestion = () => {
    const newQuestion: FixedQuestion = {
      id: `question_${Date.now()}`,
      order: questions.length + 1,
      resistorType: 'FOUR_BAND',
      answerType: 'multiple_choice',
      bands: ['brown', 'red', 'orange', 'gold'],
      correctAnswer: calculateResistance(['brown', 'red', 'orange', 'gold'], 'FOUR_BAND'),
      options: ['12kΩ ±5%', '1.2kΩ ±5%', '120kΩ ±5%', '1.2MΩ ±5%'],
      points: 10,
    };
    onChange([...questions, newQuestion]);
  };

  const handleDeleteQuestion = (questionId: string) => {
    const updated = questions.filter(q => q.id !== questionId).map((q, idx) => ({ ...q, order: idx + 1 }));
    onChange(updated);
  };

  const handleUpdateQuestion = (questionId: string, updates: Partial<FixedQuestion>) => {
    const updated = questions.map(q => {
      if (q.id === questionId) {
        const updatedQ = { ...q, ...updates };
        // Auto-calculate correctAnswer if bands changed
        if (updates.bands && updates.bands.length >= (updatedQ.resistorType === 'FIVE_BAND' ? 5 : 4)) {
          updatedQ.correctAnswer = calculateResistance(updates.bands, updatedQ.resistorType);
        }
        return updatedQ;
      }
      return q;
    });
    onChange(updated);
  };

  const handleBandChange = (questionId: string, index: number, color: string) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return;
    
    const newBands = [...question.bands];
    newBands[index] = color;
    const calculatedAnswer = calculateResistance(newBands, question.resistorType);
    
    handleUpdateQuestion(questionId, {
      bands: newBands,
      correctAnswer: calculatedAnswer || question.correctAnswer,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Fixed Questions</h3>
        <button
          type="button"
          onClick={handleAddQuestion}
          className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-green-700"
        >
          <Plus className="h-4 w-4" />
          เพิ่มโจทย์
        </button>
      </div>

      {questions.length === 0 ? (
        <div className="text-center py-8 text-gray-500 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50">
          <p>ยังไม่มีโจทย์ กรุณาเพิ่มโจทย์อย่างน้อย 1 ข้อ</p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((question, index) => {
            const expectedBandsCount = question.resistorType === 'FIVE_BAND' ? 5 : 4;
            const bands = [...question.bands];
            while (bands.length < expectedBandsCount) {
              bands.push('');
            }

            return (
              <div key={question.id} className="bg-white rounded-xl border-2 border-gray-200 p-6 space-y-4">
                {/* Question Header */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">ข้อ {index + 1}</h4>
                      <p className="text-sm text-gray-600">
                        {question.resistorType === 'FIVE_BAND' ? '5 แถบสี' : '4 แถบสี'} - {
                          question.answerType === 'multiple_choice' ? 'ตัวเลือก'
                          : question.answerType === 'fill_in' ? 'เติมคำ'
                          : 'เลือกสี'
                        }
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteQuestion(question.id)}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>

                {/* Question Editor - Always Expanded */}
                <div className="space-y-4">
                  {/* Resistor Type */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      ประเภทตัวต้านทาน
                    </label>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => {
                          const newBands = bands.slice(0, 4).filter(b => b);
                          handleUpdateQuestion(question.id, {
                            resistorType: 'FOUR_BAND',
                            bands: newBands.length >= 4 ? newBands : ['brown', 'red', 'orange', 'gold'],
                          });
                        }}
                        className={`
                          rounded-xl border-2 p-4 text-center transition-all
                          ${question.resistorType === 'FOUR_BAND'
                            ? 'border-orange-500 bg-orange-50 font-bold text-orange-900'
                            : 'border-gray-200 bg-white text-gray-900 hover:border-orange-300'
                          }
                        `}
                      >
                        4 แถบสี
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const newBands = bands.length >= 5 ? bands : [...bands.slice(0, 4), 'gold'];
                          handleUpdateQuestion(question.id, {
                            resistorType: 'FIVE_BAND',
                            bands: newBands.length >= 5 
                              ? newBands 
                              : ['brown', 'red', 'orange', 'yellow', 'gold'],
                          });
                        }}
                        className={`
                          rounded-xl border-2 p-4 text-center transition-all
                          ${question.resistorType === 'FIVE_BAND'
                            ? 'border-orange-500 bg-orange-50 font-bold text-orange-900'
                            : 'border-gray-200 bg-white text-gray-900 hover:border-orange-300'
                          }
                        `}
                      >
                        5 แถบสี
                      </button>
                    </div>
                  </div>

                  {/* Answer Type */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      ประเภทคำตอบ
                    </label>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {(['multiple_choice', 'fill_in', 'color_selection'] as const).map((answerType) => (
                        <button
                          key={answerType}
                          type="button"
                          onClick={() => handleUpdateQuestion(question.id, { answerType })}
                          className={`
                            rounded-xl border-2 p-4 text-center transition-all
                            ${question.answerType === answerType
                              ? 'border-orange-500 bg-orange-50 font-bold text-orange-900'
                              : 'border-gray-200 bg-white text-gray-900 hover:border-orange-300'
                            }
                          `}
                        >
                          {answerType === 'multiple_choice' ? 'ตัวเลือก'
                            : answerType === 'fill_in' ? 'เติมคำ'
                            : 'เลือกสี'}
                        </button>
                      ))}
                    </div>
                  </div>

                    {/* Resistor Display */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        แถบสีตัวต้านทาน
                      </label>
                      <div className="mb-4">
                        <ResistorDisplay
                          bands={bands.filter(b => b)}
                          type={question.resistorType}
                        />
                      </div>
                      <ColorBandSelector
                        bands={bands}
                        onBandChange={(index, color) => handleBandChange(question.id, index, color)}
                        resistorType={question.resistorType}
                        showLabels={true}
                      />
                    </div>

                    {/* Correct Answer */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        คำตอบที่ถูกต้อง
                      </label>
                      <input
                        type="text"
                        value={question.correctAnswer}
                        onChange={(e) => handleUpdateQuestion(question.id, { correctAnswer: e.target.value })}
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                        placeholder="เช่น 12kΩ ±5%"
                      />
                    </div>

                    {/* Options (for multiple_choice) */}
                    {question.answerType === 'multiple_choice' && (
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                          ตัวเลือก (ต้องมีคำตอบที่ถูกต้องรวมอยู่ด้วย)
                        </label>
                        <div className="space-y-2">
                          {(question.options || []).map((option, optIdx) => (
                            <div key={optIdx} className="flex items-center gap-2">
                              <input
                                type="text"
                                value={option}
                                onChange={(e) => {
                                  const newOptions = [...(question.options || [])];
                                  newOptions[optIdx] = e.target.value;
                                  handleUpdateQuestion(question.id, { options: newOptions });
                                }}
                                className="flex-1 rounded-xl border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                                placeholder={`ตัวเลือก ${optIdx + 1}`}
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const newOptions = (question.options || []).filter((_, i) => i !== optIdx);
                                  handleUpdateQuestion(question.id, { options: newOptions });
                                }}
                                className="p-2 text-red-600 hover:text-red-700"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => {
                              const newOptions = [...(question.options || []), ''];
                              handleUpdateQuestion(question.id, { options: newOptions });
                            }}
                            className="text-sm text-green-600 hover:text-green-700 font-medium"
                          >
                            + เพิ่มตัวเลือก
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Points */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        คะแนน
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={question.points}
                        onChange={(e) => handleUpdateQuestion(question.id, { points: parseInt(e.target.value) || 10 })}
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                      />
                    </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {questions.length > 0 && (
        <div className="pt-4 border-t border-gray-200 bg-gray-50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">คะแนนรวม:</p>
            <p className="text-lg font-bold text-gray-900">
              {questions.reduce((sum, q) => sum + q.points, 0)} คะแนน
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
