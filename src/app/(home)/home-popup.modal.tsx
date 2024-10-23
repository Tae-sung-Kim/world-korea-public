import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { NotificationForm } from '@/definitions/notifications.type';
import Image from 'next/image';

type PopupProps = {
  onCancel?: () => void;
  data: NotificationForm;
  // children: ReactElement | any;
};

export default function HomePopupModal({ onCancel, data }: PopupProps) {
  const noneShow24Hour = () => {
    console.log('개발 예정');
    onCancel && onCancel();
  };

  return (
    <div className="container space-y-8">
      <ScrollArea className="max-h-[400px] max-w-[600px]">
        <h1>{data.title}</h1>
        {data.image && typeof data.image === 'string' && (
          <Image src={data.image} width={250} height={250} alt="팝업 이미지" />
        )}
      </ScrollArea>
      <div className="flex justify-center gap-4">
        <Button onClick={noneShow24Hour}>24시간 보지않기</Button>
        <Button onClick={onCancel}>닫기</Button>
      </div>
    </div>
  );
}
