'use client';

import { ADMIN_MENU, PARTNER_MENU, MY_MENU } from '@/definitions/menu.constant';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { HiChevronRight } from 'react-icons/hi';

interface BreadcrumbProps {
  type: 'admin' | 'partner' | 'my';
}

export default function Breadcrumb({ type }: BreadcrumbProps) {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    let menu;

    if (type === 'admin') {
      menu = ADMIN_MENU;
    } else if (type === 'partner') {
      menu = PARTNER_MENU;
    } else if (type === 'my') {
      menu = MY_MENU;
    }

    if (!menu) return [];

    // 현재 경로에 맞는 메뉴 아이템 찾기

    for (const section of menu) {
      for (const item of section.items) {
        if (pathname === item.href) {
          return [
            {
              label: section.label,

              href: '#',
            },

            {
              label: item.label,

              href: item.href,
            },
          ];
        }
      }
    }

    return [];
  }, [pathname, type]);

  if (breadcrumbs.length === 0) return null;

  return (
    <nav className="flex items-center space-x-2 text-sm m-4 bg-gray-50 px-4 py-2 rounded-lg">
      {breadcrumbs.map((item, index) => (
        <div key={item.href} className="flex items-center">
          {index > 0 && (
            <HiChevronRight className="mx-2 h-4 w-4 text-gray-400" />
          )}
          {item.href === '#' ? (
            <span className="text-gray-500">{item.label}</span>
          ) : (
            <span className="font-medium text-gray-900 bg-white px-3 py-1 rounded-md shadow-sm">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
