# Prisma Guide - ResiLearn

คู่มือการใช้งาน Prisma สำหรับโปรเจ็ค ResiLearn

---

## 📦 Prerequisites

ก่อนใช้ Prisma ต้องมี:
1. ✅ Docker Compose รันอยู่ (`docker-compose up -d`)
2. ✅ `.env.local` มี `DATABASE_URL` ที่ถูกต้อง
3. ✅ Prisma schema (`prisma/schema.prisma`) พร้อม

---

## 🚀 คำสั่งพื้นฐาน

### 1. Generate Prisma Client

สร้าง Prisma Client จาก schema:

```bash
npm run db:generate
```

**เมื่อไหร่ต้องรัน:**
- หลังจากแก้ไข `prisma/schema.prisma`
- หลังจาก pull code จาก git (ถ้ามีการแก้ schema)
- ก่อนเริ่ม development

**ผลลัพธ์:**
- สร้าง Prisma Client ใน `node_modules/.prisma/client`
- TypeScript types สำหรับ models

---

### 2. Push Schema to Database (Development)

Sync schema กับ database โดยไม่ต้องใช้ migrations:

```bash
npm run db:push
```

**เมื่อไหร่ใช้:**
- ✅ Development phase (เร็ว ไม่ต้องสร้าง migration files)
- ✅ Prototyping (ทดสอบ schema ใหม่)
- ❌ ไม่ควรใช้ใน production

**คำเตือน:**
- จะแก้ไข database schema โดยตรง (alter tables)
- **ไม่สร้าง migration files**
- อาจสูญเสียข้อมูลถ้า schema เปลี่ยนเยอะ

---

### 3. Create Migration

สร้าง migration file สำหรับ schema changes:

```bash
npm run db:migrate
```

**เมื่อไหร่ใช้:**
- ✅ เมื่อต้องการเก็บ history ของ schema changes
- ✅ Production deployment (แนะนำ)
- ✅ Team development (เพื่อให้ทุกคนใช้ migrations เดียวกัน)

**ขั้นตอน:**
1. แก้ไข `prisma/schema.prisma`
2. รัน `npm run db:migrate`
3. ใส่ชื่อ migration (เช่น: `add_user_table`)
4. Prisma จะสร้าง migration file ใน `prisma/migrations/`
5. Migration จะถูก apply กับ database อัตโนมัติ

**ตัวอย่าง:**
```bash
$ npm run db:migrate
# Enter migration name: add_user_table
# → สร้างไฟล์ prisma/migrations/20241031_add_user_table/migration.sql
```

---

### 4. Seed Database

เพิ่มข้อมูลเริ่มต้น (initial data):

```bash
npm run db:seed
```

**ข้อมูลที่ seed:**
- ✅ 7 Levels (Level 1-7)

**เมื่อไหร่ใช้:**
- หลังจากสร้าง database ครั้งแรก
- หลังจาก reset database (`docker-compose down -v`)
- เมื่อต้องการ reset ข้อมูลเริ่มต้น

**หมายเหตุ:**
- ต้องมี `DATABASE_URL` ใน environment
- Seed script: `prisma/seed.ts`

---

### 5. Prisma Studio (GUI)

เปิด Prisma Studio เพื่อดู/แก้ไขข้อมูล:

```bash
npm run db:studio
```

**ผลลัพธ์:**
- เปิด browser ที่ `http://localhost:5555`
- แสดง tables ทั้งหมด
- สามารถดู แก้ไข เพิ่ม ลบข้อมูลได้ (GUI)

**ประโยชน์:**
- ✅ ดูข้อมูลง่าย (ไม่ต้องใช้ SQL)
- ✅ แก้ไขข้อมูลทดสอบ
- ✅ Debugging (ตรวจสอบข้อมูลใน database)

---

## 🔄 Workflow ที่แนะนำ

### สำหรับ Development (เร็ว)

```bash
# 1. แก้ schema
# แก้ไข prisma/schema.prisma

# 2. Push schema (ไม่สร้าง migration)
npm run db:push

# 3. Generate client
npm run db:generate

# 4. Seed (ถ้าต้องการ)
npm run db:seed
```

---

### สำหรับ Production (ปลอดภัย)

```bash
# 1. แก้ schema
# แก้ไข prisma/schema.prisma

# 2. Create migration (สร้าง migration file)
npm run db:migrate
# ใส่ชื่อ migration

# 3. Generate client
npm run db:generate

# 4. Deploy
# Migration files จะถูก apply อัตโนมัติ
```

---

## 📋 สถานการณ์ที่พบบ่อย

### 1. เริ่มต้นครั้งแรก

```bash
# 1. Start Docker
docker-compose up -d

# 2. Generate Prisma Client
npm run db:generate

# 3. Push schema to database
npm run db:push

# 4. Seed initial data
npm run db:seed
```

---

### 2. แก้ไข Schema

```bash
# 1. แก้ prisma/schema.prisma
# (เพิ่ม field, table, relation, etc.)

# 2. Push changes
npm run db:push

# 3. Regenerate client
npm run db:generate

# 4. Restart dev server (ถ้ารันอยู่)
# npm run dev
```

