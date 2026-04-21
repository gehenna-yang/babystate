import { useState, useEffect } from 'react';
import { useCreateActivityLog, useUpdateState, useDeleteState } from '../../../hooks/useActivityLog';
import '../../../common/pagecss.css'; 

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any | null; 
}

export const ActivityModal = ({ isOpen, onClose, initialData }: ActivityModalProps) => {
  const [activityType, setActivityType] = useState('FEEDING');
  const [amount, setAmount] = useState(100); 
  const [duration, setDuration] = useState(60); 
  const [diaperState, setDiaperState] = useState('pee'); 
  const [medicine, setMedicine] = useState(''); 
  const [temperature, setTemperature] = useState(37.5); 
  const [memo, setMemo] = useState('');

  const createLogMutation = useCreateActivityLog();
  const updateLogMutation = useUpdateState();
  const deleteLogMutation = useDeleteState();

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
        setActivityType('FEEDING');
        setAmount(100); setDuration(60); setDiaperState('pee'); 
        setMedicine(''); setTemperature(37.5); setMemo('');
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let valuePayload = {};
    if (activityType === 'FEEDING') valuePayload = { amount, unit: 'ml' };
    if (activityType === 'SLEEP') valuePayload = { durationMinutes: duration };
    if (activityType === 'DIAPER') valuePayload = { state: diaperState };
    if (activityType === 'MEDICATION') valuePayload = { medicine };
    if (activityType === 'FEVER') valuePayload = { temperature };

    const payload = { type: activityType, value: valuePayload, memo: memo };

    if (initialData) {
      updateLogMutation.mutate(
        { id: initialData.id, updateData: payload },
        { onSuccess: () => onClose() }
      );
    } else {
      createLogMutation.mutate(payload, { onSuccess: () => onClose() });
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
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 className="modal-title">{initialData ? '기록 수정' : '새로운 기록 추가'}</h3>
        
        <form onSubmit={handleSubmit}>
          
          <div className="modal-form-group">
            <label className="control-label">종류</label>
            <select className="styled-select" value={activityType} onChange={(e) => setActivityType(e.target.value)}>
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
            <div className="modal-form-group">
              <label className="control-label">수유량 (ml)</label>
              <input className="styled-input" type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
            </div>
          )}
          {activityType === 'SLEEP' && (
            <div className="modal-form-group">
              <label className="control-label">수면 시간 (분)</label>
              <input className="styled-input" type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} step="10" />
            </div>
          )}
          {activityType === 'DIAPER' && (
            <div className="modal-form-group">
              <label className="control-label">상태</label>
              <select className="styled-select" value={diaperState} onChange={(e) => setDiaperState(e.target.value)}>
                <option value="pee">소변</option>
                <option value="poo">대변</option>
                <option value="both">둘 다</option>
              </select>
            </div>
          )}
          {activityType === 'MEDICATION' && (
            <div className="modal-form-group">
              <label className="control-label">약 이름</label>
              <input className="styled-input" type="text" value={medicine} onChange={(e) => setMedicine(e.target.value)} placeholder="예: 해열제, 유산균" />
            </div>
          )}
          {activityType === 'FEVER' && (
            <div className="modal-form-group">
              <label className="control-label">체온 (°C)</label>
              <input className="styled-input" type="number" value={temperature} onChange={(e) => setTemperature(Number(e.target.value))} step="0.1" />
            </div>
          )}

          <div className="modal-form-group">
            <label className="control-label">메모</label>
            <input 
              className="styled-input" 
              type="text" 
              value={memo} 
              onChange={(e) => setMemo(e.target.value)} 
              placeholder="간단한 메모를 남겨주세요" 
            />
          </div>

          <div className="modal-actions">
            {/* 삭제 버튼은 실수 방지를 위해 왼쪽 끝으로 밀어냅니다 */}
            {initialData && (
              <button type="button" onClick={handleDelete} className="danger-btn" style={{ marginRight: 'auto' }}>
                삭제
              </button>
            )}
            <button type="button" onClick={onClose} className="secondary-btn">
              취소
            </button>
            <button type="submit" disabled={createLogMutation.isPending || updateLogMutation.isPending} className="primary-btn">
              {initialData ? '수정하기' : '저장하기'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};