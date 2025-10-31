# Complete System Design - Progressive Learning + LMS

## System Overview

ระบบ **Progressive Learning** (ฝึกแบบง่าย → ยาก) + **LMS** (Google Classroom integration)

### Core Features:
1. **Progressive Learning System** - 7 levels, unlock system
2. **Practice & Quiz Modes** - Interactive resistor training
3. **LMS Integration** - Course management, student tracking
4. **Google Classroom Sync** - Import students, sync grades
5. **Progress Tracking** - Comprehensive analytics

---

## Dual Mode System

### Mode 1: **Self-Learning Mode** (Progressive)
- User เรียนรู้ด้วยตัวเอง
- เริ่มจาก Level 1 → Level 7
- Unlock system
- No course required

### Mode 2: **Course Mode** (LMS)
- Teacher สร้าง Course
- Assign Levels เป็น Assignments
- Track student progress
- Sync with Google Classroom

### Both Modes Work Together:
- Student สามารถเรียนรู้เอง (Self-Learning)
- หรือ Join Course ที่ครูสร้าง (Course Mode)
- Progress ทั้ง 2 โหมดรวมกันใน Dashboard

---

## Complete Page Structure

### Public Pages
```
/ # Landing page
/about # About
/help # Help/Docs
```

### Authentication
```
/login # Login
/register # Register (Student/Teacher)
/forgot-password # Reset password
```

### Student Pages

#### Self-Learning (Progressive)
```
/learn # Learning Path (7 levels)
/levels/[levelId] # Level page
/levels/[levelId]/practice # Practice mode
/levels/[levelId]/quiz # Quiz mode
/levels/[levelId]/results/[attemptId] # Results
```

#### Course Mode (LMS)
```
/courses # My courses (enrolled)
/courses/[courseId] # Course detail
 Overview # Course info, progress
 Assignments # Assigned levels/quizzes
 Announcements # Teacher announcements
 Classmates # Other students
```

#### Dashboard & Profile
```
/dashboard # Combined dashboard
 Self-Learning stats
 Course progress
 Overall statistics
 Badges & achievements
/profile # Profile settings
```

### Teacher Pages

#### Course Management
```
/teacher/courses # All courses
/teacher/courses/new # Create course
/teacher/courses/[courseId] # Course management
 Overview # Course info
 Students # Student management
 Assignments # Assign levels
 Analytics # Course analytics
 Settings # Course settings
```

#### Student Analytics
```
/teacher/students # All students
/teacher/students/[studentId] # Student detail
 Overall progress
 Course progress
 Quiz history
 Performance charts
```

#### Google Classroom
```
/teacher/google-classroom # Classroom integration
 Connect classrooms
 Import students
 Sync settings
 Sync grades
```

#### Analytics
```
/teacher/analytics # Comprehensive analytics
 Course performance
 Student engagement
 Quiz statistics
 Export reports
```

---

## How It Works Together

### Scenario 1: Student Self-Learning
```
1. Student registers → /register
2. Goes to /learn (Learning Path)
3. Starts Level 1 → Practices & Takes Quiz
4. Passes → Unlocks Level 2
5. Continues through all 7 levels
6. All progress tracked in /dashboard
```

### Scenario 2: Teacher Creates Course
```
1. Teacher registers (Role: TEACHER)
2. Goes to /teacher/courses/new
3. Creates course: "Resistor Reading 101"
4. Assigns Levels 1-3 as assignments
5. Sets due dates
6. Invites students (or imports from Google Classroom)
7. Students see course in /courses
```

### Scenario 3: Student in Course
```
1. Student enrolls in course → /courses/[courseId]
2. Sees assigned levels (Level 1-3)
3. Completes Level 1 → Progress tracked
4. Teacher sees progress → /teacher/courses/[courseId]/analytics
5. Grades sync to Google Classroom (if connected)
```

### Scenario 4: Mixed Mode
```
1. Student does self-learning (Level 1-7)
2. Also enrolls in teacher's course (assigned Level 1-3)
3. Progress from both modes combined in /dashboard
4. Teacher sees only course-assigned progress
```

---

## Integrated Features

### 1. Progressive Learning + LMS

