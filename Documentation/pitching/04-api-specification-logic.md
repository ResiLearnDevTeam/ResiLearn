# API Specification & Logic - ResiLearn

เอกสารนี้อธิบายรายละเอียดของ API Endpoints หลักในระบบ ResiLearn โดยอธิบายทั้ง Method, URL, Input/Output, และ Core Algorithm เป็นภาษาคนที่เข้าใจง่าย

---

## 1. Authentication APIs

### 1.1 POST `/api/auth/[...nextauth]/signin`

**Method & URL**: `POST /api/auth/[...nextauth]/signin`

**Input**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Output**:
- **Success**: Redirect ไปยัง callback URL หรือ dashboard
- **Error**: Error message

**Core Algorithm**:

1. **รับ credentials** จาก request body
2. **Query user จาก database**:
   - ใช้ Prisma เพื่อหา user ด้วย email
   - ถ้าไม่พบ user → return error
3. **ตรวจสอบ password**:
   - ใช้ `bcrypt.compare()` เพื่อเปรียบเทียบ password ที่ส่งมากับ password ที่ hash ไว้ใน database
   - ถ้าไม่ตรง → return error
4. **สร้าง JWT token**:
   - สร้าง token ที่มี user id และ role
   - ตั้ง expiration time
5. **สร้าง session cookie**:
   - สร้าง HTTP-only cookie ที่มี JWT token
   - ตั้ง secure flag (HTTPS only)
6. **Redirect** ไปยัง callback URL หรือ dashboard

**Security Features**:
- **Password Hashing**: ใช้ bcrypt เพื่อ hash passwords
- **JWT Tokens**: ใช้ JWT สำหรับ session management
- **HTTP-only Cookies**: ป้องกัน XSS attacks

---

### 1.2 GET `/api/auth/[...nextauth]/authorize`

**Method & URL**: `GET /api/auth/[...nextauth]/authorize`

**Input**: Query parameters จาก Google OAuth

**Output**: Redirect ไปยัง Google OAuth

**Core Algorithm**:

1. **สร้าง OAuth URL**:
   - ใช้ Google OAuth client ID
   - ตั้ง redirect URI
   - ตั้ง scopes (email, profile)
2. **Redirect** ไปยัง Google OAuth
3. **User authorize** ที่ Google
4. **Google redirect กลับ** พร้อม authorization code

---

### 1.3 GET `/api/auth/[...nextauth]/callback`

**Method & URL**: `GET /api/auth/[...nextauth]/callback`

**Input**: Authorization code จาก Google

**Output**: Redirect ไปยัง dashboard

**Core Algorithm**:

1. **รับ authorization code** จาก query parameters
2. **Exchange code เป็น access token**:
   - เรียก Google OAuth API เพื่อ exchange code
   - รับ access token กลับมา
3. **ดึงข้อมูล user จาก Google**:
   - ใช้ access token เพื่อเรียก Google User Info API
   - รับ email, name, picture
4. **สร้างหรือ update user ใน database**:
   - ตรวจสอบว่ามี user ด้วย email นี้หรือไม่
   - ถ้าไม่มี → สร้าง user ใหม่
   - ถ้ามี → update user (ถ้าจำเป็น)
   - สร้างหรือ update Account record (OAuth account)
5. **สร้าง JWT token และ session**:
   - สร้าง token ที่มี user id และ role
   - สร้าง session cookie
6. **Redirect** ไปยัง dashboard

---

## 2. Module & Lesson APIs

### 2.1 GET `/api/modules`

**Method & URL**: `GET /api/modules`

**Input**: ไม่มี (ใช้ session จาก cookie)

**Output**:
```json
[
  {
    "id": "module-id",
    "title": "Module Title",
    "progress": 75,
    "lessons": [
      {
        "id": "lesson-id",
        "title": "Lesson Title",
        "completed": true
      }
    ]
  }
]
```

**Core Algorithm**:

1. **ตรวจสอบ authentication**:
   - ใช้ NextAuth.js เพื่อตรวจสอบ session
   - ถ้าไม่มี session → return 401 Unauthorized
