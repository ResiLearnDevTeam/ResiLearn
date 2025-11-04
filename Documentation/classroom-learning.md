# Classroom Learning System - ResiLearn

## Overview

ระบบ **Classroom Learning** เป็นระบบ LMS (Learning Management System) สำหรับจัดการเรียนการสอนแบบโครงสร้าง โดยครูสามารถสร้างคอร์ส กำหนด Assignment และติดตามความคืบหน้าของนักเรียน พร้อมการเชื่อมต่อกับ Google Classroom

---

## Core Features

### 1. **Course Management (สำหรับครู)**
- สร้างคอร์สใหม่
- แก้ไข/ลบคอร์ส
- ตั้งค่ารหัสคอร์ส (Course Code)
- กำหนดวันที่เริ่มต้นและสิ้นสุด
- เปิด/ปิดการเผยแพร่คอร์ส
- เชื่อมต่อกับ Google Classroom

### 2. **Assignment System**
- ครูสามารถกำหนด Level เป็น Assignment
- กำหนดวันครบกำหนด (Due Date)
- กำหนดคะแนนเต็ม (Max Points)
- เรียงลำดับ Assignment
- นักเรียนสามารถดู Assignment ที่ได้รับมอบหมาย

### 3. **Enrollment System**
- นักเรียนสามารถลงทะเบียนด้วยรหัสคอร์ส
- ครูสามารถเพิ่มนักเรียนเข้าคอร์สได้
- ครูสามารถลบนักเรียนออกจากคอร์สได้
- อัปเดตความคืบหน้า (Progress) อัตโนมัติ

### 4. **Announcement System**
- ครูสามารถโพสต์ประกาศในคอร์ส
- นักเรียนสามารถดูประกาศทั้งหมด
- แสดงวันที่และเวลาที่โพสต์

### 5. **Progress Tracking**
- ติดตามความคืบหน้าของนักเรียนแต่ละคน
- แสดงสถิติรวมของนักเรียนทั้งหมด
- เปรียบเทียบความคืบหน้าระหว่างนักเรียน

### 6. **Google Classroom Integration**
- เชื่อมต่อกับ Google Classroom
- Import นักเรียนจาก Classroom
- Sync เกรดกลับไปยัง Classroom Gradebook
- Auto-sync หรือ manual sync

---

## File Structure

### Student Pages (หน้าสำหรับนักเรียน)

```
/app/learn/classroom/
├── courses/
│   ├── page.tsx                    # รายการคอร์สที่ลงทะเบียนแล้ว
│   └── [courseId]/
│       ├── page.tsx                 # หน้าคอร์ส (Overview)
│       ├── assignments/
│       │   └── page.tsx             # รายการ Assignment
│       ├── announcements/
│       │   └── page.tsx             # ประกาศของคอร์ส
│       └── classmates/
│           └── page.tsx             # รายชื่อเพื่อนร่วมชั้น
```

**หน้าที่ของแต่ละหน้า:**

1. **`/courses/page.tsx`** - รายการคอร์ส
   - แสดงคอร์สทั้งหมดที่นักเรียนลงทะเบียนแล้ว
   - แสดงความคืบหน้าในแต่ละคอร์ส
   - ปุ่ม "Join Course" สำหรับลงทะเบียนด้วยรหัส

2. **`/courses/[courseId]/page.tsx`** - หน้าคอร์ส
   - ข้อมูลคอร์ส (ชื่อ, คำอธิบาย, ครู)
   - ความคืบหน้ารวม
   - Quick links ไปยัง Assignments, Announcements, Classmates

3. **`/courses/[courseId]/assignments/page.tsx`** - Assignment
   - รายการ Assignment ทั้งหมด
   - สถานะ (Pending, Completed, Overdue)
   - คะแนนที่ได้
   - ลิงก์ไปทำ Quiz

4. **`/courses/[courseId]/announcements/page.tsx`** - ประกาศ
   - รายการประกาศทั้งหมด (เรียงตามวันที่ใหม่สุด)
   - ดูรายละเอียดประกาศ

