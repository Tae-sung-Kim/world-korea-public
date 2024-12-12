import { PaymentStatus, VBankResponse } from '@/definitions';
import {
  RefundRequest,
  RequestPayParams,
  RequestPayResponse,
} from '@/definitions/portone.type';
import ordersService from '@/services/orders.service';
import userService from '@/services/user.service';
import { addDays, format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

type PortoneProps = {
  onVankSuccess?: (res: VBankResponse) => void;
};

export default function usePortonePayment(props: PortoneProps = {}) {
  const { onVankSuccess = () => {} } = props;

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
    // imp로 시작
    IMP.init(String(process.env.NEXT_PUBLIC_TEST_PORTONE_CUSTOMER_ID)); // 가맹점 식별코드

    const now = new Date();
    const dueDate = new Date(now.getTime() + 3 * 60 * 1000); // 1분으로 변경
    // const vbank_due =  format(addDays(new Date(), 1), 'yyyyMMddHHmm'); // 1일
    const vbank_due =
      reqData.pay_method === 'vbank'
        ? format(dueDate, 'yyyyMMddHHmm')
        : undefined; // 3시간

    /* 2. 결제 데이터 정의하기 */
    const data: RequestPayParams = {
      pg: 'html5_inicis', // PG 설정
      buyer_name: name, // 구매자 이름
      buyer_tel: phoneNumber, // 구매자 전화번호
      buyer_email: email, // 구매자 이메일
      buyer_addr: address, // 구매자 주소
      vbank_due, // 가상계좌 입금기한 (3일)
      ...reqData,
    };

    /* 4. 결제 창 호출하기 */
    IMP.request_pay(data, callback);
  };

  /* 3. 콜백 함수 정의하기 */
  const callback = async (res: RequestPayResponse) => {
    const { success, imp_uid, error_msg, pay_method, merchant_uid } = res;

    console.log(res);

    if (success) {
      try {
        if (pay_method === 'vbank') {
          // 가상계좌 발급 성공 처리
          onVankSuccess &&
            onVankSuccess({
              amount: res.paid_amount ?? 0,
              vbankName: res.vbank_name,
              vbankCode: res.vbank_num,
              vbankHolder: res.vbank_holder ?? '',
              vbankNum: res.vbank_num,
              vbankDate: res.vbank_date,
              buyerName: res.buyer_name,
            });
          // toast.success(
          //   '가상계좌가 발급되었습니다. 입금 기한 내에 입금해주세요.'
          // );
        } else {
          // 일반 결제 성공 처리
          await ordersService.createPayment({
            orderId: orderIdRef.current,
            paymentId: imp_uid,
            merchantId: merchant_uid,
          });
          toast.success('결제가 완료되었습니다.');
          setPaymentStatus(PaymentStatus.Success);
        }
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
