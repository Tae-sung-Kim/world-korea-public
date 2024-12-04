'use client';

import PinUsed from '@/app/components/pins/pin-used.component';

export default function PinUsedClient() {
  return (
    <div className="h-[calc(100vh-80px)] flex flex-col max-w-[1920px] mx-auto px-4">
      <PinUsed />
    </div>
  );
}
