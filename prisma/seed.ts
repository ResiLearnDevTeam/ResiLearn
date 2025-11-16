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
  'Course Overview & Expectations': {
    strapline: 'Course Introduction',
    summary:
      'ภาพรวมเส้นทางการเรียน ResiLearn ทั้งโหมด Self-Learning และ Classroom พร้อมแนวทางเตรียมตัวให้ได้ผลดีที่สุด',
    heroStats: [
      { label: 'ระยะเวลา', value: '10 นาที', description: 'อ่าน + ตั้งเป้าหมาย' },
      { label: 'โมดูล', value: '3', description: 'Intro → 4-Band → 5-Band' },
      { label: 'โหมด', value: 'Self & Classroom', description: 'ฝึกเดี่ยวหรือพร้อมครูได้' },
    ],
    objectives: [
      { icon: 'book-open', text: 'เข้าใจภาพรวมเส้นทางการเรียนและระดับความยาก' },
      { icon: 'sparkles', text: 'รู้ผลลัพธ์ที่คาดหวังจากแต่ละโมดูล' },
      { icon: 'target', text: 'ตั้งเป้าหมายส่วนตัวก่อนเริ่มฝึกปฏิบัติ' },
    ],
    sections: [
      {
        slug: 'course-structure',
        title: 'โครงสร้างหลักของคอร์ส',
        order: 0,
        content: [
          {
            type: 'card-grid',
            columns: 2,
            cards: [
              {
                title: 'Learning Path',
                variant: 'accent',
                bullets: [
                  'Intro → Module 1 → Module 2 → Module 3',
                  'Checkpoint quiz หลังจบแต่ละโมดูล',
                ],
              },
              {
                title: 'การประเมินผล',
                variant: 'neutral',
                bullets: [
                  'Quick Practice สำหรับฝึกซ้ำ',
                  'Lab รวมบททดสอบตอนท้ายคอร์ส',
                ],
              },
            ],
          },
        ],
      },
      {
        slug: 'success-habits',
        title: 'นิสัยเรียนให้ได้ผล',
        order: 1,
        content: [
          {
            type: 'card-grid',
            columns: 1,
            cards: [
              {
                title: 'Checklist',
                variant: 'neutral',
                bullets: [
                  'จัดเวลาฝึกสั้น ๆ 20 นาที 3 ครั้ง/สัปดาห์',
                  'ตรวจ Dashboard และ Reflection ทุกสัปดาห์',
                  'จดคำถามและส่งต่อให้ครูหรือ community',
                ],
              },
            ],
          },
        ],
      },
    ],
    resources: [
      {
        label: 'Course Syllabus (PDF)',
        description: 'สรุปหัวข้อและ checkpoint ทั้งคอร์ส',
        href: '/resources/course-syllabus.pdf',
      },
    ],
  },
  'Lab Setup & Equipment Checklist': {
    strapline: 'Course Introduction',
    summary: 'เตรียมอุปกรณ์ ซอฟต์แวร์ และพื้นที่ทำงานให้พร้อมสำหรับบทเรียนและแบบฝึกทุกโมดูล',
    heroStats: [
      { label: 'เวลาเตรียม', value: '20 นาที', description: 'ตรวจฮาร์ดแวร์ + ซอฟต์แวร์' },
      { label: 'อุปกรณ์หลัก', value: '6 รายการ', description: 'มัลติมิเตอร์, breadboard, resistor set ฯลฯ' },
      { label: 'รองรับ', value: 'Self & Lab', description: 'ใช้งานได้ทั้งบ้านและห้องทดลอง' },
    ],
    objectives: [
      { icon: 'layers', text: 'รู้จักอุปกรณ์ที่ต้องใช้ในแต่ละโมดูล' },
      { icon: 'shield-check', text: 'จัดพื้นที่ทำงานให้ปลอดภัยและเป็นระบบ' },
      { icon: 'compass', text: 'ตั้งค่าซอฟต์แวร์และบัญชีให้พร้อมก่อนเริ่มเรียน' },
    ],
    sections: [
      {
        slug: 'hardware',
        title: 'เช็กลิสต์ฮาร์ดแวร์',
        order: 0,
        content: [
          {
            type: 'card-grid',
            columns: 2,
            cards: [
              {
                title: 'จำเป็นต้องมี',
                variant: 'accent',
                bullets: [
                  'มัลติมิเตอร์ดิจิทัล',
                  'Breadboard + jumper wires',
                  'Resistor set 1/4W (4 และ 5 แถบ)',
                ],
              },
              {
                title: 'อุปกรณ์เสริม',
                variant: 'neutral',
                bullets: [
                  'แว่นขยายหรือกล้อง Macro',
                  'แถบเทียบสีหรือ color card',
                  'ถาดจัดเก็บชิ้นส่วนขนาดเล็ก',
                ],
              },
            ],
          },
        ],
      },
      {
        slug: 'workspace',
        title: 'จัดพื้นที่ทำงาน',
        order: 1,
        content: [
          {
            type: 'card-grid',
            columns: 2,
            cards: [
              {
                title: 'ความปลอดภัย',
                variant: 'neutral',
                bullets: [
                  'ใช้เสื่อกันไฟฟ้าสถิต (ESD Mat) หากมี',
                  'ห้ามวางของเหลวใกล้อุปกรณ์',
                  'เตรียมภาชนะสำหรับชิ้นส่วนชำรุด',
                ],
              },
              {
                title: 'ซอฟต์แวร์/บัญชี',
                variant: 'cool',
                bullets: [
                  'ล็อกอิน ResiLearn และเชื่อม Google Classroom',
                  'เตรียม Spreadsheet สำหรับบันทึกผล',
                  'ติดตั้ง Circuit Simulator (เช่น LTspice)',
                ],
              },
            ],
          },
        ],
      },
    ],
    resources: [
      {
        label: 'Lab Setup Checklist',
        description: 'ไฟล์ตรวจสอบอุปกรณ์ก่อนเริ่มบทเรียน',
        href: '/resources/lab-setup-checklist.pdf',
      },
    ],
  },
  'Student Resources & Communities': {
    strapline: 'Course Introduction',
    summary: 'แหล่งขอความช่วยเหลือและ network ที่แนะนำ เพื่อให้การเรียนราบรื่นทั้งเดี่ยวและทีม',
    heroStats: [
      { label: 'ช่องทางช่วยเหลือ', value: '4', description: 'Support, Mentor, Forum, Classroom' },
      { label: 'เวลาตอบกลับ', value: '< 24 ชม.', description: 'ทีมซัพพอร์ตตอบภายในวันทำการ' },
      { label: 'Mentor Hours', value: 'รายสัปดาห์', description: 'จองผ่าน Dashboard ได้ทันที' },
    ],
    objectives: [
      { icon: 'check-circle', text: 'รู้ว่าควรติดต่อที่ไหนเมื่อมีคำถามหรือปัญหา' },
      { icon: 'sparkles', text: 'เชื่อมต่อกับ community ที่สนับสนุนการเรียนรู้' },
      { icon: 'target', text: 'วางแผนติดตามความก้าวหน้าร่วมกับครูหรือ mentor' },
    ],
    sections: [
      {
        slug: 'support-channels',
        title: 'ช่องทางซัพพอร์ตหลัก',
        order: 0,
        content: [
          {
            type: 'card-grid',
            columns: 2,
            cards: [
              {
                title: 'ResiLearn Support',
                variant: 'accent',
                bullets: [
                  'อีเมล support@resilearn.com',
                  'Live chat ใน Dashboard (09:00-17:00 น.)',
                  'คลัง FAQ และบทความวิธีใช้',
                ],
              },
              {
                title: 'Mentor Hours',
                variant: 'neutral',
                bullets: [
                  'จองเวลา 1:1 ผ่านระบบ',
                  'บันทึกหัวข้อพูดคุยและสรุปหลัง session',
                ],
              },
            ],
          },
        ],
      },
      {
        slug: 'communities',
        title: 'Community ที่แนะนำ',
        order: 1,
        content: [
          {
            type: 'card-grid',
            columns: 2,
            cards: [
              {
                title: 'ResiLearn Discord',
                variant: 'cool',
                bullets: [
                  'ช่อง #color-band-challenge รายสัปดาห์',
                  'สรุปเทคนิคจาก mentor แบบสั้น',
                ],
              },
              {
                title: 'Resistor Readers TH (Facebook)',
                variant: 'neutral',
                bullets: [
                  'แชร์กรณีศึกษาและโจทย์น่าสนใจ',
                  'แจ้งข่าวกิจกรรมเวิร์กช็อปในประเทศ',
                ],
              },
            ],
          },
        ],
      },
    ],
    resources: [
      {
        label: 'Community Directory',
        description: 'ลิงก์รวม community และช่องทางติดต่อทั้งหมด',
        href: '/resources/community-directory.pdf',
      },
    ],
  },
  'Downloadable Resistor Toolkit': {
    strapline: 'Course Introduction',
    summary: 'รวบรวมไฟล์และ template ที่ใช้บ่อยสำหรับการฝึกอ่านค่าและบันทึกผล',
    heroStats: [
      { label: 'จำนวนไฟล์', value: '5', description: 'Poster, Worksheet, Template' },
      { label: 'อัปเดต', value: 'ไตรมาสละครั้ง', description: 'ปรับตาม feedback จากห้องเรียน' },
      { label: 'รูปแบบ', value: 'PDF / PNG / Sheets', description: 'รองรับทั้งพิมพ์และใช้งานดิจิทัล' },
    ],
    objectives: [
      { icon: 'layers', text: 'ดาวน์โหลดสื่อช่วยจำเพื่อเร่งความเข้าใจ' },
      { icon: 'play', text: 'ใช้ worksheet ควบคู่กับแบบฝึก Quick Practice' },
      { icon: 'clipboard-check', text: 'บันทึกผลฝึกอย่างมีระบบ' },
    ],
    sections: [
      {
        slug: 'visual-aids',
        title: 'สื่อช่วยจำ',
        order: 0,
        content: [
          {
            type: 'card-grid',
            columns: 2,
            cards: [
              {
                title: 'Resistor Color Wheel',
                variant: 'accent',
                bullets: [
                  'แสดงตัวเลขและตัวคูณของแต่ละสี',
                  'พิมพ์ติดผนังหรือใช้บน tablet ได้',
                ],
              },
              {
                title: 'Tolerance Strip',
                variant: 'neutral',
                bullets: [
                  'สรุป Gold / Silver / Brown / Red',
                  'ระบุช่วงค่าที่อนุญาตอย่างชัดเจน',
                ],
              },
            ],
          },
        ],
      },
      {
        slug: 'worksheets',
        title: 'Worksheet & Template',
        order: 1,
        content: [
          {
            type: 'card-grid',
            columns: 2,
            cards: [
              {
                title: '4-Band Worksheet',
                variant: 'neutral',
                bullets: [
                  'โจทย์ 15 ข้อพร้อมช่องอธิบายวิธีคิด',
                  'ใช้ส่งการบ้านหรือทำในห้องเรียน',
                ],
              },
              {
                title: '5-Band Worksheet',
                variant: 'cool',
                bullets: [
                  'รวมโจทย์ความแม่นยำสูง',
                  'ตารางบันทึก tolerance ให้กรอก',
                ],
              },
            ],
          },
        ],
      },
    ],
    resources: [
      {
        label: 'Resistor Toolkit (ZIP)',
        description: 'รวบรวมไฟล์ทั้งหมดในที่เดียว',
        href: '/downloads/resistor-toolkit.zip',
      },
      {
        label: 'Worksheet Spreadsheet',
        description: 'Template บันทึกผลใน Google Sheets',
        href: 'https://docs.google.com/spreadsheets/d/RESILEARN_WORKSHEET_TEMPLATE',
      },
    ],
  },
  'Resistor Fundamentals & Terminology': {
    strapline: 'Module 1 – Foundations',
    summary: 'พื้นฐานศัพท์และหลักการทำงานของตัวต้านทานก่อนเข้าสู่การถอดรหัสสี',
    heroStats: [
      { label: 'เวลาที่แนะนำ', value: '15 นาที', description: 'อ่าน + จดศัพท์สำคัญ' },
      { label: 'ศัพท์หลัก', value: '10 คำ', description: 'Resistance, Conductance, Power ฯลฯ' },
      { label: 'Mini Quiz', value: '3 ข้อ', description: 'ตรวจสอบความเข้าใจทันที' },
    ],
    objectives: [
      { icon: 'book-open', text: 'อธิบายความหมายของความต้านทานและหน่วยวัดได้' },
      { icon: 'brain', text: 'เข้าใจความสัมพันธ์ V = I × R' },
      { icon: 'activity', text: 'รู้เทคนิคการวัดค่าด้วยมัลติมิเตอร์เบื้องต้น' },
    ],
    sections: [
      {
        slug: 'key-terms',
        title: 'ศัพท์และสัญลักษณ์ที่ต้องรู้',
        order: 0,
        content: [
          {
            type: 'card-grid',
            columns: 3,
            cards: [
              {
                title: 'Resistance (Ω)',
                variant: 'accent',
                body: 'การต้านกระแสในตัวนำ เป็นหัวใจของการอ่านค่า',
              },
              {
                title: 'Conductance (S)',
                variant: 'neutral',
                body: 'ค่ากลับของความต้านทาน ใช้ในงานวิเคราะห์บางกรณี',
              },
              {
                title: 'Power Rating (W)',
                variant: 'neutral',
                body: 'กำลังสูงสุดที่ตัวต้านทานรับได้ก่อนเสียหาย',
              },
            ],
          },
        ],
      },
      {
        slug: 'ohms-law',
        title: 'กฎของโอมและการประยุกต์',
        order: 1,
        content: [
          {
            type: 'card-grid',
            columns: 2,
            cards: [
              {
                title: 'สูตรหลัก',
                variant: 'cool',
                bullets: [
                  'V = I × R ใช้ตรวจคำตอบจากรหัสสี',
                  'I = V / R ใช้ประเมินกระแสในวงจร',
                ],
              },
              {
                title: 'การใช้งาน',
                variant: 'neutral',
                bullets: [
                  'ตรวจสอบความเหมาะสมของค่าที่อ่านได้',
                  'ตั้งโจทย์ย้อนกลับเพื่อหา R จากแรงดันและกระแสเป้าหมาย',
                ],
              },
            ],
          },
        ],
      },
    ],
    quiz: {
      title: 'Mini Quiz: Fundamental Check',
      questions: [
        {
          prompt: 'หน่วยของ Conductance คืออะไร?',
          options: ['Ω', 'S', 'V', 'A'],
          answerIndex: 1,
          explanation: 'Conductance ใช้หน่วย Siemens (S)',
        },
        {
          prompt: 'เหตุใดต้องถอดตัวต้านทานออกจากวงจรก่อนวัดค่า?',
          options: [
            'เพื่อป้องกันมิเตอร์พัง',
            'เพราะค่าจะไม่ปนกับเส้นทางอื่นในวงจร',
            'เพื่อให้ค่าที่วัดได้เป็นศูนย์',
            'ไม่มีความจำเป็นต้องถอด',
          ],
          answerIndex: 1,
          explanation: 'เส้นทางขนานอื่นในวงจรทำให้ค่าที่วัดได้เพี้ยน',
        },
        {
          prompt: 'Power rating มีผลอย่างไร?',
          options: [
            'ทำให้วงจรทำงานช้าลง',
            'กำหนดความร้อนสูงสุดที่ตัวต้านทานรับได้',
            'ใช้กำหนด tolerance',
            'ไม่มีผลกับการออกแบบวงจร',
          ],
          answerIndex: 1,
          explanation: 'หากกำลังไฟเกินพิกัด ตัวต้านทานจะเสียหาย',
        },
      ],
    },
    practice: {
      title: 'Worksheet: Basic Calculations',
      description: 'ฝึกคำนวณจากสูตร V = I × R และบันทึกคำตอบลงในตาราง',
      href: '/resources/practice/fundamental-worksheet.pdf',
      badge: 'Worksheet',
    },
    resources: [
      {
        label: 'Terminology Cheat Sheet',
        description: 'สรุปศัพท์พื้นฐานพร้อมตัวอย่างสั้น ๆ',
        href: '/resources/terminology-cheatsheet.pdf',
      },
    ],
  },
  'Resistor Anatomy & Materials': {
    strapline: 'Module 1 – Foundations',
    summary: 'โครงสร้างและวัสดุของตัวต้านทาน พร้อมผลกระทบต่อความแม่นยำและความทนทาน',
    heroStats: [
      { label: 'ประเภทหลัก', value: '4', description: 'Carbon, Metal Film, Wirewound, SMD' },
      { label: 'เวลาศึกษา', value: '15 นาที', description: 'อ่าน + สำรวจตัวอย่างจริง' },
      { label: 'Mini Lab', value: 'Optional', description: 'เปรียบเทียบค่าแต่ละวัสดุ' },
    ],
    objectives: [
      { icon: 'layers', text: 'จำแนกชนิดตัวต้านทานจากโครงสร้างและวัสดุได้' },
      { icon: 'shield-check', text: 'เลือกวัสดุให้เหมาะกับงานและสภาพแวดล้อม' },
      { icon: 'activity', text: 'รู้สาเหตุการเสื่อมสภาพและวิธีป้องกัน' },
    ],
    sections: [
      {
        slug: 'structure',
        title: 'องค์ประกอบภายใน',
        order: 0,
        content: [
          {
            type: 'card-grid',
            columns: 2,
            cards: [
              {
                title: 'แกน (Core)',
                variant: 'neutral',
                body: 'มักใช้เซรามิกหรือฟิล์มเพื่อรองรับความร้อน',
              },
              {
                title: 'ชั้นนำไฟฟ้า',
                variant: 'accent',
                body: 'คาร์บอน, เมทัลฟิล์ม หรือขดลวด ขึ้นกับระดับความแม่นยำ',
              },
            ],
          },
        ],
      },
      {
        slug: 'materials',
        title: 'เปรียบเทียบวัสดุยอดนิยม',
        order: 1,
        content: [
          {
            type: 'table',
            headers: ['ชนิด', 'Tolerance', 'Power Rating', 'การใช้งาน'],
            rows: [
              ['Carbon Film', '±5% – ±10%', '0.25W - 1W', 'วงจรทั่วไป/การศึกษา'],
              ['Metal Film', '±0.5% – ±2%', '0.125W - 0.5W', 'เครื่องมือวัด, Audio'],
              ['Wirewound', '±0.1% – ±1%', '1W - 50W', 'งานกำลังสูง'],
              ['SMD Thin Film', '±0.1% – ±1%', '0.063W - 0.25W', 'อุปกรณ์ขนาดเล็ก'],
            ],
          },
        ],
      },
    ],
    practice: {
      title: 'Lab Task: Material Comparison',
      description: 'วัดค่าและบันทึกความคลาดเคลื่อนของตัวต้านทานแต่ละวัสดุ',
      href: '/resources/practice/material-comparison-lab.pdf',
      badge: 'Lab Task',
    },
    resources: [
      {
        label: 'Resistor Material Poster',
        description: 'สรุปคุณสมบัติเด่น/ด้อยของวัสดุยอดนิยม',
        href: '/resources/resistor-material-poster.pdf',
      },
    ],
  },
  'Resistor Color Codes': {
    strapline: 'Module 1 – Foundations',
    summary: 'ปูพื้นฐานการถอดรหัสสีและเทคนิคจำลำดับสีให้แม่นยำ',
    heroStats: [
      { label: 'เวลาที่แนะนำ', value: '15 นาที', description: 'อ่าน + ทบทวนตารางสี' },
      { label: 'ตารางสี', value: 'EIA', description: 'ครอบคลุมตัวตั้ง ตัวคูณ และ tolerance' },
      { label: 'Mini Quiz', value: '3 ข้อ', description: 'ทดสอบความจำทันที' },
    ],
    objectives: [
      { icon: 'book-open', text: 'รู้จักส่วนประกอบของตัวต้านทานและเหตุผลที่ต้องใช้แถบสี' },
      { icon: 'brain', text: 'จำลำดับสี 0-9 ได้' },
      { icon: 'sparkles', text: 'ใช้เทคนิคช่วยจำเพื่อป้องกันความสับสน' },
    ],
    sections: [
      {
        slug: 'basics',
        title: 'พื้นฐานตัวต้านทานและมาตรฐานรหัสสี',
        order: 0,
        content: [
          {
            type: 'card-grid',
            columns: 2,
            cards: [
              {
                title: 'หน้าที่ของตัวต้านทาน',
                variant: 'accent',
                bullets: [
                  'จำกัดกระแสและแบ่งแรงดัน',
                  'กำหนดค่าการทำงานของวงจร (bias, gain)',
                ],
              },
              {
                title: 'เหตุผลที่ใช้แถบสี',
                variant: 'neutral',
                body: 'ตัวต้านทานแบบ through-hole มีพื้นที่จำกัด จึงใช้แถบสีตามมาตรฐาน EIA',
              },
            ],
          },
        ],
      },
      {
        slug: 'color-table',
        title: 'ตารางค่ารหัสสี EIA',
        order: 1,
        content: [
          {
            type: 'table',
            headers: ['สี', 'ตัวตั้ง', 'ตัวคูณ', 'Tolerance'],
            rows: COLOR_CODE_TABLE,
          },
        ],
      },
    ],
    quiz: {
      title: 'Mini Quiz: จำตารางสีได้แค่ไหน?',
      questions: [
        {
          prompt: 'สีใดแทนตัวเลข 4 และตัวคูณ ×10⁴?',
          options: ['น้ำเงิน', 'เหลือง', 'แดง', 'ส้ม'],
          answerIndex: 1,
          explanation: 'สีเหลืองแทนเลข 4 และตัวคูณ ×10⁴',
        },
        {
          prompt: 'แถบทองหมายถึงอะไร?',
          options: [
            'ตัวคูณ ×10⁻¹ และ tolerance ±5%',
            'ตัวคูณ ×10¹ และ tolerance ±1%',
            'ใช้เฉพาะตัวต้านทาน 5 แถบ',
            'เพิ่มความแม่นยำ +5%',
          ],
          answerIndex: 0,
          explanation: 'สีทองใช้เป็นตัวคูณ 0.1 และบ่งบอก ±5%',
        },
        {
          prompt: 'ถ้าไม่มีแถบทอง/เงินอยู่ท้ายสุดควรระวังอะไร?',
          options: ['อ่านกลับด้าน', 'ตัวต้านทานปลอม', 'ค่าคลาดเคลื่อน ±0%', 'ต้องใช้เครื่องมือพิเศษ'],
          answerIndex: 0,
          explanation: 'ตรวจทิศทางอ่านให้ถูกต้องก่อนเริ่ม',
        },
      ],
    },
    practice: {
      title: 'Quick Practice: Color Bands',
      description: 'เริ่มฝึกอ่านสีด้วยโหมด QUICK FOUR_BAND',
      href: '/learn/self/practice/quick?type=FOUR_BAND',
      badge: 'Quick Practice',
    },
    resources: [
      {
        label: 'Color Code Card',
        description: 'บัตรอ้างอิงพกพา',
        href: '/resources/resistor-color-card.pdf',
      },
    ],
  },
  'Reading Color Bands Confidently': {
    strapline: 'Module 1 – Foundations',
    summary: 'เทคนิคอ่านแถบสีอย่างเป็นขั้นตอนและตรวจสอบความถูกต้องก่อนบันทึก',
    heroStats: [
      { label: 'เวลาฝึก', value: '20 นาที', description: 'สาธิต + ฝึกจับเวลา' },
      { label: 'เทคนิคหลัก', value: '5', description: 'Workflow + เครื่องมือช่วย' },
      { label: 'เป้าหมาย', value: '< 5 วินาที/ชิ้น', description: 'อ่านค่าได้รวดเร็วและแม่นยำ' },
    ],
    objectives: [
      { icon: 'sparkles', text: 'อ่านสีได้แม่นยำภายในเวลาที่กำหนด' },
      { icon: 'play', text: 'ใช้เครื่องมือเสริมเพื่อช่วยตรวจสอบ' },
      { icon: 'target', text: 'พัฒนา workflow ตรวจซ้ำก่อนบันทึกผล' },
    ],
    sections: [
      {
        slug: 'workflow',
        title: 'ขั้นตอนการอ่านแบบ 4 Step',
        order: 0,
        content: [
          {
            type: 'card-grid',
            columns: 1,
            cards: [
              {
                title: 'Workflow',
                variant: 'neutral',
                bullets: [
                  'จัดแถบทอง/เงินไว้ด้านขวาก่อนเสมอ',
                  'อ่านสองแถบแรกและออกเสียงตัวเลข',
                  'คูณด้วยตัวคูณและเลือกหน่วย',
                  'ให้เพื่อนหรือมิเตอร์ยืนยันก่อนบันทึก',
                ],
              },
            ],
          },
        ],
      },
      {
        slug: 'tools',
        title: 'เครื่องมือที่ช่วยให้แม่นยำ',
        order: 1,
        content: [
          {
            type: 'card-grid',
            columns: 2,
            cards: [
              {
                title: 'การมองเห็น',
                variant: 'accent',
                bullets: [
                  'กล้องมือถือโหมด Macro',
                  'โคมไฟ daylight 5000K',
                ],
              },
              {
                title: 'ดิจิทัล',
                variant: 'neutral',
                bullets: [
                  'แอป Color Reader',
                  'Spreadsheet บันทึกเวลาและผลลัพธ์',
                ],
              },
            ],
          },
        ],
      },
    ],
    practice: {
      title: 'จับเวลาอ่าน 20 ชิ้น',
      description: 'ใช้ QUICK FOUR_BAND และบันทึกเวลาลง Reading Log',
      href: '/learn/self/practice/quick?type=FOUR_BAND',
      badge: 'Quick Practice',
      highlight: 'เป้าหมายเฉลี่ย < 5 วินาทีต่อชิ้น',
    },
    resources: [
      {
        label: 'Reading Log Template',
        description: 'Worksheet สำหรับบันทึกเวลาฝึก',
        href: '/resources/reading-log-template.pdf',
      },
    ],
  },
  '4-Band Structure & Value Assignment': {
    strapline: 'Module 2 – 4-Band Mastery',
    summary: 'เข้าใจลำดับการอ่านตัวต้านทาน 4 แถบ พร้อมการตีความ tolerance',
    heroStats: [
      { label: 'เวลาที่แนะนำ', value: '20 นาที', description: 'อ่าน + ฝึกคำนวณตัวอย่าง' },
      { label: 'ตัวอย่าง', value: '2', description: 'ค่ามาตรฐานและค่าขยาย' },
      { label: 'แบบฝึก', value: 'Quick Practice', description: 'สุ่มโจทย์ 10 ข้อ' },
    ],
    objectives: [
      { icon: 'clipboard-check', text: 'อ่าน 4 แถบ: 2 หลัก + ตัวคูณ + tolerance' },
      { icon: 'target', text: 'คำนวณค่าความต้านทานได้อย่างมั่นใจ' },
      { icon: 'shield-check', text: 'ประเมินช่วงค่าที่อนุญาต (Min/Max)' },
    ],
    sections: [
      {
        slug: 'structure',
        title: 'ลำดับการอ่าน 4 แถบ',
        order: 0,
        content: [
          {
            type: 'card-grid',
            columns: 2,
            cards: [
              {
                title: 'ขั้นตอน',
                variant: 'cool',
                bullets: [
                  'หาแถบที่อยู่ใกล้ขอบที่สุด (แถบ 1)',
                  'อ่านสองแถบแรกเป็นตัวเลขหลัก',
                  'ใช้แถบที่ 3 เป็นตัวคูณ 10ⁿ',
                  'แถบท้ายทอง/เงินคือ tolerance',
                ],
              },
              {
                title: 'สูตรคำนวณ',
                variant: 'neutral',
                body: '(Digit₁ Digit₂) × Multiplier Ω',
              },
            ],
          },
        ],
      },
      {
        slug: 'examples',
        title: 'ตัวอย่างคำนวณ',
        order: 1,
        content: [
          {
            type: 'card-grid',
            columns: 2,
            cards: [
              {
                title: 'ส้ม-แดง-น้ำตาล-ทอง',
                variant: 'accent',
                body: '32 × 10 = 320 Ω (±5%)',
              },
              {
                title: 'เขียว-ดำ-ส้ม-เงิน',
                variant: 'neutral',
                body: '50 × 1,000 = 50 kΩ (±10%)',
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
          prompt: 'รหัสสี แดง-ม่วง-น้ำตาล-ทอง ให้ค่าเท่าไร?',
          options: ['27 Ω ±5%', '270 Ω ±5%', '2.7 kΩ ±5%', '270 kΩ ±5%'],
          answerIndex: 1,
          explanation: '27 × 10¹ = 270 Ω และทอง = ±5%',
        },
        {
          prompt: 'ตัวคูณสีส้มหมายถึงอะไร?',
          options: ['×10¹', '×10²', '×10³', '×10⁴'],
          answerIndex: 2,
          explanation: 'สีส้มคือ ×10³',
        },
      ],
    },
    practice: {
      title: 'Quick Practice: FOUR_BAND',
      description: 'สุ่มโจทย์ 10 ข้อพร้อมเฉลยอธิบาย',
      href: '/learn/self/practice/quick?type=FOUR_BAND',
      badge: 'Practice Mode',
    },
    resources: [
      {
        label: 'ตัวอย่าง 4 แถบ (PDF)',
        description: 'ชุดตัวอย่างพร้อมเฉลย',
      },
    ],
  },
  '4-Band Calculation Workshop': {
    strapline: 'Module 2 – 4-Band Mastery',
    summary: 'ฝึกคำนวณแบบเป็นขั้นตอนและวิเคราะห์ข้อผิดพลาดที่พบบ่อย',
    heroStats: [
      { label: 'แบบฝึก', value: '15 ข้อ', description: 'แบ่ง 3 ระดับความยาก' },
      { label: 'เวลาฝึก', value: '25 นาที', description: 'รวมการตรวจคำตอบ' },
      { label: 'ภารกิจ', value: 'Worksheet', description: 'ส่งผ่าน Classroom หรือ mentor' },
    ],
    objectives: [
      { icon: 'clipboard-check', text: 'แก้โจทย์ 4 แถบได้ครบกระบวน' },
      { icon: 'target', text: 'ตรวจจับข้อผิดพลาดที่เจอบ่อย' },
      { icon: 'play', text: 'ฝึก workflow การตรวจคำตอบอย่างเป็นระบบ' },
    ],
    sections: [
      {
        slug: 'warm-up',
        title: 'Warm-Up Set',
        order: 0,
        content: [
          {
            type: 'card-grid',
            columns: 1,
            cards: [
              {
                title: 'โจทย์ 3 ระดับ',
                variant: 'neutral',
                bullets: [
                  'ข้อ 1-5: สี → ตัวเลข',
                  'ข้อ 6-10: ตัวเลข → หาแถบสี',
                  'ข้อ 11-15: โจทย์ผสมพร้อม tolerance',
                ],
              },
            ],
          },
        ],
      },
      {
        slug: 'mistakes',
        title: 'ข้อผิดพลาดยอดนิยม',
        order: 1,
        content: [
          {
            type: 'card-grid',
            columns: 2,
            cards: [
              {
                title: 'สับสนตัวคูณ',
                variant: 'warm',
                bullets: ['จำสีผิด', 'ลืมแปลงเป็น kΩ / MΩ'],
              },
              {
                title: 'อ่านกลับด้าน',
                variant: 'neutral',
                bullets: ['เริ่มอ่านจากแถบทอง', 'ช่องไฟ tolerance ห่างกว่าปกติ'],
              },
            ],
          },
        ],
      },
    ],
    practice: {
      title: 'Worksheet: 4-Band Workshop',
      description: 'กรอก worksheet และส่งให้ครูตรวจ',
      href: '/resources/practice/4band-workshop.pdf',
      badge: 'Assignment',
    },
    resources: [
      {
        label: '4-Band Practice Set',
        description: 'รวมโจทย์ฝึกพร้อมเฉลย',
        href: '/resources/4band-practice-set.pdf',
      },
    ],
  },
  '4-Band Tolerance & Quality Control': {
    strapline: 'Module 2 – 4-Band Mastery',
    summary: 'เจาะลึกค่าความคลาดเคลื่อนและการทดสอบคุณภาพตัวต้านทาน 4 แถบ',
    heroStats: [
      { label: 'Tolerance', value: '±1% ถึง ±20%', description: 'รู้จักช่วงค่าทั่วไป' },
      { label: 'Lab Test', value: '2 ขั้น', description: 'วัดซ้ำ + อบร้อน' },
      { label: 'Deliverable', value: 'Quality Report', description: 'รายงานสรุปผลการทดสอบ' },
    ],
    objectives: [
      { icon: 'shield-check', text: 'คำนวณช่วงค่าที่อนุญาตได้' },
      { icon: 'activity', text: 'ออกแบบการทดสอบคุณภาพอย่างง่าย' },
      { icon: 'clipboard-check', text: 'บันทึกผลอย่างมืออาชีพ' },
    ],
    sections: [
      {
        slug: 'tolerance-table',
        title: 'ค่า tolerance ยอดนิยม',
        order: 0,
        content: [
          {
            type: 'table',
            headers: ['สี', 'Tolerance', 'การใช้งาน'],
            rows: [
              ['ทอง', '±5%', 'วงจรทั่วไป, งานฝึก'],
              ['เงิน', '±10%', 'งานที่ยอมรับความคลาดเคลื่อนได้สูง'],
              ['น้ำตาล', '±1%', 'เครื่องมือวัดและงานควบคุม'],
              ['แดง', '±2%', 'งานอุตสาหกรรม'],
            ],
          },
        ],
      },
      {
        slug: 'qa-steps',
        title: 'ขั้นตอนการทดสอบคุณภาพ',
        order: 1,
        content: [
          {
            type: 'card-grid',
            columns: 1,
            cards: [
              {
                title: 'Flow',
                variant: 'neutral',
                bullets: [
                  'คัดตัวอย่าง 10 ชิ้นจากล็อตเดียวกัน',
                  'วัดค่าที่อุณหภูมิห้องและบันทึกลง spreadsheet',
                  'อบร้อน 70°C 10 นาทีแล้ววัดซ้ำ',
                ],
              },
            ],
          },
        ],
      },
    ],
    practice: {
      title: 'Mini QA Lab',
      description: 'บันทึกผลการทดสอบ tolerance และสรุปรายงานสั้น',
      href: '/resources/practice/4band-tolerance-lab.pdf',
      badge: 'Mini Lab',
    },
    resources: [
      {
        label: 'Quality Report Template',
        description: 'โครงสร้างรายงานผลทดสอบ',
        href: '/resources/quality-report-template.docx',
      },
    ],
  },
  'Troubleshooting Common 4-Band Mistakes': {
    strapline: 'Module 2 – 4-Band Mastery',
    summary: 'รวมข้อผิดพลาดที่พบบ่อยและแนวทางป้องกันก่อนส่งงาน',
    heroStats: [
      { label: 'Checklist', value: '8 ข้อ', description: 'ตรวจทุกครั้งก่อนส่งงาน' },
      { label: 'เวลาฝึก', value: '20 นาที', description: 'แก้โจทย์ error-based' },
      { label: 'โหมด', value: 'Self + Classroom', description: 'ประยุกต์ใช้ได้ทั้งเดี่ยวและทีม' },
    ],
    objectives: [
      { icon: 'target', text: 'ระบุและแก้ไขข้อผิดพลาดที่พบบ่อย' },
      { icon: 'sparkles', text: 'พัฒนาความแม่นยำด้วยการฝึกจับผิด' },
      { icon: 'shield-check', text: 'สร้างนิสัย double-check ก่อนส่งงาน' },
    ],
    sections: [
      {
        slug: 'error-list',
        title: 'ข้อผิดพลาดยอดนิยม',
        order: 0,
        content: [
          {
            type: 'card-grid',
            columns: 1,
            cards: [
              {
                title: 'จุดที่ต้องระวัง',
                variant: 'warm',
                bullets: [
                  'อ่านกลับด้านเพราะเริ่มจากแถบทอง',
                  'จำสีแดง/น้ำตาลสลับ',
                  'ลืมเปลี่ยนหน่วยเป็น kΩ / MΩ',
                ],
              },
            ],
          },
        ],
      },
      {
        slug: 'cases',
        title: 'กรณีศึกษา',
        order: 1,
        content: [
          {
            type: 'card-grid',
            columns: 2,
            cards: [
              {
                title: 'Case A: อ่านกลับด้าน',
                variant: 'accent',
                body: 'รายงาน 470 Ω แทน 47 kΩ เพราะอ่านจากแถบทอง',
              },
              {
                title: 'Case B: หน่วยผิด',
                variant: 'neutral',
                body: 'บันทึก 4.7 Ω แทน 4.7 kΩ ทำให้สั่งซื้อผิดล็อต',
              },
            ],
          },
        ],
      },
    ],
    practice: {
      title: 'Error Spotting Drill',
      description: 'ตอบว่าข้อผิดพลาดในแต่ละโจทย์คืออะไรและแก้อย่างไร',
      href: '/resources/practice/4band-error-drill.pdf',
      badge: 'Drill',
    },
    resources: [
      {
        label: 'Troubleshooting Checklist',
        description: 'ไฟล์ตรวจงานก่อนส่ง',
        href: '/resources/troubleshooting-checklist.pdf',
      },
    ],
  },
  '5-Band Structure & Precision Concepts': {
    strapline: 'Module 3 – Advanced Precision',
    summary: 'ต่อยอดจาก 4 แถบ เพิ่มตัวเลขหลักที่สามและเลือก tolerance สำหรับงานแม่นยำสูง',
    heroStats: [
      { label: 'เวลาที่แนะนำ', value: '20 นาที', description: 'อ่าน + ฝึกคำนวณ' },
      { label: 'ระดับความแม่นยำ', value: '±0.1% - ±2%', description: 'ใช้ในงานเครื่องมือวัด' },
      { label: 'แบบฝึก', value: 'Preset FIVE_BAND', description: 'Quick Practice ขั้นสูง' },
    ],
    objectives: [
      { icon: 'compass', text: 'อ่านค่า 5 แถบได้อย่างคล่องแคล่ว' },
      { icon: 'target', text: 'เปรียบเทียบ 4 แถบและ 5 แถบได้ถูกต้อง' },
      { icon: 'award', text: 'เลือก tolerance ให้เหมาะกับงานแม่นยำสูง' },
    ],
    sections: [
      {
        slug: 'structure',
        title: 'โครงสร้าง 5 แถบ',
        order: 0,
        content: [
          {
            type: 'card-grid',
            columns: 2,
            cards: [
              {
                title: 'ลำดับแถบ',
                variant: 'cool',
                bullets: [
                  'แถบ 1-3: ตัวเลขหลักแรก/สอง/สาม',
                  'แถบ 4: ตัวคูณ',
                  'แถบ 5: ค่าคลาดเคลื่อน',
                ],
              },
              {
                title: 'สูตร',
                variant: 'neutral',
                body: '(Digit₁ Digit₂ Digit₃) × Multiplier Ω',
              },
            ],
          },
        ],
      },
      {
        slug: 'examples',
        title: 'ตัวอย่างค่าจริง',
        order: 1,
        content: [
          {
            type: 'card-grid',
            columns: 2,
            cards: [
              {
                title: 'ม่วง-แดง-ดำ-เขียว-น้ำตาล',
                variant: 'accent',
                body: '720 × 100,000 = 72 MΩ (±1%)',
              },
              {
                title: 'เหลือง-เทา-แดง-ส้ม-น้ำตาล',
                variant: 'neutral',
                body: '482 × 1,000 = 482 kΩ (±1%)',
              },
            ],
          },
        ],
      },
    ],
    quiz: {
      title: 'Precision Check: 5-Band',
      questions: [
        {
          prompt: 'น้ำเงิน-เทา-น้ำตาล-แดง-น้ำตาล แปลว่าอะไร?',
          options: ['681 Ω ±1%', '6.81 kΩ ±1%', '681 Ω ±2%', '68.1 kΩ ±1%'],
          answerIndex: 1,
          explanation: '681 × 10² = 6.81 kΩ และน้ำตาล = ±1%',
        },
        {
          prompt: 'Tolerance ±0.5% ใช้สีใด?',
          options: ['น้ำตาล', 'แดง', 'เขียว', 'น้ำเงิน'],
          answerIndex: 2,
          explanation: 'สีเขียว = ±0.5%',
        },
      ],
    },
    practice: {
      title: 'Quick Practice: FIVE_BAND',
      description: 'สุ่มโจทย์ 5 แถบและบันทึกผลลง Dashboard',
      href: '/learn/self/practice/quick?type=FIVE_BAND',
      badge: 'Advanced Mode',
    },
    resources: [
      {
        label: 'Precision Checklist',
        description: 'ใช้เลือก tolerance ให้เหมาะกับงาน',
      },
    ],
  },
  '5-Band Calculation Workshop': {
    strapline: 'Module 3 – Advanced Precision',
    summary: 'เวิร์กช็อปคำนวณตัวต้านทาน 5 แถบพร้อม workflow ตรวจคำตอบ',
    heroStats: [
      { label: 'แบบฝึก', value: '18 ข้อ', description: 'แบ่งตามระดับการใช้งาน' },
      { label: 'เวลาฝึก', value: '25 นาที', description: 'รวมการตรวจสอบคำตอบ' },
      { label: 'Mini Quiz', value: '2 ข้อ', description: 'เช็กความเข้าใจก่อนลงภาคสนาม' },
    ],
    objectives: [
      { icon: 'clipboard-check', text: 'ตีความค่า 3 หลักและตัวคูณได้อย่างมั่นใจ' },
      { icon: 'target', text: 'ลดข้อผิดพลาดการกรอกค่าลงรายงาน' },
      { icon: 'play', text: 'ใช้ worksheet และ script ช่วยตรวจคำตอบ' },
    ],
    sections: [
      {
        slug: 'sets',
        title: 'ชุดแบบฝึก 3 ระดับ',
        order: 0,
        content: [
          {
            type: 'card-grid',
            columns: 3,
            cards: [
              { title: 'พื้นฐาน', variant: 'neutral', body: 'สีเรียงง่าย + ตัวคูณ 10⁰-10³' },
              { title: 'ระดับกลาง', variant: 'cool', body: 'ตัวคูณ 10⁴-10⁵ + tolerance 1%' },
              { title: 'ระดับสูง', variant: 'accent', body: 'กรอกค่าใน BOM พร้อมเลือก tolerance' },
            ],
          },
        ],
      },
      {
        slug: 'review',
        title: 'Workflow ตรวจคำตอบ',
        order: 1,
        content: [
          {
            type: 'card-grid',
            columns: 1,
            cards: [
              {
                title: 'ขั้นตอน',
                variant: 'neutral',
                bullets: [
                  'แปลงสีเป็นตัวเลขสามหลัก',
                  'คูณด้วยตัวคูณและแปลงหน่วย',
                  'ระบุ tolerance และช่วงค่าที่อนุญาต',
                ],
              },
            ],
          },
        ],
      },
    ],
    quiz: {
      title: '5-Band Calculation Check',
      questions: [
        {
          prompt: 'น้ำตาล-เขียว-เทา-ส้ม-แดง ให้ค่าเท่าไร?',
          options: ['158 Ω ±2%', '158 kΩ ±2%', '1.58 kΩ ±1%', '1.58 MΩ ±2%'],
          answerIndex: 1,
          explanation: '158 × 10³ = 158 kΩ และแดง = ±2%',
        },
        {
          prompt: 'Tolerance ±1% ใช้สีใด?',
          options: ['น้ำตาล', 'เขียว', 'ทอง', 'เงิน'],
          answerIndex: 0,
          explanation: 'สีน้ำตาล = ±1%',
        },
      ],
    },
    practice: {
      title: 'Worksheet: 5-Band Workshop',
      description: 'กรอก worksheet และอัปโหลดผ่าน Classroom',
      href: '/resources/practice/5band-workshop.pdf',
      badge: 'Assignment',
    },
    resources: [
      {
        label: '5-Band Practice Set',
        description: 'รวมโจทย์พร้อมเฉลย',
        href: '/resources/5band-practice-set.pdf',
      },
    ],
  },
  'Selecting the Right Tolerance': {
    strapline: 'Module 3 – Advanced Precision',
    summary: 'เลือก tolerance ให้เหมาะกับงาน เช่น ระบบเสียง เซ็นเซอร์ และงานควบคุม',
    heroStats: [
      { label: 'กรณีศึกษา', value: '5', description: 'Audio, Sensor, Power, Control, Hobby' },
      { label: 'Decision Tool', value: 'Matrix', description: 'ช่วยตัดสินใจได้เร็ว' },
      { label: 'เวลาศึกษา', value: '15 นาที', description: 'อ่าน + วิเคราะห์กรณีตัวอย่าง' },
    ],
    objectives: [
      { icon: 'target', text: 'จับคู่ tolerance กับงานแต่ละประเภทได้' },
      { icon: 'shield-check', text: 'ลดความเสี่ยงจากการเลือกค่าผิด' },
      { icon: 'activity', text: 'สร้าง decision matrix สำหรับทีม' },
    ],
    sections: [
      {
        slug: 'use-cases',
        title: 'กรณีศึกษา',
        order: 0,
        content: [
          {
            type: 'card-grid',
            columns: 2,
            cards: [
              {
                title: 'Audio Circuit',
                variant: 'neutral',
                bullets: ['เลือก ±1% หรือ ±2% เพื่อให้ฟิลเตอร์คงที่'],
              },
              {
                title: 'Sensor Interface',
                variant: 'cool',
                bullets: ['แนะนำ ±0.5% - ±1% เพื่อลดความเพี้ยน'],
              },
              {
                title: 'Power Supply',
                variant: 'warm',
                bullets: ['±5% ใช้ได้ แต่ต้องคุมอุณหภูมิ'],
              },
              {
                title: 'Prototype / Hobby',
                variant: 'accent',
                bullets: ['±5% หรือ ±10% ลดต้นทุน'],
              },
            ],
          },
        ],
      },
      {
        slug: 'decision-matrix',
        title: 'ตารางตัดสินใจ',
        order: 1,
        content: [
          {
            type: 'table',
            headers: ['ปัจจัย', 'คำถามที่ต้องตอบ', 'คำแนะนำ'],
            rows: [
              ['ความแม่นยำ', 'ถ้าคลาดเคลื่อน ±5% วงจรยังทำงานได้หรือไม่', 'ถ้าไม่ได้ → เลือก ±1%'],
              ['งบประมาณ', 'ต้นทุน ±1% อยู่ในงบหรือไม่', 'ถ้าเกิน → ลอง ±2%'],
              ['อุณหภูมิ', 'สภาพแวดล้อมเปลี่ยนแปลงสูงหรือไม่', 'ถ้ามี → ตรวจ coefficient เพิ่มเติม'],
            ],
          },
        ],
      },
    ],
    practice: {
      title: 'Decision Matrix Workshop',
      description: 'กรอก matrix สำหรับโปรเจ็กต์แล้วแชร์ให้ mentor ตรวจ',
      href: '/resources/practice/tolerance-decision-matrix.xlsx',
      badge: 'Workshop',
    },
    resources: [
      {
        label: 'Tolerance Decision Matrix',
        description: 'ไฟล์ Excel สำหรับตัดสินใจ',
        href: '/resources/tolerance-decision-matrix.xlsx',
      },
    ],
  },
  'Precision Lab: Mixed Band Practice': {
    strapline: 'Module 3 – Advanced Precision',
    summary: 'ปิดคอร์สด้วยการฝึกแบบผสม 4/5 แถบ พร้อมบันทึกเวลาและความแม่นยำ',
    heroStats: [
      { label: 'จำนวนชิ้น', value: '30', description: '4-Band 15 + 5-Band 15' },
      { label: 'เกณฑ์ผ่าน', value: '≥ 90%', description: 'ความแม่นยำ 90% และเวลาเฉลี่ย < 30 วินาที' },
      { label: 'โหมด', value: 'Quick + Custom', description: 'ใช้ Quick Practice สลับกับชิ้นจริง' },
    ],
    objectives: [
      { icon: 'play', text: 'ฝึกอ่านค่าในสถานการณ์จริงแบบผสม' },
      { icon: 'activity', text: 'บันทึกเวลาและคะแนนเพื่อตรวจความพร้อม' },
      { icon: 'award', text: 'เตรียมตัวสอบภาคปฏิบัติหรือการประเมินปลายคอร์ส' },
    ],
    sections: [
      {
        slug: 'setup',
        title: 'เตรียมห้อง Lab',
        order: 0,
        content: [
          {
            type: 'card-grid',
            columns: 1,
            cards: [
              {
                title: 'สิ่งที่ต้องเตรียม',
                variant: 'neutral',
                bullets: [
                  'สุ่มตัวต้านทาน 30 ชิ้น (4 และ 5 แถบอย่างละ 15)',
                  'ตั้งเวลาและเตรียม worksheet',
                  'เตรียมกล้องหรืออุปกรณ์บันทึกเพื่อทบทวน',
                ],
              },
            ],
          },
        ],
      },
      {
        slug: 'metrics',
        title: 'เกณฑ์วัดผล',
        order: 1,
        content: [
          {
            type: 'card-grid',
            columns: 2,
            cards: [
              {
                title: 'ความแม่นยำ',
                variant: 'accent',
                body: '(จำนวนถูก / 30) × 100%',
              },
              {
                title: 'เวลาเฉลี่ย',
                variant: 'cool',
                body: 'เวลารวม ÷ 30 เพื่อดูความเร็วในการอ่าน',
              },
            ],
          },
        ],
      },
    ],
    practice: {
      title: 'Mixed Band Quick Practice',
      description: 'สลับ FOUR_BAND และ FIVE_BAND ใน Quick Practice แล้วบันทึกผล',
      href: '/learn/self/practice/quick?type=FIVE_BAND',
      badge: 'Quick Practice',
      highlight: 'ตั้ง optionCount = 4 ให้ใกล้เคียงการสอบจริง',
    },
    resources: [
      {
        label: 'Mixed Band Worksheet',
        description: 'แบบฟอร์มบันทึกผลการฝึก 30 ชิ้น',
        href: '/resources/mixed-band-worksheet.pdf',
      },
      {
        label: 'Lab Reflection Guide',
        description: 'คำถามสำหรับทบทวนหลังการฝึก',
        href: '/resources/lab-reflection-guide.pdf',
      },
    ],
  },
};

const seed = async () => {
  // ... existing code ...
};

export default seed;