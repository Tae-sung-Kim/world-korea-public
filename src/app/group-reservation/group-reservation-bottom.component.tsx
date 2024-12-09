'use client';

import GroupReservationIcon from './group-resevation-icon.component';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { GROUP_RESERVATION_ICONS } from '@/definitions/group-reservation.constant';
import Image from 'next/image';

export default function GroupReservationBottom() {
  return (
    <>
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
        <div className="relative">
          <div className="text-base md:text-lg mb-8 text-center font-medium">
            <span className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-2 rounded-full inline-block">
              오시는 길 안내
            </span>
            <p className="mt-2 text-gray-600 text-sm">
              안내를 원하시는 업장 아이콘을 클릭하시면 안내페이지로 이동합니다.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {GROUP_RESERVATION_ICONS.map((d) => (
              <GroupReservationIcon
                key={d.url}
                url={d.url}
                src={d.src}
                alt={d.alt}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-8 mt-8 border border-gray-100">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="bg-gradient-to-r from-red-500 to-red-700 text-white px-6 py-2 rounded-full inline-block text-lg md:text-xl font-medium">
              ★ 주의사항
            </h1>
            <p className="mt-3 text-gray-600">
              원활한 진행을 위해 아래 사항을 반드시 숙지해 주시기 바랍니다.
            </p>
          </div>
          <ul className="list-none space-y-4">
            <li className="flex items-start space-x-3 bg-gray-50 p-5 rounded-xl transition-all hover:bg-gray-100 hover:shadow-md">
              <span className="text-red-500 font-bold mt-1">•</span>
              <p className="text-gray-700 leading-relaxed">
                행사 전일 인솔 담당자님께 확인 연락을 드리고 있습니다. 당일 일정
                안내를 위해 반드시 월드코리아 담당자의 연락을 받아주시길
                바랍니다.
              </p>
            </li>
            <li className="flex items-start space-x-3 bg-gray-50 p-5 rounded-xl transition-all hover:bg-gray-100 hover:shadow-md">
              <span className="text-red-500 font-bold mt-1">•</span>
              <p className="text-gray-700 leading-relaxed">
                모든 패키지는 도착 후 매표 대기없이 입장하실 수 있도록 미리
                발권하여 준비하고 있습니다. 변경사항은 방문 1일전까지 꼭 공유
                부탁드립니다.
              </p>
            </li>
            <li className="flex items-start space-x-3 bg-gray-50 p-5 rounded-xl transition-all hover:bg-gray-100 hover:shadow-md">
              <span className="text-red-500 font-bold mt-1">•</span>
              <p className="text-gray-700 leading-relaxed">
                요금표에 작성되어 있지 않은 패키지는 별도로 견적 문의
                부탁드립니다.
              </p>
            </li>
          </ul>
        </div>

        <div className="overflow-x-auto mt-12">
          <div className="text-center mb-6">
            <h2 className="text-lg font-medium text-gray-800">담당자 연락처</h2>
            <p className="text-sm text-gray-600 mt-1">
              문의사항이 있으시다면 언제든 연락주세요.
            </p>
          </div>
          <Table className="min-w-[600px] bg-white rounded-xl overflow-hidden border-collapse">
            <TableHeader>
              <TableRow className="border-b">
                <TableHead className="bg-blue-50 py-4 text-blue-900 font-medium text-base w-[15%]">
                  담당자
                </TableHead>
                <TableHead className="bg-blue-50 py-4 text-blue-900 font-medium text-base w-[40%]">
                  담당
                </TableHead>
                <TableHead className="bg-blue-50 py-4 text-blue-900 font-medium text-base w-[25%]">
                  연락처
                </TableHead>
                <TableHead className="bg-blue-50 py-4 text-blue-900 font-medium text-base w-[20%]">
                  카카오톡
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="hover:bg-gray-50 transition-colors">
                <TableCell className="py-4 text-gray-700 font-medium">
                  홍미리 팀장
                </TableCell>
                <TableCell className="py-4 text-gray-700">
                  통합 문의/예약 및 FIT, 제휴
                </TableCell>
                <TableCell className="py-4 text-gray-700">
                  <a
                    href="tel:010-4074-8587"
                    className="text-blue-600 hover:underline"
                  >
                    010-4074-8587
                  </a>
                </TableCell>
                <TableCell className="py-4 text-gray-700">
                  <span className="bg-yellow-50 text-yellow-800 px-3 py-1 rounded-full text-sm">
                    worldkorea_official
                  </span>
                </TableCell>
              </TableRow>
              <TableRow className="hover:bg-gray-50 transition-colors">
                <TableCell className="py-4 text-gray-700 font-medium">
                  장재은 주임
                </TableCell>
                <TableCell className="py-4 text-gray-700">
                  롯데월드 어드벤처
                </TableCell>
                <TableCell className="py-4 text-gray-700">
                  <a
                    href="tel:010-9234-8587"
                    className="text-blue-600 hover:underline"
                  >
                    010-9234-8587
                  </a>
                </TableCell>
                <TableCell className="py-4 text-gray-700">
                  <span className="bg-yellow-50 text-yellow-800 px-3 py-1 rounded-full text-sm">
                    worldkorea_info
                  </span>
                </TableCell>
              </TableRow>
              <TableRow className="hover:bg-gray-50 transition-colors">
                <TableCell className="py-4 text-gray-700 font-medium">
                  한상탁 매니저
                </TableCell>
                <TableCell className="py-4 text-gray-700">
                  서울스카이 / 아쿠아리움
                </TableCell>
                <TableCell className="py-4 text-gray-700">
                  <a
                    href="tel:010-2742-8587"
                    className="text-blue-600 hover:underline"
                  >
                    010-2742-8587
                  </a>
                </TableCell>
                <TableCell className="py-4 text-gray-700">
                  <span className="bg-yellow-50 text-yellow-800 px-3 py-1 rounded-full text-sm">
                    worldkorea_seoulsky
                  </span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-center mt-8">
          <Image
            src="/images/bottom_image.png"
            width={400}
            height={100}
            alt="group-reservation-bottom"
          />
        </div>
      </div>
    </>
  );
}
