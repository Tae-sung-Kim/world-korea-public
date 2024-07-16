'use client';

import userService from '@/services/userService';
import { UserSessionType, UserType } from '@/types/user';
import { useSession } from 'next-auth/react';
import { createContext, useContext, useMemo, useEffect, useState } from 'react';

export interface IAuthProps {
  accessToken: string | null;
  user:
    | (UserSessionType & {
        isApproved: boolean;
      })
    | null;
  isLoggedIn: boolean | null;
}

const AuthContext = createContext<IAuthProps>({
  accessToken: null,
  user: null,
  isLoggedIn: null,
});

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const session = useSession();
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);

  const authValue = useMemo(() => {
    if (session.status === 'authenticated' && currentUser) {
      return {
        accessToken: session.data.accessToken,
        user: {
          id: session.data.user.id,
          name: session.data.user.name,
          role: session.data.user.role,
          isApproved: currentUser.isApproved,
        },
        isLoggedIn: true,
      };
    }

    return {
      accessToken: null,
      user: null,
      isLoggedIn: false,
    };
  }, [session, currentUser]);

  useEffect(() => {
    if (session.status === 'unauthenticated') {
      setCurrentUser(null);
      setInitialLoading(false);
    }

    if (session.status === 'authenticated') {
      (async () => {
        const userData = await userService.getCurrentUser();
        setCurrentUser(userData);
        setInitialLoading(false);
      })();
    }
  }, [session]);

  if (initialLoading) {
    return null;
  }

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext<IAuthProps>(AuthContext);
}

export default AuthProvider;
