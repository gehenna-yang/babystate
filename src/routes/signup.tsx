// src/routes/signup.tsx
import { createFileRoute } from '@tanstack/react-router'
import { SignupPage } from '../pages/account/signupPage'

export const Route = createFileRoute('/signup')({
  component:() => <SignupPage />,
})