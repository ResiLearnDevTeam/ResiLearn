# Progressive Learning System - Resistor Reading

## Core Concept

ระบบฝึกอ่านค่าตัวต้านทานแบบ **Progressive Learning** เหมือนฝึกพิมพ์
- เริ่มจาก **ง่าย → ยาก**
- ต้องผ่าน Level ก่อนถึงจะ unlock Level ถัดไปได้
- มี Progress Tracking
- LMS/Google Classroom เป็นส่วนเสริม (Optional)

---

## Core Features

### 1. **Progressive Level System**

#### Level Structure:
```
Level 1: Basic Colors (4-band, easy)
 Introduction to resistor colors
 Basic color recognition (10 colors)
 Simple calculations

Level 2: 4-Band Basics
 Understanding 4-band structure
 First 2 bands (1-9)
 Third band (multiplier: 1, 10, 100, 1k, 10k)
 Fourth band (tolerance: gold, silver)

Level 3: 4-Band Practice
 Common values (1Ω - 1MΩ)
 Random combinations
 Speed practice

Level 4: 5-Band Basics
 Understanding 5-band structure
 First 3 bands (1-9)
 Fourth band (multiplier)
 Fifth band (tolerance: brown, red)

Level 5: 5-Band Practice
 Common values
 Random combinations
 Speed practice

Level 6: Mixed Practice
 Random 4-band or 5-band
 Harder combinations
 Speed challenge

Level 7: Expert Mode
 All possible combinations
 Time pressure
 Accuracy challenge
```

### 2. **Unlock System**
- ต้องผ่าน Level ก่อนถึงจะทำ Level ถัดไปได้
- Pass criteria: **80% score + Complete all questions**
- ไม่ผ่าน = Retry (unlimited attempts)

### 3. **Practice Mode vs Quiz Mode**

#### Practice Mode (Unlimited):
- ไม่มีเวลา
- แสดงคำตอบถูกต้องทันที
- ไม่บันทึก score
- ทำได้ทุก Level (unlock แล้ว)

#### Quiz Mode (Timed):
- มีเวลา (5-30 นาที ตาม Level)
- ไม่แสดงคำตอบจนกว่าจะ submit
- บันทึก score
- ต้อง unlock Level ก่อนทำ

---

## Main Pages Structure

### 1. **Home / Learning Path** (`/` หรือ `/learn`)
**วัตถุประสงค์:** แสดง Learning Path (Level progression)

**Content:**
- Progress overview:
 - Current level
 - Overall progress bar
 - Total levels completed
- Level cards (vertical/horizontal scroll):
 ```
 Level 1: Basic Colors [ Unlocked] [ Completed - 95%]
 Level 2: 4-Band Basics [ Unlocked] [ Completed - 88%]
 Level 3: 4-Band Practice [ Unlocked] [ In Progress]
 Level 4: 5-Band Basics [ Locked - Complete Level 3]
 Level 5: 5-Band Practice [ Locked - Complete Level 4]
 Level 6: Mixed Practice [ Locked - Complete Level 5]
 Level 7: Expert Mode [ Locked - Complete Level 6]
 ```

**Features:**
- Click level → Go to level page
- Visual progress indicators
- Lock/unlock animations
- Badge display (if completed)

**Components:**
- `LearningPath.tsx`
- `LevelCard.tsx`
- `ProgressIndicator.tsx`

---

### 2. **Level Page** (`/levels/[levelId]`)
**วัตถุประสงค์:** หน้า Level แต่ละระดับ

**Content:**
- Level header:
 - Level name & number
 - Description
 - Difficulty indicator ( )
 - Estimated time
- Quick stats:
 - Best score (if attempted)
 - Attempts count
 - Time spent
- Modes:
 - **Practice Mode** button (unlimited, no timer)
 - **Quiz Mode** button (timed, scored)
- Lesson content (optional):
 - Video tutorial
 - Quick guide
 - Tips & tricks

**Features:**
- Locked levels: Show requirements
- Completed levels: Show badge & best score
- In progress: Show continue button

