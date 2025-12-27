import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { ENDPOINTS } from '@/config/endpoints';
import { EquipmentCategory, ApiResponse } from '@/types';

export function useCategories(companyId?: string) {
  const queryClient = useQueryClient();
  const queryKey = ['categories', companyId];

  const { data, isLoading } = useQuery<EquipmentCategory[]>({
    queryKey,
    queryFn: async () => {
      const response = await apiClient<ApiResponse<EquipmentCategory[]>>(
        ENDPOINTS.CATEGORIES.LIST,
        { params: { companyId } }
      );
      return response.data || [];
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: any) =>
      apiClient(ENDPOINTS.CATEGORIES.CREATE, { method: 'POST', data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiClient(ENDPOINTS.CATEGORIES.UPDATE.replace(':id', id), {
        method: 'PUT',
        data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiClient(ENDPOINTS.CATEGORIES.DELETE.replace(':id', id), {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    categories: data || [],
    isLoading,
    createCategory: createMutation.mutateAsync,
    updateCategory: updateMutation.mutateAsync,
    deleteCategory: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
