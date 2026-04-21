// src/hooks/useUsers.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../repository/authRepository';
import { useAuthStore } from '../store/useAuthStore';

interface UpdateUserData {
  nickname?: string;
  old_password?: string;
  new_password?: string;
  memo?: string;
}

export const useGetMe = () => {
  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: async () => {
      const response = await api.get('/user/me');
      return response.data; 
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updateData: UpdateUserData) => {
      const token = useAuthStore.getState().accessToken;
      
      if (!token) {
        throw new Error("로그인이 필요합니다.");
      }

      const data = await api.patch('/user/me', updateData);

      if (data.status !== 200) {
        throw new Error("정보 업데이트에 실패했습니다.");
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
    },
  });
};