**Components:**
- `LevelHeader.tsx`
- `LevelStats.tsx`
- `ModeSelector.tsx`
- `LessonContent.tsx`

---

### 3. **Practice/Quiz Page** (`/levels/[levelId]/practice` หรือ `/levels/[levelId]/quiz`)
**วัตถุประสงค์:** หน้าฝึก/ทำแบบทดสอบ

**IMPORTANT: Dynamic Question Generation**
- Questions are **generated randomly** when quiz/practice starts
- Each attempt gets **different random questions**
- Questions are **NOT predefined** in database
- System uses `generateRandomResistor()` function based on level difficulty

**Content:**
- Header:
 - Mode indicator (Practice / Quiz)
 - Level name
 - Question counter (1/10)
 - Timer (Quiz mode only)
- Question display:
 - Resistor image (interactive)
 - Color bands visualization
 - Question: "What is the resistance value?"
- Answer options:
 - Multiple choice (4 options)
 - หรือ Fill-in-the-blank
- Navigation:
 - Previous button
 - Next button
 - Submit button (Quiz mode)

**Features (Practice Mode):**
- Instant feedback (show correct answer immediately)
- Explanation of answer
- No timer
- Unlimited attempts - Each practice gets new random questions
- Can skip questions - Next question is also randomly generated
- Generate new random question on "Next" button

**Features (Quiz Mode):**
- Timer countdown
- No instant feedback (until submit)
- Save answers automatically
- Submit when done or time's up
- Limited attempts (unlock retry if fail)
- Questions generated once when quiz starts, saved for review

**Components:**
- `QuizHeader.tsx`
- `QuizTimer.tsx`
- `ResistorViewer.tsx` (Interactive)
- `QuestionCard.tsx`
- `AnswerOptions.tsx`
- `SubmitButton.tsx`

---

### 4. **Results Page** (`/levels/[levelId]/results/[attemptId]`)
**วัตถุประสงค์:** ดูผลการทำแบบทดสอบ

**Content:**
- Results summary:
 - Score (85/100)
 - Percentage (85%)
 - Pass/Fail indicator (80% to pass)
 - Time taken
 - Attempt number
- Detailed review:
 - Question 1: Correct (10/10)
 - Your answer: 12kΩ ±5%
 - Correct answer: 12kΩ ±5%
 - Explanation
 - Question 2: Incorrect (0/10)
 - Your answer: 10kΩ ±5%
 - Correct answer: 12kΩ ±5%
 - Explanation: "The first band is brown (1), second is red (2)..."
- Level completion:
 - If pass (≥80%): Level Completed! → Unlock next level
 - If fail (<80%): Level Failed → Retry button
- Actions:
 - Retry quiz (if failed)
 - Practice more (go to practice mode)
 - Continue to next level (if passed)
 - Back to learning path

**Components:**
- `ResultsSummary.tsx`
- `QuestionReview.tsx`
- `LevelCompletion.tsx`
- `ActionButtons.tsx`

---

### 5. **Practice Mode** (`/levels/[levelId]/practice`)
**วัตถุประสงค์:** ฝึกแบบไม่จำกัด

**Content:**
- Same as Quiz page but:
 - No timer
 - Show answer immediately
 - Explanation shown
 - Can generate new questions unlimited
 - No score tracking (optional: track for statistics)

**Features:**
- Generate random resistor
- Check answer instantly
- See explanation
- Next question button
- Practice counter (how many practiced)

---

### 6. **Dashboard** (`/dashboard`)
**วัตถุประสงค์:** ดูสถิติและความคืบหน้า

**Content:**
- Overall progress:
 - Levels completed: 3/7
 - Overall score: 89%
 - Total practice time: 5h 30m
- Statistics:
 - Total questions answered: 245
 - Correct answers: 218 (89%)
 - Average time per question: 45s
- Recent activity:
 - Completed Level 3 - 95%
 - Attempted Level 4 - 75% (Failed)
 - Practiced 10 questions today
- Badges & Achievements:
 - "Level 1 Master" - Completed Level 1
 - "Speed Demon" - Answered in <30s
 - "Perfect Score" - Got 100% on Level 2
