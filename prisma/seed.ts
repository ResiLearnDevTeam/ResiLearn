import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import path from 'path';
import bcrypt from 'bcryptjs';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

/**
 * Main seed function
 * 
 * This file includes all seed data including:
 * - Learning Path (Modules & Lessons) - previously in seed_learning_path.ts
 * 
 * Note: seed_learning_path.ts has been merged into this file.
 */
async function main() {
    console.log('Start seeding Resistor Mastery Learning Path (Thai)...');

    // Clear existing data
    await prisma.lessonHeroStat.deleteMany({});
    await prisma.lessonObjective.deleteMany({});
    await prisma.lessonSection.deleteMany({});
    await prisma.lessonQuizQuestion.deleteMany({});
    await prisma.lessonPracticeLink.deleteMany({});
    await prisma.lessonProgress.deleteMany({});
    await prisma.lesson.deleteMany({});
    await prisma.moduleProgress.deleteMany({});
    await prisma.module.deleteMany({});

    // ==========================================
    // MODULE 1: The Basics (พื้นฐานตัวต้านทาน)
    // ==========================================
    const module1 = await prisma.module.create({
        data: {
            title: 'พื้นฐานตัวต้านทาน',
            description: 'เริ่มต้นจากศูนย์: เข้าใจธรรมชาติของตัวต้านทาน กฎของโอห์ม และกำลังไฟฟ้า',
            order: 1,
            isIntro: true,
            lessons: {
                create: [
                    // Lesson 1.1: What is a Resistor?
                    {
                        title: 'ตัวต้านทานคืออะไร?',
                        order: 1,
                        strapline: 'ผู้คุมกฎแห่งวงจรไฟฟ้า',
                        summary: 'ทำความเข้าใจหน้าที่หลักของตัวต้านทาน เปรียบเทียบกับการไหลของน้ำ และรู้จักสัญลักษณ์ทางไฟฟ้า',
                        content: `
# ตัวต้านทาน: ฮีโร่ผู้ปิดทองหลังพระ

ในวงจรไฟฟ้าทุกชนิด ตั้งแต่ของเล่นเด็กไปจนถึงซูเปอร์คอมพิวเตอร์ คุณจะพบอุปกรณ์ชิ้นเล็กๆ ที่เรียกว่า **ตัวต้านทาน (Resistor)** อยู่เสมอ ทำไมมันถึงสำคัญขนาดนั้น?

## การเปรียบเทียบกับน้ำ (Water Analogy)
เพื่อให้เห็นภาพชัดเจน ลองจินตนาการว่าไฟฟ้าคือน้ำ:
*   **กระแสไฟฟ้า (Current)** = ปริมาณน้ำที่ไหล
*   **แรงดันไฟฟ้า (Voltage)** = แรงดันน้ำ
*   **ตัวต้านทาน (Resistor)** = **"ท่อที่ตีบแคบ"** หรือ **"ก้อนหินในลำธาร"**

<div class="my-8 flex justify-center">
  <svg width="500" height="220" viewBox="0 0 500 220" xmlns="http://www.w3.org/2000/svg">
    <!-- Pipe -->
    <rect x="50" y="80" width="400" height="60" fill="#E5E7EB" stroke="#9CA3AF" stroke-width="2"/>
    <!-- Water Flow -->
    <path d="M50 110 L180 110 Q250 110 250 120 Q250 130 320 130 L450 130" stroke="#3B82F6" stroke-width="20" fill="none" stroke-dasharray="15,10" opacity="0.6">
      <animate attributeName="stroke-dashoffset" from="100" to="0" dur="1.5s" repeatCount="indefinite" />
    </path>
    <!-- Resistor Restriction -->
    <rect x="200" y="70" width="100" height="80" fill="#EF4444" opacity="0.9" rx="8"/>
    <text x="250" y="115" text-anchor="middle" fill="white" font-weight="bold" font-size="16">R</text>
    
    <!-- Labels -->
    <text x="100" y="60" text-anchor="middle" fill="#374151" font-size="14">กระแสไหลสะดวก</text>
    <text x="400" y="60" text-anchor="middle" fill="#374151" font-size="14">กระแสไหลช้าลง</text>
    <text x="250" y="180" text-anchor="middle" fill="#EF4444" font-weight="bold" font-size="14">ตัวต้านทาน (จำกัดการไหล)</text>
  </svg>
</div>

หน้าที่ของมันคือ **"จำกัดปริมาณกระแสไฟฟ้า"** ไม่ให้ไหลผ่านวงจรมากเกินไปจนทำให้อุปกรณ์อื่นเสียหาย

## สัญลักษณ์ในวงจร
เมื่อคุณอ่านแบบแปลนวงจร (Schematic) คุณจะเจอสัญลักษณ์ 2 แบบ:
1.  **แบบ Zigzag (IEEE/ANSI)**: นิยมใช้ในอเมริกาและญี่ปุ่น
2.  **แบบสี่เหลี่ยม (IEC)**: นิยมใช้ในยุโรป

<div class="grid grid-cols-2 gap-8 my-6">
  <div class="flex flex-col items-center p-4 border rounded-xl bg-white shadow-sm">
    <svg width="120" height="40" viewBox="0 0 120 40">
      <path d="M10 20 L30 20 L35 10 L45 30 L55 10 L65 30 L75 10 L85 30 L90 20 L110 20" stroke="#000" stroke-width="2" fill="none"/>
    </svg>
    <span class="mt-2 text-sm text-gray-500">แบบอเมริกา (Zigzag)</span>
  </div>
  <div class="flex flex-col items-center p-4 border rounded-xl bg-white shadow-sm">
    <svg width="120" height="40" viewBox="0 0 120 40">
      <line x1="10" y1="20" x2="30" y2="20" stroke="#000" stroke-width="2"/>
      <rect x="30" y="10" width="60" height="20" stroke="#000" stroke-width="2" fill="none"/>
      <line x1="90" y1="20" x2="110" y2="20" stroke="#000" stroke-width="2"/>
    </svg>
    <span class="mt-2 text-sm text-gray-500">แบบยุโรป (IEC)</span>
  </div>
</div>
                        `,
                        heroStats: {
                            create: [
                                { label: 'ความยาก', value: 'ง่าย', order: 1 },
                                { label: 'เวลา', value: '5 นาที', order: 2 },
                            ]
                        },
                        objectives: {
                            create: [
                                { text: 'อธิบายหน้าที่ของตัวต้านทานได้', order: 1 },
                                { text: 'จำสัญลักษณ์ทางไฟฟ้าทั้ง 2 แบบได้', order: 2 },
                            ]
                        },
                        quizQuestions: {
                            create: [
                                {
                                    prompt: 'หากไม่มีตัวต้านทานในวงจรหลอดไฟ LED จะเกิดอะไรขึ้น?',
                                    options: ['ไฟจะสว่างน้อยลง', 'ไฟจะกระพริบ', 'หลอดไฟอาจขาดเพราะกระแสเกิน', 'ไม่มีผลอะไร'],
                                    answerIndex: 2,
                                    explanation: 'เพราะไม่มีตัวจำกัดกระแสไฟฟ้า ทำให้กระแสไหลผ่านหลอด LED มากเกินขีดจำกัดจนเสียหาย',
                                    order: 1
                                }
                            ]
                        }
                    },
                    // Lesson 1.2: Ohm's Law
                    {
                        title: 'กฎของโอห์ม (Ohm\'s Law)',
                        order: 2,
                        strapline: 'สมการเปลี่ยนโลก',
                        summary: 'เรียนรู้ความสัมพันธ์ระหว่าง แรงดัน (V), กระแส (I) และ ความต้านทาน (R) ที่เป็นหัวใจของอิเล็กทรอนิกส์',
                        content: `
# V = I × R

นี่คือสมการที่สำคัญที่สุดในวิชาอิเล็กทรอนิกส์ **กฎของโอห์ม (Ohm's Law)** ค้นพบโดย Georg Ohm นักฟิสิกส์ชาวเยอรมัน

## ความสัมพันธ์ 3 ทหารเสือ
*   **V (Voltage)**: แรงดันไฟฟ้า (หน่วย: โวลต์ V)
*   **I (Current)**: กระแสไฟฟ้า (หน่วย: แอมป์ A)
*   **R (Resistance)**: ความต้านทาน (หน่วย: โอห์ม Ω)

<div class="my-8 flex justify-center">
  <svg width="300" height="260" viewBox="0 0 300 260" xmlns="http://www.w3.org/2000/svg">
    <!-- Triangle Container -->
    <path d="M150 20 L280 240 L20 240 Z" fill="#FFF" stroke="#F97316" stroke-width="4"/>
    <!-- Horizontal Divider -->
    <line x1="85" y1="130" x2="215" y2="130" stroke="#F97316" stroke-width="3"/>
    <!-- Vertical Divider -->
    <line x1="150" y1="130" x2="150" y2="240" stroke="#F97316" stroke-width="3"/>
    
    <!-- Letters -->
    <text x="150" y="100" text-anchor="middle" font-size="48" font-weight="bold" fill="#1F2937">V</text>
    <text x="100" y="210" text-anchor="middle" font-size="48" font-weight="bold" fill="#1F2937">I</text>
    <text x="200" y="210" text-anchor="middle" font-size="48" font-weight="bold" fill="#1F2937">R</text>
    
    <!-- Operations -->
    <text x="150" y="190" text-anchor="middle" font-size="24" fill="#9CA3AF">×</text>
    <text x="230" y="120" text-anchor="middle" font-size="24" fill="#9CA3AF">÷</text>
  </svg>
</div>

## วิธีใช้สามเหลี่ยมโอห์ม
ปิดตัวแปรที่คุณต้องการหา แล้วดูว่าเหลืออะไร:
1.  **หา V**: ปิด V เหลือ **I × R**
2.  **หา I**: ปิด I เหลือ **V ÷ R**
3.  **หา R**: ปิด R เหลือ **V ÷ I**

> [!TIP]
> จำไว้เสมอ: ถ้าความต้านทาน (R) เพิ่มขึ้น กระแส (I) จะลดลง (เหมือนบีบท่อให้เล็กลง น้ำก็ไหลน้อยลง)
                        `,
                        heroStats: {
                            create: [
                                { label: 'ความยาก', value: 'ปานกลาง', order: 1 },
                                { label: 'เวลา', value: '10 นาที', order: 2 },
                            ]
                        },
                        objectives: {
                            create: [
                                { text: 'จำสูตร V = IR ได้', order: 1 },
                                { text: 'คำนวณหาค่ากระแสไฟฟ้าได้', order: 2 },
                            ]
                        },
                        quizQuestions: {
                            create: [
                                {
                                    prompt: 'ถ้ามีแรงดัน 10V และความต้านทาน 5Ω จะมีกระแสไหลเท่าไหร่?',
                                    options: ['0.5 A', '2 A', '50 A', '15 A'],
                                    answerIndex: 1,
                                    explanation: 'จากสูตร I = V / R จะได้ I = 10 / 5 = 2 แอมป์',
                                    order: 1
                                }
                            ]
                        }
                    },
                    // Lesson 1.3: Power Rating
                    {
                        title: 'กำลังวัตต์ (Power Rating)',
                        order: 3,
                        strapline: 'ขนาดนั้นสำคัญไฉน',
                        summary: 'ทำไมตัวต้านทานถึงมีหลายขนาด? เรียนรู้เรื่องการทนกำลังไฟเพื่อความปลอดภัย',
                        content: `
# เมื่อไฟฟ้าเปลี่ยนเป็นความร้อน

เมื่อตัวต้านทานขัดขวางกระแสไฟฟ้า พลังงานไฟฟ้าส่วนหนึ่งจะถูกเปลี่ยนเป็น **"ความร้อน"**
ถ้าความร้อนมากเกินไป ตัวต้านทานจะไหม้!

เราจึงต้องเลือก **ขนาดวัตต์ (Wattage)** ให้เหมาะสม

## ขนาดมาตรฐาน
ตัวต้านทานมีขนาดตัวที่แตกต่างกันตามกำลังวัตต์ที่ทนได้:
*   **1/4 Watt (0.25W)**: ขนาดปกติที่ใช้ทั่วไป (เล็กเท่าเม็ดข้าว)
*   **1/2 Watt (0.5W)**: ใหญ่ขึ้นมาหน่อย
*   **1 Watt**: เริ่มเห็นชัดเจน
*   **5 Watt (Cement)**: ก้อนสี่เหลี่ยมสีขาว ใหญ่และทนทาน

<div class="my-6 flex flex-col gap-4 items-center">
  <div class="flex items-center gap-4 w-full max-w-md p-3 bg-gray-50 rounded-lg">
    <div class="w-8 h-3 bg-orange-200 rounded-full border border-orange-400"></div>
    <span class="font-mono text-sm">1/4W (เล็กสุด)</span>
  </div>
  <div class="flex items-center gap-4 w-full max-w-md p-3 bg-gray-50 rounded-lg">
    <div class="w-12 h-4 bg-orange-200 rounded-full border border-orange-400"></div>
    <span class="font-mono text-sm">1/2W</span>
  </div>
  <div class="flex items-center gap-4 w-full max-w-md p-3 bg-gray-50 rounded-lg">
    <div class="w-24 h-8 bg-white border-2 border-gray-300 shadow-sm flex items-center justify-center text-xs text-gray-400">5W 10ΩJ</div>
    <span class="font-mono text-sm">5W (Cement)</span>
  </div>
</div>

## สูตรคำนวณวัตต์
**P = V × I**
(กำลังไฟฟ้า = แรงดัน × กระแส)

> [!WARNING]
> การเลือกวัตต์ต่ำกว่าที่คำนวณได้ จะทำให้ตัวต้านทานร้อนจัดจนไหม้หรือระเบิดได้ ควรเลือกเผื่อไว้เสมอ (เช่น คำนวณได้ 0.4W ควรใช้ 0.5W หรือ 1W)
                        `,
                        heroStats: {
                            create: [
                                { label: 'ความยาก', value: 'ปานกลาง', order: 1 },
                                { label: 'เวลา', value: '8 นาที', order: 2 },
                            ]
                        },
                        objectives: {
                            create: [
                                { text: 'เข้าใจความสัมพันธ์ระหว่างขนาดตัวและกำลังวัตต์', order: 1 },
                                { text: 'เลือกขนาดวัตต์ให้เหมาะสมกับงาน', order: 2 },
                            ]
                        },
                        quizQuestions: {
                            create: [
                                {
                                    prompt: 'ถ้าคำนวณกำลังไฟฟ้าได้ 0.8 วัตต์ ควรเลือกใช้ตัวต้านทานขนาดใด?',
                                    options: ['1/4 Watt', '1/2 Watt', '1 Watt', '1/8 Watt'],
                                    answerIndex: 2,
                                    explanation: 'ควรเลือกขนาดที่มากกว่าค่าที่คำนวณได้เสมอ 1 Watt จึงเป็นตัวเลือกที่ปลอดภัยที่สุด',
                                    order: 1
                                }
                            ]
                        }
                    }
                ]
            }
        }
    });

    // ==========================================
    // MODULE 2: Reading Values (การอ่านค่า)
    // ==========================================
    const module2 = await prisma.module.create({
        data: {
            title: 'การอ่านค่า (Reading Values)',
            description: 'ถอดรหัสสีและตัวเลขบนตัวต้านทานทุกรูปแบบ',
            order: 2,
            lessons: {
                create: [
                    // Lesson 2.1: Color Code System
                    {
                        title: 'รหัสสี 0-9',
                        order: 1,
                        strapline: 'ภาษาลับของวิศวกร',
                        summary: 'ท่องจำตารางสีมาตรฐาน ดำ(0) ถึง ขาว(9) พร้อมเทคนิคการจำ',
                        content: `
# ทำไมต้องใช้สี?
เพราะตัวเลขบนตัวต้านทานขนาดจิ๋วนั้นอ่านยากและลบเลือนง่าย วิศวกรจึงใช้ **แถบสี** คาดรอบตัวมันแทน ทำให้มองเห็นได้จากทุกทิศทาง

## ตารางสีมาตรฐาน
จำให้แม่น! นี่คือสูตรคูณของเด็กอิเล็กทรอนิกส์:

<div class="grid grid-cols-2 sm:grid-cols-5 gap-3 my-6">
  <div class="flex flex-col items-center p-2 bg-gray-50 rounded border"><div class="w-8 h-8 rounded-full bg-black mb-1"></div><span class="text-xs font-bold">ดำ 0</span></div>
  <div class="flex flex-col items-center p-2 bg-gray-50 rounded border"><div class="w-8 h-8 rounded-full bg-[#8B4513] mb-1"></div><span class="text-xs font-bold">น้ำตาล 1</span></div>
  <div class="flex flex-col items-center p-2 bg-gray-50 rounded border"><div class="w-8 h-8 rounded-full bg-red-600 mb-1"></div><span class="text-xs font-bold">แดง 2</span></div>
  <div class="flex flex-col items-center p-2 bg-gray-50 rounded border"><div class="w-8 h-8 rounded-full bg-orange-500 mb-1"></div><span class="text-xs font-bold">ส้ม 3</span></div>
  <div class="flex flex-col items-center p-2 bg-gray-50 rounded border"><div class="w-8 h-8 rounded-full bg-yellow-400 mb-1"></div><span class="text-xs font-bold">เหลือง 4</span></div>
  <div class="flex flex-col items-center p-2 bg-gray-50 rounded border"><div class="w-8 h-8 rounded-full bg-green-600 mb-1"></div><span class="text-xs font-bold">เขียว 5</span></div>
  <div class="flex flex-col items-center p-2 bg-gray-50 rounded border"><div class="w-8 h-8 rounded-full bg-blue-600 mb-1"></div><span class="text-xs font-bold">น้ำเงิน 6</span></div>
  <div class="flex flex-col items-center p-2 bg-gray-50 rounded border"><div class="w-8 h-8 rounded-full bg-purple-600 mb-1"></div><span class="text-xs font-bold">ม่วง 7</span></div>
  <div class="flex flex-col items-center p-2 bg-gray-50 rounded border"><div class="w-8 h-8 rounded-full bg-gray-500 mb-1"></div><span class="text-xs font-bold">เทา 8</span></div>
  <div class="flex flex-col items-center p-2 bg-gray-50 rounded border"><div class="w-8 h-8 rounded-full bg-white border mb-1"></div><span class="text-xs font-bold">ขาว 9</span></div>
</div>

## เทคนิคการจำ
ท่องเป็นจังหวะ: **"ดำ0 น้ำตาล1 แดง2 ส้ม3 เหลือง4 เขียว5 น้ำเงิน6 ม่วง7 เทา8 ขาว9"**
                        `,
                        heroStats: {
                            create: [
                                { label: 'ความยาก', value: 'ง่าย', order: 1 },
                                { label: 'เวลา', value: '10 นาที', order: 2 },
                            ]
                        },
                        objectives: {
                            create: [
                                { text: 'จำค่าตัวเลขของสีทั้ง 10 สีได้', order: 1 }
                            ]
                        },
                        quizQuestions: {
                            create: [
                                {
                                    prompt: 'สีแดง (Red) มีค่าเท่ากับเท่าไหร่?',
                                    options: ['1', '2', '3', '4'],
                                    answerIndex: 1,
                                    explanation: 'แดง = 2',
                                    order: 1
                                }
                            ]
                        }
                    },
                    // Lesson 2.2: 4-Band System
                    {
                        title: 'ระบบ 4 แถบสี',
                        order: 2,
                        strapline: 'มาตรฐานโลก',
                        summary: 'วิธีอ่านค่าตัวต้านทานแบบ 4 แถบ ซึ่งเป็นแบบที่พบบ่อยที่สุด',
                        content: `
# วิธีอ่าน 4 แถบ
นี่คือรูปแบบที่คุณจะเจอ 90% ในชีวิตจริง:

1.  **แถบที่ 1**: ตัวเลขหลักแรก
2.  **แถบที่ 2**: ตัวเลขหลักที่สอง
3.  **แถบที่ 3**: **ตัวคูณ (Multiplier)** หรือจำนวนเลข 0 ที่ต้องเติม
4.  **แถบที่ 4**: ค่าความผิดพลาด (Tolerance) มักเป็นสีทอง (5%)

<div class="my-8 flex justify-center">
  <svg width="400" height="120" viewBox="0 0 400 120">
    <path d="M50 60 L100 60 L100 30 L300 30 L300 90 L100 90 L100 60 M300 60 L350 60" stroke="#374151" stroke-width="4" fill="#F3F4F6"/>
    <rect x="130" y="30" width="15" height="60" fill="#8B4513"/> <!-- Brown 1 -->
    <rect x="170" y="30" width="15" height="60" fill="#000000"/> <!-- Black 0 -->
    <rect x="210" y="30" width="15" height="60" fill="#DC2626"/> <!-- Red x100 -->
    <rect x="270" y="30" width="15" height="60" fill="#FFD700"/> <!-- Gold 5% -->
    <text x="137" y="110" text-anchor="middle" font-size="10">1</text>
    <text x="177" y="110" text-anchor="middle" font-size="10">0</text>
    <text x="217" y="110" text-anchor="middle" font-size="10">x100</text>
    <text x="277" y="110" text-anchor="middle" font-size="10">±5%</text>
  </svg>
</div>

## ตัวอย่าง: น้ำตาล - ดำ - แดง - ทอง
1.  **น้ำตาล** = 1
2.  **ดำ** = 0
3.  **แดง** = เติม 0 สองตัว (00)
4.  **ทอง** = ±5%

รวมร่าง: **1 0 00** = **1,000 Ω** หรือ **1 kΩ**
                        `,
                        heroStats: {
                            create: [
                                { label: 'ความยาก', value: 'ปานกลาง', order: 1 },
                                { label: 'เวลา', value: '15 นาที', order: 2 },
                            ]
                        },
                        objectives: {
                            create: [
                                { text: 'อ่านค่าตัวต้านทาน 4 แถบได้ถูกต้อง', order: 1 },
                                { text: 'แปลงหน่วย Ω เป็น kΩ ได้', order: 2 },
                            ]
                        },
                        quizQuestions: {
                            create: [
                                {
                                    prompt: 'ส้ม - ส้ม - น้ำตาล - ทอง อ่านค่าได้เท่าไหร่?',
                                    options: ['330 Ω', '3.3 kΩ', '33 Ω', '330 kΩ'],
                                    answerIndex: 0,
                                    explanation: 'ส้ม(3) ส้ม(3) น้ำตาล(เติม 0 หนึ่งตัว) = 330 Ω',
                                    order: 1
                                }
                            ]
                        }
                    },
                    // Lesson 2.3: 5-Band System
                    {
                        title: 'ระบบ 5 แถบสี',
                        order: 3,
                        strapline: 'ความแม่นยำสูง',
                        summary: 'สำหรับงานที่ต้องการความละเอียด อ่านค่าแบบ 5 แถบที่มีเลขทศนิยมเพิ่มมาอีกหลัก',
                        content: `
# เมื่อ 2 หลักไม่พอ
ในงานเครื่องเสียงหรือเครื่องมือวัด เราต้องการความแม่นยำสูงกว่าปกติ ระบบ 5 แถบจึงเพิ่ม **ตัวเลขหลักที่ 3** เข้ามา

1.  **แถบ 1**: หลักที่ 1
2.  **แถบ 2**: หลักที่ 2
3.  **แถบ 3**: **หลักที่ 3** (นี่คือส่วนที่เพิ่มมา!)
4.  **แถบ 4**: ตัวคูณ
5.  **แถบ 5**: ความผิดพลาด (มักเป็นสีน้ำตาล ±1%)

## เปรียบเทียบ
*   **4 แถบ**: แดง แดง แดง = 2 2 00 = **2,200 Ω**
*   **5 แถบ**: แดง แดง ดำ น้ำตาล = 2 2 0 0 = **2,200 Ω** (แต่ละเอียดกว่า)

> [!NOTE]
> วิธีสังเกต: แถบความผิดพลาดของ 5 แถบมักจะเป็นสีน้ำตาล (1%) ซึ่งอาจสับสนกับแถบตัวเลข ให้ดูระยะห่าง แถบความผิดพลาดจะอยู่ห่างจากกลุ่มเพื่อนเล็กน้อย
                        `,
                        heroStats: {
                            create: [
                                { label: 'ความยาก', value: 'ยาก', order: 1 },
                                { label: 'เวลา', value: '10 นาที', order: 2 },
                            ]
                        },
                        objectives: {
                            create: [
                                { text: 'แยกแยะความแตกต่างระหว่าง 4 และ 5 แถบได้', order: 1 }
                            ]
                        },
                        quizQuestions: {
                            create: [
                                {
                                    prompt: 'ในระบบ 5 แถบ แถบที่ 4 ทำหน้าที่อะไร?',
                                    options: ['ตัวเลขหลักที่ 3', 'ตัวคูณ', 'ค่าความผิดพลาด', 'บอกอุณหภูมิ'],
                                    answerIndex: 1,
                                    explanation: 'แถบที่ 1-3 คือตัวเลข แถบที่ 4 คือตัวคูณ',
                                    order: 1
                                }
                            ]
                        }
                    },
                    // Lesson 2.4: SMD Codes
                    {
                        title: 'รหัส SMD (Surface Mount)',
                        order: 4,
                        strapline: 'จิ๋วแต่แจ๋ว',
                        summary: 'วิธีอ่านรหัสตัวเลขบนตัวต้านทานแบบแปะปริ้นท์ (SMD) ที่อยู่ในมือถือและคอมพิวเตอร์',
                        content: `
# ยุคของความจิ๋ว
ในอุปกรณ์สมัยใหม่ เราใช้ตัวต้านทานแบบ **SMD (Surface Mount Device)** ที่ไม่มีขาและตัวเล็กมาก จึงใช้ตัวเลขพิมพ์ลงไปตรงๆ แทนแถบสี

## รหัส 3 หลัก (มาตรฐาน)
หลักการเดียวกับแถบสี: **"เลข เลข ตัวคูณ"**
*   **103** = 1 0 เติมศูนย์ 3 ตัว = 10,000 = **10 kΩ**
*   **472** = 4 7 เติมศูนย์ 2 ตัว = 4,700 = **4.7 kΩ**
*   **220** = 2 2 เติมศูนย์ 0 ตัว (ไม่เติม) = **22 Ω**

## รหัสที่มีตัว R
ตัว **R** ใช้แทน **จุดทศนิยม** (สำหรับค่าน้อยๆ)
*   **4R7** = 4.7 Ω
*   **R22** = 0.22 Ω
*   **0R** = 0 Ω (ใช้เป็นสะพานไฟ หรือ Fuse)

<div class="my-6 flex justify-center gap-4">
  <div class="w-24 h-12 bg-gray-800 flex items-center justify-center text-white font-mono text-xl rounded shadow-md border-t-2 border-gray-600">103</div>
  <div class="w-24 h-12 bg-gray-800 flex items-center justify-center text-white font-mono text-xl rounded shadow-md border-t-2 border-gray-600">4R7</div>
</div>
                        `,
                        heroStats: {
                            create: [
                                { label: 'ความยาก', value: 'ปานกลาง', order: 1 },
                                { label: 'เวลา', value: '8 นาที', order: 2 },
                            ]
                        },
                        objectives: {
                            create: [
                                { text: 'อ่านรหัส SMD 3 หลักได้', order: 1 },
                                { text: 'เข้าใจความหมายของตัว R ในรหัส', order: 2 },
                            ]
                        },
                        quizQuestions: {
                            create: [
                                {
                                    prompt: 'รหัส "102" มีค่าเท่ากับเท่าไหร่?',
                                    options: ['102 Ω', '1,000 Ω', '100 Ω', '10 Ω'],
                                    answerIndex: 1,
                                    explanation: '1 0 เติมศูนย์ 2 ตัว = 1,000 Ω หรือ 1 kΩ',
                                    order: 1
                                }
                            ]
                        }
                    }
                ]
            }
        }
    });

    // ==========================================
    // MODULE 3: Circuit Connections (การต่อวงจร)
    // ==========================================
    const module3 = await prisma.module.create({
        data: {
            title: 'การต่อวงจร (Circuit Connections)',
            description: 'อนุกรม ขนาน และผสม: คำนวณความต้านทานรวมในรูปแบบต่างๆ',
            order: 3,
            lessons: {
                create: [
                    // Lesson 3.1: Series
                    {
                        title: 'วงจรอนุกรม (Series)',
                        order: 1,
                        strapline: 'เรียงแถวกันไป',
                        summary: 'การต่อแบบหางต่อหัว ความต้านทานรวมจะเพิ่มขึ้นเสมอ',
                        content: `
# การต่อแบบอนุกรม
คือการนำตัวต้านทานมาต่อเรียงกันเป็นแถวเดียว เหมือนขบวนรถไฟ กระแสไฟฟ้ามีทางเดินเดียว ไหลผ่านตัวแรกแล้วต้องผ่านตัวถัดไป

## สูตรคำนวณ
ง่ายที่สุด! แค่จับบวกกัน:
**R_total = R1 + R2 + R3 + ...**

<div class="my-8 flex justify-center">
  <svg width="400" height="100" viewBox="0 0 400 100">
    <line x1="50" y1="50" x2="100" y2="50" stroke="#000" stroke-width="2"/>
    <rect x="100" y="35" width="60" height="30" fill="white" stroke="#000" stroke-width="2"/>
    <text x="130" y="55" text-anchor="middle" font-size="12">R1</text>
    
    <line x1="160" y1="50" x2="200" y2="50" stroke="#000" stroke-width="2"/>
    
    <rect x="200" y="35" width="60" height="30" fill="white" stroke="#000" stroke-width="2"/>
    <text x="230" y="55" text-anchor="middle" font-size="12">R2</text>
    
    <line x1="260" y1="50" x2="310" y2="50" stroke="#000" stroke-width="2"/>
  </svg>
</div>

## คุณสมบัติ
1.  **ความต้านทานรวมเพิ่มขึ้น** (ยิ่งต่อยิ่งต้านทานมาก)
2.  **กระแสไฟฟ้าเท่ากัน** ทั้งวงจร
3.  **แรงดันไฟฟ้าถูกแบ่ง** ไปตกคร่อมแต่ละตัว (Voltage Divider)
                        `,
                        heroStats: {
                            create: [
                                { label: 'ความยาก', value: 'ง่าย', order: 1 },
                                { label: 'เวลา', value: '10 นาที', order: 2 },
                            ]
                        },
                        objectives: {
                            create: [
                                { text: 'คำนวณความต้านทานรวมวงจรอนุกรมได้', order: 1 }
                            ]
                        },
                        quizQuestions: {
                            create: [
                                {
                                    prompt: 'R1 = 100Ω ต่ออนุกรมกับ R2 = 200Ω ความต้านทานรวมคือ?',
                                    options: ['150Ω', '300Ω', '66Ω', '20000Ω'],
                                    answerIndex: 1,
                                    explanation: '100 + 200 = 300Ω',
                                    order: 1
                                }
                            ]
                        }
                    },
                    // Lesson 3.2: Parallel
                    {
                        title: 'วงจรขนาน (Parallel)',
                        order: 2,
                        strapline: 'ทางใครทางมัน',
                        summary: 'การต่อแบบคร่อมกัน กระแสไฟฟ้ามีหลายทางเลือก ความต้านทานรวมจะลดลง',
                        content: `
# การต่อแบบขนาน
คือการนำขาของตัวต้านทานมารวบเข้าด้วยกันทั้งสองข้าง เหมือนเลนถนนที่มีหลายเลนให้รถวิ่ง กระแสไฟฟ้าแบ่งไหลได้หลายทาง

## สูตรคำนวณ
**1/Rt = 1/R1 + 1/R2 + ...**

หรือถ้ามีแค่ 2 ตัว ใช้สูตรลัด:
**Rt = (R1 × R2) / (R1 + R2)** (คูณกัน หารด้วย บวกกัน)

<div class="my-8 flex justify-center">
  <svg width="400" height="150" viewBox="0 0 400 150">
    <line x1="50" y1="75" x2="100" y2="75" stroke="#000" stroke-width="2"/>
    <line x1="100" y1="40" x2="100" y2="110" stroke="#000" stroke-width="2"/>
    
    <!-- Top Resistor -->
    <line x1="100" y1="40" x2="150" y2="40" stroke="#000" stroke-width="2"/>
    <rect x="150" y="25" width="60" height="30" fill="white" stroke="#000" stroke-width="2"/>
    <text x="180" y="45" text-anchor="middle" font-size="12">R1</text>
    <line x1="210" y1="40" x2="260" y2="40" stroke="#000" stroke-width="2"/>
    
    <!-- Bottom Resistor -->
    <line x1="100" y1="110" x2="150" y2="110" stroke="#000" stroke-width="2"/>
    <rect x="150" y="95" width="60" height="30" fill="white" stroke="#000" stroke-width="2"/>
    <text x="180" y="115" text-anchor="middle" font-size="12">R2</text>
    <line x1="210" y1="110" x2="260" y2="110" stroke="#000" stroke-width="2"/>
    
    <line x1="260" y1="40" x2="260" y2="110" stroke="#000" stroke-width="2"/>
    <line x1="260" y1="75" x2="310" y2="75" stroke="#000" stroke-width="2"/>
  </svg>
</div>

## คุณสมบัติ
1.  **ความต้านทานรวมลดลง** (ยิ่งต่อขนาน ยิ่งต้านทานน้อยลง)
2.  **แรงดันไฟฟ้าเท่ากัน** ทุกตัว
3.  **กระแสไฟฟ้าถูกแบ่ง** ไหลผ่านแต่ละตัวไม่เท่ากัน (ตัวไหนต้านทานน้อย กระแสไหลผ่านมาก)
                        `,
                        heroStats: {
                            create: [
                                { label: 'ความยาก', value: 'ยาก', order: 1 },
                                { label: 'เวลา', value: '15 นาที', order: 2 },
                            ]
                        },
                        objectives: {
                            create: [
                                { text: 'คำนวณความต้านทานรวมวงจรขนานได้', order: 1 },
                                { text: 'เข้าใจว่าทำไมความต้านทานรวมถึงลดลง', order: 2 },
                            ]
                        },
                        quizQuestions: {
                            create: [
                                {
                                    prompt: 'R1 = 100Ω ต่อขนานกับ R2 = 100Ω ความต้านทานรวมคือ?',
                                    options: ['200Ω', '100Ω', '50Ω', '10Ω'],
                                    answerIndex: 2,
                                    explanation: 'สูตรลัด: ถ้าตัวต้านทานค่าเท่ากัน 2 ตัวต่อขนานกัน ค่าจะลดลงครึ่งหนึ่งเหลือ 50Ω',
                                    order: 1
                                }
                            ]
                        }
                    },
                    // Lesson 3.3: Voltage Divider
                    {
                        title: 'วงจรแบ่งแรงดัน (Voltage Divider)',
                        order: 3,
                        strapline: 'ประยุกต์ใช้วงจรอนุกรม',
                        summary: 'วงจรพื้นฐานที่สำคัญที่สุดในการแปลงระดับแรงดันไฟฟ้า',
                        content: `
# วงจรแบ่งแรงดันคืออะไร?
มันคือการนำตัวต้านทาน 2 ตัวมาต่ออนุกรมกัน เพื่อ "แบ่ง" แรงดันไฟฟ้าจากแหล่งจ่ายให้ลดลงตามที่เราต้องการ มักใช้ในการอ่านค่าจากเซนเซอร์

## สูตรคำนวณ
**V_out = V_in × (R2 / (R1 + R2))**

*   **V_in**: แรงดันขาเข้า
*   **V_out**: แรงดันขาออก (วัดคร่อม R2)

<div class="my-8 flex justify-center">
  <svg width="200" height="200" viewBox="0 0 200 200">
    <text x="100" y="20" text-anchor="middle" font-size="12">Vin</text>
    <line x1="100" y1="30" x2="100" y2="50" stroke="#000" stroke-width="2"/>
    <rect x="85" y="50" width="30" height="40" fill="white" stroke="#000" stroke-width="2"/>
    <text x="130" y="75" font-size="12">R1</text>
    
    <line x1="100" y1="90" x2="100" y2="110" stroke="#000" stroke-width="2"/>
    <line x1="100" y1="100" x2="150" y2="100" stroke="#000" stroke-width="2"/>
    <text x="160" y="105" font-size="12">Vout</text>
    
    <rect x="85" y="110" width="30" height="40" fill="white" stroke="#000" stroke-width="2"/>
    <text x="130" y="135" font-size="12">R2</text>
    
    <line x1="100" y1="150" x2="100" y2="170" stroke="#000" stroke-width="2"/>
    <line x1="80" y1="170" x2="120" y2="170" stroke="#000" stroke-width="2"/>
    <text x="100" y="185" text-anchor="middle" font-size="12">GND</text>
  </svg>
</div>

> [!IMPORTANT]
> วงจรแบ่งแรงดันใช้สำหรับ **สัญญาณ (Signal)** หรือกระแสต่ำๆ เท่านั้น ห้ามนำไปใช้ลดแรงดันเพื่อจ่ายไฟให้มอเตอร์หรือหลอดไฟ เพราะ R จะร้อนจัดและแรงดันจะตกวูบ
                        `,
                        heroStats: {
                            create: [
                                { label: 'ความยาก', value: 'ยาก', order: 1 },
                                { label: 'เวลา', value: '15 นาที', order: 2 },
                            ]
                        },
                        objectives: {
                            create: [
                                { text: 'เข้าใจหลักการแบ่งแรงดัน', order: 1 },
                                { text: 'คำนวณ V_out ได้', order: 2 },
                            ]
                        },
                        quizQuestions: {
                            create: [
                                {
                                    prompt: 'ถ้า R1 = R2 แรงดันขาออก (Vout) จะเป็นเท่าไหร่ของแรงดันขาเข้า (Vin)?',
                                    options: ['เท่าเดิม', 'ครึ่งหนึ่ง', 'หนึ่งในสาม', 'สองเท่า'],
                                    answerIndex: 1,
                                    explanation: 'ถ้าความต้านทานเท่ากัน แรงดันจะถูกแบ่งครึ่งพอดี',
                                    order: 1
                                }
                            ]
                        }
                    }
                ]
            }
        }
    });

    // ==========================================
    // MODULE 4: Special Resistors (ตัวต้านทานพิเศษ)
    // ==========================================
    const module4 = await prisma.module.create({
        data: {
            title: 'ตัวต้านทานพิเศษ',
            description: 'เมื่อความต้านทานไม่ได้คงที่เสมอไป: รู้จักตัวต้านทานปรับค่าได้และเซนเซอร์',
            order: 4,
            lessons: {
                create: [
                    // Lesson 4.1: Variable Resistors
                    {
                        title: 'ตัวต้านทานปรับค่าได้',
                        order: 1,
                        strapline: 'หมุนเพื่อเปลี่ยนค่า',
                        summary: 'รู้จัก Potentiometer (Volume) และ Trimmer ที่ใช้ปรับแต่งวงจร',
                        content: `
# Potentiometer (VR)
หรือที่เราเรียกกันติดปากว่า **"วอลลุ่ม"** (Volume) คือตัวต้านทานที่สามารถเปลี่ยนค่าได้โดยการหมุนแกน

## โครงสร้างภายใน
มันคือแถบความต้านทานโค้งๆ และมี "ขากวาด" (Wiper) เลื่อนไปมาบนแถบนั้น
*   **ขา 1 & 3**: ความต้านทานคงที่ (ค่าสูงสุดของตัวมัน)
*   **ขา 2 (กลาง)**: ขาที่เปลี่ยนค่าได้เทียบกับขา 1 หรือ 3

<div class="my-8 flex justify-center">
  <svg width="300" height="150" viewBox="0 0 300 150">
    <path d="M50 100 A 100 100 0 0 1 250 100" stroke="#4B5563" stroke-width="15" fill="none" stroke-linecap="round"/>
    <circle cx="150" cy="100" r="10" fill="#9CA3AF"/>
    <line x1="150" y1="100" x2="150" y2="40" stroke="#EF4444" stroke-width="5"/>
    <polygon points="140,40 160,40 150,20" fill="#EF4444"/>
    
    <text x="40" y="130" text-anchor="middle">ขา 1</text>
    <text x="150" y="140" text-anchor="middle" font-weight="bold" fill="#EF4444">ขา 2 (Wiper)</text>
    <text x="260" y="130" text-anchor="middle">ขา 3</text>
  </svg>
</div>

## การใช้งาน
*   ปรับความดังเสียง (Volume)
*   ปรับความสว่างไฟ (Dimmer)
*   จอยสติ๊ก (Joystick)
                        `,
                        heroStats: {
                            create: [
                                { label: 'ความยาก', value: 'ง่าย', order: 1 },
                                { label: 'เวลา', value: '8 นาที', order: 2 },
                            ]
                        },
                        objectives: {
                            create: [
                                { text: 'เข้าใจการทำงานของขา 1, 2, 3', order: 1 },
                                { text: 'รู้วิธีต่อใช้งานเบื้องต้น', order: 2 },
                            ]
                        },
                        quizQuestions: {
                            create: [
                                {
                                    prompt: 'ขาใดของ Potentiometer ที่ค่าความต้านทานจะเปลี่ยนเมื่อเราหมุนแกน?',
                                    options: ['ขา 1', 'ขา 3', 'ขา 2 (ขา กลาง)', 'ทุกขา'],
                                    answerIndex: 2,
                                    explanation: 'ขา 2 คือขากวาด (Wiper) ที่เลื่อนไปมาเพื่อเปลี่ยนค่าความต้านทาน',
                                    order: 1
                                }
                            ]
                        }
                    },
                    // Lesson 4.2: Sensors
                    {
                        title: 'ตัวต้านทานเปลี่ยนค่าตามสภาพแวดล้อม',
                        order: 2,
                        strapline: 'เซนเซอร์พื้นฐาน',
                        summary: 'รู้จัก LDR (แสง) และ Thermistor (อุณหภูมิ) ที่เปลี่ยนโลกกายภาพเป็นสัญญาณไฟฟ้า',
                        content: `
# LDR (Light Dependent Resistor)
หรือ **"ตัวต้านทานไวแสง"**
*   **แสงมาก** = ความต้านทาน **ต่ำ** (ยอมให้ไฟไหลผ่านง่าย)
*   **แสงน้อย** = ความต้านทาน **สูง**

ใช้ใน: ไฟถนนอัตโนมัติ (มืดแล้วไฟติด)

# Thermistor
ตัวต้านทานไวอุณหภูมิ มี 2 แบบหลัก:
1.  **NTC (Negative)**: ร้อนขึ้น -> ต้านทานลดลง (นิยมใช้มากสุด)
2.  **PTC (Positive)**: ร้อนขึ้น -> ต้านทานเพิ่มขึ้น

ใช้ใน: เครื่องปรับอากาศ, ตู้เย็น, วัดไข้ดิจิตอล

> [!TIP]
> อุปกรณ์เหล่านี้คือหัวใจของระบบ IoT ที่ทำให้อุปกรณ์อิเล็กทรอนิกส์ "รับรู้" สิ่งแวดล้อมได้
                        `,
                        heroStats: {
                            create: [
                                { label: 'ความยาก', value: 'ปานกลาง', order: 1 },
                                { label: 'เวลา', value: '10 นาที', order: 2 },
                            ]
                        },
                        objectives: {
                            create: [
                                { text: 'อธิบายหลักการทำงานของ LDR ได้', order: 1 },
                                { text: 'รู้จัก NTC และ PTC', order: 2 },
                            ]
                        },
                        quizQuestions: {
                            create: [
                                {
                                    prompt: 'LDR จะมีความต้านทานสูงที่สุดในสภาวะใด?',
                                    options: ['กลางแดดจัด', 'ในที่มืดสนิท', 'ในห้องที่มีไฟนีออน', 'เมื่ออุณหภูมิสูง'],
                                    answerIndex: 1,
                                    explanation: 'LDR ยิ่งมืด ยิ่งต้านทานสูง (Dark Resistance)',
                                    order: 1
                                }
                            ]
                        }
                    }
                ]
            }
        }
    });

    // ==========================================
    // TEST USER ACCOUNT
    // ==========================================
    console.log('Creating test user account...');
    
    const testEmail = '1@1.com';
    const testPassword = '1@1.com';
    const hashedPassword = await bcrypt.hash(testPassword, 10);

    // Delete existing test user if exists
    await prisma.user.deleteMany({
        where: { email: testEmail }
    });

    // Create test user
    const testUser = await prisma.user.create({
        data: {
            email: testEmail,
            name: 'Test User',
            password: hashedPassword,
            role: 'STUDENT',
            currentLevel: 1,
            levelsUnlocked: [1],
        }
    });

    console.log(`Test user created: ${testUser.email} (ID: ${testUser.id})`);
    console.log('Test credentials:');
    console.log(`  Email: ${testEmail}`);
    console.log(`  Password: ${testPassword}`);

    console.log('Seeding completed! (Resistor Mastery Content + Test User)');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
