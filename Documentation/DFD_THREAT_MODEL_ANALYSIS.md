# การวิเคราะห์ระบบ ResiLearn สำหรับ Data Flow Diagram (DFD) และ Threat Model

## 1. ภาพรวมระบบ (System Overview)

### 1.1 ข้อมูลทั่วไป
- **ชื่อระบบ:** ResiLearn - Resistor Reading Training System
- **ประเภท:** Web Application (Learning Management System + Progressive Learning)
- **URL:** http://localhost:3000 (Development)
- **วัตถุประสงค์หลัก:**
  - ฝึกอ่านค่าตัวต้านทานแบบ Progressive Learning (7 ระดับ)
  - จัดการคอร์สเรียนสำหรับครู (LMS)
  - เชื่อมต่อกับ Google Classroom
  - ติดตามความคืบหน้าของผู้เรียน

### 1.2 สถาปัตยกรรมระบบ
- **Frontend:** Next.js 16 (App Router), React 19, TypeScript
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL 15 (via Docker)
- **ORM:** Prisma
- **Authentication:** NextAuth.js v5 (Credentials + Google OAuth)
- **External APIs:** Google Classroom API (googleapis)
- **State Management:** Zustand, TanStack Query
- **Styling:** Tailwind CSS 4

---

## 2. ฟีเจอร์หลักและฟังก์ชันการทำงาน (Main Features/Functions)

### 2.1 ระบบ Authentication และ Authorization
**ฟังก์ชัน:**
- User Registration (Student/Teacher)
- User Login (Credentials หรือ Google OAuth)
- Session Management (JWT)
- Role-based Access Control (STUDENT, TEACHER, ADMIN)
- Password Hashing (bcryptjs)

**Data Flow:**
- User → Login Form → NextAuth → Database (User, Session, Account)
- Google OAuth → Google API → NextAuth → Database

### 2.2 ระบบ Progressive Learning (Self-Learning Mode)
**ฟังก์ชัน:**
- แสดง Learning Path (7 Levels)
- Unlock System (ต้องผ่าน Level ก่อนถึงจะทำ Level ถัดไปได้)
- Practice Mode (ไม่จำกัดเวลา, แสดงคำตอบทันที)
- Quiz Mode (มีเวลา, บันทึกคะแนน)
- Dynamic Question Generation (สุ่มคำถามแบบ Real-time)
- Progress Tracking (ติดตามความคืบหน้าแต่ละ Level)

**Data Flow:**
- User → Learning Path Page → API (/api/levels) → Database (Level)
- User → Practice/Quiz → Generate Questions (Client-side) → Submit → API (/api/attempts) → Database (LevelAttempt)
- User → Dashboard → API (/api/stats) → Database (LevelAttempt, User)

### 2.3 ระบบ Course Management (LMS)
**ฟังก์ชัน:**
- Teacher สร้าง Course
- Teacher Assign Levels เป็น Assignments
- Student Enroll ใน Course
- Student ดู Assigned Levels
- Progress Tracking ต่อ Course
- Announcements (ครูประกาศใน Course)

**Data Flow:**
- Teacher → Create Course → API (/api/courses) → Database (Course)
- Teacher → Assign Level → API (/api/courses/[courseId]/assignments) → Database (CourseAssignment)
- Student → Enroll → API (/api/courses/[courseId]/enrollments) → Database (Enrollment)
- Student → View Course → API (/api/courses/[courseId]) → Database (Course, CourseAssignment, Enrollment)

### 2.4 ระบบ Practice Sessions (Custom Practice)
**ฟังก์ชัน:**
- Quick Practice (ตั้งค่าด่วน)
- Custom Practice (สร้าง Preset)
- Color Reading Practice (แบบต่างๆ)
- บันทึก Session Results
- Analytics (วิเคราะห์ผลการฝึก)

**Data Flow:**
- User → Practice Settings → Generate Questions → Practice → Submit → API (/api/practice-sessions) → Database (PracticeSession)
- User → View Analytics → API (/api/analytics/practice) → Database (PracticeSession)

