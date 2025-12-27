import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { ENDPOINTS } from '@/config/endpoints';
import { ApiResponse } from '@/types';

export function useResources(companyId?: string) {
  const categoriesQuery = useQuery({
    queryKey: ['categories', companyId],
    queryFn: async () => {
      const response = await apiClient<ApiResponse<any[]>>(
        ENDPOINTS.RESOURCES.CATEGORIES,
        { params: { companyId } }
      );
      return response.data || [];
    },
  });

  const companiesQuery = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const response = await apiClient<ApiResponse<any[]>>(
        ENDPOINTS.RESOURCES.COMPANIES
      );
      return response.data || [];
    },
  });

  const teamsQuery = useQuery({
    queryKey: ['teams', companyId],
    queryFn: async () => {
      const response = await apiClient<ApiResponse<any[]>>(
        ENDPOINTS.RESOURCES.TEAMS,
        { params: { companyId } }
      );
      return response.data || [];
    },
  });

  const usersQuery = useQuery({
    queryKey: ['users', companyId],
    queryFn: async () => {
      const response = await apiClient<ApiResponse<any[]>>(
        ENDPOINTS.RESOURCES.USERS,
        { params: { companyId } }
      );
      return response.data || [];
    },
  });

  const workCentersQuery = useQuery({
    queryKey: ['work-centers', companyId],
    queryFn: async () => {
      const response = await apiClient<ApiResponse<any[]>>(
        ENDPOINTS.RESOURCES.WORK_CENTERS,
        { params: { companyId } }
      );
      return response.data || [];
    },
  });

  return {
    categories: categoriesQuery.data || [],
    companies: companiesQuery.data || [],
    teams: teamsQuery.data || [],
    users: usersQuery.data || [],
    workCenters: workCentersQuery.data || [],
    isLoading:
      categoriesQuery.isLoading ||
      companiesQuery.isLoading ||
      teamsQuery.isLoading ||
      usersQuery.isLoading ||
      workCentersQuery.isLoading,
  };
}
