'use client';

import { useAuthContext } from './auth.context';
import { useRouter, usePathname } from 'next/navigation';
import { createContext, useEffect } from 'react';

const RouteContext = createContext(null);

//rotuer 관련 작업 context
function RouteProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuthContext();

  const isApproved = user?.isApproved;

  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    //승인여부
    if (isApproved === false) {
      router.replace('/unapproved');
    }
  }, [isApproved, router, pathName]);

  return <RouteContext.Provider value={null}>{children}</RouteContext.Provider>;
}

export default RouteProvider;
