// src/hooks/useActivityLog.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../../repository/authRepository';
import { useBabyStore } from '../../../store/useBabyStore';

// 활동 기록 등록 (수유, 기저귀 등)
export const useCreateActivityLog = () => {
  const queryClient = useQueryClient();
  const currentBaby = useBabyStore((state) => state.currentBaby);

  return useMutation({
    mutationFn: async (logData: { type: string; value: any; memo?: string }) => {
      // 백엔드 엔드포인트는 기존 /states를 유지
      const response = await api.post('/states', {
        ...logData,
        baby_id: currentBaby?.id,
      });
      return response.data;
    },
    onSuccess: () => {
      // 기록 성공 시 해당 아기의 활동 목록 캐시를 무효화하여 새로고침
      queryClient.invalidateQueries({ queryKey: ['activityLogs', currentBaby?.id] });
    },
  });
};

// 특정 아기의 활동 기록 목록 조회
export const useGetActivityLogs = () => {
  const currentBaby = useBabyStore((state) => state.currentBaby);

  return useQuery({
    queryKey: ['activityLogs', currentBaby?.id],
    queryFn: async () => {
      if (!currentBaby?.id) return [];
      const { data } = await api.get(`/states?baby_id=${currentBaby.id}`);
      return data;
    },
    enabled: !!currentBaby?.id, // 아기가 선택되었을 때만 실행
  });
};