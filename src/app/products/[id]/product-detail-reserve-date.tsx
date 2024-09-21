'use client';

import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from '@/components/ui/select';
import { useState } from 'react';

export default function ProductDetailReserveDate() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="basis-1/3 mx-3">
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
  );
}
