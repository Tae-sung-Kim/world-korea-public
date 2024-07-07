import UsersDetailClient from './UsersDetailClient';

export default async function UsersDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <UsersDetailClient userId={params.id} />;
}
