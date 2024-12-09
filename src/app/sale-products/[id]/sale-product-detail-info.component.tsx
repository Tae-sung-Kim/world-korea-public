import { ProductDisplayData } from '@/definitions';
import { FcInfo } from 'react-icons/fc';

export default function SaleProductDetailInfo({
  productList,
}: {
  productList: ProductDisplayData[];
}) {
  return (
    <div className="backdrop-blur-md bg-white/70 rounded-xl p-6 lg:p-8 shadow-lg transition-all duration-300">
      <div className="flex items-center gap-2 text-lg lg:text-xl font-semibold mb-6">
        <FcInfo className="w-6 h-6 lg:w-7 lg:h-7" />
        <span>이용 안내</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        <div className="space-y-4">
          <h3 className="text-base lg:text-lg font-medium">운영 시간</h3>
          <ul className="list-disc pl-5 space-y-2 text-sm lg:text-base text-muted-foreground">
            <li>
              운영시간 및 입장가능시간은 변동될 수 있으니 꼭 당일 현장으로
              확인바랍니다.
            </li>
            {Array.isArray(productList) &&
              productList.map((d) => <li key={d._id}>{d.description1}</li>)}
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-base lg:text-lg font-medium">주의사항</h3>
          <ul className="list-disc pl-5 space-y-2 text-sm lg:text-base text-rose-600/90">
            <li>
              구매하신 티켓은 환불 및 취소가 불가합니다. 신중하게 구매해
              주세요.
            </li>
            <li>You cannot refund or cancel the ticket you purchased.</li>
            <li>Please make a careful purchase</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
