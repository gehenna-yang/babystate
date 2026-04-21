import { useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from '@tanstack/react-router';
import { useAuthStore } from '../../store/useAuthStore';
import { useQueryClient } from '@tanstack/react-query';
import { useBabyStore } from '../../store/useBabyStore';
import { useGetBabys } from '../../hooks/useBabys';
import './NavBarLayout.css';

export const NavBarLayOut = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { setCurrentBaby } = useBabyStore();
  const { data: babys, isLoading } = useGetBabys();

  useEffect(() => {
    if (!isLoading && babys) {
      if (babys.length === 0 && location.pathname !== '/settings') {
        alert('등록된 아기가 없습니다. 아기를 먼저 등록해주세요!');
        navigate({ to: '/settings', replace: true });
      }
    }
  }, [babys, isLoading, location.pathname, navigate]);

  const handleLogout = () => {
    if (window.confirm('정말 로그아웃 하시겠습니까?')) {
      useAuthStore.getState().logout();
      queryClient.clear();
      setCurrentBaby(null);
      navigate({ to: '/login' });
    }
  };

  if (isLoading) return <div className="layout-container">로딩 중...</div>;

  const isNoBaby = !babys || babys.length === 0;
  const isNotSettings = location.pathname !== '/settings';

  return (
    <div className="layout-container">
      <header className="navbar-header">
        <Link to="/dashboard" className="nav-brand">
          <div className="brand-icon-small">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: '20px' }}>👶</span>
          </div>
          Baby State
        </Link>

        <nav className="nav-links">
          <Link 
            to="/dashboard" 
            className={`nav-link ${isNoBaby ? 'disabled' : ''}`} 
            disabled={isNoBaby}
            activeProps={{ className: 'active' }}
          >
            대시보드
          </Link>
          
          <Link 
            to="/activitylog" 
            className={`nav-link ${isNoBaby ? 'disabled' : ''}`} 
            disabled={isNoBaby}
            activeProps={{ className: 'active' }}
          >
            활동기록
          </Link>
          
          <Link 
            to="/history" 
            className={`nav-link ${isNoBaby ? 'disabled' : ''}`} 
            disabled={isNoBaby}
            activeProps={{ className: 'active' }}
          >
            히스토리
          </Link>
          
          <Link to="/settings" className="nav-link" activeProps={{ className: 'active' }}>
            설정
          </Link>

          <button onClick={handleLogout} className="logout-btn">
            로그아웃
          </button>
        </nav>
      </header>

      <main className="main-content">
        {isNoBaby && isNotSettings ? (
          <div className="page-wrapper">아기 등록이 필요합니다. 잠시만 기다려주세요...</div>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
};