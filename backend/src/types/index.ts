import {
  Company,
  UserCompany,
  Equipment,
  EquipmentCategory,
  WorkCenter,
  MaintenanceRequest,
  MaintenanceTeam,
  TeamMember,
} from '@prisma/client';

// Re-export Prisma types
export type {
  Company,
  UserCompany,
  Equipment,
  EquipmentCategory,
  WorkCenter,
  MaintenanceRequest,
  MaintenanceTeam,
  TeamMember,
};

// Company types
export interface CreateCompanyInput {
  name: string;
  description?: string | null;
}

export interface UpdateCompanyInput {
  name?: string;
  description?: string | null;
}

// UserCompany types
export interface CreateUserCompanyInput {
  userId: string;
  companyId: string;
  role?: string;
}

export interface UpdateUserCompanyInput {
  role?: string;
}

// Equipment Category types
export interface CreateEquipmentCategoryInput {
  name: string;
  description?: string | null;
  companyId: string;
}

export interface UpdateEquipmentCategoryInput {
  name?: string;
  description?: string | null;
}

// Work Center types
export interface CreateWorkCenterInput {
  name: string;
  location?: string | null;
  description?: string | null;
  companyId: string;
}

export interface UpdateWorkCenterInput {
  name?: string;
  location?: string | null;
  description?: string | null;
}

// Equipment types
export interface CreateEquipmentInput {
  name: string;
  description?: string | null;
  serialNumber?: string | null;
  model?: string | null;
  manufacturer?: string | null;
  purchaseDate?: Date | null;
  warrantyExpiry?: Date | null;
  status?: string;
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
  status?: string;
  categoryId?: string | null;
  workCenterId?: string | null;
}

// Maintenance Request types
export interface CreateMaintenanceRequestInput {
  title: string;
  description?: string | null;
  priority?: string;
  status?: string;
  type?: string;
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
  priority?: string;
  status?: string;
  type?: string;
  scheduledDate?: Date | null;
  completedDate?: Date | null;
  assignedToId?: string | null;
  teamId?: string | null;
}

// Maintenance Team types
export interface CreateMaintenanceTeamInput {
  name: string;
  description?: string | null;
  companyId: string;
}

export interface UpdateMaintenanceTeamInput {
  name?: string;
  description?: string | null;
}

// Team Member types
export interface CreateTeamMemberInput {
  teamId: string;
  userId: string;
  role?: string;
}

export interface UpdateTeamMemberInput {
  role?: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
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
