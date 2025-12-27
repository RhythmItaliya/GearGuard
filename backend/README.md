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
   DATABASE_URL="postgresql://user:password@localhost:5432/gearguard"
   PORT=5000
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
