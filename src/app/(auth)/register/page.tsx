import RegisterClient from './RegisterClient';
import authService from '@/services/authService';
import { redirect } from 'next/navigation';

export default async function Register() {
  const session = await authService.getSession();

  if (session) {
    redirect('/');
  }

  return <RegisterClient />;
}
