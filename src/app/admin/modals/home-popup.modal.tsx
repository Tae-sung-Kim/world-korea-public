import { Button } from '@/components/ui/button';
import { NotificationDisplayData } from '@/definitions/notifications.type';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { IoCloseCircleOutline, IoEyeOffOutline } from 'react-icons/io5';

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
    <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg sm:shadow-2xl max-w-[95vw] min-w-[400px] sm:min-w-[500px] md:min-w-[600px] sm:max-w-xl md:max-w-2xl mx-auto overflow-hidden">
      <div className="relative bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-gray-800 dark:to-gray-800/95 border-b border-gray-200 dark:border-gray-700">
        <div className="px-4 py-3 sm:px-6 sm:py-4 md:px-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent pr-12">
            {data.title}
          </h2>
          <Button
            onClick={onCancel}
            variant="ghost"
            size="icon"
            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 hover:bg-gray-200/70 dark:hover:bg-gray-700/70 rounded-full group"
            aria-label="닫기"
          >
            <IoCloseCircleOutline className="w-7 h-7 sm:w-8 sm:h-8 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 group-hover:rotate-90 transition-all duration-200" />
          </Button>
        </div>
      </div>

      <div className="p-3 sm:p-6 md:p-8">
        {data.image && typeof data.image === 'string' && (
          <div className="aspect-[4/3] relative overflow-hidden rounded-md sm:rounded-lg shadow-md ring-1 ring-gray-200 dark:ring-gray-700">
            <Image
              src={data.image}
              alt={data.title || '팝업 이미지'}
              fill
              priority
              sizes="(max-width: 640px) 95vw, (max-width: 768px) 600px, 800px"
              className="object-contain hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
      </div>

      <div className="bg-gray-50 dark:bg-gray-800/80 p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4">
          <Button
            variant="outline"
            onClick={onCancel}
            className="px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base border-2 
            hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors sm:w-auto w-full"
          >
            닫기
          </Button>
          <Button
            onClick={() => noneShow24Hour(data._id)}
            className="px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base 
            bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg 
            transition-all duration-200 inline-flex items-center justify-center gap-2 sm:w-auto w-full"
          >
            <IoEyeOffOutline className="w-5 h-5" />
            24시간 보지않기
          </Button>
        </div>
      </div>
    </div>
  );
}
