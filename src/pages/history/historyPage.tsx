import { useState } from 'react';
import { useBabyStore } from '../../store/useBabyStore';
import { useGetHistoryStates } from '../../hooks/useActivityLog';
import { ActivityModal } from '../activitylog/component/activityModal';

export const HistoryPage = () => {
  const { currentBaby } = useBabyStore();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<any | null>(null); 
  const { data: historyStates, isLoading } = useGetHistoryStates(selectedDate);

  const handleOpenEdit = (log: any) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  };


  if (!currentBaby) return <div>선택된 아기가 없습니다. 대시보드에서 아기를 선택해주세요.</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>📖 {currentBaby.nickname}의 기록 히스토리</h2>
      
      <ActivityModal
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialData={selectedLog}
      />

      <div style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '10px' }}>날짜 선택: </label>
        <input 
          type="date" 
          value={selectedDate} 
          onChange={(e) => setSelectedDate(e.target.value)} 
          style={{ padding: '5px' }}
        />
      </div>

      {isLoading ? <p>불러오는 중...</p> : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {historyStates?.length === 0 && <p>해당 날짜에 등록된 기록이 없습니다.</p>}
          
          {historyStates?.map((state: any) => (
            <li 
            key={state.id} 
            onClick={() => handleOpenEdit(state)}
            style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '10px', borderRadius: '8px', cursor: 'pointer', backgroundColor: '#fafafa' }}
          >
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
              {state.type === 'FEEDING' && '🍼 수유'}
              {state.type === 'SLEEP' && '💤 수면'}
              {state.type === 'DIAPER' && '💩 배변'}
              {state.type === 'MEDICATION' && '💊 투약'}
              {state.type === 'FEVER' && '🌡️ 체온'}
              {state.type === 'BATH' && '🛁 목욕'}
              {state.type === 'OTHER' && '📝 기타'}
              <span style={{ float: 'right', fontSize: '12px', color: 'gray' }}>
                {new Date(state.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            
            <div>
              {state.type === 'FEEDING' && `수유량: ${state.value?.amount} ml`}
              {state.type === 'SLEEP' && `수면 시간: ${state.value?.durationMinutes} 분`}
              {state.type === 'DIAPER' && `상태: ${state.value?.state === 'pee' ? '소변' : state.value?.state === 'poo' ? '대변' : '둘 다'}`}
              {state.type === 'MEDICATION' && `약 종류: ${state.value?.medicine}`}
              {state.type === 'FEVER' && `체온: ${state.value?.temperature} °C`}
            </div>
            {state.memo && <div style={{ color: '#666', fontSize: '14px', marginTop: '5px' }}>메모: {state.memo}</div>}
          </li>
          ))}
        </ul>
      )}
    </div>
  );
};