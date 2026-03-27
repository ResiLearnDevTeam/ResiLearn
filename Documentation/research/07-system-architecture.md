# แผนผังการทำงาน/หลักการทำงาน/ผังงานของโปรเจ็ค

## บทนำ

เอกสารนี้อธิบายแผนผังการทำงาน หลักการทำงาน และผังงานของระบบ ResiLearn ครอบคลุม System Architecture, Data Flow, User Flow, Database Schema, Component Architecture, API Structure, และ Flow ต่างๆ

## 1. System Architecture Overview

### 1.1 สถาปัตยกรรมระบบโดยรวม

```mermaid
graph TB
    subgraph Client["Client Layer"]
        Browser["Web Browser"]
        Mobile["Mobile Browser"]
    end
    
    subgraph Server["Server Layer"]
        NextJS["Next.js Application"]
        API["API Routes"]
        Auth["NextAuth.js"]
    end
    
    subgraph Database["Database Layer"]
        PostgreSQL["PostgreSQL"]
        Prisma["Prisma ORM"]
    end
    
    subgraph External["External Services"]
        Google["Google Classroom API"]
        OAuth["OAuth 2.0"]
    end
    
    Browser --> NextJS
    Mobile --> NextJS
    NextJS --> API
    NextJS --> Auth
    API --> Prisma
    Auth --> Prisma
    Prisma --> PostgreSQL
    Auth --> OAuth
    API --> Google
    OAuth --> Google
```

### 1.2 Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL 15
- **ORM**: Prisma
- **Authentication**: NextAuth.js v5
- **3D Rendering**: Three.js, React Three Fiber
- **Charts**: Recharts
- **State Management**: Zustand, React Query

## 2. Database Schema

### 2.1 Entity Relationship Diagram

```mermaid
erDiagram
    User ||--o{ LevelAttempt : "has"
    User ||--o{ PracticeSession : "has"
    User ||--o{ PracticePreset : "creates"
    User ||--o{ Course : "creates"
    User ||--o{ Enrollment : "enrolls"
    User ||--o{ LessonProgress : "tracks"
    User ||--o{ ModuleProgress : "tracks"
    
    Level ||--o{ LevelAttempt : "has"
    Level ||--o{ CourseAssignment : "assigned_in"
    
    Course ||--o{ Enrollment : "has"
    Course ||--o{ CourseAssignment : "has"
    Course ||--o{ Announcement : "has"
    Course ||--o{ LevelAttempt : "tracks"
    Course ||--|| GoogleClassroomSync : "syncs_with"
    
    Module ||--o{ Lesson : "contains"
    Module ||--o{ ModuleProgress : "tracks"
    
    Lesson ||--o{ LessonProgress : "tracks"
    Lesson ||--o{ LessonHeroStat : "has"
    Lesson ||--o{ LessonObjective : "has"
    Lesson ||--o{ LessonSection : "has"
    Lesson ||--o{ LessonQuizQuestion : "has"
    Lesson ||--|| LessonPracticeLink : "links_to"
    Lesson ||--o{ LessonResource : "has"
    
    PracticePreset ||--o{ PracticeSession : "uses"
    
    User {
        string id PK
        string email UK
        string name
        string role
        int currentLevel
        int[] levelsUnlocked
    }
    
    Level {
        string id PK
        int number UK
        string name
        string description
        int difficulty
        int questionCount
        int timeLimit
        int passScore
        int requiresLevel
    }
    
    LevelAttempt {
        string id PK
        string userId FK
        string levelId FK
        string courseId FK
        enum mode
        int score
        float percentage
        int timeTaken
        json questions
    }
    
    PracticeSession {
        string id PK
        string userId FK
        string presetId FK
        int totalQuestions
        int correctAnswers
        int incorrectAnswers
        float accuracy
        json settings
        json questions
    }
    
    Course {
        string id PK
        string name
        string code UK
        string teacherId FK
        string googleClassroomId UK
    }
    
    Module {
        string id PK
        string title
        string description
        int order
    }
    
    Lesson {
        string id PK
        string moduleId FK
        string title
        string content
        int order
    }
```

### 2.2 ตารางหลัก