2. **ดึง Modules และ Lessons (templates)**:
   - ใช้ Prisma เพื่อดึง Modules ทั้งหมดพร้อม Lessons
   - เรียงตาม order
3. **ดึง User Progress**:
   - ดึง LessonProgress และ ModuleProgress สำหรับ user ปัจจุบัน
   - Filter สำหรับ self-learning (courseId = null)
4. **รวมข้อมูล**:
   - รวม template data (Modules, Lessons) กับ user progress
   - คำนวณ progress percentage สำหรับแต่ละ module
5. **Return** ข้อมูลที่รวมแล้ว

**Key Points**:
- **Template-based**: Modules และ Lessons เป็น templates ที่ใช้ร่วมกัน
- **Progress Separation**: User progress เก็บแยกต่างหาก
- **Efficient Query**: ใช้ Prisma includes เพื่อลด database queries

---

### 2.2 GET `/api/lessons/[lessonId]`

**Method & URL**: `GET /api/lessons/[lessonId]`

**Input**: `lessonId` จาก URL path

**Output**:
```json
{
  "id": "lesson-id",
  "title": "Lesson Title",
  "sections": [...],
  "quiz": {...},
  "practice": {...},
  "resources": [...],
  "completed": false
}
```

**Core Algorithm**:

1. **ตรวจสอบ authentication**
2. **ดึง Lesson template**:
   - ใช้ Prisma เพื่อดึง Lesson พร้อม related data:
     - heroStats
     - objectives
     - sections
     - quizQuestions
     - practiceLink
     - resources
3. **ดึง User Progress**:
   - ดึง LessonProgress สำหรับ user และ lesson นี้
   - Filter สำหรับ self-learning (courseId = null)
4. **Process sections**:
   - ถ้าไม่มี sections แต่มี fallback content → สร้าง default section
   - Format sections content
5. **Process quiz**:
   - ถ้ามี quizQuestions → สร้าง quiz object
   - Format questions และ options
6. **Return** ข้อมูลที่ process แล้ว

---

### 2.3 POST `/api/lessons/[lessonId]`

**Method & URL**: `POST /api/lessons/[lessonId]`

**Input**:
```json
{
  "completed": true
}
```

**Output**: LessonProgress object

**Core Algorithm**:

1. **ตรวจสอบ authentication**
2. **ดึง Lesson และ Module**:
   - ดึง Lesson พร้อม Module และ Lessons ทั้งหมดใน module
3. **Update หรือ create LessonProgress**:
   - ใช้ Prisma upsert เพื่อ update หรือ create
   - ตั้ง courseId = null (self-learning)
   - ตั้ง completed และ completedAt
4. **คำนวณ Module Progress**:
   - นับจำนวน lessons ที่ completed ใน module นี้
   - คำนวณ progress percentage (completed / total * 100)
5. **Update หรือ create ModuleProgress**:
   - ใช้ Prisma upsert เพื่อ update หรือ create
   - ตั้ง courseId = null (self-learning)
   - ตั้ง progress percentage
6. **Return** LessonProgress

**Key Points**:
- **Automatic Progress Calculation**: คำนวณ module progress อัตโนมัติ
- **Upsert Pattern**: ใช้ upsert เพื่อจัดการทั้ง create และ update

---

## 3. Course APIs

### 3.1 GET `/api/courses`

**Method & URL**: `GET /api/courses`

**Input**: 
- Query parameter: `?all=true` (optional)

**Output**: Array of courses

**Core Algorithm**:

1. **ตรวจสอบ authentication**
2. **ตรวจสอบ role และ query parameter**:
   - ถ้า `?all=true` → ดึงคอร์สทั้งหมดที่ published
   - ถ้า role = TEACHER → ดึงคอร์สที่สร้าง
   - ถ้า role = STUDENT → ดึงคอร์สที่ enrolled
3. **ดึงข้อมูลคอร์ส**:
   - ใช้ Prisma เพื่อดึง courses พร้อม related data:
     - teacher
     - enrollments
     - assignments
     - announcements
4. **คำนวณ statistics**:
   - enrollmentCount
   - assignmentCount
   - announcementCount
