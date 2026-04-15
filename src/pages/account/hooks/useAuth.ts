// src/hooks/useAuth.ts
import { useMutation } from '@tanstack/react-query';
import api from '../../../repository/authRepository';
import { useAuthStore } from '../../../store/useAuthStore';

export const useLogin = () => {
  const setTokens = useAuthStore((state) => state.setTokens);

  return useMutation({
    mutationFn: async (loginData: any) => {
      const { data } = await api.post('/login', loginData);
      return data;
    },
    onSuccess: (data) => {
      setTokens(data.access_token, data.refresh_token);
      alert('로그인 성공!');
    },
    onError: () => {
      alert('아이디나 비밀번호를 확인해주세요.');
    }
  });
};