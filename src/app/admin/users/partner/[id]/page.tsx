import PartnerDetailClient from './partner-detail.client';

export default async function PartnerDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <PartnerDetailClient userId={params.id} />;
}
