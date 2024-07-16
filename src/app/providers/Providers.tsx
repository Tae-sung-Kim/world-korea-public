import { initUserCategory } from '@/app/api/models/userCategory';
import ReactQueryProviders from '@/app/providers/ReactQueryProvider';
import SessionProvider from '@/app/providers/SessionProvider';
import AuthProvider from '@/contexts/AuthContext';
import RouteProvider from '@/contexts/RouteContext';

initUserCategory();

export function OuterProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}

export function InnerProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProviders>
      <AuthProvider>
        <RouteProvider>{children}</RouteProvider>
      </AuthProvider>
    </ReactQueryProviders>
  );
}
