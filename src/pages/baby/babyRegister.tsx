// src/components/BabyManager.tsx
import { useGetBabys, useCreateBaby } from './hooks/useBabys';
import { useBabyStore } from '../../store/useBabyStore';

export const BabyManager = () => {
  const { data: babys, isLoading } = useGetBabys();
  const createBabyMutation = useCreateBaby();
  const { currentBaby, setCurrentBaby } = useBabyStore();

  if (isLoading) return <div>아기 목록 불러오는 중...</div>;

  return (
    <div style={{ padding: '1rem', border: '1px solid #eee' }}>
      <h3>내 아기 목록</h3>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
        {babys?.map((baby: any) => (
          <button
            key={baby.id}
            onClick={() => setCurrentBaby(baby)}
            style={{
              padding: '10px 20px',
              borderRadius: '20px',
              border: '1px solid #ddd',
              backgroundColor: currentBaby?.id === baby.id ? '#007bff' : '#fff',
              color: currentBaby?.id === baby.id ? '#fff' : '#000',
              cursor: 'pointer'
            }}
          >
            {baby.nickname}
          </button>
        ))}
      </div>

      <button 
        onClick={() => createBabyMutation.mutate({ 
          nickname: '새 아기', 
          birth: new Date().toISOString(),
          memo: '반가워!'
        })}
        style={{ fontSize: '0.8rem', color: '#666' }}
      >
        + 아기 추가 등록
      </button>

      {currentBaby && (
        <div style={{ marginTop: '1rem', padding: '10px', backgroundColor: '#f9f9f9' }}>
          <strong>현재 관리 중:</strong> {currentBaby.nickname} 님
        </div>
      )}
    </div>
  );
};