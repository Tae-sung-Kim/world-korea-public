'use client';

import { ProductDisplayData } from '@/definitions';
import { FcInfo } from 'react-icons/fc';

type InfoSectionProps = {
  title: string;
  children: React.ReactNode;
  textColor?: string;
};

const InfoSection = ({
  title,
  children,
  textColor = 'text-gray-600',
}: InfoSectionProps) => (
  <section className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
    <h3 className="text-base lg:text-lg font-semibold text-gray-800 mb-4 flex items-center">
      <span className="w-1.5 h-5 bg-blue-500 rounded-full mr-2.5" />
      {title}
    </h3>
    <ul className={`space-y-3.5 ${textColor}`}>{children}</ul>
  </section>
);

const CAUTION_MESSAGES = [
  '구매하신 티켓은 환불 및 취소가 불가합니다. 신중하게 구매해 주세요.',
  'You cannot refund or cancel the ticket you purchased.',
  'Please make a careful purchase',
] as const;

type SaleProductDetailInfoProps = {
  productList: ProductDisplayData[];
};

export default function SaleProductDetailInfo({
  productList,
}: SaleProductDetailInfoProps) {
  return (
    <article className="bg-white/60 rounded-3xl p-8 lg:p-10 shadow-lg border border-slate-200">
      <header className="flex items-center gap-3 mb-8">
        <FcInfo className="w-6 h-6 lg:w-7 lg:h-7" />
        <h2 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          이용 안내
        </h2>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        <InfoSection title="운영 시간">
          <li className="flex gap-3 items-start">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 mt-2" />
            <span className="flex-1">
              운영시간 및 입장가능시간은 변동될 수 있으니 꼭 당일 현장으로
              확인바랍니다.
            </span>
          </li>
          {productList?.map((product) => (
            <li key={product._id} className="flex gap-3 items-start">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 mt-2" />
              <span className="flex-1">{product.description1}</span>
            </li>
          ))}
        </InfoSection>

        <InfoSection title="주의사항" textColor="text-rose-600">
          {CAUTION_MESSAGES.map((message, index) => (
            <li key={index} className="flex gap-3 items-start">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-500 mt-2" />
              <span className="flex-1">{message}</span>
            </li>
          ))}
        </InfoSection>
      </div>
    </article>
  );
}
