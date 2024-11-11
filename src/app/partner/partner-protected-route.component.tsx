'use client';

import { useAuthContext } from '@/contexts/auth.context';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function PartnerProtectedRoute({
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
