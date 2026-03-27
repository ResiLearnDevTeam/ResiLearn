# Use Case Diagram - ResiLearn System

## Use Case Diagram (Complete - Mermaid)

**หมายเหตุ:** Diagram นี้แสดง Use Cases ทั้งหมด 68 Use Cases สำหรับระบบ ResiLearn

```mermaid
graph TB
    subgraph Actors[" "]
        Student[Student<br/>ผู้เรียน]
        Teacher[Teacher<br/>ครู]
        Admin[Admin<br/>ผู้ดูแลระบบ]
        GoogleOAuth[Google OAuth Service<br/>External System]
        GoogleClassroom[Google Classroom API<br/>External System]
    end

    subgraph System["ResiLearn System"]
        subgraph Auth["Authentication & Registration"]
            UC1[Register Account]
            UC2[Login]
            UC3[Logout]
            UC4[Reset Password]
            UC5[Login with Google]
        end

        subgraph SelfLearning["Self-Learning Mode"]
            UC6[View Learning Path]
            UC7[View Level Details]
            UC8[Practice Resistor Reading]
            UC9[Take Quiz]
            UC10[View Quiz Results]
            UC11[View Progress]
            UC12[Unlock Next Level]
        end

        subgraph Practice["Practice System"]
            UC13[Quick Practice]
            UC14[Custom Practice]
            UC15[Create Practice Preset]
            UC16[Color Reading Practice]
            UC17[View Practice Sessions]
            UC18[View Practice Analytics]
        end

        subgraph LearningPath["Learning Path"]
            UC19[View Modules]
            UC20[View Lessons]
            UC21[Read Lesson Content]
            UC22[Complete Lesson]
            UC23[Track Module Progress]
        end

        subgraph CourseManagement["Course Management"]
            UC24[Create Course]
            UC25[Edit Course]
            UC26[Delete Course]
            UC27[Publish Course]
            UC28[Assign Levels to Course]
            UC29[Set Assignment Due Dates]
            UC30[Create Announcement]
            UC31[Edit Announcement]
            UC32[Delete Announcement]
        end

        subgraph Enrollment["Enrollment"]
            UC33[Enroll in Course]
            UC34[View Enrolled Courses]
            UC35[View Course Details]
            UC36[View Course Assignments]
            UC37[View Course Announcements]
            UC38[View Classmates]
            UC39[Unenroll from Course]
        end

        subgraph CourseLearning["Course Learning"]
            UC40[Complete Course Assignment]
            UC41[View Course Progress]
            UC42[View Course Dashboard]
        end

        subgraph GoogleIntegration["Google Classroom Integration"]
            UC43[Connect Google Classroom]
            UC44[Import Students from Classroom]
            UC45[Sync Course to Classroom]
            UC46[Create Classroom Assignment]
            UC47[Sync Grades to Classroom]
            UC48[Auto-sync Grades]
            UC49[View Sync Status]
        end

        subgraph Analytics["Analytics & Reporting"]
            UC50[View Personal Dashboard]
            UC51[View Self-Learning Statistics]
            UC52[View Course Statistics]
            UC53[View Practice Analytics]
            UC54[View Student Progress]
            UC55[View Course Analytics]
            UC56[View Student Performance]
            UC57[Export Reports]
            UC58[View System-wide Analytics]
        end

        subgraph Profile["Profile Management"]
            UC59[View Profile]
            UC60[Edit Profile]
            UC61[Change Password]
            UC62[Link Google Account]
        end

        subgraph AdminFunctions["Administration"]
            UC63[Manage Users]
            UC64[Manage Levels]
            UC65[Manage Modules]
            UC66[Manage Lessons]
            UC67[View System Logs]
            UC68[Configure System Settings]
        end
    end

    %% Student Use Cases
    Student --> UC1
    Student --> UC2
    Student --> UC3
    Student --> UC4
    Student --> UC5
    Student --> UC6
    Student --> UC7
    Student --> UC8
    Student --> UC9
    Student --> UC10
    Student --> UC11
    Student --> UC12
    Student --> UC13
    Student --> UC14
    Student --> UC15
    Student --> UC16
    Student --> UC17
    Student --> UC18
    Student --> UC19
    Student --> UC20
    Student --> UC21
    Student --> UC22
    Student --> UC23
    Student --> UC33
    Student --> UC34
    Student --> UC35
    Student --> UC36
    Student --> UC37
    Student --> UC38
    Student --> UC39
    Student --> UC40
    Student --> UC41
    Student --> UC42
    Student --> UC50
    Student --> UC51
    Student --> UC52
    Student --> UC53
    Student --> UC59
    Student --> UC60
    Student --> UC61
    Student --> UC62

    %% Teacher Use Cases
    Teacher --> UC1
    Teacher --> UC2
    Teacher --> UC3
    Teacher --> UC4
    Teacher --> UC5
    Teacher --> UC6
    Teacher --> UC7
    Teacher --> UC8
    Teacher --> UC9
    Teacher --> UC10
    Teacher --> UC11
    Teacher --> UC12
    Teacher --> UC13
    Teacher --> UC14
    Teacher --> UC15
    Teacher --> UC16
    Teacher --> UC17
    Teacher --> UC18
    Teacher --> UC19
    Teacher --> UC20
    Teacher --> UC21
    Teacher --> UC22
    Teacher --> UC23
    Teacher --> UC24
    Teacher --> UC25
    Teacher --> UC26
    Teacher --> UC27
    Teacher --> UC28
    Teacher --> UC29
    Teacher --> UC30
    Teacher --> UC31
    Teacher --> UC32
    Teacher --> UC43
    Teacher --> UC44
    Teacher --> UC45
    Teacher --> UC46
    Teacher --> UC47
    Teacher --> UC48
    Teacher --> UC49
    Teacher --> UC50
    Teacher --> UC51
    Teacher --> UC52
    Teacher --> UC53
    Teacher --> UC54
    Teacher --> UC55
    Teacher --> UC56
    Teacher --> UC57
    Teacher --> UC59
    Teacher --> UC60
    Teacher --> UC61
    Teacher --> UC62

    %% Admin Use Cases
    Admin --> UC2
    Admin --> UC3
    Admin --> UC50
    Admin --> UC58
    Admin --> UC63
    Admin --> UC64
    Admin --> UC65
    Admin --> UC66
    Admin --> UC67
    Admin --> UC68
    Admin --> UC59
    Admin --> UC60

    %% External System Interactions
    GoogleOAuth --> UC5
    GoogleClassroom --> UC43
    GoogleClassroom --> UC44
    GoogleClassroom --> UC45
    GoogleClassroom --> UC46
    GoogleClassroom --> UC47
    GoogleClassroom --> UC48

    %% Include Relationships
    UC2 -.->|includes| UC5
    UC9 -.->|includes| UC10
    UC8 -.->|includes| UC11
    UC9 -.->|includes| UC11
    UC40 -.->|includes| UC41
    UC47 -.->|includes| UC48
    UC24 -.->|includes| UC28
    UC28 -.->|includes| UC29

    %% Extend Relationships
    UC9 -.->|extends| UC12
    UC22 -.->|extends| UC23
    UC40 -.->|extends| UC42

    style Student fill:#e1f5ff
    style Teacher fill:#fff4e1
    style Admin fill:#ffe1e1
    style GoogleOAuth fill:#f0f0f0
    style GoogleClassroom fill:#f0f0f0
    style System fill:#f9f9f9
```

