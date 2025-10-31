# Docker Compose Setup Guide

คู่มือการตั้งค่า PostgreSQL และ pgAdmin ด้วย Docker Compose สำหรับ ResiLearn

## 📦 Prerequisites

- Docker Desktop (for macOS/Windows) หรือ Docker Engine (for Linux)
- Docker Compose

ตรวจสอบว่ามี Docker หรือยัง:
```bash
docker --version
docker-compose --version
```

---

## 🚀 Quick Start

### 1. เริ่ม PostgreSQL และ pgAdmin Containers

```bash
docker-compose up -d
```

คำสั่งนี้จะ:
- ดาวน์โหลด PostgreSQL 15-alpine image (ถ้ายังไม่มี)
- ดาวน์โหลด pgAdmin 4 image (ถ้ายังไม่มี)
- สร้างและเริ่ม containers ทั้งสอง

### 2. ตรวจสอบว่า Containers รันอยู่

```bash
docker-compose ps
```

ควรเห็น:
```
NAME                IMAGE                   STATUS                        PORTS
resilearn-db        postgres:15-alpine      Up (healthy)                  0.0.0.0:5432->5432/tcp
resilearn-pgadmin   dpage/pgadmin4:latest   Up                           0.0.0.0:5050->80/tcp
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

## 🗄️ Services Overview

โปรเจ็คนี้ใช้ 2 services:

### 1. PostgreSQL (Database)
- **Container Name:** `resilearn-db`
- **Image:** `postgres:15-alpine`
- **Port:** `5432` (mapped to host `5432`)
- **Purpose:** เก็บข้อมูลของ ResiLearn application

### 2. pgAdmin (Database Management)
- **Container Name:** `resilearn-pgadmin`
- **Image:** `dpage/pgadmin4:latest`
- **Port:** `5050` (mapped to host `5050`)
- **Purpose:** Web-based interface สำหรับจัดการ PostgreSQL database

---

## 📊 PostgreSQL Connection Details

### จาก Host Machine (localhost):
- **Host:** `localhost`
- **Port:** `5432`
- **Database:** `resilearn`
- **Username:** `postgres`
- **Password:** `postgres`

**Connection String:**
```
postgresql://postgres:postgres@localhost:5432/resilearn?schema=public
```

### จาก Docker Network (pgAdmin → PostgreSQL):
- **Host:** `postgres` (ชื่อ service ใน docker-compose)
- **Port:** `5432`
- **Database:** `resilearn`
- **Username:** `postgres`
- **Password:** `postgres`

---

## 🖥️ pgAdmin Setup & Usage

### 1. เข้าใช้งาน pgAdmin

เปิดเบราว์เซอร์ไปที่:
```
http://localhost:5050
```

### 2. Login

- **Email:** `admin@resilearn.com`
- **Password:** `admin`

⚠️ **หมายเหตุ:** รหัสผ่านนี้ใช้สำหรับ development เท่านั้น ควรเปลี่ยนใน production

### 3. เพิ่ม PostgreSQL Server

หลังจาก login:

1. **คลิกขวาที่ "Servers"** ใน sidebar ซ้าย
2. เลือก **"Register" → "Server..."**

3. ใน tab **General**:
   - **Name:** `ResiLearn DB` (หรือชื่ออื่นตามต้องการ)

4. ใน tab **Connection**:
   - **Host name/address:** `postgres` (สำคัญ! ใช้ชื่อ service ไม่ใช่ localhost)
   - **Port:** `5432`
   - **Maintenance database:** `resilearn`
   - **Username:** `postgres`
   - **Password:** `postgres`
   - ✅ **Save password** (เลือกถ้าต้องการให้บันทึกรหัสผ่าน)

5. คลิก **"Save"**

### 4. ใช้งาน pgAdmin

หลังจากเชื่อมต่อแล้ว สามารถ:
- ✅ ดู tables, views, functions ทั้งหมด
- ✅ Query data ด้วย SQL Editor
- ✅ จัดการ data (INSERT, UPDATE, DELETE)
- ✅ สร้าง/แก้ไข tables
- ✅ ดู schema และ relationships
- ✅ Export/Import data

---

## 🛠️ คำสั่ง Docker Compose ที่ใช้บ่อย

### เริ่ม Services ทั้งหมด
```bash
docker-compose up -d
```

### หยุด Services (แต่เก็บข้อมูลไว้)
```bash
docker-compose stop
```

### เริ่ม Services อีกครั้ง
```bash
docker-compose start
```

### หยุดและลบ Containers (แต่เก็บข้อมูลไว้)
```bash
docker-compose down
```

### หยุดและลบทั้งหมด (รวมข้อมูลและ volumes)
```bash
docker-compose down -v
```

⚠️ **คำเตือน:** คำสั่งนี้จะลบข้อมูลทั้งหมดใน database!

### ดู Logs

**PostgreSQL:**
```bash
docker-compose logs postgres
docker-compose logs -f postgres  # ติดตาม logs แบบ real-time
```

**pgAdmin:**
```bash
docker-compose logs pgadmin
docker-compose logs -f pgadmin  # ติดตาม logs แบบ real-time
```

**ทั้งสอง Services:**
```bash
docker-compose logs
docker-compose logs -f  # ติดตาม logs แบบ real-time
```

### ตรวจสอบ Status
```bash
docker-compose ps
```

### Restart Service
```bash
docker-compose restart postgres   # Restart PostgreSQL
docker-compose restart pgadmin    # Restart pgAdmin
docker-compose restart            # Restart ทั้งหมด
```

---

## 💻 PostgreSQL CLI Commands

### เข้า PostgreSQL CLI
```bash
docker-compose exec postgres psql -U postgres -d resilearn
```

### รัน SQL Command
```bash
docker-compose exec postgres psql -U postgres -d resilearn -c "SELECT * FROM \"User\" LIMIT 5;"
```

### ดู Tables ทั้งหมด
```bash
docker-compose exec postgres psql -U postgres -d resilearn -c "\dt"
```

### ดู Databases ทั้งหมด
```bash
docker-compose exec postgres psql -U postgres -c "\l"
```

### ออกจาก PostgreSQL CLI
```bash
\q
```

---

## 💾 Database Backup & Restore

### Backup Database
```bash
docker-compose exec postgres pg_dump -U postgres resilearn > backup_$(date +%Y%m%d_%H%M%S).sql
```

หรือระบุชื่อไฟล์:
```bash
docker-compose exec postgres pg_dump -U postgres resilearn > backup.sql
```

### Restore Database
```bash
docker-compose exec -T postgres psql -U postgres resilearn < backup.sql
```

### Backup ผ่าน pgAdmin

1. คลิกขวาที่ database `resilearn`
2. เลือก **"Backup..."**
3. ตั้งค่า:
   - **Filename:** เลือกที่เก็บไฟล์
   - **Format:** เลือก `Plain` หรือ `Custom`
4. คลิก **"Backup"**

### Restore ผ่าน pgAdmin

1. คลิกขวาที่ database `resilearn`
2. เลือก **"Restore..."**
3. เลือกไฟล์ backup (.sql หรือ .backup)
4. คลิก **"Restore"**

---

## 📁 Docker Volumes

ข้อมูลทั้งหมดเก็บไว้ใน Docker volumes:

- **postgres_data:** เก็บข้อมูล PostgreSQL
- **pgadmin_data:** เก็บการตั้งค่า pgAdmin

### ดู Volumes
```bash
docker volume ls | grep resilearn
```

### ลบ Volume (ลบข้อมูลทั้งหมด)
```bash
docker volume rm resilearn_postgres_data
docker volume rm resilearn_pgadmin_data
```

หรือใช้:
```bash
docker-compose down -v  # ลบ volumes ทั้งหมด
```

⚠️ **คำเตือน:** คำสั่งนี้จะลบข้อมูลทั้งหมด!

---

## 🔧 Troubleshooting

### Container ไม่รัน

**ตรวจสอบ logs:**
```bash
docker-compose logs postgres    # PostgreSQL logs
docker-compose logs pgadmin      # pgAdmin logs
```

**Restart containers:**
```bash
docker-compose restart postgres   # Restart PostgreSQL
docker-compose restart pgadmin   # Restart pgAdmin
docker-compose restart           # Restart ทั้งหมด
```

**ถ้ายังไม่หาย ลอง:**
```bash
docker-compose down
docker-compose up -d
```

### Port ถูกใช้แล้ว

**Port 5432 (PostgreSQL) ถูกใช้แล้ว:**

แก้ไข `docker-compose.yml`:
```yaml
postgres:
  ports:
    - "5433:5432"  # เปลี่ยน port เป็น 5433
