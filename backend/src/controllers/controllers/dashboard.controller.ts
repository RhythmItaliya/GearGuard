import { Request, Response } from 'express';
import { dashboardService } from '../services/dashboard.service';

export class DashboardController {
  // Get dashboard stats
  async getStats(req: Request, res: Response): Promise<Response> {
    try {
      const companyId = req.query.companyId as string | undefined;
      const stats = await dashboardService.getStats(companyId);

      return res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({
          success: false,
          message: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  // Get recent requests
  async getRecentRequests(req: Request, res: Response): Promise<Response> {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const requests = await dashboardService.getRecentRequests(limit);

      return res.status(200).json({
        success: true,
        data: requests,
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({
          success: false,
          message: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
}

export const dashboardController = new DashboardController();
