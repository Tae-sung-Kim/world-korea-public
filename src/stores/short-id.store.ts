import { createStore, StoreApi } from 'zustand/vanilla';

type ShortId = string | null;

type StoreShortId = {
  shortId: ShortId;
  setShortId: (shortId: ShortId) => void;
  resetShortId: () => void;
};

let shortIdStoreInstance: StoreApi<StoreShortId> | null = null;

export const createShortIdStore = (): StoreApi<StoreShortId> => {
  // 이미 인스턴스가 있다면 반환, 없으면 새로 생성하여 반환
  if (!shortIdStoreInstance) {
    shortIdStoreInstance = createStore<StoreShortId>((set) => ({
      shortId: null,
      setShortId: (shortId) => set({ shortId }),
      resetShortId: () => set({ shortId: null }),
    }));
  }
  return shortIdStoreInstance;
};