#### 2.2.1 User และ Authentication
- `User`: ข้อมูลผู้ใช้
- `Account`: บัญชี OAuth
- `Session`: Session สำหรับ NextAuth

#### 2.2.2 Progressive Learning
- `Level`: ข้อมูล Level (1-7)
- `LevelAttempt`: ประวัติการทำ Quiz/Practice

#### 2.2.3 Practice System
- `PracticePreset`: การตั้งค่าการฝึกฝน
- `PracticeSession`: ประวัติการฝึกฝน

#### 2.2.4 LMS
- `Course`: ข้อมูลคอร์ส
- `Enrollment`: การลงทะเบียนเรียน
- `CourseAssignment`: การมอบหมายงาน
- `Announcement`: ประกาศ

#### 2.2.5 Learning Path
- `Module`: โมดูล
- `Lesson`: บทเรียน
- `LessonProgress`: ความคืบหน้าในบทเรียน
- `ModuleProgress`: ความคืบหน้าในโมดูล

#### 2.2.6 Google Classroom
- `GoogleClassroomSync`: การ sync กับ Classroom
- `ClassroomStudent`: นักเรียนจาก Classroom

## 3. User Flow Diagrams

### 3.1 Student Self-Learning Flow

```mermaid
flowchart TD
    Start([เริ่มต้น]) --> Register[ลงทะเบียน/Login]
    Register --> Dashboard[Dashboard]
    Dashboard --> LearningPath[Learning Path]
    LearningPath --> CheckLevel{Level Unlocked?}
    CheckLevel -->|Yes| LevelPage[Level Page]
    CheckLevel -->|No| ShowLocked[แสดง Locked]
    LevelPage --> ChooseMode{เลือกโหมด}
    ChooseMode -->|Practice| PracticeMode[Practice Mode]
    ChooseMode -->|Quiz| QuizMode[Quiz Mode]
    PracticeMode --> PracticeQuestion[ทำข้อสอบ]
    PracticeQuestion --> ShowAnswer[แสดงคำตอบ]
    ShowAnswer --> MorePractice{ฝึกต่อ?}
    MorePractice -->|Yes| PracticeQuestion
    MorePractice -->|No| LevelPage
    QuizMode --> QuizQuestion[ทำข้อสอบ]
    QuizQuestion --> SubmitQuiz[Submit Quiz]
    SubmitQuiz --> Results[Results Page]
    Results --> CheckPass{ผ่าน 80%?}
    CheckPass -->|Yes| UnlockNext[Unlock Level ถัดไป]
    CheckPass -->|No| Retry[Retry Quiz]
    UnlockNext --> LearningPath
    Retry --> QuizMode
    ShowLocked --> LearningPath
```

### 3.2 Teacher Course Management Flow

```mermaid
flowchart TD
    Start([เริ่มต้น]) --> Login[Login as Teacher]
    Login --> TeacherDashboard[Teacher Dashboard]
    TeacherDashboard --> CreateCourse[สร้างคอร์ส]
    CreateCourse --> ConnectClassroom{เชื่อมต่อ Classroom?}
    ConnectClassroom -->|Yes| ImportStudents[Import นักเรียน]
    ConnectClassroom -->|No| AddStudents[เพิ่มนักเรียนด้วยตนเอง]
    ImportStudents --> AssignLevels[มอบหมาย Level]
    AddStudents --> AssignLevels
    AssignLevels --> SetDueDate[กำหนด Due Date]
    SetDueDate --> PublishCourse[Publish คอร์ส]
    PublishCourse --> MonitorProgress[ติดตามความคืบหน้า]
    MonitorProgress --> ViewAnalytics[ดู Analytics]
    ViewAnalytics --> SyncGrades{Sync กับ Classroom?}
    SyncGrades -->|Yes| AutoSync[Auto Sync Grades]
    SyncGrades -->|No| ManualSync[Manual Sync]
    AutoSync --> MonitorProgress
    ManualSync --> MonitorProgress
```

### 3.3 Student Course Flow

