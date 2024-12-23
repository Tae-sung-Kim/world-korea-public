import { useAuthContext } from '@/contexts/auth.context';
import { ADMIN_MENU, PARTNER_MENU, MY_MENU } from '@/definitions/menu.constant';
import { MenuKey } from '@/definitions/menu.type';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useMemo } from 'react';
import { IconType } from 'react-icons';
import { AiOutlineNotification, AiOutlineProduct } from 'react-icons/ai';
import { BiPurchaseTag } from 'react-icons/bi';
import { TbTicket, TbUser } from 'react-icons/tb';
import { TiSortNumericallyOutline } from 'react-icons/ti';

const MENU_ICONS: Record<MenuKey, IconType> = {
  my: TbUser,
  product: AiOutlineProduct,
  sales: BiPurchaseTag,
  purchase: TbTicket,
  member: TbUser,
  pin: TiSortNumericallyOutline,
  popup: AiOutlineNotification,
} as const;

export default function MenuNavigation({
  title = '관리자',
  isMy = false,
}: {
  title?: string;
  isMy?: boolean;
}) {
  const { user } = useAuthContext();
  const { isAdmin, isPartner } = user ?? {};

  const menus = useMemo(
    () => (isMy ? MY_MENU : isAdmin ? ADMIN_MENU : PARTNER_MENU),
    [isAdmin, isMy]
  );

  const pathname = usePathname();

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800">{title} 메뉴</h2>
          <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-2 rounded-full"></div>
        </div>
      </div>
      <nav className="flex-1">
        <ul className="space-y-3 p-4">
          {menus.map((section) => (
            <li key={section.label}>
              <div className="mb-2">
                <span className="flex items-center px-3 py-2 text-gray-800 rounded-xl bg-gray-50/80 shadow-sm backdrop-blur-sm">
                  {section.key in MENU_ICONS && (
                    <span className="mr-2">
                      {React.createElement(MENU_ICONS[section.key as MenuKey], {
                        className: 'w-5 h-5 text-indigo-600',
                      })}
                    </span>
                  )}
                  <span className="font-medium">{section.label}</span>
                </span>
                <ul className="mt-1.5 space-y-0.5">
                  {section.items.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className={`flex items-center px-4 py-2 text-sm rounded-xl hover:bg-gray-100 transition-colors ${
                          pathname === item.href
                            ? 'bg-indigo-50 text-indigo-600 font-medium'
                            : 'text-gray-700'
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