5. **`/courses/[courseId]/classmates/page.tsx`** - เพื่อนร่วมชั้น
   - รายชื่อนักเรียนทั้งหมดในคอร์ส
   - อาจแสดงความคืบหน้ารวม (ถ้าครูเปิด)

---

### Teacher Pages (หน้าสำหรับครู)

```
/app/learn/classroom/teacher/
└── courses/
    ├── page.tsx                     # รายการคอร์สที่สร้าง
    ├── create/
    │   └── page.tsx                 # สร้างคอร์สใหม่
    └── [courseId]/
        ├── page.tsx                 # จัดการคอร์ส (Overview)
        ├── assignments/
        │   └── page.tsx             # จัดการ Assignment
        ├── students/
        │   └── page.tsx             # จัดการนักเรียน
        ├── announcements/
        │   └── page.tsx             # จัดการประกาศ
        └── settings/
            └── page.tsx             # ตั้งค่าคอร์ส
```

**หน้าที่ของแต่ละหน้า:**

1. **`/teacher/courses/page.tsx`** - รายการคอร์ส
   - แสดงคอร์สทั้งหมดที่ครูสร้าง
   - สถานะ (Published/Draft)
   - จำนวนนักเรียน
   - ปุ่ม "Create Course"

2. **`/teacher/courses/create/page.tsx`** - สร้างคอร์ส
   - ฟอร์มสร้างคอร์ส (ชื่อ, คำอธิบาย, วันที่)
   - สร้างรหัสคอร์สอัตโนมัติ
   - ตั้งค่า Google Classroom sync (ถ้าต้องการ)

3. **`/teacher/courses/[courseId]/page.tsx`** - จัดการคอร์ส
   - Overview ของคอร์ส
   - สถิติรวม (นักเรียน, Assignment, ความคืบหน้า)
   - Quick links ไปยังส่วนต่าง ๆ

4. **`/teacher/courses/[courseId]/assignments/page.tsx`** - จัดการ Assignment
   - รายการ Assignment ทั้งหมด
   - สร้าง Assignment ใหม่ (เลือก Level, กำหนด Due Date)
   - แก้ไข/ลบ Assignment
   - เรียงลำดับ Assignment

5. **`/teacher/courses/[courseId]/students/page.tsx`** - จัดการนักเรียน
   - รายชื่อนักเรียนทั้งหมด
   - ความคืบหน้าของแต่ละคน
   - เพิ่มนักเรียน (Manual หรือ Import จาก Classroom)
   - ลบนักเรียน

6. **`/teacher/courses/[courseId]/announcements/page.tsx`** - จัดการประกาศ
   - รายการประกาศทั้งหมด
   - สร้างประกาศใหม่
   - แก้ไข/ลบประกาศ

7. **`/teacher/courses/[courseId]/settings/page.tsx`** - ตั้งค่าคอร์ส
   - แก้ไขข้อมูลคอร์ส
   - ตั้งค่า Google Classroom sync
   - ลบคอร์ส

---

### API Routes

```
/app/api/courses/
├── route.ts                          # GET: List courses, POST: Create course
├── [courseId]/
│   ├── route.ts                      # GET: Course details, PUT: Update, DELETE: Delete
│   ├── enrollments/
│   │   ├── route.ts                  # GET: List enrollments, POST: Enroll
│   │   └── [userId]/
│   │       └── route.ts              # DELETE: Unenroll
│   ├── assignments/
│   │   ├── route.ts                  # GET: List assignments, POST: Create
│   │   └── [assignmentId]/
│   │       └── route.ts              # GET, PUT, DELETE assignment
│   ├── announcements/
│   │   ├── route.ts                  # GET: List announcements, POST: Create
│   │   └── [announcementId]/
│   │       └── route.ts              # GET, PUT, DELETE announcement
│   ├── progress/
│   │   └── route.ts                  # GET: Course progress (student: own, teacher: all)
│   ├── students/
│   │   └── route.ts                  # GET: List students (for classmates view)
│   └── google-classroom/
│       └── route.ts                  # GET: Sync status, POST: Sync, DELETE: Disconnect
```

**API Endpoints:**