```

และแก้ไข `DATABASE_URL` ใน `.env.local`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/resilearn?schema=public"
```

**Port 5050 (pgAdmin) ถูกใช้แล้ว:**

แก้ไข `docker-compose.yml`:
```yaml
pgadmin:
  ports:
    - "5051:80"  # เปลี่ยน port เป็น 5051
```

แล้วเข้าใช้งานที่: `http://localhost:5051`

### pgAdmin ไม่สามารถเชื่อมต่อ PostgreSQL ได้

**ปัญหาที่พบบ่อย:**

1. **ใช้ `localhost` แทน `postgres`:**
   - ❌ ผิด: Host = `localhost`
   - ✅ ถูก: Host = `postgres` (ชื่อ service ใน docker-compose)

2. **PostgreSQL ยังไม่พร้อม:**
   - รอให้ PostgreSQL container เป็น `healthy` ก่อน
   - ตรวจสอบด้วย: `docker-compose ps`

3. **Network ผิด:**
   - ตรวจสอบว่า containers อยู่ใน network เดียวกัน
   - ใช้ `docker-compose ps` เพื่อตรวจสอบ

### ลบข้อมูลทั้งหมดและเริ่มใหม่

```bash
# หยุดและลบ containers และ volumes
docker-compose down -v

# เริ่ม containers ใหม่
docker-compose up -d

# Setup database
npm run db:migrate
npm run db:seed
```

