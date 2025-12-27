import { z } from 'zod';

// Auth validation schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/, 'Password must contain a lowercase letter')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[0-9]/, 'Password must contain a number'),
  fullName: z.string().min(1, 'Full name is required').optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

// Profile validation schemas
export const createProfileSchema = z.object({
  userId: z.string().uuid(),
  email: z.string().email(),
  fullName: z.string().optional().nullable(),
  role: z.string().default('user'),
});

export const updateProfileSchema = z.object({
  email: z.string().email().optional(),
  fullName: z.string().optional().nullable(),
  role: z.string().optional(),
});

// Company validation schemas
export const createCompanySchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  description: z.string().optional().nullable(),
});

export const updateCompanySchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
});

// Equipment Category validation schemas
export const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  description: z.string().optional().nullable(),
  companyId: z.string().uuid(),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
});

// Work Center validation schemas
export const createWorkCenterSchema = z.object({
  name: z.string().min(1, 'Work center name is required'),
  location: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  companyId: z.string().uuid(),
});

export const updateWorkCenterSchema = z.object({
  name: z.string().min(1).optional(),
  location: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
});

// Equipment validation schemas
export const createEquipmentSchema = z.object({
  name: z.string().min(1, 'Equipment name is required'),
  description: z.string().optional().nullable(),
  serialNumber: z.string().optional().nullable(),
  model: z.string().optional().nullable(),
  manufacturer: z.string().optional().nullable(),
  purchaseDate: z.coerce.date().optional().nullable(),
  warrantyExpiry: z.coerce.date().optional().nullable(),
  status: z
    .enum(['active', 'inactive', 'maintenance', 'retired'])
    .default('active'),
  companyId: z.string().uuid(),
  categoryId: z.string().uuid().optional().nullable(),
  workCenterId: z.string().uuid().optional().nullable(),
});

export const updateEquipmentSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  serialNumber: z.string().optional().nullable(),
  model: z.string().optional().nullable(),
  manufacturer: z.string().optional().nullable(),
  purchaseDate: z.coerce.date().optional().nullable(),
  warrantyExpiry: z.coerce.date().optional().nullable(),
  status: z.enum(['active', 'inactive', 'maintenance', 'retired']).optional(),
  categoryId: z.string().uuid().optional().nullable(),
  workCenterId: z.string().uuid().optional().nullable(),
});

// Maintenance Request validation schemas
export const createMaintenanceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional().nullable(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  status: z
    .enum(['pending', 'in_progress', 'completed', 'cancelled'])
    .default('pending'),
  type: z
    .enum(['corrective', 'preventive', 'predictive'])
    .default('corrective'),
  scheduledDate: z.coerce.date().optional().nullable(),
  completedDate: z.coerce.date().optional().nullable(),
  equipmentId: z.string().uuid(),
  requestedById: z.string().uuid(),
  assignedToId: z.string().uuid().optional().nullable(),
  teamId: z.string().uuid().optional().nullable(),
});

export const updateMaintenanceSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  status: z
    .enum(['pending', 'in_progress', 'completed', 'cancelled'])
    .optional(),
  type: z.enum(['corrective', 'preventive', 'predictive']).optional(),
  scheduledDate: z.coerce.date().optional().nullable(),
  completedDate: z.coerce.date().optional().nullable(),
  assignedToId: z.string().uuid().optional().nullable(),
  teamId: z.string().uuid().optional().nullable(),
});

// Team validation schemas
export const createTeamSchema = z.object({
  name: z.string().min(1, 'Team name is required'),
  description: z.string().optional().nullable(),
  companyId: z.string().uuid(),
});

export const updateTeamSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
});

// Team Member validation schemas
export const createTeamMemberSchema = z.object({
  teamId: z.string().uuid(),
  userId: z.string().uuid(),
  role: z.string().default('member'),
});

export const updateTeamMemberSchema = z.object({
  role: z.string().optional(),
});
