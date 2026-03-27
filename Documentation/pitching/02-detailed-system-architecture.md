# Detailed System Architecture - ResiLearn

## Folder Structure Analysis: โครงสร้างโฟลเดอร์และหน้าที่

### `/app` - Next.js App Router Structure

โฟลเดอร์ `/app` เป็น **หัวใจหลักของระบบ** ตาม Next.js App Router convention:

#### **`/app/(auth)/`** - Authentication Routes
- **หน้าที่**: จัดการ authentication pages
- **ไฟล์สำคัญ**:
  - `/login/page.tsx`: หน้า login
  - `/register/page.tsx`: หน้า register
- **เหตุผล**: ใช้ route group `(auth)` เพื่อจัดกลุ่ม routes โดยไม่เพิ่ม path segment ใน URL

#### **`/app/api/`** - API Routes
- **หน้าที่**: เป็น **ประตูบ้านของระบบ** รับ request จาก frontend และประมวลผล
- **โครงสร้าง**:
  - `/api/auth/[...nextauth]/route.ts`: NextAuth.js authentication endpoints
  - `/api/modules/route.ts`: จัดการ Modules (Learning Path)
  - `/api/lessons/[lessonId]/route.ts`: จัดการ Lessons
  - `/api/courses/`: จัดการ Courses (CRUD, Enrollment, Google Classroom)
  - `/api/courses/[courseId]/assignments/`: จัดการ Assignments
  - `/api/courses/[courseId]/announcements/`: จัดการ Announcements (พร้อม Word import/export)
  - `/api/practice-sessions/route.ts`: จัดการ Practice Sessions
  - `/api/analytics/`: วิเคราะห์ข้อมูล (Deep Analytics)
  - `/api/dashboard/stats/route.ts`: สถิติสำหรับ Dashboard
- **เหตุผล**: แยก API endpoints ตาม domain logic ทำให้จัดการได้ง่าย

#### **`/app/learn/`** - Learning Routes
- **หน้าที่**: หน้าเรียนรู้หลักของระบบ
- **โครงสร้าง**:
  - `/app/learn/self/`: Self-Learning Mode
    - `/learningpath/`: Learning Path (Modules & Lessons)
    - `/practice/`: Practice Modes (Quick, Custom, Color Reading)
    - `/dashboard/`: Dashboard สำหรับ Self-Learning
  - `/app/learn/classroom/`: Classroom Mode
    - `/courses/[courseId]/`: Course Detail (Dashboard, Assignments, Announcements, Learning Path)
    - `/teacher/`: Teacher Pages (Course Management, Analytics, Student Management)
- **เหตุผล**: แยก routes ตาม mode (self vs classroom) ทำให้โครงสร้างชัดเจน

#### **`/app/page.tsx`** - Landing Page
- **หน้าที่**: หน้าแรกของเว็บไซต์
- **เหตุผล**: เป็น entry point ของระบบ

### `/components` - React Components Organization

โฟลเดอร์ `/components` เก็บ React components ทั้งหมด:

#### **`/components/features/`** - Feature Components
- **หน้าที่**: Components ที่เป็น features หลักของระบบ
- **ไฟล์สำคัญ**:
  - `ResistorDisplay.tsx`: แสดงตัวต้านทานแบบ 2D (ใช้ SVG overlay บน template image)
  - `Resistor3DModel.tsx`: แสดงตัวต้านทานแบบ 3D (ใช้ React Three Fiber)
  - `ColorBandSelector.tsx`: เลือกแถบสี
  - `ColorToValuePractice.tsx`: ฝึก Color to Value
  - `ValueToColorPractice.tsx`: ฝึก Value to Color

#### **`/components/learning-path/`** - Learning Path Components
- **หน้าที่**: Components สำหรับ Learning Path
- **ไฟล์สำคัญ**:
  - `LessonView.tsx`: แสดงบทเรียน (sections, quiz, practice links)
  - `LessonContentView.tsx`: แสดงเนื้อหาบทเรียน

