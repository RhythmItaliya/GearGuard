import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { AUTH_ROUTES } from '../config/endpoints';

const router = Router();

// Public routes
router.post(AUTH_ROUTES.REGISTER, (req, res) =>
  authController.register(req, res)
);
router.post(AUTH_ROUTES.LOGIN, (req, res) => authController.login(req, res));

// Protected routes
router.get(AUTH_ROUTES.ME, authMiddleware, (req, res) =>
  authController.me(req, res)
);
router.post(AUTH_ROUTES.LOGOUT, authMiddleware, (req, res) =>
  authController.logout(req, res)
);

export default router;
