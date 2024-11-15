import WithSessionClient from './with-session.client';
import { createShortIdStore } from '@/stores/short-id.store';

export default function WithSessionPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const { getState } = createShortIdStore();
  const shortId = getState().shortId ?? id;

  return <WithSessionClient shortId={shortId} />;
}
