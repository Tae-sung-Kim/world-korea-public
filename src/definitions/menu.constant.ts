import { MenuSection } from '@/definitions/menu.type';

export const ADMIN_MENU: MenuSection[] = [
  {
    key: 'product',
    label: '상품 관리',
    items: [
      {
        label: '상품 목록',
        href: '/admin/products',
      },
      {
        label: '상품 등록',
        href: '/admin/products/create',
      },
    ],
  },
  {
    key: 'sales',
    label: '판매 관리',
    items: [
      {
        label: '판매 목록',
        href: '/admin/sale-products',
      },
      {
        label: '판매 등록',
        href: '/admin/sale-products/create',
      },
    ],
  },
  {
    key: 'purchase',
    label: '구매 관리',
    items: [
      {
        label: '구매 목록',
        href: '/admin/orders',
      },
      {
        label: '단체예약 목록',
        href: '/admin/group-reservations',
      },
    ],
  },
  {
    key: 'member',
    label: '회원 관리',
    items: [
      {
        label: '회원 구분',
        href: '/admin/user-categories',
      },
      {
        label: '회원 목록',
        href: '/admin/users',
      },
      {
        label: '파트너사 목록',
        href: '/admin/users/partner',
      },
    ],
  },
  {
    key: 'pin',
    label: '핀번호 관리',
    items: [
      {
        label: '핀번호 목록',
        href: '/admin/pins',
      },
      {
        label: '핀번호 생성',
        href: '/admin/pins/create',
      },
      {
        label: '핀번호 등록',
        href: '/admin/pins/register',
      },
      {
        label: '핀번호 사용',
        href: '/admin/pins/used',
      },
    ],
  },
  {
    key: 'popup',
    label: '팝업 관리',
    items: [
      {
        label: '팝업 목록',
        href: '/admin/notifications',
      },
      {
        label: '팝업 등록',
        href: '/admin/notifications/create',
      },
    ],
  },
];

export const PARTNER_MENU: MenuSection[] = [
  {
    key: 'purchase',
    label: '구매 관리',
    items: [
      {
        label: '구매 목록',
        href: '/partner/orders',
      },
    ],
  },
  {
    key: 'pin',
    label: '핀번호 관리',
    items: [
      {
        label: '핀번호 목록',
        href: '/partner/pins',
      },
      {
        label: '핀번호 사용',
        href: '/partner/pins/used',
      },
    ],
  },
];