5. **ตรวจสอบ enrollment status** (สำหรับ `?all=true`):
   - ตรวจสอบว่า user enrolled หรือไม่
   - รวม progress (ถ้า enrolled)
6. **Return** ข้อมูลที่ format แล้ว

---

### 3.2 POST `/api/courses`

**Method & URL**: `POST /api/courses`

**Input**:
```json
{
  "name": "Course Name",
  "description": "Course Description",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "image": "image-url",
  "isPublished": true
}
```

**Output**: Created course object

**Core Algorithm**:

1. **ตรวจสอบ authentication และ role**:
   - ตรวจสอบว่า user เป็น TEACHER
   - ถ้าไม่ใช่ → return 403 Forbidden
2. **Validate input**:
   - ตรวจสอบว่า name และ startDate มีค่า
3. **Generate unique course code**:
   - ใช้ `generateUniqueCourseCode()`:
     - สุ่ม code (5-8 characters)
     - ตรวจสอบว่าไม่ใช่ bad words
     - ตรวจสอบว่า unique ใน database
     - Loop จนกว่าจะได้ code ที่ unique
4. **สร้าง Course**:
   - ใช้ Prisma เพื่อสร้าง Course record
   - ตั้ง teacherId = current user id
5. **Return** ข้อมูลคอร์สที่สร้าง

**Key Points**:
- **Unique Code Generation**: สร้าง code ที่ unique และไม่ใช่ bad words
- **Teacher-only**: เฉพาะ teachers เท่านั้นที่สร้างคอร์สได้

---

### 3.3 POST `/api/courses/[courseId]/enrollments`

**Method & URL**: `POST /api/courses/[courseId]/enrollments`

**Input**:
```json
{
  "userId": "user-id" // Optional, ถ้าไม่ระบุใช้ current user
}
```

**Output**: Enrollment object

**Core Algorithm**:

1. **ตรวจสอบ authentication**
2. **ตรวจสอบ access**:
   - ตรวจสอบว่า course exists
   - ตรวจสอบว่า user เป็น teacher ของคอร์สนี้ หรือ user ที่จะ enroll
3. **ตรวจสอบว่า enrolled แล้วหรือยัง**:
   - ใช้ Prisma เพื่อตรวจสอบ Enrollment record
   - ถ้า enrolled แล้ว → return error
4. **สร้าง Enrollment**:
   - ใช้ Prisma เพื่อสร้าง Enrollment record
   - ตั้ง progress = 0
5. **Return** Enrollment

---

## 4. Assignment APIs

### 4.1 GET `/api/courses/[courseId]/assignments`

**Method & URL**: `GET /api/courses/[courseId]/assignments`

**Input**: `courseId` จาก URL path

**Output**: Array of assignments

**Core Algorithm**:

1. **ตรวจสอบ authentication**
2. **ตรวจสอบ access**:
   - ตรวจสอบว่า course exists
   - ตรวจสอบว่า user enrolled (students) หรือเป็น teacher
3. **ดึง Assignments**:
   - ใช้ Prisma เพื่อดึง CourseAssignments สำหรับคอร์สนี้
   - Include level (ถ้ามี)
   - เรียงตาม order
4. **เพิ่ม Progress สำหรับ Students**:
   - ดึง LevelAttempts สำหรับ user และคอร์สนี้
   - Map attempts กับ assignments
   - เพิ่ม completed status และ bestScore
5. **Return** ข้อมูลที่ format แล้ว

---

### 4.2 POST `/api/courses/[courseId]/assignments`

**Method & URL**: `POST /api/courses/[courseId]/assignments`

**Input**:
```json
{
  "assignmentType": "CUSTOM_QUIZ",
  "assignmentMode": "PRACTICE",
  "title": "Assignment Title",
  "description": "Description",
  "dueDate": "2024-12-31",
  "maxPoints": 100,
  "passThreshold": 50,
  "quizSettings": {...},
  "questions": [...]
}
```

**Output**: Created assignment object

**Core Algorithm**:

1. **ตรวจสอบ authentication และ role**:
   - ตรวจสอบว่า user เป็น TEACHER
   - ตรวจสอบว่า user เป็น teacher ของคอร์สนี้