#### Courses
- `GET /api/courses` - รายการคอร์ส
  - Student: คอร์สที่ลงทะเบียนแล้ว
  - Teacher: คอร์สที่สร้าง
- `POST /api/courses` - สร้างคอร์ส (Teacher only)
- `GET /api/courses/[courseId]` - ข้อมูลคอร์ส
- `PUT /api/courses/[courseId]` - แก้ไขคอร์ส (Teacher only)
- `DELETE /api/courses/[courseId]` - ลบคอร์ส (Teacher only)

#### Enrollments
- `GET /api/courses/[courseId]/enrollments` - รายการนักเรียน (Teacher only)
- `POST /api/courses/[courseId]/enrollments` - ลงทะเบียน
  - Student: Self-enroll (ต้องมี course code)
  - Teacher: Enroll student by userId
- `DELETE /api/courses/[courseId]/enrollments/[userId]` - ลบการลงทะเบียน

#### Assignments
- `GET /api/courses/[courseId]/assignments` - รายการ Assignment
- `POST /api/courses/[courseId]/assignments` - สร้าง Assignment (Teacher only)
- `GET /api/courses/[courseId]/assignments/[assignmentId]` - ข้อมูล Assignment
- `PUT /api/courses/[courseId]/assignments/[assignmentId]` - แก้ไข (Teacher only)
- `DELETE /api/courses/[courseId]/assignments/[assignmentId]` - ลบ (Teacher only)

#### Announcements
- `GET /api/courses/[courseId]/announcements` - รายการประกาศ
- `POST /api/courses/[courseId]/announcements` - สร้างประกาศ (Teacher only)
- `GET /api/courses/[courseId]/announcements/[announcementId]` - ข้อมูลประกาศ
- `PUT /api/courses/[courseId]/announcements/[announcementId]` - แก้ไข (Teacher only)
- `DELETE /api/courses/[courseId]/announcements/[announcementId]` - ลบ (Teacher only)

#### Progress & Students
- `GET /api/courses/[courseId]/progress` - ความคืบหน้า
  - Student: ความคืบหน้าของตัวเอง
  - Teacher: ความคืบหน้าของนักเรียนทั้งหมด
- `GET /api/courses/[courseId]/students` - รายชื่อนักเรียน (สำหรับ classmates view)

#### Google Classroom
- `GET /api/courses/[courseId]/google-classroom` - สถานะการ sync
- `POST /api/courses/[courseId]/google-classroom` - เชื่อมต่อ/ซิงค์ (Teacher only)
- `DELETE /api/courses/[courseId]/google-classroom` - ตัดการเชื่อมต่อ (Teacher only)

---

### Components

```
/components/features/classroom/
├── CourseCard.tsx                   # แสดงคอร์สในรายการ (Card)
├── CourseDetail.tsx                 # ข้อมูลคอร์ส (Overview)
├── AssignmentCard.tsx               # แสดง Assignment ในรายการ
├── AssignmentList.tsx               # รายการ Assignment
├── AnnouncementCard.tsx             # แสดงประกาศ
├── AnnouncementList.tsx             # รายการประกาศ
├── StudentList.tsx                  # รายชื่อนักเรียน/เพื่อนร่วมชั้น
├── EnrollmentForm.tsx               # ฟอร์มลงทะเบียนคอร์ส (Join by code)
├── CourseProgress.tsx               # แสดงความคืบหน้า
├── CreateCourseForm.tsx             # ฟอร์มสร้างคอร์ส (Teacher)
├── EditCourseForm.tsx               # ฟอร์มแก้ไขคอร์ส (Teacher)
├── CreateAssignmentForm.tsx         # ฟอร์มสร้าง Assignment (Teacher)
├── CreateAnnouncementForm.tsx       # ฟอร์มสร้างประกาศ (Teacher)
└── GoogleClassroomSync.tsx          # Component สำหรับ Google Classroom sync
```

**หน้าที่ของแต่ละ Component:**

1. **CourseCard** - แสดงคอร์สในรูปแบบ Card
   - ชื่อคอร์ส, คำอธิบาย, ครู
   - ความคืบหน้า (สำหรับนักเรียน)
   - จำนวนนักเรียน (สำหรับครู)

