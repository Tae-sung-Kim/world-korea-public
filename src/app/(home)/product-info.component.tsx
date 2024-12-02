import { addComma } from '@/utils/number';

type Props = {
  name: string;
  price: string;
};

export default function ProductInfo({ name, price }: Props) {
  return (
    <div className="relative p-4 sm:p-5 space-y-3 bg-gray-50 dark:bg-gray-800/95 rounded-b-xl transition-all duration-300 group-hover:bg-white dark:group-hover:bg-gray-800">
      {/* Top border gradient */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700" />
      
      <h2 className="font-medium text-sm sm:text-base lg:text-lg text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
        {name}
      </h2>
      
      <div className="pt-1">
        <div className="space-y-1.5">
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
            판매가
          </p>
          <p className="text-base sm:text-lg lg:text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent">
            ₩{addComma(price)}
          </p>
        </div>
      </div>

      {/* Bottom shadow */}
      <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-gray-100/50 to-transparent dark:from-gray-900/30 dark:to-transparent rounded-b-xl" />
    </div>
  );
}
