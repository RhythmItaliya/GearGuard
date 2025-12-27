# Backend - GearGuard

Node.js API built with TypeScript, Express, and Prisma.

## 🛠️ Setup

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env` file:

   ```env
   # Backend Development Environment Variables
   NODE_ENV=development
   PORT=5000
   DATABASE_URL="postgresql://neondb_owner:npg_mZ9ipRWoPK0Y@ep-rapid-field-a54y2jgf-pooler.us-east-2.aws.neon.tech/GearGuard?sslmode=require&channel_binding=require"
   FRONTEND_URL=http://localhost:3000
   JWT_SECRET="Z/HiwcPJG6KnOn9S048rPaSUCdWeJNTyn2jBo+CoCIM="
   ```

3. **Database Setup**:

   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

## 📜 Scripts

- `npm run dev`: Start dev server
- `npm run build`: Build for production
- `npm start`: Start production server
- `npm run prisma:studio`: Open database GUI
