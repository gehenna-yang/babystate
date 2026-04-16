import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../repository/authRepository';
import { useBabyStore } from '../store/useBabyStore';

// 당일 기록 조회 훅
export const useGetTodayActivityLogs = () => {
  const currentBaby = useBabyStore((state) => state.currentBaby);
  const today = new Date().toISOString().split('T')[0];

  return useQuery({
    queryKey: ['states', currentBaby?.id, today], 
    queryFn: async () => {
      const { data } = await api.get(`/states/${currentBaby?.id}?target_date=${today}`);
      return data;
    },
    enabled: !!currentBaby?.id, 
  });
};

// 기록 생성 훅 (이름을 useCreateActivityLog 로 통일!)
export const useCreateActivityLog = () => {
  const queryClient = useQueryClient();
  const currentBaby = useBabyStore((state) => state.currentBaby);

  return useMutation({
    mutationFn: async (newLog: { type: string; value: object; memo?: string }) => {
      const { data } = await api.post('/states', {
        ...newLog,
        baby_id: currentBaby?.id 
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['states', currentBaby?.id] });
    }
  });
};

// 선택한 날짜의 기록을 가져오는 훅 (History용)
export const useGetHistoryStates = (targetDate: string) => {
  const currentBaby = useBabyStore((state) => state.currentBaby);

  return useQuery({
    // queryKey에 날짜를 명시하여 날짜를 바꿀 때마다 캐시를 분리
    queryKey: ['states', currentBaby?.id, targetDate], 
    queryFn: async () => {
      const { data } = await api.get(`/states/${currentBaby?.id}?target_date=${targetDate}`);
      return data;
    },
    enabled: !!currentBaby?.id && !!targetDate, 
  });
};

// 기록 수정 훅
export const useUpdateState = () => {
  const queryClient = useQueryClient();
  const currentBaby = useBabyStore((state) => state.currentBaby);

  return useMutation({
    mutationFn: async ({ id, updateData }: { id: number; updateData: any }) => {
      const { data } = await api.patch(`/states/${id}`, updateData);
      return data;
    },
    onSuccess: () => {
      // 수정 후 해당 아기의 모든 상태 캐시 무효화 (새로고침)
      queryClient.invalidateQueries({ queryKey: ['states', currentBaby?.id] });
    }
  });
};

// 기록 삭제 훅
export const useDeleteState = () => {
  const queryClient = useQueryClient();
  const currentBaby = useBabyStore((state) => state.currentBaby);

  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.delete(`/states/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['states', currentBaby?.id] });
    }
  });
};