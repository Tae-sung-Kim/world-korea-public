import { Button } from '@/components/ui/button';
import { NotificationDisplayData } from '@/definitions/notifications.type';
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
    <div className="flex flex-col">
      <div className="relative">
        <div className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            {data.title}
          </h2>

          {data.image && typeof data.image === 'string' && (
            <div className="relative w-full">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={data.image}
                  alt={data.title || '팝업 이미지'}
                  fill
                  priority
                  sizes="(max-width: 768px) calc(100vw - 2rem), (max-width: 1200px) 520px, 600px"
                  className="object-contain rounded-lg"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <div className="p-4 sm:p-6 flex flex-col-reverse sm:flex-row justify-end gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
            className="w-full sm:w-auto"
          >
            닫기
          </Button>
          <Button
            onClick={() => noneShow24Hour(data._id)}
            className="w-full sm:w-auto"
          >
            24시간 보지않기
          </Button>
        </div>
      </div>
    </div>
  );
}
