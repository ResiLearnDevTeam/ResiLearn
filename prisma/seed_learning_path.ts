import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding learning path (Thai)...');

    // Clear existing data
    // Delete in reverse order of dependencies
    await prisma.lessonHeroStat.deleteMany({});
    await prisma.lessonObjective.deleteMany({});
    await prisma.lessonSection.deleteMany({});
    await prisma.lessonQuizQuestion.deleteMany({});
    await prisma.lessonPracticeLink.deleteMany({});
    await prisma.lessonProgress.deleteMany({});
    await prisma.lesson.deleteMany({});
    await prisma.moduleProgress.deleteMany({});
    await prisma.module.deleteMany({});

    // --- Module 1: Introduction to Resistors (บทนำเกี่ยวกับตัวต้านทาน) ---
    const module1 = await prisma.module.create({
        data: {
            title: 'บทนำเกี่ยวกับตัวต้านทาน',
            description: 'เริ่มต้นการเรียนรู้ของคุณด้วยการทำความเข้าใจว่าตัวต้านทานคืออะไรและทำไมจึงสำคัญในวงจรอิเล็กทรอนิกส์',
            order: 1,
            isIntro: true,
            lessons: {
                create: [
                    {
                        title: 'ตัวต้านทานคืออะไร?',
                        order: 1,
                        strapline: 'องค์ประกอบพื้นฐานของอิเล็กทรอนิกส์',
                        summary: 'เรียนรู้หน้าที่พื้นฐานของตัวต้านทาน: การจำกัดการไหลของกระแสไฟฟ้า',
                        content: `
# ผู้ควบคุมกระแสไฟฟ้า
ลองจินตนาการว่ากระแสไฟฟ้าคือน้ำที่ไหลผ่านท่อ หากไม่มีอะไรมาขวางกั้น น้ำก็จะไหลเชี่ยวและอาจทำลายอุปกรณ์ที่บอบบางได้

**ตัวต้านทาน (Resistor)** ทำหน้าที่เหมือนการบีบท่อให้น้ำไหลช้าลง ในทางไฟฟ้า มันช่วย:
*   **จำกัดกระแสไฟฟ้า** ไม่ให้ไหลมากเกินไปจนวงจรเสียหาย
*   **แบ่งแรงดันไฟฟ้า** ให้เหมาะสมกับอุปกรณ์ต่างๆ

## สัญลักษณ์
ในวงจรไฟฟ้า คุณจะเห็นสัญลักษณ์ของตัวต้านทานเป็นเส้นหยัก (แบบอเมริกา) หรือสี่เหลี่ยมผืนผ้า (แบบยุโรป)
            `,
                        heroStats: {
                            create: [
                                { label: 'ความยาก', value: 'เริ่มต้น', order: 1 },
                                { label: 'เวลา', value: '5 นาที', order: 2 },
                            ]
                        },
                        objectives: {
                            create: [
                                { text: 'อธิบายความหมายของตัวต้านทาน', order: 1 },
                                { text: 'เข้าใจการเปรียบเทียบกับการไหลของน้ำ', order: 2 },
                            ]
                        },
                        sections: {
                            create: [
                                {
                                    slug: 'basics',
                                    title: 'พื้นฐาน',
                                    order: 1,
                                    content: [
                                        { type: 'text', value: 'ตัวต้านทานเป็นอุปกรณ์แบบพาสซีฟ (Passive) หมายความว่ามันไม่สามารถสร้างพลังงานได้เอง แต่จะใช้พลังงานไปในรูปของความร้อน' }
                                    ]
                                }
                            ]
                        },
                        quizQuestions: {
                            create: [
                                {
                                    prompt: 'หน่วยวัดของความต้านทานคืออะไร?',
                                    options: ['โวลต์ (Volts)', 'แอมป์ (Amps)', 'โอห์ม (Ohms)', 'วัตต์ (Watts)'],
                                    answerIndex: 2,
                                    explanation: 'ความต้านทานมีหน่วยเป็น โอห์ม (Ohms) ตั้งชื่อเพื่อเป็นเกียรติแก่ Georg Ohm',
                                    order: 1
                                }
                            ]
                        }
                    },
                    {
                        title: 'ทำไมเราต้องอ่านค่าสี?',
                        order: 2,
                        strapline: 'รหัสลับบนตัวต้านทาน',
                        summary: 'เข้าใจเหตุผลที่ตัวต้านทานใช้แถบสีแทนการพิมพ์ตัวเลข',
                        content: `
# เล็กเกินกว่าจะพิมพ์
ตัวต้านทานส่วนใหญ่มีขนาดเล็กมาก การพิมพ์ตัวเลขลงไปตรงๆ จะทำให้อ่านยากมาก โดยเฉพาะเมื่อมันถูกบัดกรีลงในวงจรแล้ว

## ระบบรหัสสี
วิศวกรจึงคิดค้น **รหัสสี (Color Code)** ขึ้นมา แถบสีเหล่านี้รอบตัวต้านทานช่วยให้เราอ่านค่าได้จากทุกทิศทาง ไม่ว่าตัวต้านทานจะหมุนไปทางไหน
            `,
                        heroStats: {
                            create: [
                                { label: 'ความยาก', value: 'เริ่มต้น', order: 1 },
                                { label: 'เวลา', value: '3 นาที', order: 2 },
                            ]
                        },
                        objectives: {
                            create: [
                                { text: 'บอกเหตุผลที่ต้องใช้รหัสสี', order: 1 },
                                { text: 'รู้ข้อดีของการอ่านค่าจากแถบสี', order: 2 },
                            ]
                        },
                        quizQuestions: {
                            create: [
                                {
                                    prompt: 'ทำไมตัวต้านทานถึงใช้แถบสีแทนตัวเลข?',
                                    options: ['เพื่อความสวยงาม', 'เพราะตัวต้านทานมีขนาดเล็กและอ่านค่าได้รอบทิศทาง', 'เพราะสีราคาถูกกว่าหมึกดำ', 'เพื่อแยกแยะยี่ห้อผู้ผลิต'],
                                    answerIndex: 1,
                                    explanation: 'แถบสีช่วยให้ระบุค่าได้ง่ายแม้ตัวต้านทานจะเล็กหรือถูกติดตั้งในมุมต่างๆ',
                                    order: 1
                                }
                            ]
                        }
                    }
                ]
            }
        }
    });

    // --- Module 2: The 4-Band Color Code (รหัสสีแบบ 4 แถบ) ---
    const module2 = await prisma.module.create({
        data: {
            title: 'รหัสสีแบบ 4 แถบ',
            description: 'เจาะลึกระบบรหัสสีที่พบบ่อยที่สุด เรียนรู้วิธีอ่านค่าความต้านทานจากแถบสีทั้ง 4',
            order: 2,
            lessons: {
                create: [
                    {
                        title: 'โครงสร้าง 4 แถบ',
                        order: 1,
                        strapline: 'แกะรหัสทีละแถบ',
                        summary: 'เรียนรู้ความหมายของแต่ละแถบสีในระบบ 4 แถบ',
                        content: `
# 4 แถบมีอะไรบ้าง?
ในระบบ 4 แถบ แต่ละแถบมีความหมายเฉพาะ:

1.  **แถบที่ 1**: ตัวเลขหลักแรก
2.  **แถบที่ 2**: ตัวเลขหลักที่สอง
3.  **แถบที่ 3**: ตัวคูณ (Multiplier) หรือจำนวนศูนย์ที่ต้องเติม
4.  **แถบที่ 4**: ค่าความผิดพลาด (Tolerance) - มักจะเป็นสีทองหรือสีเงิน

## วิธีจำง่ายๆ
"สองแถบแรกคือตัวเลข แถบสามคือจำนวนศูนย์ แถบสี่คือความแม่นยำ"
            `,
                        heroStats: {
                            create: [
                                { label: 'ความยาก', value: 'ปานกลาง', order: 1 },
                                { label: 'เวลา', value: '10 นาที', order: 2 },
                            ]
                        },
                        objectives: {
                            create: [
                                { text: 'ระบุหน้าที่ของแต่ละแถบสี', order: 1 },
                                { text: 'จำแนกแถบค่าความผิดพลาดได้', order: 2 },
                            ]
                        },
                        quizQuestions: {
                            create: [
                                {
                                    prompt: 'แถบที่ 3 ในระบบ 4 แถบ หมายถึงอะไร?',
                                    options: ['ตัวเลขหลักที่ 3', 'ค่าความผิดพลาด', 'ตัวคูณ (Multiplier)', 'อุณหภูมิ'],
                                    answerIndex: 2,
                                    explanation: 'แถบที่ 3 คือตัวคูณ ซึ่งบอกจำนวนเลขศูนย์ที่ต้องต่อท้ายสองหลักแรก',
                                    order: 1
                                }
                            ]
                        }
                    },
                    {
                        title: 'ตารางสีและค่าตัวเลข',
                        order: 2,
                        strapline: 'ท่องจำให้ขึ้นใจ',
                        summary: 'ตารางเทียบสีเป็นตัวเลขที่จำเป็นต้องรู้: ดำ(0) ถึง ขาว(9)',
                        content: `
# รหัสลับแห่งสี
นี่คือค่าของสีต่างๆ ที่คุณต้องจำ:

*   **ดำ (Black)**: 0
*   **น้ำตาล (Brown)**: 1
*   **แดง (Red)**: 2
*   **ส้ม (Orange)**: 3
*   **เหลือง (Yellow)**: 4
*   **เขียว (Green)**: 5
*   **น้ำเงิน (Blue)**: 6
*   **ม่วง (Violet)**: 7
*   **เทา (Grey)**: 8
*   **ขาว (White)**: 9

## เทคนิคการจำ
มีกลอนช่วยจำมากมาย เช่น "ดำ น้ำตาล แดง ส้ม เหลือง..." ลองหาวิธีที่เหมาะกับคุณ!
            `,
                        heroStats: {
                            create: [
                                { label: 'ความยาก', value: 'ปานกลาง', order: 1 },
                                { label: 'เวลา', value: '15 นาที', order: 2 },
                            ]
                        },
                        quizQuestions: {
                            create: [
                                {
                                    prompt: 'สีแดง (Red) มีค่าเท่ากับเท่าไหร่?',
                                    options: ['1', '2', '3', '4'],
                                    answerIndex: 1,
                                    explanation: 'สีแดงมีค่าเท่ากับ 2 (ดำ=0, น้ำตาล=1, แดง=2)',
                                    order: 1
                                }
                            ]
                        }
                    },
                    {
                        title: 'ฝึกอ่านค่าจริง',
                        order: 3,
                        strapline: 'ลงมือปฏิบัติ',
                        summary: 'ทดลองอ่านค่าจากตัวอย่างจริง และคำนวณค่าความต้านทาน',
                        content: `
# ตัวอย่าง: แดง-แดง-น้ำตาล-ทอง
มาลองอ่านค่ากัน:
1.  **แดง**: 2
2.  **แดง**: 2
3.  **น้ำตาล**: เติม 0 หนึ่งตัว (x10)
4.  **ทอง**: ±5%

**ค่าที่ได้**: 220 โอห์ม ±5%

## ลองอีกอัน: น้ำตาล-ดำ-แดง-ทอง
1.  **น้ำตาล**: 1
2.  **ดำ**: 0
3.  **แดง**: เติม 0 สองตัว (x100)
4.  **ทอง**: ±5%

**ค่าที่ได้**: 1,000 โอห์ม หรือ 1k โอห์ม ±5%
            `,
                        heroStats: {
                            create: [
                                { label: 'ความยาก', value: 'ท้าทาย', order: 1 },
                                { label: 'เวลา', value: '10 นาที', order: 2 },
                            ]
                        },
                        practiceLink: {
                            create: {
                                title: 'ฝึกอ่านค่า 4 แถบ',
                                href: '/learn/self/practice?mode=4band',
                                description: 'ทดสอบความแม่นยำของคุณในโหมดฝึกฝน'
                            }
                        }
                    }
                ]
            }
        }
    });

    // --- Module 3: The 5-Band Color Code (รหัสสีแบบ 5 แถบ) ---
    const module3 = await prisma.module.create({
        data: {
            title: 'รหัสสีแบบ 5 แถบ',
            description: 'สำหรับงานที่ต้องการความแม่นยำสูง เรียนรู้ระบบ 5 แถบที่ละเอียดกว่า',
            order: 3,
            lessons: {
                create: [
                    {
                        title: 'ความแตกต่างจาก 4 แถบ',
                        order: 1,
                        strapline: 'เพิ่มความละเอียด',
                        summary: 'ทำไมต้องมี 5 แถบ? มันต่างจาก 4 แถบอย่างไร?',
                        content: `
# เมื่อความแม่นยำสำคัญ
ตัวต้านทานแบบ 5 แถบ (Precision Resistors) จะมีแถบตัวเลขเพิ่มขึ้นมาอีก 1 แถบ เพื่อให้ระบุค่าได้ละเอียดขึ้น

1.  **แถบที่ 1**: ตัวเลขหลักแรก
2.  **แถบที่ 2**: ตัวเลขหลักที่สอง
3.  **แถบที่ 3**: **ตัวเลขหลักที่สาม** (นี่คือส่วนที่เพิ่มมา!)
4.  **แถบที่ 4**: ตัวคูณ
5.  **แถบที่ 5**: ค่าความผิดพลาด (มักจะเป็นสีน้ำตาล ±1% หรือแดง ±2%)
            `,
                        heroStats: {
                            create: [
                                { label: 'ความยาก', value: 'ปานกลาง', order: 1 },
                                { label: 'เวลา', value: '8 นาที', order: 2 },
                            ]
                        },
                        objectives: {
                            create: [
                                { text: 'บอกความแตกต่างระหว่าง 4 แถบ และ 5 แถบ', order: 1 },
                                { text: 'เข้าใจโครงสร้างของระบบ 5 แถบ', order: 2 },
                            ]
                        }
                    },
                    {
                        title: 'การอ่านค่า 5 แถบ',
                        order: 2,
                        strapline: 'แม่นยำระดับมืออาชีพ',
                        summary: 'ฝึกอ่านค่าตัวต้านทานแบบ 5 แถบพร้อมตัวอย่าง',
                        content: `
# ตัวอย่าง: ส้ม-ส้ม-ดำ-แดง-น้ำตาล
1.  **ส้ม**: 3
2.  **ส้ม**: 3
3.  **ดำ**: 0
4.  **แดง**: เติม 0 สองตัว (x100)
5.  **น้ำตาล**: ±1%

**ค่าที่ได้**: 33,000 โอห์ม หรือ 33k โอห์ม ±1%
            `,
                        heroStats: {
                            create: [
                                { label: 'ความยาก', value: 'ท้าทาย', order: 1 },
                                { label: 'เวลา', value: '12 นาที', order: 2 },
                            ]
                        },
                        practiceLink: {
                            create: {
                                title: 'ฝึกอ่านค่า 5 แถบ',
                                href: '/learn/self/practice?mode=5band',
                                description: 'ท้าทายตัวเองด้วยโหมด 5 แถบ'
                            }
                        }
                    }
                ]
            }
        }
    });

    // --- Module 4: Practical Skills (ทักษะปฏิบัติ) ---
    const module4 = await prisma.module.create({
        data: {
            title: 'ทักษะปฏิบัติ',
            description: 'นำความรู้ไปใช้จริง เทคนิคการวัดและการใช้งานตัวต้านทาน',
            order: 4,
            lessons: {
                create: [
                    {
                        title: 'การใช้มัลติมิเตอร์',
                        order: 1,
                        strapline: 'เครื่องมือคู่ใจช่าง',
                        summary: 'วิธีการใช้ดิจิตอลมัลติมิเตอร์วัดค่าความต้านทานเพื่อยืนยันค่าสี',
                        content: `
# วัดให้ชัวร์
แม้เราจะอ่านค่าสีได้ แต่การวัดจริงด้วยมัลติมิเตอร์ (Multimeter) คือวิธีที่แน่นอนที่สุด

1.  บิดลูกบิดไปที่ย่านวัดโอห์ม (Ω)
2.  นำสายวัดสีแดงและดำแตะที่ขาของตัวต้านทานทั้งสองข้าง
3.  อ่านค่าที่หน้าจอ

*ข้อควรระวัง: อย่าจับขาตัวต้านทานทั้งสองข้างด้วยมือเปล่าขณะวัด เพราะความต้านทานของร่างกายเราจะทำให้ค่าเพี้ยนได้!*
            `,
                        heroStats: {
                            create: [
                                { label: 'ความยาก', value: 'ง่าย', order: 1 },
                                { label: 'เวลา', value: '10 นาที', order: 2 },
                            ]
                        },
                        objectives: {
                            create: [
                                { text: 'รู้วิธีตั้งค่ามัลติมิเตอร์', order: 1 },
                                { text: 'ข้อควรระวังในการวัด', order: 2 },
                            ]
                        }
                    }
                ]
            }
        }
    });

    console.log('Seeding completed! (Thai Content)');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
