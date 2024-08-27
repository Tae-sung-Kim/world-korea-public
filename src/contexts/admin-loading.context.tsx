'use client';

import AdminLoading from '@/app/admin/admin-loading.component';
import { useIsFetching, useIsMutating } from '@tanstack/react-query';
import { createContext, useContext } from 'react';

type LoadingState = {
  isLoading: boolean;
};

const AdminLoadingContext = createContext<LoadingState>({
  isLoading: false,
});

//rotuer 관련 작업 context
function AdminLoadingProvider({ children }: { children: React.ReactNode }) {
  const isFetching: boolean = !!useIsFetching();
  const isMutating: boolean = !!useIsMutating();

  const isLoading: boolean = isFetching || isMutating;

  return (
    <AdminLoadingContext.Provider
      value={{
        isLoading,
      }}
    >
      {isLoading && <AdminLoading />}
      {children}
    </AdminLoadingContext.Provider>
  );
}

export function useAdminLoadingContext() {
  return useContext<LoadingState>(AdminLoadingContext);
}

export default AdminLoadingProvider;
