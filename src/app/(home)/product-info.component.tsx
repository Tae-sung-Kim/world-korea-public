import { addComma } from '@/utils/number';

type Props = {
  name: string;
  price: string;
};

export default function ProductInfo({ name, price }: Props) {
  return (
    <div className="space-y-3 sm:space-y-4 p-4 sm:p-5 lg:p-6">
      <h2 className="font-medium text-sm sm:text-base lg:text-lg xl:text-xl text-gray-700 dark:text-gray-200 line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
        {name}
      </h2>
      <div className="flex items-end justify-between">
        <div className="space-y-1 sm:space-y-1.5">
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">판매가</p>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-blue-600 dark:text-blue-400">
            ₩{addComma(price)}
          </p>
        </div>
      </div>
    </div>
  );
}
