import { Router } from 'express';
import { resourceController } from '../controllers/resource.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { RESOURCE_ROUTES } from '../config/endpoints';

const router = Router();

// All resource routes require authentication
router.use(authMiddleware);

router.get(RESOURCE_ROUTES.CATEGORIES, (req, res) =>
  resourceController.getCategories(req, res)
);
router.get(RESOURCE_ROUTES.COMPANIES, (req, res) =>
  resourceController.getCompanies(req, res)
);
router.get(RESOURCE_ROUTES.TEAMS, (req, res) =>
  resourceController.getTeams(req, res)
);
router.get(RESOURCE_ROUTES.USERS, (req, res) =>
  resourceController.getUsers(req, res)
);
router.get(RESOURCE_ROUTES.WORK_CENTERS, (req, res) =>
  resourceController.getWorkCenters(req, res)
);

export default router;
