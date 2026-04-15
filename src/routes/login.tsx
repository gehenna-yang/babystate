import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
    beforeLoad: () => {
        // const { isAuthenticated } = useAuthStore.getState()
    
        // ✅ 이미 로그인한 사람이 로그인 페이지에 오면 대시보드로 보냅니다.
        // if (isAuthenticated) {
        //   throw redirect({ to: '/dashboard' }) 
        // }
    },
    component: () => <div>🏠 로그인 화면입니다! (Vite 환경)</div>,
})