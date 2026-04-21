import { useState, useEffect } from 'react';
// 아까 만들어둔 생성, 수정, 삭제 훅을 모두 가져옵니다. (경로 확인해주세요!)
import { useCreateActivityLog, useUpdateState, useDeleteState } from '../../../hooks/useActivityLog';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any | null; // 클릭한 기록의 데이터를 받을 prop 추가
}

export const ActivityModal = ({ isOpen, onClose, initialData }: ActivityModalProps) => {
  const [activityType, setActivityType] = useState('FEEDING');
  const [amount, setAmount] = useState(100); 
  const [duration, setDuration] = useState(60); 
  const [diaperState, setDiaperState] = useState('pee'); 
  const [medicine, setMedicine] = useState(''); // 투약용
  const [temperature, setTemperature] = useState(37.5); // 발열용
  const [memo, setMemo] = useState('');

  const createLogMutation = useCreateActivityLog();
  const updateLogMutation = useUpdateState();
  const deleteLogMutation = useDeleteState();

  // 모달이 열릴 때, initialData가 있으면 수정 모드로 세팅하고, 없으면 초기화합니다.
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setActivityType(initialData.type);
        setMemo(initialData.memo || '');
        
        const val = initialData.value || {};
        if (initialData.type === 'FEEDING') setAmount(val.amount || 100);
        if (initialData.type === 'SLEEP') setDuration(val.durationMinutes || 60);
        if (initialData.type === 'DIAPER') setDiaperState(val.state || 'pee');
        if (initialData.type === 'MEDICATION') setMedicine(val.medicine || '');
        if (initialData.type === 'FEVER') setTemperature(val.temperature || 37.5);
      } else {
        // 새 기록 추가 모드일 경우 초기화
        setActivityType('FEEDING');
        setAmount(100); setDuration(60); setDiaperState('pee'); 
        setMedicine(''); setTemperature(37.5); setMemo('');
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 활동 타입에 따른 JSONB 데이터 구성
    let valuePayload = {};
    if (activityType === 'FEEDING') valuePayload = { amount, unit: 'ml' };
    if (activityType === 'SLEEP') valuePayload = { durationMinutes: duration };
    if (activityType === 'DIAPER') valuePayload = { state: diaperState };
    if (activityType === 'MEDICATION') valuePayload = { medicine };
    if (activityType === 'FEVER') valuePayload = { temperature };
    // BATH(목욕)와 OTHER(기타)는 별도 value 없이 타입 자체와 memo로 기록을 남깁니다.

    const payload = { type: activityType, value: valuePayload, memo: memo };

    if (initialData) {
      // 수정 모드
      updateLogMutation.mutate(
        { id: initialData.id, updateData: payload },
        { onSuccess: () => onClose() }
      );
    } else {
      // 등록 모드
      createLogMutation.mutate(
        payload,
        { onSuccess: () => onClose() }
      );
    }
  };

  const handleDelete = () => {
    if (window.confirm('이 기록을 삭제하시겠습니까?')) {
      deleteLogMutation.mutate(initialData.id, {
        onSuccess: () => onClose()
      });
    }
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <h3>{initialData ? '기록 수정' : '새로운 기록 추가'}</h3>
        <form onSubmit={handleSubmit}>
          
          <div style={{ marginBottom: '15px' }}>
            <label>종류: </label>
            <select value={activityType} onChange={(e) => setActivityType(e.target.value)}>
              <option value="FEEDING">🍼 수유</option>
              <option value="DIAPER">💩 배변</option>
              <option value="SLEEP">💤 수면</option>
              <option value="MEDICATION">💊 투약</option>
              <option value="FEVER">🌡️ 발열</option>
              <option value="BATH">🛁 목욕</option>
              <option value="OTHER">📝 기타</option>
            </select>
          </div>

          {/* 조건부 입력창들 */}
          {activityType === 'FEEDING' && (
            <div style={{ marginBottom: '15px' }}>
              <label>수유량 (ml): </label>
              <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
            </div>
          )}
          {activityType === 'SLEEP' && (
            <div style={{ marginBottom: '15px' }}>
              <label>수면 시간 (분): </label>
              <input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} step="10" />
            </div>
          )}
          {activityType === 'DIAPER' && (
            <div style={{ marginBottom: '15px' }}>
              <label>상태: </label>
              <select value={diaperState} onChange={(e) => setDiaperState(e.target.value)}>
                <option value="pee">소변</option>
                <option value="poo">대변</option>
                <option value="both">둘 다</option>
              </select>
            </div>
          )}
          {activityType === 'MEDICATION' && (
            <div style={{ marginBottom: '15px' }}>
              <label>약 이름: </label>
              <input type="text" value={medicine} onChange={(e) => setMedicine(e.target.value)} placeholder="예: 해열제, 유산균" />
            </div>
          )}
          {activityType === 'FEVER' && (
            <div style={{ marginBottom: '15px' }}>
              <label>체온 (°C): </label>
              <input type="number" value={temperature} onChange={(e) => setTemperature(Number(e.target.value))} step="0.1" />
            </div>
          )}

          <div style={{ marginBottom: '15px' }}>
            <label>메모: </label>
            <input type="text" value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="간단한 메모" style={{ width: '100%', padding: '8px' }} />
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
            {/* 수정 모드일 때만 삭제 버튼 표시 */}
            {initialData && (
              <button type="button" onClick={handleDelete} style={{ backgroundColor: '#ff4d4f', color: 'white', border: 'none', borderRadius: '4px', padding: '8px 12px', cursor: 'pointer' }}>
                삭제
              </button>
            )}
            <button type="button" onClick={onClose} style={{ padding: '8px 12px', cursor: 'pointer' }}>취소</button>
            <button type="submit" disabled={createLogMutation.isPending || updateLogMutation.isPending} style={{ backgroundColor: '#4A90E2', color: 'white', border: 'none', borderRadius: '4px', padding: '8px 12px', cursor: 'pointer' }}>
              {initialData ? '수정하기' : '저장하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const modalOverlayStyle: React.CSSProperties = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' };
const modalContentStyle: React.CSSProperties = { backgroundColor: 'white', padding: '20px', borderRadius: '8px', minWidth: '320px' };