import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../repository/authRepository';

// 아기 목록 조회 Hook
export const useGetBabys = () => {
  return useQuery({
    queryKey: ['babys'],
    queryFn: async () => {
      const { data } = await api.get('/babys');
      return data;
    },
  });
};

// 아기 등록 Hook
export const useCreateBaby = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (babyData: any) => {
      const { data } = await api.post('/babys/register', babyData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['babys'] });
    },
  });
};

// 아기 정보 업데이트
export const useUpdateBaby = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await api.patch(`/babys/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['babys'] });
    }
  });
};