'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import Image from 'next/image';

interface NotificationsImageProps {
  imageUrl: string | null;
  onClose: () => void;
}

export default function NotificationsImage({
  imageUrl,
  onClose,
}: NotificationsImageProps) {
  return (
    <Dialog open={!!imageUrl} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] w-fit h-fit max-h-[90vh]">
        <DialogTitle className="sr-only">이미지 상세보기</DialogTitle>
        <DialogDescription className="sr-only">
          팝업 이미지를 전체 화면으로 보여주는 창입니다. ESC 키를 누르거나 바깥
          영역을 클릭하면 창이 닫힙니다.
        </DialogDescription>
        {imageUrl && (
          <div className="relative w-[80vw] h-[80vh]">
            <Image
              src={imageUrl}
              alt="팝업 이미지 전체보기"
              className="object-contain"
              fill
              sizes="80vw"
              priority
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
