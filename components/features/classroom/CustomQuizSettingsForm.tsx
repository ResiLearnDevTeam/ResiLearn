'use client';

import { CustomQuizSettings } from '@/types/classroom';

interface CustomQuizSettingsFormProps {
  settings: CustomQuizSettings;
  onChange: (settings: CustomQuizSettings) => void;
}

export default function CustomQuizSettingsForm({ settings, onChange }: CustomQuizSettingsFormProps) {
  return (
    <div className="rounded-xl border-2 border-green-200 bg-green-50 p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Custom Quiz Settings</h3>
      
      {/* Resistor Type */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          ประเภทตัวต้านทาน
        </label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="resistorType"
              value="FOUR_BAND"
              checked={settings.resistorType === 'FOUR_BAND'}
              onChange={(e) => onChange({ ...settings, resistorType: e.target.value as 'FOUR_BAND' | 'FIVE_BAND' })}
              className="h-4 w-4 text-green-600"
            />
            <span>4 แถบสี</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="resistorType"
              value="FIVE_BAND"
              checked={settings.resistorType === 'FIVE_BAND'}
              onChange={(e) => onChange({ ...settings, resistorType: e.target.value as 'FOUR_BAND' | 'FIVE_BAND' })}
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
          value={settings.answerType}
          onChange={(e) => onChange({ ...settings, answerType: e.target.value as any })}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
        >
          <option value="multiple_choice">Multiple Choice</option>
          <option value="fill_in">Fill in the Blank</option>
          <option value="color_selection">Color Selection</option>
        </select>
      </div>

      {/* Difficulty */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          ระดับความยาก
        </label>
        <div className="flex gap-4">
          {(['easy', 'medium', 'hard'] as const).map((difficulty) => (
            <label key={difficulty} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="difficulty"
                value={difficulty}
                checked={settings.difficulty === difficulty}
                onChange={(e) => onChange({ ...settings, difficulty: e.target.value as any })}
                className="h-4 w-4 text-green-600"
              />
              <span>{difficulty === 'easy' ? 'ง่าย' : difficulty === 'medium' ? 'ปานกลาง' : 'ยาก'}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Option Count (for multiple choice) */}
      {settings.answerType === 'multiple_choice' && (
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            จำนวนตัวเลือก
          </label>
          <select
            value={settings.optionCount}
            onChange={(e) => onChange({ ...settings, optionCount: parseInt(e.target.value) })}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
          >
            <option value="2">2 ตัวเลือก</option>
            <option value="3">3 ตัวเลือก</option>
            <option value="4">4 ตัวเลือก</option>
          </select>
        </div>
      )}

      {/* Total Questions */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          จำนวนคำถาม
        </label>
        <div className="flex items-center gap-4">
          <input
            type="number"
            min="1"
            max="100"
            value={settings.totalQuestions || 10}
            onChange={(e) => onChange({ ...settings, totalQuestions: e.target.value ? parseInt(e.target.value) : null })}
            className="w-32 rounded-xl border border-gray-300 px-4 py-3 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
          />
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.totalQuestions === null}
              onChange={(e) => onChange({ ...settings, totalQuestions: e.target.checked ? null : 10 })}
              className="h-4 w-4 text-green-600"
            />
            <span>ไม่จำกัด</span>
          </label>
        </div>
      </div>

      {/* Time Settings */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Countdown ต่อข้อ (วินาที)
          </label>
          <input
            type="number"
            min="1"
            max="300"
            value={settings.countdownTime || ''}
            onChange={(e) => onChange({ ...settings, countdownTime: e.target.value ? parseInt(e.target.value) : null })}
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
            value={settings.timeLimit || ''}
            onChange={(e) => onChange({ ...settings, timeLimit: e.target.value ? parseInt(e.target.value) : null })}
            placeholder="ไม่จำกัด"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20"
          />
        </div>
      </div>
    </div>
  );
}
