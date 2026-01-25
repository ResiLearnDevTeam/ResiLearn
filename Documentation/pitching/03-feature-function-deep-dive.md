# Feature & Function Deep Dive - ResiLearn

เอกสารนี้อธิบายรายละเอียดของทุก Module และ Page ในระบบ ResiLearn โดยอธิบายทั้งสิ่งที่ User เห็นและทำได้ Logic เบื้องหลัง และจุดเด่นที่ใช้ในการ Pitch

---

## 1. Landing Page (`/`)

### What it does: สิ่งที่ User เห็นและทำได้

**Landing Page** เป็นหน้าแรกของเว็บไซต์ที่แสดงข้อมูลเกี่ยวกับ ResiLearn และดึงดูดผู้ใช้ให้ลงทะเบียนหรือเข้าสู่ระบบ

**Components ที่แสดง**:
- **LandingNavbar**: Navigation bar พร้อมปุ่ม Login/Register
- **HeroSection**: ส่วนหัวที่แสดงข้อความหลักและ CTA (Call to Action)
- **AboutUsSection**: เกี่ยวกับเรา
- **CourseCategoriesSection**: หมวดหมู่คอร์ส
- **CoursesSection**: คอร์สยอดนิยม
- **TestimonialsSection**: คำรับรองจากผู้ใช้
- **InstructorsSection**: ข้อมูลผู้สอน
- **DifferentSection**: จุดเด่นที่แตกต่าง
- **NewsSection**: ข่าวสารล่าสุด
- **NewsletterSection**: สมัครรับข่าวสาร
- **Footer**: Footer พร้อม links และข้อมูลติดต่อ

### Behind the Code: Logic เบื้องหลัง

**โครงสร้าง**:
- ใช้ **Server Component** (ไม่ใช่ 'use client') เพื่อให้ SEO ดีและโหลดเร็ว
- Components ทั้งหมดเป็น **Static Content** ไม่ต้องเรียก API
- ใช้ **Tailwind CSS** สำหรับ styling

**การทำงาน**:
1. Next.js render หน้าเป็น **Static HTML** ทำให้โหลดเร็วมาก
2. ไม่มีการเรียก API เพราะเป็น static content
3. เมื่อ User คลิก Login/Register จะ redirect ไปยัง `/login` หรือ `/register`

### Endpoint Connection

**ไม่มี API endpoints** เพราะเป็น static page

### Pitching Highlight: แก้ปัญหา/สร้างความว้าวอย่างไร

**จุดเด่น**:
- **Professional Design**: ดีไซน์สวยงามและเป็นมืออาชีพ สร้างความน่าเชื่อถือ
- **Clear Value Proposition**: แสดงจุดเด่นของระบบได้ชัดเจน
- **SEO Optimized**: ใช้ Server Components ทำให้ SEO ดี
- **Fast Loading**: โหลดเร็วมากเพราะเป็น static content

**แก้ปัญหา**:
- **First Impression**: สร้างความประทับใจแรกที่ดีให้กับผู้ใช้
- **Trust Building**: สร้างความน่าเชื่อถือผ่าน design และ content

---

## 2. Authentication (`/login`, `/register`)

### What it does: สิ่งที่ User เห็นและทำได้

**Login Page** (`/login`):
- User กรอก **Email** และ **Password**
- มีปุ่ม **"Sign in with Google"** สำหรับ Google OAuth
- มี link ไปยัง Register page
- มี callback URL support (redirect กลับไปหน้าที่ต้องการหลังจาก login)

**Register Page** (`/register`):
- User กรอก **Name**, **Email**, **Password**, **Confirm Password**
- เลือก **Role** (STUDENT หรือ TEACHER)
- มีปุ่ม **"Sign up with Google"** สำหรับ Google OAuth
- มี link ไปยัง Login page

### Behind the Code: Logic เบื้องหลัง

**Authentication Flow**:

1. **User กรอกข้อมูล** → Frontend validate ด้วย Zod schema
2. **Frontend ส่ง request** → `/api/auth/[...nextauth]/signin` (สำหรับ credentials) หรือ `/api/auth/[...nextauth]/authorize` (สำหรับ Google)
3. **NextAuth.js ตรวจสอบ**:
   - **Credentials Provider**: 
     - Query user จาก database ด้วย email
     - ใช้ `bcrypt.compare()` เพื่อตรวจสอบ password
     - ถ้าถูกต้อง สร้าง JWT token
   - **Google Provider**:
     - Redirect ไปยัง Google OAuth
     - รับ authorization code กลับมา
     - Exchange code เป็น access token
     - ดึงข้อมูล user จาก Google
     - สร้างหรือ update user ใน database
     - สร้าง JWT token
4. **NextAuth.js สร้าง session**:
   - สร้าง JWT token ที่มี user id และ role
   - ส่ง session cookie กลับไปยัง browser
5. **Frontend รับ session** → Redirect ไปยัง callback URL หรือ dashboard

**Password Security**:
- ใช้ **bcryptjs** เพื่อ hash passwords
- Password ถูก hash ก่อนเก็บใน database
- ใช้ `bcrypt.compare()` เพื่อตรวจสอบ password โดยไม่ต้อง decrypt

**Session Management**:
- ใช้ **JWT (JSON Web Token)** สำหรับ session
- Token ถูกเก็บใน **HTTP-only cookie** เพื่อความปลอดภัย
- Token มี expiration time

### Endpoint Connection

- **POST `/api/auth/[...nextauth]/signin`**: Credentials login
- **GET `/api/auth/[...nextauth]/authorize`**: OAuth authorization
- **POST `/api/auth/[...nextauth]/callback`**: OAuth callback

### Pitching Highlight: แก้ปัญหา/สร้างความว้าวอย่างไร

**จุดเด่น**:
- **Multiple Authentication Methods**: รองรับทั้ง Email/Password และ Google OAuth
- **Secure Password Storage**: ใช้ bcrypt เพื่อ hash passwords
- **Session Security**: ใช้ JWT และ HTTP-only cookies
- **Seamless Experience**: Google OAuth ทำให้ login ได้ง่ายและเร็ว

