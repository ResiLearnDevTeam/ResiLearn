# Documentation - ResiLearn Project

เอกสารสำหรับโปรเจ็ค **ResiLearn - Resistor Reading Training System**

## ไฟล์ในโฟลเดอร์นี้

### 1. `system-design.md`
**ระบบรวมทั้ง Progressive Learning + LMS**
- ภาพรวมระบบทั้งหมด
- Dual Mode System (Self-Learning + Course Mode)
- หน้าทั้งหมดของระบบ
- Database Schema (Integrated)
- Feature Priority
- User Flows (Integrated)
- **อ่านไฟล์นี้ก่อนเพื่อเข้าใจระบบทั้งหมด**

### 2. `learning-system.md`
**ระบบ Progressive Learning**
- 7 Levels (ง่าย → ยาก)
- Unlock System
- Practice Mode + Quiz Mode
- Resistor Visualization System
- Progress Tracking
- **รายละเอียด Progressive Learning System**

### 3. `classroom-learning.md`
**ระบบ Classroom Learning (LMS)**
- Course Management (สร้าง/จัดการคอร์ส)
- Assignment System (กำหนด Assignment)
- Enrollment System (ลงทะเบียนนักเรียน)
- Announcement System (ประกาศ)
- Progress Tracking (ติดตามความคืบหน้า)
- Google Classroom Integration
- **โครงสร้างไฟล์และรายละเอียด Classroom Learning System**

### 4. `implementation.md`
**แผนการพัฒนา**
- 8 Milestones (Week 1-8)
- Component Priority
- Page Implementation Order
- **แผนพัฒนาโปรเจ็คทีละขั้น**

### 5. `tech-stack.md`
**Tech Stack ครบถ้วน**
- Next.js 14 + Modern Stack
- Database (PostgreSQL + Prisma)
- Authentication (NextAuth.js)
- UI Framework (Tailwind + shadcn/ui)
- State Management
- Forms & Validation
- Google Classroom Integration
- Complete package.json
- Configuration files
- **Tech stack ที่แนะนำสำหรับโปรเจ็ค**

### 6. `timeline.md`
**Timeline รายละเอียด 8 สัปดาห์**
- 8 Milestones overview
- Milestone details (tasks, deliverables, success criteria)
- Risk mitigation
- Fast track strategies
- **แผนการพัฒนาราย milestone สำหรับ 2 เดือน**

### 7. `guides/` - Setup Guides
**คู่มือการตั้งค่าและใช้งาน**
- [Docker Setup Guide](./guides/DOCKER_SETUP.md) - Docker Compose setup
- [Environment Setup Guide](./guides/ENV_SETUP.md) - Environment variables
- [Prisma Guide](./guides/PRISMA_GUIDE.md) - Prisma database guide
- **คู่มือสำหรับการตั้งค่าโปรเจ็ค**

---

## Quick Start

### 1. อ่านเพื่อเข้าใจระบบ:
 `system-design.md` - ภาพรวมทั้งหมด

### 2. ดูรายละเอียด Progressive Learning:
 `learning-system.md` - Progressive Learning System

### 3. ดูรายละเอียด Classroom Learning:
 `classroom-learning.md` - Classroom Learning System (LMS)

### 4. ดู Tech Stack:
 `tech-stack.md` - เทคโนโลยีที่จะใช้

### 5. ดู Timeline:
 `timeline.md` - Timeline รายละเอียด (2 เดือน)

### 6. เริ่มพัฒนา:
 `implementation.md` - แผนการพัฒนา (overview)
---

## Core Systems

1. **Progressive Learning** - 7 levels, unlock system
2. **LMS** - Course management, student tracking
3. **Google Classroom** - Full integration
