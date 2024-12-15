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
    <div className="flex items-center">
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
                <span className="ml-1 text-xs bg-gradient-to-r from-slate-600 to-slate-400 text-transparent bg-clip-text font-medium">
                  님 환영합니다
                </span>
              </span>
              <span className="sm:hidden text-slate-700 text-sm font-normal">
                {user?.id}
              </span>
            </Link>
          </Button>
          {isAdmin && (
            <>
              <Separator
                orientation="vertical"
                className="h-5 bg-slate-200/80"
              />
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="h-9 px-4 rounded-full hover:bg-slate-100/90 hover:scale-105 transition-all duration-200"
              >
                <Link
                  href="/admin/users"
                  className="text-slate-600 text-sm font-normal tracking-tight"
                >
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
            className="h-9 px-4 rounded-full hover:bg-slate-100/90 hover:scale-105 transition-all duration-200"
          >
            <span className="text-slate-600 text-sm font-normal tracking-tight">
              로그아웃
            </span>
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="h-9 px-4 rounded-full hover:bg-slate-100/90 hover:scale-105 transition-all duration-200"
          >
            <Link
              href="/login"
              className="text-slate-600 text-sm font-normal tracking-tight"
            >
              로그인
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