**แก้ปัญหา**:
- **User Friction**: Google OAuth ลด friction ในการลงทะเบียน
- **Security**: Password hashing และ secure session management
- **Convenience**: รองรับหลาย authentication methods

---

## 3. Self-Learning Mode: Learning Path (`/learn/self/learningpath/`)

### What it does: สิ่งที่ User เห็นและทำได้

**Learning Path Page** เป็นหน้าแสดงเส้นทางการเรียนรู้ที่ประกอบด้วย **Modules** และ **Lessons**

**สิ่งที่ User เห็น**:
- **Sidebar**: แสดง Modules และ Lessons พร้อม progress indicators
- **Lesson Content**: แสดงเนื้อหาบทเรียน (sections, quiz, practice links)
- **Progress Tracking**: แสดง progress ของแต่ละ lesson และ module
- **Navigation**: ปุ่ม Previous/Next เพื่อไปยัง lesson ถัดไป

**Features**:
- **Module Expansion**: คลิก module เพื่อขยายดู lessons
- **Lesson Completion**: Mark lesson เป็น completed
- **Progress Calculation**: คำนวณ progress ของ module อัตโนมัติ

### Behind the Code: Logic เบื้องหลัง

**Data Flow**:

1. **Frontend เรียก API** `GET /api/modules`
2. **API Route ดึงข้อมูล**:
   - ดึง **Modules** และ **Lessons** (templates) จาก database
   - ดึง **User Progress** (LessonProgress, ModuleProgress) สำหรับ user ปัจจุบัน
   - รวม template data กับ user progress
3. **Frontend แสดง Learning Path**:
   - แสดง Modules และ Lessons พร้อม progress indicators
   - แสดง completed status สำหรับแต่ละ lesson

**Lesson View**:

1. **User คลิก Lesson** → เรียก API `GET /api/lessons/[lessonId]`
2. **API Route ดึงข้อมูล Lesson**:
   - ดึง Lesson template (sections, quiz, practice links, resources)
   - ดึง User Progress (completed status)
3. **Frontend แสดง Lesson**:
   - แสดง sections (เนื้อหา)
   - แสดง quiz (ถ้ามี)
   - แสดง practice links (ถ้ามี)
   - แสดง resources (ถ้ามี)

**Progress Tracking**:

1. **User ทำ Lesson เสร็จ** → เรียก API `POST /api/lessons/[lessonId]` พร้อม `completed: true`
2. **API Route update progress**:
   - Update หรือ create `LessonProgress` record
   - คำนวณ progress ของ module (จำนวน lessons ที่ completed / จำนวน lessons ทั้งหมด)
   - Update หรือ create `ModuleProgress` record
3. **Frontend update UI** → แสดง progress ที่อัปเดตแล้ว

**Template-based Architecture**:
- **Modules** และ **Lessons** เป็น **templates** ที่ใช้ร่วมกันทุก user
- **LessonProgress** และ **ModuleProgress** เก็บ progress ของแต่ละ user แยกต่างหาก
- ทำให้สามารถอัปเดตเนื้อหาได้โดยไม่กระทบ progress ของ user

### Endpoint Connection

- **GET `/api/modules`**: ดึง Modules และ Lessons พร้อม progress
- **GET `/api/lessons/[lessonId]`**: ดึง Lesson content
- **POST `/api/lessons/[lessonId]`**: Update lesson progress

### Pitching Highlight: แก้ปัญหา/สร้างความว้าวอย่างไร

**จุดเด่น**:
- **Structured Learning**: มีโครงสร้างการเรียนรู้ที่ชัดเจน (Modules → Lessons)
- **Progress Visibility**: เห็น progress ได้ชัดเจน ทำให้มี motivation
- **Flexible Content**: รองรับเนื้อหาที่หลากหลาย (text, images, quiz, practice links)
- **Template-based**: อัปเดตเนื้อหาได้ง่ายโดยไม่กระทบ progress

**แก้ปัญหา**:
- **Learning Path Confusion**: มีเส้นทางการเรียนรู้ที่ชัดเจน
- **Progress Tracking**: ติดตามความคืบหน้าได้อย่างละเอียด
- **Content Management**: จัดการเนื้อหาได้ง่ายและมีประสิทธิภาพ

---

## 4. Self-Learning Mode: Practice Modes (`/learn/self/practice/`)

### 4.1 Quick Practice (`/learn/self/practice/quick/`)

#### What it does: สิ่งที่ User เห็นและทำได้

**Quick Practice** เป็นโหมดการฝึกฝนที่ **เริ่มต้นได้ทันที** ไม่ต้องตั้งค่าอะไร

**ขั้นตอนการใช้งาน**:
1. **เลือกโหมดการฝึก**:
   - **ฝึกอ่านค่ารหัสสี**: ฝึกแปลงค่าความต้านทาน ↔ สีแถบ ทีละแถบ
   - **ฝึกอ่านค่าตัวต้านทาน**: อ่านค่าความต้านทานจากแถบสี หรือเลือกสีจากค่า
2. **เลือกประเภทตัวต้านทาน**: 4 แถบสี หรือ 5 แถบสี
3. **เลือกประเภทคำตอบ** (สำหรับแบบปกติ):
   - **ตัวเลือก**: เลือกคำตอบจาก 4 ตัวเลือก
   - **เติมคำ**: พิมพ์ค่าความต้านทานโดยตรง
   - **เลือกสี**: กำหนดค่า แล้วเลือกแถบสีที่ถูกต้อง
4. **เลือกแถบที่ต้องการฝึก** (สำหรับฝึกอ่านค่ารหัสสี): เลือกแถบที่ต้องการฝึกเป็นพิเศษ
5. **เริ่มฝึก**: ระบบสร้างคำถามแบบ dynamic และเริ่มฝึก

**Features**:
- **No Configuration**: ไม่ต้องตั้งค่า เริ่มได้ทันที
- **Unlimited Questions**: คำถามไม่จำกัด
- **No Time Limit**: ไม่จำกัดเวลา
- **Immediate Feedback**: แสดงคำตอบทันที

