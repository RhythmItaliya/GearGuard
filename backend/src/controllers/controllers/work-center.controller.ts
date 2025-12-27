import { Request, Response } from 'express';
import { workCenterService } from '../services/work-center.service';

export class WorkCenterController {
  async getAll(req: Request, res: Response) {
    try {
      const companyId = req.query.companyId as string | undefined;
      const data = await workCenterService.getAll(companyId);
      res.json({ success: true, data });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: 'Failed to fetch work centers' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const data = await workCenterService.create(req.body);
      res.json({ success: true, data });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: 'Failed to create work center' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = await workCenterService.update(id, req.body);
      res.json({ success: true, data });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: 'Failed to update work center' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await workCenterService.delete(id);
      res.json({ success: true, message: 'Work center deleted' });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: 'Failed to delete work center' });
    }
  }
}

export const workCenterController = new WorkCenterController();