### 2.5 ระบบ Google Classroom Integration
**ฟังก์ชัน:**
- Teacher เชื่อมต่อ Google Classroom (OAuth)
- Import Students จาก Classroom
- Sync Assignments ไปยัง Classroom
- Sync Grades กลับไปยัง Classroom Gradebook
- Auto-sync หรือ Manual Sync

**Data Flow:**
- Teacher → Connect Google Classroom → Google OAuth → Google API → Database (GoogleClassroomSync, ClassroomStudent)
- Teacher → Import Students → Google API → Database (ClassroomStudent, User)
- Student → Complete Quiz → Calculate Grade → Google API → Sync to Classroom Gradebook

### 2.6 ระบบ Learning Path (Course Outline)
**ฟังก์ชัน:**
- แสดง Modules และ Lessons
- Lesson Content (Markdown/HTML)
- Lesson Progress Tracking
- Module Progress Tracking

**Data Flow:**
- User → Learning Path → API (/api/modules, /api/lessons) → Database (Module, Lesson)
- User → Complete Lesson → API → Database (LessonProgress, ModuleProgress)

### 2.7 ระบบ Analytics และ Reporting
**ฟังก์ชัน:**
- Student Dashboard (Self-Learning + Course Progress)
- Teacher Analytics (Course Performance, Student Progress)
- Practice Analytics (Deep Analytics)
- Export Reports

**Data Flow:**
- User → Dashboard → API (/api/stats, /api/courses/[courseId]/dashboard) → Database (Aggregate Queries)
- Teacher → Analytics → API (/api/courses/[courseId]/analytics) → Database (Aggregate Queries)

---

## 3. External Entities (Context Layer 0)

### 3.1 User Entities
1. **Student (ผู้เรียน)**
   - ลงทะเบียน, Login
   - เรียน Self-Learning Mode
   - Enroll ใน Course
   - ทำ Practice และ Quiz
   - ดู Dashboard และ Progress

2. **Teacher (ครู)**
   - ลงทะเบียน, Login
   - สร้างและจัดการ Course
   - Assign Levels เป็น Assignments
   - เชื่อมต่อ Google Classroom
   - Import Students
   - ดู Analytics และ Student Progress
   - Sync Grades ไปยัง Google Classroom

3. **Admin (ผู้ดูแลระบบ)**
   - จัดการ Users
   - จัดการ Levels และ Modules
   - ดู System-wide Analytics

### 3.2 External Systems
1. **Google OAuth Service**
   - Authentication (Google Login)
   - OAuth Token Management

2. **Google Classroom API**
   - ดึงข้อมูล Classroom
   - ดึงข้อมูล Students
   - สร้าง Assignments
   - Sync Grades

3. **PostgreSQL Database**
   - เก็บข้อมูลทั้งหมด (Users, Courses, Attempts, Sessions, etc.)

---

## 4. Data Stores (Context Layer 0)

### 4.1 Database Tables (via Prisma)
1. **User & Authentication:**
   - `User` - ข้อมูลผู้ใช้ (email, name, role, password, progress)
   - `Account` - OAuth accounts (Google, etc.)
   - `Session` - Session tokens
   - `VerificationToken` - Email verification tokens

2. **Progressive Learning:**
   - `Level` - ข้อมูล 7 Levels (number, name, difficulty, passScore, etc.)
   - `LevelAttempt` - ผลการทำ Quiz/Practice (userId, levelId, score, questions, etc.)

3. **Course Management:**
   - `Course` - ข้อมูล Course (name, description, teacherId, googleClassroomId, etc.)
   - `Enrollment` - การลงทะเบียนเรียน (userId, courseId, progress)
   - `CourseAssignment` - Assignments ใน Course (courseId, levelId, dueDate, etc.)
   - `Announcement` - ประกาศใน Course

4. **Learning Path:**
   - `Module` - Modules ใน Learning Path
   - `Lesson` - Lessons ในแต่ละ Module
   - `LessonProgress` - Progress ของแต่ละ Lesson
   - `ModuleProgress` - Progress ของแต่ละ Module

