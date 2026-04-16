import { createFileRoute, redirect } from '@tanstack/react-router'
import { LoginPage } from '../pages/account/loginPage'
import { useAuthStore } from '../store/useAuthStore'

export const Route = createFileRoute('/login')({
    beforeLoad: () => {
        const { accessToken } = useAuthStore.getState()
    
        // ✅ 이미 로그인한 사람이 로그인 페이지에 오면 대시보드로 보냅니다.
        if (accessToken) {
          throw redirect({ to: '/dashboard' }) 
        }
    },
    component: () => <LoginPage />,
})