#### **`/components/analytics/`** - Analytics Components
- **หน้าที่**: Components สำหรับแสดง analytics
- **ไฟล์สำคัญ**:
  - `DeepAnalyticsRadarChart.tsx`: แสดง Deep Analytics ในรูปแบบ Radar Chart
  - `ColorConfusionHeatmap.tsx`: แสดง Color Confusion Matrix
  - `ErrorRateBarChart.tsx`: แสดง Error Rate ตามตำแหน่ง
  - `ResistorValueErrorChart.tsx`: แสดง Error ตาม Resistor Value

#### **`/components/classroom/`** - Classroom Components
- **หน้าที่**: Components สำหรับ Classroom Mode
- **ไฟล์สำคัญ**:
  - `CourseAnalytics.tsx`: Analytics สำหรับคอร์ส
  - `CourseProgressOverview.tsx`: Overview ของ progress
  - `RecentAssignments.tsx`: แสดง assignments ล่าสุด

#### **`/components/layout/`** - Layout Components
- **หน้าที่**: Components สำหรับ layout
- **ไฟล์สำคัญ**:
  - `Navbar.tsx`: Navigation bar
  - `LeftSidebar.tsx`: Sidebar สำหรับ Learning Path
  - `ClassroomSidebar.tsx`: Sidebar สำหรับ Classroom
  - `TeacherSidebar.tsx`: Sidebar สำหรับ Teacher

#### **`/components/ui/`** - UI Components
- **หน้าที่**: Reusable UI components (shadcn/ui style)
- **ไฟล์สำคัญ**:
  - `dialog.tsx`: Dialog component

### `/lib` - Utility Libraries และ Business Logic

โฟลเดอร์ `/lib` เก็บ utility functions และ business logic:

#### **`/lib/db.ts`** - Database Client
- **หน้าที่**: Prisma Client singleton
- **เหตุผล**: ใช้ singleton pattern เพื่อป้องกันการสร้าง Prisma Client หลายตัว

#### **`/lib/auth.ts`** - Authentication Configuration
- **หน้าที่**: NextAuth.js configuration
- **เหตุผล**: แยก auth config ออกมาเพื่อให้จัดการได้ง่าย

#### **`/lib/questionGenerator.ts`** - Question Generation
- **หน้าที่**: สร้างคำถามแบบ dynamic
- **เหตุผล**: แยก logic การสร้างคำถามออกมาเพื่อให้ reuse ได้

#### **`/lib/resistorUtils.ts`** - Resistor Utilities
- **หน้าที่**: ฟังก์ชันสำหรับคำนวณและ format ค่าตัวต้านทาน
- **เหตุผล**: แยก business logic ออกมาเพื่อให้ maintain ได้ง่าย

#### **`/lib/analyticsUtils.ts`** - Analytics Utilities
- **หน้าที่**: วิเคราะห์ข้อมูลจาก practice sessions
- **เหตุผล**: แยก analytics logic ออกมาเพื่อให้ reuse ได้

#### **`/lib/practiceSessionUtils.ts`** - Practice Session Utilities
- **หน้าที่**: Helper functions สำหรับ practice sessions
- **เหตุผล**: แยก utility functions ออกมาเพื่อให้จัดการได้ง่าย

#### **`/lib/classroom.ts`** - Classroom Utilities
- **หน้าที่**: Helper functions สำหรับ classroom operations
- **เหตุผล**: แยก classroom logic ออกมาเพื่อให้จัดการได้ง่าย

#### **`/lib/wordImport.ts`** และ **`/lib/wordExport.ts`** - Word Document Integration
- **หน้าที่**: Import และ Export ไฟล์ Word
- **เหตุผล**: แยก Word document logic ออกมาเพื่อให้จัดการได้ง่าย

### `/prisma` - Database Schema

โฟลเดอร์ `/prisma` เก็บ database schema และ migrations:

#### **`/prisma/schema.prisma`** - Database Schema
- **หน้าที่**: กำหนด database schema ทั้งหมด
- **Models หลัก**:
  - `User`: ผู้ใช้ (STUDENT, TEACHER, ADMIN)
  - `Module`, `Lesson`: Learning Path content (templates)
  - `LessonProgress`, `ModuleProgress`: User progress
  - `Course`, `Enrollment`: Course management
  - `CourseAssignment`: Assignments
  - `Announcement`: Announcements
  - `PracticeSession`: Practice session history
  - `PracticePreset`: Practice presets
  - `Level`, `LevelAttempt`: Level-based learning (legacy)
