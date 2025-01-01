'use client';

import GroupReservationBottom from './group-reservation-bottom.component';
import GroupReservationFormClient from './group-reservation-form.component';
import GroupReservationInfo from './group-reservation-info.component';
import GroupReservationTop from './group-reservation-top.component';

export default function GroupReservationClient() {
  return (
    <div className="max-w-7xl mx-auto">
      <GroupReservationTop />
      <GroupReservationInfo />
      <GroupReservationFormClient />
      <GroupReservationBottom />
    </div>
  );
}
