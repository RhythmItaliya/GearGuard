import { Request, Response } from 'express';
import { teamService } from '../services/team.service';

export class TeamController {
  async getAll(req: Request, res: Response) {
    try {
      const companyId = req.query.companyId as string | undefined;
      const data = await teamService.getAll(companyId);
      res.json({ success: true, data });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: 'Failed to fetch teams' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const data = await teamService.create(req.body);
      res.json({ success: true, data });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: 'Failed to create team' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = await teamService.update(id, req.body);
      res.json({ success: true, data });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: 'Failed to update team' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await teamService.delete(id);
      res.json({ success: true, message: 'Team deleted' });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: 'Failed to delete team' });
    }
  }

  async addMember(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { userId, role } = req.body;
      const data = await teamService.addMember(id, userId, role);
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to add member' });
    }
  }

  async removeMember(req: Request, res: Response) {
    try {
      const { memberId } = req.params;
      await teamService.removeMember(memberId);
      res.json({ success: true, message: 'Member removed' });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: 'Failed to remove member' });
    }
  }
}

export const teamController = new TeamController();
