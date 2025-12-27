import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { DASHBOARD_ROUTES } from '../config/endpoints';

const router = Router();

// All dashboard routes require authentication
router.get(DASHBOARD_ROUTES.STATS, authMiddleware, (req, res) =>
  dashboardController.getStats(req, res)
);
router.get(DASHBOARD_ROUTES.RECENT_REQUESTS, authMiddleware, (req, res) =>
  dashboardController.getRecentRequests(req, res)
);

export default router;
