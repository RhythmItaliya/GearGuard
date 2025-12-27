import { Request, Response } from 'express';
import { companyService } from '../services/company.service';
import { createCompanySchema, updateCompanySchema } from '../validators/index';
import { ZodError } from 'zod';

export class CompanyController {
  async getAll(_req: Request, res: Response): Promise<Response> {
    try {
      const companies = await companyService.getAll();
      return res.status(200).json({
        success: true,
        data: companies,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch companies',
      });
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const company = await companyService.getById(id);
      if (!company) {
        return res.status(404).json({
          success: false,
          message: 'Company not found',
        });
      }
      return res.status(200).json({
        success: true,
        data: company,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch company',
      });
    }
  }

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const validatedData = createCompanySchema.parse(req.body);
      const company = await companyService.create(validatedData);
      return res.status(201).json({
        success: true,
        message: 'Company created successfully',
        data: company,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.issues,
        });
      }
      return res.status(500).json({
        success: false,
        message: 'Failed to create company',
      });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const validatedData = updateCompanySchema.parse(req.body);
      const company = await companyService.update(id, validatedData);
      return res.status(200).json({
        success: true,
        message: 'Company updated successfully',
        data: company,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.issues,
        });
      }
      return res.status(500).json({
        success: false,
        message: 'Failed to update company',
      });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      await companyService.delete(id);
      return res.status(200).json({
        success: true,
        message: 'Company deleted successfully',
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete company',
      });
    }
  }
}

export const companyController = new CompanyController();
