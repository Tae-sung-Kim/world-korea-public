import GroupReservationDetailClient from './group-reservation-detail.client';

export default function GroupReservationDetailPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  return <GroupReservationDetailClient groupReservationId={params.id} />;
}
