
interface RecordCardProps {
  state: any;
  onClick: (state: any) => void;
}

export const RecordCard = ({ state, onClick }: RecordCardProps) => {
  return (
    <li className="record-card" onClick={() => onClick(state)}>
      <div className="record-header">
        <span>
          {state.type === 'FEEDING' && '🍼 수유'}
          {state.type === 'SLEEP' && '💤 수면'}
          {state.type === 'DIAPER' && '💩 배변'}
          {state.type === 'MEDICATION' && '💊 투약'}
          {state.type === 'FEVER' && '🌡️ 발열'}
          {state.type === 'BATH' && '🛁 목욕'}
          {state.type === 'OTHER' && '📝 기타'}
        </span>
        <span className="record-time">
          {new Date(state.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
      
      <div className="record-body">
        {state.type === 'FEEDING' && `수유량: ${state.value?.amount || 0} ml`}
        {state.type === 'SLEEP' && `수면 시간: ${state.value?.durationMinutes || 0} 분`}
        {state.type === 'DIAPER' && `상태: ${state.value?.state === 'pee' ? '소변' : state.value?.state === 'poo' ? '대변' : '둘 다'}`}
        {state.type === 'MEDICATION' && `약 종류: ${state.value?.medicine || '기록 없음'}`}
        {state.type === 'FEVER' && `체온: ${state.value?.temperature || 0} °C`}
      </div>
      
      {state.memo && <div className="record-memo">{state.memo}</div>}
    </li>
  );
};