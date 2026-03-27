# Setup Guides

คู่มือการตั้งค่าและใช้งานโปรเจ็ค ResiLearn

## 📚 Guides

### 1. [Docker Setup Guide](./DOCKER_SETUP.md)
คู่มือการตั้งค่า PostgreSQL และ pgAdmin ด้วย Docker Compose
- การติดตั้ง Docker
- การเริ่มใช้งาน containers
- การใช้งาน pgAdmin
- คำสั่งที่ใช้บ่อย
- Troubleshooting

### 2. [Environment Setup Guide](./ENV_SETUP.md)
คู่มือการตั้งค่า Environment Variables
- การสร้าง `.env.local`
- Environment variables ที่จำเป็น
- Google OAuth setup
- Google Classroom API setup

### 3. [Prisma Guide](./PRISMA_GUIDE.md)
คู่มือการใช้งาน Prisma ORM
- คำสั่ง Prisma ที่ใช้บ่อย
- การ generate client
- การทำ migrations
- การ seed database
- Troubleshooting

### 4. [Prisma vs pgAdmin](./PRISMA_VS_PGADMIN.md)
คำอธิบายความแตกต่างระหว่าง Prisma และ pgAdmin
- ต้องใช้ทั้งสองไหม?
- ใช้เมื่อไหร่?
- วิธีลบ pgAdmin ออก (ถ้าไม่ต้องการ)

---

## 🚀 Quick Start

### 1. Setup Docker & Database
1. อ่าน [Docker Setup Guide](./DOCKER_SETUP.md)
2. เริ่ม Docker Compose: `docker-compose up -d`
3. เชื่อมต่อ pgAdmin: http://localhost:5050

### 2. Setup Environment
1. อ่าน [Environment Setup Guide](../ENV_SETUP.md)
2. สร้าง `.env.local` จาก `.env.example`
3. ตั้งค่า `DATABASE_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`

### 3. Setup Database
1. อ่าน [Prisma Guide](./PRISMA_GUIDE.md)
2. Generate Prisma Client: `npm run db:generate`
3. Push schema: `npm run db:push`
4. Seed database: `npm run db:seed`

---

## 📖 Related Documentation

- [System Design](../system-design.md) - ภาพรวมระบบ
- [Tech Stack](../tech-stack.md) - เทคโนโลยีที่ใช้
- [Implementation Plan](../implementation.md) - แผนการพัฒนา
- [Timeline](../timeline.md) - Timeline การพัฒนา

---

**Last Updated:** 2024

