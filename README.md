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
- `DATABASE_URL`: Your PostgreSQL connection string
- `JWT_SECRET`: Secret for JWT signing (e.g., `openssl rand -base64 32`)
- `PORT`: Server port (default: 8080)
- `FRONTEND_URL`: URL of the frontend (default: http://localhost:3000)

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
- `NEXT_PUBLIC_API_URL`: URL of the backend API (default: http://localhost:8080/api)
- `NEXTAUTH_SECRET`: Secret for NextAuth (e.g., `openssl rand -base64 32`)
- `NEXTAUTH_URL`: URL of the frontend (default: http://localhost:3000)

```bash
npm run dev
```

## 🛠️ Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, Prisma
- **Database**: PostgreSQL
