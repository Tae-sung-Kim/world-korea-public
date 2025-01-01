'use client';

import GroupReservationBottom from './group-reservation-bottom.component';
import GroupReservationFormClient from './group-reservation-form.component';
import GroupReservationInfo from './group-reservation-info.component';
import GroupReservationTop from './group-reservation-top.component';

export default function GroupReservationClient() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8 md:space-y-12">
      <GroupReservationTop />
      <GroupReservationInfo />
      <GroupReservationFormClient />
      <GroupReservationBottom />
    </div>
  );
}
