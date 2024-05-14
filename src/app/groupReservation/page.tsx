'use server';

import authService from '@/services/authService';
import { redirect } from 'next/navigation';
import GroupReservationClient from './GroupReservationClient';

export default async function groupReservation() {

  const session = await authService.getSession();

  if (session) {
    redirect('/');
  }

  return <GroupReservationClient />
}