2. **Validate input**:
   - ตรวจสอบว่า title มีค่า
   - ตรวจสอบว่า assignmentMode เป็น PRACTICE หรือ EXAM
   - ตรวจสอบว่า assignmentType และ settings ครบถ้วน
3. **Validate assignment type specific fields**:
   - **CUSTOM_QUIZ**: ต้องมี quizSettings
   - **FIXED_QUESTIONS**: ต้องมี questions (อย่างน้อย 1 ข้อ)
     - Auto-calculate maxPoints จาก question points
4. **Get next order**:
   - ถ้าไม่ระบุ order → หา order สูงสุด + 1
5. **สร้าง Assignment**:
   - ใช้ Prisma เพื่อสร้าง CourseAssignment record
   - เก็บ settings และ questions ใน JSON fields
6. **Return** ข้อมูล assignment ที่สร้าง

**Key Points**:
- **Flexible Assignment Types**: รองรับทั้ง dynamic และ fixed questions
- **Auto-calculation**: คำนวณ maxPoints อัตโนมัติสำหรับ fixed questions

---

### 4.3 POST `/api/courses/[courseId]/assignments/[assignmentId]/attempt`

**Method & URL**: `POST /api/courses/[courseId]/assignments/[assignmentId]/attempt`

**Input**:
```json
{
  "answers": [
    {
      "questionIndex": 0,
      "answer": "1kΩ ±5%"
    }
  ],
  "timeTaken": 300
}
```

**Output**: Attempt result

**Core Algorithm**:

1. **ตรวจสอบ authentication และ access**:
   - ตรวจสอบว่า user enrolled ในคอร์ส
   - ตรวจสอบว่า assignment exists
2. **ดึง Assignment**:
   - ดึง assignment พร้อม settings
3. **Generate หรือใช้ Questions**:
   - **CUSTOM_QUIZ**: สร้างคำถามจาก quizSettings (dynamic)
   - **FIXED_QUESTIONS**: ใช้ questions ที่เก็บไว้
4. **ตรวจสอบคำตอบ**:
   - เปรียบเทียบ user answers กับ correct answers
   - คำนวณคะแนน (correct / total * maxPoints)
   - ตรวจสอบว่า passed หรือไม่ (score >= passThreshold)
5. **บันทึก Attempt**:
   - ใช้ Prisma เพื่อสร้าง LevelAttempt record
   - เก็บ questions และ answers ใน JSON field
   - ตั้ง assignmentId และ courseId
6. **Return** attempt result (score, passed, etc.)

**Key Points**:
- **Dynamic Question Generation**: สร้างคำถามแบบ dynamic สำหรับ CUSTOM_QUIZ
- **Auto Grading**: ตรวจคำตอบและคำนวณคะแนนอัตโนมัติ

---

## 5. Announcement APIs

### 5.1 GET `/api/courses/[courseId]/announcements`

**Method & URL**: `GET /api/courses/[courseId]/announcements`

**Input**: `courseId` จาก URL path

**Output**: Array of announcements

**Core Algorithm**:

1. **ตรวจสอบ authentication และ access**
2. **ดึง Announcements**:
   - ใช้ Prisma เพื่อดึง Announcements สำหรับคอร์สนี้
   - เรียงตาม createdAt (desc)
3. **Filter สำหรับ Students**:
   - Students เห็นเฉพาะ announcements ที่ published
   - Teachers เห็นทั้งหมด (รวม drafts)
4. **Return** ข้อมูลที่ format แล้ว

---

### 5.2 POST `/api/courses/[courseId]/announcements`

**Method & URL**: `POST /api/courses/[courseId]/announcements`

**Input**:
```json
{
  "title": "Announcement Title",
  "content": "<p>HTML content</p>",
  "contentFormat": "HTML",
  "priority": "HIGH",
  "isPinned": true,
  "isDraft": false,
  "publishedAt": "2024-01-01T00:00:00Z",
  "attachments": [...]
}
```

**Output**: Created announcement object

**Core Algorithm**:

1. **ตรวจสอบ authentication และ role**:
   - ตรวจสอบว่า user เป็น TEACHER
   - ตรวจสอบว่า user เป็น teacher ของคอร์สนี้
