import UsersDetailClient from './users.detail.client';

export default async function UsersDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <UsersDetailClient userId={params.id} />;
}
