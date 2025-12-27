import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { LoginInput, RegisterInput } from '../validators/index';

const prisma = new PrismaClient();

export class AuthService {
  // Register new user
  async register(data: RegisterInput) {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        fullName: data.fullName || null,
        role: 'user',
      },
    });

    const token = this.generateToken(user.id, user.email);

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      token,
    };
  }

  // Login user
  async login(data: LoginInput) {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken(user.id, user.email);

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      token,
    };
  }

  // Get user profile
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        companies: {
          include: {
            company: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Remove password from returned object
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Generate JWT token
  private generateToken(userId: string, email: string): string {
    return jwt.sign({ userId, email }, env.JWT_SECRET, { expiresIn: '7d' });
  }

  // Verify JWT token
  verifyToken(token: string): { userId: string; email: string } {
    try {
      return jwt.verify(token, env.JWT_SECRET) as {
        userId: string;
        email: string;
      };
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}

export const authService = new AuthService();
