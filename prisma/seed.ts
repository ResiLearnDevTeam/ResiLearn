import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Load .env.local (with override to ensure it takes precedence)
import { config } from 'dotenv';
config({ path: '.env.local', override: true });

// Verify DATABASE_URL
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in .env.local');
}

const db = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

type LessonContentSeed = {
  strapline?: string;
  summary?: string;
  heroStats?: Array<{ label: string; value: string; description?: string }>;
  objectives?: Array<{ icon?: string; text: string }>;
  sections?: Array<{
    slug: string;
    title: string;
    description?: string;
    order?: number;
    content: any[];
  }>;
  quiz?: {
    title: string;
    questions: Array<{
      prompt: string;
      options: string[];
      answerIndex: number;
      explanation?: string;
    }>;
  };
  practice?: {
    title: string;
    description?: string;
    href: string;
    badge?: string;
    highlight?: string;
  };
  resources?: Array<{
    label: string;
    description?: string;
    href?: string;
  }>;
};

const COLOR_CODE_TABLE = [
  ['ดำ (Black)', '0', '×10⁰ (1)', '20% (M)'],
  ['น้ำตาล (Brown)', '1', '×10¹ (10)', '1% (F)'],
  ['แดง (Red)', '2', '×10² (100)', '2% (G)'],
  ['ส้ม (Orange)', '3', '×10³ (1k)', '—'],
  ['เหลือง (Yellow)', '4', '×10⁴ (10k)', '—'],
  ['เขียว (Green)', '5', '×10⁵ (100k)', '0.5% (D)'],
  ['น้ำเงิน (Blue)', '6', '×10⁶ (1M)', '0.25% (C)'],
  ['ม่วง (Violet)', '7', '×10⁷ (10M)', '0.1% (B)'],
  ['เทา (Gray)', '8', '×10⁸', '0.05% (A)'],
  ['ขาว (White)', '9', '×10⁹', '—'],
  ['ทอง (Gold)', '—', '×10⁻¹ (0.1)', '±5% (J)'],
  ['เงิน (Silver)', '—', '×10⁻² (0.01)', '±10% (K)'],
  ['ไม่มีสี (None)', '—', '—', '±20% (M)'],
];

