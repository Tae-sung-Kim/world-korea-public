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

export default function usePortonePayment() {
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
    const userData = await userService.getCurrentUser();

    orderIdRef.current = orderId;

    const { IMP } = window;
    // imp로 시작
    IMP.init(String(process.env.NEXT_PUBLIC_TEST_PORTONE_CUSTOMER_ID)); // 가맹점 식별코드

    /* 2. 결제 데이터 정의하기 */
    const data: RequestPayParams = {
      pg: 'html5_inicis', // PG사 : https://developers.portone.io/docs/ko/tip/pg-2 참고
      // pay_method: 'card', // 결제수단
      // merchant_uid: `mid_${new Date().getTime()}`, // 주문번호
      // amount: 1000, // 결제금액
      // name: '아임포트 결제 데이터 분석', // 주문명
      buyer_name: userData.name, // 구매자 이름
      buyer_tel: userData.phoneNumber, // 구매자 전화번호
      buyer_email: userData.email, // 구매자 이메일
      buyer_addr: userData.address, // 구매자 주소
      // buyer_postcode:userData. '06018', // 구매자 우편번호
      ...reqData,
    };

    /* 4. 결제 창 호출하기 */
    IMP.request_pay(data, callback);
  };

  /* 3. 콜백 함수 정의하기 */
  const callback = async (response: RequestPayResponse) => {
    const { success, imp_uid, error_msg } = response;

    if (success) {
      await ordersService.createPayment({
        orderId: orderIdRef.current,
        paymentId: imp_uid,
      });
      toast.success('결제 성공');
      alert('결제 성공!!');
      setPaymentStatus(PaymentStatus.Success);
      router.refresh();
    } else {
      toast.error(`결제 실패: ${error_msg}`);
      alert('결제 실패!!');
      setPaymentStatus(PaymentStatus.Error);
    }

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

      // 서버에 환불 요청
      const response = await ordersService.createRefund(refundData);
      setPaymentStatus(PaymentStatus.Refunded);
      // 기본 성공 처리
      toast.success('환불이 완료되었습니다.');
      router.refresh();

      // 성공 콜백이 있다면 실행
      if (callbacks?.onSuccess) {
        callbacks.onSuccess();
      }
    } catch (error: any) {
      // 기본 에러 처리
      setPaymentStatus(PaymentStatus.Failed);
      toast.error(error.message || '환불 처리 중 오류가 발생했습니다.');

      // 실패 콜백이 있다면 실행
      if (callbacks?.onFail) {
        callbacks.onFail(error);
      }
    }
  };

  return {
    onPayment: handlePaymentClick,
    onRefund: handleRefundClick,
    paymentStatus,
  };
}
