'use client';

import { useAuthContext } from '@/contexts/AuthContext';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn } = useAuthContext();

  useEffect(() => {
    if (isLoggedIn === false) {
      redirect('/');
    }
  }, [isLoggedIn]);

  return children;
}
