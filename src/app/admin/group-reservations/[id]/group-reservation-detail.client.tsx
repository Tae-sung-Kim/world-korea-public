'use client';

import DetailTitle from '@/app/components/common/detail-title.component';
import GroupReservationFormClient from '@/app/group-reservations/group-reservation-form.component';

interface GroupReservationDetailClientProps {
  id: string;
}

export default function GroupReservationDetailClient({
  id,
}: GroupReservationDetailClientProps) {
  return (
    <>
      <DetailTitle title="단체 예약 상세" />
      <GroupReservationFormClient groupReservationId={id} />
    </>
  );
}
