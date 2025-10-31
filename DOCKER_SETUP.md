# Docker Compose Setup Guide

คู่มือการตั้งค่า PostgreSQL ด้วย Docker Compose สำหรับ ResiLearn

## 📦 Prerequisites

- Docker Desktop (for macOS/Windows) หรือ Docker Engine (for Linux)
- Docker Compose

ตรวจสอบว่ามี Docker หรือยัง:
```bash
docker --version
docker-compose --version
```

## 🚀 Quick Start

### 1. เริ่ม PostgreSQL Container

```bash
docker-compose up -d
```

### 2. ตรวจสอบว่า Container รันอยู่

```bash
docker-compose ps
```

ควรเห็น:
```
NAME              STATUS          PORTS
resilearn-db      Up (healthy)    0.0.0.0:5432->5432/tcp
```

### 3. ตั้งค่า .env.local

สร้างไฟล์ `.env.local` จาก `.env.example`:

```bash
cp .env.example .env.local
```

แก้ไข `.env.local`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/resilearn?schema=public"
```

### 4. Generate Prisma Client

```bash
npm run db:generate
```

### 5. Run Migrations

```bash
npm run db:migrate
```

### 6. Seed Database (สร้าง 7 levels)

```bash
npm run db:seed
```

---

## 🛠️ คำสั่งที่ใช้บ่อย

### เริ่ม PostgreSQL
```bash
docker-compose up -d
```

### หยุด PostgreSQL (แต่เก็บข้อมูลไว้)
```bash
docker-compose stop
```

### หยุดและลบ Container (แต่เก็บข้อมูลไว้)
```bash
docker-compose down
```

### หยุดและลบทั้งหมด (รวมข้อมูล)
```bash
docker-compose down -v
```

### ดู Logs
```bash
docker-compose logs postgres
docker-compose logs -f postgres  # ติดตาม logs แบบ real-time
```

### ตรวจสอบ Status
```bash
docker-compose ps
```

### เข้า PostgreSQL CLI
```bash
docker-compose exec postgres psql -U postgres -d resilearn
```

### Backup Database
```bash
docker-compose exec postgres pg_dump -U postgres resilearn > backup.sql
```

### Restore Database
```bash
docker-compose exec -T postgres psql -U postgres resilearn < backup.sql
```

---

## 📊 Connection Details

- **Host:** localhost
- **Port:** 5432
- **Database:** resilearn
- **Username:** postgres
- **Password:** postgres

**Connection String:**
```
postgresql://postgres:postgres@localhost:5432/resilearn?schema=public
```

---

## 🔧 Troubleshooting

### Container ไม่รัน

ตรวจสอบ logs:
```bash
docker-compose logs postgres
```

Restart container:
```bash
docker-compose restart postgres
```

### Port 5432 ถูกใช้แล้ว

แก้ไข `docker-compose.yml`:
```yaml
ports:
  - "5433:5432"  # เปลี่ยน port เป็น 5433
```

และแก้ไข `DATABASE_URL` ใน `.env.local`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/resilearn?schema=public"
```

### ลบข้อมูลทั้งหมดและเริ่มใหม่

```bash
docker-compose down -v
docker-compose up -d
npm run db:migrate
npm run db:seed
```

### ตรวจสอบว่ามี Container รันอยู่หรือไม่

```bash
docker ps | grep resilearn
```

### ตรวจสอบ Database

```bash
docker-compose exec postgres psql -U postgres -d resilearn -c "\dt"
```

---

## 📁 ข้อมูลจะอยู่ที่ไหน

Docker Volume ชื่อ `postgres_data` เก็บข้อมูลทั้งหมด

ดู volumes:
```bash
docker volume ls | grep postgres_data
```

ลบ volume:
```bash
docker volume rm resilearn_postgres_data
```

---

## 🔒 Security Notes

⚠️ **สำหรับ Development เท่านั้น!**

- Username/Password เป็น `postgres/postgres` (ไม่ปลอดภัย)
- Port 5432 เปิดให้ทุกคนเข้าถึงได้
- ใช้สำหรับ local development เท่านั้น

สำหรับ Production ควรใช้:
- Managed Database (Supabase, Neon)
- หรือ setup Docker Compose ที่มี SSL และ security hardening

---

## 🎯 Next Steps

หลังจาก setup Docker Compose แล้ว:

1. ✅ สร้าง `.env.local` จาก `.env.example`
2. ✅ ตั้งค่า `DATABASE_URL`
3. ✅ Generate Prisma Client: `npm run db:generate`
4. ✅ Run migrations: `npm run db:migrate`
5. ✅ Seed database: `npm run db:seed`
6. ✅ เริ่ม development server: `npm run dev`

---

## 📚 Resources

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)
- [Prisma Documentation](https://www.prisma.io/docs)

