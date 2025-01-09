'use client';

import { useAuthContext } from '@/contexts/auth.context';
import { redirect, usePathname } from 'next/navigation';
import { useEffect, useMemo } from 'react';

export default function AdminProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn, user } = useAuthContext();

  const { isPartner, isUser } = useMemo(() => {
    const isPartner = user?.isPartner;
    const isAdmin = user?.isAdmin;
    const isUser = !isPartner && !isAdmin;

    return {
      isPartner,
      isAdmin,
      isUser,
    };
  }, [user]);

  const pathName = usePathname();

  useEffect(() => {
    if (isLoggedIn === false || isUser) {
      redirect('/');
    }

    if (isPartner) {
      //파트너 일때는 파트너만
      const isUrlValid = pathName.includes('/partner/');
      if (!isUrlValid) {
        redirect('/partner/pins');
      }
    }
  }, [isLoggedIn, isPartner, , isUser, pathName]);

  return children;
}
