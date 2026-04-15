import { createFileRoute } from '@tanstack/react-router'
import { HistoryPage } from '../../pages/historyPage'

export const Route = createFileRoute('/_home/history')({
  component: () => <HistoryPage />,
})