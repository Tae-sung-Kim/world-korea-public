import GroupReservationClient from './group-reservation.client';
import { Toaster } from 'sonner';

export default function GroupReservationPage() {
  return (
    <div className="w-full h-full">
      <GroupReservationClient />
      <Toaster />
    </div>
  );
}