### ตรวจสอบว่ามี Container รันอยู่หรือไม่

```bash
docker ps | grep resilearn
```

หรือ:
```bash
docker-compose ps
```

### ตรวจสอบ Database

**ดู tables ทั้งหมด:**
```bash
docker-compose exec postgres psql -U postgres -d resilearn -c "\dt"
```

**นับจำนวน records:**
```bash
docker-compose exec postgres psql -U postgres -d resilearn -c "SELECT COUNT(*) FROM \"User\";"
```

### pgAdmin แสดง Error "Email ไม่ valid"

ถ้าเห็น error: `does not appear to be a valid email address`

แก้ไข `docker-compose.yml`:
```yaml
pgadmin:
  environment:
    PGADMIN_DEFAULT_EMAIL: admin@resilearn.com  # ใช้ .com แทน .local
```

แล้ว restart:
```bash
docker-compose restart pgadmin
```

### PostgreSQL Container ไม่ Healthy

ตรวจสอบ logs:
```bash
docker-compose logs postgres
```

อาจจะเป็นเพราะ:
- Volume corruption
- Disk space เต็ม
- Permission issues

**วิธีแก้:**
```bash
# ลบ volume และเริ่มใหม่
docker-compose down -v
docker-compose up -d
```

⚠️ **คำเตือน:** จะลบข้อมูลทั้งหมด!

---

## 📋 Quick Reference

### Docker Compose Commands

| คำสั่ง | คำอธิบาย |
|--------|----------|
| `docker-compose up -d` | เริ่ม containers ใน background |
| `docker-compose down` | หยุดและลบ containers |
| `docker-compose down -v` | หยุด ลบ containers และ volumes |
| `docker-compose ps` | ดูสถานะ containers |
| `docker-compose logs` | ดู logs |
| `docker-compose logs -f` | ดู logs แบบ real-time |
| `docker-compose restart` | Restart ทั้งหมด |
| `docker-compose stop` | หยุด containers (เก็บข้อมูล) |
| `docker-compose start` | เริ่ม containers ที่หยุดไว้ |

### PostgreSQL Connection