```mermaid
flowchart TD
    Start([เริ่มต้น]) --> Login[Login]
    Login --> Dashboard[Dashboard]
    Dashboard --> MyCourses[My Courses]
    MyCourses --> SelectCourse[เลือกคอร์ส]
    SelectCourse --> CourseDetail[Course Detail]
    CourseDetail --> ViewAssignments[ดู Assignments]
    ViewAssignments --> SelectAssignment[เลือก Assignment]
    SelectAssignment --> CheckDueDate{ยังไม่เลย Due Date?}
    CheckDueDate -->|Yes| StartQuiz[เริ่มทำ Quiz]
    CheckDueDate -->|No| ShowOverdue[แสดง Overdue]
    StartQuiz --> DoQuiz[ทำ Quiz]
    DoQuiz --> SubmitQuiz[Submit Quiz]
    SubmitQuiz --> ViewResults[ดู Results]
    ViewResults --> UpdateProgress[อัปเดต Progress]
    UpdateProgress --> CourseDetail
    ShowOverdue --> CourseDetail
```

## 4. Data Flow Diagrams

### 4.1 Practice Session Data Flow

```mermaid
flowchart LR
    User[User] --> StartPractice[เริ่ม Practice]
    StartPractice --> GenerateQuestion[Generate Question]
    GenerateQuestion --> ResistorUtils[Resistor Utils]
    ResistorUtils --> QuestionData[Question Data]
    QuestionData --> DisplayQuestion[แสดงคำถาม]
    DisplayQuestion --> UserAnswer[User ตอบ]
    UserAnswer --> CheckAnswer[Check Answer]
    CheckAnswer --> ResistorUtils
    ResistorUtils --> Result[Result]
    Result --> SaveHistory[บันทึก History]
    SaveHistory --> CalculateAnalytics[คำนวณ Analytics]
    CalculateAnalytics --> AnalyticsUtils[Analytics Utils]
    AnalyticsUtils --> DeepAnalytics[Deep Analytics]
    DeepAnalytics --> SaveSession[บันทึก Session]
    SaveSession --> Database[(Database)]
```

### 4.2 Analytics Processing Flow

```mermaid
flowchart TD
    Start([Practice Session Complete]) --> GetHistory[ดึง Question History]
    GetHistory --> CalculateDeepAnalytics[คำนวณ Deep Analytics]
    CalculateDeepAnalytics --> AnalyzePositions[วิเคราะห์ตามตำแหน่ง]
    CalculateDeepAnalytics --> AnalyzeColors[วิเคราะห์ความสับสนของสี]
    CalculateDeepAnalytics --> AnalyzeTypes[วิเคราะห์ตามประเภท]
    CalculateDeepAnalytics --> AnalyzeValues[วิเคราะห์ตามค่า]
    AnalyzePositions --> PositionErrors[Position Errors]
    AnalyzeColors --> ColorConfusion[Color Confusion Matrix]
    AnalyzeTypes --> TypeErrors[Type Errors]
    AnalyzeValues --> ValueErrors[Value Errors]
    PositionErrors --> Aggregate[รวมผล]
    ColorConfusion --> Aggregate
    TypeErrors --> Aggregate
    ValueErrors --> Aggregate
    Aggregate --> DeepAnalytics[Deep Analytics Object]
    DeepAnalytics --> SaveToDB[บันทึกใน Database]
    SaveToDB --> DisplayCharts[แสดง Charts]
```

### 4.3 Google Classroom Sync Flow

```mermaid
sequenceDiagram
    participant Teacher
    participant ResiLearn
    participant GoogleAPI
    participant Classroom
    
    Teacher->>ResiLearn: Connect Google Classroom
    ResiLearn->>GoogleAPI: OAuth 2.0 Authentication
    GoogleAPI-->>ResiLearn: Access Token
    ResiLearn->>GoogleAPI: Get Classrooms
    GoogleAPI-->>ResiLearn: List of Classrooms
    Teacher->>ResiLearn: Select Classroom
    ResiLearn->>GoogleAPI: Get Students
    GoogleAPI-->>ResiLearn: List of Students
    ResiLearn->>ResiLearn: Import Students
    Teacher->>ResiLearn: Create Course & Assign Levels
    ResiLearn->>GoogleAPI: Create Assignment
    GoogleAPI-->>Classroom: Assignment Created
    Student->>ResiLearn: Complete Quiz
    ResiLearn->>ResiLearn: Calculate Grade
    ResiLearn->>GoogleAPI: Sync Grade
    GoogleAPI-->>Classroom: Grade Updated
```

