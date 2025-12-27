import { Router } from 'express';
import { maintenanceController } from '../controllers/maintenance.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { MAINTENANCE_ROUTES } from '../config/endpoints';

const router = Router();

// All maintenance routes require authentication
router.use(authMiddleware);

router.get(MAINTENANCE_ROUTES.LIST, (req, res) =>
  maintenanceController.getAll(req, res)
);
router.post(MAINTENANCE_ROUTES.CREATE, (req, res) =>
  maintenanceController.create(req, res)
);
router.put(MAINTENANCE_ROUTES.UPDATE, (req, res) =>
  maintenanceController.update(req, res)
);
router.delete(MAINTENANCE_ROUTES.DELETE, (req, res) =>
  maintenanceController.delete(req, res)
);

export default router;
