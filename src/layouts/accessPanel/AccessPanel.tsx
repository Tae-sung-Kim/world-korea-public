'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuthContext } from '@/contexts/auth.context';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import 'next/navigation';
import BackgroundOverlay from '@/components/common/BackgroundOverlay';

export default function AccessPanel() {
  const { isLoggedIn, user } = useAuthContext();
  const isAdmin = user?.role === 'admin';

  const handleLogoutBtnClick = () => {
    signOut();
  };

  return (
    <div className="relative flex items-center justify-center min-h-[3rem] bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200/80 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-gray-50/80">
      <BackgroundOverlay />
      <div className="relative flex justify-end items-center w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {isLoggedIn ? (
          <div className="flex items-center gap-3 sm:gap-4">
            <Button variant="ghost" size="sm" asChild className="h-9 px-3 hover:bg-gray-100/80 transition-colors">
              <Link href="/my/profile" className="flex items-center">
                <span className="hidden sm:inline text-gray-700 font-medium">
                  {user?.id}님 환영합니다
                </span>
                <span className="sm:hidden text-gray-700 font-medium">{user?.id}</span>
              </Link>
            </Button>
            {isAdmin && (
              <>
                <Separator orientation="vertical" className="h-4 bg-gray-200" />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  asChild 
                  className="h-9 px-3 hover:bg-gray-100/80 transition-colors"
                >
                  <Link href="/admin/users" className="text-gray-700 font-medium">
                    관리자 페이지
                  </Link>
                </Button>
              </>
            )}
            <Separator orientation="vertical" className="h-4 bg-gray-200" />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogoutBtnClick}
              className="h-9 px-3 text-gray-700 font-medium hover:bg-gray-100/80 transition-colors"
            >
              로그아웃
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2 sm:gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              asChild 
              className="h-9 px-3 text-gray-700 font-medium hover:bg-gray-100/80 transition-colors"
            >
              <Link href="/login">로그인</Link>
            </Button>
            <Separator orientation="vertical" className="h-4 bg-gray-200" />
            <Button 
              variant="ghost" 
              size="sm" 
              asChild 
              className="h-9 px-3 text-gray-700 font-medium hover:bg-gray-100/80 transition-colors"
            >
              <Link href="/register">회원가입</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
