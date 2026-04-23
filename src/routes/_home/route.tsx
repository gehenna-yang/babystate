import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '../../store/useAuthStore'
import { NavBarLayOut } from '../../pages/navbar/navBarLayout'

export const Route = createFileRoute('/_home')({
  beforeLoad: ({ location }) => {
    const { accessToken } = useAuthStore.getState()
  
    if (!accessToken) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href, 
        },
      })
    }
  },
  component: NavBarLayOut,
})