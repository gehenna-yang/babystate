import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../repository/authRepository';

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
      const { data } = await api.post('/babys', babyData);
      return data;
    },
    onSuccess: () => {
      // 등록 성공 시 'babys' 키를 가진 쿼리를 무효화하여 목록을 새로고침함
      queryClient.invalidateQueries({ queryKey: ['babys'] });
    },
  });
};