# Implementation Plan - ResiLearn Project

## Project Overview

### Core Focus:
1. **Progressive Learning System** - 7 levels (easy → hard)
2. **Resistor Quiz/Practice** - Interactive resistor display
3. **Unlock System** - Must pass level to unlock next
4. **Progress Tracking** - Comprehensive statistics
5. **LMS Integration** - Course management, student tracking
6. **Google Classroom** - Full integration

**Timeline:** (8 สัปดาห์)

---

## Project Structure

```
resilearn/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth route group
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   │
│   ├── learn/                    # Learning Path (Main)
│   │   └── page.tsx
│   │
│   ├── levels/                   # Level pages
│   │   └── [levelId]/
│   │       ├── page.tsx          # Level info page
│   │       ├── practice/
│   │       │   └── page.tsx      # Practice mode
│   │       ├── quiz/
│   │       │   └── page.tsx      # Quiz mode
│   │       └── results/
│   │           └── [attemptId]/
│   │               └── page.tsx  # Results page
│   │
│   ├── courses/                  # Course Mode (LMS)
│   │   └── [courseId]/
│   │       └── page.tsx
│   │
│   ├── dashboard/                # Dashboard
│   │   └── page.tsx
│   │
│   ├── teacher/                 # Teacher pages
│   │   ├── courses/
│   │   ├── students/
│   │   └── google-classroom/
│   │
│   ├── api/                     # API Routes
│   │   ├── levels/
│   │   ├── questions/
│   │   ├── attempts/
│   │   ├── courses/
│   │   └── google-classroom/
│   │
│   └── page.tsx                 # Landing page
│
├── components/                  # React components
│   ├── features/                # Feature components
│   │   ├── learning-path/
│   │   │   ├── LearningPath.tsx
│   │   │   ├── LevelCard.tsx
│   │   │   └── ProgressIndicator.tsx
│   │   │
│   │   ├── quiz/
│   │   │   ├── QuizHeader.tsx
│   │   │   ├── QuizTimer.tsx
│   │   │   ├── ResistorViewer.tsx  # Interactive resistor
│   │   │   ├── QuestionCard.tsx
│   │   │   ├── AnswerOptions.tsx
│   │   │   └── SubmitButton.tsx
│   │   │
│   │   ├── results/
│   │   │   ├── ResultsSummary.tsx
│   │   │   ├── QuestionReview.tsx
│   │   │   ├── LevelCompletion.tsx
│   │   │   └── ActionButtons.tsx
│   │   │
│   │   └── dashboard/
│   │       ├── ProgressOverview.tsx
│   │       ├── StatsCards.tsx
│   │       ├── ActivityFeed.tsx
│   │       └── ProgressChart.tsx
│   │
│   └── ui/                       # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── ...
│
├── lib/                         # Utility libraries
│   ├── resistor/
│   │   ├── calculator.ts        # Calculate resistance
│   │   ├── generator.ts         # Generate random resistor
│   │   └── colors.ts             # Color definitions
│   │
│   └── levels/
│       ├── progression.ts       # Unlock logic
│       └── validation.ts        # Pass/fail logic
│
└── prisma/                      # Database
    └── schema.prisma             # Database schema
```

---

## Milestones (2 Months Timeline)

### Milestone 1: Foundation Setup
**Goal:** โปรเจ็คพร้อมสำหรับพัฒนา

**Tasks:**
- Setup Next.js project
- Install all dependencies
- Setup Prisma + PostgreSQL (Supabase)
- Create database schema + Run migrations
- Setup NextAuth.js (Email + Google OAuth)
- Basic layout & navigation

**Deliverables:**
- Project structure ready
- Database schema created
- Authentication working
- Basic navigation working

**Success Criteria:**
- User can register/login
- Database connected
- Basic pages load

---

### Milestone 2: Resistor System + Learning Path
**Goal:** Core systems ทำงานได้

**Tasks:**
**Resistor System:**
- Create resistor color system (4-band, 5-band)
- Resistance calculator (reuse from resistor4.js, resistor5.js)
- Random resistor generator
- Build ResistorViewer component (basic)

**Learning Path:**
- Create Learning Path page (`/learn`)
- Display all 7 levels
- Lock/unlock logic
- Unlock system implementation

**Deliverables:**
- ResistorViewer component working
- Resistance calculator working
- Learning Path page working
- Unlock system working

**Success Criteria:**
- User can see all 7 levels
- Resistor visualization works
- Unlock logic works correctly

---

### Milestone 3: Practice & Quiz Modes
**Goal:** Quiz system ทำงานได้ครบ

