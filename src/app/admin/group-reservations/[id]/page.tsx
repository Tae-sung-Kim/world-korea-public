import GroupReservationDetailClient from './group-reservation-detail.client';

interface GroupReservationDetailPageProps {
  params: {
    id: string;
  };
}

export default function GroupReservationDetailPage({
  params,
}: GroupReservationDetailPageProps) {
  return <GroupReservationDetailClient id={params.id} />;
}
