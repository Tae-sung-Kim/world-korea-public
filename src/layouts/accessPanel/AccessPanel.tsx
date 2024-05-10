'use client';

import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/contexts/AuthContext';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

export default function AccessPanel() {
  const { isLoggedIn } = useAuthContext();

  const handleLogoutBtnClick = () => {
    signOut({ redirect: false });
  };

  return (
    <div className="h-9 flex justify-end">
      {isLoggedIn ? (
        <Button onClick={handleLogoutBtnClick}>로그아웃</Button>
      ) : (
        <Link href="/signin">로그인</Link>
      )}
      <Link href="/signup">회원가입</Link>
      <Link href="/admin/users">회원목록</Link>
    </div>
  );
}
