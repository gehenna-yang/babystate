import { useState } from 'react';
import { useGetBabys, useCreateBaby, useUpdateBaby } from '../../hooks/useBabys';

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
      birth: new Date(baby.birth).toISOString(), 
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

  if (isLoading) return <div>로딩 중...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>⚙️ 설정</h1>

      <section style={{ marginBottom: '40px', padding: '20px', border: '1px solid #eee' }}>
        <h3>👤 내 정보 수정</h3>
        <p>닉네임 변경이나 비밀번호 변경 기능을 여기에 배치합니다.</p>
      </section>

      <section style={{ padding: '20px', border: '1px solid #eee' }}>
        <h3>👶 아기 관리</h3>
        
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {babys?.map((baby: any) => (
            <li key={baby.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f9f9f9' }}>
              <div>
                <strong>{baby.nickname}</strong> 
                <span style={{ fontSize: '12px', color: '#888', marginLeft: '10px' }}>
                  {new Date(baby.birth).toLocaleDateString()}
                </span>
              </div>
              <button onClick={() => startEdit(baby)}>수정</button>
            </li>
          ))}
        </ul>

        <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px dashed #ccc' }} />

        <h4>{editingBabyId ? "아기 정보 수정" : "새 아기 등록"}</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input 
            placeholder="이름/태명" 
            value={babyForm.nickname} 
            onChange={(e) => setBabyForm({...babyForm, nickname: e.target.value})} 
          />
          <input 
            type="datetime-local"
            value={babyForm.birth} 
            onChange={(e) => setBabyForm({...babyForm, birth: e.target.value})} 
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
          />
          <textarea 
            placeholder="메모" 
            value={babyForm.memo} 
            onChange={(e) => setBabyForm({...babyForm, memo: e.target.value})} 
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={saveBaby} style={{ flex: 2 }}>
              {editingBabyId ? "수정 완료" : "등록하기"}
            </button>
            {editingBabyId && (
              <button onClick={() => { setEditingBabyId(null); setBabyForm({nickname:'', birth:'', memo:''}); }} style={{ flex: 1 }}>
                취소
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};