- Charts:
 - Progress over time
 - Score trend
 - Time spent per level

**Components:**
- `ProgressOverview.tsx`
- `StatsCards.tsx`
- `ActivityFeed.tsx`
- `BadgesSection.tsx`
- `ProgressChart.tsx`

---

### 7. **Profile** (`/profile`)
**วัตถุประสงค์:** จัดการโปรไฟล์

**Content:**
- Profile info
- Learning statistics
- Settings (theme, notifications, etc.)

---

## Resistor Visualization System

### Interactive Resistor Display

**IMPORTANT: Dynamic Question Generation**
- Questions are **NOT predefined** in database
- System **generates random resistor colors** dynamically for each quiz/practice session
- Every attempt gets different random questions
- Questions are generated based on level difficulty

**Features:**
- Show resistor with color bands
- Click band to change color (Practice mode only)
- Auto-generate random colors dynamically
- Real-time calculation display
- Zoom in/out
- Rotate view

**Component:** `ResistorViewer.tsx`

**Props:**
```typescript
interface ResistorViewerProps {
 bands: string[] // ['brown', 'red', 'orange', 'gold'] - Generated dynamically
 interactive?: boolean // Can click to change (Practice mode only)
 showValue?: boolean // Show calculated value
 type: '4-band' | '5-band'
}
```

**Question Generation:**
```typescript
// lib/resistor/generator.ts
// Generates random resistor colors based on level
export function generateRandomResistor(level: number, type: '4-band' | '5-band') {
 // Returns: { bands: string[], correctAnswer: string, explanation: string }
 // - Level 1-2: Easy combinations (common colors)
 // - Level 3-4: Medium combinations  
 // - Level 5-7: Hard combinations (all possible)
}
```

---

## Database Schema (Simplified)

```prisma
model Level {
 id String @id @default(cuid())
 number Int @unique
 name String
 description String
 difficulty Int // 1-5
 questionCount Int @default(10) // Number of questions per quiz
 timeLimit Int? // Minutes (null = no limit)
 passScore Int @default(80) // Percentage
 type QuestionType @default(FOUR_BAND) // 4-band or 5-band for this level
 requiresLevel Int? // null = unlocked from start

 // Questions are generated dynamically, NOT stored in database
 attempts LevelAttempt[]
}

model LevelAttempt {
 id String @id @default(cuid())
 userId String @map("user_id")
 levelId String @map("level_id")
 mode AttemptMode // 'practice' | 'quiz'
 score Int?
 percentage Float?
 timeTaken Int? @map("time_taken") // seconds
 completedAt DateTime @default(now()) @map("completed_at")
 passed Boolean?
 
 // Store generated questions and answers for this attempt only
 // Questions are generated dynamically when quiz starts
 questions Json // Array: [{ bands: [...], correctAnswer: "...", userAnswer: "...", isCorrect: boolean }]

 user User @relation(fields: [userId], references: [id])
 level Level @relation(fields: [levelId], references: [id])
}

enum AttemptMode {
 PRACTICE
 QUIZ
}

enum QuestionType {
 FOUR_BAND
 FIVE_BAND
}
```

---

## User Flow Examples

### Flow 1: New User Starts Learning
```
1. User registers → /register
2. Redirects to /learn (Learning Path)
3. Sees Level 1 unlocked
4. Clicks Level 1 → /levels/1
5. Clicks "Practice Mode" → /levels/1/practice
6. Practices a few questions
7. Clicks "Quiz Mode" → /levels/1/quiz
8. Takes quiz (10 questions, 10 minutes)
9. Submits → /levels/1/results/[attemptId]
10. Gets 85% → Pass! → Unlocks Level 2
11. Can now do Level 2
```

### Flow 2: User Fails Level
```
1. User attempts Level 4 → /levels/4/quiz
2. Gets 75% → /levels/4/results/[attemptId]
3. Sees: Failed (Need 80%)
4. Clicks "Practice More" → /levels/4/practice
5. Practices more questions
6. Clicks "Retry Quiz" → /levels/4/quiz
7. Gets 90% → Pass! → Unlocks Level 5
```

