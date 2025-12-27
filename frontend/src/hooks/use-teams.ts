import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { ENDPOINTS } from '@/config/endpoints';
import { MaintenanceTeamWithRelations, ApiResponse } from '@/types';

export function useTeams(companyId?: string) {
  const queryClient = useQueryClient();
  const queryKey = ['teams', companyId];

  const { data, isLoading } = useQuery<MaintenanceTeamWithRelations[]>({
    queryKey,
    queryFn: async () => {
      const response = await apiClient<
        ApiResponse<MaintenanceTeamWithRelations[]>
      >(ENDPOINTS.TEAMS.LIST, { params: { companyId } });
      return response.data || [];
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: any) =>
      apiClient(ENDPOINTS.TEAMS.CREATE, { method: 'POST', data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiClient(ENDPOINTS.TEAMS.UPDATE.replace(':id', id), {
        method: 'PUT',
        data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiClient(ENDPOINTS.TEAMS.DELETE.replace(':id', id), {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const addMemberMutation = useMutation({
    mutationFn: ({
      teamId,
      userId,
      role,
    }: {
      teamId: string;
      userId: string;
      role?: string;
    }) =>
      apiClient(ENDPOINTS.TEAMS.ADD_MEMBER.replace(':id', teamId), {
        method: 'POST',
        data: { userId, role },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: ({ teamId, memberId }: { teamId: string; memberId: string }) =>
      apiClient(
        ENDPOINTS.TEAMS.REMOVE_MEMBER.replace(':id', teamId).replace(
          ':memberId',
          memberId
        ),
        { method: 'DELETE' }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    teams: data || [],
    isLoading,
    createTeam: createMutation.mutateAsync,
    updateTeam: updateMutation.mutateAsync,
    deleteTeam: deleteMutation.mutateAsync,
    addMember: addMemberMutation.mutateAsync,
    removeMember: removeMemberMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