- **เหตุผล**: ใช้ Prisma schema เพื่อ generate TypeScript types และ migrations

#### **`/prisma/migrations/`** - Database Migrations
- **หน้าที่**: เก็บ database migration history
- **เหตุผล**: ใช้ migrations เพื่อจัดการ database schema changes

### `/types` - TypeScript Types

โฟลเดอร์ `/types` เก็บ TypeScript type definitions:

- `classroom.ts`: Types สำหรับ classroom features
- `practiceSession.ts`: Types สำหรับ practice sessions
- `next-auth.d.ts`: NextAuth.js type extensions

### `/hooks` - Custom React Hooks

โฟลเดอร์ `/hooks` เก็บ custom React hooks:

- `useCustomPractice.ts`: Hook สำหรับ custom practice

### `/store` - State Management

โฟลเดอร์ `/store` เก็บ state management:

- `languageStore.ts`: Zustand store สำหรับ language preference

---

## Data Flow: การไหลของข้อมูลในระบบ

### 1. Authentication Flow (การยืนยันตัวตน)

```
User → Login Page → NextAuth.js API Route → Prisma → PostgreSQL
                                              ↓
User ← Session Cookie ← JWT Token ← User Data
```

**ขั้นตอนละเอียด**:

1. **User กรอกข้อมูล login** ในหน้า `/login`
2. **Frontend ส่ง request** ไปยัง `/api/auth/[...nextauth]/signin`
3. **NextAuth.js ตรวจสอบ credentials**:
   - ถ้าเป็น Google OAuth: redirect ไปยัง Google
   - ถ้าเป็น Email/Password: ตรวจสอบ password ด้วย bcrypt
4. **Prisma query** ข้อมูล user จาก PostgreSQL
5. **NextAuth.js สร้าง JWT token** และ session
6. **Frontend รับ session cookie** และ redirect ไปยัง dashboard
7. **Middleware ตรวจสอบ session** สำหรับ protected routes

### 2. Learning Path Flow (เส้นทางการเรียนรู้)

```
User → Learning Path Page → API: GET /api/modules → Prisma → PostgreSQL
                                                      ↓
User ← Modules + Progress ← Template Data + User Progress
```

**ขั้นตอนละเอียด**:

1. **User เข้าหน้า Learning Path** (`/learn/self/learningpath`)
2. **Frontend เรียก API** `GET /api/modules`
3. **API Route ดึงข้อมูล**:
   - ดึง Modules และ Lessons (templates) จาก database
   - ดึง User Progress (completed status) จาก `LessonProgress` และ `ModuleProgress`
   - รวมข้อมูล template กับ progress
4. **Frontend แสดง Learning Path** พร้อม progress indicators
5. **User คลิก Lesson** → เรียก API `GET /api/lessons/[lessonId]`
6. **API Route ดึงข้อมูล Lesson**:
   - ดึง Lesson template (sections, quiz, practice links)
   - ดึง User Progress (completed status)
7. **Frontend แสดง Lesson** พร้อมเนื้อหา
8. **User ทำ Lesson เสร็จ** → เรียก API `POST /api/lessons/[lessonId]` เพื่อ update progress
9. **API Route update progress**:
   - Update `LessonProgress`
   - Calculate และ update `ModuleProgress`

### 3. Practice Session Flow (การฝึกฝน)

```
User → Practice Page → Generate Questions (Client-side) → User Answers
                                                              ↓
User ← Results ← API: POST /api/practice-sessions ← Session Data
```

**ขั้นตอนละเอียด**:

1. **User เข้าหน้า Practice** (`/learn/self/practice/quick` หรือ `/custom`)
2. **Frontend สร้างคำถามแบบ dynamic**:
   - ใช้ `questionGenerator.ts` เพื่อสร้างคำถามแบบ random
   - ไม่ต้องเรียก API เพราะคำถามถูกสร้างที่ client-side
3. **User ตอบคำถาม**:
   - Frontend ตรวจสอบคำตอบทันที
   - แสดง feedback และ explanation
4. **User ทำเสร็จ** → เรียก API `POST /api/practice-sessions`
5. **API Route บันทึก session**:
   - เก็บ session data (questions, answers, accuracy, time)
   - เก็บ analytics data ใน JSON field