2. **Validate input**:
   - ตรวจสอบว่า title และ content มีค่า
   - ตรวจสอบว่า publishedAt (ถ้ามี) อยู่ในอนาคต
3. **Sanitize HTML content**:
   - ใช้ `sanitizeHtml()` เพื่อลบ dangerous HTML
4. **สร้าง Announcement**:
   - ใช้ Prisma เพื่อสร้าง Announcement record
   - เก็บ attachments ใน JSON field
5. **Return** ข้อมูล announcement ที่สร้าง

---

### 5.3 POST `/api/courses/[courseId]/announcements/import-word`

**Method & URL**: `POST /api/courses/[courseId]/announcements/import-word`

**Input**: Multipart form data with Word file

**Output**:
```json
{
  "html": "<p>Converted HTML content</p>"
}
```

**Core Algorithm**:

1. **ตรวจสอบ authentication และ role** (TEACHER)
2. **รับไฟล์ Word**:
   - รับไฟล์จาก form data
   - Validate ไฟล์ (type, size)
3. **แปลง Word เป็น HTML**:
   - ใช้ `mammoth` library เพื่อแปลง Word document เป็น HTML
   - ใช้ `importFromWord()` function
4. **Sanitize HTML**:
   - ใช้ `sanitizeHtml()` เพื่อลบ dangerous HTML
5. **Return** HTML content

**Key Points**:
- **Word to HTML Conversion**: ใช้ mammoth เพื่อแปลง Word เป็น HTML
- **Content Sanitization**: Sanitize HTML เพื่อความปลอดภัย

---

### 5.4 GET `/api/courses/[courseId]/announcements/[announcementId]/export-word`

**Method & URL**: `GET /api/courses/[courseId]/announcements/[announcementId]/export-word`

**Input**: `announcementId` จาก URL path

**Output**: Word document file (.docx)

**Core Algorithm**:

1. **ตรวจสอบ authentication และ access**
2. **ดึง Announcement**:
   - ดึง announcement พร้อม title และ content
3. **แปลง HTML เป็น Word**:
   - ใช้ `exportToWord()` function
   - Sanitize HTML ก่อน
   - แปลง HTML เป็น Word paragraphs:
     - แปลง headings เป็น Word headings
     - แปลง paragraphs เป็น Word paragraphs
     - แปลง formatting (bold, italic, underline)
4. **Generate Word document**:
   - ใช้ `docx` library เพื่อสร้าง Word document
   - ใช้ `Packer.toBlob()` เพื่อสร้าง blob
5. **Return** Word file

**Key Points**:
- **HTML to Word Conversion**: แปลง HTML เป็น Word document
- **Formatting Preservation**: รักษา formatting (bold, italic, headings)

---

## 6. Practice Session APIs

### 6.1 POST `/api/practice-sessions`

**Method & URL**: `POST /api/practice-sessions`

**Input**:
```json
{
  "presetId": "preset-id",
  "presetName": "Session Name",
  "totalQuestions": 10,
  "correctAnswers": 8,
  "incorrectAnswers": 2,
  "accuracy": 80,
  "averageTime": 5.5,
  "totalTime": 55,
  "settings": {...},
  "questions": [...],
  "analytics": {...}
}
```

**Output**: Created practice session object

**Core Algorithm**:

1. **ตรวจสอบ authentication**
2. **Validate input**:
   - ตรวจสอบว่า required fields มีค่า
   - Validate settings ด้วย `validateSessionSettings()`
3. **Generate session name**:
   - ใช้ `formatSessionName()` เพื่อสร้างชื่อ session จาก presetName และ settings
4. **สร้าง Practice Session**:
   - ใช้ Prisma เพื่อสร้าง PracticeSession record
   - ตั้ง courseId = null (self-learning)
   - เก็บ settings, questions, และ analytics ใน JSON fields
5. **Return** ข้อมูล session ที่สร้าง

**Key Points**:
- **Flexible Data Storage**: เก็บ settings และ questions ใน JSON fields
- **Analytics Storage**: เก็บ analytics data ใน settings JSON field

---

### 6.2 GET `/api/practice-sessions`

