import { Request, Response } from 'express';
import { resourceService } from '../services/resource.service';

export class ResourceController {
  async getCategories(req: Request, res: Response) {
    try {
      const companyId = req.query.companyId as string | undefined;
      const data = await resourceService.getCategories(companyId);
      res.json({ success: true, data });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: 'Failed to fetch categories' });
    }
  }

  async getCompanies(_req: Request, res: Response) {
    try {
      const data = await resourceService.getCompanies();
      res.json({ success: true, data });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: 'Failed to fetch companies' });
    }
  }

  async getTeams(req: Request, res: Response) {
    try {
      const companyId = req.query.companyId as string | undefined;
      const data = await resourceService.getTeams(companyId);
      res.json({ success: true, data });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: 'Failed to fetch teams' });
    }
  }

  async getUsers(req: Request, res: Response) {
    try {
      const companyId = req.query.companyId as string | undefined;
      const data = await resourceService.getUsers(companyId);
      res.json({ success: true, data });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: 'Failed to fetch users' });
    }
  }

  async getWorkCenters(req: Request, res: Response) {
    try {
      const companyId = req.query.companyId as string | undefined;
      const data = await resourceService.getWorkCenters(companyId);
      res.json({ success: true, data });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: 'Failed to fetch work centers' });
    }
  }
}

export const resourceController = new ResourceController();
