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
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-[95vw] min-w-[400px] sm:min-w-[500px] md:min-w-[600px] sm:max-w-xl md:max-w-2xl mx-auto overflow-hidden border border-gray-200 dark:border-gray-700">
      <header className="relative px-6 py-4 md:px-8 md:py-5 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800/95 dark:to-gray-800">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white pr-12">
          {data.title}
        </h2>
        <Button
          onClick={onCancel}
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full group"
          aria-label="닫기"
        >
          <IoCloseCircleOutline className="w-7 h-7 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-all duration-200" />
        </Button>
      </header>

      {data.image && typeof data.image === 'string' && (
        <div className="px-6 py-4 md:p-8">
          <div className="aspect-[4/3] relative overflow-hidden rounded-xl bg-gray-50 dark:bg-gray-900">
            <Image
              src={data.image}
              alt={data.title || '팝업 이미지'}
              fill
              priority
              sizes="(max-width: 640px) 95vw, (max-width: 768px) 600px, 800px"
              className="object-contain hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      )}

      <footer className="p-4 md:p-6 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
            className="px-5 h-10 text-sm font-medium border-gray-300 dark:border-gray-600 
            hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
          >
            닫기
          </Button>
          <Button
            onClick={() => noneShow24Hour(data._id)}
            className="px-5 h-10 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white 
            transition-all duration-200 inline-flex items-center gap-2"
          >
            <IoEyeOffOutline className="w-4 h-4" />
            24시간 보지않기
          </Button>
        </div>
      </footer>
    </div>
  );
}
