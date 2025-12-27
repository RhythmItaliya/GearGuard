import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/api';
import { ENDPOINTS } from '@/config/endpoints';

export function useAuth() {
  const router = useRouter();
  const { toast } = useToast();

  const registerMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiClient(ENDPOINTS.AUTH.REGISTER, {
        method: 'POST',
        data,
      });
    },
    onSuccess: () => {
      toast({
        title: 'Account created successfully!',
        description: 'Please sign in with your new credentials.',
      });
      router.push('/login');
    },
    onError: (error: Error) => {
      toast({
        variant: 'destructive',
        title: 'Registration failed',
        description: error.message || 'Please try again later.',
      });
    },
  });

  return {
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
  };
}
