import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const teacher = await prisma.user.findFirst({
    where: { name: 'Somchai Suksan' },
  })

  if (!teacher) {
    throw new Error('❌ ไม่พบ teacher: Somchai Suksan')
  }

  const description = `รายวิชานี้มุ่งเน้นให้ผู้เรียนมีความรู้ความเข้าใจเกี่ยวกับตัวต้านทานและการอ่านค่าความต้านทานจากรหัสแถบสีแบบ 4 แถบสี และ 5 แถบสีเพื่อเป็นพื้นฐานในการเรียนและการปฏิบัติงานด้านไฟฟ้าและอิเล็กทรอนิกส์`.trim()

  const courses = [
    {
      name: 'Electrical Basic Sec 1 2569',
      code: 'K9xP2A',
      startDate: new Date('2026-01-20T00:00:00.000Z'),
      status: 'START',
      isPublished: true,
    },
    {
      name: 'Electrical Basic Sec 2 2569',
      code: 'Q7MZr4',
      startDate: new Date('2026-01-20T00:00:00.000Z'),
      status: 'START',
      isPublished: false,
    },
    {
      name: 'Electrical Basic Sec 1/2568',
      code: 'Z3p8N',
      startDate: new Date('2025-01-20T00:00:00.000Z'),
      status: 'end',
      isPublished: true,
    },
    {
      name: 'Electrical Basic Sec 2/2568',
      code: 'mK6R9x',
      startDate: new Date('2025-01-20T00:00:00.000Z'),
      status: 'end',
      isPublished: false,
    },
  ]

  for (const c of courses) {
    await prisma.course.create({
      data: {
        name: c.name,
        code: c.code, // ✅ ใส่ตายตัว
        description,
        teacherId: teacher.id,
        startDate: c.startDate,
        status: c.status,
        isPublished: c.isPublished,
      },
    })
  }

  console.log('✅ Seed course completed (fixed codes)')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
