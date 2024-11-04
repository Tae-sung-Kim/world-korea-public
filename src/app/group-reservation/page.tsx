import GroupReservationTop from './group-reservation-top.component';
import GroupReservationClient from './group-reservation.client';

export default function GroupReservationPage() {
  return (
    <div className="w-full h-full">
      <GroupReservationTop />
      <GroupReservationClient />
    </div>
  );
}
