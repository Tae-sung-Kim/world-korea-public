'use client';

import { useAuthContext } from '@/contexts/AuthContext';

export default function My() {
  const { isLoggedIn, user } = useAuthContext();

  return (
    <>
      <h1>My 페이지</h1>

      {!isLoggedIn && <>로그인 해주세요</>}

      {isLoggedIn && user && <>로그인 되었음</>}
    </>
  );
}
