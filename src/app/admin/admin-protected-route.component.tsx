'use client';

import { useAuthContext } from '@/contexts/auth.context';
import { USER_ROLE } from '@/definitions';
import { redirect, usePathname } from 'next/navigation';
import { useEffect, useMemo } from 'react';

type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

const restrictedPaths: Record<UserRole, string[]> = {
  partner: ['/partner/'],
  user: ['/partner/', '/admin/'],
  admin: [],
};

export default function AdminProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn, user } = useAuthContext();
  const pathName = usePathname();

  const userRole = useMemo(() => user?.role as UserRole, [user?.role]);

  const { isUrlValid } = useMemo(() => {
    if (!userRole || !pathName) {
      return { isUrlValid: false };
    }

    const restrictedPathsForRole = restrictedPaths[userRole] ?? [];

    return {
      isUrlValid: !restrictedPathsForRole.some((restrictedPath) =>
        pathName.includes(restrictedPath)
      ),
    };
  }, [userRole, pathName]);

  useEffect(() => {
    if (isLoggedIn === false || (userRole === 'user' && !isUrlValid)) {
      // 일반 회원은 admin, partner 경로 접근 제한
      redirect('/');
    } else if (userRole === 'partner' && !isUrlValid) {
      // 파트너는 파트너 경로 외 접근 제한
      redirect('/partner/orders');
    }
  }, [isLoggedIn, userRole, isUrlValid]);

  return isLoggedIn && isUrlValid ? children : null;
}
