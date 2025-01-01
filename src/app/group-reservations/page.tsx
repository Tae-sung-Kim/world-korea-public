import GroupReservationClient from './group-reservation.client';
import { Toaster } from 'sonner';

export default function GroupReservationPage() {
  return (
    <main className="w-full h-full overflow-y-auto bg-gray-50">
      <GroupReservationClient />
      <Toaster />
    </main>
  );
}
