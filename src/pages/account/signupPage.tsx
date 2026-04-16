import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import api from '../../repository/authRepository';

export const SignupPage = () => {
  const navigate = useNavigate();
  
  // 입력 폼 상태 관리
  const [formData, setFormData] = useState({
    account_id: '',
    account_pwd: '',
    nickname: '',
    memo: ''
  });

  // 회원가입 API 호출을 위한 Mutation
  const signupMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await api.post('/register', data);
      return response.data;
    },
    onSuccess: () => {
      alert('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.');
      navigate({ to: '/login' }); // 가입 완료 후 로그인 페이지로 전환
    },
    onError: (error: any) => {
      const detail = error.response?.data?.detail;
      alert(detail || '회원가입에 실패했습니다. 아이디 중복 여부를 확인하세요.');
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signupMutation.mutate(formData);
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>회원가입</h1>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={labelStyle}>아이디 *</label>
            <input 
              name="account_id"
              value={formData.account_id}
              onChange={handleChange}
              placeholder="사용할 아이디 입력"
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>비밀번호 *</label>
            <input 
              name="account_pwd"
              type="password"
              value={formData.account_pwd}
              onChange={handleChange}
              placeholder="비밀번호 입력"
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>닉네임 *</label>
            <input 
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              placeholder="닉네임 입력"
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>메모 (선택)</label>
            <textarea 
              name="memo"
              value={formData.memo}
              onChange={handleChange}
              placeholder="가입 인사를 남겨주세요"
              style={{ ...inputStyle, minHeight: '80px' }}
            />
          </div>

          <button 
            type="submit" 
            disabled={signupMutation.isPending}
            style={buttonStyle}
          >
            {signupMutation.isPending ? '가입 중...' : '회원가입 완료'}
          </button>
        </form>

        <button 
          onClick={() => navigate({ to: '/login' })}
          style={backButtonStyle}
        >
          이미 계정이 있나요? 로그인하러 가기
        </button>
      </div>
    </div>
  );
};

// 스타일 (로그인 페이지와 통일감 유지)
const containerStyle: React.CSSProperties = {
  display: 'flex', justifyContent: 'center', alignItems: 'center',
  minHeight: '100vh', backgroundColor: '#f4f7f6'
};
const cardStyle: React.CSSProperties = {
  backgroundColor: 'white', padding: '40px', borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '450px'
};
const labelStyle: React.CSSProperties = { display: 'block', marginBottom: '5px', fontWeight: 'bold' };
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box'
};
const buttonStyle: React.CSSProperties = {
  padding: '12px', backgroundColor: '#4CAF50', color: 'white',
  border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px'
};
const backButtonStyle: React.CSSProperties = {
  width: '100%', background: 'none', border: 'none', color: '#666',
  textDecoration: 'underline', cursor: 'pointer', marginTop: '20px', fontSize: '14px'
};