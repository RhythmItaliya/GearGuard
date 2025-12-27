import { Router } from 'express';
import { teamController } from '../controllers/team.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { TEAM_ROUTES } from '../config/endpoints';

const router = Router();

// All team routes require authentication
router.use(authMiddleware);

router.get(TEAM_ROUTES.LIST, (req, res) => teamController.getAll(req, res));
router.post(TEAM_ROUTES.CREATE, (req, res) => teamController.create(req, res));
router.put(TEAM_ROUTES.UPDATE, (req, res) => teamController.update(req, res));
router.delete(TEAM_ROUTES.DELETE, (req, res) =>
  teamController.delete(req, res)
);
router.post(TEAM_ROUTES.ADD_MEMBER, (req, res) =>
  teamController.addMember(req, res)
);
router.delete(TEAM_ROUTES.REMOVE_MEMBER, (req, res) =>
  teamController.removeMember(req, res)
);

export default router;