const LESSON_CONTENT_SEEDS: Record<string, LessonContentSeed> = {
  'Resistor Color Codes': {
    strapline: 'บทเรียนที่ 1',
    summary:
      'ปูพื้นฐานให้เข้าใจตัวต้านทานแบบทะลุรู, ความสำคัญของรหัสสี และจดจำค่าตัวเลขของแต่ละสีอย่างเป็นระบบ สร้างทักษะที่จะใช้ในทุกบทเรียนถัดไป',
    heroStats: [
      { label: 'เวลาที่แนะนำ', value: '15 นาที', description: 'อ่านพร้อมจดบันทึกสั้น ๆ' },
      { label: 'หัวข้อหลัก', value: '3', description: 'โครงสร้าง, ตารางสี, เทคนิคจำ' },
      { label: 'แบบฝึกหัด', value: 'Mini Quiz', description: 'คำถาม 3 ข้อเพื่อทบทวนทันที' },
    ],
    objectives: [
      { icon: 'book-open', text: 'นิยามและบทบาทของตัวต้านทานในวงจร' },
      { icon: 'brain', text: 'รู้จักตัวตั้ง ตัวคูณ และแถบความคลาดเคลื่อน' },
      { icon: 'sparkles', text: 'ใช้เทคนิคช่วยจำลำดับสีได้จริง' },
    ],
    sections: [
      {
        slug: 'basics',
        title: '1.1 ความรู้เบื้องต้นเกี่ยวกับตัวต้านทาน',
        description:
          'ตัวต้านทาน (Resistor) คืออุปกรณ์พื้นฐานที่ทำหน้าที่จำกัดการไหลของกระแสไฟฟ้า วัดเป็นโอห์ม (Ω) และพบได้ในทุกวงจรอิเล็กทรอนิกส์',
        order: 1,
        content: [
          {
            type: 'card-grid',
            columns: 2,
            cards: [
              {
                title: 'หน้าที่หลัก',
                variant: 'accent',
                bullets: [
                  'จำกัดกระแสและแบ่งแรงดันในวงจร',
                  'ปกป้องอุปกรณ์อื่นจากกระแสเกิน',
                  'กำหนดค่าการทำงานของวงจร (bias, gain ฯลฯ)',
                ],
              },
              {
                title: 'ทำไมต้องมีรหัสสี?',
                variant: 'neutral',
                body:
                  'ตัวต้านทานแบบคาร์บอนมักมีขนาดเล็กจนพิมพ์ตัวเลขไม่ได้ จึงใช้แถบสีตามมาตรฐาน EIA เพื่อสื่อสารค่าความต้านทาน ตัวคูณ และความคลาดเคลื่อน',
              },
            ],
          },
        ],
      },
      {
        slug: 'color-table',
        title: '1.2 ตารางค่ารหัสสีพื้นฐาน',
        description:
          'จำตารางนี้ให้แม่นคือกุญแจสู่การอ่านตัวต้านทาน 4 แถบและ 5 แถบ แยกให้เห็นชัดทั้งตัวเลข, ตัวคูณ และค่าความคลาดเคลื่อน',
        order: 2,
        content: [
          {
            type: 'table',
            headers: ['รหัสสี', 'ค่าตัวตั้ง', 'ตัวคูณ', 'ความคลาดเคลื่อน'],
            rows: COLOR_CODE_TABLE,
          },
        ],
      },
      {
        slug: 'reading-techniques',
        title: '1.3 หลักการอ่านทิศทางและเทคนิคจำ',
        description:
          'อ่านจากด้านที่แถบแรกอยู่ชิดปลายที่สุด แถบสุดท้าย (Tolerance) จะมีช่องไฟมากกว่า และมักเป็นสีทองหรือเงิน',
        order: 3,
        content: [
          {
            type: 'card-grid',
            columns: 2,
            cards: [
              {
                title: 'หลีกเลี่ยงข้อผิดพลาด',
                variant: 'neutral',
                bullets: [
                  'ใช้ไฟสว่างและแว่นขยายเพื่อแยกสีใกล้เคียง',
                  'ตรวจสอบตำแหน่งแถบทอง/เงินก่อนเริ่มอ่าน',
                  'ยืนยันอีกครั้งด้วยการวัดจริงเมื่อจำเป็น',
                ],
              },
              {
                title: 'เทคนิคช่วยจำ',
                variant: 'cool',
                body:
                  'สร้างวลีจำง่าย ๆ เช่น “Bad Boys Run Over Yellow Gardenias Behind Victory Garden Walls” เพื่อช่วยจำสี 0-9',
              },
            ],
          },
        ],
      },
    ],
    quiz: {
      title: 'Mini Quiz: จำตารางสีได้แค่ไหน?',
      questions: [
        {
          prompt: 'สีใดแสดงค่าตัวเลข 4 และตัวคูณ ×10⁴?',
          options: ['น้ำเงิน', 'เหลือง', 'แดง', 'ส้ม'],
          answerIndex: 1,
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
          answerIndex: 0,
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
          answerIndex: 0,
          explanation:
            'ตรวจสอบทิศทางอ่านให้ถูกต้อง แถบสุดท้ายมักเป็น tolerance ซึ่งอยู่ห่างจากแถบอื่นเล็กน้อย',
        },
      ],
    },
    practice: {
      title: 'เริ่มฝึกอ่านค่าแบบเร็ว',
      description:
        'ใช้โหมด Quick Practice: เลือกประเภท FOUR_BAND หรือ FIVE_BAND เพื่อเริ่มทบทวนสีทันที',
      href: '/learn/self/practice/quick?type=FOUR_BAND',
      badge: 'เริ่มฝึก',
      highlight: 'เหมาะสำหรับการทบทวนหลังเรียนบท 1',
    },
    resources: [
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
  '4-Band Resistors': {
    strapline: 'บทเรียนที่ 2',
    summary:
      'ฝึกตีความตัวตั้ง, ตัวคูณ, และแถบทอง/เงินให้คล่อง พร้อมตัวอย่างสถานการณ์ที่เจอบ่อยในงานจริง',
    heroStats: [
      { label: 'เวลาที่แนะนำ', value: '20 นาที', description: 'อ่าน + ฝึกคำนวณตัวอย่าง' },
      { label: 'ตัวอย่างคำนวณ', value: '2', description: 'ทั้งค่ามาตรฐานและค่าขยาย' },
      { label: 'ภารกิจฝึก', value: 'Quick Practice', description: 'สุ่มโจทย์ 10 ข้อพร้อมอธิบายผลลัพธ์' },
    ],
    objectives: [
      { icon: 'clipboard-check', text: 'ตีความ 4 แถบ: 2 หลัก + ตัวคูณ + คลาดเคลื่อน' },
      { icon: 'target', text: 'คำนวณค่าความต้านทานจากรหัสสีได้อย่างมั่นใจ' },
      { icon: 'shield-check', text: 'ประเมินช่วงค่า (Min/Max) จาก tolerance' },
      { icon: 'play', text: 'ทดลองกับตัวอย่างที่ใช้จริงในภาคสนาม' },
    ],
    sections: [
      {
        slug: 'four-band-structure',
        title: '2.1 โครงสร้างและการกำหนดค่า',
        description:
          'ตัวต้านทาน 4 แถบอ่านค่าโดยใช้ 2 หลักแรกเป็นตัวตั้ง แถบที่ 3 เป็นตัวคูณ และแถบสุดท้ายสำหรับค่าความคลาดเคลื่อน',
        order: 1,
        content: [
          {
            type: 'card-grid',
            columns: 2,
            cards: [
              {
                title: 'ลำดับการอ่าน',
                variant: 'cool',
                bullets: [
                  'หาแถบที่อยู่ใกล้ขอบที่สุด (แถบที่ 1)',
                  'อ่านสองแถบแรกเพื่อสร้างตัวเลข 2 หลัก (10-99)',
                  'ใช้แถบที่ 3 เพื่อคูณด้วย 10ⁿ (เพิ่มศูนย์)',
                  'ประเมินค่าคลาดเคลื่อนจากแถบสุดท้ายทอง/เงิน',
                ],
              },
              {
                title: 'สูตรคำนวณ',
                variant: 'neutral',
                body: '(Digit₁ Digit₂) × Multiplier Ω — ตัวคูณคือ 10 ยกกำลังตามค่าสี เช่น แดง = 10², น้ำตาล = 10¹',
              },
            ],
          },
        ],
      },
      {
        slug: 'four-band-examples',
        title: '2.2 ตัวอย่างคำนวณที่ต้องเจอบ่อย',
        description: 'ลองไล่จากค่าหลักร้อยไปถึงหลักหมื่น พร้อมวิเคราะห์ Tolerance',
        order: 2,
        content: [
          {
            type: 'card-grid',
            columns: 2,
            cards: [
              {
                title: 'ส้ม-แดง-น้ำตาล-ทอง',
                subtitle: '3 • 2 × 10¹',
                body: 'ค่าความต้านทาน = 32 × 10 = 320 Ω (Tolerance ±5%)',
                variant: 'accent',
              },
              {
                title: 'เขียว-ดำ-ส้ม-เงิน',
                subtitle: '5 • 0 × 10³',
                body: 'ค่าความต้านทาน = 50 × 1,000 = 50,000 Ω หรือ 50 kΩ (Tolerance ±10%)',
                variant: 'neutral',
              },
            ],
          },
        ],
      },
      {
        slug: 'four-band-tolerance',
        title: '2.3 ค่าความคลาดเคลื่อนและช่วงที่ยอมรับได้',
        description:
          'ไม่ใช่ทุกตัวต้านทานที่มีค่าจริงตรงกับค่าบนรหัสสี ใช้แถบทอง/เงินเพื่อรู้ช่วงค่าที่รับได้',
        order: 3,
        content: [
          {
            type: 'card-grid',
            columns: 2,
            cards: [
              {
                title: 'ความหมายของ Tolerance',
                variant: 'neutral',
                bullets: ['ทอง (Gold) = ±5%', 'เงิน (Silver) = ±10%', 'ไม่มีแถบ = ±20%'],
              },
              {
                title: 'การคำนวณช่วงค่า',
                variant: 'cool',
                body:
                  'Min = Nominal − (Nominal × %Tolerance), Max = Nominal + (Nominal × %Tolerance)\nตัวอย่าง 100 Ω ±5% ⇒ 95 Ω ถึง 105 Ω',
              },
            ],
          },
        ],
      },
    ],
    quiz: {
      title: 'Quick Check: 4-Band Ready?',
      questions: [
        {
          prompt: 'รหัสสี แดง-ม่วง-น้ำตาล-ทอง ให้ค่าความต้านทานเท่าใด?',
          options: ['27 Ω ±5%', '270 Ω ±5%', '2.7 kΩ ±5%', '270 kΩ ±5%'],
          answerIndex: 1,
          explanation: 'แดง = 2, ม่วง = 7 ⇒ 27 × น้ำตาล (×10¹) = 270 Ω, ทอง = ±5%',
        },
        {
          prompt: 'ตัวอย่างใดที่บ่งบอกว่าคุณอ่านกลับด้าน?',
          options: [
            'เริ่มที่แถบทองแล้วได้ตัวเลขหลักกลาง',
            'ค่าคำนวณได้เกิน 10 MΩ',
            'ตัวคูณเป็นทองและ tolerance เป็นส้ม',
            'ได้ค่าต่ำกว่า 1 Ω เสมอ',
          ],
          answerIndex: 0,
          explanation: 'หากเริ่มอ่านจากแถบทอง แปลว่าเริ่มจากแถบ tolerance ควรพลิกกลับด้าน',
        },
        {
          prompt: 'การละเลยแถบตัวคูณจะเกิดผลอย่างไร?',
          options: [
            'ได้ค่าคลาดเคลื่อนที่ผิด',
            'ค่าที่คำนวณได้จะขยับ 10ⁿ เท่า',
            'ไม่มีผลเพราะตัวคูณไม่จำเป็น',
            'ทำให้แถบที่ 1 และ 2 ผิดตำแหน่ง',
          ],
          answerIndex: 1,
          explanation: 'แถบตัวคูณกำหนดจำนวนศูนย์—ละเลยจะทำให้ค่าคลาดเคลื่อนมาก',
        },
      ],
    },
    practice: {
      title: 'จำลองสถานการณ์จริง',
      description:
        'สุ่มโจทย์ 10 คำถามพร้อมดูคำอธิบายการถอดรหัสสีแบบละเอียด บันทึกผลลัพธ์ลงใน History อัตโนมัติ',
      href: '/learn/self/practice/quick?type=FOUR_BAND',
      badge: 'Practice Mode',
      highlight: 'เลือกป้อนคำตอบแบบ Multiple Choice หรือ Fill-in ได้',
    },
    resources: [
      {
        label: 'ตัวอย่างตัวต้านทาน 4 แถบ (PDF)',
        description: 'ชุดตัวอย่างพร้อมเฉลยสำหรับฝึกในห้องเรียน',
      },
    ],
  },
  '5-Band Resistors': {
    strapline: 'บทเรียนที่ 3',
    summary:
      'ต่อยอดจาก 4 แถบ เพิ่มตัวเลขหลักที่ 3 เพื่อความแม่นยำสูง รวมถึงค่า tolerance ที่ละเอียดขึ้น',
    heroStats: [
      { label: 'เวลาที่แนะนำ', value: '20-25 นาที', description: 'พร้อมทดลองคำนวณ 5 ตัวอย่าง' },
      { label: 'ระดับความแม่นยำ', value: '±0.1% ถึง ±2%', description: 'ใช้ในงานวัดผลที่ต้องการความละเอียด' },
      { label: 'ภารกิจฝึก', value: 'Preset FIVE_BAND', description: 'บันทึกคะแนนลง Dashboard' },
    ],
    objectives: [
      { icon: 'compass', text: 'รู้จักตำแหน่งตัวเลขหลักที่ 3 และตัวคูณ' },
      { icon: 'target', text: 'อ่านค่าได้รวดเร็วแม้ตัวเลขหลักยาวขึ้น' },
      { icon: 'award', text: 'เลือก tolerance ที่สอดคล้องกับงานแม่นยำสูง' },
      { icon: 'sparkles', text: 'ฝึกแยกความต่างระหว่าง 4 แถบกับ 5 แถบ' },
    ],
    sections: [
      {
        slug: 'five-band-structure',
        title: '3.1 โครงสร้างตัวต้านทาน 5 แถบ',
        description:
          'เพิ่มตัวเลขสำคัญ (Significant Digit) แถบที่ 3 ก่อนถึงตัวคูณ ⇒ ปรับค่าความต้านทานละเอียดถึงหลัก 0.1%',
        order: 1,
        content: [
          {
            type: 'card-grid',
            columns: 2,
            cards: [
              {
                title: 'ลำดับแถบ',
                variant: 'cool',
                bullets: [
                  'แถบ 1-3: ตัวเลขหลักแรก, ที่สอง, และที่สาม',
                  'แถบ 4: ตัวคูณ (Multiplier)',
                  'แถบ 5: ค่าคลาดเคลื่อน (Tolerance)',
                ],
              },
              {
                title: 'สูตรคำนวณ',
                variant: 'neutral',
                body: 'Resistance = (Digit₁ Digit₂ Digit₃) × Multiplier Ω — เช่น 482 × 10³ = 482 kΩ',
              },
            ],
          },
        ],
      },
      {
        slug: 'five-band-examples',
        title: '3.2 ตัวอย่างการตีความ 5 แถบ',
        description: 'สังเกตว่ามีตัวเลขหลักเพิ่มขึ้นอีกหนึ่งตัว แต่หลักการตีความยังเหมือนเดิม',
        order: 2,
        content: [
          {
            type: 'card-grid',
            columns: 2,
            cards: [
              {
                title: 'ม่วง-แดง-ดำ-เขียว-น้ำตาล',
                subtitle: '7 • 2 • 0 × 10⁵',
                body: 'ค่าความต้านทาน = 720 × 100,000 = 72 MΩ (Tolerance ±1%)',
                variant: 'accent',
              },
              {
                title: 'เหลือง-เทา-แดง-ส้ม-น้ำตาล',
                subtitle: '4 • 8 • 2 × 10³',
                body: 'ค่าความต้านทาน = 482 × 1,000 = 482 kΩ (Tolerance ±1%)',
                variant: 'neutral',
              },
            ],
          },
        ],
      },
      {
        slug: 'five-band-tolerance',
        title: '3.3 เลือกค่า Tolerance สำหรับงานจริง',
        description:
          'ตัวต้านทาน 5 แถบใช้ในงานที่ต้องการความแม่นยำสูง เช่น เครื่องมือวัดและงานควบคุม',
        order: 3,
        content: [
          {
            type: 'card-grid',
            columns: 2,
            cards: [
              {
                title: 'ความคลาดเคลื่อนยอดนิยม',
                variant: 'warm',
                bullets: [
                  'น้ำตาล = ±1% (F)',
                  'แดง = ±2% (G)',
                  'เขียว = ±0.5% (D)',
                  'น้ำเงิน = ±0.25% (C)',
                  'ม่วง = ±0.1% (B)',
                ],
              },
              {
                title: 'ทิปสำหรับมืออาชีพ',
                variant: 'neutral',
                body:
                  'จับคู่ค่า tolerance กับงาน: งานออดิโอหรืองานเซ็นเซอร์ → ±1% หรือต่ำกว่า งานทั่วไปในอุตสาหกรรมอาจใช้ ±2%',
              },
            ],
          },
        ],
      },
    ],
    quiz: {
      title: 'Precision Check: 5-Band Mastery',
      questions: [
        {
          prompt: 'รหัสสี น้ำเงิน-เทา-น้ำตาล-แดง-น้ำตาล แปลว่าอะไร?',
          options: ['681 Ω ±1%', '681 Ω ±2%', '6.81 kΩ ±1%', '68.1 kΩ ±1%'],
          answerIndex: 2,
          explanation:
            'น้ำเงิน = 6, เทา = 8, น้ำตาล = 1 ⇒ 681 × ตัวคูณแดง (×10²) = 68,100 Ω = 6.81 kΩ, น้ำตาล = ±1%',
        },
        {
          prompt: 'งานควบคุมอุณหภูมิที่ต้องการความแม่น ±0.5% ควรเลือกแถบใดเป็น tolerance?',
          options: ['น้ำตาล', 'แดง', 'เขียว', 'น้ำเงิน'],
          answerIndex: 2,
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
          answerIndex: 0,
          explanation: '5 แถบเพิ่มแถบ significant digit ที่สาม ทำให้ค่าความต้านทานละเอียดขึ้น',
        },
      ],
    },
    practice: {
      title: 'Practice Preset: FIVE_BAND',
      description:
        'เปิดโหมด Five-band พร้อมบันทึกผลลง Dashboard ทันที เหมาะสำหรับเตรียมตัวสอบภาคปฏิบัติ',
      href: '/learn/self/practice/quick?type=FIVE_BAND',
      badge: 'Advanced Mode',
      highlight: 'ใช้เวลาประมาณ 10-15 นาที',
    },
    resources: [
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
};

async function applyLessonStructuredContent(lessonId: string, seed: LessonContentSeed) {
  await db.lesson.update({
    where: { id: lessonId },
    data: {
      strapline: seed.strapline ?? null,
      summary: seed.summary ?? null,
    },
  });

  await db.lessonHeroStat.deleteMany({ where: { lessonId } });
  if (seed.heroStats?.length) {
    await db.lessonHeroStat.createMany({
      data: seed.heroStats.map((stat, index) => ({
        lessonId,
        label: stat.label,
        value: stat.value,
        description: stat.description ?? null,
        order: index,
      })),
    });
  }

  await db.lessonObjective.deleteMany({ where: { lessonId } });
  if (seed.objectives?.length) {
    await db.lessonObjective.createMany({
      data: seed.objectives.map((objective, index) => ({
        lessonId,
        icon: objective.icon ?? null,
        text: objective.text,
        order: index,
      })),
    });
  }

  await db.lessonSection.deleteMany({ where: { lessonId } });
  if (seed.sections?.length) {
    await db.lessonSection.createMany({
      data: seed.sections.map((section, index) => ({
        lessonId,
        slug: section.slug,
        title: section.title,
        description: section.description ?? null,
        order: section.order ?? index,
        content: section.content,
      })),
    });
  }

  await db.lessonQuizQuestion.deleteMany({ where: { lessonId } });
  if (seed.quiz?.questions?.length) {
    await db.lessonQuizQuestion.createMany({
      data: seed.quiz.questions.map((question, index) => ({
        lessonId,
        prompt: question.prompt,
        explanation: question.explanation ?? null,
        options: question.options,
        answerIndex: question.answerIndex,
        order: index,
      })),
    });
  }

  if (seed.practice) {
    await db.lessonPracticeLink.upsert({
      where: { lessonId },
      update: {
        title: seed.practice.title,
        description: seed.practice.description ?? null,
        href: seed.practice.href,
        badge: seed.practice.badge ?? null,
        highlight: seed.practice.highlight ?? null,
      },
      create: {
        lessonId,
        title: seed.practice.title,
        description: seed.practice.description ?? null,
        href: seed.practice.href,
        badge: seed.practice.badge ?? null,
        highlight: seed.practice.highlight ?? null,
      },
    });
  } else {
    await db.lessonPracticeLink.deleteMany({ where: { lessonId } });
  }

  await db.lessonResource.deleteMany({ where: { lessonId } });
  if (seed.resources?.length) {
    await db.lessonResource.createMany({
      data: seed.resources.map((resource, index) => ({
        lessonId,
        label: resource.label,
        description: resource.description ?? null,
        href: resource.href ?? null,
        order: index,
      })),
    });
  }
}
async function main() {
  console.log('🌱 Seeding database...');

  // Create 7 levels
  const levels = [
    {
      number: 1,
      name: 'Basic Colors',
      description: 'Introduction to resistor colors and basic color recognition',
      difficulty: 1,
      questionCount: 10,
      timeLimit: 10,
      passScore: 80,
      requiresLevel: null,
      type: 'FOUR_BAND' as const,
    },
    {
      number: 2,
      name: '4-Band Basics',
      description: 'Understanding 4-band structure and simple calculations',
      difficulty: 2,
      questionCount: 10,
      timeLimit: 15,
      passScore: 80,
      requiresLevel: 1,
      type: 'FOUR_BAND' as const,
    },
    {
      number: 3,
      name: '4-Band Practice',
      description: 'Common values and random combinations practice',
      difficulty: 3,
      questionCount: 10,
      timeLimit: 20,
      passScore: 80,
      requiresLevel: 2,
      type: 'FOUR_BAND' as const,
    },
    {
      number: 4,
      name: '5-Band Basics',
      description: 'Understanding 5-band structure and calculations',
      difficulty: 3,
      questionCount: 10,
      timeLimit: 15,
      passScore: 80,
      requiresLevel: 3,
      type: 'FIVE_BAND' as const,
    },
    {
      number: 5,
      name: '5-Band Practice',
      description: 'Common values and random combinations for 5-band',
      difficulty: 4,
      questionCount: 10,
      timeLimit: 20,
      passScore: 80,
      requiresLevel: 4,
      type: 'FIVE_BAND' as const,
    },
    {
      number: 6,
      name: 'Mixed Practice',
      description: 'Random 4-band or 5-band with harder combinations',
      difficulty: 4,
      questionCount: 10,
      timeLimit: 25,
      passScore: 80,
      requiresLevel: 5,
      type: 'FOUR_BAND' as const, // Can be either, handled in logic
    },
    {
      number: 7,
      name: 'Expert Mode',
      description: 'All possible combinations with time pressure',
      difficulty: 5,
      questionCount: 10,
      timeLimit: 30,
      passScore: 80,
      requiresLevel: 6,
      type: 'FOUR_BAND' as const, // Can be either, handled in logic
    },
  ];

  for (const level of levels) {
    await db.level.upsert({
      where: { number: level.number },
      update: level,
      create: level,
    });
    console.log(`✅ Level ${level.number}: ${level.name}`);
  }

  // Create test user (1@1.com / password: 1@1.com)
  const hashedPassword = await bcrypt.hash('1@1.com', 10);
  await db.user.upsert({
    where: { email: '1@1.com' },
    update: {
      password: hashedPassword,
    },
    create: {
      email: '1@1.com',
      name: 'Test User',
      password: hashedPassword,
      role: 'STUDENT',
      currentLevel: 1,
      levelsUnlocked: [1],
    },
  });
  console.log('✅ Test User: 1@1.com / password: 1@1.com');

  // Create Course Outline Modules and Lessons
  const courseIntro = await db.module.upsert({
    where: { id: 'course-intro' },
    update: {},
    create: {
      id: 'course-intro',
      title: 'Course Introduction',
      description: 'Introduction to the Resistor Learning Course',
      order: 0,
      isIntro: true,
    },
  });

  const introLessons = [
    { title: 'Course Introduction', order: 0 },
    { title: 'First Time in this Course', order: 1 },
    { title: 'Student Resources', order: 2 },
    { title: 'Download Resistor Template', order: 3 },
  ];

  for (const lesson of introLessons) {
    const existing = await db.lesson.findFirst({
      where: {
        moduleId: courseIntro.id,
        order: lesson.order,
      },
    });

    const lessonRecord = existing
      ? await db.lesson.update({
          where: { id: existing.id },
          data: { title: lesson.title },
        })
      : await db.lesson.create({
          data: {
            moduleId: courseIntro.id,
            title: lesson.title,
            content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. ${lesson.title}`,
            order: lesson.order,
          },
        });

    const structuredContent = LESSON_CONTENT_SEEDS[lessonRecord.title];
    if (structuredContent) {
      await applyLessonStructuredContent(lessonRecord.id, structuredContent);
    }
  }
  console.log('✅ Course Introduction Module');

  const module1 = await db.module.upsert({
    where: { id: 'module-1' },
    update: {},
    create: {
      id: 'module-1',
      title: 'Module 1: Understanding Resistors',
      description: 'Learn the basics of resistors',
      order: 1,
      isIntro: false,
    },
  });

  const module1Lessons = [
    { title: 'What is a Resistor?', order: 0 },
    { title: 'Resistor Types and Materials', order: 1 },
    { title: 'Resistor Color Codes', order: 2 },
    { title: 'Reading Color Bands', order: 3 },
  ];

  for (const lesson of module1Lessons) {
    const existing = await db.lesson.findFirst({
      where: {
        moduleId: module1.id,
        order: lesson.order,
      },
    });

    const lessonRecord = existing
      ? await db.lesson.update({
          where: { id: existing.id },
          data: { title: lesson.title },
        })
      : await db.lesson.create({
          data: {
            moduleId: module1.id,
            title: lesson.title,
            content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. ${lesson.title}`,
            order: lesson.order,
          },
        });

    const structuredContent = LESSON_CONTENT_SEEDS[lessonRecord.title];
    if (structuredContent) {
      await applyLessonStructuredContent(lessonRecord.id, structuredContent);
    }
  }
  console.log('✅ Module 1: Understanding Resistors');

  const module2 = await db.module.upsert({
    where: { id: 'module-2' },
    update: {},
    create: {
      id: 'module-2',
      title: 'Module 2: Color Code System',
      description: 'Master the color code system',
      order: 2,
      isIntro: false,
    },
  });

  const module2Lessons = [
    { title: '4-Band Resistors', order: 0 },
    { title: '5-Band Resistors', order: 1 },
    { title: '6-Band Resistors', order: 2 },
    { title: 'Tolerance and Temperature Coefficient', order: 3 },
  ];

  for (const lesson of module2Lessons) {
    const existing = await db.lesson.findFirst({
      where: {
        moduleId: module2.id,
        order: lesson.order,
      },
    });

    const lessonRecord = existing
      ? await db.lesson.update({
          where: { id: existing.id },
          data: { title: lesson.title },
        })
      : await db.lesson.create({
          data: {
            moduleId: module2.id,
            title: lesson.title,
            content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. ${lesson.title}`,
            order: lesson.order,
          },
        });

    const structuredContent = LESSON_CONTENT_SEEDS[lessonRecord.title];
    if (structuredContent) {
      await applyLessonStructuredContent(lessonRecord.id, structuredContent);
    }
  }
  console.log('✅ Module 2: Color Code System');

  const module3 = await db.module.upsert({
    where: { id: 'module-3' },
    update: {},
    create: {
      id: 'module-3',
      title: 'Module 3: Practical Applications',
      description: 'Apply your knowledge in real-world scenarios',
      order: 3,
      isIntro: false,
    },
  });

  const module3Lessons = [
    { title: 'Series and Parallel Circuits', order: 0 },
    { title: 'Ohm\'s Law Applications', order: 1 },
    { title: 'Power Rating', order: 2 },
    { title: 'Real-World Examples', order: 3 },
  ];

  for (const lesson of module3Lessons) {
    const existing = await db.lesson.findFirst({
      where: {
        moduleId: module3.id,
        order: lesson.order,
      },
    });

    const lessonRecord = existing
      ? await db.lesson.update({
          where: { id: existing.id },
          data: { title: lesson.title },
        })
      : await db.lesson.create({
          data: {
            moduleId: module3.id,
            title: lesson.title,
            content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. ${lesson.title}`,
            order: lesson.order,
          },
        });

    const structuredContent = LESSON_CONTENT_SEEDS[lessonRecord.title];
    if (structuredContent) {
      await applyLessonStructuredContent(lessonRecord.id, structuredContent);
    }
  }
  console.log('✅ Module 3: Practical Applications');

  console.log('✨ Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });

