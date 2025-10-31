# ResiLearn - Resistor Reading Training System

ระบบฝึกอ่านค่าตัวต้านทานแบบ Progressive Learning พร้อม LMS Integration

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- Docker Desktop (for PostgreSQL)
- npm หรือ pnpm

### 1. Clone Repository

```bash
git clone <repository-url>
cd ResiLearn
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

สร้างไฟล์ `.env.local` จาก template:

```bash
cp .env.example .env.local
```

แก้ไข `.env.local`:
```env
# Database (Docker Compose)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/resilearn?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Generate secret: openssl rand -base64 32
```

### 4. Start PostgreSQL (Docker Compose)

```bash
npm run docker:up
```

หรือใช้ docker-compose โดยตรง:
```bash
docker-compose up -d
```

### 5. Setup Database

```bash
# Generate Prisma Client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database (create 7 levels)
npm run db:seed
```

### 6. Start Development Server

```bash
npm run dev
```

เปิดเบราว์เซอร์ไปที่ [http://localhost:3000](http://localhost:3000)

---

## 📚 Documentation

- [Documentation/](./Documentation/) - Full project documentation
  - [Docker Setup Guide](./Documentation/guides/DOCKER_SETUP.md) - Docker Compose setup guide
  - [Environment Setup Guide](./Documentation/guides/ENV_SETUP.md) - Environment variables setup guide
  - [Prisma Guide](./Documentation/guides/PRISMA_GUIDE.md) - Prisma database guide

---

## 🛠️ Available Scripts

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

### Database
```bash
npm run db:generate  # Generate Prisma Client
npm run db:push      # Push schema to database (dev)
npm run db:migrate   # Run migrations
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed database with initial data
```

### Docker
```bash
npm run docker:up    # Start PostgreSQL container
npm run docker:down  # Stop PostgreSQL container
npm run docker:logs  # View PostgreSQL logs
npm run docker:reset # Reset database (delete all data)
```

---

## 🗂️ Project Structure

```
ResiLearn/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth routes
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard page
│   ├── learn/             # Learning Path
│   └── ...
├── components/            # React components
├── lib/                   # Utility libraries
├── prisma/               # Database schema
├── public/               # Static assets
└── Documentation/        # Project docs
```

---

## 🐳 Docker Compose

PostgreSQL ทำงานใน Docker container

**Start:**
```bash
docker-compose up -d
```

**Stop:**
```bash
docker-compose down
```

**View Logs:**
```bash
docker-compose logs -f postgres
```

**Reset Database:**
```bash
docker-compose down -v
docker-compose up -d
npm run db:migrate
npm run db:seed
```

ดูรายละเอียดเพิ่มเติมที่ [Docker Setup Guide](./Documentation/guides/DOCKER_SETUP.md)

---

## 📋 Milestones

- ✅ **Milestone 1:** Foundation Setup (ใน Progress)
- ⏳ **Milestone 2:** Resistor System + Learning Path
- ⏳ **Milestone 3:** Practice & Quiz Modes
- ⏳ **Milestone 4:** Results & Dashboard
- ⏳ **Milestone 5:** LMS Foundation
- ⏳ **Milestone 6:** Integration & Polish
- ⏳ **Milestone 7:** Google Classroom
- ⏳ **Milestone 8:** Final Polish & Deploy

ดูรายละเอียดที่ [Documentation/implementation.md](./Documentation/implementation.md)

---

## 🆘 Troubleshooting

### Database Connection Error

1. ตรวจสอบว่า Docker container รันอยู่:
   ```bash
   docker-compose ps
   ```

2. ตรวจสอบ logs:
   ```bash
   docker-compose logs postgres
   ```

3. Restart container:
   ```bash
   docker-compose restart postgres
   ```

### Prisma Errors

1. Regenerate Prisma Client:
   ```bash
   npm run db:generate
   ```

2. Check database connection:
   ```bash
   docker-compose exec postgres psql -U postgres -d resilearn
   ```

---

## 📖 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** PostgreSQL 15 (Docker)
- **ORM:** Prisma
- **Authentication:** NextAuth.js v5
- **Styling:** Tailwind CSS 4
- **Language:** TypeScript

---

## 📝 License

MIT

---

## 🙏 Contributing

Contributions welcome! Please read the documentation first.
