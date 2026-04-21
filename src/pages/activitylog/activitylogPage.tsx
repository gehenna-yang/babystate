// src/pages/ActivityLogPage.tsx (또는 해당 경로)
import { useState, useEffect } from 'react';
import { useBabyStore } from '../../store/useBabyStore';
import { useGetTodayActivityLogs } from '../../hooks/useActivityLog';
import { useGetBabys } from '../../hooks/useBabys';
import { ActivityModal } from './component/activityModal';
import { RecordCard } from '../../common/component/recordCard';
import '../../common/pagecss.css';

export const ActivityLogPage = () => {
  const { currentBaby, setCurrentBaby } = useBabyStore();
  const { data: babys } = useGetBabys(); 
  const { data: todayStates, isLoading } = useGetTodayActivityLogs();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<any | null>(null); 

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

  if (!babys || babys.length === 0) return <div className="page-wrapper">등록된 아기가 없습니다. 설정 페이지에서 아기를 먼저 등록해주세요.</div>;
  if (!currentBaby) return <div className="page-wrapper">아기 정보를 불러오는 중입니다...</div>;
  
  return (
    <div className="page-wrapper">
      <ActivityModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialData={selectedLog} 
      />
      
      <header className="page-header">
        <h1 className="page-title">활동 기록</h1>
        <div className="control-box">
          <label className="control-label">현재 관리 중인 아기</label>
          <select 
            className="styled-select"
            value={currentBaby.id} 
            onChange={(e) => {
              const selected = babys?.find((b: any) => b.id === e.target.value);
              if (selected) setCurrentBaby(selected);
            }}
          >
            {babys?.map((baby: any) => (
              <option key={baby.id} value={baby.id}>{baby.nickname}</option>
            ))}
          </select>
        </div>
      </header>

      <div style={{ marginBottom: '2rem' }}>
        <button className="primary-btn" onClick={handleOpenCreate}>
          ➕ 새로운 기록 추가
        </button>
      </div>

      <h3 style={{ color: '#5d605f', marginBottom: '1rem' }}>
        오늘({new Date().toLocaleDateString()})의 기록
      </h3>
      
      {isLoading ? <p>불러오는 중...</p> : (
        <ul className="record-list">
          {todayStates?.length === 0 && <p style={{ color: '#888' }}>오늘 등록된 기록이 없습니다.</p>}
          
          {todayStates?.map((state: any) => (
            <RecordCard 
              key={state.id} 
              state={state} 
              onClick={handleOpenEdit} 
            />
          ))}
        </ul>
      )}
    </div>
  );
};