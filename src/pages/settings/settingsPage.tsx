// src/pages/SettingPage.tsx
import { useState } from 'react';
import { useGetBabys, useCreateBaby, useUpdateBaby } from '../../hooks/useBabys';
import '../../common/pagecss.css'

export const SettingPage = () => {
  const { data: babys, isLoading } = useGetBabys();
  const createBabyMutation = useCreateBaby();
  const updateBabyMutation = useUpdateBaby();
  const [editingBabyId, setEditingBabyId] = useState<string | null>(null);
  const [babyForm, setBabyForm] = useState({ nickname: '', birth: '', memo: '' });

  const startEdit = (baby: any) => {
    setEditingBabyId(baby.id);
    setBabyForm({ 
      nickname: baby.nickname, 
      birth: new Date(baby.birth).toISOString().slice(0, 16), // datetime-local 포맷에 맞춤
      memo: baby.memo || '' 
    });
  };

  const saveBaby = () => {
    if (editingBabyId) {
      updateBabyMutation.mutate({ id: editingBabyId, data: babyForm }, {
        onSuccess: () => {
            setEditingBabyId(null)
            setBabyForm({ nickname: '', birth: '', memo: '' })
        }
      });
    } else {
      createBabyMutation.mutate(babyForm, {
        onSuccess: () => {
            setEditingBabyId(null)
            setBabyForm({ nickname: '', birth: '', memo: '' })
        }
      });
    }
  };

  if (isLoading) return <div className="page-wrapper">로딩 중...</div>;

  return (
    <div className="page-wrapper">
      <header className="page-header">
        <h1 className="page-title">⚙️ 설정</h1>
      </header>

      <section className="setting-section">
        <h3>👤 내 정보 수정</h3>
        <p style={{ color: '#787b7a' }}>닉네임 변경이나 비밀번호 변경 기능을 여기에 배치합니다.</p>
      </section>

      <section className="setting-section">
        <h3>👶 아기 관리</h3>
        
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {babys?.map((baby: any) => (
            <li key={baby.id} className="setting-list-item">
              <div>
                <strong style={{ fontSize: '1.1rem', color: '#3d6381' }}>{baby.nickname}</strong> 
                <span style={{ fontSize: '0.9rem', color: '#9d9d9c', marginLeft: '12px' }}>
                  {new Date(baby.birth).toLocaleDateString()}
                </span>
              </div>
              <button 
                className="secondary-btn" 
                style={{ padding: '8px 16px', fontSize: '0.9rem' }} 
                onClick={() => startEdit(baby)}
              >
                수정
              </button>
            </li>
          ))}
        </ul>

        <div className="setting-form">
          <h4 style={{ margin: '0 0 10px 0', color: '#093754', fontSize: '1.1rem' }}>
            {editingBabyId ? "아기 정보 수정" : "새 아기 등록"}
          </h4>
          
          <input 
            className="styled-input"
            placeholder="이름/태명" 
            value={babyForm.nickname} 
            onChange={(e) => setBabyForm({...babyForm, nickname: e.target.value})} 
          />
          <input 
            className="styled-input"
            type="datetime-local"
            value={babyForm.birth} 
            onChange={(e) => setBabyForm({...babyForm, birth: e.target.value})} 
          />
          <textarea 
            className="styled-input"
            placeholder="메모" 
            value={babyForm.memo} 
            onChange={(e) => setBabyForm({...babyForm, memo: e.target.value})} 
            style={{ minHeight: '80px', resize: 'vertical' }}
          />
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button className="primary-btn" onClick={saveBaby} style={{ flex: 1 }}>
              {editingBabyId ? "수정 완료" : "등록하기"}
            </button>
            {editingBabyId && (
              <button className="secondary-btn" onClick={() => { setEditingBabyId(null); setBabyForm({nickname:'', birth:'', memo:''}); }} style={{ flex: 1 }}>
                취소
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};