**Tasks:**
**Practice Mode:**
- Create Practice mode page
- Unlimited questions
- Instant feedback
- ResistorViewer integration

**Quiz Mode:**
- Create Quiz mode page
- 10 questions per quiz
- Timer countdown
- Auto-save answers
- Submit functionality
- Answer validation
- Pass/fail logic (≥80%)

**Deliverables:**
- Practice mode working
- Quiz mode working
- Score calculation working
- Pass/fail logic working

**Success Criteria:**
- User can practice unlimited questions
- User can take quiz with timer
- Score calculated correctly
- Pass/fail works (≥80%)

---

### Milestone 4: Results & Dashboard
**Goal:** Users เห็นผลและความคืบหน้าได้

**Tasks:**
**Results Page:**
- Create Results page
- Score display
- Question review
- Pass/fail indicator
- Unlock next level (if pass)

**Dashboard:**
- Create Dashboard page
- Overall progress
- Basic statistics cards
- Progress charts (simple)
- Progress tracking

**Deliverables:**
- Results page working
- Dashboard working
- Progress tracking working
- Full flow test passing

**Success Criteria:**
- User can see quiz results
- User can see progress in dashboard
- Levels unlock when passed
- Full learning flow works end-to-end

---

### Milestone 5: LMS Foundation
**Goal:** Teachers สามารถสร้าง course และ assign levels ได้

**Tasks:**
**Course Management:**
- Create course form
- Course CRUD operations
- Course list page (Teacher)
- Course detail page

**Course Assignments:**
- Assign levels to courses
- Student enrollment
- Course detail page (Student view)
- Track student progress in course

**Deliverables:**
- Course creation working
- Student enrollment working
- Course assignments working
- Basic progress tracking

**Success Criteria:**
- Teacher can create courses
- Teacher can assign levels to courses
- Students can enroll in courses
- Progress tracked per course

---

### Milestone 6: Integration & Polish
**Goal:** เชื่อมต่อระบบทั้งหมดและปรับปรุง

**Tasks:**
**UI/UX Improvements:**
- Improve ResistorViewer visuals
- Improve Learning Path UX
- Better error handling
- Loading states

**System Integration:**
- Connect Self-Learning + Course Mode
- Combined Dashboard (both modes)
- Progress tracking integration
- End-to-end testing

**Deliverables:**
- Full system integration
- Polished UI/UX
- Core features working smoothly

**Success Criteria:**
- Self-learning and course mode work together
- Dashboard shows combined progress
- All features integrated

---

### Milestone 7: Google Classroom Integration
**Goal:** Google Classroom sync ทำงานได้

**Tasks:**
**Google Classroom Setup:**
- Setup Google Cloud Console
- Configure OAuth 2.0
- Install & configure googleapis
- Test authentication

**Import & Sync:**
- Connect Google Classroom
- Import students from Classroom
- Sync quiz scores to Classroom
- Create assignments in Classroom
- Auto-sync configuration (basic)

**Deliverables:**
- Google Classroom connection working
- Import students working
- Grade sync working

**Success Criteria:**
- Teacher can connect Google Classroom
- Students can be imported
- Quiz scores sync to Classroom
- Assignments created in Classroom

---

### Milestone 8: Final Polish & Deploy
**Goal:** Production ready และ deploy

**Tasks:**
**Advanced Features:**
- Badges & achievements (basic)
- Better analytics for teacher
- Export reports (CSV)
- Announcements system

**UI/UX Polish:**
- Mobile responsive (critical pages)
- Dark mode support
- Better animations
- Error messages improvement

**Deployment:**
- Complete testing
- Performance optimization
- Security check
- Deploy to Vercel

**Deliverables:**
- All features working
- Production ready
- Deployed

**Success Criteria:**
- All features complete
- Performance optimized
- Security checked
- Successfully deployed

---

## Timeline Overview (8 Weeks)

| Week | Milestone | Status |
|------|-----------|--------|
| 1 | Foundation Setup | |
| 2 | Resistor System + Learning Path | |
| 3 | Practice & Quiz Modes | |
| 4 | Results & Dashboard | |
| 5 | LMS Foundation | |
| 6 | Integration & Polish | |
| 7 | Google Classroom | |
| 8 | Final Polish & Deploy | |

---

## Component Priority

### Must Have (Milestones 1-3):
1. **ResistorViewer.tsx** - Core component
2. **LearningPath.tsx** - Main navigation
3. **QuizHeader.tsx** - Quiz UI
4. **QuestionCard.tsx** - Question display
5. **ResultsSummary.tsx** - Results display

