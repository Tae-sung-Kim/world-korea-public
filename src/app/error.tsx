'use client';

export default function ErrorBoundary({ error }: { error: Error }) {
  return <h2>{error.message}</h2>;
}
