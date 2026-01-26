# ResiLearn - Tech Stack (Mermaid Diagrams)

---

## ฉบับย่อ (สำหรับกรรมการ)

**สรุปหนึ่งบรรทัด:** ใช้ **Next.js + React** ทำเว็บ, **PostgreSQL** เก็บข้อมูล, **NextAuth** จัดการล็อกอิน, **Prisma** คุยกับฐานข้อมูล, **Google Classroom API** ซิงค์ชั้นเรียน และ **Three.js** แสดงตัวต้านทาน 3 มิติ

```mermaid
flowchart TB
  subgraph ฝั่งผู้ใช้["🖥️ ฝั่งผู้ใช้ (เว็บ)"]
    A[Next.js + React<br/>เว็บแอปหลัก]
    B[Tailwind + shadcn/ui<br/>หน้าตาและปุ่ม]
    C[Three.js<br/>โมเดล 3D ตัวต้านทาน]
  end

  subgraph ฝั่งเซิร์ฟเวอร์["⚙️ ฝั่งเซิร์ฟเวอร์"]
    D[NextAuth<br/>ล็อกอิน / บัญชี]
    E[Prisma<br/>จัดการข้อมูล]
  end

  subgraph ข้อมูล["🗄️ ข้อมูล"]
    F[(PostgreSQL<br/>ฐานข้อมูล)]
  end

  subgraph เสริม["🔌 บริการภายนอก"]
    G[Google Classroom<br/>ซิงค์งาน/ชั้นเรียน]
  end

  ฝั่งผู้ใช้ --> ฝั่งเซิร์ฟเวอร์
  ฝั่งเซิร์ฟเวอร์ --> ข้อมูล
  ฝั่งเซิร์ฟเวอร์ --> เสริม
```

| ชั้น | เทคโนโลยี | หน้าที่โดยย่อ |
|-----|-----------|----------------|
| **เว็บ (Frontend)** | Next.js 16, React 19 | ฟрейมเวิร์กเว็บหลัก |
| | Tailwind CSS, shadcn/ui | ดีไซน์และคอมโพเนนต์ UI |
| | Three.js | แสดงโมเดล 3D ตัวต้านทาน |
| | Recharts | กราฟวิเคราะห์/สถิติ |
| **เซิร์ฟเวอร์ (Backend)** | NextAuth | ล็อกอิน (อีเมล, Google) |
| | Prisma | อ่าน/เขียนฐานข้อมูลแบบ type-safe |
| **ฐานข้อมูล** | PostgreSQL 15 | เก็บผู้ใช้, คอร์ส, ความคืบหน้า, ปฏิบัติ |
| **เชื่อมต่อภายนอก** | Google Classroom API | ซิงค์ชั้นเรียนและงาน |
| **เครื่องมือพัฒนา** | TypeScript, Docker | โค้ด type-safe, รัน DB ในคอนเทนเนอร์ |

---

## 1. สรุปภาพรวม Tech Stack (Block Diagram)

```mermaid
block-beta
  columns 4

  block:Frontend:4
    columns 2
    block:Core:2
      NextJS["Next.js 16<br/>App Router"]
      React["React 19"]
    end
    block:UI:2
      Tailwind["Tailwind CSS 4"]
      Shadcn["shadcn/ui<br/>(Radix UI)"]
    end
  end

  block:Backend:4
    columns 2
    NextAuth["NextAuth.js v5<br/>(Auth.js)"]
    Prisma["Prisma ORM"]
  end

  block:Data:4
    PostgreSQL["PostgreSQL 15"]
  end

  block:Infra:4
    Docker["Docker Compose"]
    pgAdmin["pgAdmin 4"]
  end
```

---

## 2. Tech Stack แบบแบ่งชั้น (Flowchart - สมบูรณ์)

```mermaid
flowchart TB
  subgraph presentation["🖥️ Presentation Layer (Frontend)"]
    direction TB
    subgraph core["Core Framework"]
      NextJS["Next.js 16.0.1"]
      React["React 19.2.0"]
      ReactDOM["React DOM 19.2.0"]
    end

    subgraph styling["Styling & UI"]
      Tailwind["Tailwind CSS 4"]
      Shadcn["shadcn/ui (new-york)"]
      Radix["@radix-ui/react-dialog"]
      CVA["class-variance-authority"]
      clsx["clsx"]
      tailwindMerge["tailwind-merge"]
      typography["@tailwindcss/typography"]
    end

    subgraph icons["Icons & Assets"]
      Lucide["lucide-react"]
    end

    subgraph animation["Animation & 3D"]
      FramerMotion["framer-motion"]
      FramerMotion3D["framer-motion-3d"]
      Three["three.js"]
      R3F["@react-three/fiber"]
      Drei["@react-three/drei"]
      R3Spring["@react-three/postprocessing"]
      ReactSpring["react-spring"]
      R3SpringThree["@react-spring/three"]
      R3A11y["@react-three/a11y"]
      UseGesture["@use-gesture/react"]
      useGesture["use-gesture"]
      Lamina["lamina"]
      Maath["maath"]
    end

    subgraph charts["Charts & Visualization"]
      Recharts["recharts"]
    end

    subgraph forms["Forms & Validation"]
      RHF["react-hook-form"]
      Zod["zod"]
      HookformResolvers["@hookform/resolvers"]
    end

    subgraph richText["Rich Text & Markdown"]
      Tiptap["@tiptap/react"]
      TiptapStarter["@tiptap/starter-kit"]
      ReactMarkdown["react-markdown"]
      RemarkGfm["remark-gfm"]
      RehypeRaw["rehype-raw"]
    end

    subgraph state["State Management"]
      Zustand["zustand"]
      TanStackQuery["@tanstack/react-query"]
      TanStackTable["@tanstack/react-table"]
    end

    subgraph utils["Utilities & UX"]
      dateFns["date-fns"]
      Confetti["canvas-confetti"]
      DOMPurify["dompurify"]
      Sonner["sonner"]
      Nanoid["nanoid"]
      BadWords["bad-words"]
    end

    subgraph documents["Document Processing"]
      Docx["docx"]
      Mammoth["mammoth"]
    end
  end

  subgraph application["⚙️ Application Layer (Backend)"]
    NextAPI["Next.js API Routes"]
    NextAuth["NextAuth.js v5 (Auth.js)"]
    AuthPrisma["@auth/prisma-adapter"]
    Bcrypt["bcryptjs"]
  end

  subgraph data["🗄️ Data Layer"]
    Prisma["Prisma 6.x"]
    PostgreSQL["PostgreSQL 15"]
  end

  subgraph external["🔌 External Services"]
    GoogleAPIs["googleapis<br/>(Google Classroom)"]
  end

  subgraph infra["🐳 Infrastructure & DevOps"]
    Docker["Docker Compose"]
    pgAdmin["pgAdmin 4"]
  end

  subgraph dev["🛠️ Development & Tooling"]
    TypeScript["TypeScript 5"]
    ESLint["ESLint 9"]
    TSX["tsx"]
    PrismaCLI["Prisma CLI"]
    GltfJsx["@react-three/gltfjsx"]
    Leva["leva"]
    TwAnimate["tw-animate-css"]
    Dotenv["dotenv / dotenv-cli"]
  end

  presentation --> application
  application --> data
  application --> external
  data --> infra
```

---

## 3. Tech Stack แบบ Mind Map (ลำดับชั้น)

```mermaid
mindmap
  root((ResiLearn<br/>Tech Stack))

  Frontend
    Framework
      Next.js 16
      React 19
      App Router
    Styling
      Tailwind CSS 4
      shadcn/ui
      Radix UI
      CVA, clsx, tailwind-merge
    Animation & 3D
      Framer Motion
      Three.js
      React Three Fiber
      Drei, PostProcessing
      react-spring
      lamina, maath
    Data & State
      TanStack Query
      TanStack Table
      Zustand
    Forms & Validation
      React Hook Form
      Zod
      @hookform/resolvers
    Content
      Tiptap
      react-markdown
      remark-gfm, rehype-raw
    Charts & UX
      Recharts
      lucide-react
      canvas-confetti
      sonner
      date-fns
    Documents
      docx
      mammoth
    Security & Utils
      DOMPurify
      bcryptjs
      bad-words
      nanoid

  Backend
    Auth
      NextAuth.js v5
      @auth/prisma-adapter
      bcryptjs
    API
      Next.js API Routes
      Server Actions

  Data
    ORM
      Prisma 6.x
    Database
      PostgreSQL 15

  Integration
    Google
      googleapis
      Google Classroom API

  Infrastructure
    Docker
      postgres:15-alpine
      pgAdmin 4
    Volumes
      postgres_data
      pgadmin_data

  DevTools
    TypeScript 5
    ESLint 9
    tsx
    Prisma Studio
    @react-three/gltfjsx
    leva
```

---

## 4. สถาปัตยกรรมแบบง่าย (C4-style)

```mermaid
flowchart LR
  subgraph Users
    Student[นักเรียน]
    Teacher[ครู]
  end

  subgraph ResiLearn["ResiLearn System"]
    subgraph Browser["Browser"]
      NextJS[Next.js 16<br/>React 19]
      Tailwind[Tailwind<br/>shadcn/ui]
      R3F[Three.js / R3F]
    end

    subgraph Server["Next.js Server"]
      API[API Routes]
      Auth[NextAuth]
      Prisma[Prisma]
    end
  end

  subgraph Data["Data"]
    PostgreSQL[(PostgreSQL 15)]
  end

  subgraph External["External"]
    Google[Google Classroom API]
  end

  Student --> Browser
  Teacher --> Browser
  Browser <--> Server
  Server <--> PostgreSQL
  Server <--> Google
```

---

## 5. ตาราง Dependencies หลัก (อ้างอิงจาก package.json)

| หมวด | Package | เวอร์ชัน | หน้าที่ |
|------|---------|----------|---------|
| **Core** | next | 16.0.1 | Full-stack framework, App Router |
| | react, react-dom | 19.2.0 | UI library |
| **Auth** | next-auth | 5.0.0-beta.30 | Authentication |
| | @auth/prisma-adapter | ^2.11.1 | Prisma session adapter |
| | bcryptjs | ^3.0.2 | Password hashing |
| **Data** | @prisma/client | ^6.18.0 | ORM, type-safe DB client |
| **UI/Styling** | tailwindcss | ^4 | Utility-first CSS |
| | @radix-ui/react-dialog | ^1.1.15 | Accessible primitives |
| | @tailwindcss/typography | ^0.5.19 | Prose styles |
| | class-variance-authority | ^0.7.1 | Component variants |
| | clsx | ^2.1.1 | Class names |
| | tailwind-merge | ^3.4.0 | Merge Tailwind classes |
| **3D & Animation** | three | ^0.181.0 | WebGL/3D |
| | @react-three/fiber | ^9.4.0 | React renderer for Three |
| | @react-three/drei | ^10.7.6 | Helpers |
| | @react-three/postprocessing | ^3.0.4 | Effects |
| | @react-spring/three | ^10.0.3 | Physics-based animation |
| | framer-motion | ^12.23.24 | Animations |
| | framer-motion-3d | ^12.4.13 | 3D motion |
| | lamina | ^1.2.2 | Layered materials (Three) |
| | maath | ^0.10.8 | Math utilities (3D) |
| **Forms** | react-hook-form | ^7.65.0 | Form state |
| | zod | ^4.1.12 | Schema validation |
| | @hookform/resolvers | ^5.2.2 | RHF + Zod |
| **State & Data Fetching** | @tanstack/react-query | ^5.90.5 | Server state, cache |
| | @tanstack/react-table | ^8.21.3 | Tables, sorting, filter |
| | zustand | ^5.0.8 | Client state |
| **Rich Text** | @tiptap/react | ^2.1.13 | Editor |
| | @tiptap/starter-kit | ^2.1.13 | Extensions |
| **Markdown** | react-markdown | ^10.1.0 | Render Markdown |
| | remark-gfm | ^4.0.1 | GFM (tables, etc.) |
| | rehype-raw | ^7.0.0 | Raw HTML in MD |
| **Charts** | recharts | ^3.3.0 | Charts |
| **Integration** | googleapis | ^164.1.0 | Google Classroom |
| **Utils** | date-fns | ^4.1.0 | Date formatting |
| | docx | ^8.5.0 | Word export |
| | mammoth | ^1.6.0 | Word import |
| | dompurify | ^3.0.6 | XSS sanitization |
| | nanoid | ^5.1.6 | IDs |
| | bad-words | ^4.0.0 | Profanity filter |
| | canvas-confetti | ^1.9.4 | Confetti effect |
| | sonner | ^2.0.7 | Toasts |
| | lucide-react | ^0.552.0 | Icons |

---

## 6. Database Schema (Prisma Models - สรุป)

```mermaid
erDiagram
  User ||--o{ Account : has
  User ||--o{ Session : has
  User ||--o{ Enrollment : has
  User ||--o{ LevelAttempt : has
  User ||--o{ PracticeSession : has
  User ||--o{ PracticePreset : has
  User ||--o{ LessonProgress : has
  User ||--o{ ModuleProgress : has
  User ||--o{ Course : creates
  User ||--o{ ClassroomStudent : has

  Course ||--o{ Enrollment : has
  Course ||--o{ CourseAssignment : has
  Course ||--o{ Announcement : has
  Course ||--o{ GoogleClassroomSync : "syncs with"
  Course ||--o{ LevelAttempt : has
  Course ||--o{ PracticeSession : has
  Course ||--o{ LessonProgress : has
  Course ||--o{ ModuleProgress : has

  Level ||--o{ LevelAttempt : has
  Level ||--o{ CourseAssignment : has

  Module ||--o{ Lesson : contains
  Module ||--o{ ModuleProgress : has

  Lesson ||--o{ LessonProgress : has
  Lesson ||--o{ LessonHeroStat : has
  Lesson ||--o{ LessonObjective : has
  Lesson ||--o{ LessonSection : has
  Lesson ||--o{ LessonQuizQuestion : has
  Lesson ||--o{ LessonPracticeLink : has
  Lesson ||--o{ LessonResource : has

  PracticePreset ||--o{ PracticeSession : has

  User {
    string id
    string email
    string name
    string role
  }

  Course {
    string id
    string name
    string code
    string teacherId
  }

  Level {
    string id
    int number
    string name
  }

  Module {
    string id
    string title
    int order
  }

  Lesson {
    string id
    string moduleId
    string title
    string content
  }
```

---

## 7. Infrastructure (Docker)

```mermaid
flowchart TB
  subgraph Docker["Docker Compose"]
    subgraph postgres["Service: postgres"]
      PG["postgres:15-alpine<br/>Port: 5432<br/>DB: resilearn"]
    end

    subgraph pgadmin["Service: pgadmin"]
      PGA["dpage/pgadmin4<br/>Port: 5050"]
    end

    subgraph volumes["Volumes"]
      V1[postgres_data]
      V2[pgadmin_data]
    end
  end

  NextJS["Next.js App"] -->|DATABASE_URL| PG
  PGA -->|manage| PG
```

---

## 8. การใช้ Diagram ใน Markdown / Notion / Confluence

- **Mermaid Live Editor:** https://mermaid.live  
- **VS Code:** ใช้ extension "Markdown Preview Mermaid Support" หรือ "Mermaid"  
- **GitHub / GitLab:** รองรับ Mermaid ใน Markdown โดยตรง  
- **Notion:** ใช้ /code และเลือก Mermaid หรือใช้ block จากบริการ Mermaid

---

*อัปเดตจาก `package.json`, `prisma/schema.prisma`, `docker-compose.yml` และ `Documentation/tech-stack.md` (ม.ค. 2025)*