## 5. Component Architecture

### 5.1 Frontend Component Structure

```mermaid
graph TD
    App[App Layout] --> Navbar[Navbar]
    App --> Sidebar[Sidebar]
    App --> MainContent[Main Content]
    
    MainContent --> LearningPath[Learning Path Page]
    MainContent --> LevelPage[Level Page]
    MainContent --> PracticePage[Practice Page]
    MainContent --> QuizPage[Quiz Page]
    MainContent --> DashboardPage[Dashboard Page]
    MainContent --> CoursePage[Course Page]
    
    LearningPath --> LevelCard[Level Card]
    LevelPage --> ModeSelector[Mode Selector]
    PracticePage --> ResistorDisplay[Resistor Display]
    PracticePage --> QuestionCard[Question Card]
    PracticePage --> AnswerOptions[Answer Options]
    
    QuizPage --> ResistorDisplay
    QuizPage --> QuestionCard
    QuizPage --> QuizTimer[Quiz Timer]
    QuizPage --> SubmitButton[Submit Button]
    
    DashboardPage --> StatsOverview[Stats Overview]
    DashboardPage --> ActivityChart[Activity Chart]
    DashboardPage --> DeepAnalytics[Deep Analytics]
    DashboardPage --> RecentActivity[Recent Activity]
    
    DeepAnalytics --> RadarChart[Radar Chart]
    DeepAnalytics --> BarChart[Bar Chart]
    DeepAnalytics --> Heatmap[Heatmap]
    DeepAnalytics --> PieChart[Pie Chart]
    
    ResistorDisplay --> Resistor3D[Resistor 3D Model]
    ResistorDisplay --> ColorBands[Color Bands]
```

### 5.2 Component Hierarchy

```
App
├── Layout
│   ├── Navbar
│   ├── Sidebar
│   └── Main Content
├── Pages
│   ├── Learning Path
│   │   └── LevelCard[]
│   ├── Level Page
│   │   ├── LevelHeader
│   │   ├── LevelStats
│   │   └── ModeSelector
│   ├── Practice/Quiz Page
│   │   ├── ResistorDisplay
│   │   ├── QuestionCard
│   │   ├── AnswerOptions
│   │   └── QuizTimer (Quiz only)
│   ├── Dashboard
│   │   ├── StatsOverview
│   │   ├── ActivityChart
│   │   ├── DeepAnalytics
│   │   └── RecentActivity
│   └── Course Page
│       ├── CourseHeader
│       ├── AssignmentList
│       └── ProgressOverview
└── Components
    ├── Features
    │   ├── ResistorDisplay
    │   ├── ColorBandSelector
    │   └── Resistor3DModel
    ├── Analytics
    │   ├── DeepAnalyticsRadarChart
    │   ├── ErrorRateBarChart
    │   ├── ColorConfusionHeatmap
    │   └── ...
    └── Dashboard
        ├── StatsOverview
        ├── ActivityChart
        └── RecentActivityList
```

## 6. API Structure

### 6.1 API Endpoints

```mermaid
graph LR
    API[API Routes] --> AuthAPI[Auth API]
    API --> LevelsAPI[Levels API]
    API --> PracticeAPI[Practice API]
    API --> AnalyticsAPI[Analytics API]
    API --> CourseAPI[Course API]
    API --> ClassroomAPI[Classroom API]
    
    AuthAPI --> Login[POST /api/auth/login]
    AuthAPI --> Register[POST /api/auth/register]
    AuthAPI --> Session[GET /api/auth/session]
    
    LevelsAPI --> GetLevels[GET /api/levels]
    LevelsAPI --> GetLevel[GET /api/levels/[id]]
    LevelsAPI --> CreateAttempt[POST /api/attempts]
    
    PracticeAPI --> GetSessions[GET /api/practice-sessions]
    PracticeAPI --> CreateSession[POST /api/practice-sessions]
    PracticeAPI --> GetPresets[GET /api/practice-presets]
    
    AnalyticsAPI --> GetAnalytics[GET /api/analytics/practice]
    AnalyticsAPI --> GetSessionAnalytics[GET /api/analytics/session/[id]]
    
    CourseAPI --> GetCourses[GET /api/courses]
    CourseAPI --> CreateCourse[POST /api/courses]
    CourseAPI --> Enroll[POST /api/courses/[id]/enroll]
    
    ClassroomAPI --> Connect[POST /api/classroom/connect]
    ClassroomAPI --> Import[POST /api/classroom/import]
    ClassroomAPI --> Sync[POST /api/classroom/sync]
```

