import { createFileRoute } from '@tanstack/react-router'
import { DashboardPage } from '../../pages/dashboardpage'

export const Route = createFileRoute('/_home/dashboard')({
  component: () => <DashboardPage />,
})