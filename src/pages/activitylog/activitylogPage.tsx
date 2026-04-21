import { useState, useEffect } from 'react';
import { useBabyStore } from '../../store/useBabyStore';
import { useGetTodayActivityLogs } from '../../hooks/useActivityLog';
import { useGetBabys } from '../../hooks/useBabys';
import { ActivityModal } from './component/activityModal';

export const ActivityLogPage = () => {
  const { currentBaby, setCurrentBaby } = useBabyStore();
  const { data: babys } = useGetBabys(); 
  const { data: todayStates, isLoading } = useGetTodayActivityLogs();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<any | null>(null); 

  // 페이지 진입 시 첫 번째 아기 자동 선택
  useEffect(() => {
    if (babys && babys.length > 0 && !currentBaby) {
      setCurrentBaby(babys[0]); 
    }
  }, [babys, currentBaby, setCurrentBaby]);

  const handleOpenCreate = () => {
    setSelectedLog(null); 
    setIsModalOpen(true);
  };

  const handleOpenEdit = (log: any) => {
    setSelectedLog(log); 
    setIsModalOpen(true);
  };

  if (!babys || babys.length === 0) return <div>등록된 아기가 없습니다. 설정 페이지에서 아기를 먼저 등록해주세요.</div>;
  if (!currentBaby) return <div>아기 정보를 불러오는 중입니다...</div>;
  
  return (
      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        
        <ActivityModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          initialData={selectedLog} 
        />
        
        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
          <label style={{ fontWeight: 'bold', marginRight: '10px' }}>현재 관리 중인 아기: </label>
          <select 
            value={currentBaby.id} 
            onChange={(e) => {
              const selected = babys?.find((b: any) => b.id === e.target.value);
              if (selected) setCurrentBaby(selected);
            }}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '16px' }}
          >
            {babys?.map((baby: any) => (
              <option key={baby.id} value={baby.id}>{baby.nickname}</option>
            ))}
          </select>
        </div>
  
        <hr style={{ border: 'none', borderTop: '1px solid #eee', marginBottom: '20px' }} />
  
        <div style={{ margin: '20px 0' }}>
          <button 
            onClick={handleOpenCreate} 
            style={{ padding: '10px 15px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}
          >
            ➕ 새로운 기록 추가
          </button>
        </div>
  
        <h3>오늘({new Date().toLocaleDateString()})의 기록</h3>
        {isLoading ? <p>불러오는 중...</p> : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {todayStates?.length === 0 && <p style={{ color: '#888' }}>오늘 등록된 기록이 없습니다.</p>}
            
            {todayStates?.map((state: any) => (
              <li 
                key={state.id} 
                onClick={() => handleOpenEdit(state)} 
                style={{ 
                  border: '1px solid #ddd', 
                  padding: '15px', 
                  marginBottom: '10px', 
                  borderRadius: '8px', 
                  cursor: 'pointer', 
                  backgroundColor: '#fafafa',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}
              >
                <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '16px' }}>
                  {state.type === 'FEEDING' && '🍼 수유'}
                  {state.type === 'SLEEP' && '💤 수면'}
                  {state.type === 'DIAPER' && '💩 배변'}
                  {state.type === 'MEDICATION' && '💊 투약'}
                  {state.type === 'FEVER' && '🌡️ 발열'}
                  {state.type === 'BATH' && '🛁 목욕'}
                  {state.type === 'OTHER' && '📝 기타'}
                  <span style={{ float: 'right', fontSize: '12px', color: 'gray', fontWeight: 'normal' }}>
                    {new Date(state.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                
                <div style={{ color: '#333' }}>
                  {state.type === 'FEEDING' && `수유량: ${state.value?.amount || 0} ml`}
                  {state.type === 'SLEEP' && `수면 시간: ${state.value?.durationMinutes || 0} 분`}
                  {state.type === 'DIAPER' && `상태: ${state.value?.state === 'pee' ? '소변' : state.value?.state === 'poo' ? '대변' : '둘 다'}`}
                  {state.type === 'MEDICATION' && `약 종류: ${state.value?.medicine || '기록 없음'}`}
                  {state.type === 'FEVER' && `체온: ${state.value?.temperature || 0} °C`}
                </div>
                
                {state.memo && (
                  <div style={{ color: '#666', fontSize: '14px', marginTop: '8px', paddingTop: '8px', borderTop: '1px dashed #ddd' }}>
                    {state.memo}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
    </div>
  );
};