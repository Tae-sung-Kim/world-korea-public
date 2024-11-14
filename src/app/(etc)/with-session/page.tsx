import WithSessionClient from './with-session.client';
import { createShortIdStore } from '@/stores/short-id.store';

export default function WithSessionPage() {
  const { getState } = createShortIdStore();
  const shortId = getState().shortId;

  return <WithSessionClient shortId={shortId} />;
}
