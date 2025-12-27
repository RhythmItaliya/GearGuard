import { Request, Response } from 'express';
import { categoryService } from '../services/category.service';

export class CategoryController {
  async getAll(req: Request, res: Response) {
    try {
      const companyId = req.query.companyId as string | undefined;
      const data = await categoryService.getAll(companyId);
      res.json({ success: true, data });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: 'Failed to fetch categories' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const data = await categoryService.create(req.body);
      res.json({ success: true, data });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: 'Failed to create category' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = await categoryService.update(id, req.body);
      res.json({ success: true, data });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: 'Failed to update category' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await categoryService.delete(id);
      res.json({ success: true, message: 'Category deleted' });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: 'Failed to delete category' });
    }
  }
}

export const categoryController = new CategoryController();
