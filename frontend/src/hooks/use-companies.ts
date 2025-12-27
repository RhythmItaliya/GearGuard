import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { ENDPOINTS } from '@/config/endpoints';
import { ApiResponse } from '@/types';

export interface Company {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    users: number;
    equipment: number;
    teams: number;
  };
}

export function useCompanies() {
  const queryClient = useQueryClient();
  const queryKey = ['companies'];

  const { data, isLoading } = useQuery<Company[]>({
    queryKey,
    queryFn: async () => {
      const response = await apiClient<ApiResponse<Company[]>>(
        ENDPOINTS.COMPANIES.LIST
      );
      return response.data || [];
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: { name: string; description?: string }) =>
      apiClient(ENDPOINTS.COMPANIES.CREATE, { method: 'POST', data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiClient(ENDPOINTS.COMPANIES.UPDATE.replace(':id', id), {
        method: 'PUT',
        data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiClient(ENDPOINTS.COMPANIES.DELETE.replace(':id', id), {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    companies: data || [],
    isLoading,
    createCompany: createMutation.mutateAsync,
    updateCompany: updateMutation.mutateAsync,
    deleteCompany: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
