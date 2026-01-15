'use client';

import { useState } from 'react';
import { FixedQuestion } from '@/types/classroom';
import ResistorDisplay from '@/components/features/ResistorDisplay';
import ColorBandSelector from '@/components/features/ColorBandSelector';
import { formatResistance, colorCodes } from '@/lib/resistorUtils';
import { Plus, Trash2, ChevronDown, ChevronUp, X } from 'lucide-react';

interface FixedQuestionsEditorProps {
  questions: FixedQuestion[];
  onChange: (questions: FixedQuestion[]) => void;
}

export default function FixedQuestionsEditor({ questions, onChange }: FixedQuestionsEditorProps) {
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

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
    setExpandedQuestion(newQuestion.id);
  };

  const handleDeleteQuestion = (questionId: string) => {
    const updated = questions.filter(q => q.id !== questionId).map((q, idx) => ({ ...q, order: idx + 1 }));
    onChange(updated);
    if (expandedQuestion === questionId) {
      setExpandedQuestion(null);
    }
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
    <div className="rounded-xl border-2 border-green-200 bg-green-50 p-6 space-y-4">
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
        <div className="text-center py-8 text-gray-500">
          <p>ยังไม่มีโจทย์ กรุณาเพิ่มโจทย์อย่างน้อย 1 ข้อ</p>
        </div>
      ) : (
        <div className="space-y-3">
          {questions.map((question, index) => {
            const isExpanded = expandedQuestion === question.id;
            const expectedBandsCount = question.resistorType === 'FIVE_BAND' ? 5 : 4;
            const bands = [...question.bands];
            while (bands.length < expectedBandsCount) {
              bands.push('');
            }

            return (
              <div key={question.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {/* Question Summary */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-700">ข้อ {index + 1}</span>
                    <span className="text-sm text-gray-600">
                      {question.resistorType === 'FIVE_BAND' ? '5 แถบ' : '4 แถบ'} - {question.answerType}
                    </span>
                    <span className="text-sm text-gray-600">
                      คำตอบ: {question.correctAnswer}
                    </span>
                    <span className="text-sm text-gray-600">
                      คะแนน: {question.points}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setExpandedQuestion(isExpanded ? null : question.id)}
                      className="p-2 text-gray-600 hover:text-gray-900"
                    >
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteQuestion(question.id)}
                      className="p-2 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded Editor */}
                {isExpanded && (
                  <div className="border-t border-gray-200 p-4 space-y-4">
                    {/* Resistor Type */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        ประเภทตัวต้านทาน
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            value="FOUR_BAND"
                            checked={question.resistorType === 'FOUR_BAND'}
                            onChange={(e) => {
                              const newBands = e.target.value === 'FOUR_BAND' 
                                ? bands.slice(0, 4).filter(b => b)
                                : [...bands.slice(0, 4), ''];
                              handleUpdateQuestion(question.id, {
                                resistorType: e.target.value as 'FOUR_BAND' | 'FIVE_BAND',
                                bands: newBands.length >= 4 ? newBands : ['brown', 'red', 'orange', 'gold'],
                              });
                            }}
                            className="h-4 w-4 text-green-600"
                          />
                          <span>4 แถบสี</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            value="FIVE_BAND"
                            checked={question.resistorType === 'FIVE_BAND'}
                            onChange={(e) => {
                              const newBands = e.target.value === 'FIVE_BAND'
                                ? bands.length >= 5 ? bands : [...bands.slice(0, 4), 'gold']
                                : bands.slice(0, 4);
                              handleUpdateQuestion(question.id, {
                                resistorType: e.target.value as 'FOUR_BAND' | 'FIVE_BAND',
                                bands: newBands.length >= (e.target.value === 'FIVE_BAND' ? 5 : 4) 
                                  ? newBands 
                                  : e.target.value === 'FIVE_BAND' 
                                    ? ['brown', 'red', 'orange', 'yellow', 'gold']
                                    : ['brown', 'red', 'orange', 'gold'],
                              });
                            }}
                            className="h-4 w-4 text-green-600"
                          />
                          <span>5 แถบสี</span>
                        </label>
                      </div>
                    </div>

                    {/* Answer Type */}
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        ประเภทคำตอบ
                      </label>
                      <select
                        value={question.answerType}
                        onChange={(e) => handleUpdateQuestion(question.id, { answerType: e.target.value as any })}
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                      >
                        <option value="multiple_choice">Multiple Choice</option>
                        <option value="fill_in">Fill in the Blank</option>
                        <option value="color_selection">Color Selection</option>
                      </select>
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
                )}
              </div>
            );
          })}
        </div>
      )}

      {questions.length > 0 && (
        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            คะแนนรวม: {questions.reduce((sum, q) => sum + q.points, 0)} คะแนน
          </p>
        </div>
      )}
    </div>
  );
}