6. **Frontend แสดงผลลัพธ์** และ redirect ไปยัง session history

### 4. Course Management Flow (การจัดการคอร์ส)

```
Teacher → Create Course → API: POST /api/courses → Prisma → PostgreSQL
                                                      ↓
Teacher ← Course Data ← Course Created
```

**ขั้นตอนละเอียด**:

1. **Teacher สร้าง Course**:
   - กรอกข้อมูล course (name, description, dates)
   - เรียก API `POST /api/courses`
2. **API Route สร้าง Course**:
   - Generate unique course code
   - สร้าง Course record ใน database
3. **Teacher เพิ่ม Students**:
   - Manual enrollment: เรียก API `POST /api/courses/[courseId]/enrollments`
   - Google Classroom: เรียก API `POST /api/courses/[courseId]/google-classroom` เพื่อ sync
4. **Teacher สร้าง Assignment**:
   - เรียก API `POST /api/courses/[courseId]/assignments`
   - ระบุ assignment type (CUSTOM_QUIZ หรือ FIXED_QUESTIONS)
5. **Student ทำ Assignment**:
   - เรียก API `POST /api/courses/[courseId]/assignments/[assignmentId]/attempt`
   - API Route บันทึก attempt และคำนวณคะแนน

### 5. Analytics Flow (การวิเคราะห์ข้อมูล)

```
User → Analytics Page → API: GET /api/analytics/practice → Prisma → PostgreSQL
                                                              ↓
User ← Analytics Data ← Aggregate Analytics ← Practice Sessions
```

**ขั้นตอนละเอียด**:

1. **User เข้าหน้า Analytics** (`/learn/self/dashboard` หรือ course analytics)
2. **Frontend เรียก API** `GET /api/analytics/practice`
3. **API Route ดึงข้อมูล**:
   - ดึง Practice Sessions ทั้งหมดของ user
   - เรียก `aggregateDeepAnalytics()` จาก `analyticsUtils.ts`
4. **Analytics Utils วิเคราะห์ข้อมูล**:
   - วิเคราะห์ Position-based errors
   - วิเคราะห์ Color confusion
   - วิเคราะห์ Question type errors
   - วิเคราะห์ Resistor value errors
5. **API Route ส่งข้อมูลกลับ**:
   - Overall stats (total sessions, accuracy)
   - Deep analytics (position errors, color confusion)
   - Top weak areas
6. **Frontend แสดง Analytics**:
   - Charts (Radar Chart, Heatmap, Bar Chart)
   - Tables และ statistics

### 6. Word Document Import/Export Flow

```
Teacher → Import Word → API: POST /api/courses/[courseId]/announcements/import-word
                           ↓
Teacher ← HTML Content ← Word → HTML Conversion (mammoth)
```

**ขั้นตอนละเอียด**:

1. **Teacher อัปโหลด Word document**:
   - เรียก API `POST /api/courses/[courseId]/announcements/import-word`
   - ส่งไฟล์ Word (.docx)
2. **API Route แปลง Word เป็น HTML**:
   - ใช้ `mammoth` library เพื่อแปลง Word เป็น HTML
   - Sanitize HTML เพื่อความปลอดภัย
3. **API Route ส่ง HTML กลับ**:
   - Frontend แสดง HTML ใน rich text editor
4. **Teacher แก้ไขและบันทึก**:
   - เรียก API `POST /api/courses/[courseId]/announcements`
   - บันทึก HTML content ใน database

**Export Flow**:

1. **Teacher Export Announcement**:
   - เรียก API `GET /api/courses/[courseId]/announcements/[announcementId]/export-word`
2. **API Route แปลง HTML เป็น Word**:
   - ใช้ `docx` library เพื่อสร้าง Word document
   - แปลง HTML เป็น Word paragraphs และ formatting
3. **API Route ส่ง Word file กลับ**:
   - Frontend download ไฟล์ Word

---

## Architecture Patterns: รูปแบบสถาปัตยกรรมที่ใช้

### 1. **Template-based Content Pattern**

**แนวคิด**: เนื้อหา (Modules, Lessons) เป็น **templates** ที่ใช้ร่วมกันทุก user แต่ละ user มี progress ของตัวเองแยกต่างหาก

