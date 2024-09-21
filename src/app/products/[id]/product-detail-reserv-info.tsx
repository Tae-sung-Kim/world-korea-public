'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from '@/components/ui/select';

export default function ProductDetailReserveInfo() {
  return (
    <div className="basis-1/4 mx-3">
      <div>
        <h1>예약자 정보</h1>
        <dl>
          <dt>예약자명</dt>
          <dd>aaa</dd>
          <dt>휴대폰 번호</dt>
          <dd>input 3개씩</dd>
          <dt>이메일(선택)</dt>
          <dd>이메일</dd>
          <dt>예약확인번호(예약 조회시 필요)</dt>
          <dd>예약확인번호4자리를 입력해주세요.</dd>
        </dl>
      </div>
      <div>
        <ul>
          <li>
            <Checkbox id="allCheck"></Checkbox>
            <Label
              htmlFor="allCheck"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              전체동의
            </Label>
          </li>
          <li>
            <Checkbox id="consentCollection"></Checkbox>
            <Label
              htmlFor="consentCollection"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              개인정보 수집 및 이용 동의
            </Label>
          </li>
          <li>
            <Checkbox id="consentProvision"></Checkbox>
            <Label
              htmlFor="consentProvision"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              개인정보 제3자 제공 동의
            </Label>
          </li>
          <li>
            <Checkbox id="consentAged14andAbove"></Checkbox>
            <Label
              htmlFor="consentAged14andAbove"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              만 14세 이상에 동의
            </Label>
          </li>
          <li>
            <Checkbox id="consentPromotional"></Checkbox>
            <Label
              htmlFor="consentPromotional"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              광고성 정보수신 동의
            </Label>
          </li>
          <li>
            <Checkbox id="consentCancellation"></Checkbox>
            <Label
              htmlFor="consentCancellation"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              취소/환불규정 동의
            </Label>
          </li>
          <li>
            <Label>결제시 유의사항</Label>
          </li>
          <li>결제 예정 금액</li>
          <li>
            <Select onValueChange={() => {}} value={''}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="결제 방법" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={'creditCard'}>신용카드</SelectItem>
                  <SelectItem value={'accountTransfer'}>계좌이체</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </li>
        </ul>
      </div>
    </div>
  );
}
