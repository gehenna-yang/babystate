// src/components/ActivityLogForm.tsx
import { useCreateActivityLog } from './hooks/useActivityLog';

export const ActivityLogPage = () => {
  const logMutation = useCreateActivityLog();

  const handleLogging = (type: string, value: any) => {
    logMutation.mutate({
      type,
      value,
      memo: `${type} 기록됨`
    });
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <h4>오늘의 활동 기록</h4>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={() => handleLogging('feeding', { ml: 120, type: 'milk' })}>
          🍼 수유 (120ml)
        </button>
        <button onClick={() => handleLogging('diaper', { status: 'wet' })}>
          💩 기저귀 교체
        </button>
        <button onClick={() => handleLogging('sleep', { duration: '2h' })}>
          💤 낮잠 (2시간)
        </button>
      </div>
      
      {logMutation.isPending && <p>기록 중...</p>}
    </div>
  );
};