5. **Practice System:**
   - `PracticePreset` - Preset สำหรับ Custom Practice
   - `PracticeSession` - ผลการฝึก Practice (totalQuestions, correctAnswers, questions, etc.)

6. **Google Classroom Integration:**
   - `GoogleClassroomSync` - การเชื่อมต่อ Classroom (courseId, classroomId, syncEnabled, etc.)
   - `ClassroomStudent` - Students ที่ Import จาก Classroom

---

## 5. Processes (Context Layer 0 → Process Layer 1)

### 5.1 Process 1: Authentication & Authorization
**Input:**
- User credentials (email, password) หรือ Google OAuth token
- Session token (for session validation)

**Output:**
- Session token
- User data (id, email, name, role)
- Redirect to appropriate page

**Sub-processes (Layer 2):**
- 1.1 Validate Credentials
- 1.2 Create/Update Session
- 1.3 Generate JWT Token
- 1.4 Check Role Permissions

### 5.2 Process 2: Progressive Learning Management
**Input:**
- User ID
- Level ID
- Quiz/Practice answers
- Time taken

**Output:**
- Level data
- Unlock status
- Progress data
- Quiz results

**Sub-processes (Layer 2):**
- 2.1 Get Learning Path (Levels)
- 2.2 Check Unlock Status
- 2.3 Generate Questions (Dynamic)
- 2.4 Validate Answers
- 2.5 Calculate Score
- 2.6 Update Progress
- 2.7 Unlock Next Level

### 5.3 Process 3: Course Management
**Input:**
- Course data (name, description, teacherId)
- Assignment data (levelId, dueDate)
- Enrollment data (userId, courseId)

**Output:**
- Course information
- Assignment list
- Enrollment status
- Course progress

**Sub-processes (Layer 2):**
- 3.1 Create Course
- 3.2 Assign Levels to Course
- 3.3 Enroll Students
- 3.4 Get Course Data
- 3.5 Update Course Progress

### 5.4 Process 4: Practice Session Management
**Input:**
- Practice settings (resistorType, optionCount, countdownTime, etc.)
- Question answers
- Time spent per question

**Output:**
- Practice session results
- Analytics data
- Question history

**Sub-processes (Layer 2):**
- 4.1 Generate Practice Questions
- 4.2 Validate Answers
- 4.3 Calculate Analytics
- 4.4 Save Session
- 4.5 Generate Reports

### 5.5 Process 5: Google Classroom Integration
**Input:**
- OAuth token
- Classroom ID
- Course ID
- Grade data

**Output:**
- Classroom list
- Student list
- Sync status
- Grade sync confirmation

**Sub-processes (Layer 2):**
- 5.1 Authenticate with Google
- 5.2 Get Classrooms
- 5.3 Import Students
- 5.4 Create Classroom Assignment
- 5.5 Sync Grades

### 5.6 Process 6: Analytics & Reporting
**Input:**
- User ID
- Course ID (optional)
- Date range (optional)

**Output:**
- Statistics (scores, progress, time spent)
- Charts data
- Exportable reports

**Sub-processes (Layer 2):**
- 6.1 Aggregate Attempt Data
- 6.2 Calculate Statistics
- 6.3 Generate Charts Data
- 6.4 Export Reports

### 5.7 Process 7: Learning Path Management
**Input:**
- Module ID
- Lesson ID
- User ID

**Output:**
- Module/Lesson content
- Progress status
- Completion status

**Sub-processes (Layer 2):**
- 7.1 Get Modules
- 7.2 Get Lessons
- 7.3 Get Lesson Content
- 7.4 Update Lesson Progress
- 7.5 Update Module Progress

---

## 6. Data Flows (Context Layer 0)

### 6.1 Authentication Flow
```
Student/Teacher → [Login Request] → Process 1 (Authentication)
Process 1 → [Validate Credentials] → Database (User, Account)
Database → [User Data] → Process 1
Process 1 → [Session Token] → Student/Teacher
```