#### Behind the Code: Logic เบื้องหลัง

**Question Generation**:

1. **Frontend สร้างคำถามแบบ dynamic**:
   - ใช้ `questionGenerator.ts` เพื่อสร้างคำถามแบบ random
   - ไม่ต้องเรียก API เพราะคำถามถูกสร้างที่ client-side
2. **Question Generation Logic**:
   - สุ่มแถบสีตามประเภทตัวต้านทาน (4-band หรือ 5-band)
   - คำนวณค่าความต้านทานจากแถบสี
   - สร้างตัวเลือก (สำหรับ multiple choice):
     - ใช้ `generateWrongAnswers()` เพื่อสร้างคำตอบผิด
     - ปรับ difficulty ตามระดับ (easy, medium, hard)
   - Format คำตอบด้วย `formatResistance()`

**Answer Validation**:

1. **User ตอบคำถาม** → Frontend ตรวจสอบคำตอบทันที
2. **Validation Logic**:
   - เปรียบเทียบ user answer กับ correct answer
   - แสดง feedback (ถูก/ผิด)
   - แสดง explanation (คำอธิบาย)

**Session Tracking**:

1. **User ทำเสร็จ** → เรียก API `POST /api/practice-sessions`
2. **API Route บันทึก session**:
   - เก็บ session data (questions, answers, accuracy, time)
   - เก็บ analytics data ใน JSON field
   - เก็บ question history สำหรับ deep analytics

#### Endpoint Connection

- **POST `/api/practice-sessions`**: บันทึก practice session

#### Pitching Highlight: แก้ปัญหา/สร้างความว้าวอย่างไร

**จุดเด่น**:
- **Zero Friction**: เริ่มได้ทันที ไม่ต้องตั้งค่า
- **Infinite Questions**: สร้างคำถามได้ไม่จำกัด
- **Dynamic Generation**: คำถามถูกสร้างแบบ dynamic ไม่ต้องเก็บใน database
- **Immediate Feedback**: แสดง feedback ทันที

**แก้ปัญหา**:
- **Quick Start**: ผู้ใช้เริ่มฝึกได้ทันที ไม่ต้องเสียเวลา setup
- **Unlimited Practice**: ฝึกได้ไม่จำกัด ไม่ต้องกังวลว่าคำถามจะหมด

---

### 4.2 Custom Practice (`/learn/self/practice/custom/`)

#### What it does: สิ่งที่ User เห็นและทำได้

**Custom Practice** เป็นโหมดการฝึกฝนที่ **ปรับแต่งได้ทุกอย่าง** ตามต้องการ

**การตั้งค่า**:
1. **รูปแบบการฝึก**: ฝึกอ่านค่ารหัสสี หรือ ฝึกอ่านค่าตัวต้านทาน
2. **ประเภทตัวต้านทาน**: 4 แถบสี หรือ 5 แถบสี
3. **ประเภทคำตอบ** (สำหรับแบบปกติ): ตัวเลือก, เติมคำ, หรือเลือกสี
4. **โหมดการฝึกอ่านค่ารหัสสี** (สำหรับฝึกอ่านค่ารหัสสี): ค่า → สี, หรือ สี → ค่า
5. **ระดับความยาก** (สำหรับแบบปกติ): ง่าย, ปานกลาง, หรือ ยาก
6. **จำนวนตัวเลือก** (สำหรับ multiple choice): 2, 3, หรือ 4 ตัวเลือก
7. **จำนวนคำถาม**: 5, 10, 20, 50, หรือ ไม่จำกัด
8. **ตัวจับเวลานับถอยหลัง** (ไม่บังคับ): 5-120 วินาทีต่อคำถาม
9. **จำกัดเวลารวม** (ไม่บังคับ): 5, 10, 20, หรือ 30 นาที

**Features**:
- **Full Customization**: ปรับแต่งได้ทุกอย่าง
- **Time Management**: ตั้งเวลาได้ทั้งแบบ countdown และ time limit
- **Difficulty Control**: เลือกระดับความยากได้
- **Question Limit**: กำหนดจำนวนคำถามได้

#### Behind the Code: Logic เบื้องหลัง

**Settings Management**:

1. **Frontend เก็บ settings ใน state**:
   - ใช้ React state เพื่อเก็บ settings ทั้งหมด
   - Validate settings ก่อนเริ่มฝึก
2. **Settings Validation**:
   - ตรวจสอบว่า settings ครบถ้วน
   - ตรวจสอบว่า settings ไม่ขัดแย้งกัน (เช่น countdown และ time limit ไม่สามารถใช้พร้อมกันได้)

**Question Generation with Settings**:

1. **Frontend สร้างคำถามตาม settings**:
   - ใช้ `questionGenerator.ts` พร้อม settings
   - สร้างคำถามตาม difficulty level
   - สร้างตัวเลือกตาม optionCount
2. **Timer Management**:
   - **Countdown Timer**: นับถอยหลังต่อคำถาม
   - **Time Limit**: จำกัดเวลารวม
   - ใช้ `setInterval` เพื่อ update timer

**Session Saving**:

1. **User ทำเสร็จ** → เรียก API `POST /api/practice-sessions`
2. **API Route บันทึก session พร้อม settings**:
   - เก็บ settings ที่ใช้ใน JSON field
   - เก็บ session results (questions, answers, accuracy, time)
   - เก็บ analytics data

#### Endpoint Connection

- **POST `/api/practice-sessions`**: บันทึก practice session พร้อม settings

#### Pitching Highlight: แก้ปัญหา/สร้างความว้าวอย่างไร

**จุดเด่น**:
- **Full Control**: ผู้ใช้ควบคุมการฝึกได้ทุกอย่าง
- **Adaptive Learning**: ปรับแต่งตามความต้องการและระดับความสามารถ
- **Time Management**: ฝึกแบบ timed เพื่อเพิ่มความท้าทาย
- **Progressive Difficulty**: เลือกระดับความยากได้