### Flow 3: User Practices Without Quiz
```
1. User goes to /learn
2. Clicks any unlocked level → /levels/3
3. Clicks "Practice Mode" → /levels/3/practice
4. Practices unlimited questions
5. No quiz needed (optional)
```

---

## LMS Integration (Core Feature)

### Google Classroom Sync (Required)
- **Core Feature** - Full Google Classroom integration
- Teacher can:
 - Connect Google Classroom account
 - Import students from Classroom
 - Assign levels as Classroom assignments
 - Auto-sync grades to Classroom Gradebook
- Student can:
 - Link Classroom account (optional)
 - See synced data
 - View grades in Classroom

### Course Creation (Teacher Mode)
- Teachers can create custom courses
- Add students to courses (manual or from Classroom)
- Assign levels as assignments with due dates
- Track student progress in course
- Sync with Google Classroom

### Dual Mode System:
- **Self-Learning Mode**: Student learns independently (Level 1-7)
- **Course Mode**: Teacher assigns levels in course
- Both modes work together, progress tracked separately and combined

---

## Progress Tracking

### Track:
- Levels completed
- Best score per level
- Total practice time
- Questions answered
- Correct/incorrect ratio
- Streak (days practiced)
- Average time per question

### Display:
- Dashboard with charts
- Progress bars
- Badges & achievements
- Leaderboard (optional)

---

## Gamification Elements

### Badges:
- Level Master (Complete level)
- Speed Demon (<30s per question)
- Perfect Score (100%)
- Dedicated Learner (7 days streak)
- Expert (Complete all levels)

### Points:
- Practice mode: 5 points per question
- Quiz mode: 10 points per question
- Bonus: Extra points for speed

### Leaderboard (Optional):
- Global leaderboard
- Friend leaderboard
- Weekly/monthly rankings

---

## Priority Development

### Phase 1: Core System (MVP)
1. Level structure (7 levels)
2. Unlock system
3. Practice mode
4. Quiz mode
5. Resistor visualization
6. Basic progress tracking

### Phase 2: Polish
1. Results page with review
2. Dashboard with statistics
3. Badges & achievements
4. Improved UI/UX

### Phase 3: Advanced
1. Google Classroom integration (optional)
2. Leaderboard
3. Social features (optional)

---

## Page Routes (Simplified)

```
/ # Landing page
/learn # Learning Path (main page)
/levels/[levelId] # Level page
/levels/[levelId]/practice # Practice mode
/levels/[levelId]/quiz # Quiz mode
/levels/[levelId]/results/[attemptId] # Results page
/dashboard # Dashboard (stats)
/profile # Profile

# Optional LMS features
/courses # Course list (if using LMS)
/courses/[courseId] # Course detail
/classroom # Google Classroom sync
```

---

## UI/UX Focus

### Main Focus:
- **Simple & Clean** - ไม่ซับซ้อน
- **Progress Visibility** - เห็นความคืบหน้าชัดเจน
- **Immediate Feedback** - ตอบกลับทันที
- **Motivational** - Badges, progress bars, unlock animations

### Key Screens:
1. **Learning Path** - เห็น progress ทั้งหมดในที่เดียว
2. **Quiz Page** - Simple, focused, no distractions
3. **Results Page** - Clear feedback, motivation to continue

---

## Summary

### Core System:
- **Progressive Learning** - 7 levels, easy → hard
- **Unlock System** - Must pass to unlock next
- **Practice Mode** - Unlimited, no pressure
- **Quiz Mode** - Timed, scored, unlocks next level
- **Progress Tracking** - Comprehensive stats

### Secondary Features (Optional):
- Google Classroom integration
- Course creation (Teacher mode)
- Leaderboard
- Social features

### Main Pages:
1. Learning Path (Main) - `/learn`
2. Level Page - `/levels/[levelId]`
3. Practice/Quiz - `/levels/[levelId]/practice` or `/quiz`
4. Results - `/levels/[levelId]/results/[attemptId]`
5. Dashboard - `/dashboard`