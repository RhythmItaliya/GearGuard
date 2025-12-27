import { Request, Response } from 'express';
import { equipmentService } from '../services/equipment.service';

export class EquipmentController {
  async getAll(req: Request, res: Response) {
    try {
      const companyId = req.query.companyId as string | undefined;
      const data = await equipmentService.getAll(companyId);
      res.json({ success: true, data });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: 'Failed to fetch equipment' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const data = await equipmentService.create(req.body);
      res.json({ success: true, data });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: 'Failed to create equipment' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = await equipmentService.update(id, req.body);
      res.json({ success: true, data });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: 'Failed to update equipment' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await equipmentService.delete(id);
      res.json({ success: true, message: 'Equipment deleted' });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: 'Failed to delete equipment' });
    }
  }
}

export const equipmentController = new EquipmentController();
