import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { ENDPOINTS } from '@/config/endpoints';
import {
  EquipmentWithRelations,
  CreateEquipmentInput,
  UpdateEquipmentInput,
  ApiResponse,
} from '@/types';

export function useEquipment(companyId?: string) {
  const queryClient = useQueryClient();
  const queryKey = ['equipment', companyId];

  const { data, isLoading } = useQuery<EquipmentWithRelations[]>({
    queryKey,
    queryFn: async () => {
      const response = await apiClient<ApiResponse<EquipmentWithRelations[]>>(
        ENDPOINTS.EQUIPMENT.LIST,
        { params: { companyId } }
      );
      return response.data || [];
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateEquipmentInput) =>
      apiClient(ENDPOINTS.EQUIPMENT.CREATE, { method: 'POST', data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEquipmentInput }) =>
      apiClient(ENDPOINTS.EQUIPMENT.UPDATE.replace(':id', id), {
        method: 'PUT',
        data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiClient(ENDPOINTS.EQUIPMENT.DELETE.replace(':id', id), {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    equipment: data || [],
    isLoading,
    createEquipment: createMutation.mutateAsync,
    updateEquipment: updateMutation.mutateAsync,
    deleteEquipment: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
