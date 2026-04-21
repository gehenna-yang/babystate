import { useEffect, useMemo } from 'react';
import { useBabyStore } from '../../store/useBabyStore';
import { useGetBabys } from '../../hooks/useBabys';
import { useGetTodayActivityLogs } from '../../hooks/useActivityLog';
import './dashboard.css';
import { ItemCard } from './component/itemCard';

export const DashboardPage = () => {
  const { currentBaby, setCurrentBaby } = useBabyStore();
  const { data: babys, isLoading: isBabysLoading } = useGetBabys();
  const { data: todayStates, isLoading: isStatesLoading } = useGetTodayActivityLogs();

  useEffect(() => {
    if (babys && babys.length > 0 && !currentBaby) {
      setCurrentBaby(babys[0]);
    }
  }, [babys, currentBaby, setCurrentBaby]);

  const getTimeElapsed = (timestamp: string | null) => {
    if (!timestamp) return '기록 없음';
    const now = new Date();
    const target = new Date(timestamp);
    const diffMs = now.getTime() - target.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return '방금 전';
    if (diffMins < 60) return `${diffMins}분 전`;
    
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hours}시간 ${mins}분 전`;
  };

  const summary = useMemo(() => {
    if (!todayStates) return { totalFeed: 0, totalPoo: 0, medications: {}, lastFeed: null, lastPoo: null };

    let totalFeed = 0;
    let totalPoo = 0;
    const medications: Record<string, number> = {};
    
    const lastFeed = todayStates.find((s: any) => s.type === 'FEEDING')?.created_at || null;
    const lastPoo = todayStates.find((s: any) => 
      s.type === 'DIAPER' && (s.value?.state === 'poo' || s.value?.state === 'both')
    )?.created_at || null;

    todayStates.forEach((state: any) => {
      if (state.type === 'FEEDING' && state.value?.amount) {
        totalFeed += state.value.amount;
      }
      if (state.type === 'DIAPER' && (state.value?.state === 'poo' || state.value?.state === 'both')) {
        totalPoo += 1;
      }
      if (state.type === 'MEDICATION' && state.value?.medicine) {
        const medName = state.value.medicine;
        medications[medName] = (medications[medName] || 0) + 1;
      }
    });

    return { totalFeed, totalPoo, medications, lastFeed, lastPoo };
  }, [todayStates]);

  if (isBabysLoading) return <div className="dashboard-wrapper">데이터 로딩 중...</div>;
  if (!currentBaby) return null;

  return (
    <div className="dashboard-wrapper">
      <header className="dashboard-header">
        <h1 className="dashboard-title">대시보드</h1>
        <div className="baby-selector-group">
          <span className="total-babies-badge">총 아기 수 : {babys?.length}명</span>
          <select 
            className="baby-select"
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

      <section className="profile-card">
        <div className="profile-icon">
          <span className="material-symbols-outlined" style={{ fontSize: '36px', fontVariationSettings: "'FILL' 1" }}>👶</span>
        </div>
        <div className="profile-info">
          <h2>{currentBaby.nickname}</h2>
          <p>태어난 지 <strong>총 {Math.floor((new Date().getTime() - new Date(currentBaby.birth).getTime()) / (1000*60*60*24))}일</strong></p>
        </div>
      </section>

      <div className="summary-grid">

        <ItemCard title='오늘 총 수유량' type='feed' icon='🍼' value={summary.totalFeed} unit='ml' lastTime={getTimeElapsed(summary.lastFeed)}/>
        <ItemCard title='오늘 대변 횟수' type='poo' icon='💩' value={summary.totalPoo} unit='회'/>

        <div className="summary-card">
          <div className="card-header">
            <div className="card-icon med-icon"><span className="material-symbols-outlined">💊</span></div>
            <span>오늘 투약 내역</span>
          </div>
          {Object.keys(summary.medications).length > 0 ? (
            <ul className="med-list">
              {Object.entries(summary.medications).map(([name, count]) => (
                <li key={name} className="med-item"><span>{name}</span><span>{count}회</span></li>
              ))}
            </ul>
          ) : (
            <div className="no-data">투약 기록 없음</div>
          )}
        </div>
      </div>
    </div>
  );
};
