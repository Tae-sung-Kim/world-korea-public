import LoginClient from './LoginClient';
import authService from '@/services/authService';
import { redirect } from 'next/navigation';

export default async function Login() {
  const session = await authService.getSession();

  if (session) {
    redirect('/');
  }

  return <LoginClient />;
}
