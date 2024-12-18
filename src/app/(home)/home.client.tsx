'use client';

import { usePagination } from '../admin/hooks/usePagination';
import SaleProductList from './components/sale-product-list.component';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/contexts/auth.context';
import useNotifications from '@/hooks/useNotifications';
import { useSaleProductListQuery } from '@/queries';
import Link from 'next/link';
import { FaTicketAlt, FaShieldAlt } from 'react-icons/fa';
import { RiMoneyDollarCircleFill } from 'react-icons/ri';

export default function HomeClient() {
  useNotifications();
  const { isLoggedIn } = useAuthContext();

  const { pageNumber, pageSize, filter } = usePagination({
    queryFilters: { name: '' },
  });

  const saleProductData = useSaleProductListQuery({
    pageNumber: Number(pageNumber),
    pageSize: Number(pageSize),
    filter,
  });

  if (!Array.isArray(saleProductData?.list)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  // 로그인하지 않은 경우
  if (!isLoggedIn) {
    return (
      <div className="w-full space-y-16">
        {/* 히어로 섹션 */}
        <div className="relative h-[500px] -mt-12 mb-16">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-300/80 via-purple-300/80 to-indigo-300/80">
            <div className="absolute inset-0 bg-[url('/theme-park-bg.jpg')] bg-cover bg-center mix-blend-overlay opacity-40" />
          </div>
          <div className="relative h-full flex items-center justify-center text-center px-4">
            <div className="max-w-3xl space-y-4 animate-fade-up">
              <h1 className="text-4xl sm:text-5xl font-bold text-white drop-shadow-md">
                특별한 하루를 선물하세요
              </h1>
              <p className="text-xl text-white/90 drop-shadow">
                월드코리아와 함께 즐거운 추억을 만들어보세요
              </p>
              <div className="pt-4">
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="rounded-full font-semibold text-lg hover:scale-105 transition-transform bg-white/90 hover:bg-white text-purple-500/90 hover:text-purple-500"
                >
                  <Link href="/login">지금 예매하기</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 서비스 특징 섹션 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          <div
            className="text-center space-y-3 animate-fade-up group"
            style={{ animationDelay: '100ms' }}
          >
            <div className="w-16 h-16 mx-auto bg-purple-100/70 rounded-full flex items-center justify-center group-hover:bg-purple-200/80 transition-all duration-300 shadow-sm group-hover:shadow">
              <FaTicketAlt className="w-8 h-8 text-purple-400 group-hover:text-purple-500 transition-colors duration-300" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">빠른 예매</h3>
            <p className="text-gray-900">
              클릭 한 번으로 간편하게 예매하고 즐거운 시간을 보내세요
            </p>
          </div>
          <div
            className="text-center space-y-3 animate-fade-up group"
            style={{ animationDelay: '200ms' }}
          >
            <div className="w-16 h-16 mx-auto bg-purple-100/70 rounded-full flex items-center justify-center group-hover:bg-purple-200/80 transition-all duration-300 shadow-sm group-hover:shadow">
              <RiMoneyDollarCircleFill className="w-8 h-8 text-purple-400 group-hover:text-purple-500 transition-colors duration-300" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">특별 할인</h3>
            <p className="text-gray-900">
              월드코리아만의 특별한 가격으로 더 많은 즐거움을 누리세요
            </p>
          </div>
          <div
            className="text-center space-y-3 animate-fade-up group"
            style={{ animationDelay: '300ms' }}
          >
            <div className="w-16 h-16 mx-auto bg-purple-100/70 rounded-full flex items-center justify-center group-hover:bg-purple-200/80 transition-all duration-300 shadow-sm group-hover:shadow">
              <FaShieldAlt className="w-8 h-8 text-purple-400 group-hover:text-purple-500 transition-colors duration-300" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">안전한 거래</h3>
            <p className="text-gray-900">
              공식 인증된 티켓으로 안전하고 믿을 수 있는 거래를 보장합니다
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 로그인한 경우
  return (
    <div className="w-full">
      <SaleProductList products={saleProductData.list} />
    </div>
  );
}
