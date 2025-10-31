# Complete Tech Stack - ResiLearn Project

## Full Stack Recommendation (Production Ready)

### Core Framework
```bash
Next.js 14+ (App Router)
```
**เวอร์ชัน:** `^14.0.4`
**เหตุผล:**
- Latest App Router (React Server Components)
- Built-in optimizations (Image, Font, Script)
- File-based routing
- API Routes included
- Middleware support
- Server Actions
- Excellent SEO

---

### Database & ORM

#### Database
```bash
PostgreSQL
```



**macOS (Homebrew):**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Setup Database:**
```bash
# เข้า PostgreSQL CLI
psql postgres

# สร้าง database
CREATE DATABASE resilearn;

# ออกจาก CLI
\q
```
---


#### ORM
```bash
Prisma
```
**เวอร์ชัน:** `^5.7.0`
**เหตุผล:**
- Type-safe database client
- Excellent TypeScript support
- Migration system
- Prisma Studio (GUI)
- Great DX

---

### Authentication

```bash
NextAuth.js v5 (Auth.js)
```
**เวอร์ชัน:** `^5.0.0-beta.4`
**เหตุผล:**
- Support Google, Email/Password, GitHub, etc.
- JWT & Database sessions
- TypeScript support
- Middleware for route protection
- Server-side rendering compatible

**Adapters:**
- `@auth/prisma-adapter` - สำหรับ Prisma

---

### UI Framework & Styling

#### CSS Framework
```bash
Tailwind CSS
```
**เวอร์ชัน:** `^3.4.0`
**เหตุผล:**
- Utility-first (เร็ว, แก้ง่าย)
- Responsive design
- Dark mode support
- JIT mode (small bundle size)

#### Component Library
```bash
shadcn/ui
```
**เวอร์ชัน:** Latest (copy components)
**เหตุผล:**
- Beautiful components
- Fully customizable
- Accessible (WCAG)
- TypeScript
- ไม่ต้อง install (copy code)
- ใช้ Tailwind CSS

**Alternatives:**
- **Mantine** - Feature-rich แต่ bundle ใหญ่กว่า
- **Radix UI** - Headless components (shadcn/ui ใช้อยู่แล้ว)

#### Icons
```bash
lucide-react
```
**เวอร์ชัน:** `^0.303.0`
**เหตุผล:**
- Beautiful icons
- Tree-shakable
- TypeScript
- ใช้ใน shadcn/ui

---

### State Management

#### Client State
```bash
Zustand
```
**เวอร์ชัน:** `^4.4.7`
**เหตุผล:**
- Lightweight (1KB)
- Simple API
- No boilerplate
- TypeScript support
- Fast

**Alternatives:**
- **Jotai** - Atomic state
- **Valtio** - Proxy-based

#### Server State
```bash
TanStack Query (React Query)
```
**เวอร์ชัน:** `^5.14.2`
**เหตุผล:**
- Caching
- Background updates
- DevTools
- Optimistic updates
- Pagination & Infinite queries

---

### Forms & Validation

#### Form Library
```bash
React Hook Form
```
**เวอร์ชัน:** `^7.49.2`
**เหตุผล:**
- Performance optimized (no re-renders)
- Small bundle size
- Easy to use
- Good TypeScript support

#### Validation
```bash
Zod
```
**เวอร์ชัน:** `^3.22.4`
**เหตุผล:**
- TypeScript-first
- Type inference
- Runtime validation
- Composable schemas

**Integration:**
```bash
@hookform/resolvers
```
**เวอร์ชัน:** `^3.3.2`
- เชื่อม React Hook Form กับ Zod

---

### Charts & Visualization

```bash
Recharts
```
**เวอร์ชัน:** `^2.10.3`
**เหตุผล:**
- Composable (React components)
- Responsive
- Beautiful defaults
- TypeScript
- Active development

**Alternatives:**
- **Chart.js + react-chartjs-2** - More options แต่ต้อง setup มากขึ้น
- **Victory** - ดีแต่ bundle ใหญ่กว่า

---

### Google Classroom Integration

```bash
googleapis
```
**เวอร์ชัน:** `^128.0.0`
**เหตุผล:**
- Official Google APIs client
- TypeScript types included
- Support all Google APIs

---

### Date Handling

```bash
date-fns
```
**เวอร์ชัน:** `^3.0.6`
**เหตุผล:**
- Lightweight
- Immutable
- Tree-shakable
- TypeScript support

**Alternatives:**
- **Day.js** - Similar แต่เล็กกว่า (ไม่ support timezone ดีเท่า)

---

### Utilities

#### Class Name Management
```bash
clsx + tailwind-merge
```

```bash
clsx
```
**เวอร์ชัน:** `^2.1.0`
- จัดการ class names

```bash
tailwind-merge
```
**เวอร์ชัน:** `^2.2.0`
- Merge Tailwind classes โดยไม่ conflict

#### Component Variants
```bash
class-variance-authority (CVA)
```
**เวอร์ชัน:** `^0.7.0`
**เหตุผล:**
- Type-safe component variants
- ใช้ใน shadcn/ui
- จัดการ component states (size, variant, color)

---

### File Upload

#### Local Filesystem Storage
เก็บไฟล์บน server (filesystem) และบันทึก path ใน database

**วิธีการ:**
1. อัปโหลดไฟล์ → เก็บใน `/public/uploads/` หรือ `/uploads/`
2. บันทึก path ใน database → เช่น `/uploads/images/course-123.jpg`
3. แสดงไฟล์ → ใช้ Next.js Static Files หรือ API Route

**Implementation:**
```typescript
// lib/upload.ts
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function saveFile(file: File, folder: string): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  const filename = `${Date.now()}-${file.name}`;
  const path = join(process.cwd(), 'public', 'uploads', folder, filename);
  
  await writeFile(path, buffer);
  return `/uploads/${folder}/${filename}`;
}
```

**Database Schema:**
```prisma
model Course {
  // ...
  image String?  // เก็บ path เช่น "/uploads/courses/course-123.jpg"
}
```
---

### Search & Filtering

```bash
@tanstack/react-table
```
**เวอร์ชัน:** `^8.10.7`
**เหตุผล:**
- Powerful table features
- Sorting, filtering, pagination
- Virtualization support
- TypeScript

---

### Animation

```bash
framer-motion
```
**เวอร์ชัน:** `^10.16.16`
**เหตุผล:**
- Powerful animations (animate, variants, layout animations)
- Gesture support (drag, hover, tap)
- Layout animations (auto-animate when layout changes)
- TypeScript support
- Popular และ stable

**ตัวเลือกอื่น ๆ:**

1. **react-spring** (Lighter alternative)
   - Physics-based animations
   - Bundle size เล็กกว่า framer-motion (~9KB vs ~20KB)
   - เหมาะกับ: Simple animations, performance-critical
   - **เวอร์ชัน:** `^9.7.3`

2. **auto-animate** (Zero config)
   - Automatic animations (ไม่ต้องเขียน code)
   - แค่ wrap component ด้วย `<AutoAnimate>`
   - เหมาะกับ: List animations, fade in/out
   - **เวอร์ชัน:** `^0.4.0`

3. **react-transition-group** (Simple transitions)
   - Basic transitions (enter/exit animations)
   - Built-in React component
   - เหมาะกับ: Modal, dropdown, simple transitions
   - **เวอร์ชัน:** `^4.4.5`

4. **motion** (Minimal framer-motion)
   - Lightweight version of framer-motion
   - Same API แต่ bundle เล็กกว่า
   - เหมาะกับ: ต้องการ framer-motion แต่ต้องการ bundle เล็กกว่า
---

### Testing (Optional - สำหรับ Production)

```bash
# Unit & Integration Tests
Vitest + @testing-library/react

# E2E Tests
Playwright
```

---

### Package Manager

```bash
pnpm
```
**เหตุผล:**
- Fast (เร็วกว่า npm/yarn)
- Disk efficient
- Workspace support
- Better dependency resolution

---

## Complete package.json

```json
{
 "name": "resilearn",
 "version": "0.1.0",
 "private": true,
 "description": "ResiLearn - Resistor Reading Training System",
 "scripts": {
 "dev": "next dev",
 "build": "next build",
 "start": "next start",
 "lint": "next lint",
 "type-check": "tsc --noEmit",
 "db:generate": "prisma generate",
 "db:push": "prisma db push",
 "db:migrate": "prisma migrate dev",
 "db:studio": "prisma studio",
 "db:seed": "tsx prisma/seed.ts"
 },
 "dependencies": {
 "next": "^14.0.4",
 "react": "^18.2.0",
 "react-dom": "^18.2.0",

 "@prisma/client": "^5.7.0",
 "@auth/prisma-adapter": "^1.0.0",

 "next-auth": "^5.0.0-beta.4",

 "zod": "^3.22.4",
 "react-hook-form": "^7.49.2",
 "@hookform/resolvers": "^3.3.2",

 "zustand": "^4.4.7",
 "@tanstack/react-query": "^5.14.2",
 "@tanstack/react-table": "^8.10.7",

 "recharts": "^2.10.3",

 "googleapis": "^128.0.0",

 "date-fns": "^3.0.6",

 "clsx": "^2.1.0",
 "tailwind-merge": "^2.2.0",
 "class-variance-authority": "^0.7.0",

 "lucide-react": "^0.303.0",

 "framer-motion": "^10.16.16"
 },
 "devDependencies": {
 "@types/node": "^20.10.6",
 "@types/react": "^18.2.45",
 "@types/react-dom": "^18.2.18",

 "typescript": "^5.3.3",

 "prisma": "^5.7.0",

 "eslint": "^8.56.0",
 "eslint-config-next": "^14.0.4",

 "tailwindcss": "^3.4.0",
 "postcss": "^8.4.32",
 "autoprefixer": "^10.4.16",

 "@types/node": "^20.10.6"
 }
}
```

