import { useState } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useLogin } from '../../hooks/useAuth'; 

export const LoginPage = () => {
  const [accountId, setAccountId] = useState('');
  const [accountPwd, setAccountPwd] = useState('');
  const navigate = useNavigate(); 
  const search = useSearch({ from: '/login' }) as { redirect?: string };
  
  const loginMutation = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    loginMutation.mutate(
      { account_id: accountId, account_pwd: accountPwd },
      {
        onSuccess: () => {
          const destination = search.redirect || '/dashboard';
          
          if (destination.startsWith('/')) {
            navigate({ to: destination as any });
          } else {
            window.location.href = destination;
          }
        },
        onError: () => {
          alert('아이디나 비밀번호를 다시 확인해주세요.');
        }
      }
    );
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>👶 BabyState</h1>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>아이디</label>
            <input 
              type="text" 
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              placeholder="아이디를 입력하세요"
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>비밀번호</label>
            <input 
              type="password" 
              value={accountPwd}
              onChange={(e) => setAccountPwd(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              required
              style={inputStyle}
            />
          </div>

          <button 
            type="submit" 
            disabled={loginMutation.isPending}
            style={buttonStyle}
          >
            {loginMutation.isPending ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: '#666' }}>
          아직 계정이 없으신가요? <br />
          <button 
            onClick={() => navigate({ to: '/signup' })}
            style={linkButtonStyle}
          >
            회원가입 하러 가기
          </button>
        </div>
      </div>
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  backgroundColor: '#f4f7f6'
};

const cardStyle: React.CSSProperties = {
  backgroundColor: 'white',
  padding: '40px',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  width: '100%',
  maxWidth: '400px'
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px',
  borderRadius: '6px',
  border: '1px solid #ddd',
  boxSizing: 'border-box'
};

const buttonStyle: React.CSSProperties = {
  padding: '12px',
  backgroundColor: '#4A90E2',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '16px'
};

const linkButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#4A90E2',
  textDecoration: 'underline',
  cursor: 'pointer',
  marginTop: '10px',
  fontSize: '14px'
};