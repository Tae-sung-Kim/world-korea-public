'use client';

import { ADMIN_MENU, PARTNER_MENU } from '@/definitions/menu.constant';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { HiChevronRight } from 'react-icons/hi';

interface BreadcrumbProps {
  type: 'admin' | 'partner';
}

export default function Breadcrumb({ type }: BreadcrumbProps) {
  const pathname = usePathname();
  
  const breadcrumbs = useMemo(() => {
    const menu = type === 'admin' ? ADMIN_MENU : PARTNER_MENU;
    
    // 현재 경로에 맞는 메뉴 아이템 찾기
    for (const section of menu) {
      for (const item of section.items) {
        if (item.href === pathname) {
          return [
            {
              label: section.label,
              href: '#'
            },
            {
              label: item.label,
              href: item.href
            }
          ];
        }
      }
    }
    
    return [];
  }, [pathname, type]);

  if (breadcrumbs.length === 0) return null;

  return (
    <nav className="flex items-center space-x-2 text-sm mb-4">
      {breadcrumbs.map((item, index) => (
        <div key={item.href} className="flex items-center">
          {index > 0 && (
            <HiChevronRight className="mx-2 h-4 w-4 text-gray-400" />
          )}
          {item.href === '#' ? (
            <span className="text-gray-600">{item.label}</span>
          ) : (
            <span className="font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
