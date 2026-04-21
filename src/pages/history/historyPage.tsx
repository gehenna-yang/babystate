// src/pages/HistoryPage.tsx
import { useState } from 'react';
import { useBabyStore } from '../../store/useBabyStore';
import { useGetHistoryStates } from '../../hooks/useActivityLog';
import { ActivityModal } from '../activitylog/component/activityModal';
import '../../common/pagecss.css';

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

  if (!currentBaby) return <div className="page-wrapper">선택된 아기가 없습니다. 대시보드에서 아기를 선택해주세요.</div>;

  return (
    <div className="page-wrapper">
      <header className="page-header">
        <h2 className="page-title">📖 {currentBaby.nickname}의 기록 히스토리</h2>
      </header>
      
      <ActivityModal
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialData={selectedLog}
      />

      <div className="control-box" style={{ marginBottom: '2rem', display: 'inline-flex' }}>
        <label className="control-label">날짜 선택: </label>
        <input 
          className="styled-input"
          type="date" 
          value={selectedDate} 
          onChange={(e) => setSelectedDate(e.target.value)} 
        />
      </div>

      {isLoading ? <p>불러오는 중...</p> : (
        <ul className="record-list">
          {historyStates?.length === 0 && <p style={{ color: '#888' }}>해당 날짜에 등록된 기록이 없습니다.</p>}
          
          {historyStates?.map((state: any) => (
            <li key={state.id} className="record-card" onClick={() => handleOpenEdit(state)}>
              <div className="record-header">
                <span>
                  {state.type === 'FEEDING' && '🍼 수유'}
                  {state.type === 'SLEEP' && '💤 수면'}
                  {state.type === 'DIAPER' && '💩 배변'}
                  {state.type === 'MEDICATION' && '💊 투약'}
                  {state.type === 'FEVER' && '🌡️ 체온'}
                  {state.type === 'BATH' && '🛁 목욕'}
                  {state.type === 'OTHER' && '📝 기타'}
                </span>
                <span className="record-time">
                  {new Date(state.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              
              <div className="record-body">
                {state.type === 'FEEDING' && `수유량: ${state.value?.amount} ml`}
                {state.type === 'SLEEP' && `수면 시간: ${state.value?.durationMinutes} 분`}
                {state.type === 'DIAPER' && `상태: ${state.value?.state === 'pee' ? '소변' : state.value?.state === 'poo' ? '대변' : '둘 다'}`}
                {state.type === 'MEDICATION' && `약 종류: ${state.value?.medicine}`}
                {state.type === 'FEVER' && `체온: ${state.value?.temperature} °C`}
              </div>
              {state.memo && <div className="record-memo">{state.memo}</div>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};