2. **CourseDetail** - ข้อมูลคอร์สแบบละเอียด
   - ข้อมูลทั้งหมดของคอร์ส
   - สถิติรวม

3. **AssignmentCard** - แสดง Assignment
   - ชื่อ Assignment, Level, Due Date
   - สถานะ (Pending/Completed/Overdue)
   - คะแนน

4. **AssignmentList** - รายการ Assignment
   - แสดง Assignment ทั้งหมด
   - Filter/Sort

5. **AnnouncementCard** - แสดงประกาศ
   - หัวข้อ, เนื้อหา, วันที่

6. **AnnouncementList** - รายการประกาศ
   - เรียงตามวันที่ใหม่สุด

7. **StudentList** - รายชื่อนักเรียน
   - แสดงชื่อ, อีเมล
   - อาจแสดงความคืบหน้า (ถ้าครู)

8. **EnrollmentForm** - ฟอร์มลงทะเบียน
   - กรอกรหัสคอร์ส
   - Submit เพื่อลงทะเบียน

9. **CourseProgress** - แสดงความคืบหน้า
   - Student: ความคืบหน้าของตัวเอง
   - Teacher: ความคืบหน้าของนักเรียนทั้งหมด (Chart/Table)

10. **CreateCourseForm** - ฟอร์มสร้างคอร์ส
    - ฟิลด์ทั้งหมดสำหรับสร้างคอร์ส

11. **EditCourseForm** - ฟอร์มแก้ไขคอร์ส
    - แก้ไขข้อมูลคอร์ส

12. **CreateAssignmentForm** - ฟอร์มสร้าง Assignment
    - เลือก Level
    - กำหนด Due Date, Max Points, Order

13. **CreateAnnouncementForm** - ฟอร์มสร้างประกาศ
    - หัวข้อ, เนื้อหา

14. **GoogleClassroomSync** - Component สำหรับ Google Classroom
    - เชื่อมต่อ Classroom
    - Import นักเรียน
    - Sync เกรด

---

### Types & Utils

```
/types/
└── classroom.ts                     # Type definitions สำหรับ Classroom system

/lib/
└── classroom.ts                     # Utility functions สำหรับ Classroom operations
```

**Types ที่ควรมี:**
- `Course` - ประเภทข้อมูลคอร์ส
- `Enrollment` - ประเภทข้อมูลการลงทะเบียน
- `CourseAssignment` - ประเภทข้อมูล Assignment
- `Announcement` - ประเภทข้อมูลประกาศ
- `CourseProgress` - ประเภทข้อมูลความคืบหน้า

**Utility Functions:**
- `getCourseProgress()` - คำนวณความคืบหน้า
- `formatCourseCode()` - จัดรูปแบบรหัสคอร์ส
- `checkAssignmentStatus()` - ตรวจสอบสถานะ Assignment
- `syncGoogleClassroom()` - ซิงค์กับ Google Classroom

---

## Database Schema

ระบบ Classroom Learning ใช้ Schema ที่มีอยู่แล้วใน `prisma/schema.prisma`:

### Models ที่เกี่ยวข้อง:

1. **Course** - ข้อมูลคอร์ส
   - `id`, `name`, `description`, `code`, `teacherId`
   - `startDate`, `endDate`, `isPublished`
   - `googleClassroomId` - สำหรับเชื่อมต่อกับ Google Classroom

2. **Enrollment** - การลงทะเบียน
   - `userId`, `courseId`
   - `enrolledAt` - วันที่ลงทะเบียน
   - `progress` - ความคืบหน้า (0-100)

3. **CourseAssignment** - Assignment
   - `courseId`, `levelId` - กำหนด Level เป็น Assignment
   - `title`, `description`, `dueDate`
   - `maxPoints` - คะแนนเต็ม
   - `order` - ลำดับ

4. **Announcement** - ประกาศ
   - `courseId`, `title`, `content`
   - `createdAt`, `updatedAt`

