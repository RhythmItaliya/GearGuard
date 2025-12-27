import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { loginSchema, registerSchema } from '../validators/index';
import { ZodError } from 'zod';

export class AuthController {
  // Register new user
  async register(req: Request, res: Response): Promise<Response> {
    try {
      const validatedData = registerSchema.parse(req.body);
      const result = await authService.register(validatedData);

      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result,
      });
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.issues,
        });
      }

      if (error instanceof Error) {
        if (error.message.includes('already exists')) {
          return res.status(409).json({
            success: false,
            message: error.message,
          });
        }

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

  // Login user
  async login(req: Request, res: Response): Promise<Response> {
    try {
      const validatedData = loginSchema.parse(req.body);
      const result = await authService.login(validatedData);

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result,
      });
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.issues,
        });
      }

      if (error instanceof Error) {
        if (error.message.includes('Invalid credentials')) {
          return res.status(401).json({
            success: false,
            message: 'Invalid email or password',
          });
        }

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

  // Get current user profile
  async me(req: Request, res: Response): Promise<Response> {
    try {
      const userId = (req as any).userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const profile = await authService.getProfile(userId);

      return res.status(200).json({
        success: true,
        data: profile,
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(404).json({
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

  // Logout
  async logout(_req: Request, res: Response): Promise<Response> {
    return res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  }
}

export const authController = new AuthController();
