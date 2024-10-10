import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ReactElement } from 'react';

type PopupProps = {
  onCancel?: () => void;
  children: ReactElement | any;
};

export default function HomePopupModal({ onCancel, children }: PopupProps) {
  const noneShow24Hour = () => {
    console.log('개발 예정');
    onCancel && onCancel();
  };

  console.log('여기까지 타는데????', children);

  return (
    <div className="container space-y-8">
      <ScrollArea className="max-h-[400px] max-w-[600px]">
        {children}
      </ScrollArea>
      <div className="flex justify-center gap-4">
        <Button onClick={noneShow24Hour}>24시간 보지않기</Button>
        <Button onClick={onCancel}>닫기</Button>
      </div>
    </div>
  );
}
