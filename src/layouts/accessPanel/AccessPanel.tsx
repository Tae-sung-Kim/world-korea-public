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
    <div className="relative flex items-center justify-center min-h-[3.5rem] bg-gradient-to-r from-slate-50 via-white to-slate-50 border-b border-slate-200/80 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-white/90">
      <BackgroundOverlay />
      <div className="relative flex justify-end items-center w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {isLoggedIn ? (
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              asChild 
              className="h-9 px-4 rounded-full hover:bg-slate-100/90 hover:scale-105 transition-all duration-200"
            >
              <Link href="/my/profile" className="flex items-center">
                <span className="hidden sm:inline text-slate-700 text-sm font-normal tracking-tight">
                  {user?.id}
                  <span className="text-slate-400 ml-1 text-xs">님 환영합니다</span>
                </span>
                <span className="sm:hidden text-slate-700 text-sm font-normal">{user?.id}</span>
              </Link>
            </Button>
            {isAdmin && (
              <>
                <Separator orientation="vertical" className="h-5 bg-slate-200/80" />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  asChild 
                  className="h-9 px-4 rounded-full hover:bg-slate-100/90 hover:scale-105 transition-all duration-200"
                >
                  <Link href="/admin/users" className="text-slate-600 text-sm font-normal tracking-tight">
                    관리자 페이지
                  </Link>
                </Button>
              </>
            )}
            <Separator orientation="vertical" className="h-5 bg-slate-200/80" />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogoutBtnClick}
              className="h-9 px-4 rounded-full text-slate-600 text-sm font-normal tracking-tight hover:bg-slate-100/90 hover:scale-105 transition-all duration-200"
            >
              로그아웃
            </Button>
          </div>
        ) : (
          <Button 
            variant="ghost" 
            size="sm" 
            asChild 
            className="h-9 px-4 rounded-full hover:bg-slate-100/90 hover:scale-105 transition-all duration-200"
          >
            <Link href="/auth/login" className="text-slate-600 text-sm font-normal tracking-tight">
              로그인
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
