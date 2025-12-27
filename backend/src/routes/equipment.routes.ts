import { Router } from 'express';
import { equipmentController } from '../controllers/equipment.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { EQUIPMENT_ROUTES } from '../config/endpoints';

const router = Router();

// All equipment routes require authentication
router.use(authMiddleware);

router.get(EQUIPMENT_ROUTES.LIST, (req, res) =>
  equipmentController.getAll(req, res)
);
router.post(EQUIPMENT_ROUTES.CREATE, (req, res) =>
  equipmentController.create(req, res)
);
router.put(EQUIPMENT_ROUTES.UPDATE, (req, res) =>
  equipmentController.update(req, res)
);
router.delete(EQUIPMENT_ROUTES.DELETE, (req, res) =>
  equipmentController.delete(req, res)
);

export default router;
