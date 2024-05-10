'use client';

import { SingInUserType, UserJwtPayloadType } from '@/types/user';
import { signIn, signOut, useSession } from 'next-auth/react';
import { createContext, useContext, useMemo, useEffect, useState } from 'react';

type AuthContextType = {
  accessToken: string | null;
  user: UserJwtPayloadType | null;
  isLoggedIn: boolean | null;
};

const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  user: null,
  isLoggedIn: null,
});

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setLoggedIn] = useState<boolean | null>(null);
  const session = useSession();

  const authValue = useMemo(() => {
    if (session.status === 'authenticated') {
      return {
        accessToken: session.data.accessToken,
        user: session.data.user,
        isLoggedIn,
      };
    }

    return {
      accessToken: null,
      user: null,
      isLoggedIn,
    };
  }, [session, isLoggedIn]);

  useEffect(() => {
    if (session.status === 'unauthenticated') {
      setLoggedIn(false);
    }

    if (session.status === 'authenticated') {
      setLoggedIn(true);
    }
  }, [session]);

  if (typeof isLoggedIn !== 'boolean') {
    return null;
  }

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext<AuthContextType>(AuthContext);
}

export default AuthProvider;
