import { createFileRoute } from '@tanstack/react-router'
import { ActivityLogPage } from '../../pages/activitylog/activitylogPage'

export const Route = createFileRoute('/_home/activitylog')({
  component: () => <ActivityLogPage />,
})