import { createFileRoute } from '@tanstack/react-router'
import { HistoryPage } from '../../pages/history/historyPage'

export const Route = createFileRoute('/_home/history')({
  component: () => <HistoryPage />,
})