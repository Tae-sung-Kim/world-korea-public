import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { VBankResponse } from '@/definitions';
import { addComma } from '@/utils/number';
import {
  MdAccessTime,
  MdAccountBalance,
  MdContentCopy,
  MdPerson,
  MdPayment,
} from 'react-icons/md';
import { toast } from 'sonner';

interface VbankPaymentModalProps {
  vbank: VBankResponse;
}

export default function VbankPaymentModal({ vbank }: VbankPaymentModalProps) {
  const handleCopyAccount = async () => {
    try {
      await navigator.clipboard.writeText(vbank.vbankNum || '');
      toast.success('계좌번호가 복사되었습니다.');
    } catch (err) {
      toast.error('계좌번호 복사에 실패했습니다.');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>가상계좌 입금 안내</CardTitle>
        <CardDescription>
          아래 계좌로 입금기한 내에 입금해 주시기 바랍니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg bg-gray-50 p-6 space-y-4">
          {/* 은행 정보 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MdAccountBalance className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-600">은행명</span>
            </div>
            <span className="font-medium">{vbank.vbankName}</span>
          </div>

          {/* 계좌번호 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MdPayment className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-600">계좌번호</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium">{vbank.vbankNum}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={handleCopyAccount}
              >
                <MdContentCopy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* 입금금액 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MdPayment className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-600">입금금액</span>
            </div>
            <span className="font-semibold text-blue-600">
              {addComma(vbank.amount ?? 0)}원
            </span>
          </div>

          {/* 입금기한 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MdAccessTime className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-600">입금기한</span>
            </div>
            <span className="font-medium text-red-600">{vbank.vbankDate}</span>
          </div>

          {/* 구매자명 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MdPerson className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-600">구매자</span>
            </div>
            <span className="font-medium">{vbank.buyerName}</span>
          </div>
        </div>

        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <p className="text-sm text-yellow-800">
            * 위 계좌로 정확한 금액을 입금해 주셔야 주문이 완료됩니다.
            <br />* 입금기한 내 미입금 시 주문이 자동 취소됩니다.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
