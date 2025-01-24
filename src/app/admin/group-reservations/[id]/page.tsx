import GroupReservationFormClient from '@/app/group-reservations/group-reservation-form.component';

interface GroupReservationDetailPageProps {
  params: {
    id: string;
  };
}

export default function GroupReservationDetailPage({
  params,
}: GroupReservationDetailPageProps) {
  return <GroupReservationFormClient groupReservationId={params.id} />;
}