---

## Installation Commands

### 1. ติดตั้ง PostgreSQL บนเครื่อง (Local)

**macOS:**
```bash
brew install postgresql@15
brew services start postgresql@15

# สร้าง database
psql postgres
CREATE DATABASE resilearn;
\q
```

**Windows:**
- Download และติดตั้งจาก [postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)
- ใช้ pgAdmin หรือ Command Prompt เพื่อสร้าง database:
```bash
psql -U postgres
CREATE DATABASE resilearn;
\q
```

**Linux:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql

# สร้าง database
sudo -u postgres psql
CREATE DATABASE resilearn;
\q
```

### 2. สร้าง Next.js Project และติดตั้ง Dependencies

```bash
# สร้าง Next.js project
npx create-next-app@latest resilearn --typescript --tailwind --app

cd resilearn

# Install dependencies
pnpm add @prisma/client @auth/prisma-adapter next-auth@beta
pnpm add zod react-hook-form @hookform/resolvers
pnpm add zustand @tanstack/react-query @tanstack/react-table
pnpm add recharts date-fns googleapis
pnpm add clsx tailwind-merge class-variance-authority
pnpm add lucide-react framer-motion

# Dev dependencies
pnpm add -D prisma @types/node typescript
pnpm add -D eslint-config-next
pnpm add -D tailwindcss postcss autoprefixer
pnpm add -D tsx
```

### 3. Setup Database (Prisma)

```bash
# Initialize Prisma
npx prisma init

# แก้ไข .env - ตั้งค่า DATABASE_URL สำหรับ Local PostgreSQL:
# DATABASE_URL="postgresql://postgres:your_password@localhost:5432/resilearn?schema=public"

# Generate Prisma Client
npx prisma generate

# Run migration
npx prisma migrate dev --name init

# (Optional) เปิด Prisma Studio เพื่อดูข้อมูล
npx prisma studio
```

---

## Project Structure (Complete)

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
│   ├── teacher/                  # Teacher pages
│   │   ├── courses/
│   │   ├── students/
│   │   └── google-classroom/
│   │
│   ├── api/                      # API Routes
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts
│   │   ├── levels/
│   │   ├── attempts/
│   │   ├── courses/
│   │   └── google-classroom/
│   │
│   ├── layout.tsx                # Root layout
│   ├── loading.tsx               # Loading UI
│   ├── error.tsx                 # Error UI
│   └── page.tsx                  # Landing page
│
├── components/                   # React components
│   ├── features/                 # Feature components
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
│       ├── dialog.tsx
│       ├── table.tsx
│       ├── form.tsx
│       └── ...
│
├── lib/                          # Utility libraries
│   ├── db.ts                     # Prisma client singleton
│   ├── auth.ts                   # NextAuth configuration
│   ├── utils.ts                  # Utility functions (cn, etc.)
│   ├── validations.ts            # Zod schemas
│   ├── api-client.ts             # API client functions
│   ├── google-classroom.ts       # Google Classroom helpers
│   ├── upload.ts                 # File upload helper (local filesystem)
│   ├── resistor/
│   │   ├── calculator.ts         # Calculate resistance
│   │   ├── generator.ts          # Generate random resistor
│   │   └── colors.ts             # Color definitions
│   │
│   └── levels/
│       ├── progression.ts        # Unlock logic
│       └── validation.ts         # Pass/fail logic
│
├── hooks/                        # Custom hooks
│   ├── useAuth.ts
│   ├── useCourse.ts
│   ├── useQuiz.ts
│   └── useGoogleClassroom.ts
│
├── store/                        # State management
│   ├── authStore.ts              # Zustand store
│   └── uiStore.ts
│
├── types/                        # TypeScript types
│   ├── database.ts               # Prisma types
│   ├── api.ts                    # API types
│   └── index.ts
│
├── prisma/                       # Database
│   ├── schema.prisma              # Database schema
│   └── seed.ts                   # Seed data
│
├── public/                       # Static assets
│   ├── uploads/                  # Uploaded files
│   │   ├── courses/              # Course images
│   │   ├── avatars/              # User avatars
│   │   └── documents/            # Other documents
│   ├── images/
│   └── icons/
│
├── .env.local                    # Environment variables
├── .env.example                  # Example env file
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Configuration Files

### next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
 images: {
 remotePatterns: [
 {
 protocol: 'https',
 hostname: 'lh3.googleusercontent.com',
 },
 {
 protocol: 'https',
 hostname: 'images.unsplash.com',
 },
 ],
 },
 experimental: {
 serverActions: true,
 },
}

module.exports = nextConfig
```