#### Levels Can Be:
- **Self-Learning**: User does on their own
- **Course Assignment**: Teacher assigns to course
- **Both**: Can do both ways

#### Progress Tracking:
- Self-Learning progress: Tracked separately
- Course progress: Tracked per course
- Combined view: Shown in dashboard

### 2. Google Classroom Integration

#### For Teacher:
- **Connect Classroom**: Link Google Classroom account
- **Import Students**: Import students from Classroom
- **Assign to Course**: Assign levels as Classroom assignments
- **Sync Grades**: Quiz scores sync to Classroom Gradebook
- **Auto-sync**: Automatic grade sync

#### For Student:
- **Link Account**: Connect Google Classroom account (optional)
- **See Synced Data**: View if teacher synced their course
- **Grades in Classroom**: See grades in Google Classroom

### 3. Course Management

#### Teacher Creates Course:
- Course name, description
- Assign levels (Level 1-3, etc.)
- Set due dates
- Add students:
 - Manual invite (email)
 - Import from Google Classroom
 - Share invite code

#### Student Views Course:
- Course overview
- Assigned levels (with due dates)
- Progress tracking
- Announcements from teacher
- Classmates list

---

## Database Schema (Integrated)

```prisma
// ============================================
// Progressive Learning
// ============================================

model Level {
 id String @id @default(cuid())
 number Int @unique // 1-7
 name String
 description String
 difficulty Int // 1-5
 questionCount Int @default(10) // Number of questions per quiz
 timeLimit Int? // minutes
 passScore Int @default(80)
 requiresLevel Int? // null = unlocked from start
 type QuestionType @default(FOUR_BAND) // 4-band or 5-band for this level

 // Questions are generated dynamically, not stored in database
 attempts LevelAttempt[]
 assignments CourseAssignment[] // Can be assigned in courses
}

model LevelAttempt {
 id String @id @default(cuid())
 userId String @map("user_id")
 levelId String @map("level_id")
 courseId String? @map("course_id") // null = self-learning
 mode AttemptMode
 score Int?
 percentage Float?
 timeTaken Int?
 completedAt DateTime @default(now()) @map("completed_at")
 passed Boolean?
 
 // Store generated questions and answers for this attempt
 questions Json // Array of generated questions: [{ bands: [...], correctAnswer: "...", userAnswer: "..." }]
 
 user User @relation(fields: [userId], references: [id])
 level Level @relation(fields: [levelId], references: [id])
 course Course? @relation(fields: [courseId], references: [id])
}

// ============================================
// LMS (Course Management)
// ============================================

model Course {
 id String @id @default(cuid())
 name String
 description String? @db.Text
 code String @unique
 teacherId String @map("teacher_id")
 image String?
 startDate DateTime @map("start_date")
 endDate DateTime? @map("end_date")
 isPublished Boolean @default(false) @map("is_published")
 googleClassroomId String? @unique @map("google_classroom_id")
 createdAt DateTime @default(now()) @map("created_at")
 updatedAt DateTime @updatedAt @map("updated_at")

 teacher User @relation(fields: [teacherId], references: [id])
 enrollments Enrollment[]
 assignments CourseAssignment[]
 announcements Announcement[]
}

model Enrollment {
 id String @id @default(cuid())
 userId String @map("user_id")
 courseId String @map("course_id")
 enrolledAt DateTime @default(now()) @map("enrolled_at")
 progress Int @default(0) // 0-100

 user User @relation(fields: [userId], references: [id])
 course Course @relation(fields: [courseId], references: [id])

 @@unique([userId, courseId])
}

model CourseAssignment {
 id String @id @default(cuid())
 courseId String @map("course_id")
 levelId String @map("level_id")
 title String
 description String? @db.Text
 dueDate DateTime? @map("due_date")
 maxPoints Int @default(100) @map("max_points")
 order Int @default(0)
 createdAt DateTime @default(now()) @map("created_at")

 course Course @relation(fields: [courseId], references: [id])
 level Level @relation(fields: [levelId], references: [id])

 @@index([courseId])
 @@index([levelId])
}

model Announcement {
 id String @id @default(cuid())
 courseId String @map("course_id")
 title String
 content String @db.Text
 createdAt DateTime @default(now()) @map("created_at")
 updatedAt DateTime @updatedAt @map("updated_at")

 course Course @relation(fields: [courseId], references: [id])

 @@index([courseId])
}

// ============================================
// Google Classroom Integration
// ============================================

model GoogleClassroomSync {
 id String @id @default(cuid())
 userId String @map("user_id") // Teacher
 courseId String @unique @map("course_id")
 classroomId String @map("classroom_id")
 classroomName String @map("classroom_name")
 lastSyncAt DateTime @default(now()) @map("last_sync_at")
 syncEnabled Boolean @default(true) @map("sync_enabled")
 autoSyncGrades Boolean @default(true) @map("auto_sync_grades")

 course Course @relation(fields: [courseId], references: [id])

 @@index([userId])
}

model ClassroomStudent {
 id String @id @default(cuid())
 userId String @map("user_id")
 classroomId String @map("classroom_id")
 importedAt DateTime @default(now()) @map("imported_at")

 user User @relation(fields: [userId], references: [id])

 @@unique([userId, classroomId])
}

// ============================================
// User & Progress
// ============================================

model User {
 id String @id @default(cuid())
 email String @unique
 name String?
 role UserRole @default(STUDENT)
 studentId String? @map("student_id")
 googleClassroomEmail String? @map("google_classroom_email")

 // Progress (Self-Learning)
 currentLevel Int? @default(1) @map("current_level")
 levelsUnlocked Int[] @default([]) @map("levels_unlocked")

 // Relations
 accounts Account[]
 sessions Session[]
 enrollments Enrollment[]
 levelAttempts LevelAttempt[]
 createdCourses Course[] @relation("CourseCreator")
}

enum UserRole {
 STUDENT
 TEACHER
 ADMIN
}

enum QuestionType {
 FOUR_BAND
 FIVE_BAND
}

enum AttemptMode {
 PRACTICE
 QUIZ
}
```