---

## Use Case Diagram (Simplified - Grouped by Feature)

```mermaid
graph TB
    subgraph Actors[" "]
        Student[Student]
        Teacher[Teacher]
        Admin[Admin]
        GoogleOAuth[Google OAuth]
        GoogleClassroom[Google Classroom]
    end

    subgraph System["ResiLearn System"]
        Auth[Authentication & Registration]
        SelfLearn[Self-Learning Mode]
        Practice[Practice System]
        LearningPath[Learning Path]
        CourseMgmt[Course Management]
        Enrollment[Enrollment]
        GoogleSync[Google Integration]
        Analytics[Analytics & Reporting]
        Profile[Profile Management]
        AdminFunc[Administration]
    end

    Student --> Auth
    Student --> SelfLearn
    Student --> Practice
    Student --> LearningPath
    Student --> Enrollment
    Student --> Analytics
    Student --> Profile

    Teacher --> Auth
    Teacher --> SelfLearn
    Teacher --> Practice
    Teacher --> LearningPath
    Teacher --> CourseMgmt
    Teacher --> GoogleSync
    Teacher --> Analytics
    Teacher --> Profile

    Admin --> Auth
    Admin --> Analytics
    Admin --> AdminFunc
    Admin --> Profile

    GoogleOAuth --> Auth
    GoogleClassroom --> GoogleSync

    style Student fill:#e1f5ff
    style Teacher fill:#fff4e1
    style Admin fill:#ffe1e1
    style GoogleOAuth fill:#f0f0f0
    style GoogleClassroom fill:#f0f0f0
```

