'use client';

import { useDetailProductQuery } from '@/app/admin/queries';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
import Image from 'next/image';
import { useState } from 'react';

export default function ProductDetailClient({ id }: { id: string }) {
  const productDetailData = useDetailProductQuery(id);

  const [date, setDate] = useState<Date | undefined>(new Date());

  if (Object.keys(productDetailData).length < 1) {
    return false;
  }

  return (
    <div className="flex flex-row space-5">
      <div className="basis-1/4 mx-2">
        <div className="p-4">
          <Image
            className="w-full h-full rounded-full"
            alt="상품 이미지"
            width={170}
            height={170}
            src={String(productDetailData?.images?.[0]) ?? ''}
          />
        </div>
        <h1 className="text-xl text-center font-bold">
          {productDetailData.name}
        </h1>

        <div className="m-4">
          <Button variant="secondary">상세정보</Button>
        </div>

        <div className="space-y-4">
          <ul className="text-sm text-wrap">
            <li className="p-3">
              주소: 서울특별시 송파구 올림픽로 240, 롯데월드 웰빙센터 SP라운지
              219호
            </li>
            <li className="p-3">전화번호: 02-415-8587 | 010-4074-8587</li>
            <li className="p-3">이메일: worldk70@daum.net</li>
          </ul>
        </div>
      </div>
      <div className="basis-1/2 mx-3">
        <h1 className="">예약 날짜 선택</h1>
        <div className="w-full">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
            classNames={{
              months:
                'flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1',
              month: 'space-y-4 w-full flex flex-col',
              table: 'w-full h-full border-collapse space-y-1',
              head_row: '',
              row: 'w-full mt-2',
            }}
          />
        </div>
        <div>
          <h1>예약시간</h1>
          {date && (
            <Select onValueChange={() => {}} value={''}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={'a'}>a</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        </div>
        <div>
          <h1>상품 선택</h1>
          <ul>
            <li>상품리스트</li>
          </ul>
        </div>
      </div>
      <div className="basis-1/2 mx-3">
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
    </div>
  );
}