### 6.2 Learning Path Flow
```
Student → [Get Learning Path] → Process 2 (Progressive Learning)
Process 2 → [Query Levels] → Database (Level, LevelAttempt)
Database → [Level Data + Progress] → Process 2
Process 2 → [Learning Path Data] → Student
```

### 6.3 Quiz/Practice Flow
```
Student → [Start Quiz/Practice] → Process 2
Process 2 → [Generate Questions] → Client-side (Dynamic)
Student → [Submit Answers] → Process 2
Process 2 → [Validate & Calculate] → Database (LevelAttempt)
Database → [Save Results] → Process 2
Process 2 → [Results + Unlock Status] → Student
```

### 6.4 Course Creation Flow
```
Teacher → [Create Course] → Process 3 (Course Management)
Process 3 → [Save Course] → Database (Course)
Database → [Course ID] → Process 3
Teacher → [Assign Levels] → Process 3
Process 3 → [Save Assignments] → Database (CourseAssignment)
```

### 6.5 Enrollment Flow
```
Student → [Enroll in Course] → Process 3
Process 3 → [Check Permissions] → Database (Course)
Process 3 → [Create Enrollment] → Database (Enrollment)
Database → [Enrollment Confirmation] → Process 3
Process 3 → [Enrollment Status] → Student
```

### 6.6 Google Classroom Sync Flow
```
Teacher → [Connect Google Classroom] → Process 5 (Google Classroom Integration)
Process 5 → [OAuth Request] → Google OAuth Service
Google OAuth Service → [Access Token] → Process 5
Teacher → [Import Students] → Process 5
Process 5 → [Get Students] → Google Classroom API
Google Classroom API → [Student List] → Process 5
Process 5 → [Save Students] → Database (ClassroomStudent, User)
```

### 6.7 Grade Sync Flow
```
Student → [Complete Quiz] → Process 2
Process 2 → [Calculate Grade] → Database (LevelAttempt)
Process 2 → [Check Sync Settings] → Database (GoogleClassroomSync)
Process 5 → [Sync Grade] → Google Classroom API
Google Classroom API → [Grade Updated] → Process 5
```

### 6.8 Analytics Flow
```
Student/Teacher → [View Dashboard] → Process 6 (Analytics)
Process 6 → [Query Data] → Database (LevelAttempt, PracticeSession, Enrollment)
Database → [Aggregated Data] → Process 6
Process 6 → [Statistics + Charts] → Student/Teacher
```

---

## 7. Information for Context Layer (Layer 0) DFD

### 7.1 External Entities
1. **Student** - ผู้เรียน
2. **Teacher** - ครู
3. **Admin** - ผู้ดูแลระบบ
4. **Google OAuth Service** - บริการ OAuth ของ Google
5. **Google Classroom API** - API ของ Google Classroom

### 7.2 Processes (Single Bubble)
**"ResiLearn System"** - ระบบหลักที่รวมทุกฟังก์ชัน

### 7.3 Data Stores
1. **Database** - PostgreSQL Database (เก็บข้อมูลทั้งหมด)

### 7.4 Data Flows (Context Layer)
1. **Login Request** (Student/Teacher → System)
2. **User Credentials** (Student/Teacher → System)
3. **Session Token** (System → Student/Teacher)
4. **Learning Path Request** (Student → System)
5. **Learning Path Data** (System → Student)
6. **Quiz Answers** (Student → System)
7. **Quiz Results** (System → Student)
8. **Course Creation Request** (Teacher → System)
9. **Course Data** (System → Teacher)
10. **Enrollment Request** (Student → System)
11. **Enrollment Confirmation** (System → Student)
12. **Google OAuth Request** (Teacher → System)
13. **OAuth Token** (Google OAuth Service → System)
14. **Classroom Data Request** (Teacher → System)
15. **Classroom Data** (Google Classroom API → System)
16. **Grade Sync Request** (System → Google Classroom API)
17. **Grade Sync Confirmation** (Google Classroom API → System)
18. **Analytics Request** (Student/Teacher → System)
19. **Analytics Data** (System → Student/Teacher)
20. **User Data** (System ↔ Database)
21. **Course Data** (System ↔ Database)
22. **Progress Data** (System ↔ Database)
23. **Session Data** (System ↔ Database)

