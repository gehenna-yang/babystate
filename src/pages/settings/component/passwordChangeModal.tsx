// src/pages/setting/component/PasswordChangeModal.tsx
import { useState } from 'react';
import { useUpdateUser } from '../../../hooks/useUsers';
import '../../../common/pagecss.css';

interface PasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PasswordChangeModal = ({ isOpen, onClose }: PasswordChangeModalProps) => {
  const updateUserMutation = useUpdateUser();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword) return alert("기존 비밀번호를 입력해주세요.");
    if (newPassword !== confirmPassword) return alert("새 비밀번호가 일치하지 않습니다.");
    if (newPassword.length < 4) return alert("새 비밀번호는 4자리 이상이어야 합니다.");

    updateUserMutation.mutate({ 
      old_password: oldPassword, 
      new_password: newPassword 
    }, {
      onSuccess: () => {
        alert("비밀번호가 안전하게 변경되었습니다.");
        handleClose();
      },
      onError: (error: any) => {
        alert(error.message || "기존 비밀번호가 틀렸거나 변경에 실패했습니다.");
      }
    });
  };

  const handleClose = () => {
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 className="modal-title">비밀번호 변경</h3>
        <form onSubmit={handleUpdatePassword}>
          <div className="modal-form-group">
            <label className="control-label">기존 비밀번호</label>
            <input 
              className="styled-input" 
              type="password" 
              value={oldPassword} 
              onChange={(e) => setOldPassword(e.target.value)} 
              placeholder="현재 비밀번호 입력"
            />
          </div>
          <div className="modal-form-group" style={{ marginTop: '1.5rem' }}>
            <label className="control-label">새 비밀번호</label>
            <input 
              className="styled-input" 
              type="password" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              placeholder="새로운 비밀번호 입력"
            />
          </div>
          <div className="modal-form-group">
            <label className="control-label">새 비밀번호 확인</label>
            <input 
              className="styled-input" 
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              placeholder="새로운 비밀번호 재입력"
            />
          </div>
          
          <div className="modal-actions" style={{ marginTop: '2rem' }}>
            <button type="button" onClick={handleClose} className="secondary-btn">취소</button>
            <button type="submit" disabled={updateUserMutation.isPending} className="primary-btn">
              {updateUserMutation.isPending ? "변경 중..." : "변경하기"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};