---

## Use Case Diagram (Alternative - Actor-Centric View)

```mermaid
graph LR
    subgraph StudentView["Student View"]
        S1[Register/Login]
        S2[Self-Learning]
        S3[Practice]
        S4[Enroll Course]
        S5[View Dashboard]
        S6[View Progress]
    end

    subgraph TeacherView["Teacher View"]
        T1[Register/Login]
        T2[Create Course]
        T3[Assign Levels]
        T4[View Analytics]
        T5[Google Sync]
        T6[Manage Students]
    end

    subgraph AdminView["Admin View"]
        A1[Login]
        A2[Manage Users]
        A3[Manage Content]
        A4[System Analytics]
    end

    Student --> S1
    Student --> S2
    Student --> S3
    Student --> S4
    Student --> S5
    Student --> S6

    Teacher --> T1
    Teacher --> T2
    Teacher --> T3
    Teacher --> T4
    Teacher --> T5
    Teacher --> T6

    Admin --> A1
    Admin --> A2
    Admin --> A3
    Admin --> A4

    style StudentView fill:#e1f5ff
    style TeacherView fill:#fff4e1
    style AdminView fill:#ffe1e1
```

---

## Detailed Use Case List

### Authentication & Registration
1. **Register Account** - สมัครสมาชิก (Student/Teacher)
2. **Login** - เข้าสู่ระบบ (Credentials)
3. **Logout** - ออกจากระบบ
4. **Reset Password** - รีเซ็ตรหัสผ่าน
5. **Login with Google** - เข้าสู่ระบบด้วย Google OAuth

### Self-Learning Mode
6. **View Learning Path** - ดู Learning Path (7 Levels)
7. **View Level Details** - ดูรายละเอียด Level
8. **Practice Resistor Reading** - ฝึกอ่านค่าตัวต้านทาน (Practice Mode)
9. **Take Quiz** - ทำแบบทดสอบ (Quiz Mode)
10. **View Quiz Results** - ดูผลการทำแบบทดสอบ
11. **View Progress** - ดูความคืบหน้า
12. **Unlock Next Level** - ปลดล็อก Level ถัดไป (เมื่อผ่าน Level ปัจจุบัน)

### Practice System
13. **Quick Practice** - ฝึกแบบด่วน (ตั้งค่าด่วน)
14. **Custom Practice** - ฝึกแบบกำหนดเอง
15. **Create Practice Preset** - สร้าง Preset สำหรับฝึก
16. **Color Reading Practice** - ฝึกอ่านค่ารหัสสี (แบบต่างๆ)
17. **View Practice Sessions** - ดูประวัติการฝึก
18. **View Practice Analytics** - ดูสถิติการฝึก