---

## 8. Information for Process Layer (Layer 1) DFD

### 8.1 Processes (Decomposed from Context Layer)
1. **P1: Authentication & Authorization**
2. **P2: Progressive Learning Management**
3. **P3: Course Management**
4. **P4: Practice Session Management**
5. **P5: Google Classroom Integration**
6. **P6: Analytics & Reporting**
7. **P7: Learning Path Management**

### 8.2 Data Stores (Detailed)
1. **D1: User Data** (User, Account, Session tables)
2. **D2: Learning Data** (Level, LevelAttempt tables)
3. **D3: Course Data** (Course, Enrollment, CourseAssignment, Announcement tables)
4. **D4: Practice Data** (PracticePreset, PracticeSession tables)
5. **D5: Progress Data** (LessonProgress, ModuleProgress tables)
6. **D6: Classroom Sync Data** (GoogleClassroomSync, ClassroomStudent tables)
7. **D7: Content Data** (Module, Lesson tables)

### 8.3 Data Flows (Process Layer)
**Between Processes:**
- P1 → P2: Authenticated User Data
- P1 → P3: Authenticated User Data
- P2 → D2: Level Attempts
- P3 → D3: Course Data
- P4 → D4: Practice Sessions
- P5 → D6: Classroom Sync Data
- P5 → Google Classroom API: API Requests
- P6 → D2, D3, D4: Query Data for Analytics
- P7 → D7: Module/Lesson Data

**Between Processes and Data Stores:**
- P1 ↔ D1: User Authentication Data
- P2 ↔ D2: Learning Progress Data
- P3 ↔ D3: Course Management Data
- P4 ↔ D4: Practice Session Data
- P5 ↔ D6: Classroom Sync Data
- P6 ↔ D2, D3, D4: Analytics Data
- P7 ↔ D7, D5: Learning Path Data

**Between External Entities and Processes:**
- Student/Teacher → P1: Login Request
- Student → P2: Learning Path Request, Quiz Answers
- Teacher → P3: Course Creation, Assignment Creation
- Student → P3: Enrollment Request
- Teacher → P5: Google Classroom Connection Request
- Student/Teacher → P6: Analytics Request

---

## 9. Information for Subprocess Layer (Layer 2) DFD

### 9.1 Process 1: Authentication & Authorization (Sub-processes)
**P1.1: Validate Credentials**
- Input: Email, Password
- Output: User Data or Error
- Data Store: D1 (User)

**P1.2: Create/Update Session**
- Input: User ID
- Output: Session Token
- Data Store: D1 (Session)

**P1.3: Generate JWT Token**
- Input: User Data
- Output: JWT Token
- No Data Store (in-memory)

**P1.4: Check Role Permissions**
- Input: User Role, Requested Resource
- Output: Permission Status
- No Data Store (in-memory)

### 9.2 Process 2: Progressive Learning Management (Sub-processes)
**P2.1: Get Learning Path**
- Input: User ID
- Output: Level List with Progress
- Data Store: D2 (Level, LevelAttempt)

**P2.2: Check Unlock Status**
- Input: User ID, Level Number
- Output: Unlock Status
- Data Store: D2 (LevelAttempt, User)

**P2.3: Generate Questions**
- Input: Level ID, Resistor Type
- Output: Question Array
- No Data Store (Dynamic Generation)

**P2.4: Validate Answers**
- Input: User Answers, Correct Answers
- Output: Validation Results
- No Data Store (in-memory)

**P2.5: Calculate Score**
- Input: Validation Results
- Output: Score, Percentage, Pass/Fail
- No Data Store (in-memory)

**P2.6: Update Progress**
- Input: User ID, Level ID, Score
- Output: Updated Progress
- Data Store: D2 (LevelAttempt, User)

