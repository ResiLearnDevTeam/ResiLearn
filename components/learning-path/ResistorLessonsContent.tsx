'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  Award,
  Beaker,
  BookOpen,
  Brain,
  CheckCircle2,
  ClipboardCheck,
  Compass,
  Layers,
  Palette,
  Play,
  ShieldCheck,
  Sparkles,
  Target,
} from 'lucide-react';

type LessonKey = 'Resistor Color Codes' | '4-Band Resistors' | '5-Band Resistors';

type Objective = {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
};

type Stat = {
  label: string;
  value: string;
  description: string;
};

type QuizQuestion = {
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
};

export type LessonBlueprint = {
  key: LessonKey;
  hero: {
    strapline: string;
    title: string;
    summary: string;
    stats: Stat[];
  };
  objectives: Objective[];
  sections: {
    id: string;
    label: string;
    description?: string;
  }[];
  content: () => React.ReactNode;
  quiz?: {
    title: string;
    questions: QuizQuestion[];
    practiceLink?: {
      href: string;
      label: string;
    };
  };
  practiceCTA?: {
    title: string;
    description: string;
    href: string;
    badge: string;
    highlight?: string;
  };
  resources?: {
    title: string;
    items: {
      label: string;
      description: string;
      href?: string;
    }[];
  };
};

const COLOR_TABLE = [
  { color: 'ดำ (Black)', digits: '0', multiplier: '×10⁰ (1)', tolerance: '20% (M)' },
  { color: 'น้ำตาล (Brown)', digits: '1', multiplier: '×10¹ (10)', tolerance: '1% (F)' },
  { color: 'แดง (Red)', digits: '2', multiplier: '×10² (100)', tolerance: '2% (G)' },
  { color: 'ส้ม (Orange)', digits: '3', multiplier: '×10³ (1k)', tolerance: '—' },
  { color: 'เหลือง (Yellow)', digits: '4', multiplier: '×10⁴ (10k)', tolerance: '—' },
  { color: 'เขียว (Green)', digits: '5', multiplier: '×10⁵ (100k)', tolerance: '0.5% (D)' },
  { color: 'น้ำเงิน (Blue)', digits: '6', multiplier: '×10⁶ (1M)', tolerance: '0.25% (C)' },
  { color: 'ม่วง (Violet)', digits: '7', multiplier: '×10⁷ (10M)', tolerance: '0.1% (B)' },
  { color: 'เทา (Gray)', digits: '8', multiplier: '×10⁸', tolerance: '0.05% (A)' },
  { color: 'ขาว (White)', digits: '9', multiplier: '×10⁹', tolerance: '—' },
  { color: 'ทอง (Gold)', digits: '—', multiplier: '×10⁻¹ (0.1)', tolerance: '±5% (J)' },
  { color: 'เงิน (Silver)', digits: '—', multiplier: '×10⁻² (0.01)', tolerance: '±10% (K)' },
  { color: 'ไม่มีสี (None)', digits: '—', multiplier: '—', tolerance: '±20% (M)' },
];

const FOUR_BAND_EXAMPLES = [
  {
    bands: ['ส้ม', 'แดง', 'น้ำตาล', 'ทอง'],
    decoded: '3 2 × 10¹',
    resistance: '320 Ω',
    tolerance: '±5%',
    explanation:
      'แถบ 1 = 3, แถบ 2 = 2, ตัวคูณ = ×10¹ (10), ความต้านทาน = 32 × 10 = 320 Ω',
  },
  {
    bands: ['เขียว', 'ดำ', 'ส้ม', 'เงิน'],
    decoded: '5 0 × 10³',
    resistance: '50 kΩ',
    tolerance: '±10%',
    explanation:
      'แถบ 1 = 5, แถบ 2 = 0, ตัวคูณ = ×10³ (1,000), ความต้านทาน = 50 × 1,000 = 50,000 Ω',
  },
];

const FIVE_BAND_EXAMPLES = [
  {
    bands: ['ม่วง', 'แดง', 'ดำ', 'เขียว', 'น้ำตาล'],
    decoded: '7 2 0 × 10⁵',
    resistance: '7.20 MΩ',
    tolerance: '±1%',
    explanation:
      'สามแถบแรก = 720, ตัวคูณ = ×10⁵ (100,000) ⇒ 720 × 100,000 = 72,000,000 Ω (72 MΩ)',
  },
  {
    bands: ['เหลือง', 'เทา', 'แดง', 'ส้ม', 'น้ำตาล'],
    decoded: '4 8 2 × 10³',
    resistance: '482 kΩ',
    tolerance: '±1%',
    explanation: '482 × 1,000 = 482,000 Ω โดยมีช่วง ±1%',
  },
];