---

### 3. Reset Database (ลบทั้งหมด)

```bash
# 1. Stop และลบ volumes
docker-compose down -v

# 2. Start ใหม่
docker-compose up -d

# 3. Push schema
npm run db:push

# 4. Seed data
npm run db:seed
```

---

### 4. Pull Code ที่มีการแก้ Schema

```bash
# 1. Pull code
git pull

# 2. Generate client (ใช้ schema ใหม่)
npm run db:generate

# 3. Apply migrations (ถ้ามี)
npm run db:migrate

# หรือใช้ db:push ถ้าไม่มี migrations
npm run db:push
```

---

## 🛠️ คำสั่งเพิ่มเติม

### ดู Schema ในรูปแบบ SQL

```bash
npx prisma db pull
```

ดึง schema จาก database มาเป็น Prisma schema (reverse engineering)

---

### Validate Schema

ตรวจสอบว่า schema ถูกต้องหรือไม่:

```bash
npx prisma validate
```

---

### Format Schema

จัดรูปแบบ schema ให้สวยงาม:

```bash
npx prisma format
```

---

### Reset Database (ลบ migrations)

```bash
npx prisma migrate reset
```

**คำเตือน:** ลบข้อมูลทั้งหมด และ apply migrations ใหม่

---

## 🔍 ตรวจสอบสถานะ

### ดู Tables ใน Database

```bash
docker-compose exec postgres psql -U postgres -d resilearn -c "\dt"
```

หรือใช้ pgAdmin:
- เข้า http://localhost:5050
- เชื่อมต่อ database
- ดู tables ใน sidebar

---

### ดูข้อมูลใน Table

```bash
docker-compose exec postgres psql -U postgres -d resilearn -c "SELECT * FROM \"Level\" LIMIT 5;"
```

---

## ⚠️ ข้อควรระวัง

### 1. db:push vs db:migrate

**db:push:**
- ✅ เร็ว สำหรับ development
- ✅ ไม่ต้องสร้าง migration files
- ❌ ไม่เก็บ history
- ❌ ไม่เหมาะสำหรับ production

**db:migrate:**
- ✅ เก็บ history
- ✅ ปลอดภัยสำหรับ production
- ✅ Team-friendly
- ❌ ต้องตั้งชื่อ migration

---

### 2. Generate Client

**สำคัญ:** ต้อง generate client ทุกครั้งที่แก้ schema!

ถ้าไม่ generate:
- ❌ TypeScript จะไม่รู้จัก types ใหม่
- ❌ จะมี type errors
- ❌ Runtime errors

---

### 3. Environment Variables

**ต้องมี `DATABASE_URL` ใน:**
- ✅ `.env.local` (สำหรับ local development)
- ✅ Environment variables (สำหรับ production)

**ตรวจสอบ:**
```bash
cat .env.local | grep DATABASE_URL
```

---

## 📚 Quick Reference

| คำสั่ง | คำอธิบาย | เมื่อไหร่ใช้ |
|--------|----------|-------------|
| `npm run db:generate` | Generate Prisma Client | หลังแก้ schema |
| `npm run db:push` | Sync schema (dev) | Development, prototyping |
| `npm run db:migrate` | Create migration | Production, team dev |
| `npm run db:seed` | Seed initial data | Setup, reset database |
| `npm run db:studio` | Open GUI | View/edit data |

---

## 🎯 Checklist สำหรับ Setup

### Initial Setup
- [ ] Docker Compose รันอยู่
- [ ] `.env.local` มี `DATABASE_URL`
- [ ] Generate Prisma Client (`npm run db:generate`)
- [ ] Push schema (`npm run db:push`)
- [ ] Seed database (`npm run db:seed`)

### After Schema Change
- [ ] แก้ไข `prisma/schema.prisma`
- [ ] Push/Migrate schema
- [ ] Generate Prisma Client
- [ ] Restart dev server (ถ้ารันอยู่)

---

## 🆘 Troubleshooting

### Error: Cannot find module '.prisma/client'

**แก้ไข:**
```bash
npm run db:generate
```

---

### Error: Database connection failed

**ตรวจสอบ:**
1. Docker Compose รันอยู่หรือไม่:
   ```bash
   docker-compose ps
   ```

2. `DATABASE_URL` ถูกต้องหรือไม่:
   ```bash
   cat .env.local | grep DATABASE_URL
   ```

3. Database พร้อมหรือไม่:
   ```bash
   docker-compose exec postgres pg_isready -U postgres
   ```

---

### Error: Schema validation failed

**แก้ไข:**
```bash
npx prisma validate
```

ตรวจสอบว่า schema syntax ถูกต้อง

---

### Tables ไม่ match กับ Schema

**แก้ไข:**
```bash
# Option 1: Reset (ลบข้อมูลทั้งหมด)
docker-compose down -v
docker-compose up -d
npm run db:push

# Option 2: Migrate (เก็บข้อมูล)
npm run db:migrate
```

---

## 📖 Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Migrate Guide](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)

---

**Last Updated:** 2024

