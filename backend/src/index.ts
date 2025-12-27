import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { env } from './config/env';
import authRoutes from './routes/auth.routes';
import dashboardRoutes from './routes/dashboard.routes';
import equipmentRoutes from './routes/equipment.routes';
import resourceRoutes from './routes/resource.routes';
import maintenanceRoutes from './routes/maintenance.routes';
import workCenterRoutes from './routes/work-center.routes';
import teamRoutes from './routes/team.routes';
import categoryRoutes from './routes/category.routes';
import companyRoutes from './routes/company.routes';
import {
  API_PREFIX,
  AUTH_ROUTES,
  DASHBOARD_ROUTES,
  EQUIPMENT_ROUTES,
  RESOURCE_ROUTES,
  MAINTENANCE_ROUTES,
  WORK_CENTER_ROUTES,
  TEAM_ROUTES,
  CATEGORY_ROUTES,
  COMPANY_ROUTES,
} from './config/endpoints';

const app: Application = express();

// Middleware
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'Server is running', env: env.NODE_ENV });
});

// API routes
app.get(API_PREFIX, (_req: Request, res: Response) => {
  res.json({ message: 'GearGuard API', version: '1.0.0' });
});

app.use(`${API_PREFIX}${AUTH_ROUTES.BASE}`, authRoutes);
app.use(`${API_PREFIX}${DASHBOARD_ROUTES.BASE}`, dashboardRoutes);
app.use(`${API_PREFIX}${EQUIPMENT_ROUTES.BASE}`, equipmentRoutes);
app.use(`${API_PREFIX}${RESOURCE_ROUTES.BASE}`, resourceRoutes);
app.use(`${API_PREFIX}${MAINTENANCE_ROUTES.BASE}`, maintenanceRoutes);
app.use(`${API_PREFIX}${WORK_CENTER_ROUTES.BASE}`, workCenterRoutes);
app.use(`${API_PREFIX}${TEAM_ROUTES.BASE}`, teamRoutes);
app.use(`${API_PREFIX}${CATEGORY_ROUTES.BASE}`, categoryRoutes);
app.use(`${API_PREFIX}${COMPANY_ROUTES.BASE}`, companyRoutes);

// Start server
app.listen(env.PORT, () => {
  console.log(`Server running on http://localhost:${env.PORT}`);
  console.log(`Environment: ${env.NODE_ENV}`);
  console.log(`CORS enabled for: ${env.FRONTEND_URL}`);
});

export default app;
