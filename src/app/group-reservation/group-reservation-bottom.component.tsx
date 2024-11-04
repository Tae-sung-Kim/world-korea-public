'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Image from 'next/image';

export default function GroupReservationBottom() {
  return (
    <>
      <div className="border rounded">
        <div className="m-5">
          <h1 className="text-xl">★주의사항 ( 반드시 숙지 부탁드립니다. )</h1>
          <ul className="list-none m-2">
            <li className="before:content-['-'] before:mr-2">
              행사 전일 인솔 담당자님께 확인 연락을 드리고 있습니다. 당일 일정
              안내를 위해 반드시 월드코리아 담당자의 연락을 받아주시길 바랍니다.
            </li>
            <li className="before:content-['-'] before:mr-2">
              모든 패키지는 도착 후 매표 대기없이 입장하실 수 있도록 미리
              발권하여 준비하고 있습니다. 변경사항은 방문 1일전까지 꼭 공유
              부탁드립니다.
            </li>
            <li className="before:content-['-'] before:mr-2">
              요금표에 작성되어 있지 않은 패키지는 별도로 견적 문의
              부탁드립니다.
            </li>
          </ul>
        </div>
      </div>

      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableHead>담당자</TableHead>
            <TableHead>담당</TableHead>
            <TableHead>연락처</TableHead>
            <TableHead>카카오톡</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>홍미리 팀장</TableCell>
            <TableCell>통합 문의/예약 및 FIT, 제휴</TableCell>
            <TableCell>010-4074-8587</TableCell>
            <TableCell>worldkorea_official</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>장재은 주임</TableCell>
            <TableCell>롯데월드 어드벤처</TableCell>
            <TableCell>010-9234-8587</TableCell>
            <TableCell>010-2742-8587</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>한상탁 매니저</TableCell>
            <TableCell>서울스카이 / 아쿠아리움</TableCell>
            <TableCell> worldkorea_info</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <div className="flex justify-center">
        <Image
          src="/images/bottom_image.png"
          width={400}
          height={100}
          alt="group-reservation-bottom"
        />
      </div>
    </>
  );
}
