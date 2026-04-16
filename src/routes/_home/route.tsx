import { createFileRoute, Link, Outlet, redirect } from '@tanstack/react-router'
import { useAuthStore } from '../../store/useAuthStore'

export const Route = createFileRoute('/_home')({
  beforeLoad: ({ location }) => {
    const { accessToken } = useAuthStore.getState() // 스토어에서 로그인 상태 가져오기
  
    if (!accessToken) {
      // 로그인이 안 되어 있다면 login 페이지로 강제 이동
      throw redirect({
        to: '/login',
        search: {
          // 로그인 후 다시 돌아올 주소를 저장해두면 센스 만점!
          redirect: location.href, 
        },
      })
    }
  },
  component: HomeLayout,
})

function HomeLayout() {
  return (
    <div style={{ padding: '20px' }}>
      <nav style={{display:'flex', gap: '10px'}}>
        <Link to="/dashboard">대시보드</Link>
        <Link to="/activitylog">활동기록</Link>
        <Link to="/history">히스토리</Link>
        <Link to="/settings">설정</Link>
      </nav>
      <hr />
      <Outlet />
    </div>
  )
}