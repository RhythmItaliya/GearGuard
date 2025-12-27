import { Router } from 'express';
import { categoryController } from '../controllers/category.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { CATEGORY_ROUTES } from '../config/endpoints';

const router = Router();

// All category routes require authentication
router.use(authMiddleware);

router.get(CATEGORY_ROUTES.LIST, (req, res) =>
  categoryController.getAll(req, res)
);
router.post(CATEGORY_ROUTES.CREATE, (req, res) =>
  categoryController.create(req, res)
);
router.put(CATEGORY_ROUTES.UPDATE, (req, res) =>
  categoryController.update(req, res)
);
router.delete(CATEGORY_ROUTES.DELETE, (req, res) =>
  categoryController.delete(req, res)
);

export default router;
