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
    // MODULE 1: Reading Values (การอ่านค่า)
    // ==========================================
    const module1 = await prisma.module.create({
        data: {
            title: 'การอ่านค่า (Reading Values)',
            description: 'ถอดรหัสสีและตัวเลขบนตัวต้านทานทุกรูปแบบ',
            order: 1,
            isIntro: true,
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
