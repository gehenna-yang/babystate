import { useLogin } from './hooks/useAuth';

export const LoginPage = () => {
  const loginMutation = useLogin();

  const onSubmit = (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    loginMutation.mutate(data);
  };

  return (
    <form onSubmit={onSubmit}>
      <input name="account_id" placeholder="아이디" required />
      <input name="account_pwd" type="password" placeholder="비밀번호" required />
      <button type="submit" disabled={loginMutation.isPending}>
        {loginMutation.isPending ? '로그인 중...' : '로그인'}
      </button>
    </form>
  );
};