import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api';
import { ENDPOINTS } from '@/config/endpoints';

export function useAuth() {
  const router = useRouter();

  const registerMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiClient(ENDPOINTS.AUTH.REGISTER, {
        method: 'POST',
        data,
      });
    },
    onSuccess: () => {
      toast.success('Account created successfully!', {
        description: 'Please sign in with your new credentials.',
      });
      router.push('/login');
    },
    onError: (error: Error) => {
      toast.error('Registration failed', {
        description: error.message || 'Please try again later.',
      });
    },
  });

  return {
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
  };
}
