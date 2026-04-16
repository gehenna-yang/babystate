import { createFileRoute } from '@tanstack/react-router'
import { SettingPage } from '../../pages/settings/settingsPage'

export const Route = createFileRoute('/_home/settings')({
  component: () => <SettingPage />,
})