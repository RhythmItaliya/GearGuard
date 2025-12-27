import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { ENDPOINTS } from '@/config/endpoints';
import { MaintenanceRequestWithRelations, ApiResponse } from '@/types';

export function useMaintenance(companyId?: string) {
  const queryClient = useQueryClient();
  const queryKey = ['maintenance', companyId];

  const { data, isLoading } = useQuery<MaintenanceRequestWithRelations[]>({
    queryKey,
    queryFn: async () => {
      const response = await apiClient<
        ApiResponse<MaintenanceRequestWithRelations[]>
      >(ENDPOINTS.MAINTENANCE.LIST, { params: { companyId } });
      return response.data || [];
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: any) =>
      apiClient(ENDPOINTS.MAINTENANCE.CREATE, { method: 'POST', data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiClient(ENDPOINTS.MAINTENANCE.UPDATE.replace(':id', id), {
        method: 'PUT',
        data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiClient(ENDPOINTS.MAINTENANCE.DELETE.replace(':id', id), {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    requests: data || [],
    isLoading,
    createRequest: createMutation.mutateAsync,
    updateRequest: updateMutation.mutateAsync,
    deleteRequest: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
