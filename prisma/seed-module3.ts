import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

/**
 * Seed Module 3: ระบบ 5 แถบสี (The 5-Band System)
 * 
 * This script creates Module 3 with 3 lessons:
 * 3.1 พลังของตัวเลขหลักที่ 3 (The 3rd Significant Digit)
 * 3.2 วิธีคำนวณแบบ 5 แถบ (Calculation Walkthrough)
 * 3.3 ปัญหาโลกแตก... หัวหรือท้าย? (Direction Confusion)
 */
async function main() {
    console.log('Starting to seed Module 3: ระบบ 5 แถบสี (The 5-Band System)...\n');

    // Create Module 3
    const module3 = await prisma.module.create({
        data: {
            title: 'ระบบ 5 แถบสี (The 5-Band System)',
            description: 'อ่านค่าความต้านทานความแม่นยำสูง (Precision Resistors) ได้อย่างถูกต้อง',
            order: 3,
            isIntro: false,
            lessons: {
                create: [
                    // Lesson 3.1: พลังของตัวเลขหลักที่ 3
                    {
                        title: 'พลังของตัวเลขหลักที่ 3 (The 3rd Significant Digit)',
                        order: 1,
                        strapline: 'เมื่อ 2 หลักยังไม่พอ... ขอเพิ่มอีกหลัก!',
                        summary: 'เข้าใจความแตกต่างที่สำคัญที่สุดระหว่างระบบ 4 แถบและ 5 แถบ และโครงสร้างใหม่ของระบบ 5 แถบ',
                        content: `# พลังของตัวเลขหลักที่ 3 (The 3rd Significant Digit)

## ความแตกต่างที่สำคัญที่สุด (The Big Difference)

ในระบบ 4 แถบสี เราบอกค่าได้ละเอียดแค่ 2 หลัก (เช่น 22, 47, 10) แต่ในงานวิศวกรรมบางอย่าง เช่น เครื่องมือแพทย์ หรือเครื่องเสียง เราต้องการค่าที่ละเอียดกว่านั้น เช่น 237 โอห์ม

ระบบ 5 แถบสีจึงถือกำเนิดขึ้น โดยการ "เปลี่ยนหน้าที่ของแถบที่ 3":
- ในระบบ 4 แถบ: แถบ 3 คือ ตัวคูณ (Multiplier)
- ในระบบ 5 แถบ: แถบ 3 คือ "ตัวเลข" (Digit)

## โครงสร้างใหม่ (The New Layout)

(อ้างอิงจากรูปภาพ Master Table ด้านล่าง)

**Band 1:** ตัวเลขหลักที่ 1
**Band 2:** ตัวเลขหลักที่ 2
**Band 3:** ตัวเลขหลักที่ 3 (พระเอกของงานนี้)
**Band 4:** ตัวคูณ (Multiplier) ถูกขยับมาอยู่ตรงนี้
**Band 5:** ความคลาดเคลื่อน (Tolerance)`,
                        heroStats: {
                            create: [
                                { label: 'ความยาก', value: 'ปานกลาง', order: 1 },
                                { label: 'เวลา', value: '25 นาที', order: 2 },
                            ]
                        },
                        objectives: {
                            create: [
                                { text: 'เข้าใจความแตกต่างระหว่างระบบ 4 แถบและ 5 แถบ', order: 1 },
                                { text: 'รู้ว่าแถบที่ 3 ในระบบ 5 แถบคือตัวเลข ไม่ใช่ตัวคูณ', order: 2 },
                                { text: 'เข้าใจโครงสร้างใหม่ของระบบ 5 แถบ', order: 3 },
                            ]
                        },
                        sections: {
                            create: [
                                {
                                    slug: 'big-difference',
                                    title: 'ความแตกต่างที่สำคัญที่สุด',
                                    description: 'เปรียบเทียบระบบ 4 แถบและ 5 แถบ',
                                    order: 0,
                                    content: [
                                        {
                                            type: 'text',
                                            text: 'ในระบบ 4 แถบสี เราบอกค่าได้ละเอียดแค่ 2 หลัก (เช่น 22, 47, 10) แต่ในงานวิศวกรรมบางอย่าง เช่น เครื่องมือแพทย์ หรือเครื่องเสียง เราต้องการค่าที่ละเอียดกว่านั้น เช่น 237 โอห์ม',
                                            variant: 'lead'
                                        },
                                        {
                                            type: 'text',
                                            text: 'ระบบ 5 แถบสีจึงถือกำเนิดขึ้น โดยการ "เปลี่ยนหน้าที่ของแถบที่ 3":'
                                        },
                                        {
                                            type: 'card-grid',
                                            columns: 2,
                                            cards: [
                                                {
                                                    title: 'ระบบ 4 แถบ',
                                                    subtitle: 'แถบ 3 = ตัวคูณ',
                                                    body: 'บอกค่าได้ละเอียดแค่ 2 หลัก (เช่น 22, 47, 10)',
                                                    bullets: [
                                                        'Band 1: ตัวเลขหลักที่ 1',
                                                        'Band 2: ตัวเลขหลักที่ 2',
                                                        'Band 3: ตัวคูณ (Multiplier)',
                                                        'Band 4: Tolerance'
                                                    ],
                                                    variant: 'warm'
                                                },
                                                {
                                                    title: 'ระบบ 5 แถบ',
                                                    subtitle: 'แถบ 3 = ตัวเลข',
                                                    body: 'บอกค่าได้ละเอียด 3 หลัก (เช่น 237, 100, 499)',
                                                    bullets: [
                                                        'Band 1: ตัวเลขหลักที่ 1',
                                                        'Band 2: ตัวเลขหลักที่ 2',
                                                        'Band 3: ตัวเลขหลักที่ 3 (พระเอก)',
                                                        'Band 4: ตัวคูณ (Multiplier)',
                                                        'Band 5: Tolerance'
                                                    ],
                                                    variant: 'cool'
                                                }
                                            ]
                                        },
                                        {
                                            type: 'callout',
                                            title: 'จุดสำคัญ',
                                            body: 'ความแตกต่างที่สำคัญที่สุด: แถบที่ 3 เปลี่ยนหน้าที่\n- ระบบ 4 แถบ: แถบ 3 = ตัวคูณ\n- ระบบ 5 แถบ: แถบ 3 = ตัวเลข',
                                            variant: 'warning'
                                        }
                                    ]
                                },
                                {
                                    slug: 'new-layout',
                                    title: 'โครงสร้างใหม่ (The New Layout)',
                                    description: 'เรียนรู้โครงสร้างของระบบ 5 แถบสี',
                                    order: 1,
                                    content: [
                                        {
                                            type: 'text',
                                            text: 'โครงสร้างใหม่ของระบบ 5 แถบสี (อ้างอิงจากรูปภาพ Master Table)',
                                            variant: 'lead'
                                        },
                                        {
                                            type: 'list',
                                            style: 'unordered',
                                            items: [
                                                'Band 1: ตัวเลขหลักที่ 1',
                                                'Band 2: ตัวเลขหลักที่ 2',
                                                'Band 3: ตัวเลขหลักที่ 3 (พระเอกของงานนี้)',
                                                'Band 4: ตัวคูณ (Multiplier) ถูกขยับมาอยู่ตรงนี้',
                                                'Band 5: ความคลาดเคลื่อน (Tolerance)'
                                            ]
                                        },
                                        {
                                            type: 'interactive-resistor',
                                            initialMode: '5-band'
                                        },
                                        {
                                            type: 'callout',
                                            title: 'สังเกต',
                                            body: 'Band 4 ในระบบ 5 แถบคือตัวคูณ (Multiplier) ซึ่งถูกขยับมาจากตำแหน่ง Band 3 ในระบบ 4 แถบ',
                                            variant: 'info'
                                        }
                                    ]
                                }
                            ]
                        },
                        quizQuestions: {
                            create: [
                                {
                                    prompt: 'ในระบบ 5 แถบสี แถบที่ 3 ทำหน้าที่อะไร?',
                                    options: [
                                        'บอกตัวคูณ (Multiplier)',
                                        'บอกตัวเลขหลักที่ 3',
                                        'บอกค่าความคลาดเคลื่อน',
                                        'บอกหน่วย'
                                    ],
                                    answerIndex: 1,
                                    explanation: 'ในระบบ 5 แถบ แถบที่ 3 คือตัวเลขหลักที่ 3 ไม่ใช่ตัวคูณ',
                                    order: 1
                                },
                                {
                                    prompt: 'ความแตกต่างที่สำคัญที่สุดระหว่างระบบ 4 แถบและ 5 แถบคือ?',
                                    options: [
                                        'จำนวนแถบสี',
                                        'หน้าที่ของแถบที่ 3',
                                        'ค่าความคลาดเคลื่อน',
                                        'วิธีอ่านค่า'
                                    ],
                                    answerIndex: 1,
                                    explanation: 'ความแตกต่างที่สำคัญคือแถบที่ 3 เปลี่ยนหน้าที่: 4 แถบ = ตัวคูณ, 5 แถบ = ตัวเลข',
                                    order: 2
                                }
                            ]
                        },
                        practiceLink: {
                            create: {
                                title: 'ฝึกฝนการอ่านค่า 5 แถบ',
                                description: 'ลองฝึกอ่านค่าตัวต้านทาน 5 แถบด้วยตัวเอง',
                                href: '/learn/self/practice/quick',
                                badge: 'ฝึกฝน',
                                highlight: 'new'
                            }
                        }
                    },
                    // Lesson 3.2: วิธีคำนวณแบบ 5 แถบ
                    {
                        title: 'วิธีคำนวณแบบ 5 แถบ (Calculation Walkthrough)',
                        order: 2,
                        strapline: '3 ตัวเลข × ตัวคูณ',
                        summary: 'เรียนรู้สูตรการอ่านค่าและวิธีคำนวณแบบ 5 แถบ พร้อมตัวอย่างจริง 2 กรณี',
                        content: `# วิธีคำนวณแบบ 5 แถบ (Calculation Walkthrough)

## 3 ตัวเลข × ตัวคูณ

สูตรการอ่านคือการนำเลข 3 ตัวมาเรียงกัน แล้วค่อยคูณ

**สูตร:**
\`\`\`
ค่าความต้านทาน = (แถบ1 · แถบ2 · แถบ3) × แถบ4
\`\`\`

**หมายเหตุ:** สัญลักษณ์ · หมายถึงการวางตัวเลขต่อกัน (concatenation) ไม่ใช่การคูณ

## ตัวอย่างที่ 1: Precision Example

**สี:** Red - Orange - Violet - Black - Brown

**วิธีคำนวณ:**
- Red (2): ได้เลข 2
- Orange (3): ได้เลข 3
- Violet (7): ได้เลข 7 → รวมกันเป็น 237
- Black (×1): คูณด้วย 1 (หรือไม่เติมศูนย์) → 237
- Brown (1%): ความคลาดเคลื่อน ±1%

**คำตอบ:** 237 Ω ±1%

(สังเกตไหมว่าค่า 237 โอห์มแบบนี้ ระบบ 4 แถบสีทำไม่ได้)

## ตัวอย่างที่ 2: กับดักเลขศูนย์ (The Zero Trap)

**สี:** Brown - Black - Black - Orange - Brown

**วิธีคำนวณ:**
- Brown (1): ได้เลข 1
- Black (0): ได้เลข 0
- Black (0): ได้เลข 0 → รวมกันเป็น 100 (ไม่ใช่ 10 นะ!)
- Orange (×1k): คูณด้วย 1,000 → 100 × 1,000 = 100,000
- Brown (1%): ความคลาดเคลื่อน ±1%

**คำตอบ:** 100,000 Ω = 100 kΩ ±1%

(มือใหม่มักอ่านผิดเป็น 10 kΩ เพราะลืมไปว่าแถบ 3 คือตัวเลข ไม่ใช่ตัวคูณ)`,
                        heroStats: {
                            create: [
                                { label: 'ความยาก', value: 'ปานกลาง', order: 1 },
                                { label: 'เวลา', value: '30 นาที', order: 2 },
                            ]
                        },
                        objectives: {
                            create: [
                                { text: 'จำสูตรการอ่านค่าแบบ 5 แถบได้', order: 1 },
                                { text: 'คำนวณค่าความต้านทาน 5 แถบได้ถูกต้อง', order: 2 },
                                { text: 'ระวังกับดักเลขศูนย์ได้', order: 3 },
                            ]
                        },
                        sections: {
                            create: [
                                {
                                    slug: 'formula',
                                    title: 'สูตรการอ่าน',
                                    description: 'เรียนรู้สูตรการอ่านค่าแบบ 5 แถบ',
                                    order: 0,
                                    content: [
                                        {
                                            type: 'text',
                                            text: 'สูตรการอ่านคือการนำเลข 3 ตัวมาเรียงกัน แล้วค่อยคูณ',
                                            variant: 'lead'
                                        },
                                        {
                                            type: 'text',
                                            text: '**สูตร:**\n\n\`\`\`\nค่าความต้านทาน = (แถบ1 · แถบ2 · แถบ3) × แถบ4\n\`\`\`\n\n**หมายเหตุ:** สัญลักษณ์ · หมายถึงการวางตัวเลขต่อกัน (concatenation) ไม่ใช่การคูณ\n\n**เทคนิค:** อ่านสามแถบแรกเป็นตัวเลขสามหลัก แล้วคูณด้วยค่าตัวคูณของแถบที่ 4'
                                        },
                                        {
                                            type: 'callout',
                                            title: 'ความแตกต่างจากระบบ 4 แถบ',
                                            body: '**ระบบ 4 แถบ:** (แถบ1 · แถบ2) × แถบ3\n- แถบ 1, 2 = ตัวเลข\n- แถบ 3 = ตัวคูณ\n- แถบ 4 = Tolerance\n\n**ระบบ 5 แถบ:** (แถบ1 · แถบ2 · แถบ3) × แถบ4\n- แถบ 1, 2, 3 = ตัวเลข\n- แถบ 4 = ตัวคูณ\n- แถบ 5 = Tolerance\n\n**จุดสำคัญ:** แถบที่ 3 ในระบบ 5 แถบคือตัวเลข ไม่ใช่ตัวคูณ',
                                            variant: 'info'
                                        },
                                        {
                                            type: 'interactive-resistor-demo',
                                            resistorType: 'FIVE_BAND'
                                        }
                                    ]
                                },
                                {
                                    slug: 'example-1',
                                    title: 'ตัวอย่างที่ 1: Precision Example',
                                    description: 'ตัวอย่างค่าความแม่นยำสูง',
                                    order: 1,
                                    content: [
                                        {
                                            type: 'text',
                                            text: '**สี:** Red - Orange - Violet - Black - Brown',
                                            variant: 'lead'
                                        },
                                        {
                                            type: 'text',
                                            text: '**วิธีคำนวณ:**\n\n- Red (2): ได้เลข 2\n- Orange (3): ได้เลข 3\n- Violet (7): ได้เลข 7 → รวมกันเป็น 237\n- Black (×1): คูณด้วย 1 (หรือไม่เติมศูนย์) → 237\n- Brown (1%): ความคลาดเคลื่อน ±1%'
                                        },
                                        {
                                            type: 'callout',
                                            title: 'คำตอบ',
                                            body: '237 Ω ±1%',
                                            variant: 'success'
                                        },
                                        {
                                            type: 'callout',
                                            title: 'สังเกต',
                                            body: 'ค่า 237 โอห์มแบบนี้ ระบบ 4 แถบสีทำไม่ได้ เพราะระบบ 4 แถบบอกค่าได้แค่ 2 หลัก (เช่น 240 โอห์ม)',
                                            variant: 'info'
                                        },
                                        {
                                            type: 'interactive-resistor-demo',
                                            resistorType: 'FIVE_BAND'
                                        }
                                    ]
                                },
                                {
                                    slug: 'example-2',
                                    title: 'ตัวอย่างที่ 2: กับดักเลขศูนย์ (The Zero Trap)',
                                    description: 'ตัวอย่างที่มักทำให้สับสน',
                                    order: 2,
                                    content: [
                                        {
                                            type: 'text',
                                            text: '**สี:** Brown - Black - Black - Orange - Brown',
                                            variant: 'lead'
                                        },
                                        {
                                            type: 'text',
                                            text: '**วิธีคำนวณ:**\n\n- Brown (1): ได้เลข 1\n- Black (0): ได้เลข 0\n- Black (0): ได้เลข 0 → รวมกันเป็น 100 (ไม่ใช่ 10 นะ!)\n- Orange (×1k): คูณด้วย 1,000 → 100 × 1,000 = 100,000\n- Brown (1%): ความคลาดเคลื่อน ±1%'
                                        },
                                        {
                                            type: 'callout',
                                            title: 'คำตอบ',
                                            body: '100,000 Ω = 100 kΩ ±1%',
                                            variant: 'success'
                                        },
                                        {
                                            type: 'callout',
                                            title: 'กับดักเลขศูนย์',
                                            body: 'มือใหม่มักอ่านผิดเป็น 10 kΩ เพราะลืมไปว่าแถบ 3 คือตัวเลข ไม่ใช่ตัวคูณ\n\n**สาเหตุที่สับสน:**\n- ในระบบ 4 แถบ: แถบ 3 = ตัวคูณ\n- ในระบบ 5 แถบ: แถบ 3 = ตัวเลขหลักที่ 3\n\n**ตัวอย่างการอ่านผิด:**\n- อ่านผิด: Brown-Black = 10, แล้วคิดว่าแถบ 3 (Black) เป็นตัวคูณ → 10 × 1 = 10, Orange = ×1k → 10 kΩ (ผิด!)\n- อ่านถูก: Brown-Black-Black = 100, Orange = ×1k → 100 × 1,000 = 100 kΩ (ถูก!)',
                                            variant: 'warning'
                                        },
                                        {
                                            type: 'interactive-resistor-demo',
                                            resistorType: 'FIVE_BAND'
                                        }
                                    ]
                                }
                            ]
                        },
                        quizQuestions: {
                            create: [
                                {
                                    prompt: 'สูตรการอ่านค่าความต้านทานในระบบ 5 แถบคือ?',
                                    options: [
                                        '(แถบ1 · แถบ2) × แถบ3',
                                        '(แถบ1 · แถบ2 · แถบ3) × แถบ4',
                                        'แถบ1 × แถบ2 × แถบ3 × แถบ4',
                                        'แถบ1 + แถบ2 + แถบ3 + แถบ4'
                                    ],
                                    answerIndex: 1,
                                    explanation: 'สูตรคือ (แถบ1 · แถบ2 · แถบ3) × แถบ4 โดย · หมายถึงการวางต่อกัน',
                                    order: 1
                                },
                                {
                                    prompt: 'ถ้าตัวต้านทาน 5 แถบมีสี Red-Orange-Violet-Black-Brown ค่าความต้านทานคือ?',
                                    options: ['23.7 Ω', '237 Ω', '2,370 Ω', '23,700 Ω'],
                                    answerIndex: 1,
                                    explanation: 'Red (2) - Orange (3) - Violet (7) = 237, Black (×1) = 237 Ω',
                                    order: 2
                                },
                                {
                                    prompt: 'ถ้าตัวต้านทาน 5 แถบมีสี Brown-Black-Black-Orange-Brown ค่าความต้านทานคือ?',
                                    options: ['10 kΩ', '100 kΩ', '1,000 kΩ', '10,000 kΩ'],
                                    answerIndex: 1,
                                    explanation: 'Brown (1) - Black (0) - Black (0) = 100, Orange (×1k) = 100 × 1,000 = 100,000 Ω = 100 kΩ',
                                    order: 3
                                }
                            ]
                        },
                        practiceLink: {
                            create: {
                                title: 'ฝึกฝนการคำนวณ 5 แถบ',
                                description: 'ลองฝึกคำนวณค่าตัวต้านทาน 5 แถบด้วยตัวเอง',
                                href: '/learn/self/practice/quick',
                                badge: 'ฝึกฝน',
                                highlight: 'new'
                            }
                        }
                    },
                    // Lesson 3.3: ปัญหาโลกแตก... หัวหรือท้าย?
                    {
                        title: 'ปัญหาโลกแตก... หัวหรือท้าย? (Direction Confusion)',
                        order: 3,
                        strapline: 'เมื่อไม่มี "สีทอง" ให้สังเกต... จะดูยังไง?',
                        summary: 'เรียนรู้เทคนิคการแยกแยะหัว-ท้ายของตัวต้านทาน 5 แถบ เมื่อไม่มีสีทอง/เงินเป็น Tolerance',
                        content: `# ปัญหาโลกแตก... หัวหรือท้าย? (Direction Confusion)

## เมื่อไม่มี "สีทอง" ให้สังเกต... จะดูยังไง?

ในระบบ 4 แถบ เรามีสีทอง/เงิน (Tolerance) ช่วยบอกว่านั่นคือด้านจบ แต่ในระบบ 5 แถบ Tolerance มักจะเป็น "สีน้ำตาล" หรือ "สีแดง" ซึ่งหน้าตาเหมือนแถบตัวเลขปกติเป๊ะ!

## เทคนิคการแยกแยะ (How to Spot)

### ดูระยะห่าง (The Gap Rule)

วิธีที่ชัวร์ที่สุดตามมาตรฐานคือ "แถบ Tolerance จะอยู่ห่างจากกลุ่มเพื่อนเล็กน้อย"
- กลุ่ม 4 แถบแรกจะอยู่ชิดกัน = ด้านหน้า
- แถบที่ 5 อยู่แยกออกมา = ด้านหลัง

### ดูค่าความน่าจะเป็น (Logic Check)

(สำหรับขั้นสูง) ถ้าอ่านจากซ้ายไปขวาแล้วได้ค่าแปลกประหลาดที่ไม่น่ามีจริง แต่พออ่านย้อนกลับแล้วได้ค่ามาตรฐาน ให้สันนิษฐานว่าเราอ่านผิดด้าน`,
                        heroStats: {
                            create: [
                                { label: 'ความยาก', value: 'ปานกลาง', order: 1 },
                                { label: 'เวลา', value: '20 นาที', order: 2 },
                            ]
                        },
                        objectives: {
                            create: [
                                { text: 'รู้วิธีแยกแยะหัว-ท้ายของตัวต้านทาน 5 แถบ', order: 1 },
                                { text: 'ใช้ Gap Rule ได้ถูกต้อง', order: 2 },
                                { text: 'ใช้ Logic Check เพื่อตรวจสอบได้', order: 3 },
                            ]
                        },
                        sections: {
                            create: [
                                {
                                    slug: 'gap-rule',
                                    title: 'ดูระยะห่าง (The Gap Rule)',
                                    description: 'เรียนรู้วิธีสังเกตระยะห่างของแถบสี',
                                    order: 0,
                                    content: [
                                        {
                                            type: 'text',
                                            text: 'วิธีที่ชัวร์ที่สุดตามมาตรฐานคือ "แถบ Tolerance จะอยู่ห่างจากกลุ่มเพื่อนเล็กน้อย"',
                                            variant: 'lead'
                                        },
                                        {
                                            type: 'text',
                                            text: '**กฎสำคัญ:**\n\n- กลุ่ม 4 แถบแรก (Band 1-4) จะอยู่ชิดกัน = ด้านหน้า (ซ้าย)\n- แถบที่ 5 (Tolerance) อยู่แยกออกมา = ด้านหลัง (ขวา)'
                                        },
                                        {
                                            type: 'card-grid',
                                            columns: 2,
                                            cards: [
                                                {
                                                    title: 'ด้านหน้า (4 แถบแรก)',
                                                    subtitle: 'ชิดกัน',
                                                    body: 'Band 1, 2, 3, 4 จะอยู่ชิดกันเป็นกลุ่ม',
                                                    variant: 'warm'
                                                },
                                                {
                                                    title: 'ด้านหลัง (Tolerance)',
                                                    subtitle: 'แยกออกมา',
                                                    body: 'Band 5 (Tolerance) จะอยู่ห่างออกมาเล็กน้อย',
                                                    variant: 'cool'
                                                }
                                            ]
                                        },
                                        {
                                            type: 'callout',
                                            title: 'เทคนิคการดู',
                                            body: 'ให้หันด้านที่มีแถบสี 4 แถบชิดกันไว้ทางซ้าย และด้านที่มีแถบสีโดดเดี่ยว (แถบที่ 5) ไว้ทางขวา แถบขวาสุดนั้นแหละคือ Tolerance',
                                            variant: 'info'
                                        },
                                        {
                                            type: 'interactive-resistor-demo',
                                            resistorType: 'FIVE_BAND'
                                        }
                                    ]
                                },
                                {
                                    slug: 'logic-check',
                                    title: 'ดูค่าความน่าจะเป็น (Logic Check)',
                                    description: 'วิธีตรวจสอบว่าอ่านถูกด้านหรือไม่',
                                    order: 1,
                                    content: [
                                        {
                                            type: 'text',
                                            text: 'สำหรับขั้นสูง: ถ้าอ่านจากซ้ายไปขวาแล้วได้ค่าแปลกประหลาดที่ไม่น่ามีจริง (เช่น 0.1 Ω ต่ำมาก หรือ 10,000 MΩ สูงมาก) แต่พออ่านย้อนกลับแล้วได้ค่ามาตรฐาน ให้สันนิษฐานว่าเราอ่านผิดด้าน',
                                            variant: 'lead'
                                        },
                                        {
                                            type: 'text',
                                            text: '**ตัวอย่าง:**\n\nถ้าอ่านได้ค่า 0.1 Ω (ต่ำมาก) หรือ 10,000 MΩ (สูงมาก) ซึ่งไม่น่าจะมีจริง\n\nลองอ่านย้อนกลับดู ถ้าได้ค่ามาตรฐาน เช่น 1 kΩ หรือ 10 kΩ แสดงว่าอ่านผิดด้าน\n\n**หมายเหตุ:** ค่าตัวต้านทานมาตรฐานมักจะเป็น 1, 2.2, 3.3, 4.7, 5.6, 6.8, 8.2, 10, 12, 15, 18, 22, 27, 33, 39, 47, 56, 68, 82, 100... (หรือทวีคูณของค่าเหล่านี้)'
                                        },
                                        {
                                            type: 'callout',
                                            title: 'ค่ามาตรฐานที่เจอบ่อย',
                                            body: 'ค่าตัวต้านทานมาตรฐานมักจะเป็น (หรือทวีคูณของค่าเหล่านี้):\n- 1, 2.2, 3.3, 4.7, 5.6, 6.8, 8.2, 10, 12, 15, 18, 22, 27, 33, 39, 47, 56, 68, 82, 100...\n\n**ตัวอย่างทวีคูณ:**\n- 1, 10, 100, 1k, 10k, 100k, 1M...\n- 2.2, 22, 220, 2.2k, 22k, 220k...\n- 4.7, 47, 470, 4.7k, 47k, 470k...\n\nถ้าอ่านได้ค่าที่ไม่ใช่ตัวเลขเหล่านี้ อาจจะอ่านผิดด้าน',
                                            variant: 'warning'
                                        },
                                        {
                                            type: 'list',
                                            style: 'unordered',
                                            items: [
                                                'อ่านจากซ้ายไปขวา',
                                                'ตรวจสอบว่าค่าที่ได้เป็นค่ามาตรฐานหรือไม่',
                                                'ถ้าได้ค่าที่แปลกประหลาด ลองอ่านย้อนกลับ',
                                                'ถ้าอ่านย้อนกลับแล้วได้ค่ามาตรฐาน แสดงว่าอ่านผิดด้าน'
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        quizQuestions: {
                            create: [
                                {
                                    prompt: 'วิธีแยกแยะหัว-ท้ายของตัวต้านทาน 5 แถบคือ?',
                                    options: [
                                        'ดูสีของแถบแรก',
                                        'ดูระยะห่าง (Gap Rule)',
                                        'ดูขนาดของตัวต้านทาน',
                                        'ดูสีของแถบสุดท้าย'
                                    ],
                                    answerIndex: 1,
                                    explanation: 'วิธีที่ชัวร์ที่สุดคือดูระยะห่าง: กลุ่ม 4 แถบแรกชิดกัน ด้านหลัง, แถบที่ 5 แยกออกมา',
                                    order: 1
                                },
                                {
                                    prompt: 'ถ้าอ่านได้ค่า 0.1 Ω ซึ่งต่ำมาก ควรทำอย่างไร?',
                                    options: [
                                        'ยอมรับว่าค่าต่ำจริง',
                                        'ลองอ่านย้อนกลับดู',
                                        'อ่านใหม่จากแถบแรก',
                                        'ใช้เครื่องมือวัด'
                                    ],
                                    answerIndex: 1,
                                    explanation: 'ถ้าได้ค่าที่แปลกประหลาด (ต่ำมากหรือสูงมาก) ควรลองอ่านย้อนกลับดู เพราะอาจจะอ่านผิดด้าน',
                                    order: 2
                                },
                                {
                                    prompt: 'ค่าตัวต้านทานมาตรฐานที่เจอบ่อยคือ?',
                                    options: [
                                        '1, 2, 3, 4, 5...',
                                        '1, 2.2, 3.3, 4.7, 5.6, 6.8, 8.2, 10...',
                                        '10, 20, 30, 40, 50...',
                                        '100, 200, 300, 400, 500...'
                                    ],
                                    answerIndex: 1,
                                    explanation: 'ค่ามาตรฐานมักจะเป็น 1, 2.2, 3.3, 4.7, 5.6, 6.8, 8.2, 10, 12, 15, 18, 22, 27, 33, 39, 47, 56, 68, 82, 100...',
                                    order: 3
                                }
                            ]
                        },
                        practiceLink: {
                            create: {
                                title: 'ฝึกฝนการแยกแยะหัว-ท้าย',
                                description: 'ลองฝึกแยกแยะหัว-ท้ายของตัวต้านทาน 5 แถบ',
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

    console.log('Module 3 created successfully!');
    console.log(`   Module ID: ${module3.id}`);
    console.log(`   Lessons created: ${module3.lessons.length}\n`);

    // Summary
    console.log('═══════════════════════════════════════════════════════════');
    console.log('Module 3: ระบบ 5 แถบสี (The 5-Band System)');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('\nLessons:');
    module3.lessons.forEach((lesson, index) => {
        console.log(`  ${index + 1}. ${lesson.title}`);
    });
    console.log('\nSeeding completed!\n');
}

main()
    .catch((error) => {
        console.error('Error seeding Module 3:', error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
