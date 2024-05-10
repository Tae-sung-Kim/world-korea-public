'use server';

import authService from '@/services/authService';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const session = await authService.getSession();
  // console.log(session);

  // if (!session) {
  //   redirect('/');
  // }

  return <div className="flex flex-col items-center">{children}</div>;
}
