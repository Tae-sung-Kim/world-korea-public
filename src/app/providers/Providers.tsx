import { initUserCategory } from '@/app/api/models/user-category.model';
import ReactQueryProviders from '@/app/providers/ReactQueryProvider';
import SessionProvider from '@/app/providers/SessionProvider';
import AuthProvider from '@/contexts/auth.context';
import RouteProvider from '@/contexts/route.context';

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