**แก้ปัญหา**:
- **Personalization**: ปรับแต่งการฝึกตามความต้องการ
- **Skill Development**: เลือกระดับความยากตามความสามารถ
- **Time Pressure**: ฝึกแบบ timed เพื่อเพิ่มความท้าทาย

---

### 4.3 Color Reading Practice (`/learn/self/practice/color-reading/`)

#### What it does: สิ่งที่ User เห็นและทำได้

**Color Reading Practice** เป็นโหมดพิเศษสำหรับ **ฝึกอ่านค่ารหัสสีโดยเฉพาะ**

**โหมดการฝึก**:
1. **ค่า → สี (เลือกทั้งหมด)**: แสดงค่า แล้วเลือกสีทั้งหมด
2. **ค่า → สี (ทีละแถบ)**: แสดงค่า แล้วถามทีละแถบสีตามลำดับ
3. **สี → ค่า**: แสดงแถบสี แล้วถามค่าความต้านทาน
4. **สลับกัน**: สุ่มสลับระหว่างค่า→สี และ สี→ค่า
5. **แบบครบวงจร**: รวมทั้งค่า→สี และ สี→ค่า พร้อมโหมดทีละแถบ

**Features**:
- **Band-by-Band Practice**: ฝึกทีละแถบเพื่อเน้นจุดอ่อน
- **Comprehensive Practice**: ฝึกแบบครบวงจร
- **Mixed Practice**: สลับระหว่างโหมดต่างๆ

#### Behind the Code: Logic เบื้องหลัง

**Band-by-Band Question Generation**:

1. **Frontend สร้างคำถามแบบ band-by-band**:
   - ใช้ `generateValueToColorBandQuestion()` หรือ `generateColorToValueBandQuestion()`
   - สุ่มเฉพาะแถบที่เลือก
   - แสดงเฉพาะค่าของแถบนั้น
2. **Question Logic**:
   - **Value to Color Band-by-Band**: 
     - สุ่มค่าความต้านทาน
     - แสดงเฉพาะค่าของแถบที่เลือก
     - User เลือกสีของแถบนั้น
   - **Color to Value**:
     - สุ่มแถบสี
     - แสดงแถบสีทั้งหมด
     - User ตอบค่าความต้านทาน

**All Options Display**:

- สำหรับ band-by-band practice ระบบแสดง **ตัวเลือกทั้งหมด** ที่เป็นไปได้ (ไม่ใช่แค่ 4 ตัวเลือก)
- เช่น ถ้าถามหลักที่ 1 จะแสดงตัวเลือก 1-9 ทั้งหมด
- ทำให้ผู้เรียนเห็นภาพรวมของตัวเลือกทั้งหมด

#### Endpoint Connection

- **POST `/api/practice-sessions`**: บันทึก practice session

#### Pitching Highlight: แก้ปัญหา/สร้างความว้าวอย่างไร

**จุดเด่น**:
- **Targeted Practice**: ฝึกเฉพาะแถบที่ต้องการ
- **Comprehensive Learning**: ฝึกแบบครบวงจร
- **All Options Display**: แสดงตัวเลือกทั้งหมดเพื่อการเรียนรู้

**แก้ปัญหา**:
- **Weak Spot Training**: ฝึกเฉพาะจุดอ่อน
- **Complete Understanding**: เข้าใจทั้งค่า→สี และ สี→ค่า
- **Visual Learning**: เห็นตัวเลือกทั้งหมดเพื่อการเรียนรู้

---

### 4.4 Practice Session History (`/learn/self/practice/`)

#### What it does: สิ่งที่ User เห็นและทำได้

**Practice Session History** แสดงประวัติการฝึกฝนทั้งหมด

**Features**:
- **Session List**: แสดงรายการ sessions ทั้งหมด
- **Filtering**: กรองตาม session type, resistor type, difficulty
- **Search**: ค้นหา sessions
- **Pagination**: แบ่งหน้าแสดงผล
- **Session Details**: คลิกเพื่อดูรายละเอียด session

**Information Displayed**:
- Session name
- Resistor type (4-band หรือ 5-band)
- Difficulty level
- Accuracy (คะแนน)
- Correct/Incorrect answers
- Average time per question
- Date

#### Behind the Code: Logic เบื้องหลัง

**Data Fetching**:

1. **Frontend เรียก API** `GET /api/practice-sessions?limit=100`
2. **API Route ดึงข้อมูล**:
   - ดึง Practice Sessions ทั้งหมดของ user
   - Filter สำหรับ self-learning (courseId = null)
   - Transform sessions เพื่อรวม sessionName และ sessionType
3. **Frontend แสดง sessions**:
   - Filter และ search ใน client-side
   - Pagination ใน client-side

**Session Name Generation**:

- ใช้ `formatSessionName()` จาก `practiceSessionUtils.ts`
- สร้างชื่อ session จาก settings และ presetName
- เช่น "ฝึกด่วน - 4 แถบสี - ตัวเลือก"

#### Endpoint Connection

- **GET `/api/practice-sessions`**: ดึง practice sessions

#### Pitching Highlight: แก้ปัญหา/สร้างความว้าวอย่างไร

**จุดเด่น**:
- **Progress Tracking**: เห็นประวัติการฝึกทั้งหมด
- **Easy Navigation**: ค้นหาและกรองได้ง่าย
- **Detailed Information**: ดูรายละเอียด session ได้

**แก้ปัญหา**:
- **Progress Visibility**: เห็นความก้าวหน้าได้ชัดเจน
- **Session Management**: จัดการ sessions ได้ง่าย

---

## 5. Self-Learning Mode: Dashboard (`/learn/self/dashboard/`)

### What it does: สิ่งที่ User เห็นและทำได้

**Dashboard** เป็นหน้าแสดงภาพรวมของความก้าวหน้าในการเรียนรู้