### Learning Path
19. **View Modules** - ดู Modules ทั้งหมด
20. **View Lessons** - ดู Lessons ใน Module
21. **Read Lesson Content** - อ่านเนื้อหา Lesson
22. **Complete Lesson** - ทำ Lesson เสร็จ
23. **Track Module Progress** - ติดตามความคืบหน้า Module

### Course Management (Teacher Only)
24. **Create Course** - สร้าง Course
25. **Edit Course** - แก้ไข Course
26. **Delete Course** - ลบ Course
27. **Publish Course** - เผยแพร่ Course
28. **Assign Levels to Course** - กำหนด Levels เป็น Assignments
29. **Set Assignment Due Dates** - กำหนดวันครบกำหนด
30. **Create Announcement** - สร้างประกาศ
31. **Edit Announcement** - แก้ไขประกาศ
32. **Delete Announcement** - ลบประกาศ

### Enrollment
33. **Enroll in Course** - ลงทะเบียนเรียน Course
34. **View Enrolled Courses** - ดู Courses ที่ลงทะเบียนแล้ว
35. **View Course Details** - ดูรายละเอียด Course
36. **View Course Assignments** - ดู Assignments ใน Course
37. **View Course Announcements** - ดูประกาศใน Course
38. **View Classmates** - ดูเพื่อนร่วมชั้น
39. **Unenroll from Course** - ยกเลิกการลงทะเบียน

### Course Learning
40. **Complete Course Assignment** - ทำ Assignment ใน Course
41. **View Course Progress** - ดูความคืบหน้าใน Course
42. **View Course Dashboard** - ดู Dashboard ของ Course

### Google Classroom Integration
43. **Connect Google Classroom** - เชื่อมต่อ Google Classroom
44. **Import Students from Classroom** - นำเข้า Students จาก Classroom
45. **Sync Course to Classroom** - Sync Course ไปยัง Classroom
46. **Create Classroom Assignment** - สร้าง Assignment ใน Classroom
47. **Sync Grades to Classroom** - Sync คะแนนไปยัง Classroom
48. **Auto-sync Grades** - Sync คะแนนอัตโนมัติ
49. **View Sync Status** - ดูสถานะการ Sync

### Analytics & Reporting
50. **View Personal Dashboard** - ดู Dashboard ส่วนตัว
51. **View Self-Learning Statistics** - ดูสถิติ Self-Learning
52. **View Course Statistics** - ดูสถิติ Course
53. **View Practice Analytics** - ดูสถิติการฝึก
54. **View Student Progress** - ดูความคืบหน้าของ Student (Teacher)
55. **View Course Analytics** - ดูสถิติ Course (Teacher)
56. **View Student Performance** - ดูผลการเรียนของ Student (Teacher)
57. **Export Reports** - ส่งออกรายงาน
58. **View System-wide Analytics** - ดูสถิติทั้งระบบ (Admin)

### Profile Management
59. **View Profile** - ดู Profile
60. **Edit Profile** - แก้ไข Profile
61. **Change Password** - เปลี่ยนรหัสผ่าน
62. **Link Google Account** - เชื่อมต่อบัญชี Google

### Administration (Admin Only)
63. **Manage Users** - จัดการ Users
64. **Manage Levels** - จัดการ Levels
65. **Manage Modules** - จัดการ Modules
66. **Manage Lessons** - จัดการ Lessons
67. **View System Logs** - ดู System Logs
68. **Configure System Settings** - กำหนดค่าระบบ

---

## Use Case Relationships

### Include Relationships (<<include>>)
- **Login** includes **Login with Google** (optional)
- **Take Quiz** includes **View Quiz Results**
- **Practice Resistor Reading** includes **View Progress**
- **Take Quiz** includes **View Progress**
- **Complete Course Assignment** includes **View Course Progress**
- **Sync Grades to Classroom** includes **Auto-sync Grades**
- **Create Course** includes **Assign Levels to Course**
- **Assign Levels to Course** includes **Set Assignment Due Dates**

