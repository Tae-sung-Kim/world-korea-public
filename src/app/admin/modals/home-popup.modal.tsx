import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { NotificationDisplayData } from '@/definitions/notifications.type';
import Cookies from 'js-cookie';
import Image from 'next/image';

type PopupProps = {
  onCancel?: () => void;
  data: NotificationDisplayData<string>;
  // children: ReactElement | any;
};

export default function HomePopupModal({ onCancel, data }: PopupProps) {
  const noneShow24Hour = (id: string = '') => {
    // 24시간 후 만료되는 쿠키를 설정합니다. - 일단위로만 설정 가능
    Cookies.set(id, 'true', { expires: 1 }); // 1일 = 24시간
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
        <Button onClick={() => noneShow24Hour(data._id)}>
          24시간 보지않기
        </Button>
        <Button onClick={onCancel}>닫기</Button>
      </div>
    </div>
  );
}
