import WithSessionClient from './with-session.client';

export default function WithSessionPage({
  searchParams: { id },
}: {
  searchParams: { id?: string };
}) {
  return <WithSessionClient shortId={id} />;
}
