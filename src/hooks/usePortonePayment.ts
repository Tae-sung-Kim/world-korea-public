import { PaymentStatus } from '@/definitions';
import {
  RefundRequest,
  RequestPayParams,
  RequestPayResponse,
} from '@/definitions/portone.type';
import ordersService from '@/services/orders.service';
import userService from '@/services/user.service';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

type PortoneProps = {
  onPaymentSuccess?: () => void;
  onTransPayment?: (data: {
    transName: string;
    transHolder: string;
    transNum: string;
    amount: number;
    buyerName: string;
  }) => void;
};

export default function usePortonePayment(props: PortoneProps = {}) {
  const { onPaymentSuccess, onTransPayment } = props;
  const router = useRouter();

  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(
    PaymentStatus.Ready
  );

  //결제 완료시 주문 id 세팅
  const orderIdRef = useRef<string>('');

  // 결제 함수
  const handlePaymentClick = async ({
    reqData,
    orderId,
    saleProductId,
  }: {
    reqData: RequestPayParams;
    orderId: string;
    saleProductId?: string;
  }) => {
    setPaymentStatus(PaymentStatus.Ready);

    const { name, phoneNumber, email, address } =
      await userService.getCurrentUser();

    orderIdRef.current = orderId;
    //계좌 입금할때
    if (reqData.pay_method === 'trans') {
      //계좌 입금 안내
      try {
        await ordersService.createPayment({
          orderId: orderIdRef.current,
        });

        onTransPayment &&
          onTransPayment({
            transName: '입력해야함', // 은행명
            transHolder: name, // 예금주
            transNum: '입력해야함', // 계좌 번호
            amount: reqData.amount, // 입금금액
            buyerName: name, // 구매자
          });

        toast.success('결제가 완료되었습니다.');
        setPaymentStatus(PaymentStatus.Success);
      } catch (error) {
        await ordersService.patchCancel({
          orderId: orderIdRef.current,
        });
        toast.error('결제 실패');
        setPaymentStatus(PaymentStatus.Error);
      }
    } else {
      if (!window.IMP) return;

      const { IMP } = window;
      IMP.init(String(process.env.NEXT_PUBLIC_PORTONE_CUSTOMER_ID));

      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      const data: RequestPayParams = {
        pg: 'html5_inicis',
        buyer_name: name,
        buyer_tel: phoneNumber,
        buyer_email: email,
        buyer_addr: address,
        ...reqData,
      };

      // 모바일인 경우 결제 완료 페이지로 리디렉션
      if (isMobile) {
        data.m_redirect_url = `${window.location.origin}/orders/complete?orderId=${orderId}&saleProductId=${saleProductId}`;
        IMP.request_pay(data);
      } else {
        IMP.request_pay(data, callback);
      }
    }
  };

  const callback = async (res: RequestPayResponse) => {
    const { success, imp_uid, error_msg } = res;

    if (success) {
      try {
        await ordersService.createPayment({
          orderId: orderIdRef.current,
          paymentId: imp_uid,
        });

        toast.success('결제가 완료되었습니다.');
        setPaymentStatus(PaymentStatus.Success);
        onPaymentSuccess && onPaymentSuccess();
      } catch (error) {
        await ordersService.patchCancel({
          orderId: orderIdRef.current,
        });
        toast.error('결제 실패');
        setPaymentStatus(PaymentStatus.Error);
      }
    } else {
      await ordersService.patchCancel({
        orderId: orderIdRef.current,
      });
      toast.error(`결제 실패: ${error_msg}`);
      setPaymentStatus(PaymentStatus.Error);
    }

    router.refresh();
    orderIdRef.current = '';
  };

  // 환불 함수
  const handleRefundClick = async (
    refundData: RefundRequest,
    callbacks?: {
      onSuccess?: () => void;
      onFail?: (error: any) => void;
    }
  ) => {
    try {
      setPaymentStatus(PaymentStatus.Processing);
      await ordersService.createRefund(refundData);
      setPaymentStatus(PaymentStatus.Refunded);
      toast.success('환불이 완료되었습니다.');
      router.refresh();
      callbacks?.onSuccess?.();
    } catch (error: any) {
      setPaymentStatus(PaymentStatus.Failed);
      toast.error(error.message || '환불 처리 중 오류가 발생했습니다.');
      callbacks?.onFail?.(error);
    }
  };

  return {
    onPayment: handlePaymentClick,
    onRefund: handleRefundClick,
    paymentStatus,
  };
}