**ประโยชน์**:
- **Efficiency**: ไม่ต้องเก็บเนื้อหาซ้ำสำหรับแต่ละ user
- **Consistency**: ทุก user เห็นเนื้อหาเดียวกัน
- **Easy Updates**: อัปเดตเนื้อหาได้โดยไม่กระทบ progress ของ user

**Implementation**:
- `Module` และ `Lesson` models เป็น templates
- `LessonProgress` และ `ModuleProgress` models เก็บ progress ของแต่ละ user
- API routes รวม template data กับ user progress

### 2. **Dynamic Question Generation Pattern**

**แนวคิด**: สร้างคำถามแบบ **dynamic** ที่ client-side ไม่ต้องเก็บคำถามใน database

**ประโยชน์**:
- **Infinite Questions**: สร้างคำถามได้ไม่จำกัด
- **No Storage**: ไม่ต้องเก็บคำถามใน database
- **Flexibility**: ปรับ difficulty และ parameters ได้ง่าย

**Implementation**:
- `questionGenerator.ts` สร้างคำถามแบบ random
- ใช้ color code rules เพื่อสร้างคำถามที่ถูกต้อง
- เก็บเฉพาะ session results (questions, answers) ใน database

### 3. **Deep Analytics Pattern**

**แนวคิด**: วิเคราะห์ข้อมูลจาก **question history** ที่เก็บไว้ใน practice sessions

**ประโยชน์**:
- **Detailed Insights**: วิเคราะห์ได้ละเอียดมาก
- **Position-based Analysis**: ระบุจุดอ่อนได้ตามตำแหน่ง
- **Color Confusion Detection**: ระบุสีที่สับสนได้

**Implementation**:
- เก็บ question history ใน JSON field ของ `PracticeSession`
- `analyticsUtils.ts` วิเคราะห์ข้อมูลจาก question history
- คำนวณ statistics (error rates, confusion matrices)

### 4. **Role-based Access Control Pattern**

**แนวคิด**: ใช้ **roles** (STUDENT, TEACHER, ADMIN) เพื่อควบคุมการเข้าถึง

**ประโยชน์**:
- **Security**: ป้องกันการเข้าถึงที่ไม่ได้รับอนุญาต
- **Flexibility**: เพิ่ม roles ใหม่ได้ง่าย
- **Clear Separation**: แยก logic ตาม role ได้ชัดเจน

**Implementation**:
- `User` model มี `role` field
- API routes ตรวจสอบ role ก่อนดำเนินการ
- Frontend แสดง UI ตาม role

### 5. **Dual Mode Pattern**

**แนวคิด**: รองรับทั้ง **Self-Learning** และ **Course Mode** ในระบบเดียวกัน

**ประโยชน์**:
- **Flexibility**: User สามารถเรียนรู้เองหรือ join course
- **Unified Experience**: ใช้ระบบเดียวกันทั้ง 2 โหมด
- **Progress Separation**: แยก progress ตาม mode

**Implementation**:
- `courseId` field เป็น `null` สำหรับ self-learning
- `courseId` field มีค่า course ID สำหรับ course mode
- API routes filter ข้อมูลตาม `courseId`

---

## Database Schema Overview: ภาพรวม Schema

### Core Models

#### **User & Authentication**
- `User`: ผู้ใช้ (email, name, role, password)
- `Account`: OAuth accounts (Google)
- `Session`: NextAuth.js sessions
- `VerificationToken`: Email verification tokens

#### **Learning Path (Templates)**
- `Module`: Modules (templates)
- `Lesson`: Lessons (templates)
- `LessonHeroStat`, `LessonObjective`, `LessonSection`, `LessonQuizQuestion`, `LessonPracticeLink`, `LessonResource`: Lesson content

#### **User Progress**
- `LessonProgress`: User progress สำหรับแต่ละ lesson
- `ModuleProgress`: User progress สำหรับแต่ละ module

#### **Course Management**
- `Course`: Courses
- `Enrollment`: Student enrollments
- `CourseAssignment`: Assignments
- `Announcement`: Announcements

#### **Practice System**
- `PracticeSession`: Practice session history
- `PracticePreset`: Practice presets

#### **Legacy (Level-based)**
- `Level`: Levels (legacy, ไม่ใช้แล้ว)
- `LevelAttempt`: Level attempts (legacy)

