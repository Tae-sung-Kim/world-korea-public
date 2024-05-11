'use client';

import { useAuthContext } from '@/contexts/AuthContext';
import { redirect } from 'next/navigation';

export default function AdminProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn } = useAuthContext();

  if (isLoggedIn === false) {
    redirect('/');
  }

  return children;
}
