'use client';

import Loading from '@/components/common/loading.component';
import { useIsFetching, useIsMutating } from '@tanstack/react-query';
import { createContext, useContext, useEffect, useState } from 'react';

type LoadingContextType = {
  isLoading: boolean;
  onIsLoading: (isLoading: boolean) => void;
};

const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  onIsLoading: () => {},
});

//rotuer 관련 작업 context
function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);

  const isFetching = !!useIsFetching();
  const isMutating = !!useIsMutating();

  useEffect(() => {
    setIsLoading(isFetching || isMutating);
  }, [isFetching, isMutating]);

  return (
    <LoadingContext.Provider value={{ isLoading, onIsLoading: setIsLoading }}>
      {isLoading && <Loading />}
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoadingContext() {
  return useContext<LoadingContextType>(LoadingContext);
}

export default LoadingProvider;