### tailwind.config.ts
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
 darkMode: ['class'],
 content: [
 './pages/**/*.{js,ts,jsx,tsx,mdx}',
 './components/**/*.{js,ts,jsx,tsx,mdx}',
 './app/**/*.{js,ts,jsx,tsx,mdx}',
 ],
 theme: {
 extend: {
 colors: {
 border: 'hsl(var(--border))',
 input: 'hsl(var(--input))',
 ring: 'hsl(var(--ring))',
 background: 'hsl(var(--background))',
 foreground: 'hsl(var(--foreground))',
 primary: {
 DEFAULT: 'hsl(var(--primary))',
 foreground: 'hsl(var(--primary-foreground))',
 },
 secondary: {
 DEFAULT: 'hsl(var(--secondary))',
 foreground: 'hsl(var(--secondary-foreground))',
 },
 destructive: {
 DEFAULT: 'hsl(var(--destructive))',
 foreground: 'hsl(var(--destructive-foreground))',
 },
 muted: {
 DEFAULT: 'hsl(var(--muted))',
 foreground: 'hsl(var(--muted-foreground))',
 },
 accent: {
 DEFAULT: 'hsl(var(--accent))',
 foreground: 'hsl(var(--accent-foreground))',
 },
 popover: {
 DEFAULT: 'hsl(var(--popover))',
 foreground: 'hsl(var(--popover-foreground))',
 },
 card: {
 DEFAULT: 'hsl(var(--card))',
 foreground: 'hsl(var(--card-foreground))',
 },
 },
 borderRadius: {
 lg: 'var(--radius)',
 md: 'calc(var(--radius) - 2px)',
 sm: 'calc(var(--radius) - 4px)',
 },
 },
 },
 plugins: [],
}
export default config
```

### tsconfig.json
```json
{
 "compilerOptions": {
 "target": "ES2017",
 "lib": ["dom", "dom.iterable", "esnext"],
 "allowJs": true,
 "skipLibCheck": true,
 "strict": true,
 "noEmit": true,
 "esModuleInterop": true,
 "module": "esnext",
 "moduleResolution": "bundler",
 "resolveJsonModule": true,
 "isolatedModules": true,
 "jsx": "preserve",
 "incremental": true,
 "plugins": [
 {
 "name": "next"
 }
 ],
 "paths": {
 "@/*": ["./*"]
 }
 },
 "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
 "exclude": ["node_modules"]
}
```

---

## Environment Variables

### .env.local
```env
# Database (Local PostgreSQL)
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/resilearn?schema=public"

# หรือถ้าสร้าง user แยก:
# DATABASE_URL="postgresql://resilearn_user:your_password@localhost:5432/resilearn?schema=public"

# สำหรับ Cloud Services (ถ้า deploy จริง):
# Supabase: ใช้ Connection String จาก Supabase Dashboard
# Neon: ใช้ Connection String จาก Neon Dashboard

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Google Classroom API
GOOGLE_CLASSROOM_API_KEY="your-api-key"
```

---


## Learning Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth.js Docs](https://next-auth.js.org)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Query Docs](https://tanstack.com/query/latest)
- [Zod Docs](https://zod.dev)


---

## Tips

1. **เริ่มต้นด้วย shadcn/ui** - Copy components ทีละตัวตามที่ใช้
2. **ใช้ Prisma Studio** - สำหรับดู/แก้ไขข้อมูล
3. **ใช้ React Query DevTools** - สำหรับ debug queries
4. **Setup ESLint rules** - สำหรับ code quality
5. **ใช้ TypeScript strict mode** - ช่วยลด bugs

---