**Method & URL**: `GET /api/practice-sessions`

**Input**: 
- Query parameters: `?id=session-id` (optional), `?limit=10` (optional)

**Output**: 
- ถ้ามี `id`: Single session object
- ถ้าไม่มี: Array of sessions

**Core Algorithm**:

1. **ตรวจสอบ authentication**
2. **ตรวจสอบ query parameters**:
   - ถ้ามี `id` → ดึง session เดียว
   - ถ้าไม่มี → ดึงรายการ sessions
3. **Validate limit**:
   - ตรวจสอบว่า limit อยู่ระหว่าง 1-1000
4. **ดึง Sessions**:
   - ใช้ Prisma เพื่อดึง PracticeSessions สำหรับ user
   - Filter สำหรับ self-learning (courseId = null)
   - เรียงตาม completedAt (desc)
   - Limit ตาม query parameter
5. **Transform sessions**:
   - ใช้ `formatSessionName()` เพื่อสร้างชื่อ session
   - ใช้ `getSessionType()` เพื่อระบุ session type
6. **Return** ข้อมูลที่ transform แล้ว

---

## 7. Analytics APIs

### 7.1 GET `/api/analytics/practice`

**Method & URL**: `GET /api/analytics/practice`

**Input**: 
- Query parameters: `?resistorType=FOUR_BAND` (optional), `?startDate=2024-01-01` (optional), `?endDate=2024-12-31` (optional)

**Output**:
```json
{
  "overall": {
    "totalSessions": 10,
    "totalQuestions": 100,
    "overallAccuracy": 85
  },
  "resistorTypeErrors": {...},
  "digitPositionErrors": {...},
  "colorConfusion": {...},
  "questionTypeErrors": {...},
  "topWeakAreas": [...]
}
```

**Core Algorithm**:

1. **ตรวจสอบ authentication**
2. **Build query conditions**:
   - ตั้ง userId = current user id
   - ถ้ามี startDate/endDate → เพิ่ม date filter
3. **ดึง Practice Sessions**:
   - ใช้ Prisma เพื่อดึง sessions ตาม conditions
   - Filter สำหรับ self-learning (courseId = null)
4. **Filter by resistorType** (ถ้ามี):
   - Filter ใน memory (เพราะ Prisma ไม่ support JSON field filtering ง่ายๆ)
5. **Aggregate Analytics**:
   - เรียก `aggregateDeepAnalytics()` จาก `analyticsUtils.ts`
   - ฟังก์ชันนี้จะ:
     - รวม question history จากทุก sessions
     - วิเคราะห์ position errors
     - วิเคราะห์ color confusion
     - วิเคราะห์ question type errors
     - วิเคราะห์ resistor value errors
     - วิเคราะห์ tolerance errors
     - คำนวณ overall statistics
     - ระบุ top weak areas
6. **Return** aggregated analytics

**Key Points**:
- **Deep Analysis**: วิเคราะห์ข้อมูลจาก question history
- **Multiple Dimensions**: วิเคราะห์หลายมิติ (position, color, type, value)

---

### 7.2 GET `/api/courses/[courseId]/analytics`

**Method & URL**: `GET /api/courses/[courseId]/analytics`

**Input**: `courseId` จาก URL path

**Output**: Analytics object (เหมือน `/api/analytics/practice` แต่สำหรับคอร์ส)

**Core Algorithm**:

1. **ตรวจสอบ authentication และ access**
2. **ตรวจสอบ role**:
   - **STUDENT**: ดึง analytics สำหรับตัวเองในคอร์สนี้
   - **TEACHER**: ดึง analytics สำหรับนักเรียนทั้งหมดในคอร์สนี้
3. **ดึง Practice Sessions**:
   - **STUDENT**: ดึง sessions ของตัวเองในคอร์สนี้
   - **TEACHER**: ดึง sessions ของนักเรียนทั้งหมดในคอร์สนี้
4. **Aggregate Analytics**:
   - เรียก `calculateDeepAnalytics()` หรือ `aggregateDeepAnalytics()`
   - วิเคราะห์ข้อมูลจาก question history
5. **Return** analytics

