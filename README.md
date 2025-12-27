# GearGuard

## 📁 Project Structure

- `backend/`: Node.js, TypeScript, Express, Prisma, PostgreSQL
- `frontend/`: Next.js, React, Tailwind CSS

## 🚀 Quick Start

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
```
**Required Environment Variables (`backend/.env`):**
```env
# Backend Development Environment Variables
NODE_ENV=development
PORT=5000
DATABASE_URL=
FRONTEND_URL=http://localhost:3000
JWT_SECRET="Z/HiwcPJG6KnOn9S048rPaSUCdWeJNTyn2jBo+CoCIM="
```

```bash
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
```
**Required Environment Variables (`frontend/.env`):**
```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET="9H3+sfD8oLvHsLoVwAGLcXSS5EQYtxbbAZXdns7wjGg"

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_ENV=development
```

```bash
npm run dev
```

## 🛠️ Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, Prisma
- **Database**: PostgreSQL