5. **LevelAttempt** - การทำ Quiz
   - `courseId` - ถ้าไม่ null แสดงว่าเป็นการทำ Quiz ในคอร์ส
   - `levelId`, `userId`, `score`, `percentage`
   - `mode` - PRACTICE หรือ QUIZ

6. **GoogleClassroomSync** - การเชื่อมต่อ Google Classroom
   - `courseId`, `userId` (Teacher)
   - `classroomId`, `classroomName`
   - `lastSyncAt`, `syncEnabled`, `autoSyncGrades`

---

## User Flow

### Student Flow (นักเรียน)

1. **เข้าสู่ระบบ** → ไปที่ `/learn/classroom/courses`
2. **ดูรายการคอร์ส** → เห็นคอร์สที่ลงทะเบียนแล้ว
3. **ลงทะเบียนคอร์สใหม่** → ใช้รหัสคอร์ส (Course Code)
4. **เข้าไปในคอร์ส** → ดู Overview, Assignments, Announcements
5. **ทำ Assignment** → คลิก Assignment → ไปทำ Quiz
6. **ดูความคืบหน้า** → ดูในหน้าคอร์ส

### Teacher Flow (ครู)

1. **เข้าสู่ระบบ** → ไปที่ `/learn/classroom/teacher/courses`
2. **สร้างคอร์ส** → กรอกข้อมูล, สร้างรหัสคอร์ส
3. **จัดการ Assignment** → สร้าง Assignment (เลือก Level, กำหนด Due Date)
4. **เพิ่มนักเรียน** → Manual หรือ Import จาก Google Classroom
5. **โพสต์ประกาศ** → แจ้งข่าวสารให้กับนักเรียน
6. **ติดตามความคืบหน้า** → ดูความคืบหน้าของนักเรียนทั้งหมด

---

## Integration with Progressive Learning

ระบบ Classroom Learning ทำงานร่วมกับระบบ Progressive Learning ที่มีอยู่:

1. **Level System** - ใช้ Level เดียวกัน (Level 1-7)
2. **LevelAttempt** - บันทึกการทำ Quiz ทั้งใน Self-Learning และ Course
   - `courseId` = null → Self-Learning
   - `courseId` ≠ null → Course Assignment
3. **Progress Tracking** - รวมความคืบหน้าทั้ง 2 โหมด
4. **Quiz Mode** - ใช้ Quiz Mode เดียวกัน แต่เพิ่ม context ของ Course

---

## Next Steps (สำหรับ Implementation)

### Phase 1: Basic Course Management
1. ✅ สร้างโครงสร้างไฟล์ (Completed)
2. ⏳ สร้าง API routes สำหรับ Courses
3. ⏳ สร้าง Pages สำหรับ Student และ Teacher
4. ⏳ สร้าง Components พื้นฐาน

### Phase 2: Assignment System
1. ⏳ API routes สำหรับ Assignments
2. ⏳ UI สำหรับจัดการ Assignment
3. ⏳ เชื่อมโยงกับ Level System

### Phase 3: Enrollment & Progress
1. ⏳ Enrollment system
2. ⏳ Progress tracking
3. ⏳ Analytics dashboard

### Phase 4: Google Classroom Integration
1. ⏳ Google Classroom API integration
2. ⏳ Import students
3. ⏳ Sync grades

---

## Notes

- ไฟล์ทั้งหมดที่สร้างไว้เป็นไฟล์เปล่า พร้อมสำหรับ implementation
- ใช้ Database Schema ที่มีอยู่แล้ว ไม่ต้องสร้าง Schema ใหม่
- ระบบออกแบบมาให้ทำงานร่วมกับ Progressive Learning system
- ครูสามารถสร้างคอร์สได้หลายคอร์ส
- นักเรียนสามารถลงทะเบียนได้หลายคอร์ส
- Progress tracking แยกตาม Course แต่รวมกันใน Dashboard

---

## Related Documentation

- [Learning System](./learning-system.md) - Progressive Learning System
- [System Design](./system-design.md) - Complete System Design
- [Prisma Guide](./guides/PRISMA_GUIDE.md) - Database Schema Guide

