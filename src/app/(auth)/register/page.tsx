import RegisterClient from './register.client';
import authService from '@/services/auth.service';
import { redirect } from 'next/navigation';

export default async function Register() {
  const session = await authService.getSession();

  if (session) {
    redirect('/');
  }

  return <RegisterClient />;
}