---

## Feature Priority

### Milestone 1: Foundation Setup (Week 1)
- [ ] Project setup
- [ ] Database schema
- [ ] Authentication
- [ ] Basic navigation

### Milestone 2: Resistor System + Learning Path (Week 2)
- [ ] Resistor color system
- [ ] Resistance calculator
- [ ] Random resistor generator
- [ ] ResistorViewer component
- [ ] Learning Path page
- [ ] Unlock system

### Milestone 3: Practice & Quiz Modes (Week 3)
- [ ] Practice mode (unlimited)
- [ ] Quiz mode (timed)
- [ ] Score calculation
- [ ] Pass/fail logic

### Milestone 4: Results & Dashboard (Week 4)
- [ ] Results page
- [ ] Dashboard
- [ ] Progress tracking
- [ ] MVP Complete

### Milestone 5: LMS Foundation (Week 5)
- [ ] Course creation (Teacher)
- [ ] Student enrollment
- [ ] Course assignments (assign levels)
- [ ] Student progress in course

### Milestone 6: Integration & Polish (Week 6)
- [ ] System integration
- [ ] UI/UX improvements
- [ ] Combined dashboard
- [ ] End-to-end testing

### Milestone 7: Google Classroom Integration (Week 7)
- [ ] Connect Google Classroom
- [ ] Import students
- [ ] Sync assignments
- [ ] Sync grades
- [ ] Auto-sync

### Milestone 8: Final Polish & Deploy (Week 8)
- [ ] Badges & achievements (basic)
- [ ] Advanced analytics
- [ ] Announcements
- [ ] Mobile responsive
- [ ] Performance optimization
- [ ] Deploy to production

---

## User Flows (Integrated)

### Flow 1: Student Self-Learning
```
1. Student registers
2. Goes to /learn (Learning Path)
3. Starts Level 1 → Practice → Quiz
4. Passes → Unlocks Level 2
5. Continues through all levels
6. Dashboard shows all progress
```

### Flow 2: Teacher Creates Course
```
1. Teacher registers (Role: TEACHER)
2. Goes to /teacher/courses/new
3. Creates course: "Resistor Basics"
4. Assigns Level 1-3 with due dates
5. Invites students (email or Google Classroom)
6. Students see course in /courses
```

