import { Button } from '@/components/ui/button';
import { NotificationDisplayData } from '@/definitions/notifications.type';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { IoEyeOffOutline } from 'react-icons/io5';
import Cookies from 'js-cookie';
import Image from 'next/image';

type PopupProps = {
  onCancel?: () => void;
  data: NotificationDisplayData<string>;
};

export default function HomePopupModal({ onCancel, data }: PopupProps) {
  const noneShow24Hour = (id: string = '') => {
    Cookies.set(id, 'true', { expires: 1 });
    onCancel && onCancel();
  };

  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0">
        <Card className="border-0 shadow-none">
          <CardHeader className="p-6 pb-4 space-y-1 border-b bg-gray-50">
            <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <div className="w-1 h-6 bg-primary rounded-full" />
              {data.title}
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6">
            {data.image && typeof data.image === 'string' && (
              <div className="overflow-hidden rounded-lg">
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={data.image}
                    alt={data.title || '팝업 이미지'}
                    fill
                    priority
                    sizes="(max-width: 640px) 90vw, (max-width: 768px) 520px, 600px"
                    className="object-contain"
                  />
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col-reverse sm:flex-row justify-end gap-3 p-6 bg-gray-50 border-t">
            <Button
              variant="outline"
              onClick={onCancel}
              className="w-full sm:w-auto"
            >
              닫기
            </Button>
            <Button
              variant="secondary"
              onClick={() => noneShow24Hour(data._id)}
              className="w-full sm:w-auto gap-2"
            >
              <IoEyeOffOutline className="h-4 w-4" />
              24시간 보지않기
            </Button>
          </CardFooter>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
