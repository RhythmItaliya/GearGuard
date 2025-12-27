# Frontend - GearGuard

Next.js frontend for the GearGuard application.

## 🛠️ Setup

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env` file:

   ```env
   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET="9H3+sfD8oLvHsLoVwAGLcXSS5EQYtxbbAZXdns7wjGg"

   # API Configuration
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_APP_ENV=development
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

## 📜 Scripts

- `npm run dev`: Start dev server
- `npm run build`: Build for production
- `npm start`: Start production server
- `npm run lint`: Run ESLint
- `npm run format`: Format code with Prettier