### 6.2 API Request/Response Flow

```mermaid
sequenceDiagram
    participant Client
    participant NextJS
    participant API
    participant Prisma
    participant Database
    
    Client->>NextJS: HTTP Request
    NextJS->>NextJS: Middleware (Auth Check)
    NextJS->>API: Route Handler
    API->>Prisma: Database Query
    Prisma->>Database: SQL Query
    Database-->>Prisma: Result
    Prisma-->>API: Data
    API->>API: Process Data
    API-->>NextJS: Response
    NextJS-->>Client: JSON Response
```

## 7. Authentication Flow

### 7.1 NextAuth.js Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant NextAuth
    participant Provider
    participant Database
    
    User->>Browser: Access Protected Route
    Browser->>NextAuth: Check Session
    NextAuth->>Database: Get Session
    alt Session Valid
        Database-->>NextAuth: Session Data
        NextAuth-->>Browser: Allow Access
    else Session Invalid/Expired
        Database-->>NextAuth: No Session
        NextAuth-->>Browser: Redirect to Login
        User->>Browser: Enter Credentials
        Browser->>NextAuth: Login Request
        NextAuth->>Provider: Verify Credentials
        Provider-->>NextAuth: User Data
        NextAuth->>Database: Create Session
        Database-->>NextAuth: Session Created
        NextAuth-->>Browser: Set Cookie & Redirect
    end
```

### 7.2 OAuth Flow (Google)

```mermaid
sequenceDiagram
    participant User
    participant ResiLearn
    participant Google
    participant Database
    
    User->>ResiLearn: Click "Login with Google"
    ResiLearn->>Google: OAuth Request
    Google->>User: Show Consent Screen
    User->>Google: Grant Permission
    Google->>ResiLearn: Authorization Code
    ResiLearn->>Google: Exchange Code for Token
    Google-->>ResiLearn: Access Token & User Info
    ResiLearn->>Database: Check/Create User
    Database-->>ResiLearn: User Data
    ResiLearn->>Database: Create Session
    Database-->>ResiLearn: Session Created
    ResiLearn->>User: Redirect to Dashboard
```

## 8. Progressive Learning Flow

### 8.1 Level Unlock Flow

```mermaid
flowchart TD
    Start([User ทำ Quiz]) --> SubmitQuiz[Submit Quiz]
    SubmitQuiz --> CalculateScore[คำนวณคะแนน]
    CalculateScore --> CheckScore{คะแนน >= 80%?}
    CheckScore -->|Yes| CheckComplete{ทำครบทุกข้อ?}
    CheckScore -->|No| ShowFail[แสดง Fail]
    CheckComplete -->|Yes| UnlockNext[Unlock Level ถัดไป]
    CheckComplete -->|No| ShowFail
    UnlockNext --> UpdateUser[อัปเดต levelsUnlocked]
    UpdateUser --> SaveAttempt[บันทึก Attempt]
    SaveAttempt --> ShowSuccess[แสดง Success]
    ShowFail --> AllowRetry[อนุญาตให้ Retry]
    ShowSuccess --> LearningPath[กลับไป Learning Path]
    AllowRetry --> Start
