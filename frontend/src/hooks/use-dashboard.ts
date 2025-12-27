import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { ENDPOINTS } from '@/config/endpoints';

import { MaintenanceRequestWithRelations, ApiResponse } from '@/types';

export interface DashboardStats {
  totalEquipment: number;
  critical: number;
  totalRequests: number;
  pending: number;
  completed: number;
  totalTeams: number;
  totalTechnicians: number;
  load: number;
  overdue: number;
  statusBreakdown: Record<string, number>;
  typeBreakdown: Record<string, number>;
  monthBreakdown: Record<string, number>;
}

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await apiClient<ApiResponse<DashboardStats>>(
        ENDPOINTS.DASHBOARD.STATS
      );
      return response.data!;
    },
  });
}

export function useRecentRequests() {
  return useQuery<MaintenanceRequestWithRelations[]>({
    queryKey: ['recent-requests'],
    queryFn: async () => {
      const response = await apiClient<
        ApiResponse<MaintenanceRequestWithRelations[]>
      >(ENDPOINTS.DASHBOARD.RECENT_REQUESTS);
      return response.data || [];
    },
  });
}