**P2.7: Unlock Next Level**
- Input: User ID, Current Level
- Output: Unlock Status
- Data Store: D2 (User)

### 9.3 Process 3: Course Management (Sub-processes)
**P3.1: Create Course**
- Input: Course Data (name, description, teacherId)
- Output: Course ID
- Data Store: D3 (Course)

**P3.2: Assign Levels to Course**
- Input: Course ID, Level ID, Assignment Data
- Output: Assignment ID
- Data Store: D3 (CourseAssignment)

**P3.3: Enroll Students**
- Input: User ID, Course ID
- Output: Enrollment ID
- Data Store: D3 (Enrollment)

**P3.4: Get Course Data**
- Input: Course ID
- Output: Course Information, Assignments, Students
- Data Store: D3 (Course, CourseAssignment, Enrollment)

**P3.5: Update Course Progress**
- Input: User ID, Course ID, Progress Data
- Output: Updated Progress
- Data Store: D3 (Enrollment)

### 9.4 Process 4: Practice Session Management (Sub-processes)
**P4.1: Generate Practice Questions**
- Input: Practice Settings (resistorType, difficulty, etc.)
- Output: Question Array
- No Data Store (Dynamic Generation)

**P4.2: Validate Answers**
- Input: User Answers, Correct Answers
- Output: Validation Results
- No Data Store (in-memory)

**P4.3: Calculate Analytics**
- Input: Question History, Answers
- Output: Analytics Data (accuracy, time spent, error patterns)
- No Data Store (in-memory)

**P4.4: Save Session**
- Input: Session Data, Analytics
- Output: Session ID
- Data Store: D4 (PracticeSession)

**P4.5: Generate Reports**
- Input: Session ID
- Output: Report Data
- Data Store: D4 (PracticeSession)

### 9.5 Process 5: Google Classroom Integration (Sub-processes)
**P5.1: Authenticate with Google**
- Input: OAuth Code
- Output: Access Token
- External: Google OAuth Service

**P5.2: Get Classrooms**
- Input: Access Token
- Output: Classroom List
- External: Google Classroom API

**P5.3: Import Students**
- Input: Classroom ID, Access Token
- Output: Student List
- External: Google Classroom API
- Data Store: D6 (ClassroomStudent, User)

**P5.4: Create Classroom Assignment**
- Input: Course ID, Assignment Data, Access Token
- Output: Classroom Assignment ID
- External: Google Classroom API

**P5.5: Sync Grades**
- Input: Grade Data, Access Token
- Output: Sync Status
- External: Google Classroom API
- Data Store: D6 (GoogleClassroomSync)

### 9.6 Process 6: Analytics & Reporting (Sub-processes)
**P6.1: Aggregate Attempt Data**
- Input: User ID, Date Range
- Output: Aggregated Data
- Data Store: D2 (LevelAttempt)

**P6.2: Calculate Statistics**
- Input: Aggregated Data
- Output: Statistics (average score, completion rate, etc.)
- No Data Store (in-memory)

**P6.3: Generate Charts Data**
- Input: Statistics
- Output: Chart Data (JSON)
- No Data Store (in-memory)

**P6.4: Export Reports**
- Input: Statistics, Chart Data
- Output: Report File (CSV/PDF)
- No Data Store (file system)

### 9.7 Process 7: Learning Path Management (Sub-processes)
**P7.1: Get Modules**
- Input: None
- Output: Module List
- Data Store: D7 (Module)

**P7.2: Get Lessons**
- Input: Module ID
- Output: Lesson List
- Data Store: D7 (Lesson)

**P7.3: Get Lesson Content**
- Input: Lesson ID
- Output: Lesson Content (Markdown/HTML)
- Data Store: D7 (Lesson)

**P7.4: Update Lesson Progress**
- Input: User ID, Lesson ID, Completed Status
- Output: Updated Progress
- Data Store: D5 (LessonProgress)

