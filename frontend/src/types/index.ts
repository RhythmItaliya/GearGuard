// Database model types matching Prisma schema

export interface Profile {
  id: string;
  userId: string;
  email: string;
  fullName: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  fullName: string | null;
  role: string;
}

export interface Company {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCompany {
  id: string;
  userId: string;
  companyId: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EquipmentCategory {
  id: string;
  name: string;
  description: string | null;
  companyId: string;
  responsibleUserId?: string | null;
  createdAt: Date;
  updatedAt: Date;
  responsibleUser?: {
    id: string;
    fullName: string | null;
    email: string;
  };
  company?: Company;
}

export interface WorkCenter {
  id: string;
  name: string;
  code?: string | null;
  tag?: string | null;
  alternativeWorkCenters?: string | null;
  costPerHour?: number | null;
  capacity?: number | null;
  timeEfficiency?: number | null;
  oeeTarget?: number | null;
  location: string | null;
  description: string | null;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
  company?: Company;
}

export interface Equipment {
  id: string;
  name: string;
  description?: string;
  serialNumber?: string;
  model?: string;
  manufacturer?: string;
  purchaseDate?: string;
  warrantyExpiry?: string;
  status: 'active' | 'inactive' | 'maintenance' | 'retired';
  healthPercentage: number;
  companyId: string;
  categoryId?: string;
  workCenterId?: string;
  department?: string;
  location?: string;
  usedByUserId?: string;
  technicianUserId?: string;
  maintenanceTeamId?: string;
  assignedDate?: string;
  scrapDate?: string;
  createdAt: string;
  updatedAt: string;

  company?: Company;
  category?: EquipmentCategory;
  workCenter?: WorkCenter;
  usedByUser?: User;
  technicianUser?: User;
  maintenanceTeam?: MaintenanceTeam;
}

export interface MaintenanceRequest {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  type: 'corrective' | 'preventive' | 'predictive';
  scheduledDate?: string;
  completedDate?: string;
  equipmentId?: string;
  workCenterId?: string;
  companyId?: string;
  categoryId?: string;
  requestedById: string;
  assignedToId?: string;
  teamId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceTeam {
  id: string;
  name: string;
  description: string | null;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

// Extended types with relations for API responses
export interface EquipmentWithRelations extends Equipment {
  category?: EquipmentCategory;
  workCenter?: WorkCenter;
  company?: Company;
}

export interface MaintenanceRequestWithRelations extends MaintenanceRequest {
  equipment?: EquipmentWithRelations;
  category?: EquipmentCategory;
  company?: Company;
  workCenter?: WorkCenter;
  requestedBy?: { id: string; fullName: string | null; email: string };
  assignedTo?: { id: string; fullName: string | null; email: string };
  team?: MaintenanceTeam;
}

export interface TeamMemberWithRelations extends TeamMember {
  user?: {
    id: string;
    fullName: string | null;
    email: string;
  };
}

export interface MaintenanceTeamWithRelations extends MaintenanceTeam {
  members?: TeamMemberWithRelations[];
  company?: Company;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Dashboard types
export interface DashboardStats {
  critical: number;
  load: number;
  pending: number;
  overdue: number;
}

// Form input types
export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  fullName?: string;
}

export interface CreateEquipmentInput {
  name: string;
  description?: string | null;
  serialNumber?: string | null;
  model?: string | null;
  manufacturer?: string | null;
  purchaseDate?: Date | null;
  warrantyExpiry?: Date | null;
  status?: 'active' | 'inactive' | 'maintenance' | 'retired';
  companyId: string;
  categoryId?: string | null;
  workCenterId?: string | null;
}

export interface UpdateEquipmentInput {
  name?: string;
  description?: string | null;
  serialNumber?: string | null;
  model?: string | null;
  manufacturer?: string | null;
  purchaseDate?: Date | null;
  warrantyExpiry?: Date | null;
  status?: 'active' | 'inactive' | 'maintenance' | 'retired';
  categoryId?: string | null;
  workCenterId?: string | null;
}

export interface CreateMaintenanceRequestInput {
  title: string;
  description?: string | null;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  type?: 'corrective' | 'preventive' | 'predictive';
  scheduledDate?: Date | null;
  completedDate?: Date | null;
  equipmentId: string;
  requestedById: string;
  assignedToId?: string | null;
  teamId?: string | null;
}

export interface UpdateMaintenanceRequestInput {
  title?: string;
  description?: string | null;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  type?: 'corrective' | 'preventive' | 'predictive';
  scheduledDate?: Date | null;
  completedDate?: Date | null;
  assignedToId?: string | null;
  teamId?: string | null;
}

export interface CreateCategoryInput {
  name: string;
  description?: string | null;
  responsibleUserId?: string | null;
  companyId: string;
}

export interface UpdateCategoryInput {
  name?: string;
  description?: string | null;
  responsibleUserId?: string | null;
}

export interface CreateWorkCenterInput {
  name: string;
  code?: string | null;
  tag?: string | null;
  alternativeWorkCenters?: string | null;
  costPerHour?: number | null;
  capacity?: number | null;
  timeEfficiency?: number | null;
  oeeTarget?: number | null;
  location?: string | null;
  description?: string | null;
  companyId: string;
}

export interface UpdateWorkCenterInput {
  name?: string;
  code?: string | null;
  tag?: string | null;
  alternativeWorkCenters?: string | null;
  costPerHour?: number | null;
  capacity?: number | null;
  timeEfficiency?: number | null;
  oeeTarget?: number | null;
  location?: string | null;
  description?: string | null;
}

export interface CreateTeamInput {
  name: string;
  description?: string | null;
  companyId: string;
}

export interface UpdateTeamInput {
  name?: string;
  description?: string | null;
}

export interface CreateTeamMemberInput {
  teamId: string;
  userId: string;
  role?: string;
}

export interface UpdateTeamMemberInput {
  role?: string;
}

// Auth types
export interface AuthUser {
  id: string;
  userId: string;
  email: string;
  fullName: string | null;
  role: string;
  token: string;
}

export interface Session {
  user: {
    id: string;
    email: string;
    name: string | null;
  };
}
