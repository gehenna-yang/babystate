import { createFileRoute } from '@tanstack/react-router'
import { DashboardPage } from '../../pages/dashboard/dashboardPage'

export const Route = createFileRoute('/_home/dashboard')({
  component: () => <DashboardPage />,
})