### Relationships

- **User → Courses**: One-to-Many (teacher creates courses)
- **User → Enrollments**: One-to-Many (student enrolls in courses)
- **Course → Enrollments**: One-to-Many (course has students)
- **Course → Assignments**: One-to-Many (course has assignments)
- **Course → Announcements**: One-to-Many (course has announcements)
- **Module → Lessons**: One-to-Many (module has lessons)
- **Lesson → Progress**: One-to-Many (lesson has user progress)
- **User → PracticeSessions**: One-to-Many (user has practice sessions)

---

## Security Architecture: สถาปัตยกรรมความปลอดภัย

### 1. **Authentication Layer**

- **NextAuth.js**: จัดการ authentication
- **JWT Tokens**: ใช้ JWT สำหรับ session management
- **Password Hashing**: ใช้ bcryptjs เพื่อ hash passwords
- **OAuth**: รองรับ Google OAuth

### 2. **Authorization Layer**

- **Middleware**: ตรวจสอบ authentication สำหรับ protected routes
- **Role-based Access**: ตรวจสอบ role ก่อนดำเนินการ
- **Resource Ownership**: ตรวจสอบว่า user เป็น owner ของ resource

### 3. **Input Validation**

- **Zod**: Validate inputs ทั้ง frontend และ backend
- **Type Safety**: ใช้ TypeScript เพื่อ type checking
- **SQL Injection Protection**: Prisma ป้องกัน SQL injection อัตโนมัติ

### 4. **Data Protection**

- **HTTPS**: ใช้ HTTPS สำหรับทุก request
- **Session Security**: ใช้ secure cookies
- **CSRF Protection**: NextAuth.js มี CSRF protection ในตัว

---

## Performance Optimizations: การปรับปรุงประสิทธิภาพ

### 1. **Database Optimizations**

- **Indexes**: ใช้ indexes สำหรับ fields ที่ query บ่อย (userId, courseId, lessonId)
- **Query Optimization**: ใช้ Prisma query optimization (select only needed fields)
- **Connection Pooling**: Prisma ใช้ connection pooling อัตโนมัติ

### 2. **Frontend Optimizations**

- **Server Components**: ใช้ React Server Components เพื่อลด JavaScript bundle
- **Code Splitting**: Next.js ทำ code splitting อัตโนมัติ
- **Image Optimization**: ใช้ Next.js Image component
- **Caching**: ใช้ React Query เพื่อ cache API responses

### 3. **API Optimizations**

- **Response Caching**: Cache responses ที่ไม่เปลี่ยนบ่อย
- **Pagination**: ใช้ pagination สำหรับ large datasets
- **Batch Operations**: รวม operations ที่ทำพร้อมกันได้

---

## Scalability Considerations: การพิจารณาการขยายตัว

### 1. **Horizontal Scaling**

- **Stateless API**: API routes เป็น stateless ทำให้ scale ได้ง่าย
- **Load Balancing**: สามารถใช้ load balancer เพื่อกระจาย load
- **CDN**: ใช้ CDN สำหรับ static assets

### 2. **Database Scaling**

- **Read Replicas**: ใช้ read replicas สำหรับ read-heavy operations
- **Connection Pooling**: ใช้ connection pooling เพื่อจัดการ connections
- **Query Optimization**: Optimize queries เพื่อลด database load

### 3. **Caching Strategy**

- **API Response Caching**: Cache API responses ที่ไม่เปลี่ยนบ่อย
- **Database Query Caching**: Cache database queries
- **Static Asset Caching**: Cache static assets ด้วย CDN

---

## Summary: สรุปสถาปัตยกรรม

**ResiLearn** ใช้สถาปัตยกรรมที่:

1. **Modular**: แยก components และ logic ตาม domain
2. **Scalable**: ออกแบบมาให้ scale ได้
3. **Secure**: มี security layers หลายชั้น
4. **Performant**: ใช้ optimizations หลายอย่าง
5. **Maintainable**: โครงสร้างชัดเจน ทำให้ maintain ได้ง่าย
6. **Flexible**: รองรับทั้ง self-learning และ course mode

สถาปัตยกรรมนี้พร้อมสำหรับการใช้งานจริงและสามารถขยายตัวได้ตามความต้องการในอนาคต