**Components**:
1. **Welcome Section**: ต้อนรับพร้อมชื่อ user และวันที่
2. **Stats Cards**: 
   - บทเรียนที่ผ่าน (Lessons Completed)
   - ความแม่นยำเฉลี่ย (Overall Accuracy)
   - เซสชันฝึกแล้ว (Total Sessions)
   - เวลาฝึกรวม (Total Practice Time)
3. **Quick Actions**: 
   - ปุ่ม "ฝึกด่วน"
   - ปุ่ม "กำหนดเอง"
4. **Trend Chart**: แสดงแนวโน้มความแม่นยำพร้อม predictions
5. **Deep Analytics**: แสดง Deep Analytics (position errors, color confusion)
6. **Recent Sessions**: แสดง sessions ล่าสุด

### Behind the Code: Logic เบื้องหลัง

**Data Fetching**:

1. **Frontend เรียก APIs หลายตัวพร้อมกัน**:
   - `GET /api/dashboard/stats`: สถิติรวม
   - `GET /api/practice-sessions?limit=20`: Sessions ล่าสุด
   - `GET /api/analytics/practice`: Deep Analytics
2. **API Routes ดึงข้อมูล**:
   - **Dashboard Stats**: 
     - นับ lessons ที่ completed (courseId = null)
     - นับ practice sessions (courseId = null)
     - คำนวณ overall accuracy
     - คำนวณ total practice time
   - **Practice Sessions**: ดึง sessions ล่าสุด
   - **Analytics**: เรียก `aggregateDeepAnalytics()` เพื่อวิเคราะห์ข้อมูล

**Chart Data Processing**:

1. **Frontend process sessions สำหรับ chart**:
   - Group sessions by date
   - Calculate average accuracy per day
   - Calculate moving average (trend)
   - Generate predictions (5 days ahead)
2. **Chart Display**:
   - แสดง actual accuracy (area chart)
   - แสดง trend line (dashed line)
   - แสดง predictions (dashed line with dots)

**Statistics Calculation**:

- **Average**: ค่าเฉลี่ยของ accuracy
- **Improvement Rate**: อัตราการปรับปรุง (เปรียบเทียบกับช่วงก่อนหน้า)
- **Best Score**: คะแนนสูงสุด
- **Trend**: แนวโน้ม (up, down, stable)

### Endpoint Connection

- **GET `/api/dashboard/stats`**: สถิติรวม
- **GET `/api/practice-sessions`**: Sessions ล่าสุด
- **GET `/api/analytics/practice`**: Deep Analytics

### Pitching Highlight: แก้ปัญหา/สร้างความว้าวอย่างไร

**จุดเด่น**:
- **Comprehensive Overview**: เห็นภาพรวมทั้งหมดในที่เดียว
- **Trend Analysis**: เห็นแนวโน้มและทำนายอนาคต
- **Deep Insights**: วิเคราะห์จุดอ่อนได้ละเอียด
- **Motivation**: แสดงความก้าวหน้าเพื่อสร้าง motivation

**แก้ปัญหา**:
- **Progress Visibility**: เห็นความก้าวหน้าได้ชัดเจน
- **Weak Spot Identification**: ระบุจุดอ่อนได้
- **Motivation**: สร้าง motivation ผ่าน progress visualization

---

## 6. Classroom Mode: Course Management (`/learn/classroom/`)

### 6.1 Course List (`/learn/classroom/`)

#### What it does: สิ่งที่ User เห็นและทำได้

**Course List** แสดงรายการคอร์สทั้งหมด

**สำหรับ Students**:
- แสดงคอร์สที่ **enrolled** แล้ว
- แสดง progress ของแต่ละคอร์ส
- มีปุ่ม "Join Course" สำหรับคอร์สที่ยังไม่ได้ enroll

**สำหรับ Teachers**:
- แสดงคอร์สที่ **สร้าง** แล้ว
- แสดงจำนวนนักเรียนและ assignments
- มีปุ่ม "Create Course"

#### Behind the Code: Logic เบื้องหลัง

**Data Fetching**:

1. **Frontend เรียก API** `GET /api/courses`
2. **API Route ดึงข้อมูลตาม role**:
   - **Students**: ดึงคอร์สที่ enrolled
   - **Teachers**: ดึงคอร์สที่สร้าง
   - **Optional**: `?all=true` เพื่อดูคอร์สทั้งหมด (published)
3. **API Route รวมข้อมูล**:
   - รวม enrollment count
   - รวม assignment count
   - รวม announcement count
   - ตรวจสอบ enrollment status (สำหรับ students)

#### Endpoint Connection

- **GET `/api/courses`**: ดึงรายการคอร์ส

#### Pitching Highlight: แก้ปัญหา/สร้างความว้าวอย่างไร

**จุดเด่น**:
- **Role-based View**: แสดงข้อมูลตาม role
- **Quick Overview**: เห็นภาพรวมของคอร์สได้เร็ว
- **Easy Navigation**: เข้าถึงคอร์สได้ง่าย

---

### 6.2 Course Detail (`/learn/classroom/courses/[courseId]/`)

#### What it does: สิ่งที่ User เห็นและทำได้

**Course Detail** เป็นหน้าแสดงรายละเอียดของคอร์ส

**Tabs**:
1. **Overview**: ภาพรวมของคอร์ส
2. **Assignments**: งานที่มอบหมาย
3. **Announcements**: ประกาศข่าวสาร
4. **Learning Path**: เส้นทางการเรียนรู้ (course-specific)
5. **Classmates**: เพื่อนร่วมชั้น (สำหรับ students)
6. **Dashboard**: Dashboard สำหรับคอร์ส
7. **Settings**: ตั้งค่าคอร์ส (สำหรับ teachers)

**Features**:
- **Course Information**: ข้อมูลคอร์ส (name, description, dates)
- **Progress Tracking**: ติดตามความคืบหน้า
- **Quick Actions**: ปุ่มสำหรับทำ assignment หรือดู announcements

#### Behind the Code: Logic เบื้องหลัง

**Data Fetching**:

1. **Frontend เรียก APIs หลายตัว**:
   - `GET /api/courses/[courseId]`: ข้อมูลคอร์ส
   - `GET /api/courses/[courseId]/assignments`: Assignments
   - `GET /api/courses/[courseId]/announcements`: Announcements
   - `GET /api/courses/[courseId]/progress`: Progress
2. **API Routes ตรวจสอบ access**:
   - ตรวจสอบว่า user enrolled (สำหรับ students)
   - ตรวจสอบว่า user เป็น teacher (สำหรับ teachers)

#### Endpoint Connection

- **GET `/api/courses/[courseId]`**: ข้อมูลคอร์ส
- **GET `/api/courses/[courseId]/assignments`**: Assignments
- **GET `/api/courses/[courseId]/announcements`**: Announcements
- **GET `/api/courses/[courseId]/progress`**: Progress

#### Pitching Highlight: แก้ปัญหา/สร้างความว้าวอย่างไร

**จุดเด่น**:
- **Centralized Information**: ข้อมูลทั้งหมดอยู่ในที่เดียว
- **Easy Navigation**: ใช้ tabs เพื่อจัดระเบียบข้อมูล
- **Progress Visibility**: เห็นความคืบหน้าได้ชัดเจน

---

### 6.3 Assignments (`/learn/classroom/courses/[courseId]/assignments/`)

#### What it does: สิ่งที่ User เห็นและทำได้

**Assignments Page** แสดงรายการ assignments ทั้งหมด

**สำหรับ Students**:
- แสดง assignments ทั้งหมด
- แสดง completion status
- แสดง best score
- แสดง due date
- มีปุ่ม "Start Assignment" หรือ "View Result"

**สำหรับ Teachers**:
- แสดง assignments ทั้งหมด
- มีปุ่ม "Create Assignment"
- มีปุ่ม "Edit Assignment"
- แสดง statistics (จำนวนนักเรียนที่ทำ, average score)

**Assignment Types**:
1. **CUSTOM_QUIZ**: Quiz ที่สร้างจาก settings (dynamic questions)
2. **FIXED_QUESTIONS**: Quiz ที่มีคำถามตายตัว

**Assignment Modes**:
1. **PRACTICE**: แบบฝึกหัด (allow retake, has score)
2. **EXAM**: แบบทดสอบ (no retake, show score)

#### Behind the Code: Logic เบื้องหลัง

**Assignment Creation**:

1. **Teacher สร้าง Assignment**:
   - เรียก API `POST /api/courses/[courseId]/assignments`
   - ระบุ assignment type (CUSTOM_QUIZ หรือ FIXED_QUESTIONS)
   - ระบุ assignment mode (PRACTICE หรือ EXAM)
   - ระบุ settings (quizSettings, questions)
2. **API Route สร้าง Assignment**:
   - Validate settings
   - สร้าง CourseAssignment record
   - เก็บ settings ใน JSON field

**Assignment Attempt**:

1. **Student ทำ Assignment**:
   - เรียก API `POST /api/courses/[courseId]/assignments/[assignmentId]/attempt`
   - ส่ง answers
2. **API Route ประมวลผล**:
   - **CUSTOM_QUIZ**: สร้างคำถามจาก settings (ถ้ายังไม่ได้สร้าง)
   - **FIXED_QUESTIONS**: ใช้คำถามที่เก็บไว้
   - ตรวจสอบคำตอบ
   - คำนวณคะแนน
   - บันทึก attempt
   - ตรวจสอบว่า passed หรือไม่ (ตาม passThreshold)

**Progress Tracking**:

- ใช้ `LevelAttempt` model เพื่อเก็บ attempts
- เก็บ assignmentId เพื่อระบุว่าเป็น attempt ของ assignment ไหน
- เก็บ courseId เพื่อระบุว่าเป็น attempt ในคอร์สไหน

#### Endpoint Connection

- **GET `/api/courses/[courseId]/assignments`**: ดึงรายการ assignments
- **POST `/api/courses/[courseId]/assignments`**: สร้าง assignment (teachers only)
- **POST `/api/courses/[courseId]/assignments/[assignmentId]/attempt`**: ทำ assignment

#### Pitching Highlight: แก้ปัญหา/สร้างความว้าวอย่างไร

**จุดเด่น**:
- **Flexible Assignment Types**: รองรับทั้ง dynamic และ fixed questions
- **Dual Mode**: รองรับทั้ง practice และ exam mode
- **Auto Grading**: ตรวจคำตอบและคำนวณคะแนนอัตโนมัติ
- **Progress Tracking**: ติดตามความคืบหน้าได้ละเอียด

**แก้ปัญหา**:
- **Assignment Management**: จัดการ assignments ได้ง่าย
- **Flexible Assessment**: สร้าง assessments ได้หลากหลาย
- **Automated Grading**: ตรวจคำตอบอัตโนมัติ ลดงานครู

---

### 6.4 Announcements (`/learn/classroom/courses/[courseId]/announcements/`)

#### What it does: สิ่งที่ User เห็นและทำได้

**Announcements Page** แสดงรายการ announcements ทั้งหมด

**สำหรับ Students**:
- แสดง announcements ทั้งหมด (published)
- แสดง priority (HIGH, NORMAL, LOW)
- แสดง pinned announcements
- แสดง attachments (ถ้ามี)

**สำหรับ Teachers**:
- แสดง announcements ทั้งหมด (รวม drafts)
- มีปุ่ม "Create Announcement"
- มีปุ่ม "Edit Announcement"
- มีปุ่ม "Import from Word" และ "Export to Word"

**Features**:
- **Rich Text Editor**: ใช้ TipTap editor สำหรับเขียนเนื้อหา
- **Word Import/Export**: นำเข้าและส่งออกไฟล์ Word
- **Attachments**: แนบไฟล์ได้
- **Priority & Pinning**: ตั้ง priority และ pin announcements

#### Behind the Code: Logic เบื้องหลัง

**Announcement Creation**:

1. **Teacher สร้าง Announcement**:
   - ใช้ TipTap editor เพื่อเขียนเนื้อหา (HTML)
   - เรียก API `POST /api/courses/[courseId]/announcements`
   - ส่ง title, content (HTML), priority, attachments