```

### 8.2 Question Generation Flow

```mermaid
flowchart LR
    Start([เริ่ม Quiz/Practice]) --> GetLevel[ดึงข้อมูล Level]
    GetLevel --> DetermineType{ประเภทตัวต้านทาน?}
    DetermineType -->|4-band| Generate4Band[Generate 4-band]
    DetermineType -->|5-band| Generate5Band[Generate 5-band]
    Generate4Band --> ResistorUtils[Resistor Utils]
    Generate5Band --> ResistorUtils
    ResistorUtils --> CalculateValue[คำนวณค่า]
    CalculateValue --> GenerateOptions[Generate Options]
    GenerateOptions --> GenerateExplanation[Generate Explanation]
    GenerateExplanation --> QuestionData[Question Data]
    QuestionData --> DisplayQuestion[แสดงคำถาม]
```

## 9. Analytics Processing Flow

### 9.1 Deep Analytics Calculation

```mermaid
flowchart TD
    Start([Session Complete]) --> GetQuestions[ดึง Question History]
    GetQuestions --> InitializeStructures[Initialize Analytics Structures]
    InitializeStructures --> LoopQuestions[Loop through Questions]
    LoopQuestions --> AnalyzeQuestion[วิเคราะห์แต่ละ Question]
    AnalyzeQuestion --> CheckResistorType{ประเภทตัวต้านทาน?}
    CheckResistorType -->|4-band| Analyze4Band[วิเคราะห์ 4-band]
    CheckResistorType -->|5-band| Analyze5Band[วิเคราะห์ 5-band]
    Analyze4Band --> AnalyzePositions[วิเคราะห์ตำแหน่ง]
    Analyze5Band --> AnalyzePositions
    AnalyzePositions --> AnalyzeColors[วิเคราะห์สี]
    AnalyzeColors --> AnalyzeTypes[วิเคราะห์ประเภท]
    AnalyzeTypes --> AnalyzeValues[วิเคราะห์ค่า]
    AnalyzeValues --> NextQuestion{มี Question ต่อไป?}
    NextQuestion -->|Yes| LoopQuestions
    NextQuestion -->|No| CalculateRates[คำนวณ Error Rates]
    CalculateRates --> AggregateData[รวมข้อมูล]
    AggregateData --> FormatCharts[Format สำหรับ Charts]
    FormatCharts --> SaveAnalytics[บันทึก Analytics]
    SaveAnalytics --> End([เสร็จสิ้น])
```

## 10. File Structure

### 10.1 Project Directory Structure

```
ResiLearn/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth routes
│   │   ├── login/
│   │   └── register/
│   ├── api/                      # API Routes
│   │   ├── auth/
│   │   ├── levels/
│   │   ├── practice-sessions/
│   │   ├── analytics/
│   │   └── courses/
│   ├── learn/                    # Learning routes
│   │   └── self/
│   │       ├── dashboard/
│   │       ├── learningpath/
│   │       ├── levels/
│   │       └── practice/
│   └── page.tsx                  # Landing page
├── components/                   # React Components
│   ├── analytics/                # Analytics components
│   ├── dashboard/                # Dashboard components
│   ├── features/                 # Feature components
│   └── layout/                   # Layout components
├── lib/                          # Utility libraries
│   ├── analyticsUtils.ts         # Analytics calculations
│   ├── resistorUtils.ts          # Resistor calculations
│   ├── auth.ts                   # Authentication
│   └── db.ts                     # Database connection
├── prisma/                       # Prisma schema
│   ├── schema.prisma
│   └── seed.ts
└── public/                       # Static files
```

## 11. สรุป

ระบบ ResiLearn มีสถาปัตยกรรมที่ประกอบด้วย:

1. **Client-Server Architecture**: Next.js เป็น Full-stack Framework
2. **Database Layer**: PostgreSQL กับ Prisma ORM
3. **Authentication**: NextAuth.js กับ OAuth 2.0
4. **Component-based UI**: React Components ที่แยกส่วนชัดเจน
5. **API Routes**: RESTful API สำหรับการสื่อสาร
6. **External Integration**: Google Classroom API

ระบบนี้รองรับ:
- Progressive Learning (7 Levels)
- Deep Analytics
- Dual Mode (Self-Learning + Course)
- Google Classroom Integration
- Real-time Updates
- Scalable Architecture

สถาปัตยกรรมนี้ทำให้ระบบมีความยืดหยุ่น รองรับการขยายตัว และง่ายต่อการดูแลรักษา

