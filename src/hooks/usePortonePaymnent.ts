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
};

export default function usePortonePayment(props: PortoneProps = {}) {
  const { onPaymentSuccess } = props;
  const router = useRouter();

  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(
    PaymentStatus.Ready
  );

  //결제 완료시 주문 id 세팅
  const orderIdRef = useRef<string>('');

  // 결제 함수
  const handlePaymentClick = async (
    reqData: RequestPayParams,
    orderId: string
  ) => {
    if (!window.IMP) return;
    setPaymentStatus(PaymentStatus.Ready);

    const { name, phoneNumber, email, address } =
      await userService.getCurrentUser();

    orderIdRef.current = orderId;

    const { IMP } = window;
    IMP.init(String(process.env.NEXT_PUBLIC_PORTONE_CUSTOMER_ID));

    const data: RequestPayParams = {
      pg: 'html5_inicis',
      buyer_name: name,
      buyer_tel: phoneNumber,
      buyer_email: email,
      buyer_addr: address,
      ...reqData,
    };

    IMP.request_pay(data, callback);
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