2. **API Route สร้าง Announcement**:
   - Validate data
   - Sanitize HTML content (ใช้ `sanitizeHtml()`)
   - สร้าง Announcement record
   - เก็บ attachments ใน JSON field

**Word Import**:

1. **Teacher อัปโหลด Word document**:
   - เรียก API `POST /api/courses/[courseId]/announcements/import-word`
   - ส่งไฟล์ Word (.docx)
2. **API Route แปลง Word เป็น HTML**:
   - ใช้ `mammoth` library เพื่อแปลง Word เป็น HTML
   - Sanitize HTML
   - ส่ง HTML กลับไปยัง frontend
3. **Frontend แสดง HTML ใน editor**:
   - แสดง HTML ใน TipTap editor
   - Teacher แก้ไขและบันทึก

**Word Export**:

1. **Teacher Export Announcement**:
   - เรียก API `GET /api/courses/[courseId]/announcements/[announcementId]/export-word`
2. **API Route แปลง HTML เป็น Word**:
   - ใช้ `docx` library เพื่อสร้าง Word document
   - แปลง HTML เป็น Word paragraphs และ formatting
   - ส่ง Word file กลับไปยัง frontend
3. **Frontend download ไฟล์**:
   - ใช้ `downloadWord()` เพื่อ download ไฟล์

#### Endpoint Connection

- **GET `/api/courses/[courseId]/announcements`**: ดึงรายการ announcements
- **POST `/api/courses/[courseId]/announcements`**: สร้าง announcement (teachers only)
- **POST `/api/courses/[courseId]/announcements/import-word`**: Import Word document
- **GET `/api/courses/[courseId]/announcements/[announcementId]/export-word`**: Export Word document

#### Pitching Highlight: แก้ปัญหา/สร้างความว้าวอย่างไร

**จุดเด่น**:
- **Rich Text Support**: รองรับ rich text formatting
- **Word Integration**: นำเข้าและส่งออกไฟล์ Word ได้
- **Easy Content Creation**: สร้างเนื้อหาได้ง่ายด้วย rich text editor
- **Professional Formatting**: รองรับ formatting ที่หลากหลาย

**แก้ปัญหา**:
- **Content Creation**: สร้างเนื้อหาได้ง่ายและเร็ว
- **Document Management**: จัดการเอกสารได้สะดวก
- **Formatting Support**: รองรับ formatting ที่หลากหลาย

---

### 6.5 Student Analytics (`/learn/classroom/courses/[courseId]/dashboard/`)

#### What it does: สิ่งที่ User เห็นและทำได้

**Student Course Dashboard** แสดงภาพรวมของความก้าวหน้าในคอร์ส

**Components**:
1. **Progress Overview**: แสดง progress ของคอร์ส
2. **Stats Overview**: สถิติ (assignments completed, average score, time spent)
3. **Activity Chart**: แสดงกิจกรรมล่าสุด
4. **Recent Assignments**: แสดง assignments ล่าสุด
5. **Analytics**: แสดง Deep Analytics สำหรับคอร์สนี้

#### Behind the Code: Logic เบื้องหลัง

**Data Fetching**:

1. **Frontend เรียก APIs หลายตัว**:
   - `GET /api/courses/[courseId]`: ข้อมูลคอร์ส
   - `GET /api/courses/[courseId]/progress`: Progress
   - `GET /api/courses/[courseId]/assignments`: Assignments
   - `GET /api/courses/[courseId]/practice/sessions`: Practice sessions
   - `GET /api/courses/[courseId]/analytics`: Analytics
2. **API Routes ดึงข้อมูล**:
   - **Progress**: คำนวณ progress จาก assignments
   - **Analytics**: เรียก `calculateDeepAnalytics()` สำหรับคอร์สนี้

#### Endpoint Connection

- **GET `/api/courses/[courseId]/progress`**: Progress
- **GET `/api/courses/[courseId]/analytics`**: Analytics

#### Pitching Highlight: แก้ปัญหา/สร้างความว้าวอย่างไร

**จุดเด่น**:
- **Course-specific Analytics**: วิเคราะห์ข้อมูลเฉพาะคอร์สนี้
- **Progress Tracking**: ติดตามความคืบหน้าได้ละเอียด
- **Performance Insights**: เห็น performance ได้ชัดเจน

---

### 6.6 Teacher Analytics (`/learn/classroom/teacher/courses/[courseId]/analytics/`)

#### What it does: สิ่งที่ User เห็นและทำได้

**Teacher Analytics** แสดงการวิเคราะห์ข้อมูลของนักเรียนทั้งหมดในคอร์ส

**Components**:
1. **Overall Stats**: สถิติรวม (total sessions, total questions, overall accuracy)
2. **Top Weak Areas**: จุดอ่อนที่พบบ่อย
3. **Student Performance**: ผลการเรียนของนักเรียนแต่ละคน
4. **Deep Analytics**: การวิเคราะห์เชิงลึก (position errors, color confusion)

#### Behind the Code: Logic เบื้องหลัง

**Aggregate Analytics**:

1. **Frontend เรียก API** `GET /api/courses/[courseId]/analytics`
2. **API Route ดึงข้อมูล**:
   - ดึง enrollments ทั้งหมดของคอร์ส
   - ดึง practice sessions ของนักเรียนทั้งหมด
   - เรียก `calculateDeepAnalytics()` เพื่อวิเคราะห์ข้อมูลทั้งหมด
3. **Analytics Calculation**:
   - วิเคราะห์ position errors
   - วิเคราะห์ color confusion
   - วิเคราะห์ question type errors
   - ระบุ top weak areas

**Student Performance**:

- คำนวณ average score ของแต่ละนักเรียน
- แสดง completed assignments
- แสดง progress

#### Endpoint Connection

- **GET `/api/courses/[courseId]/analytics`**: Analytics (aggregate)
- **GET `/api/courses/[courseId]/students`**: รายชื่อนักเรียน