export const RESISTOR_LESSON_BLUEPRINTS: Record<LessonKey, LessonBlueprint> = {
  'Resistor Color Codes': {
    key: 'Resistor Color Codes',
    hero: {
      strapline: 'บทเรียนที่ 1',
      title: 'พื้นฐานตัวต้านทาน & ตารางรหัสสี',
      summary:
        'ปูพื้นฐานให้เข้าใจตัวต้านทานแบบทะลุรู, ความสำคัญของรหัสสี และจดจำค่าตัวเลขของแต่ละสีอย่างเป็นระบบ สร้างทักษะที่จะใช้ในทุกบทเรียนถัดไป',
      stats: [
        { label: 'เวลาที่แนะนำ', value: '15 นาที', description: 'อ่านพร้อมจดบันทึกสั้น ๆ' },
        { label: 'หัวข้อหลัก', value: '3', description: 'โครงสร้าง, ตารางสี, เทคนิคจำ' },
        { label: 'แบบฝึกหัด', value: 'Mini Quiz', description: 'คำถาม 3 ข้อเพื่อทบทวนทันที' },
      ],
    },
    objectives: [
      { icon: BookOpen, text: 'นิยามและบทบาทของตัวต้านทานในวงจร' },
      { icon: Brain, text: 'รู้จักตัวตั้ง ตัวคูณ และแถบความคลาดเคลื่อน' },
      { icon: Sparkles, text: 'ใช้เทคนิคช่วยจำลำดับสีได้จริง' },
    ],
    sections: [
      { id: 'basics', label: 'ความรู้เบื้องต้นเกี่ยวกับตัวต้านทาน' },
      { id: 'color-table', label: 'ตารางค่ารหัสสีพื้นฐาน' },
      { id: 'reading-techniques', label: 'หลักการอ่านทิศทางและเทคนิคจำ' },
    ],
    content: () => (
      <>
        <section
          id="basics"
          className="rounded-3xl border border-orange-100 bg-white/80 p-8 shadow-lg shadow-orange-100/40 backdrop-blur"
        >
          <header className="mb-6 flex items-start gap-4">
            <div className="rounded-2xl bg-orange-100 p-3 text-orange-600">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-slate-900">
                1.1 ความรู้เบื้องต้นเกี่ยวกับตัวต้านทาน
              </h3>
              <p className="mt-2 text-lg text-slate-600">
                ตัวต้านทาน (Resistor) คืออุปกรณ์พื้นฐานที่ทำหน้าที่จำกัดการไหลของกระแสไฟฟ้า
                วัดเป็นโอห์ม (Ω) และพบได้ในทุกวงจรอิเล็กทรอนิกส์
              </p>
            </div>
          </header>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-orange-100/60 bg-orange-50/60 p-6">
              <h4 className="font-semibold text-orange-600">หน้าที่หลัก</h4>
              <ul className="mt-3 space-y-2 text-slate-600">
                <li>• จำกัดกระแสและแบ่งแรงดันในวงจร</li>
                <li>• ปกป้องอุปกรณ์อื่นจากกระแสเกิน</li>
                <li>• กำหนดค่าการทำงานของวงจร (bias, gain ฯลฯ)</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h4 className="font-semibold text-slate-800">ทำไมต้องมีรหัสสี?</h4>
              <p className="mt-3 text-slate-600">
                ตัวต้านทานแบบคาร์บอนมักมีขนาดเล็กจนพิมพ์ตัวเลขไม่ได้
                จึงใช้แถบสีตามมาตรฐาน EIA เพื่อสื่อสารค่าความต้านทาน ตัวคูณ และความคลาดเคลื่อน
              </p>
            </div>
          </div>
        </section>

        <section
          id="color-table"
          className="rounded-3xl border border-blue-100 bg-blue-50/30 p-8 shadow-inner shadow-blue-100/50"
        >
          <header className="mb-6 flex items-start gap-4">
            <div className="rounded-2xl bg-blue-100 p-3 text-blue-600">
              <Layers className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-slate-900">
                1.2 ตารางค่ารหัสสีพื้นฐาน
              </h3>
              <p className="mt-2 text-slate-600">
                จำตารางนี้ให้แม่นคือกุญแจสู่การอ่านตัวต้านทาน 4 แถบและ 5 แถบ
                แยกให้เห็นชัดทั้งตัวเลข, ตัวคูณ, และค่าความคลาดเคลื่อน
              </p>
            </div>
          </header>
          <div className="overflow-hidden rounded-2xl border border-blue-200 bg-white">
            <table className="min-w-full divide-y divide-blue-100 text-left text-sm text-slate-600">
              <thead className="bg-blue-50/80 text-xs uppercase tracking-wide text-blue-700">
                <tr>
                  <th className="px-4 py-3 font-semibold">รหัสสี</th>
                  <th className="px-4 py-3 font-semibold">ค่าตัวตั้ง</th>
                  <th className="px-4 py-3 font-semibold">ตัวคูณ</th>
                  <th className="px-4 py-3 font-semibold">ความคลาดเคลื่อน</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-50">
                {COLOR_TABLE.map((row) => (
                  <tr key={row.color} className="hover:bg-orange-50/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-800">{row.color}</td>
                    <td className="px-4 py-3">{row.digits}</td>
                    <td className="px-4 py-3">{row.multiplier}</td>
                    <td className="px-4 py-3">{row.tolerance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section
          id="reading-techniques"
          className="rounded-3xl border border-emerald-100 bg-emerald-50/30 p-8"
        >
          <header className="mb-6 flex items-start gap-4">
            <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-600">
              <Brain className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-slate-900">
                1.3 หลักการอ่านทิศทางและเทคนิคจำ
              </h3>
              <p className="mt-2 text-slate-600">
                อ่านจากด้านที่แถบแรกอยู่ชิดปลายที่สุด แถบสุดท้าย (Tolerance) จะมีช่องไฟมากกว่า
                และมักเป็นสีทองหรือเงิน
              </p>
            </div>
          </header>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-emerald-100 bg-white p-6">
              <h4 className="font-semibold text-emerald-600">หลีกเลี่ยงข้อผิดพลาด</h4>
              <ul className="mt-3 space-y-2 text-slate-600">
                <li>• ใช้ไฟสว่างและแว่นขยายเพื่อแยกสีใกล้เคียง</li>
                <li>• ตรวจสอบตำแหน่งแถบทอง/เงินก่อนเริ่มอ่าน</li>
                <li>• ยืนยันอีกครั้งด้วยการวัดจริงเมื่อจำเป็น</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
              <h4 className="font-semibold text-emerald-700">เทคนิคช่วยจำ</h4>
              <p className="mt-3 text-slate-600">
                สร้างวลีจำง่าย ๆ สำหรับสี 0-9 เช่น
                <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 text-sm text-emerald-700 shadow-sm">
                  Bad Boys Run Over Yellow Gardenias Behind Victory Garden Walls
                </span>
              </p>
            </div>
          </div>
        </section>
      </>
    ),
    quiz: {
      title: 'Mini Quiz: จำตารางสีได้แค่ไหน?',
      questions: [
        {
          prompt: 'สีใดแสดงค่าตัวเลข 4 และตัวคูณ ×10⁴?',
          options: ['น้ำเงิน', 'เหลือง', 'แดง', 'ส้ม'],
          answer: 1,
          explanation: 'สีเหลือง (Yellow) แทนเลข 4 และตัวคูณ ×10⁴ (10,000)',
        },
        {
          prompt: 'แถบท้ายสีทองหมายถึงอะไร?',
          options: [
            'ตัวคูณ ×10⁻¹ และค่าคลาดเคลื่อน ±5%',
            'ตัวคูณ ×10¹ และค่าคลาดเคลื่อน ±1%',
            'เพิ่มความแม่นยำ +5%',
            'ใช้เฉพาะตัวต้านทาน 5 แถบ',
          ],
          answer: 0,
          explanation:
            'สีทองใช้เป็นตัวคูณ 0.1 (×10⁻¹) และบ่งบอก Tolerance ±5% ในตัวต้านทาน 4 หรือ 5 แถบ',
        },
        {
          prompt: 'ถ้าพบตัวต้านทานที่ไม่มีสีทองหรือเงินอยู่ท้ายสุดควรระวังอะไร?',
          options: [
            'อาจอ่านกลับด้าน',
            'เป็นตัวต้านทานปลอม',
            'มีค่าคลาดเคลื่อน ±0%',
            'ต้องใช้เครื่องมือพิเศษ',
          ],
          answer: 0,
          explanation:
            'ตรวจสอบทิศทางอ่านให้ถูกต้อง แถบสุดท้ายมักเป็น tolerance ซึ่งอยู่ห่างจากแถบอื่นเล็กน้อย',
        },
      ],
    },
    practiceCTA: {
      title: 'เริ่มฝึกอ่านค่าแบบเร็ว',
      description: 'ใช้โหมด Quick Practice: เลือกประเภท FOUR_BAND หรือ FIVE_BAND เพื่อเริ่มทบทวนสีทันที',
      href: '/learn/self/practice/quick?type=FOUR_BAND',
      badge: 'เริ่มฝึก',
      highlight: 'เหมาะสำหรับการทบทวนหลังเรียนบท 1',
    },
    resources: {
      title: 'เอกสารประกอบ',
      items: [
        {
          label: 'Color Code Reference Card (PDF)',
          description: 'บัตรอ้างอิงรหัสสีที่พิมพ์ได้ พกไว้ในกระเป๋าเครื่องมือ',
          href: '/resources/resistor-color-card.pdf',
        },
        {
          label: 'มาตรฐาน EIA',
          description: 'ที่มาของการกำหนดรหัสสี',
        },
      ],
    },
  },
  '4-Band Resistors': {
    key: '4-Band Resistors',
    hero: {
      strapline: 'บทเรียนที่ 2',
      title: 'การอ่านค่าตัวต้านทาน 4 แถบ',
      summary:
        'ฝึกตีความตัวตั้ง, ตัวคูณ, และแถบทอง/เงินให้คล่อง พร้อมตัวอย่างสถานการณ์ที่เจอบ่อยในงานจริง',
      stats: [
        { label: 'เวลาที่แนะนำ', value: '20 นาที', description: 'อ่าน + ฝึกคำนวณตัวอย่าง' },
        { label: 'ตัวอย่างคำนวณ', value: '2', description: 'ทั้งค่ามาตรฐานและค่าขยาย' },
        { label: 'ภารกิจฝึก', value: 'Quick Practice', description: 'สุ่มโจทย์ 10 ข้อพร้อมอธิบายผลลัพธ์' },
      ],
    },
    objectives: [
      { icon: ClipboardCheck, text: 'ตีความ 4 แถบ: 2 หลัก + ตัวคูณ + คลาดเคลื่อน' },
      { icon: Target, text: 'คำนวณค่าความต้านทานจากรหัสสีได้อย่างมั่นใจ' },
      { icon: ShieldCheck, text: 'ประเมินช่วงค่า (Min/Max) จาก tolerance' },
      { icon: Play, text: 'ทดลองกับตัวอย่างที่ใช้จริงในภาคสนาม' },
    ],
    sections: [
      { id: 'four-band-structure', label: 'โครงสร้างและการกำหนดค่า' },
      { id: 'four-band-examples', label: 'ตัวอย่างการคำนวณ' },
      { id: 'four-band-tolerance', label: 'ค่าความคลาดเคลื่อนและช่วงค่า' },
    ],
    content: () => (
      <>
        <section
          id="four-band-structure"
          className="rounded-3xl border border-purple-100 bg-white p-8 shadow-lg shadow-purple-100/40"
        >
          <header className="mb-6 flex items-start gap-4">
            <div className="rounded-2xl bg-purple-100 p-3 text-purple-600">
              <Layers className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-slate-900">
                2.1 โครงสร้างและการกำหนดค่า
              </h3>
              <p className="mt-2 text-lg text-slate-600">
                ตัวต้านทาน 4 แถบอ่านค่าโดยใช้ 2 หลักแรกเป็นตัวตั้ง แถบที่ 3 เป็นตัวคูณ
                และแถบสุดท้ายสำหรับค่าความคลาดเคลื่อน
              </p>
            </div>
          </header>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-purple-100 bg-purple-50/50 p-6">
              <h4 className="font-semibold text-purple-600">ลำดับการอ่าน</h4>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-slate-600">
                <li>หาแถบที่อยู่ใกล้ขอบที่สุด (แถบที่ 1)</li>
                <li>อ่านสองแถบแรกเพื่อสร้างตัวเลข 2 หลัก (10-99)</li>
                <li>ใช้แถบที่ 3 เพื่อคูณด้วย 10ⁿ (เพิ่มศูนย์)</li>
                <li>ประเมินค่าคลาดเคลื่อนจากแถบสุดท้ายทอง/เงิน</li>
              </ol>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h4 className="font-semibold text-slate-800">สูตรคำนวณ</h4>
              <p className="mt-3 text-slate-600">
                <span className="font-semibold text-purple-700">Resistance</span> =
                (Digit₁ Digit₂) × Multiplier Ω
              </p>
              <p className="mt-2 text-slate-500">
                ตัวคูณคือ 10 ยกกำลังตามค่าสี เช่น แดง = 10², น้ำตาล = 10¹
              </p>
            </div>
          </div>
        </section>

        <section
          id="four-band-examples"
          className="rounded-3xl border border-orange-100 bg-orange-50/40 p-8 shadow-inner shadow-orange-100/50"
        >
          <header className="mb-6 flex items-start gap-4">
            <div className="rounded-2xl bg-orange-100 p-3 text-orange-600">
              <Beaker className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-slate-900">
                2.2 ตัวอย่างคำนวณที่ต้องเจอบ่อย
              </h3>
              <p className="mt-2 text-slate-600">
                ลองไล่จากค่าหลักร้อยไปถึงค่าหลักหมื่น หมายเหตุในแถบทอง/เงินเพื่อกำหนดช่วงค่า
              </p>
            </div>
          </header>
          <div className="grid gap-6 md:grid-cols-2">
            {FOUR_BAND_EXAMPLES.map((example) => (
              <div
                key={example.resistance}
                className="group rounded-2xl border border-orange-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold uppercase tracking-wide text-orange-500">
                    {example.bands.join(' • ')}
                  </div>
                  <div className="rounded-full bg-orange-100 px-3 py-1 text-xs text-orange-600">
                    {example.tolerance}
                  </div>
                </div>
                <p className="mt-3 text-2xl font-bold text-slate-900">{example.resistance}</p>
                <p className="mt-2 text-sm text-slate-500">{example.decoded}</p>
                <p className="mt-4 text-sm text-slate-600">{example.explanation}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          id="four-band-tolerance"
          className="rounded-3xl border border-slate-200 bg-white p-8"
        >
          <header className="mb-6 flex items-start gap-4">
            <div className="rounded-2xl bg-slate-200 p-3 text-slate-600">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-slate-900">
                2.3 ค่าความคลาดเคลื่อนและช่วงที่ยอมรับได้
              </h3>
              <p className="mt-2 text-slate-600">
                ไม่ใช่ทุกตัวต้านทานที่มีค่าจริงตรงกับค่าบนรหัสสี
                ใช้แถบทอง/เงินเพื่อรู้ช่วงค่าที่รับได้
              </p>
            </div>
          </header>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <h4 className="font-semibold text-slate-800">ความหมายของ Tolerance</h4>
              <ul className="mt-3 space-y-2 text-slate-600">
                <li>ทอง (Gold) = ±5% (J)</li>
                <li>เงิน (Silver) = ±10% (K)</li>
                <li>ไม่มีแถบ = ±20% (M)</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h4 className="font-semibold text-slate-800">การคำนวณช่วงค่า</h4>
              <p className="mt-3 text-slate-600">
                <span className="font-semibold text-purple-700">Min</span> = Nominal − (Nominal × %Tolerance)
              </p>
              <p className="text-slate-600">
                <span className="font-semibold text-purple-700">Max</span> = Nominal + (Nominal × %Tolerance)
              </p>
              <p className="mt-3 text-sm text-slate-500">
                เช่น 100 Ω ±5% ⇒ ช่วงอยู่ที่ 95 Ω ถึง 105 Ω
              </p>
            </div>
          </div>
        </section>
      </>
    ),
    quiz: {
      title: 'Quick Check: 4-Band Ready?',
      questions: [
        {
          prompt: 'รหัสสี แดง-ม่วง-น้ำตาล-ทอง ให้ค่าความต้านทานเท่าใด?',
          options: ['27 Ω ±5%', '270 Ω ±5%', '2.7 kΩ ±5%', '270 kΩ ±5%'],
          answer: 1,
          explanation:
            'แดง = 2, ม่วง = 7 → 27 × ตัวคูณ น้ำตาล = ×10¹ ⇒ 270 Ω, แถบทอง = ±5%',
        },
        {
          prompt: 'ตัวอย่างใดที่บ่งบอกว่าคุณอ่านกลับด้าน?',
          options: [
            'เริ่มที่แถบทองแล้วได้ตัวเลขหลักกลาง',
            'ค่าคำนวณได้เกิน 10 MΩ',
            'ตัวคูณเป็นทองและ tolerance เป็นส้ม',
            'ได้ค่าต่ำกว่า 1 Ω เสมอ',
          ],
          answer: 0,
          explanation:
            'ถ้าเริ่มอ่านจากแถบทอง นั่นคือคุณเริ่มจาก tolerance ควรพลิกกลับด้าน',
        },
        {
          prompt: 'การละเลยแถบตัวคูณจะเกิดผลอย่างไร?',
          options: [
            'ได้ค่าคลาดเคลื่อนที่ผิด',
            'ค่าที่คำนวณได้จะขยับ 10ⁿ เท่า',
            'ไม่มีผลเพราะตัวคูณไม่จำเป็น',
            'ทำให้แถบที่ 1 และ 2 ผิดตำแหน่ง',
          ],
          answer: 1,
          explanation:
            'แถบตัวคูณกำหนดจำนวนศูนย์—ละเลยจะทำให้ค่าคลาดเคลื่อนในระดับสิบหรือร้อยเท่า',
        },
      ],
      practiceLink: {
        href: '/learn/self/practice/quick?type=FOUR_BAND',
        label: 'ฝึกต่อใน Quick Practice (4 Band)',
      },
    },
    practiceCTA: {
      title: 'จำลองสถานการณ์จริง',
      description:
        'สุ่มโจทย์ 10 คำถามพร้อมดูคำอธิบายการถอดรหัสสีแบบละเอียด บันทึกผลลัพธ์ลงใน History อัตโนมัติ',
      href: '/learn/self/practice/quick?type=FOUR_BAND',
      badge: 'Practice Mode',
      highlight: 'เลือกป้อนคำตอบแบบ Multiple Choice หรือ Fill-in ได้',
    },
  },
  '5-Band Resistors': {
    key: '5-Band Resistors',
    hero: {
      strapline: 'บทเรียนที่ 3',
      title: 'การอ่านค่าตัวต้านทาน 5 แถบ',
      summary:
        'ต่อยอดจาก 4 แถบ เพิ่มตัวเลขหลักที่ 3 เพื่อความแม่นยำสูง รวมถึงค่า tolerance ที่ละเอียดขึ้น',
      stats: [
        { label: 'เวลาที่แนะนำ', value: '20-25 นาที', description: 'พร้อมทดลองคำนวณ 5 ตัวอย่าง' },
        { label: 'ระดับความแม่นยำ', value: '±0.1% ถึง ±2%', description: 'ใช้ในงานวัดผลที่ต้องการความละเอียด' },
        { label: 'ภารกิจฝึก', value: 'Preset FIVE_BAND', description: 'บันทึกคะแนนลง Dashboard' },
      ],
    },
    objectives: [
      { icon: Compass, text: 'รู้จักตำแหน่งตัวเลขหลักที่ 3 และตัวคูณ' },
      { icon: Target, text: 'อ่านค่าได้รวดเร็วแม้ตัวเลขหลักยาวขึ้น' },
      { icon: Award, text: 'เลือก tolerance ที่สอดคล้องกับงานแม่นยำสูง' },
      { icon: Sparkles, text: 'ฝึกแยกความต่างระหว่าง 4 แถบกับ 5 แถบ' },
    ],
    sections: [
      { id: 'five-band-structure', label: 'โครงสร้างตัวต้านทาน 5 แถบ' },
      { id: 'five-band-examples', label: 'ตัวอย่างการตีความ' },
      { id: 'five-band-tolerance', label: 'เลือกค่า Tolerance สำหรับงานจริง' },
    ],
    content: () => (
      <>
        <section
          id="five-band-structure"
          className="rounded-3xl border border-indigo-100 bg-white p-8 shadow-lg shadow-indigo-100/40"
        >
          <header className="mb-6 flex items-start gap-4">
            <div className="rounded-2xl bg-indigo-100 p-3 text-indigo-600">
              <Layers className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-slate-900">
                3.1 โครงสร้าง 5 แถบที่เพิ่มความละเอียด
              </h3>
              <p className="mt-2 text-slate-600">
                เพิ่มตัวเลขสำคัญ (Significant Digit) แถบที่ 3 ก่อนถึงตัวคูณ ⇒ ปรับค่าความต้านทานละเอียดถึงหลัก 0.1%
              </p>
            </div>
          </header>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-6">
              <h4 className="font-semibold text-indigo-700">ลำดับแถบ</h4>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-slate-600">
                <li>แถบ 1-3: ตัวเลขหลักแรก, ที่สอง, และที่สาม</li>
                <li>แถบ 4: ตัวคูณ (Multiplier)</li>
                <li>แถบ 5: ค่าคลาดเคลื่อน (Tolerance)</li>
              </ol>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h4 className="font-semibold text-slate-800">สูตรคำนวณ</h4>
              <p className="mt-3 text-slate-600">
                Resistance = (Digit₁ Digit₂ Digit₃) × Multiplier Ω
              </p>
              <p className="mt-2 text-slate-500">
                ตัวอย่าง: 482 × 10³ = 482 kΩ พร้อม tolerance ±1%
              </p>
            </div>
          </div>
        </section>

        <section
          id="five-band-examples"
          className="rounded-3xl border border-pink-100 bg-pink-50/40 p-8 shadow-inner shadow-pink-100/50"
        >
          <header className="mb-6 flex items-start gap-4">
            <div className="rounded-2xl bg-pink-100 p-3 text-pink-600">
              <Beaker className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-slate-900">
                3.2 ตัวอย่างการตีความ 5 แถบ
              </h3>
              <p className="mt-2 text-slate-600">
                สังเกตว่ามีตัวเลขหลักเพิ่มขึ้นอีกหนึ่งตัว แต่หลักการตีความยังเหมือนเดิม
              </p>
            </div>
          </header>
          <div className="grid gap-6 md:grid-cols-2">
            {FIVE_BAND_EXAMPLES.map((example) => (
              <div
                key={example.resistance}
                className="group rounded-2xl border border-pink-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold uppercase tracking-wide text-pink-500">
                    {example.bands.join(' • ')}
                  </div>
                  <div className="rounded-full bg-pink-100 px-3 py-1 text-xs text-pink-600">
                    {example.tolerance}
                  </div>
                </div>
                <p className="mt-3 text-2xl font-bold text-slate-900">{example.resistance}</p>
                <p className="mt-2 text-sm text-slate-500">{example.decoded}</p>
                <p className="mt-4 text-sm text-slate-600">{example.explanation}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          id="five-band-tolerance"
          className="rounded-3xl border border-amber-100 bg-white p-8"
        >
          <header className="mb-6 flex items-start gap-4">
            <div className="rounded-2xl bg-amber-100 p-3 text-amber-600">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-slate-900">
                3.3 เลือกค่า Tolerance ให้เหมาะกับงาน
              </h3>
              <p className="mt-2 text-slate-600">
                ตัวต้านทาน 5 แถบใช้ในงานที่ต้องการความแม่นยำสูง เช่น เครื่องมือวัดและงานควบคุม
              </p>
            </div>
          </header>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-amber-100 bg-amber-50/40 p-6">
              <h4 className="font-semibold text-amber-700">ความคลาดเคลื่อนยอดนิยม</h4>
              <ul className="mt-3 space-y-2 text-slate-600">
                <li>น้ำตาล = ±1% (F)</li>
                <li>แดง = ±2% (G)</li>
                <li>เขียว = ±0.5% (D)</li>
                <li>น้ำเงิน = ±0.25% (C)</li>
                <li>ม่วง = ±0.1% (B)</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h4 className="font-semibold text-slate-800">ทิปสำหรับมืออาชีพ</h4>
              <p className="mt-3 text-slate-600">
                จับคู่ค่า tolerance กับงาน: งานออดิโอหรืองานเซ็นเซอร์ → ±1% หรือต่ำกว่า
                งานทั่วไปในอุตสาหกรรมอาจใช้ ±2%
              </p>
            </div>
          </div>
        </section>
      </>
    ),
    quiz: {
      title: 'Precision Check: 5-Band Mastery',
      questions: [
        {
          prompt: 'รหัสสี น้ำเงิน-เทา-น้ำตาล-แดง-น้ำตาล แปลว่าอะไร?',
          options: ['681 Ω ±1%', '681 Ω ±2%', '6.81 kΩ ±1%', '68.1 kΩ ±1%'],
          answer: 2,
          explanation:
            'น้ำเงิน = 6, เทา = 8, น้ำตาล = 1 ⇒ 681 × ตัวคูณ แถบสีแดง = ×10² ⇒ 681 × 100 = 68,100 Ω = 6.81 kΩ, tolerance น้ำตาล = ±1%',
        },
        {
          prompt: 'งานควบคุมอุณหภูมิที่ต้องการความแม่น ±0.5% ควรเลือกแถบใดเป็น tolerance?',
          options: ['น้ำตาล', 'แดง', 'เขียว', 'น้ำเงิน'],
          answer: 2,
          explanation: 'สีเขียว (Green) บ่งบอก tolerance ±0.5%',
        },
        {
          prompt: 'ความแตกต่างหลักระหว่าง 4 แถบกับ 5 แถบคืออะไร?',
          options: [
            '5 แถบมีตัวเลขหลักมากกว่า 1 หลัก',
            '4 แถบใช้กับตัวต้านทานผิวหน้าเท่านั้น',
            '5 แถบไม่มีแถบ tolerance',
            '4 แถบอ่านได้เฉพาะค่าต่ำกว่า 1 kΩ',
          ],
          answer: 0,
          explanation:
            '5 แถบเพิ่มแถบ significant digit ที่สาม ทำให้ค่าความต้านทานละเอียดขึ้น',
        },
      ],
      practiceLink: {
        href: '/learn/self/practice/quick?type=FIVE_BAND',
        label: 'เริ่ม Quick Practice (5 Band)',
      },
    },
    practiceCTA: {
      title: 'Practice Preset: FIVE_BAND',
      description:
        'เปิดโหมด Five-band พร้อมบันทึกผลลง Dashboard ทันที เหมาะสำหรับเตรียมตัวสอบภาคปฏิบัติ',
      href: '/learn/self/practice/quick?type=FIVE_BAND',
      badge: 'Advanced Mode',
      highlight: 'ใช้เวลาประมาณ 10-15 นาที',
    },
    resources: {
      title: 'สำหรับการทบทวนเพิ่มเติม',
      items: [
        {
          label: 'Resistor Precision Checklist',
          description: 'เช็กลิสต์เลือก tolerance ให้เหมาะกับงานจริง',
        },
        {
          label: 'Practice History',
          description: 'ย้อนดูสถิติการฝึกของคุณ',
          href: '/learn/self/practice/sessions',
        },
      ],
    },
  },
};

function InteractiveQuiz({ title, questions, practiceLink }: Required<LessonBlueprint>['quiz']) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = questions[currentIndex];

  const handleSelect = (optionIndex: number) => {
    if (selected !== null) return;
    setSelected(optionIndex);
    if (optionIndex === currentQuestion.answer) {
      setScore((prev) => prev + 1);
    }
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentIndex === questions.length - 1) {
      setCurrentIndex(0);
      setSelected(null);
      setScore(0);
      setShowResult(false);
      return;
    }
    setCurrentIndex((prev) => prev + 1);
    setSelected(null);
    setShowResult(false);
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/40">
      <header className="mb-6 flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-orange-100 p-3 text-orange-600">
            <Brain className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-slate-900">{title}</h3>
            <p className="mt-2 text-sm text-slate-500">
              ข้อที่ {currentIndex + 1} จาก {questions.length}
            </p>
          </div>
        </div>
        <div className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
          คะแนน {score}/{questions.length}
        </div>
      </header>

      <div className="space-y-6">
        <p className="text-lg font-medium text-slate-800">{currentQuestion.prompt}</p>
        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => {
            const isCorrect = idx === currentQuestion.answer;
            const isSelected = idx === selected;
            const showState = selected !== null;
            const baseClasses =
              'flex items-center gap-3 rounded-2xl border px-4 py-3 transition focus:outline-none';
            const stateClasses = !showState
              ? 'border-slate-200 bg-white hover:border-orange-200 hover:bg-orange-50 cursor-pointer'
              : isCorrect
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : isSelected
              ? 'border-rose-200 bg-rose-50 text-rose-600'
              : 'border-slate-200 bg-white text-slate-500';

            return (
              <button
                key={option}
                type="button"
                className={`${baseClasses} ${stateClasses}`}
                onClick={() => handleSelect(idx)}
                disabled={showState}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-current text-sm font-semibold">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-left text-sm font-medium">{option}</span>
              </button>
            );
          })}
        </div>

        {showResult && (
          <div
            className={`rounded-2xl border p-4 ${
              selected === currentQuestion.answer
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border-rose-200 bg-rose-50 text-rose-600'
            }`}
          >
            {currentQuestion.explanation}
          </div>
        )}

        <div className="flex items-center justify-between">
          {practiceLink ? (
            <Link
              href={practiceLink.href}
              className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-medium text-orange-600 transition hover:border-orange-300 hover:bg-orange-100"
            >
              <Play className="h-4 w-4" />
              {practiceLink.label}
            </Link>
          ) : (
            <div />
          )}
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            {currentIndex === questions.length - 1 ? 'เริ่มใหม่' : 'ข้อถัดไป'}
          </button>
        </div>
      </div>
    </section>
  );
}

function PracticeCallout({ title, description, href, badge, highlight }: NonNullable<LessonBlueprint['practiceCTA']>) {
  return (
    <section className="rounded-3xl border border-orange-200 bg-gradient-to-br from-orange-50 via-white to-orange-100 p-8 shadow-lg shadow-orange-100/60">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-600 shadow-sm">
            <Target className="h-4 w-4" />
            {badge}
          </div>
          <h3 className="text-2xl font-semibold text-slate-900">{title}</h3>
          <p className="text-slate-600">{description}</p>
          {highlight && <p className="text-sm text-orange-600">{highlight}</p>}
        </div>
        <Link
          href={href}
          className="inline-flex items-center justify-center rounded-2xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition hover:-translate-y-1 hover:bg-orange-600"
        >
          เริ่มฝึกทันที
        </Link>
      </div>
    </section>
  );
}

function ResourceList({ title, items }: NonNullable<LessonBlueprint['resources']>) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/40">
      <header className="mb-6 flex items-center gap-3">
        <CheckCircle2 className="h-6 w-6 text-slate-600" />
        <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
      </header>
      <ul className="space-y-4">
        {items.map((item) => (
          <li
            key={item.label}
            className="flex items-start justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50/80 p-4"
          >
            <div>
              <p className="font-semibold text-slate-800">{item.label}</p>
              <p className="text-sm text-slate-600">{item.description}</p>
            </div>
            {item.href && (
              <Link
                href={item.href}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 transition hover:border-orange-200 hover:text-orange-600"
              >
                เปิดดู
              </Link>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function getLessonSections(blueprint: LessonBlueprint) {
  const base = [
    { id: 'overview', label: 'ภาพรวมบทเรียน' },
    { id: 'objectives', label: 'เป้าหมายการเรียนรู้' },
    ...blueprint.sections,
  ];

  if (blueprint.quiz) {
    base.push({ id: 'lesson-quiz', label: blueprint.quiz.title });
  }

  if (blueprint.practiceCTA) {
    base.push({ id: 'lesson-practice', label: blueprint.practiceCTA.title });
  }

  if (blueprint.resources) {
    base.push({ id: 'lesson-resources', label: blueprint.resources.title });
  }

  return base;
}

export function LessonContentRenderer({ blueprint }: { blueprint: LessonBlueprint }) {
  const { hero, objectives, content, quiz, practiceCTA, resources } = blueprint;

  const memoizedObjectives = useMemo(() => objectives, [objectives]);
  const renderedContent = useMemo(() => content(), [content]);

  return (
    <div className="space-y-12">
      <section
        id="overview"
        className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/40"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">
          {hero.strapline}
        </p>
        <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">{hero.title}</h2>
        <p className="mt-4 text-lg text-slate-600">{hero.summary}</p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {hero.stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 text-center shadow-sm"
            >
              <div className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                {stat.label}
              </div>
              <div className="mt-2 text-2xl font-bold text-slate-900">{stat.value}</div>
              <div className="mt-1 text-sm text-slate-600">{stat.description}</div>
            </div>
          ))}
        </div>
      </section>

      <section
        id="objectives"
        className="rounded-3xl border border-emerald-200 bg-emerald-50/40 p-8 shadow-inner shadow-emerald-100/60"
      >
        <header className="mb-6 flex items-center gap-3">
          <Sparkles className="h-6 w-6 text-emerald-600" />
          <h3 className="text-xl font-semibold text-slate-900">Learning Objectives</h3>
        </header>
        <div className="grid gap-4 md:grid-cols-2">
          {memoizedObjectives.map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-start gap-4 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm"
            >
              <div className="rounded-xl bg-emerald-100 p-2 text-emerald-600">
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium text-slate-700">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="space-y-12">{renderedContent}</div>

      {quiz && (
        <section id="lesson-quiz">
          <InteractiveQuiz {...quiz} />
        </section>
      )}

      {practiceCTA && (
        <section id="lesson-practice">
          <PracticeCallout {...practiceCTA} />
        </section>
      )}

      {resources && (
        <section id="lesson-resources">
          <ResourceList {...resources} />
        </section>
      )}
    </div>
  );
}


