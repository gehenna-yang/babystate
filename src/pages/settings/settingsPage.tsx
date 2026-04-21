// src/pages/SettingPage.tsx
import { useState, useEffect } from 'react';
import { useGetBabys, useCreateBaby, useUpdateBaby } from '../../hooks/useBabys';
import { useGetMe, useUpdateUser } from '../../hooks/useUsers';
import { PasswordChangeModal } from './component/passwordChangeModal';
import '../../common/pagecss.css';

export const SettingPage = () => {
  const { data: babys, isLoading: isBabysLoading } = useGetBabys();
  const createBabyMutation = useCreateBaby();
  const updateBabyMutation = useUpdateBaby();
  const [editingBabyId, setEditingBabyId] = useState<string | null>(null);
  const [babyForm, setBabyForm] = useState({ nickname: '', birth: '', memo: '' });
  const { data: currentUser, isLoading: isUserLoading } = useGetMe();
  const updateUserMutation = useUpdateUser();
  const [userNickname, setUserNickname] = useState(''); 
  const [isPwdModalOpen, setIsPwdModalOpen] = useState(false);

  useEffect(() => {
    if (currentUser && currentUser.nickname) {
      setUserNickname(currentUser.nickname);
    }
  }, [currentUser]);

  const startEdit = (baby: any) => {
    setEditingBabyId(baby.id);
    setBabyForm({ 
      nickname: baby.nickname, 
      birth: new Date(baby.birth).toISOString().slice(0, 16),
      memo: baby.memo || '' 
    });
  };

  const saveBaby = () => {
    const callback = {
      onSuccess: () => {
        setEditingBabyId(null);
        setBabyForm({ nickname: '', birth: '', memo: '' });
      }
    };
    if (editingBabyId) {
      updateBabyMutation.mutate({ id: editingBabyId, data: babyForm }, callback);
    } else {
      createBabyMutation.mutate(babyForm, callback);
    }
  };

  const handleUpdateNickname = () => {
    if (!userNickname.trim()) return alert("변경할 닉네임을 입력해주세요.");
    if (userNickname === currentUser?.nickname) return alert("기존 닉네임과 동일합니다.");
    updateUserMutation.mutate({ nickname: userNickname }, {
      onSuccess: () => alert("닉네임이 성공적으로 변경되었습니다.")
    });
  };

  if (isBabysLoading || isUserLoading) return <div className="page-wrapper">로딩 중...</div>;

  return (
    <div className="page-wrapper">
      
      <PasswordChangeModal 
        isOpen={isPwdModalOpen} 
        onClose={() => setIsPwdModalOpen(false)} 
      />

      <header className="page-header">
        <h1 className="page-title">⚙️ 설정</h1>
      </header>

      <section className="setting-section">
        <h3>👤 내 정보 수정</h3>
        <div className="setting-form" style={{ marginTop: '1rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="control-label" style={{ display: 'block', marginBottom: '8px' }}>닉네임</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input 
                className="styled-input" 
                value={userNickname} 
                onChange={(e) => setUserNickname(e.target.value)} 
                placeholder="새로운 닉네임을 입력하세요" 
                style={{ flex: 1 }}
              />
              <button className="secondary-btn" onClick={handleUpdateNickname} disabled={updateUserMutation.isPending}>변경</button>
            </div>
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid #e1e3e2', margin: '1.5rem 0' }} />
          <div>
            <label className="control-label" style={{ display: 'block', marginBottom: '8px' }}>비밀번호</label>
            <p style={{ color: '#787b7a', fontSize: '0.9rem', marginBottom: '12px' }}>안전을 위해 주기적으로 비밀번호를 변경해 주세요.</p>
            <button className="secondary-btn" onClick={() => setIsPwdModalOpen(true)}>비밀번호 변경하기</button>
          </div>
        </div>
      </section>

      <section className="setting-section">
        <h3>👶 아기 관리</h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {babys?.map((baby: any) => (
            <li key={baby.id} className="setting-list-item">
              <div>
                <strong style={{ fontSize: '1.1rem', color: '#3d6381' }}>{baby.nickname}</strong> 
                <span style={{ fontSize: '0.9rem', color: '#9d9d9c', marginLeft: '12px' }}>{new Date(baby.birth).toLocaleDateString()}</span>
              </div>
              <button className="secondary-btn" onClick={() => startEdit(baby)}>수정</button>
            </li>
          ))}
        </ul>
        <div className="setting-form">
          <h4 style={{ margin: '0 0 10px 0', color: '#093754', fontSize: '1.1rem' }}>{editingBabyId ? "아기 정보 수정" : "새 아기 등록"}</h4>
          <input className="styled-input" placeholder="이름/태명" value={babyForm.nickname} onChange={(e) => setBabyForm({...babyForm, nickname: e.target.value})} />
          <input className="styled-input" type="datetime-local" value={babyForm.birth} onChange={(e) => setBabyForm({...babyForm, birth: e.target.value})} />
          <textarea className="styled-input" placeholder="메모" value={babyForm.memo} onChange={(e) => setBabyForm({...babyForm, memo: e.target.value})} style={{ minHeight: '80px', resize: 'vertical' }} />
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button className="primary-btn" onClick={saveBaby} style={{ flex: 1 }}>{editingBabyId ? "수정 완료" : "등록하기"}</button>
            {editingBabyId && <button className="secondary-btn" onClick={() => { setEditingBabyId(null); setBabyForm({nickname:'', birth:'', memo:''}); }} style={{ flex: 1 }}>취소</button>}
          </div>
        </div>
      </section>
    </div>
  );
};