**P7.5: Update Module Progress**
- Input: User ID, Module ID, Progress Percentage
- Output: Updated Progress
- Data Store: D5 (ModuleProgress)

---

## 10. Data Elements (สำหรับ Threat Model)

### 10.1 Sensitive Data
1. **User Credentials**
   - Password (hashed with bcrypt)
   - Email
   - Session Tokens

2. **Personal Information**
   - User Name
   - Student ID
   - Google Classroom Email

3. **Academic Data**
   - Quiz Scores
   - Progress Data
   - Practice Session Results

4. **OAuth Tokens**
   - Google OAuth Access Token
   - Google OAuth Refresh Token
   - Google Classroom API Tokens

### 10.2 Data Classification
- **Public:** Course Information (published courses), Level Information
- **Internal:** User Progress, Practice Sessions, Analytics
- **Confidential:** User Credentials, OAuth Tokens, Personal Information
- **Restricted:** Admin Functions, System Configuration

---

## 11. Trust Boundaries

### 11.1 External Trust Boundary
- **Internet** ↔ **ResiLearn System**
- **Google Services** ↔ **ResiLearn System**

### 11.2 Internal Trust Boundaries
- **Public Pages** ↔ **Authenticated Pages**
- **Student Role** ↔ **Teacher Role**
- **Teacher Role** ↔ **Admin Role**
- **Client-side** ↔ **Server-side (API)**
- **API Layer** ↔ **Database**

---

## 12. Security Considerations (สำหรับ Threat Model)

### 12.1 Authentication & Authorization Threats
- **Spoofing:** Fake login pages, credential theft
- **Tampering:** Session hijacking, token manipulation
- **Repudiation:** Unauthorized access without audit trail
- **Information Disclosure:** Password leaks, session token exposure
- **Denial of Service:** Brute force attacks, account lockout
- **Elevation of Privilege:** Role escalation, unauthorized access

### 12.2 Data Flow Threats
- **Data in Transit:** Unencrypted HTTP, man-in-the-middle attacks
- **Data at Rest:** Unencrypted database, backup exposure
- **Data Processing:** SQL injection, XSS attacks
- **External API:** OAuth token theft, API abuse

### 12.3 Application Threats
- **Input Validation:** SQL injection, XSS, CSRF
- **Session Management:** Session fixation, timeout issues
- **Error Handling:** Information disclosure through error messages
- **File Upload:** Malicious file uploads (if applicable)

---

## 13. Use Cases (สำหรับ DFD Context)

### 13.1 Student Use Cases
1. Register and Login
2. View Learning Path
3. Practice Resistor Reading
4. Take Quiz
5. View Results and Progress
6. Enroll in Course
7. View Course Assignments
8. View Dashboard

### 13.2 Teacher Use Cases
1. Register and Login
2. Create Course
3. Assign Levels to Course
4. View Student Progress
5. Connect Google Classroom
6. Import Students
7. Sync Grades
8. View Analytics

### 13.3 System Use Cases
1. Generate Questions Dynamically
2. Calculate Scores
3. Update Progress
4. Sync with Google Classroom
5. Generate Analytics Reports

---

## 14. API Endpoints (สำหรับ Data Flow Analysis)