```
Host: localhost (จาก host machine)
Port: 5432
Database: resilearn
Username: postgres
Password: postgres
```

### pgAdmin Access

```
URL: http://localhost:5050
Email: admin@resilearn.com
Password: admin
```

### PostgreSQL Server (ใน pgAdmin)

```
Host: postgres (ชื่อ service)
Port: 5432
Database: resilearn
Username: postgres
Password: postgres
```

---

## 🔒 Security Notes

⚠️ **สำหรับ Development เท่านั้น!**

### Default Credentials (ไม่ปลอดภัย):
- **PostgreSQL:** `postgres/postgres`
- **pgAdmin:** `admin@resilearn.com/admin`
- **Ports:** เปิดให้ทุกคนเข้าถึงได้

### ควรเปลี่ยนใน Production:

1. **เปลี่ยนรหัสผ่าน:**
   - แก้ไข `docker-compose.yml` ให้ใช้รหัสผ่านที่แข็งแรง
   - อัปเดต `.env.local` ให้ตรงกับรหัสผ่านใหม่

2. **ใช้ Environment Variables:**
   ```yaml
   environment:
     POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
     PGADMIN_DEFAULT_PASSWORD: ${PGADMIN_PASSWORD}
   ```

3. **Restrict Network Access:**
   - ปิดการ expose ports ใน production
   - ใช้ VPN หรือ private network

4. **ใช้ Managed Database:**
   - Supabase
   - Neon
   - AWS RDS
   - Google Cloud SQL

---

## 🎯 Setup Workflow

### 1. เริ่มต้นครั้งแรก

```bash
# 1. เริ่ม Docker containers
docker-compose up -d

# 2. ตรวจสอบสถานะ
docker-compose ps

# 3. สร้าง .env.local (ถ้ายังไม่มี)
cp .env.example .env.local

# 4. ตั้งค่า DATABASE_URL ใน .env.local
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/resilearn?schema=public"

# 5. Generate Prisma Client
npm run db:generate

# 6. Run migrations
npm run db:migrate

# 7. Seed database
npm run db:seed

# 8. เริ่ม development server
npm run dev
```

### 2. ใช้งานประจำวัน

```bash
# เริ่ม containers (ถ้าปิดอยู่)
docker-compose up -d

# ตรวจสอบสถานะ
docker-compose ps

# เข้า pgAdmin: http://localhost:5050
```

### 3. หยุดการทำงาน

```bash
# หยุด containers (เก็บข้อมูลไว้)
docker-compose stop

# หรือลบ containers (เก็บข้อมูลไว้)
docker-compose down
```

---

## 📚 Additional Resources

### Docker Compose
- [Official Documentation](https://docs.docker.com/compose/)
- [Compose File Reference](https://docs.docker.com/compose/compose-file/)

### PostgreSQL
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

### pgAdmin
- [pgAdmin Docker Image](https://hub.docker.com/r/dpage/pgadmin4)
- [pgAdmin Documentation](https://www.pgadmin.org/docs/)

### Prisma
- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma with Docker](https://www.prisma.io/docs/guides/deployment/deployment-guides/deployment-docker)

---

## ✅ Checklist

### Initial Setup
- [ ] Docker Desktop/Engine ติดตั้งแล้ว
- [ ] Docker Compose ติดตั้งแล้ว
- [ ] `docker-compose up -d` ทำงานได้
- [ ] Containers รันอยู่ (ตรวจสอบด้วย `docker-compose ps`)
- [ ] `.env.local` สร้างแล้ว
- [ ] `DATABASE_URL` ตั้งค่าแล้ว
- [ ] Prisma Client generated (`npm run db:generate`)
- [ ] Migrations รันแล้ว (`npm run db:migrate`)
- [ ] Database seeded (`npm run db:seed`)

### pgAdmin Setup
- [ ] เข้า http://localhost:5050 ได้
- [ ] Login ด้วย `admin@resilearn.com` / `admin`
- [ ] เพิ่ม PostgreSQL server แล้ว
- [ ] เชื่อมต่อ database สำเร็จ
- [ ] ดู tables ได้

---

**Last Updated:** 2024

