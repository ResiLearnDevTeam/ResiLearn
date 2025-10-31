# Environment Variables Setup Guide

ไฟล์นี้จะอธิบายวิธีการตั้งค่า `.env.local` สำหรับโปรเจ็ค ResiLearn

## 📝 สร้างไฟล์ .env.local

1. คัดลอก `.env.example` เป็น `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. แก้ไขค่าตามที่จำเป็น

---

## ✅ REQUIRED (ต้องมี)

### 1. DATABASE_URL
**สำหรับ:** Prisma (Database connection)

**รูปแบบ:**
```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA"
```

**ตัวอย่าง (Local PostgreSQL):**
```env
DATABASE_URL="postgresql://postgres:my_password@localhost:5432/resilearn?schema=public"
```

**วิธีตั้งค่า:**

**ตัวเลือกที่ 1: Docker Compose (แนะนำสำหรับ Development)**
1. เริ่ม PostgreSQL container:
   ```bash
   docker-compose up -d
   ```

2. ตั้งค่าใน `.env.local`:
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/resilearn?schema=public"
   ```

ดูรายละเอียดเพิ่มเติมที่ [DOCKER_SETUP.md](./DOCKER_SETUP.md)

---

**ตัวเลือกที่ 2: ติดตั้ง PostgreSQL บนเครื่อง**
1. ติดตั้ง PostgreSQL บนเครื่อง:
   ```bash
   # macOS
   brew install postgresql@15
   brew services start postgresql@15
   
   # เข้า PostgreSQL CLI
   psql postgres
   
   # สร้าง database
   CREATE DATABASE resilearn;
   \q
   ```

2. แก้ไข `.env.local` ให้ใส่ password ที่ตั้งไว้

---

### 2. NEXTAUTH_URL
**สำหรับ:** NextAuth.js (Base URL ของแอป)

**ค่าเริ่มต้นสำหรับ Development:**
```env
NEXTAUTH_URL="http://localhost:3000"
```

**สำหรับ Production:**
```env
NEXTAUTH_URL="https://your-domain.com"
```

---

### 3. NEXTAUTH_SECRET
**สำหรับ:** NextAuth.js (JWT encryption secret)

**วิธีสร้าง Secret Key:**
```bash
# macOS/Linux
openssl rand -base64 32

# หรือใช้ Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**ตัวอย่าง:**
```env
NEXTAUTH_SECRET="aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567890="
```

⚠️ **สำคัญ:** อย่าเปิดเผย secret key นี้ใน public repository!

---

## 🔲 OPTIONAL (ถ้าจะใช้)

### 4. GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET
**สำหรับ:** Google OAuth Login (Milestone 1+)

**วิธีตั้งค่า:**
1. ไปที่ [Google Cloud Console](https://console.cloud.google.com/)
2. สร้างโปรเจ็คใหม่ (ถ้ายังไม่มี)
3. เปิดใช้งาน **Google+ API**
4. ไปที่ **APIs & Services > Credentials**
5. คลิก **Create Credentials > OAuth 2.0 Client ID**
6. เลือก **Web application**
7. ตั้งค่า:
   - **Name:** ResiLearn (หรือชื่ออื่น)
   - **Authorized redirect URIs:** 
     - `http://localhost:3000/api/auth/callback/google` (Development)
     - `https://your-domain.com/api/auth/callback/google` (Production)
8. คัดลอก **Client ID** และ **Client Secret** มาใส่ใน `.env.local`

**ตัวอย่าง:**
```env
GOOGLE_CLIENT_ID="123456789-abcdefghijklmnop.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-abcdefghijklmnopqrstuvwxyz"
```

---

### 5. GOOGLE_CLASSROOM_API_KEY
**สำหรับ:** Google Classroom Integration (Milestone 7)

**วิธีตั้งค่า:**
1. ไปที่ [Google Cloud Console](https://console.cloud.google.com/)
2. เปิดใช้งาน **Google Classroom API**
3. ไปที่ **APIs & Services > Credentials**
4. สร้าง **API Key** หรือใช้ OAuth 2.0 Client ID ที่สร้างไว้แล้ว

**หมายเหตุ:** จะตั้งค่าเมื่อถึง Milestone 7 ก็ได้

---

## 📋 Checklist

- [ ] สร้างไฟล์ `.env.local` จาก `.env.example`
- [ ] ตั้งค่า `DATABASE_URL` (PostgreSQL connection)
- [ ] ตั้งค่า `NEXTAUTH_URL` (เป็น `http://localhost:3000` สำหรับ development)
- [ ] สร้าง `NEXTAUTH_SECRET` ด้วย `openssl rand -base64 32`
- [ ] (Optional) ตั้งค่า Google OAuth credentials
- [ ] (Optional) ตั้งค่า Google Classroom API key

---

## 🚀 หลังจากตั้งค่าแล้ว

1. Generate Prisma Client:
   ```bash
   npm run db:generate
   ```

2. Run migrations:
   ```bash
   npm run db:migrate
   ```

3. Seed database (สร้าง 7 levels):
   ```bash
   npm run db:seed
   ```

4. เริ่ม development server:
   ```bash
   npm run dev
   ```

---

## ⚠️ ข้อควรระวัง

1. **อย่า commit `.env.local`** - ไฟล์นี้อยู่ใน `.gitignore` แล้ว
2. **DATABASE_URL** - ต้องมี database `resilearn` ใน PostgreSQL ก่อน
3. **NEXTAUTH_SECRET** - ต้องเป็น random string ที่ยาวพอ (อย่างน้อย 32 characters)
4. **Google OAuth** - ถ้ายังไม่ได้ตั้งค่า จะ login ด้วย Google ไม่ได้ แต่ยังรัน app ได้

---

## 🆘 ปัญหาที่พบบ่อย

### Error: Missing required environment variable: DATABASE_URL
- ตรวจสอบว่าได้สร้าง `.env.local` และมี `DATABASE_URL` ถูกต้อง
- ตรวจสอบว่า PostgreSQL กำลังรันอยู่: `brew services list` (macOS)

### Error: Invalid DATABASE_URL
- ตรวจสอบรูปแบบ: `postgresql://user:password@host:port/database?schema=public`
- ตรวจสอบว่า database `resilearn` ถูกสร้างแล้ว

### NextAuth: Error with Google OAuth
- ตรวจสอบว่า `GOOGLE_CLIENT_ID` และ `GOOGLE_CLIENT_SECRET` ถูกต้อง
- ตรวจสอบว่า redirect URI ตรงกับที่ตั้งไว้ใน Google Cloud Console