### Extend Relationships (<<extend>>)
- **Take Quiz** extends **Unlock Next Level** (when passed)
- **Complete Lesson** extends **Track Module Progress**
- **Complete Course Assignment** extends **View Course Dashboard**

### Generalization
- **Student** และ **Teacher** เป็น subtypes ของ **User**
- ทั้ง **Student** และ **Teacher** สามารถใช้ Self-Learning Mode ได้
- **Teacher** มีสิทธิ์เพิ่มเติมในการจัดการ Course

---

## Actor Descriptions

### Student (ผู้เรียน)
- ลงทะเบียนและเข้าสู่ระบบ
- เรียนรู้แบบ Self-Learning (7 Levels)
- ฝึก Practice แบบต่างๆ
- ลงทะเบียนเรียน Course
- ทำ Assignments ที่ครูกำหนด
- ดู Dashboard และ Progress

### Teacher (ครู)
- ลงทะเบียนและเข้าสู่ระบบ
- ใช้ Self-Learning Mode (เช่นเดียวกับ Student)
- สร้างและจัดการ Course
- กำหนด Assignments
- เชื่อมต่อ Google Classroom
- Import Students
- Sync Grades
- ดู Analytics และ Student Progress

### Admin (ผู้ดูแลระบบ)
- เข้าสู่ระบบ
- จัดการ Users, Levels, Modules, Lessons
- ดู System-wide Analytics
- กำหนดค่าระบบ

### External Systems
- **Google OAuth Service** - ให้บริการ Authentication
- **Google Classroom API** - ให้บริการ Classroom Integration

---

## Use Case Priority

### High Priority (Core Features)
- Authentication (UC1-UC5)
- Self-Learning Mode (UC6-UC12)
- Practice System (UC13-UC18)
- Course Management (UC24-UC32)
- Enrollment (UC33-UC39)

### Medium Priority (Important Features)
- Learning Path (UC19-UC23)
- Google Classroom Integration (UC43-UC49)
- Analytics (UC50-UC57)

### Low Priority (Nice to Have)
- Profile Management (UC59-UC62)
- Administration (UC63-UC68)

---

## Notes for Implementation

1. **Authentication Flow:**
   - Student/Teacher สามารถ Login ด้วย Credentials หรือ Google OAuth
   - Session ใช้ JWT tokens

2. **Progressive Learning:**
   - ต้องผ่าน Level ก่อนถึงจะ Unlock Level ถัดไป
   - Pass criteria: 80% score + Complete all questions

3. **Course Management:**
   - Teacher สร้าง Course และ Assign Levels
   - Student Enroll และทำ Assignments
   - Progress ติดตามแยกกันระหว่าง Self-Learning และ Course

4. **Google Classroom Integration:**
   - Teacher เชื่อมต่อ Classroom และ Import Students
   - Grades Sync อัตโนมัติหรือ Manual

5. **Analytics:**
   - Student ดู Dashboard ส่วนตัว
   - Teacher ดู Course Analytics และ Student Progress
   - Admin ดู System-wide Analytics

---

## Use Case Statistics

### Total Use Cases: 68

**By Actor:**
- **Student:** 42 use cases
- **Teacher:** 50 use cases (includes all Student use cases + Teacher-specific)
- **Admin:** 10 use cases

**By Feature Group:**
- Authentication & Registration: 5
- Self-Learning Mode: 7
- Practice System: 6
- Learning Path: 5
- Course Management: 9
- Enrollment: 7
- Course Learning: 3
- Google Classroom Integration: 7
- Analytics & Reporting: 9
- Profile Management: 4
- Administration: 6

**By Priority:**
- High Priority: 35 use cases
- Medium Priority: 20 use cases
- Low Priority: 13 use cases

---

## Use Case Descriptions (Key Use Cases)

