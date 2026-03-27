import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

/**
 * Seed Module 2: ระบบ 4 แถบสี (The 4-Band System)
 * 
 * This script creates Module 2 with 3 lessons:
 * 2.1 โครงสร้างและการอ่านค่า (Anatomy & Formula)
 * 2.2 ตะลุยโจทย์จริง (Walkthrough Examples)
 * 2.3 การแปลงหน่วย (Unit Conversion)
 */
async function main() {
    console.log('Starting to seed Module 2: ระบบ 4 แถบสี (The 4-Band System)...\n');

    // Create Module 2
    const module2 = await prisma.module.create({
        data: {
            title: 'ระบบ 4 แถบสี (The 4-Band System)',
            description: 'อ่านค่า คำนวณ และแปลงหน่วยได้คล่องแคล่ว',
            order: 2,
            isIntro: false,
            lessons: {
                create: [
                    // Lesson 2.1: โครงสร้างและการอ่านค่า
                    {
                        title: 'โครงสร้างและการอ่านค่า (Anatomy & Formula)',
                        order: 1,
                        strapline: 'สูตรลับ: ตั้ง-ต่อ-เติม-ตบ (Digit-Digit-Multiplier-Tolerance)',
                        summary: 'เข้าใจโครงสร้างของระบบ 4 แถบสี และสูตรการอ่านค่าความต้านทาน',
                        content: `# โครงสร้างและการอ่านค่า (Anatomy & Formula)

## โครงสร้าง (The Layout)

ในระบบ 4 แถบสี เราจะแบ่งหน้าที่ของแต่ละแถบดังนี้ (อ้างอิงจากรูปภาพ Master Table):

**Band 1: ตัวตั้ง (1st Digit)**
- หน้าที่: บอกตัวเลขหลักแรก (1-9)
- ไม่สามารถเป็นสีดำได้ (เพราะจะไม่มีตัวเลข)

**Band 2: ตัวต่อ (2nd Digit)**
- หน้าที่: บอกตัวเลขหลักที่สอง (0-9)
- รวมกับ Band 1 เป็นตัวเลขสองหลัก

**Band 3: ตัวเติมศูนย์ (Multiplier)**
จุดสำคัญ: แถบนี้ไม่ใช่ตัวเลข แต่คือตัวคูณ
- หน้าที่: บอกจำนวนศูนย์ที่ต้องเติมต่อท้าย (หรือตัวหาร)
- มีค่าพิเศษคือ สีทอง (×0.1) และ สีเงิน (×0.01)

**Band 4: ตัวจบ (Tolerance)**
- หน้าที่: บอกค่าความคลาดเคลื่อน
- สังเกตได้จากระยะห่างที่มากกว่าเพื่อน

## สูตรการอ่าน (The Formula)

วิธีอ่านไม่ใช่การเอาเลขมาบวกกัน แต่คือการ "เอาเลขมาวางต่อกัน" แล้วคูณ

**สูตร:**
\`\`\`
ค่าความต้านทาน = (แถบ1 · แถบ2) × แถบ3
\`\`\`

**หมายเหตุ:** สัญลักษณ์ · หมายถึงการวางตัวเลขต่อกัน (concatenation) ไม่ใช่การคูณ

**เทคนิคง่ายๆ:** "อ่านสองแถบแรกเป็นตัวเลขสองหลัก แล้วคูณด้วยค่าตัวคูณของแถบที่ 3"`,
                        heroStats: {
                            create: [
                                { label: 'ความยาก', value: 'พื้นฐาน', order: 1 },
                                { label: 'เวลา', value: '20 นาที', order: 2 },
                            ]
                        },
                        objectives: {
                            create: [
                                { text: 'เข้าใจโครงสร้างของระบบ 4 แถบสี', order: 1 },
                                { text: 'จำสูตรการอ่านค่าได้', order: 2 },
                                { text: 'แยกแยะหน้าที่ของแต่ละแถบได้', order: 3 },
                            ]
                        },
                        sections: {
                            create: [
                                {
                                    slug: 'structure',
                                    title: 'โครงสร้าง (The Layout)',
                                    description: 'เรียนรู้หน้าที่ของแต่ละแถบในระบบ 4 แถบสี',
                                    order: 0,
                                    content: [
                                        {
                                            type: 'text',
                                            text: 'ในระบบ 4 แถบสี เราจะแบ่งหน้าที่ของแต่ละแถบดังนี้ (อ้างอิงจากรูปภาพ Master Table)',
                                            variant: 'lead'
                                        },
                                        {
                                            type: 'card-grid',
                                            columns: 2,
                                            cards: [
                                                {
                                                    title: 'Band 1: ตัวตั้ง (1st Digit)',
                                                    subtitle: 'ตัวเลขหลักแรก',
                                                    body: 'บอกตัวเลขหลักแรก (1-9) ไม่สามารถเป็นสีดำได้',
                                                    variant: 'warm'
                                                },
                                                {
                                                    title: 'Band 2: ตัวต่อ (2nd Digit)',
                                                    subtitle: 'ตัวเลขหลักที่สอง',
                                                    body: 'บอกตัวเลขหลักที่สอง (0-9) รวมกับ Band 1 เป็นตัวเลขสองหลัก',
                                                    variant: 'warm'
                                                },
                                                {
                                                    title: 'Band 3: ตัวเติมศูนย์ (Multiplier)',
                                                    subtitle: 'จุดสำคัญ: ไม่ใช่ตัวเลข',
                                                    body: 'บอกจำนวนศูนย์ที่ต้องเติมต่อท้าย (หรือตัวหาร) มีค่าพิเศษคือ สีทอง (×0.1) และ สีเงิน (×0.01)',
                                                    variant: 'accent',
                                                    bullets: [
                                                        'ไม่ใช่ตัวเลข แต่คือตัวคูณ',
                                                        'บอกจำนวนศูนย์ที่ต้องเติม',
                                                        'มีสีทอง (×0.1) และสีเงิน (×0.01)'
                                                    ]
                                                },
                                                {
                                                    title: 'Band 4: ตัวจบ (Tolerance)',
                                                    subtitle: 'ค่าความคลาดเคลื่อน',
                                                    body: 'บอกค่าความคลาดเคลื่อน สังเกตได้จากระยะห่างที่มากกว่าเพื่อน',
                                                    variant: 'cool'
                                                }
                                            ]
                                        },
                                        {
                                            type: 'interactive-resistor',
                                            initialMode: '4-band'
                                        }
                                    ]
                                },
                                {
                                    slug: 'formula',
                                    title: 'สูตรการอ่าน (The Formula)',
                                    description: 'เรียนรู้สูตรและเทคนิคการอ่านค่า',
                                    order: 1,
                                    content: [
                                        {
                                            type: 'text',
                                            text: 'วิธีอ่านไม่ใช่การเอาเลขมาบวกกัน แต่คือการ "เอาเลขมาวางต่อกัน" แล้วคูณ',
                                            variant: 'lead'
                                        },
                                        {
                                            type: 'text',
                                            text: '**สูตร:**\n\n\`\`\`\nค่าความต้านทาน = (แถบ1 · แถบ2) × แถบ3\n\`\`\`\n\n**หมายเหตุ:** สัญลักษณ์ · หมายถึงการวางตัวเลขต่อกัน (concatenation) ไม่ใช่การคูณ\n\n**เทคนิคง่ายๆ:** "อ่านสองแถบแรกเป็นตัวเลขสองหลัก แล้วคูณด้วยค่าตัวคูณของแถบที่ 3"'
                                        },
                                        {
                                            type: 'callout',
                                            title: 'เทคนิคการจำ',
                                            body: 'สูตรลับ: ตั้ง-ต่อ-เติม-ตบ\n- ตั้ง: Band 1 (ตัวตั้ง)\n- ต่อ: Band 2 (ตัวต่อ)\n- เติม: Band 3 (ตัวเติมศูนย์)\n- ตบ: Band 4 (ตัวจบ/Tolerance)',
                                            variant: 'info'
                                        },
                                        {
                                            type: 'interactive-resistor-demo',
                                            resistorType: 'FOUR_BAND'
                                        }
                                    ]
                                }
                            ]
                        },
                        quizQuestions: {
                            create: [
                                {
                                    prompt: 'ในระบบ 4 แถบสี แถบที่ 3 ทำหน้าที่อะไร?',
                                    options: [
                                        'บอกตัวเลขหลักที่สาม',
                                        'บอกตัวคูณ (Multiplier)',
                                        'บอกค่าความคลาดเคลื่อน',
                                        'บอกหน่วย'
                                    ],
                                    answerIndex: 1,
                                    explanation: 'แถบที่ 3 ในระบบ 4 แถบคือตัวคูณ (Multiplier) ไม่ใช่ตัวเลข',
                                    order: 1
                                },
                                {
                                    prompt: 'สูตรการอ่านค่าความต้านทานในระบบ 4 แถบคือ?',
                                    options: [
                                        '(แถบ1 + แถบ2) × แถบ3',
                                        '(แถบ1 · แถบ2) × แถบ3',
                                        'แถบ1 × แถบ2 × แถบ3',
                                        'แถบ1 + แถบ2 + แถบ3'
                                    ],
                                    answerIndex: 1,
                                    explanation: 'สูตรคือ (แถบ1 · แถบ2) × แถบ3 โดย · หมายถึงการวางต่อกัน',
                                    order: 2
                                }
                            ]
                        },
                        practiceLink: {
                            create: {
                                title: 'ฝึกฝนการอ่านค่า',
                                description: 'ลองฝึกอ่านค่าตัวต้านทาน 4 แถบด้วยตัวเอง',
                                href: '/learn/self/practice/quick',
                                badge: 'ฝึกฝน',
                                highlight: 'new'
                            }
                        }
                    },
                    // Lesson 2.2: ตะลุยโจทย์จริง
                    {
                        title: 'ตะลุยโจทย์จริง (Walkthrough Examples)',
                        order: 2,
                        strapline: 'ฝึกอ่านค่าจากตัวอย่างจริง',
                        summary: 'เรียนรู้การอ่านค่าจากตัวอย่างจริง 3 กรณี: ค่าหลักร้อย/พัน ค่าหลักหมื่น และค่าหลักหน่วย',
                        content: `# ตะลุยโจทย์จริง (Walkthrough Examples)

เรามาลองถอดรหัสจากตัวอย่างจริงกัน (คัดเลือกค่ามาตรฐานที่เจอบ่อยที่สุด)

## กรณีที่ 1: ค่าหลักร้อย/พัน (Standard Values)

**สี:** Brown - Black - Red - Gold

**วิธีคำนวณ:**
- Brown (1): ได้เลข 1
- Black (0): ได้เลข 0 → รวมกันเป็น 10
- Red (×100): คูณด้วย 100 → 10 × 100 = 1,000
- Gold (5%): ความคลาดเคลื่อน ±5%

**คำตอบ:** 1,000 Ω หรือ 1 kΩ ±5%

## กรณีที่ 2: ค่าหลักหมื่น (The Kilo Range)

**สี:** Yellow - Violet - Orange - Gold

**วิธีคำนวณ:**
- Yellow (4): ได้เลข 4
- Violet (7): ได้เลข 7 → รวมกันเป็น 47
- Orange (×1k): คูณด้วย 1,000 → 47 × 1,000 = 47,000
- Gold (5%): ความคลาดเคลื่อน ±5%

**คำตอบ:** 47,000 Ω หรือ 47 kΩ ±5%

## กรณีที่ 3: ค่าหลักหน่วย (The Low Value / Gold Multiplier)

**สี:** Red - Red - Gold - Gold

**วิธีคำนวณ:**
- Red (2): ได้เลข 2
- Red (2): ได้เลข 2 → รวมกันเป็น 22
- Gold (×0.1): คูณด้วย 0.1 → 22 × 0.1 = 2.2 (เลื่อนจุดทศนิยมไปซ้าย 1 ตำแหน่ง)
- Gold (5%): ความคลาดเคลื่อน ±5%

**คำตอบ:** 2.2 Ω ±5%`,
                        heroStats: {
                            create: [
                                { label: 'ความยาก', value: 'ปานกลาง', order: 1 },
                                { label: 'เวลา', value: '30 นาที', order: 2 },
                            ]
                        },
                        objectives: {
                            create: [
                                { text: 'อ่านค่าตัวต้านทาน 4 แถบจากตัวอย่างจริงได้', order: 1 },
                                { text: 'คำนวณค่าความต้านทานได้ถูกต้อง', order: 2 },
                                { text: 'เข้าใจการทำงานของ Gold multiplier (×0.1)', order: 3 },
                            ]
                        },
                        sections: {
                            create: [
                                {
                                    slug: 'example-1',
                                    title: 'กรณีที่ 1: ค่าหลักร้อย/พัน (Standard Values)',
                                    description: 'ตัวอย่างค่ามาตรฐานที่เจอบ่อย',
                                    order: 0,
                                    content: [
                                        {
                                            type: 'text',
                                            text: '**สี:** Brown - Black - Red - Gold',
                                            variant: 'lead'
                                        },
                                        {
                                            type: 'text',
                                            text: '**วิธีคำนวณ:**\n\n- Brown (1): ได้เลข 1\n- Black (0): ได้เลข 0 → รวมกันเป็น 10\n- Red (×100): คูณด้วย 100 → 10 × 100 = 1,000\n- Gold (5%): ความคลาดเคลื่อน ±5%'
                                        },
                                        {
                                            type: 'callout',
                                            title: 'คำตอบ',
                                            body: '1,000 Ω หรือ 1 kΩ ±5%',
                                            variant: 'success'
                                        },
                                        {
                                            type: 'interactive-resistor-demo',
                                            resistorType: 'FOUR_BAND'
                                        }
                                    ]
                                },
                                {
                                    slug: 'example-2',
                                    title: 'กรณีที่ 2: ค่าหลักหมื่น (The Kilo Range)',
                                    description: 'ตัวอย่างค่าหลักหมื่น',
                                    order: 1,
                                    content: [
                                        {
                                            type: 'text',
                                            text: '**สี:** Yellow - Violet - Orange - Gold',
                                            variant: 'lead'
                                        },
                                        {
                                            type: 'text',
                                            text: '**วิธีคำนวณ:**\n\n- Yellow (4): ได้เลข 4\n- Violet (7): ได้เลข 7 → รวมกันเป็น 47\n- Orange (×1k): คูณด้วย 1,000 → 47 × 1,000 = 47,000\n- Gold (5%): ความคลาดเคลื่อน ±5%'
                                        },
                                        {
                                            type: 'callout',
                                            title: 'คำตอบ',
                                            body: '47,000 Ω หรือ 47 kΩ ±5%',
                                            variant: 'success'
                                        },
                                        {
                                            type: 'interactive-resistor-demo',
                                            resistorType: 'FOUR_BAND'
                                        }
                                    ]
                                },
                                {
                                    slug: 'example-3',
                                    title: 'กรณีที่ 3: ค่าหลักหน่วย (The Low Value / Gold Multiplier)',
                                    description: 'ตัวอย่างค่าต่ำที่ใช้ Gold multiplier',
                                    order: 2,
                                    content: [
                                        {
                                            type: 'text',
                                            text: '**สี:** Red - Red - Gold - Gold',
                                            variant: 'lead'
                                        },
                                        {
                                            type: 'text',
                                            text: '**วิธีคำนวณ:**\n\n- Red (2): ได้เลข 2\n- Red (2): ได้เลข 2 → รวมกันเป็น 22\n- Gold (×0.1): คูณด้วย 0.1 → 22 × 0.1 = 2.2 (เลื่อนจุดทศนิยมไปซ้าย 1 ตำแหน่ง)\n- Gold (5%): ความคลาดเคลื่อน ±5%'
                                        },
                                        {
                                            type: 'callout',
                                            title: 'คำตอบ',
                                            body: '2.2 Ω ±5%',
                                            variant: 'success'
                                        },
                                        {
                                            type: 'callout',
                                            title: 'จุดสำคัญ',
                                            body: 'แถบที่ 3 เป็นสีทอง (×0.1) ไม่ใช่ตัวคูณปกติ แต่เป็นตัวหาร ทำให้ค่าลดลง 10 เท่า\n\nตัวอย่าง: 22 × 0.1 = 2.2 Ω (เลื่อนจุดทศนิยมไปซ้าย 1 ตำแหน่ง)',
                                            variant: 'warning'
                                        },
                                        {
                                            type: 'interactive-resistor-demo',
                                            resistorType: 'FOUR_BAND'
                                        }
                                    ]
                                }
                            ]
                        },
                        quizQuestions: {
                            create: [
                                {
                                    prompt: 'ถ้าตัวต้านทานมีสี Brown-Black-Red-Gold ค่าความต้านทานคือ?',
                                    options: ['100 Ω', '1,000 Ω', '10,000 Ω', '100,000 Ω'],
                                    answerIndex: 1,
                                    explanation: 'Brown (1) - Black (0) = 10, Red (×100) = 10 × 100 = 1,000 Ω',
                                    order: 1
                                },
                                {
                                    prompt: 'ถ้าตัวต้านทานมีสี Yellow-Violet-Orange-Gold ค่าความต้านทานคือ?',
                                    options: ['470 Ω', '4,700 Ω', '47,000 Ω', '470,000 Ω'],
                                    answerIndex: 2,
                                    explanation: 'Yellow (4) - Violet (7) = 47, Orange (×1k) = 47 × 1,000 = 47,000 Ω',
                                    order: 2
                                },
                                {
                                    prompt: 'ถ้าตัวต้านทานมีสี Red-Red-Gold-Gold ค่าความต้านทานคือ?',
                                    options: ['22 Ω', '2.2 Ω', '0.22 Ω', '220 Ω'],
                                    answerIndex: 1,
                                    explanation: 'Red (2) - Red (2) = 22, Gold (×0.1) = 22 × 0.1 = 2.2 Ω',
                                    order: 3
                                }
                            ]
                        },
                        practiceLink: {
                            create: {
                                title: 'ฝึกฝนการอ่านค่า',
                                description: 'ลองฝึกอ่านค่าตัวต้านทาน 4 แถบด้วยตัวเอง',
                                href: '/learn/self/practice/quick',
                                badge: 'ฝึกฝน',
                                highlight: 'new'
                            }
                        }
                    },
                    // Lesson 2.3: การแปลงหน่วย
                    {
                        title: 'การแปลงหน่วย (Unit Conversion)',
                        order: 3,
                        strapline: 'จาก "ศูนย์เยอะๆ" สู่ "k" และ "M"',
                        summary: 'เรียนรู้การแปลงหน่วยจากโอห์ม (Ω) เป็นกิโลโอห์ม (kΩ) และเมกะโอห์ม (MΩ)',
                        content: `# การแปลงหน่วย (Unit Conversion)

## จาก "ศูนย์เยอะๆ" สู่ "k" และ "M"

ในโลกอิเล็กทรอนิกส์ เราไม่นิยมพูดว่า "หนึ่งล้านสองแสนโอห์ม" เราใช้หน่วยย่อ เพื่อให้อ่านง่ายขึ้น

## ตารางการแปลงหน่วย

| ค่าตัวเลข (Ω) | ตัวย่อ (Prefix) | วิธีดูจากแถบสี (Band 3) |
|--------------|----------------|----------------------|
| 1,000 Ω | 1 kΩ (กิโล) | มักเป็นสี ส้ม (×1k) |
| 1,000,000 Ω | 1 MΩ (เมกะ) | มักเป็นสี น้ำเงิน (×1M) |

## สูตรลัดการจำแถบ 3

- ส้ม = k (เติม 000 = หลักพัน)
- เหลือง = 10k (หลักหมื่น)
- เขียว = M (เติม 00000 = หลักแสน/ล้าน)`,
                        heroStats: {
                            create: [
                                { label: 'ความยาก', value: 'ปานกลาง', order: 1 },
                                { label: 'เวลา', value: '15 นาที', order: 2 },
                            ]
                        },
                        objectives: {
                            create: [
                                { text: 'แปลงหน่วยจาก Ω เป็น kΩ และ MΩ ได้', order: 1 },
                                { text: 'จำสูตรลัดการจำแถบ 3 ได้', order: 2 },
                                { text: 'ใช้หน่วยย่อได้ถูกต้อง', order: 3 },
                            ]
                        },
                        sections: {
                            create: [
                                {
                                    slug: 'unit-conversion-table',
                                    title: 'ตารางการแปลงหน่วย',
                                    description: 'เรียนรู้การแปลงหน่วยจากโอห์มเป็นกิโลและเมกะ',
                                    order: 0,
                                    content: [
                                        {
                                            type: 'text',
                                            text: 'ในโลกอิเล็กทรอนิกส์ เราไม่นิยมพูดว่า "หนึ่งล้านสองแสนโอห์ม" เราใช้หน่วยย่อ เพื่อให้อ่านง่ายขึ้น',
                                            variant: 'lead'
                                        },
                                        {
                                            type: 'interactive-table',
                                            headers: ['ค่าตัวเลข (Ω)', 'ตัวย่อ (Prefix)', 'วิธีดูจากแถบสี (Band 3)'],
                                            rows: [
                                                ['1,000 Ω', '1 kΩ (กิโล)', 'มักเป็นสี ส้ม (×1k)'],
                                                ['10,000 Ω', '10 kΩ', 'มักเป็นสี เหลือง (×10k)'],
                                                ['100,000 Ω', '100 kΩ', 'มักเป็นสี เขียว (×100k)'],
                                                ['1,000,000 Ω', '1 MΩ (เมกะ)', 'มักเป็นสี น้ำเงิน (×1M)'],
                                                ['10,000,000 Ω', '10 MΩ', 'มักเป็นสี ม่วง (×10M)']
                                            ]
                                        }
                                    ]
                                },
                                {
                                    slug: 'shortcut-formula',
                                    title: 'สูตรลัดการจำแถบ 3',
                                    description: 'เทคนิคการจำหน่วยจากสีแถบที่ 3',
                                    order: 1,
                                    content: [
                                        {
                                            type: 'text',
                                            text: '**สูตรลัดการจำแถบ 3:**',
                                            variant: 'lead'
                                        },
                                        {
                                            type: 'card-grid',
                                            columns: 3,
                                            cards: [
                                                {
                                                    title: 'ส้ม = k',
                                                    subtitle: 'เติม 000 = หลักพัน',
                                                    body: 'สีส้ม (×1k) = 1,000 Ω = 1 kΩ',
                                                    variant: 'warm'
                                                },
                                                {
                                                    title: 'เหลือง = 10k',
                                                    subtitle: 'หลักหมื่น',
                                                    body: 'สีเหลือง (×10k) = 10,000 Ω = 10 kΩ',
                                                    variant: 'warm'
                                                },
                                                {
                                                    title: 'เขียว = M',
                                                    subtitle: 'เติม 00000 = หลักแสน/ล้าน',
                                                    body: 'สีเขียว (×100k) หรือ น้ำเงิน (×1M) = 1,000,000 Ω = 1 MΩ',
                                                    variant: 'cool'
                                                }
                                            ]
                                        },
                                        {
                                            type: 'callout',
                                            title: 'เทคนิคการจำ',
                                            body: 'จำง่ายๆ: ส้ม = k, เหลือง = 10k, เขียว = M\n\n- ส้ม (×1k) → หลักพัน → k\n- เหลือง (×10k) → หลักหมื่น → 10k\n- เขียว (×100k) หรือ น้ำเงิน (×1M) → หลักแสน/ล้าน → M',
                                            variant: 'info'
                                        }
                                    ]
                                }
                            ]
                        },
                        quizQuestions: {
                            create: [
                                {
                                    prompt: '1,000 Ω เท่ากับเท่าไหร่?',
                                    options: ['1 kΩ', '10 kΩ', '100 kΩ', '1 MΩ'],
                                    answerIndex: 0,
                                    explanation: '1,000 Ω = 1 kΩ (กิโลโอห์ม)',
                                    order: 1
                                },
                                {
                                    prompt: 'สีส้มในแถบที่ 3 มักจะได้ค่าประมาณเท่าไหร่?',
                                    options: ['หลักร้อย', 'หลักพัน (k)', 'หลักหมื่น (10k)', 'หลักแสน (100k)'],
                                    answerIndex: 1,
                                    explanation: 'สีส้ม (×1k) = 1,000 Ω = 1 kΩ (หลักพัน)',
                                    order: 2
                                },
                                {
                                    prompt: 'สีเขียวในแถบที่ 3 มักจะได้ค่าประมาณเท่าไหร่?',
                                    options: ['หลักพัน (k)', 'หลักหมื่น (10k)', 'หลักแสน (100k)', 'หลักล้าน (M)'],
                                    answerIndex: 3,
                                    explanation: 'สีเขียว (×100k) หรือ น้ำเงิน (×1M) = 1,000,000 Ω = 1 MΩ (หลักล้าน)',
                                    order: 3
                                }
                            ]
                        },
                        practiceLink: {
                            create: {
                                title: 'ฝึกฝนการแปลงหน่วย',
                                description: 'ลองฝึกแปลงหน่วยด้วยตัวเอง',
                                href: '/learn/self/practice/quick',
                                badge: 'ฝึกฝน',
                                highlight: 'new'
                            }
                        }
                    }
                ]
            }
        },
        include: {
            lessons: {
                orderBy: {
                    order: 'asc'
                }
            }
        }
    });

    console.log('Module 2 created successfully!');
    console.log(`   Module ID: ${module2.id}`);
    console.log(`   Lessons created: ${module2.lessons.length}\n`);

    // Summary
    console.log('═══════════════════════════════════════════════════════════');
    console.log('Module 2: ระบบ 4 แถบสี (The 4-Band System)');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('\nLessons:');
    module2.lessons.forEach((lesson, index) => {
        console.log(`  ${index + 1}. ${lesson.title}`);
    });
    console.log('\nSeeding completed!\n');
}

main()
    .catch((error) => {
        console.error('Error seeding Module 2:', error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
