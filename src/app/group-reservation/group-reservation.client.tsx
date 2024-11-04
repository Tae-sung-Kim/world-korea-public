'use client';

import GroupReservationBottom from './group-reservation-bottom.component';
import GroupReservationForm from './group-reservation-form.component';
import GroupReservationInfo from './group-reservation-info.component';
import GroupReservationTop from './group-reservation-top.component';

export default function GroupReservationClient() {
  return (
    <div className="m-10 space-y-8">
      <GroupReservationTop />
      <GroupReservationInfo />
      <GroupReservationForm />
      <GroupReservationBottom />
    </div>
  );
}
