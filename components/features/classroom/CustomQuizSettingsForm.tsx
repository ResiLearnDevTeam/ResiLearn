'use client';

import { useState } from 'react';
import { CustomQuizSettings } from '@/types/classroom';
import SelectionCard from './SelectionCard';
import SectionHeader from './SectionHeader';
import ToggleSwitch from './ToggleSwitch';
import { Shield, ShieldCheck, ListChecks, PenLine, Paintbrush, Timer, Clock } from 'lucide-react';

interface CustomQuizSettingsFormProps {
  settings: CustomQuizSettings;
  onChange: (settings: CustomQuizSettings) => void;
}

export default function CustomQuizSettingsForm({ settings, onChange }: CustomQuizSettingsFormProps) {
  const [hasCountdown, setHasCountdown] = useState(settings.countdownTime !== null);
  const [hasTimeLimit, setHasTimeLimit] = useState(settings.timeLimit !== null);
  const [hasQuestionLimit, setHasQuestionLimit] = useState(settings.totalQuestions !== null);

  return (
    <div className="space-y-6">
      {/* Resistor Type */}
      <section>
        <SectionHeader number={1} title="ประเภทตัวต้านทาน" />
        <div className="grid gap-3 sm:grid-cols-2">
          <SelectionCard
            title="ตัวต้านทาน 4 แถบสี"
            description="2 หลักนัยสำคัญ + ตัวคูณ + ค่าความคลาดเคลื่อน"
            icon={Shield}
            isSelected={settings.resistorType === 'FOUR_BAND'}
            onClick={() => onChange({ ...settings, resistorType: 'FOUR_BAND' })}
            badge="เริ่มต้น"
            badgeColor="green"
          />
          <SelectionCard
            title="ตัวต้านทาน 5 แถบสี"
            description="3 หลักนัยสำคัญ + ตัวคูณ + ค่าความคลาดเคลื่อน"
            icon={ShieldCheck}
            isSelected={settings.resistorType === 'FIVE_BAND'}
            onClick={() => onChange({ ...settings, resistorType: 'FIVE_BAND' })}
            badge="ขั้นสูง"
            badgeColor="blue"
          />
        </div>
      </section>

      {/* Answer Type */}
      <section>
        <SectionHeader number={2} title="ประเภทคำตอบ" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <SelectionCard
            title="ตัวเลือก"
            description="เลือกคำตอบจากตัวเลือกที่ให้มา"
            icon={ListChecks}
            isSelected={settings.answerType === 'multiple_choice'}
            onClick={() => onChange({ ...settings, answerType: 'multiple_choice' })}
            compact
          />
          <SelectionCard
            title="เติมคำ"
            description="พิมพ์ค่าความต้านทานโดยตรง"
            icon={PenLine}
            isSelected={settings.answerType === 'fill_in'}
            onClick={() => onChange({ ...settings, answerType: 'fill_in' })}
            compact
          />
          <SelectionCard
            title="เลือกสี"
            description="กำหนดค่า แล้วเลือกแถบสีที่ถูกต้อง"
            icon={Paintbrush}
            isSelected={settings.answerType === 'color_selection'}
            onClick={() => onChange({ ...settings, answerType: 'color_selection' })}
            compact
          />
          <SelectionCard
            title="ฝึกอ่านค่ารหัสสี"
            description="โหมดฝึกอ่านค่ารหัสสี (ค่า→สี / สี→ค่า / ทีละแถบ / ผสม)"
            icon={Paintbrush}
            isSelected={settings.answerType === 'color_reading'}
            onClick={() => onChange({
              ...settings,
              answerType: 'color_reading',
              colorReadingMode: settings.colorReadingMode || 'value_to_color_full',
            })}
            compact
          />
        </div>
      </section>

      {/* Color Reading Mode (when answerType === color_reading) */}
      {settings.answerType === 'color_reading' && (
        <section>
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-lg font-bold text-gray-900">โหมดการฝึกอ่านค่ารหัสสี</h3>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => onChange({ ...settings, colorReadingMode: 'value_to_color_full' })}
              className={`rounded-xl border-2 p-4 sm:p-5 text-left transition-all ${
                (settings.colorReadingMode ?? 'value_to_color_full') === 'value_to_color_full'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-blue-300'
              }`}
            >
              <h4 className="font-bold text-gray-900">ค่า → สี ทั้งหมด</h4>
              <p className="text-sm text-gray-600 mt-1">แสดงค่า แล้วเลือกแถบสีครบทุกแถบ</p>
            </button>
            <button
              type="button"
              onClick={() => onChange({ ...settings, colorReadingMode: 'value_to_color_band_by_band' })}
              className={`rounded-xl border-2 p-4 sm:p-5 text-left transition-all ${
                settings.colorReadingMode === 'value_to_color_band_by_band'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-blue-300'
              }`}
            >
              <h4 className="font-bold text-gray-900">ค่า → สี ทีละแถบ</h4>
              <p className="text-sm text-gray-600 mt-1">แสดงค่า แล้วถามทีละแถบสีตามลำดับ</p>
            </button>
            <button
              type="button"
              onClick={() => onChange({ ...settings, colorReadingMode: 'color_to_value' })}
              className={`rounded-xl border-2 p-4 sm:p-5 text-left transition-all ${
                settings.colorReadingMode === 'color_to_value'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-blue-300'
              }`}
            >
              <h4 className="font-bold text-gray-900">สี → ค่า</h4>
              <p className="text-sm text-gray-600 mt-1">แสดงแถบสี แล้วถามค่าความต้านทาน</p>
            </button>
            <button
              type="button"
              onClick={() => onChange({ ...settings, colorReadingMode: 'mixed' })}
              className={`rounded-xl border-2 p-4 sm:p-5 text-left transition-all ${
                settings.colorReadingMode === 'mixed'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-blue-300'
              }`}
            >
              <h4 className="font-bold text-gray-900">ผสม</h4>
              <p className="text-sm text-gray-600 mt-1">สุ่มสลับระหว่างค่า→สี และ สี→ค่า</p>
            </button>
          </div>
          {/* colorToValueAnswerType when color_to_value */}
          {settings.colorReadingMode === 'color_to_value' && (
            <div className="mt-4">
              <label className="mb-2 block text-sm font-semibold text-gray-700">วิธีตอบ (สี → ค่า)</label>
              <div className="grid gap-3 grid-cols-2">
                <button
                  type="button"
                  onClick={() => onChange({ ...settings, colorToValueAnswerType: 'fill_in' })}
                  className={`rounded-xl border-2 p-4 text-center transition-all ${
                    (settings.colorToValueAnswerType || 'fill_in') === 'fill_in'
                      ? 'border-orange-500 bg-orange-50 font-bold text-orange-900'
                      : 'border-gray-200 bg-white text-gray-900 hover:border-orange-300'
                  }`}
                >
                  เติมคำ
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ ...settings, colorToValueAnswerType: 'multiple_choice' })}
                  className={`rounded-xl border-2 p-4 text-center transition-all ${
                    settings.colorToValueAnswerType === 'multiple_choice'
                      ? 'border-orange-500 bg-orange-50 font-bold text-orange-900'
                      : 'border-gray-200 bg-white text-gray-900 hover:border-orange-300'
                  }`}
                >
                  ตัวเลือก
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Difficulty */}
      <section>
        <SectionHeader number={3} title="ระดับความยาก" />
        <div className="grid gap-3 sm:grid-cols-3">
          {(['easy', 'medium', 'hard'] as const).map((difficulty) => (
            <SelectionCard
              key={difficulty}
              title={difficulty === 'easy' ? 'ง่าย' : difficulty === 'medium' ? 'ปานกลาง' : 'ยาก'}
              description={
                difficulty === 'easy' ? 'คำตอบผิดแบบสุ่มทั้งหมด'
                : difficulty === 'medium' ? 'ผสมระหว่างคำตอบผิดที่ใกล้เคียงและสุ่ม'
                : 'คำตอบผิดใกล้เคียงกับค่าที่ถูกต้องมาก'
              }
              icon={Shield}
              isSelected={settings.difficulty === difficulty}
              onClick={() => onChange({ ...settings, difficulty })}
              badgeColor={difficulty === 'easy' ? 'green' : difficulty === 'medium' ? 'orange' : 'red'}
              compact
            />
          ))}
        </div>
      </section>

      {/* Option Count (for multiple choice) */}
      {settings.answerType === 'multiple_choice' && (
        <section>
          <SectionHeader number={4} title="จำนวนตัวเลือก" />
          <div className="grid gap-3 grid-cols-3">
            {[2, 3, 4].map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => onChange({ ...settings, optionCount: count })}
                className={`
                  rounded-xl border-2 p-4 text-center transition-all
                  ${settings.optionCount === count
                    ? 'border-orange-500 bg-orange-50 font-bold text-orange-900'
                    : 'border-gray-200 bg-white text-gray-900 hover:border-orange-300'
                  }
                `}
              >
                {count} ตัวเลือก
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Total Questions */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white text-sm font-bold">
              5
            </div>
            <h3 className="text-lg font-bold text-gray-900">จำนวนคำถาม</h3>
          </div>
          <ToggleSwitch
            checked={hasQuestionLimit}
            onChange={(checked) => {
              setHasQuestionLimit(checked);
              onChange({ ...settings, totalQuestions: checked ? 10 : null });
            }}
          />
        </div>
        
        {hasQuestionLimit ? (
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
            {[5, 10, 20, 50].map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => onChange({ ...settings, totalQuestions: count })}
                className={`
                  rounded-xl border-2 p-4 text-center transition-all
                  ${settings.totalQuestions === count
                    ? 'border-orange-500 bg-orange-50 font-bold text-orange-900'
                    : 'border-gray-200 bg-white text-gray-900 hover:border-orange-300'
                  }
                `}
              >
                {count} คำถาม
              </button>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border-2 border-dashed border-orange-300 bg-orange-50 p-4 text-center">
            <p className="font-semibold text-orange-700">โหมดฝึกฝนไม่จำกัด</p>
            <p className="text-sm text-orange-600">ฝึกฝนได้นานเท่าที่คุณต้องการ!</p>
          </div>
        )}
      </section>

      {/* Countdown Timer */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white text-sm font-bold">
              <Timer className="h-4 w-4" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">ตัวจับเวลานับถอยหลัง</h3>
            <span className="text-sm text-gray-500">(ไม่บังคับ)</span>
          </div>
          <ToggleSwitch
            checked={hasCountdown}
            onChange={(checked) => {
              setHasCountdown(checked);
              if (checked) {
                setHasTimeLimit(false);
                onChange({ ...settings, countdownTime: 30, timeLimit: null });
              } else {
                onChange({ ...settings, countdownTime: null });
              }
            }}
            disabled={hasTimeLimit}
          />
        </div>
        
        {hasCountdown && (
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center gap-6">
              <input
                type="range"
                min="5"
                max="120"
                step="5"
                value={settings.countdownTime || 30}
                onChange={(e) => onChange({ ...settings, countdownTime: parseInt(e.target.value) })}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, rgb(249, 115, 22) 0%, rgb(249, 115, 22) ${((settings.countdownTime || 30) - 5) * 100 / 115}%, rgb(229, 231, 235) ${((settings.countdownTime || 30) - 5) * 100 / 115}%, rgb(229, 231, 235) 100%)`
                }}
              />
              <div className="min-w-[70px] rounded-lg bg-white border-2 border-orange-500 px-3 py-2 text-center">
                <div className="text-xl font-bold text-orange-600">{settings.countdownTime || 30}</div>
                <div className="text-xs text-gray-500">วินาที</div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Time Limit */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white text-sm font-bold">
              <Clock className="h-4 w-4" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">จำกัดเวลารวม</h3>
            <span className="text-sm text-gray-500">(ไม่บังคับ)</span>
          </div>
          <ToggleSwitch
            checked={hasTimeLimit}
            onChange={(checked) => {
              setHasTimeLimit(checked);
              if (checked) {
                setHasCountdown(false);
                onChange({ ...settings, timeLimit: 600, countdownTime: null });
              } else {
                onChange({ ...settings, timeLimit: null });
              }
            }}
            disabled={hasCountdown}
          />
        </div>
        
        {hasTimeLimit && (
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
            {[
              { minutes: 5, seconds: 300 },
              { minutes: 10, seconds: 600 },
              { minutes: 20, seconds: 1200 },
              { minutes: 30, seconds: 1800 }
            ].map((time) => (
              <button
                key={time.seconds}
                type="button"
                onClick={() => onChange({ ...settings, timeLimit: time.seconds })}
                className={`
                  rounded-xl border-2 p-4 text-center transition-all
                  ${settings.timeLimit === time.seconds
                    ? 'border-orange-500 bg-orange-50 font-bold text-orange-900'
                    : 'border-gray-200 bg-white text-gray-900 hover:border-orange-300'
                  }
                `}
              >
                {time.minutes} นาที
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
