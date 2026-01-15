'use client';

import { useState } from 'react';
import { CreateAssignmentData, CustomQuizSettings, FixedQuestion } from '@/types/classroom';
import WordEditor from '@/components/features/classroom/WordEditor';
import FileUpload from '@/components/features/classroom/FileUpload';
import CustomQuizSettingsForm from '@/components/features/classroom/CustomQuizSettingsForm';
import FixedQuestionsEditor from '@/components/features/classroom/FixedQuestionsEditor';
import { X, Eye, EyeOff, Pin, Flag, Save, Calendar } from 'lucide-react';

interface Level {
  id: string;
  number: number;
  name: string;
  description: string;
}

interface AssignmentFormModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAssignmentData) => Promise<void>;
  initialData?: CreateAssignmentData;
  levels: Level[];
  isEditing?: boolean;
  isSubmitting?: boolean;
}

export default function AssignmentFormModal({
  show,
  onClose,
  onSubmit,
  initialData,
  levels,
  isEditing = false,
  isSubmitting = false,
}: AssignmentFormModalProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState<CreateAssignmentData>(initialData || {
    assignmentType: 'LEVEL_BASED',
    levelId: '',
    title: '',
    description: '',
    descriptionFormat: 'PLAIN',
    instructions: '',
    dueDate: '',
    maxPoints: 100,
    priority: 'NORMAL',
    isPinned: false,
    isDraft: false,
    publishedAt: undefined,
    attachments: [],
    quizSettings: undefined,
    questions: undefined,
    quizSettingsForFixed: undefined,
  });

  const [formErrors, setFormErrors] = useState<{
    title?: string;
    quizSettings?: string;
    questions?: string;
    publishedAt?: string;
  }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const errors: typeof formErrors = {};
    if (!formData.title || formData.title.trim().length === 0) {
      errors.title = 'กรุณากรอกชื่องาน';
    } else if (formData.title.length > 200) {
      errors.title = 'ชื่องานต้องไม่เกิน 200 ตัวอักษร';
    }

    if (formData.assignmentType === 'CUSTOM_QUIZ' && !formData.quizSettings) {
      errors.quizSettings = 'กรุณากำหนด Quiz Settings';
    }

    if (formData.assignmentType === 'FIXED_QUESTIONS') {
      if (!formData.questions || formData.questions.length === 0) {
        errors.questions = 'กรุณาเพิ่มโจทย์อย่างน้อย 1 ข้อ';
      } else {
        // Auto-calculate maxPoints
        const calculatedMaxPoints = formData.questions.reduce((sum, q) => sum + (q.points || 10), 0);
        formData.maxPoints = calculatedMaxPoints;
      }
    }

    if (formData.publishedAt) {
      const publishedDate = new Date(formData.publishedAt);
      const now = new Date();
      if (publishedDate <= now) {
        errors.publishedAt = 'วันที่เผยแพร่ต้องเป็นอนาคต';
      }
    }

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    await onSubmit(formData);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-4xl max-h-[90vh] rounded-2xl bg-white shadow-2xl flex flex-col overflow-hidden">
        {/* Header - Fixed */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'แก้ไขงาน' : 'สร้างงานใหม่'}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {isEditing ? 'แก้ไขรายละเอียดงาน' : 'เพิ่มงานใหม่ให้กับนักเรียน'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {!showPreview ? (
            <form id="assignment-form" onSubmit={handleSubmit} className="space-y-6">
              {/* Assignment Type Selector */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  ประเภทงาน <span className="text-red-500">*</span>
                </label>
                <div className="grid gap-3 sm:grid-cols-3">
                  <label className={`relative flex cursor-pointer rounded-xl border-2 p-4 transition-all ${
                    formData.assignmentType === 'LEVEL_BASED'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="assignmentType"
                      value="LEVEL_BASED"
                      checked={formData.assignmentType === 'LEVEL_BASED'}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        assignmentType: e.target.value as any, 
                        levelId: '', 
                        quizSettings: undefined, 
                        questions: undefined 
                      })}
                      className="sr-only"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">Level-based</div>
                      <div className="text-sm text-gray-600">ใช้ Level ที่มีอยู่</div>
                    </div>
                  </label>
                  <label className={`relative flex cursor-pointer rounded-xl border-2 p-4 transition-all ${
                    formData.assignmentType === 'CUSTOM_QUIZ'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="assignmentType"
                      value="CUSTOM_QUIZ"
                      checked={formData.assignmentType === 'CUSTOM_QUIZ'}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        assignmentType: e.target.value as any, 
                        levelId: '', 
                        questions: undefined, 
                        quizSettings: {
                          resistorType: 'FOUR_BAND',
                          answerType: 'multiple_choice',
                          difficulty: 'medium',
                          optionCount: 4,
                          totalQuestions: 10,
                          countdownTime: null,
                          timeLimit: null,
                        }
                      })}
                      className="sr-only"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">Custom Quiz</div>
                      <div className="text-sm text-gray-600">กำหนด settings เอง</div>
                    </div>
                  </label>
                  <label className={`relative flex cursor-pointer rounded-xl border-2 p-4 transition-all ${
                    formData.assignmentType === 'FIXED_QUESTIONS'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="assignmentType"
                      value="FIXED_QUESTIONS"
                      checked={formData.assignmentType === 'FIXED_QUESTIONS'}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        assignmentType: e.target.value as any, 
                        levelId: '', 
                        quizSettings: undefined, 
                        questions: []
                      })}
                      className="sr-only"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">Fixed Questions</div>
                      <div className="text-sm text-gray-600">สร้างโจทย์เอง</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  ชื่องาน <span className="text-red-500">*</span>
                  <span className="ml-2 text-xs text-gray-500 font-normal">
                    ({formData.title.length}/200)
                  </span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={200}
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({ ...formData, title: e.target.value });
                    setFormErrors({ ...formErrors, title: undefined });
                  }}
                  className={`w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 transition-all ${
                    formErrors.title
                      ? 'border-red-500 focus:ring-red-500/20'
                      : 'border-gray-300 focus:border-green-500 focus:ring-green-500/20'
                  }`}
                  placeholder="เช่น งาน Level 1: การอ่านค่าตัวต้านทาน 4 แถบ"
                />
                {formErrors.title && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  คำอธิบาย
                </label>
                <WordEditor
                  content={formData.description || ''}
                  onChange={(html) => {
                    setFormData({ ...formData, description: html, descriptionFormat: 'HTML' });
                  }}
                  placeholder="อธิบายรายละเอียดงาน..."
                />
              </div>

              {/* Instructions */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  คำแนะนำเพิ่มเติม
                </label>
                <WordEditor
                  content={formData.instructions || ''}
                  onChange={(html) => {
                    setFormData({ ...formData, instructions: html });
                  }}
                  placeholder="เพิ่มคำแนะนำสำหรับนักเรียน..."
                />
              </div>

              {/* Custom Quiz Settings */}
              {formData.assignmentType === 'CUSTOM_QUIZ' && formData.quizSettings && (
                <CustomQuizSettingsForm
                  settings={formData.quizSettings}
                  onChange={(settings) => setFormData({ ...formData, quizSettings: settings })}
                />
              )}

              {/* Fixed Questions */}
              {formData.assignmentType === 'FIXED_QUESTIONS' && (
                <FixedQuestionsEditor
                  questions={formData.questions || []}
                  onChange={(questions) => {
                    setFormData({ ...formData, questions });
                    // Auto-calculate maxPoints
                    const calculatedMaxPoints = questions.reduce((sum, q) => sum + (q.points || 10), 0);
                    setFormData(prev => ({ ...prev, questions, maxPoints: calculatedMaxPoints }));
                  }}
                />
              )}

              {/* Fixed Questions Global Settings */}
              {formData.assignmentType === 'FIXED_QUESTIONS' && (
                <div className="rounded-xl border-2 border-green-200 bg-green-50 p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Global Settings</h3>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        Countdown ต่อข้อ (วินาที)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="300"
                        value={formData.quizSettingsForFixed?.countdownTime || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          quizSettingsForFixed: {
                            ...formData.quizSettingsForFixed,
                            countdownTime: e.target.value ? parseInt(e.target.value) : null,
                          }
                        })}
                        placeholder="ไม่จำกัด"
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-700">
                        จำกัดเวลารวม (วินาที)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="3600"
                        value={formData.quizSettingsForFixed?.timeLimit || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          quizSettingsForFixed: {
                            ...formData.quizSettingsForFixed,
                            timeLimit: e.target.value ? parseInt(e.target.value) : null,
                          }
                        })}
                        placeholder="ไม่จำกัด"
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.quizSettingsForFixed?.allowReview || false}
                        onChange={(e) => setFormData({
                          ...formData,
                          quizSettingsForFixed: {
                            ...formData.quizSettingsForFixed,
                            allowReview: e.target.checked,
                          }
                        })}
                        className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm font-medium text-gray-700">อนุญาตให้ review ก่อนส่ง</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.quizSettingsForFixed?.showCorrectAnswer || false}
                        onChange={(e) => setFormData({
                          ...formData,
                          quizSettingsForFixed: {
                            ...formData.quizSettingsForFixed,
                            showCorrectAnswer: e.target.checked,
                          }
                        })}
                        className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm font-medium text-gray-700">แสดงคำตอบหลังทำเสร็จ</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Due Date and Max Points */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    กำหนดส่ง
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.dueDate ? new Date(formData.dueDate).toISOString().slice(0, 16) : ''}
                    onChange={(e) => {
                      const value = e.target.value ? new Date(e.target.value).toISOString() : '';
                      setFormData({ ...formData, dueDate: value });
                    }}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    คะแนนเต็ม
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={formData.maxPoints}
                    onChange={(e) => setFormData({ ...formData, maxPoints: parseInt(e.target.value) || 100 })}
                    disabled={formData.assignmentType === 'FIXED_QUESTIONS'}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 disabled:bg-gray-100"
                  />
                  {formData.assignmentType === 'FIXED_QUESTIONS' && (
                    <p className="mt-1 text-xs text-gray-500">คำนวณอัตโนมัติจากคะแนนของแต่ละข้อ</p>
                  )}
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  ระดับความสำคัญ
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'HIGH' | 'NORMAL' | 'LOW' })}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                >
                  <option value="LOW">ต่ำ</option>
                  <option value="NORMAL">ปกติ</option>
                  <option value="HIGH">สำคัญ</option>
                </select>
              </div>

              {/* Scheduled Publishing */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  กำหนดเผยแพร่ (ไม่บังคับ)
                </label>
                <input
                  type="datetime-local"
                  value={formData.publishedAt ? new Date(formData.publishedAt).toISOString().slice(0, 16) : ''}
                  onChange={(e) => {
                    const value = e.target.value ? new Date(e.target.value).toISOString() : undefined;
                    setFormData({ ...formData, publishedAt: value });
                    setFormErrors({ ...formErrors, publishedAt: undefined });
                  }}
                  min={new Date().toISOString().slice(0, 16)}
                  className={`w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 transition-all ${
                    formErrors.publishedAt
                      ? 'border-red-500 focus:ring-red-500/20'
                      : 'border-gray-300 focus:border-green-500 focus:ring-green-500/20'
                  }`}
                />
                {formErrors.publishedAt && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.publishedAt}</p>
                )}
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPinned}
                    onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <div className="flex items-center gap-2">
                    <Pin className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">ปักหมุด</span>
                  </div>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isDraft}
                    onChange={(e) => setFormData({ ...formData, isDraft: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <div className="flex items-center gap-2">
                    <Save className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">บันทึกเป็น Draft</span>
                  </div>
                </label>
              </div>

              {/* File Attachments */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  ไฟล์แนบ
                </label>
                <FileUpload
                  files={formData.attachments || []}
                  onFilesChange={(files) => setFormData({ ...formData, attachments: files })}
                  maxFiles={5}
                  maxSize={10 * 1024 * 1024}
                />
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              {/* Preview Mode - Basic implementation */}
              <div className="rounded-xl border-2 border-green-200 bg-green-50 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
                <div className="space-y-2">
                  <p><strong>Title:</strong> {formData.title}</p>
                  <p><strong>Type:</strong> {formData.assignmentType}</p>
                  {formData.description && (
                    <div>
                      <strong>Description:</strong>
                      <div dangerouslySetInnerHTML={{ __html: formData.description }} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer - Fixed */}
        <div className="flex-shrink-0 px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showPreview ? 'แก้ไข' : 'ดูตัวอย่าง'}
          </button>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-6 py-2 font-semibold text-gray-700 hover:bg-gray-50"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              form="assignment-form"
              disabled={isSubmitting}
              className="rounded-lg bg-gradient-to-r from-green-500 to-green-600 px-6 py-2 font-semibold text-white transition-all hover:from-green-600 hover:to-green-700 disabled:opacity-50"
            >
              {isSubmitting ? 'กำลังบันทึก...' : isEditing ? 'บันทึกการแก้ไข' : 'สร้างงาน'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
