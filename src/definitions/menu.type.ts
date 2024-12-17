export type MenuKey =
  | 'my'
  | 'product'
  | 'sales'
  | 'purchase'
  | 'member'
  | 'pin'
  | 'popup';

export interface MenuItem {
  label: string;
  href: string;
  children?: MenuItem[];
}

export interface MenuSection {
  key: MenuKey;
  label: string;
  items: MenuItem[];
}
