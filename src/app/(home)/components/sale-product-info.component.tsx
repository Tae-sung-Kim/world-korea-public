import { addComma } from '@/utils/number';

type Props = {
  name: string;
  price: string;
};

export default function ProductInfo({ name, price }: Props) {
  return (
    <div className="relative p-4 sm:p-5 space-y-3 bg-white/30 backdrop-blur-sm rounded-b-xl transition-all duration-300 group-hover:bg-white/40">
      {/* Top border gradient */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-white/40 via-white/50 to-white/40" />
      
      <h2 className="font-medium text-sm sm:text-base lg:text-lg text-gray-800 line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
        {name}
      </h2>
      
      <div className="pt-1">
        <div className="space-y-1.5">
          <p className="text-xs sm:text-sm text-gray-600 font-medium">
            판매가
          </p>
          <p className="text-base sm:text-lg lg:text-xl font-bold text-slate-700">
            ₩{addComma(price)}
          </p>
        </div>
      </div>

      {/* Bottom shadow */}
      <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-black/15 to-transparent rounded-b-xl" />
    </div>
  );
}
