'use client';

import { useAuthContext } from '@/contexts/auth.context';
import { redirect, usePathname } from 'next/navigation';
import { useEffect, useMemo } from 'react';

export default function HomeProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn, user } = useAuthContext();

  const isPartner = useMemo(() => user?.isPartner, [user]);

  const pathName = usePathname();

  useEffect(() => {
    if (isLoggedIn && isPartner) {
      //파트너 일때는 파트너만
      const isUrlValid = pathName.includes('/partner/');
      if (!isUrlValid) {
        redirect('/partner/pins');
      }
    }
  }, [isLoggedIn, isPartner, pathName]);

  return children;
}