### Flow 3: Student Enrolls in Course
```
1. Student receives invite → /courses/[courseId]
2. Enrolls in course
3. Sees assigned levels (Level 1-3)
4. Completes Level 1 → Progress tracked
5. Teacher sees progress in /teacher/courses/[courseId]/analytics
6. If Google Classroom linked → Grades sync automatically
```

### Flow 4: Teacher Imports from Google Classroom
```
1. Teacher goes to /teacher/google-classroom
2. Connects Google Classroom account
3. Selects classroom → Imports students
4. Creates course → Links to Classroom
5. Assigns levels → Syncs to Classroom as assignments
6. Students complete → Grades sync back to Classroom
```

---

## Dashboard Structure

### Student Dashboard (`/dashboard`)

**Sections:**
1. **Self-Learning Progress**
 - Current level
 - Levels completed
 - Overall progress (0-100%)
 - Best scores per level

2. **Course Progress**
 - Enrolled courses
 - Course completion
 - Assigned levels completed
 - Upcoming assignments

3. **Overall Statistics**
 - Total questions answered
 - Correct/Incorrect ratio
 - Average score
 - Time spent

4. **Recent Activity**
 - Recent quiz completions
 - Recent course activities
 - Achievements unlocked

5. **Badges & Achievements**
 - Level completion badges
 - Course completion badges
 - Performance badges

### Teacher Dashboard (`/teacher/dashboard`)

**Sections:**
1. **Course Overview**
 - Total courses
 - Total students
 - Active courses

2. **Student Analytics**
 - Student performance
 - Course completion rates
 - Engagement metrics

3. **Recent Activity**
 - New enrollments
 - Quiz submissions
 - Course updates

4. **Google Classroom Sync**
 - Connected classrooms
 - Last sync status
 - Sync errors (if any)

---

## Page Components

### Student Pages Components:

#### Learning Path (`/learn`)
- `LearningPath.tsx` - Main component
- `LevelCard.tsx` - Each level card
- `ProgressIndicator.tsx` - Progress bars

#### Course Pages (`/courses`)
- `CourseCard.tsx` - Course display
- `AssignmentList.tsx` - Assigned levels
- `ProgressOverview.tsx` - Course progress

#### Dashboard (`/dashboard`)
- `ProgressOverview.tsx` - Overall progress
- `CourseProgress.tsx` - Course progress section
- `StatsCards.tsx` - Statistics
- `ActivityFeed.tsx` - Recent activity

### Teacher Pages Components:

#### Course Management (`/teacher/courses`)
- `CourseTable.tsx` - Course list
- `CreateCourseForm.tsx` - Create course
- `StudentManagement.tsx` - Manage students
- `AssignmentManager.tsx` - Assign levels
- `CourseAnalytics.tsx` - Analytics charts

#### Google Classroom (`/teacher/google-classroom`)
- `ClassroomConnect.tsx` - Connect button
- `ClassroomList.tsx` - Connected classrooms
- `ImportStudents.tsx` - Import students
- `SyncSettings.tsx` - Sync configuration

---

## Permissions & Access

### Student Permissions:
- Access self-learning mode
- Enroll in courses
- Take quizzes (assigned or self-learning)
- View own progress
- View own dashboard

### Teacher Permissions:
- All student permissions
- Create courses
- Assign levels to courses
- View all student progress (in courses)
- Import from Google Classroom
- Sync grades to Classroom
- Access analytics

---

## Progress Tracking (Dual Mode)

### Self-Learning Progress:
- Tracked per level
- Best score per level
- Levels unlocked
- Time spent
- Questions answered

### Course Progress:
- Tracked per course
- Assigned levels completed
- Course completion %
- Time spent per course
- Due dates met

### Combined View:
- Overall progress (both modes)
- Total levels completed
- Average scores
- Combined statistics

---
## Summary

### Core Systems:
1. **Progressive Learning** - 7 levels, unlock system
2. **LMS** - Course management, student tracking
3. **Google Classroom** - Full integration

### Both Systems Work Together:
- Students can learn independently
- Teachers can create courses
- Assign levels as course assignments
- Progress tracked in both modes
- Google Classroom sync for grades

### Main Pages:
- `/learn` - Learning Path (Self-Learning)
- `/courses` - Course Mode
- `/dashboard` - Combined progress
- `/teacher/*` - Teacher management