### UC1: Register Account
**Actor:** Student, Teacher  
**Description:** ผู้ใช้สมัครสมาชิกใหม่โดยกรอกข้อมูล email, password, name และเลือก role (Student/Teacher)  
**Preconditions:** ไม่มี  
**Postconditions:** สร้าง User account ใหม่ในระบบ  
**Main Flow:**
1. ผู้ใช้เข้าหน้า Register
2. กรอกข้อมูล (email, password, name, role)
3. ระบบตรวจสอบ email ไม่ซ้ำ
4. Hash password ด้วย bcrypt
5. สร้าง User ใน database
6. Redirect ไปหน้า Login

### UC9: Take Quiz
**Actor:** Student, Teacher  
**Description:** ทำแบบทดสอบใน Level ที่กำหนด มีเวลาและบันทึกคะแนน  
**Preconditions:** User ต้อง Login และ Level ต้อง Unlock แล้ว  
**Postconditions:** บันทึก LevelAttempt ใน database, Unlock Level ถัดไปถ้าผ่าน  
**Main Flow:**
1. ผู้ใช้เลือก Level และกด "Take Quiz"
2. ระบบ Generate Questions แบบ Dynamic
3. แสดงคำถามทีละข้อพร้อม Timer
4. ผู้ใช้ตอบคำถาม
5. Submit เมื่อเสร็จหรือหมดเวลา
6. ระบบคำนวณคะแนน
7. บันทึก LevelAttempt
8. ถ้าคะแนน >= 80% → Unlock Level ถัดไป
9. แสดงผลลัพธ์

### UC24: Create Course
**Actor:** Teacher  
**Description:** ครูสร้าง Course ใหม่  
**Preconditions:** Teacher ต้อง Login  
**Postconditions:** สร้าง Course ใน database  
**Main Flow:**
1. Teacher เข้าหน้า Create Course
2. กรอกข้อมูล Course (name, description, code)
3. ระบบตรวจสอบ Course code ไม่ซ้ำ
4. สร้าง Course ใน database
5. Redirect ไปหน้า Course Management

### UC43: Connect Google Classroom
**Actor:** Teacher  
**Description:** ครูเชื่อมต่อ Google Classroom account  
**Preconditions:** Teacher ต้อง Login  
**Postconditions:** บันทึก GoogleClassroomSync ใน database  
**Main Flow:**
1. Teacher กด "Connect Google Classroom"
2. Redirect ไป Google OAuth
3. Teacher อนุญาตการเข้าถึง
4. ระบบได้รับ Access Token
5. เรียก Google Classroom API เพื่อดึง Classrooms
6. Teacher เลือก Classroom
7. บันทึก GoogleClassroomSync

### UC47: Sync Grades to Classroom
**Actor:** Teacher (System)  
**Description:** Sync คะแนน Quiz ไปยัง Google Classroom Gradebook  
**Preconditions:** Course ต้องเชื่อมต่อกับ Google Classroom แล้ว  
**Postconditions:** คะแนนถูก Sync ไปยัง Classroom  
**Main Flow:**
1. Student ทำ Quiz เสร็จ
2. ระบบคำนวณคะแนน
3. ตรวจสอบว่า Course มี Google Classroom Sync
4. เรียก Google Classroom API
5. Update Grade ใน Classroom Gradebook
6. บันทึก Sync Status

---

## Use Case Diagram Usage

### สำหรับ DFD Analysis
- ใช้ Use Cases เหล่านี้เพื่อระบุ Processes ใน DFD
- แต่ละ Use Case อาจเป็น Process หรือ Sub-process ใน DFD Layer 1-2

### สำหรับ Threat Model
- ใช้ Use Cases เพื่อระบุ Entry Points ของระบบ
- วิเคราะห์ Threats ที่อาจเกิดขึ้นในแต่ละ Use Case
- ระบุ Trust Boundaries ระหว่าง Actors และ System

### สำหรับ System Design
- ใช้ Use Cases เป็น Requirements
- แต่ละ Use Case ควรมี Implementation ในระบบ
- ใช้เป็น Checklist สำหรับการทดสอบระบบ
