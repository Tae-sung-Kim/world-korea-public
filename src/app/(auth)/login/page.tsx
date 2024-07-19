import LoginClient from './login.client';
import authService from '@/services/auth.service';
import { redirect } from 'next/navigation';

export default async function Login() {
  const session = await authService.getSession();

  if (session) {
    redirect('/');
  }

  return <LoginClient />;
}
