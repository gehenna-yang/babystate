import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '../../store/useAuthStore'
import { NavBarLayOut } from '../../pages/navbar/navBarLayout'

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
  component: NavBarLayOut,
})