'use client';

import { useAuthContext } from './AuthContext';
import { useRouter } from 'next/navigation';
import { createContext, useEffect } from 'react';

const RouteContext = createContext(null);

//rotuer 관련 작업 context
function RouteProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuthContext();

  const isApproved = user?.isApproved;

  const router = useRouter();

  useEffect(() => {
    //승인여부
    if (isApproved === false) {
      router.replace('/unapproved');
    }
  }, [isApproved, router]);

  return <RouteContext.Provider value={null}>{children}</RouteContext.Provider>;
}

export default RouteProvider;
