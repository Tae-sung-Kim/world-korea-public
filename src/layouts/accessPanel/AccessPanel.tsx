'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuthContext } from '@/contexts/auth.context';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import 'next/navigation';

export default function AccessPanel() {
  const { isLoggedIn, user } = useAuthContext();

  const isAdmin = user?.role === 'admin';

  const handleLogoutBtnClick = () => {
    signOut();
  };

  return (
    <div className="flex items-center justify-center h-9 bg-white">
      <div className="flex justify-end items-center space-x-4 w-[1200px] text-gray-400">
        {isLoggedIn ? (
          <>
            <Link
              href="/my/profile"
              className="text-sm hover:text-gray-700 hover:underline"
            >
              {user?.id}님 환영합니다.
            </Link>
            {isAdmin && (
              <>
                <Separator orientation="vertical" className="bg-gray-400 h-3" />
                <Link
                  href="/admin/users"
                  className="text-sm hover:text-gray-700 hover:underline"
                >
                  관리자 페이지
                </Link>
              </>
            )}
            <Separator orientation="vertical" className="bg-gray-400 h-3" />
            <button
              className="text-sm hover:text-gray-700"
              onClick={handleLogoutBtnClick}
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-sm hover:text-gray-700">
              로그인
            </Link>
            <Separator orientation="vertical" className="bg-gray-400 h-3" />
            <Link href="/register" className="text-sm hover:text-gray-700">
              회원가입
            </Link>
          </>
        )}
        {/* <Link href="/admin/users" className="text-sm">
          회원목록
        </Link> */}
      </div>
    </div>
  );
}