**Key Points**:
- **Role-based Analytics**: แสดง analytics ตาม role
- **Class-wide Insights**: Teachers เห็นภาพรวมของทั้งชั้น

---

## 8. Dashboard APIs

### 8.1 GET `/api/dashboard/stats`

**Method & URL**: `GET /api/dashboard/stats`

**Input**: ไม่มี (ใช้ session จาก cookie)

**Output**:
```json
{
  "lessonsCompleted": 5,
  "totalLessons": 10,
  "overallAccuracy": 85,
  "totalSessions": 20,
  "totalPracticeTime": 120
}
```

**Core Algorithm**:

1. **ตรวจสอบ authentication**
2. **ดึง Lesson Progress**:
   - ดึง LessonProgress ทั้งหมดที่ completed
   - Filter สำหรับ self-learning (courseId = null)
   - นับจำนวน lessons ที่ completed
3. **ดึง Total Lessons**:
   - นับจำนวน lessons ทั้งหมดใน database
4. **ดึง Practice Sessions**:
   - ดึง PracticeSessions ทั้งหมด
   - Filter สำหรับ self-learning (courseId = null)
5. **คำนวณ Statistics**:
   - **Overall Accuracy**: คำนวณจาก sessions ที่มี accuracy
   - **Total Sessions**: นับจำนวน sessions
   - **Total Practice Time**: รวม totalTime จากทุก sessions (แปลงเป็นนาที)
6. **Return** statistics

**Key Points**:
- **Self-learning Filter**: Filter ข้อมูลสำหรับ self-learning เท่านั้น
- **Efficient Calculation**: คำนวณ statistics จากข้อมูลที่มี

---

## 9. Google Classroom Integration APIs

### 9.1 POST `/api/courses/[courseId]/google-classroom`

**Method & URL**: `POST /api/courses/[courseId]/google-classroom`

**Input**:
```json
{
  "action": "sync",
  "classroomId": "google-classroom-id"
}
```

**Output**: Sync result

**Core Algorithm**:

1. **ตรวจสอบ authentication และ role** (TEACHER)
2. **ตรวจสอบ Google OAuth**:
   - ตรวจสอบว่า user มี Google account connected
   - ดึง access token จาก Account record
3. **เรียก Google Classroom API**:
   - ใช้ `googleapis` library
   - ดึงข้อมูล students จาก Google Classroom
   - ดึงข้อมูล assignments จาก Google Classroom
4. **Sync Students**:
   - สร้างหรือ update users จาก Google Classroom students
   - สร้าง Enrollments สำหรับ students
5. **Sync Assignments** (ถ้ามี):
   - สร้างหรือ update assignments จาก Google Classroom
6. **Update Sync Status**:
   - Update GoogleClassroomSync record
   - ตั้ง lastSyncAt
7. **Return** sync result

**Key Points**:
- **Bidirectional Sync**: Sync ข้อมูลทั้งจากและไปยัง Google Classroom
- **Automatic Enrollment**: Enroll students อัตโนมัติ

---

## Summary: สรุป API Architecture

**API Design Principles**:

1. **RESTful Design**: ใช้ REST principles (GET, POST, PUT, DELETE)
2. **Authentication**: ทุก API ต้อง authenticate (ยกเว้น public endpoints)
3. **Authorization**: ตรวจสอบ role และ resource ownership
4. **Input Validation**: Validate inputs ทั้ง frontend และ backend
5. **Error Handling**: Return appropriate error codes และ messages
6. **Type Safety**: ใช้ TypeScript เพื่อ type safety
7. **Efficient Queries**: ใช้ Prisma includes เพื่อลด queries
8. **JSON Storage**: ใช้ JSON fields สำหรับ flexible data (settings, questions)

**API Categories**:

1. **Authentication**: NextAuth.js endpoints
2. **Learning Path**: Modules และ Lessons
3. **Courses**: Course management
4. **Assignments**: Assignment management
5. **Announcements**: Announcement management
6. **Practice Sessions**: Practice session tracking
7. **Analytics**: Data analysis
8. **Dashboard**: Statistics และ overview

ทุก API endpoint ถูกออกแบบมาให้ **secure**, **efficient**, และ **maintainable**
