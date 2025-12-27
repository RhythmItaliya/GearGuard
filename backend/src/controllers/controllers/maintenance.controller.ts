import { Request, Response } from 'express';
import { maintenanceService } from '../services/maintenance.service';

export class MaintenanceController {
  async getAll(req: Request, res: Response) {
    try {
      const companyId = req.query.companyId as string | undefined;
      const data = await maintenanceService.getAll(companyId);
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch maintenance requests',
      });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const data = await maintenanceService.create(req.body);
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to create maintenance request',
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = await maintenanceService.update(id, req.body);
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update maintenance request',
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await maintenanceService.delete(id);
      res.json({ success: true, message: 'Maintenance request deleted' });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete maintenance request',
      });
    }
  }
}

export const maintenanceController = new MaintenanceController();
