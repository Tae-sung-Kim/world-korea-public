'use client';

import ordersService from '@/services/orders.service';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function OrderCompletePage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const handlePaymentComplete = async () => {
      const orderId = searchParams.get('orderId');
      const impSuccess = searchParams.get('imp_success');
      const impUid = searchParams.get('imp_uid');
      const saleProductId = searchParams.get('saleProductId');

      if (!orderId || !impSuccess || !impUid) {
        toast.error('결제 정보가 올바르지 않습니다.');
        return;
      }

      try {
        // 주문 상태 확인
        const { isPaid } = await ordersService.getOrderStatus(orderId);
        if (isPaid) {
          toast.error('이미 결제가 완료된 주문입니다.');
          window.location.replace(`/sale-products/${saleProductId}`);
          return;
        }

        if (impSuccess === 'true') {
          try {
            await ordersService.createPayment({
              orderId,
              paymentId: impUid,
            });
            toast.success('결제가 완료되었습니다.');
            // 결제 완료 후 메인 페이지로 이동하며, 히스토리에 현재 페이지를 저장하지 않음
            window.location.replace(`/sale-products/${saleProductId}`);
          } catch (error) {
            toast.error('결제 처리 중 오류가 발생했습니다.');
            await ordersService.patchCancel({ orderId });
          }
        } else {
          toast.error('결제가 취소되었습니다.');
          await ordersService.patchCancel({ orderId });
        }
      } catch (error) {
        console.error(error);
      }
    };

    handlePaymentComplete();
  }, [searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">결제 처리 중...</h1>
        <p className="text-gray-600">잠시만 기다려주세요.</p>
      </div>
    </div>
  );
}
