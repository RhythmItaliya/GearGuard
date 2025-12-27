import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { ENDPOINTS } from '@/config/endpoints';
import { WorkCenter, ApiResponse } from '@/types';

export function useWorkCenters(companyId?: string) {
  const queryClient = useQueryClient();
  const queryKey = ['work-centers', companyId];

  const { data, isLoading } = useQuery<WorkCenter[]>({
    queryKey,
    queryFn: async () => {
      const response = await apiClient<ApiResponse<WorkCenter[]>>(
        ENDPOINTS.WORK_CENTERS.LIST,
        { params: { companyId } }
      );
      return response.data || [];
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: any) =>
      apiClient(ENDPOINTS.WORK_CENTERS.CREATE, { method: 'POST', data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiClient(ENDPOINTS.WORK_CENTERS.UPDATE.replace(':id', id), {
        method: 'PUT',
        data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiClient(ENDPOINTS.WORK_CENTERS.DELETE.replace(':id', id), {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    workCenters: data || [],
    isLoading,
    createWorkCenter: createMutation.mutateAsync,
    updateWorkCenter: updateMutation.mutateAsync,
    deleteWorkCenter: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
