import { Link, Outlet, useNavigate } from '@tanstack/react-router';
import './navBarCss.css';
import { useAuthStore } from '../../store/useAuthStore';

export const NavBarLayOut = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('정말 로그아웃 하시겠습니까?')) {
      useAuthStore.getState().logout();
      
      navigate({ to: '/login' });
    }
  };

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
          <Link to="/dashboard" className="nav-link" activeProps={{ className: 'active' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>대시보드</span>
          </Link>
          
          <Link to="/activitylog" className="nav-link" activeProps={{ className: 'active' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>활동기록</span>
          </Link>
          
          <Link to="/history" className="nav-link" activeProps={{ className: 'active' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>히스토리</span>
          </Link>
          
          <Link to="/settings" className="nav-link" activeProps={{ className: 'active' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>설정</span>
          </Link>

          <button onClick={handleLogout} className="logout-btn">
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>로그아웃</span>
          </button>
        </nav>
      </header>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};