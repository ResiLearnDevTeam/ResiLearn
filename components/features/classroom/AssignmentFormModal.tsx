'use client';

import { useState, useEffect } from 'react';
import { CreateAssignmentData, CustomQuizSettings, FixedQuestion } from '@/types/classroom';
import WordEditor from '@/components/features/classroom/WordEditor';
import FileUpload from '@/components/features/classroom/FileUpload';
import CustomQuizSettingsForm from '@/components/features/classroom/CustomQuizSettingsForm';
import FixedQuestionsEditor from '@/components/features/classroom/FixedQuestionsEditor';
import SelectionCard from '@/components/features/classroom/SelectionCard';
import SectionHeader from '@/components/features/classroom/SectionHeader';
import SummaryRow from '@/components/features/classroom/SummaryRow';
import ToggleSwitch from '@/components/features/classroom/ToggleSwitch';
import { X, BookOpen, Settings2, FileText, Check, Shield, ShieldCheck, ListChecks, PenLine, Paintbrush, Calendar, Clock, Timer, Flag, Pin, Save, Rocket, ArrowRight } from 'lucide-react';

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
  
  // Default values helper
  const getDefaultFormData = (): CreateAssignmentData => ({
    assignmentType: 'CUSTOM_QUIZ',
    assignmentMode: 'EXAM',
    levelId: '',
    title: '',
    description: '',
    descriptionFormat: 'PLAIN',
    instructions: '',
    dueDate: '',
    maxPoints: 100,
    passThreshold: 50,
    showScore: true,
    allowRetake: false,
    hasScore: true,
    priority: 'NORMAL',
    isPinned: false,
    isDraft: false,
    publishedAt: undefined,
    attachments: [],
    quizSettings: undefined,
    questions: undefined,
    quizSettingsForFixed: undefined,
  });

  const [formData, setFormData] = useState<CreateAssignmentData>(() => {
    if (initialData) {
      // Merge initialData with defaults to ensure all fields are present
      const defaults = getDefaultFormData();
      return {
        ...defaults,
        ...initialData,
        // Ensure nested objects are properly initialized
        quizSettings: initialData.quizSettings || defaults.quizSettings,
        questions: initialData.questions || defaults.questions,
        quizSettingsForFixed: initialData.quizSettingsForFixed || defaults.quizSettingsForFixed,
        attachments: initialData.attachments || defaults.attachments,
      };
    }
    return getDefaultFormData();
  });

  const [formErrors, setFormErrors] = useState<{
    title?: string;
    quizSettings?: string;
    questions?: string;
    publishedAt?: string;
    assignmentMode?: string;
  }>({});

  // Update formData when initialData changes (for editing)
  useEffect(() => {
    if (initialData) {
      const defaults = getDefaultFormData();
      setFormData({
        ...defaults,
        ...initialData,
        quizSettings: initialData.quizSettings || defaults.quizSettings,
        questions: initialData.questions || defaults.questions,
        quizSettingsForFixed: initialData.quizSettingsForFixed || defaults.quizSettingsForFixed,
        attachments: initialData.attachments || defaults.attachments,
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const errors: typeof formErrors = {};
    if (!formData.title || formData.title.trim().length === 0) {
      errors.title = 'กรุณากรอกชื่องาน';
    } else if (formData.title.length > 200) {
      errors.title = 'ชื่องานต้องไม่เกิน 200 ตัวอักษร';
    }

    if (!formData.assignmentMode) {
      errors.assignmentMode = 'กรุณาเลือกประเภทงาน (แบบฝึกหัด/แบบทดสอบ)';
    }

    if (!formData.assignmentType || formData.assignmentType === 'LEVEL_BASED') {
      errors.quizSettings = 'กรุณาเลือกรูปแบบคำถาม (กำหนด Settings เอง/สร้างโจทย์เอง)';
    }
    
    // Clear errors for fields that are now valid
    if (formData.assignmentMode && !errors.assignmentMode) {
      delete errors.assignmentMode;
    }
    if (formData.assignmentType && formData.assignmentType !== 'LEVEL_BASED' && !errors.quizSettings) {
      delete errors.quizSettings;
    }

    if (formData.assignmentType === 'CUSTOM_QUIZ' && !formData.quizSettings) {
      errors.quizSettings = 'กรุณากำหนด Quiz Settings';
    }

    if (formData.assignmentType === 'CUSTOM_QUIZ' && formData.quizSettings?.answerType === 'color_reading') {
      if (!formData.quizSettings.colorReadingMode) {
        errors.quizSettings = 'กรุณาเลือกโหมดการฝึกอ่านค่ารหัสสี';
      }
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
            <form id="assignment-form" onSubmit={handleSubmit} className="space-y-8">
              {/* Section 1: Assignment Mode */}
              <section className={formErrors.assignmentMode ? 'border-2 border-red-200 rounded-xl p-4 bg-red-50' : ''}>
                <SectionHeader number={1} title="ประเภทงาน" />
                <div className="grid gap-3 sm:grid-cols-2">
                  <SelectionCard
                    title="แบบฝึกหัด"
                    description="กำหนดได้ว่าจะมีคะแนน ทำซ้ำได้ และเฉลย"
                    icon={BookOpen}
                    isSelected={formData.assignmentMode === 'PRACTICE'}
                    onClick={() => {
                      const newMode = 'PRACTICE' as const;
                      setFormData({ 
                        ...formData, 
                        assignmentMode: newMode,
                        hasScore: formData.hasScore ?? true,
                        allowRetake: formData.allowRetake ?? true,
                      });
                      setFormErrors({ ...formErrors, assignmentMode: undefined });
                    }}
                    badge="ยืดหยุ่น"
                    badgeColor="blue"
                  />
                  <SelectionCard
                    title="แบบทดสอบ"
                    description="ทำได้ครั้งเดียว ไม่แสดงเฉลย"
                    icon={Shield}
                    isSelected={formData.assignmentMode === 'EXAM'}
                    onClick={() => {
                      const newMode = 'EXAM' as const;
                      setFormData({ 
                        ...formData, 
                        assignmentMode: newMode,
                        showScore: formData.showScore ?? true,
                      });
                      setFormErrors({ ...formErrors, assignmentMode: undefined });
                    }}
                    badge="เข้มงวด"
                    badgeColor="red"
                  />
                </div>
                {formErrors.assignmentMode && (
                  <p className="mt-2 text-sm text-red-600">{formErrors.assignmentMode}</p>
                )}
              </section>

              {/* Section 2: Question Type */}
              {formData.assignmentMode && (
                <section className={formErrors.quizSettings ? 'border-2 border-red-200 rounded-xl p-4 bg-red-50' : ''}>
                  <SectionHeader number={2} title="รูปแบบคำถาม" />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <SelectionCard
                      title="กำหนด Settings เอง"
                      description="ระบบสร้างคำถามอัตโนมัติ"
                      icon={Settings2}
                      isSelected={formData.assignmentType === 'CUSTOM_QUIZ'}
                      onClick={() => {
                        setFormData({ 
                          ...formData, 
                          assignmentType: 'CUSTOM_QUIZ', 
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
                        });
                        setFormErrors({ ...formErrors, quizSettings: undefined });
                      }}
                    />
                    <SelectionCard
                      title="สร้างโจทย์เอง"
                      description="กำหนดคำถามเองทุกข้อ"
                      icon={FileText}
                      isSelected={formData.assignmentType === 'FIXED_QUESTIONS'}
                      onClick={() => {
                        setFormData({ 
                          ...formData, 
                          assignmentType: 'FIXED_QUESTIONS', 
                          levelId: '', 
                          quizSettings: undefined, 
                          questions: formData.questions || [],
                          quizSettingsForFixed: {
                            showCorrectAnswer: formData.assignmentMode === 'PRACTICE' ? true : false,
                          }
                        });
                        setFormErrors({ ...formErrors, quizSettings: undefined });
                      }}
                    />
                  </div>
                  {formErrors.quizSettings && (
                    <p className="mt-2 text-sm text-red-600">{formErrors.quizSettings}</p>
                  )}
                </section>
              )}

              {/* Section 3: Basic Information */}
              <section className={formErrors.title ? 'border-2 border-red-200 rounded-xl p-4 bg-red-50' : ''}>
                <SectionHeader number={3} title="ข้อมูลพื้นฐาน" />

                <div className="space-y-4">
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
                </div>
              </section>

              {/* Section 4: Question Settings */}
              {formData.assignmentType === 'CUSTOM_QUIZ' && formData.quizSettings && (
                <section>
                  <SectionHeader number={4} title="ตั้งค่าคำถาม" />
                  <CustomQuizSettingsForm
                    settings={{
                      ...formData.quizSettings,
                    }}
                    onChange={(settings) => {
                      setFormData({ ...formData, quizSettings: settings });
                    }}
                  />
                </section>
              )}

              {formData.assignmentType === 'FIXED_QUESTIONS' && (
                <section className={formErrors.questions ? 'border-2 border-red-200 rounded-xl p-4 bg-red-50' : ''}>
                  <SectionHeader number={4} title="ตั้งค่าคำถาม" />
                  <FixedQuestionsEditor
                    questions={formData.questions || []}
                    onChange={(questions) => {
                      setFormData({ ...formData, questions });
                      // Auto-calculate maxPoints
                      const calculatedMaxPoints = questions.reduce((sum, q) => sum + (q.points || 10), 0);
                      setFormData(prev => ({ ...prev, questions, maxPoints: calculatedMaxPoints }));
                      setFormErrors({ ...formErrors, questions: undefined });
                    }}
                  />
                  {formErrors.questions && (
                    <p className="mt-2 text-sm text-red-600">{formErrors.questions}</p>
                  )}
                </section>
              )}

              {/* Section 5: Additional Settings */}
              <section>
                <SectionHeader number={5} title="ตั้งค่าเพิ่มเติม" />
                <div className="space-y-4">
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

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      เกณฑ์ผ่าน (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.passThreshold || 50}
                      onChange={(e) => setFormData({ ...formData, passThreshold: parseInt(e.target.value) || 50 })}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      ระดับความสำคัญ
                    </label>
                    <div className="grid gap-3 grid-cols-3">
                      {(['LOW', 'NORMAL', 'HIGH'] as const).map((priority) => (
                        <button
                          key={priority}
                          type="button"
                          onClick={() => setFormData({ ...formData, priority })}
                          className={`
                            rounded-xl border-2 p-4 text-center transition-all
                            ${formData.priority === priority
                              ? 'border-orange-500 bg-orange-50 font-bold text-orange-900'
                              : 'border-gray-200 bg-white text-gray-900 hover:border-orange-300'
                            }
                          `}
                        >
                          {priority === 'HIGH' ? 'สำคัญ' : priority === 'LOW' ? 'ต่ำ' : 'ปกติ'}
                        </button>
                      ))}
                    </div>
                  </div>

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
                </div>
              </section>

              {/* Section 6: Assignment Mode Settings */}
              {formData.assignmentMode === 'PRACTICE' && (
                <section>
                  <SectionHeader number={6} title="ตั้งค่าสำหรับแบบฝึกหัด" />
                  <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-6 space-y-4">
                    <div className="space-y-4">
                      <ToggleSwitch
                        checked={formData.hasScore !== false}
                        onChange={(checked) => setFormData({ ...formData, hasScore: checked })}
                        label="มีคะแนน"
                      />
                      <ToggleSwitch
                        checked={formData.allowRetake !== false}
                        onChange={(checked) => setFormData({ ...formData, allowRetake: checked })}
                        label="อนุญาตให้ทำซ้ำได้"
                      />
                      <ToggleSwitch
                        checked={
                          formData.assignmentType === 'CUSTOM_QUIZ' 
                            ? (formData.quizSettings?.showCorrectAnswer !== false)
                            : (formData.quizSettingsForFixed?.showCorrectAnswer !== false)
                        }
                        onChange={(checked) => {
                          if (formData.assignmentType === 'CUSTOM_QUIZ' && formData.quizSettings) {
                            setFormData({
                              ...formData,
                              quizSettings: {
                                ...formData.quizSettings,
                                showCorrectAnswer: checked,
                              }
                            });
                          } else if (formData.assignmentType === 'FIXED_QUESTIONS') {
                            setFormData({
                              ...formData,
                              quizSettingsForFixed: {
                                ...formData.quizSettingsForFixed,
                                showCorrectAnswer: checked,
                              }
                            });
                          }
                        }}
                        label="แสดงคำตอบที่ถูกต้อง"
                      />
                    </div>
                  </div>
                </section>
              )}

              {formData.assignmentMode === 'EXAM' && (
                <section>
                  <SectionHeader number={6} title="ตั้งค่าสำหรับแบบทดสอบ" />
                  <div className="rounded-xl border-2 border-red-200 bg-red-50 p-6 space-y-4">
                    <ToggleSwitch
                      checked={formData.showScore !== false}
                      onChange={(checked) => setFormData({ ...formData, showScore: checked })}
                      label="แสดงคะแนน"
                    />
                    <p className="text-sm text-gray-600">
                      แบบทดสอบทำได้ครั้งเดียวและไม่แสดงคำตอบที่ถูกต้อง
                    </p>
                  </div>
                </section>
              )}

              {/* Fixed Questions Global Settings */}
              {formData.assignmentType === 'FIXED_QUESTIONS' && (
                <section>
                  <SectionHeader number={7} title="ตั้งค่าเพิ่มเติมสำหรับ Fixed Questions" />
                  <div className="rounded-xl border-2 border-green-200 bg-green-50 p-6 space-y-4">
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
                    </div>
                  </div>
                </section>
              )}

              {/* Summary Card */}
              <section className="bg-gray-50 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500 text-white shadow">
                    <Check className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-gray-900">สรุปการตั้งค่า</h3>
                </div>
                
                <div className="bg-white rounded-xl p-4 text-sm">
                  <SummaryRow 
                    label="ประเภทงาน" 
                    value={formData.assignmentMode === 'PRACTICE' ? 'แบบฝึกหัด' : 'แบบทดสอบ'} 
                  />
                  <SummaryRow 
                    label="รูปแบบคำถาม" 
                    value={formData.assignmentType === 'CUSTOM_QUIZ' ? 'กำหนด Settings เอง' : 'สร้างโจทย์เอง'} 
                  />
                  {formData.title && (
                    <SummaryRow label="ชื่องาน" value={formData.title} />
                  )}
                  {formData.assignmentType === 'CUSTOM_QUIZ' && formData.quizSettings && (
                    <>
                      <SummaryRow 
                        label="ประเภทตัวต้านทาน" 
                        value={formData.quizSettings.resistorType === 'FOUR_BAND' ? '4 แถบสี' : '5 แถบสี'} 
                      />
                      <SummaryRow 
                        label="ประเภทคำตอบ" 
                        value={
                          formData.quizSettings.answerType === 'multiple_choice' ? 'ตัวเลือก'
                          : formData.quizSettings.answerType === 'fill_in' ? 'เติมคำ'
                          : formData.quizSettings.answerType === 'color_reading' ? 'ฝึกอ่านค่ารหัสสี'
                          : 'เลือกสี'
                        } 
                      />
                      {formData.quizSettings.answerType === 'color_reading' && formData.quizSettings.colorReadingMode && (
                        <SummaryRow 
                          label="โหมดฝึกอ่านค่ารหัสสี" 
                          value={
                            formData.quizSettings.colorReadingMode === 'value_to_color_full' ? 'ค่า→สี ทั้งหมด'
                            : formData.quizSettings.colorReadingMode === 'value_to_color_band_by_band' ? 'ค่า→สี ทีละแถบ'
                            : formData.quizSettings.colorReadingMode === 'color_to_value' ? 'สี→ค่า'
                            : formData.quizSettings.colorReadingMode === 'mixed' ? 'ผสม' : ''
                          } 
                        />
                      )}
                      <SummaryRow 
                        label="จำนวนคำถาม" 
                        value={formData.quizSettings.totalQuestions ? `${formData.quizSettings.totalQuestions} คำถาม` : 'ไม่จำกัด'} 
                      />
                    </>
                  )}
                  {formData.assignmentType === 'FIXED_QUESTIONS' && formData.questions && (
                    <SummaryRow 
                      label="จำนวนคำถาม" 
                      value={`${formData.questions.length} ข้อ`} 
                    />
                  )}
                  <SummaryRow 
                    label="คะแนนเต็ม" 
                    value={`${formData.maxPoints} คะแนน`} 
                  />
                  <SummaryRow 
                    label="เกณฑ์ผ่าน" 
                    value={`${formData.passThreshold || 50}%`} 
                  />
                  {formData.assignmentMode === 'PRACTICE' && (
                    <>
                      <SummaryRow 
                        label="มีคะแนน" 
                        value={formData.hasScore !== false ? 'ใช่' : 'ไม่'} 
                      />
                      <SummaryRow 
                        label="อนุญาตทำซ้ำ" 
                        value={formData.allowRetake !== false ? 'ใช่' : 'ไม่'} 
                      />
                    </>
                  )}
                  {formData.assignmentMode === 'EXAM' && (
                    <SummaryRow 
                      label="แสดงคะแนน" 
                      value={formData.showScore !== false ? 'ใช่' : 'ไม่'} 
                    />
                  )}
                </div>
              </section>

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
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            form="assignment-form"
            disabled={isSubmitting}
            className={`
              inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all
              ${isSubmitting
                ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                : 'text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg hover:shadow-xl'
              }
            `}
          >
            <Rocket className="h-5 w-5" />
            {isSubmitting ? 'กำลังบันทึก...' : isEditing ? 'บันทึกการแก้ไข' : 'สร้างงาน'}
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