### 14.1 Authentication APIs
- `POST /api/auth/[...nextauth]` - NextAuth handler
- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signout` - Sign out

### 14.2 Learning APIs
- `GET /api/levels` - Get all levels
- `POST /api/attempts` - Submit quiz/practice attempt
- `GET /api/stats` - Get user statistics

### 14.3 Course APIs
- `GET /api/courses` - Get courses
- `POST /api/courses` - Create course
- `GET /api/courses/[courseId]` - Get course details
- `POST /api/courses/[courseId]/enrollments` - Enroll in course
- `POST /api/courses/[courseId]/assignments` - Create assignment
- `GET /api/courses/[courseId]/dashboard` - Get course dashboard

### 14.4 Practice APIs
- `POST /api/practice-sessions` - Save practice session
- `GET /api/practice-sessions` - Get practice sessions
- `GET /api/analytics/practice` - Get practice analytics

### 14.5 Google Classroom APIs
- `POST /api/courses/[courseId]/google-classroom` - Connect/sync Classroom

### 14.6 Learning Path APIs
- `GET /api/modules` - Get modules
- `GET /api/lessons/[lessonId]` - Get lesson content

---

## 15. Database Schema Summary (สำหรับ Data Store Analysis)

### 15.1 Core Tables
- **User** (id, email, name, role, password, currentLevel, levelsUnlocked)
- **Level** (id, number, name, difficulty, passScore, type)
- **LevelAttempt** (id, userId, levelId, courseId, mode, score, percentage, questions)
- **Course** (id, name, description, code, teacherId, googleClassroomId)
- **Enrollment** (id, userId, courseId, progress)
- **CourseAssignment** (id, courseId, levelId, dueDate, maxPoints)
- **PracticeSession** (id, userId, courseId, totalQuestions, correctAnswers, accuracy, questions)
- **GoogleClassroomSync** (id, userId, courseId, classroomId, syncEnabled, autoSyncGrades)
- **Module** (id, title, description, order)
- **Lesson** (id, moduleId, title, content)
- **LessonProgress** (id, userId, lessonId, courseId, completed)
- **ModuleProgress** (id, userId, moduleId, courseId, progress, completed)

---

## 16. สรุปข้อมูลสำหรับการสร้าง DFD

### 16.1 Context Layer (Layer 0)
- **External Entities:** Student, Teacher, Admin, Google OAuth Service, Google Classroom API
- **Process:** ResiLearn System (1 process)
- **Data Store:** Database
- **Data Flows:** ~23 data flows (ดูรายละเอียดใน Section 7.4)

### 16.2 Process Layer (Layer 1)
- **Processes:** 7 processes (P1-P7)
- **Data Stores:** 7 data stores (D1-D7)
- **Data Flows:** Multiple flows between processes, data stores, and external entities

### 16.3 Subprocess Layer (Layer 2)
- **Sub-processes:** ~35 sub-processes (กระจายใน 7 processes หลัก)
- **Data Stores:** Same as Layer 1
- **Data Flows:** Detailed flows for each sub-process

---

## 17. สรุปข้อมูลสำหรับการสร้าง Threat Model

### 17.1 Threats to Identify
1. **Authentication Threats:** Spoofing, credential theft, session hijacking
2. **Authorization Threats:** Privilege escalation, unauthorized access
3. **Data Threats:** SQL injection, XSS, data exposure
4. **Network Threats:** Man-in-the-middle, unencrypted communication
5. **External API Threats:** OAuth token theft, API abuse
6. **Application Threats:** Input validation, error handling, session management

### 17.2 Trust Boundaries to Define
1. Internet ↔ ResiLearn System
2. Google Services ↔ ResiLearn System
3. Public ↔ Authenticated
4. Student ↔ Teacher
5. Client ↔ Server
6. API ↔ Database

### 17.3 Data Classification
- Public, Internal, Confidential, Restricted

---

## 18. เอกสารอ้างอิง

### 18.1 ไฟล์ที่เกี่ยวข้อง
- `/prisma/schema.prisma` - Database schema
- `/lib/auth.ts` - Authentication configuration
- `/middleware.ts` - Route protection
- `/app/api/**` - API routes
- `/Documentation/system-design.md` - System design
- `/Documentation/learning-system.md` - Learning system details
- `/Documentation/classroom-learning.md` - LMS details

### 18.2 External Dependencies
- NextAuth.js v5
- Prisma ORM
- Google APIs (googleapis)
- PostgreSQL Database
- bcryptjs (password hashing)

---

**หมายเหตุ:** เอกสารนี้จัดทำขึ้นเพื่อใช้ในการวิเคราะห์และสร้าง Data Flow Diagram (DFD) และ Threat Model สำหรับระบบ ResiLearn โดยข้อมูลทั้งหมดอ้างอิงจากโค้ดและเอกสารที่มีอยู่ในโปรเจ็ค