### Should Have (Milestones 4-5):
6. **ProgressChart.tsx** - Statistics
7. **LevelCard.tsx** - Level display
8. **CourseCard.tsx** - Course display

### Nice to Have (Milestones 6-8):
9. **BadgesSection.tsx** - Achievements
10. **ActivityFeed.tsx** - Recent activity
11. **StatsCards.tsx** - Statistics

---

## Database Schema

```prisma
// See system-design.md for full schema
// Key models:
- Level (1-7 levels) - Questions are generated dynamically, not stored
- LevelAttempt (quiz attempts) - Stores generated questions per attempt
- Course (LMS courses)
- CourseAssignment (assign levels to courses)
- Enrollment (student enrollment)
- GoogleClassroomSync (Classroom integration)
```

---

## Key Features Implementation

### 1. Resistor Color System
```typescript
// lib/resistor/colors.ts
export const resistorColors = {
 'black': { value: 0, multiplier: 1 },
 'brown': { value: 1, multiplier: 10 },
 'red': { value: 2, multiplier: 100 },
 // ... etc (reuse from resistor4.js, resistor5.js)
}

// lib/resistor/calculator.ts
export function calculateResistance(bands: string[], type: '4-band' | '5-band'): string {
 // Calculate and return "12kΩ ±5%"
}

// lib/resistor/generator.ts
// IMPORTANT: Questions are generated dynamically, not predefined in database
export function generateRandomResistor(level: number, type: '4-band' | '5-band') {
 // Generate random resistor colors based on level difficulty
 // - Level 1-2: Easy combinations (common colors)
 // - Level 3-4: Medium combinations
 // - Level 5-7: Hard combinations (all possible)
 // Returns: { bands: string[], correctAnswer: string, explanation: string }
}
```

### 2. Unlock System
```typescript
// lib/levels/progression.ts
export async function checkLevelUnlock(userId: string, levelNumber: number): Promise<boolean> {
 // Check if user completed previous level
}

export async function unlockNextLevel(userId: string, levelNumber: number) {
 // Unlock next level when user passes current level
}
```

### 3. Pass/Fail Logic
```typescript
// lib/levels/validation.ts
export function calculatePass(percentage: number, passScore: number = 80): boolean {
 return percentage >= passScore
}
```

---

## Page Implementation Order

1. **Landing Page** (`/`) - Simple, clean
2. **Learning Path** (`/learn`) - **Main page**
3. **Level Page** (`/levels/[levelId]`) - Level info
4. **Practice Mode** (`/levels/[levelId]/practice`) - Practice
5. **Quiz Mode** (`/levels/[levelId]/quiz`) - Quiz
6. **Results Page** (`/levels/[levelId]/results/[attemptId]`) - Results
7. **Dashboard** (`/dashboard`) - Statistics
8. **Course Pages** (`/courses`) - Course mode
9. **Teacher Pages** (`/teacher/*`) - Teacher management

---

## UI/UX Priorities

### Must Have:
1. Clear progress indicators
2. Locked/unlocked visual states
3. Instant feedback in practice mode
4. Clear pass/fail in results
5. Mobile responsive (critical pages)

### Nice to Have:
1. Unlock animations
2. Progress celebrations
3. Smooth transitions
4. Loading states

---
## Success Criteria

### Milestone 4 (MVP Complete):
- [x] User can see all 7 levels
- [x] User can practice (unlimited, instant feedback)
- [x] User can take quiz (timed, scored)
- [x] User can see results
- [x] Levels unlock when passed (≥80%)
- [x] Progress is tracked
- [x] Dashboard shows statistics

### Milestone 6 (Phase 1 Complete):
- [x] Course creation (Teacher mode)
- [x] Student enrollment
- [x] Course assignments
- [x] Combined dashboard

### Milestone 7 (Phase 2 Complete):
- [x] Google Classroom integration
- [x] Import students
- [x] Sync grades

### Milestone 8 (Production Ready):
- [x] Badges & achievements (basic)
- [x] Export reports
- [x] Mobile responsive
- [x] Production ready
- [x] Deployed

---
## Resources

### Documentation to Read:
1. `system-design.md` - ระบบรวมทั้งหมด
2. `learning-system.md` - Progressive Learning details
3. `tech-stack.md` - Tech stack details
4. `timeline.md` - Detailed timeline (if needed)

### Code to Reuse:
- `Sourcecode/website-main/modules/resistor4.js` - 4-band logic
- `Sourcecode/website-main/modules/resistor5.js` - 5-band logic
- `Sourcecode/website-main/components/res_quiz/res_quiz.js` - Quiz logic
---