#### Pitching Highlight: แก้ปัญหา/สร้างความว้าวอย่างไร

**จุดเด่น**:
- **Class-wide Insights**: เห็นภาพรวมของทั้งชั้น
- **Weak Spot Identification**: ระบุจุดอ่อนที่พบบ่อย
- **Individual Tracking**: ติดตามนักเรียนแต่ละคนได้
- **Data-driven Teaching**: ใช้ข้อมูลเพื่อปรับปรุงการสอน

**แก้ปัญหา**:
- **Teaching Optimization**: ปรับปรุงการสอนตามข้อมูล
- **Student Support**: ช่วยนักเรียนที่มีปัญหาได้ตรงจุด
- **Class Management**: จัดการชั้นเรียนได้มีประสิทธิภาพ

---

## 7. Analytics: Deep Analytics System

### What it does: สิ่งที่ User เห็นและทำได้

**Deep Analytics** เป็นระบบวิเคราะห์ข้อมูลเชิงลึกที่สามารถระบุจุดอ่อนได้อย่างละเอียด

**Analytics Types**:
1. **Position-based Error Analysis**: วิเคราะห์ว่าทำผิดในตำแหน่งไหน
   - Position 1 (หลักที่ 1)
   - Position 2 (หลักที่ 2)
   - Position 3 (หลักที่ 3 - 5-band only)
   - Multiplier (ตัวคูณ)
   - Tolerance (ค่าความคลาดเคลื่อน)
2. **Color Confusion Analysis**: ระบุว่าผู้เรียนมักจำสีไหนผิดเป็นสีไหน
3. **Resistor Type Comparison**: เปรียบเทียบผลการเรียนระหว่าง 4-band และ 5-band
4. **Question Type Analysis**: วิเคราะห์ผลการเรียนตามประเภทคำถาม
5. **Resistor Value Errors**: วิเคราะห์ errors ตาม resistor value
6. **Tolerance Errors**: วิเคราะห์ errors ตาม tolerance

**Visualizations**:
- **Radar Chart**: แสดง Deep Analytics ในรูปแบบ radar
- **Heatmap**: แสดง Color Confusion Matrix
- **Bar Chart**: แสดง Error Rate ตามตำแหน่ง
- **Pie Chart**: แสดง Tolerance Errors

### Behind the Code: Logic เบื้องหลัง

**Data Collection**:

1. **เก็บ Question History**:
   - เก็บ question history ใน JSON field ของ `PracticeSession`
   - เก็บข้อมูล: bands, correctAnswer, userAnswer, isCorrect, digitPositions, explanation
2. **เก็บ Digit Positions**:
   - สำหรับ band-by-band practice เก็บ digit positions ของแต่ละแถบ
   - ใช้เพื่อวิเคราะห์ว่าทำผิดในตำแหน่งไหน

**Analytics Calculation**:

1. **เรียก `calculateDeepAnalytics()`**:
   - รับ question history array
   - วิเคราะห์ข้อมูลทีละ question
2. **Position Error Analysis**:
   - เปรียบเทียบ correct band กับ user band ในแต่ละตำแหน่ง
   - นับ errors ตามตำแหน่ง
   - เก็บ common mistakes (สีไหนผิดเป็นสีไหน)
3. **Color Confusion Analysis**:
   - เก็บ confusion matrix (correct color → wrong color)
   - คำนวณ frequency ของแต่ละ confusion
4. **Resistor Type Analysis**:
   - แยก errors ตาม resistor type (4-band vs 5-band)
   - คำนวณ accuracy สำหรับแต่ละ type
5. **Question Type Analysis**:
   - แยก errors ตาม question type
   - คำนวณ accuracy สำหรับแต่ละ type
6. **Resistor Value Analysis**:
   - วิเคราะห์ errors ตาม resistor value
   - เก็บ common wrong answers
7. **Tolerance Analysis**:
   - วิเคราะห์ errors ตาม tolerance
   - เก็บ common wrong tolerances

**Aggregation**:

- ใช้ `aggregateDeepAnalytics()` เพื่อรวมข้อมูลจากหลาย sessions
- คำนวณ overall statistics
- ระบุ top weak areas

### Endpoint Connection

- **GET `/api/analytics/practice`**: Aggregate analytics สำหรับ self-learning
- **GET `/api/courses/[courseId]/analytics`**: Analytics สำหรับคอร์ส

### Pitching Highlight: แก้ปัญหา/สร้างความว้าวอย่างไร

**จุดเด่น**:
- **Precise Identification**: ระบุจุดอ่อนได้ละเอียดมาก (ตำแหน่งไหน, สีไหน)
- **Color Confusion Detection**: ระบุสีที่สับสนได้
- **Comprehensive Analysis**: วิเคราะห์ได้หลายมิติ
- **Visual Insights**: แสดงผลด้วย charts ที่เข้าใจง่าย

**แก้ปัญหา**:
- **Weak Spot Identification**: ระบุจุดอ่อนได้ตรงจุด
- **Targeted Practice**: ฝึกเฉพาะจุดอ่อนได้
- **Learning Optimization**: ปรับปรุงการเรียนรู้ได้มีประสิทธิภาพ

---

## Summary: สรุป Features ทั้งหมด

**ResiLearn** มี features ที่หลากหลายและครอบคลุม:

1. **Learning Path System**: เส้นทางการเรียนรู้ที่มีโครงสร้างชัดเจน
2. **Practice Modes**: โหมดการฝึกฝนที่หลากหลาย (Quick, Custom, Color Reading)
3. **Classroom Management**: จัดการคอร์ส แบบเต็มรูปแบบ
4. **Deep Analytics**: วิเคราะห์ข้อมูลเชิงลึก
5. **Word Integration**: นำเข้าและส่งออกไฟล์ Word
6. **Google Classroom Integration**: เชื่อมต่อกับ Google Classroom

ทุก feature ถูกออกแบบมาเพื่อแก้ปัญหาและสร้างประสบการณ์ที่ดีให้กับผู้ใช้
