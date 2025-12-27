import { Router } from 'express';
import { workCenterController } from '../controllers/work-center.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { WORK_CENTER_ROUTES } from '../config/endpoints';

const router = Router();

// All work center routes require authentication
router.use(authMiddleware);

router.get(WORK_CENTER_ROUTES.LIST, (req, res) =>
  workCenterController.getAll(req, res)
);
router.post(WORK_CENTER_ROUTES.CREATE, (req, res) =>
  workCenterController.create(req, res)
);
router.put(WORK_CENTER_ROUTES.UPDATE, (req, res) =>
  workCenterController.update(req, res)
);
router.delete(WORK_CENTER_ROUTES.DELETE, (req, res) =>
  workCenterController.delete(req, res)
);

export default router;
