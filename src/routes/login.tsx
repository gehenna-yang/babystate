import { createFileRoute, redirect } from '@tanstack/react-router'
import { LoginPage } from '../pages/account/loginPage'
import { useAuthStore } from '../store/useAuthStore'

export const Route = createFileRoute('/login')({
    beforeLoad: () => {
        const { accessToken } = useAuthStore.getState()
    
        if (accessToken) {
          throw redirect({ to: '/dashboard' }) 
        }
    },
    component: () => <LoginPage />,
})