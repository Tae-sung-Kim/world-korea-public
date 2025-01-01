'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function GroupReservationInfo() {
  return (
    <div className="text-center space-y-8 bg-white p-4">
      <div className="relative text-center mb-12">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <h1 className="relative inline-block px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white text-3xl md:text-4xl font-bold rounded-full shadow-lg transform hover:scale-105 transition-transform duration-200">
          해외 단체 요금 안내
        </h1>
      </div>

      <div className="space-y-6 max-w-4xl mx-auto text-center">
        <p className="text-red-500 text-sm md:text-base bg-red-50 p-4 rounded-lg">
          ※ 월드코리아에서 제공하는 요금은 모든 해외 국적 단체에 적용
          가능합니다. (해외 인바운드 / 국내 체류 외국인)
        </p>
        <p className="m-6 md:m-10 text-sm md:text-base bg-gray-50 p-4 rounded-lg">
          롯데월드 공식 해외 인바운드 마케팅 및 예약 전담 대행사
          월드코리아입니다.
          <br />
          아래 예약요청서를 정확히 작성하신 후, 마지막 “예약이 완료되었습니다.”
          메세지까지 꼭 확인 부탁드립니다.
        </p>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-[900px] align-middle">
          <div className="overflow-hidden border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <TableHeader>
                <TableRow>
                  <TableHead className="bg-blue-50 py-4 text-blue-900 font-medium text-base w-[12%] border-b">
                    구분
                  </TableHead>
                  <TableHead
                    className="bg-blue-50 py-4 text-blue-900 font-medium text-base w-[28%] border-b"
                    colSpan={2}
                  >
                    권종
                  </TableHead>
                  <TableHead className="bg-blue-50 py-4 text-blue-900 font-medium text-base w-[15%] border-b whitespace-nowrap">
                    당일 예약시
                  </TableHead>
                  <TableHead className="bg-blue-50 py-4 text-blue-900 font-medium text-base w-[15%] border-b whitespace-nowrap">
                    <span className="text-red-600">사전 예약시</span>
                  </TableHead>
                  <TableHead className="bg-blue-50 py-4 text-blue-900 font-medium text-base w-[30%] border-b">
                    비고
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="hover:bg-gray-50 transition-colors">
                  <TableCell
                    className="group-reservation-td font-medium bg-gray-50 border-r"
                    rowSpan={3}
                  >
                    단품
                  </TableCell>
                  <TableCell className="group-reservation-td" colSpan={2}>
                    롯데월드
                  </TableCell>
                  <TableCell className="group-reservation-td text-center">
                    29,000
                  </TableCell>
                  <TableCell className="py-4 text-red-600 font-medium text-center">
                    27,000
                  </TableCell>
                  <TableCell className="group-reservation-td" rowSpan={7}>
                    <div className="space-y-4">
                      <p className="font-medium text-gray-900">
                        &lt;월드코리아 상품 예약 안내 (공통)&gt;
                      </p>
                      <ul className="space-y-3 text-sm">
                        <li className="flex items-start space-x-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>
                            방문일자 (방문시간) / 업체명 / 이용상품
                            <br />
                            인원 (손님+인솔자 각각) / 국적 / 인솔자 정보
                          </span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span className="text-red-600 font-medium">
                            예약은 방문 1일 전까지 가능합니다.
                          </span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>
                            매표소에서 구매하실 경우 사전 예약 요금은 적용되지
                            않습니다.
                            <p className="text-red-600 font-medium mt-1">
                              티켓수령 및 결제는 반드시 월드코리아 담당자와 대면
                              진행하시도록 전달 바랍니다.
                            </p>
                          </span>
                        </li>
                      </ul>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow className="hover:bg-gray-50 transition-colors">
                  <TableCell className="group-reservation-td" colSpan={2}>
                    아쿠아리움
                  </TableCell>
                  <TableCell className="group-reservation-td text-center">
                    22,000
                  </TableCell>
                  <TableCell className="py-4 text-red-600 font-medium text-center">
                    20,000
                  </TableCell>
                </TableRow>
                <TableRow className="hover:bg-gray-50 transition-colors">
                  <TableCell className="group-reservation-td" colSpan={2}>
                    서울스카이
                  </TableCell>
                  <TableCell className="group-reservation-td text-center">
                    24,000
                  </TableCell>
                  <TableCell className="py-4 text-red-600 font-medium text-center">
                    22,000
                  </TableCell>
                </TableRow>
                <TableRow className="hover:bg-gray-50 transition-colors">
                  <TableCell
                    className="group-reservation-td font-medium bg-gray-50 border-r"
                    rowSpan={4}
                  >
                    롯데월드
                    <br />
                    패키지
                  </TableCell>
                  <TableCell className="group-reservation-td" colSpan={2}>
                    롯데월드+아쿠아리움
                  </TableCell>
                  <TableCell className="group-reservation-td text-center">
                    38,000
                  </TableCell>
                  <TableCell className="py-4 text-red-600 font-medium text-center">
                    35,000
                  </TableCell>
                </TableRow>
                <TableRow className="hover:bg-gray-50 transition-colors">
                  <TableCell className="group-reservation-td" colSpan={2}>
                    롯데월드+서울스카이
                  </TableCell>
                  <TableCell className="group-reservation-td text-center">
                    40,000
                  </TableCell>
                  <TableCell className="py-4 text-red-600 font-medium text-center">
                    37,000
                  </TableCell>
                </TableRow>
                <TableRow className="hover:bg-gray-50 transition-colors">
                  <TableCell className="group-reservation-td" colSpan={2}>
                    서울스카이+아쿠아리움
                  </TableCell>
                  <TableCell className="group-reservation-td text-center">
                    40,000
                  </TableCell>
                  <TableCell className="py-4 text-red-600 font-medium text-center">
                    37,000
                  </TableCell>
                </TableRow>
                <TableRow className="hover:bg-gray-50 transition-colors">
                  <TableCell className="group-reservation-td" colSpan={2}>
                    롯데월드+서울스카이+아쿠아리움
                  </TableCell>
                  <TableCell className="group-reservation-td text-center">
                    50,000
                  </TableCell>
                  <TableCell className="py-4 text-red-600 font-medium text-center">
                    47,000
                  </TableCell>
                </TableRow>
                <TableRow className="hover:bg-gray-50 transition-colors">
                  <TableCell className="group-reservation-td font-medium bg-gray-50 border-r">
                    부산
                  </TableCell>
                  <TableCell className="group-reservation-td" colSpan={2}>
                    부산 롯데월드
                  </TableCell>
                  <TableCell className="group-reservation-td text-center">
                    35,000
                  </TableCell>
                  <TableCell className="py-4 text-red-600 font-medium text-center">
                    26,000
                  </TableCell>
                  <TableCell className="group-reservation-td">
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start space-x-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>
                          단체 매표소에서 직접 매표 <br />※ 방문 전 안내 문자
                          발송드립니다.
                        </span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>가이드증 미지참 시 인솔자도 매표 필요</span>
                      </li>
                    </ul>
                  </TableCell>
                </TableRow>
                <TableRow className="hover:bg-gray-50 transition-colors">
                  <TableCell colSpan={5}></TableCell>
                </TableRow>
                <TableRow className="hover:bg-gray-50 transition-colors">
                  <TableCell
                    className="group-reservation-td font-medium bg-gray-50 border-r"
                    rowSpan={2}
                  >
                    밀쿠폰
                  </TableCell>
                  <TableCell className="group-reservation-td">
                    엠테이블
                  </TableCell>
                  <TableCell className="group-reservation-td">
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start space-x-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>
                          <span className="text-blue-500">
                            「지정 메뉴 중 택 1 + 음료」
                          </span>
                          <br />
                          (자장면 / 돈카츠 / 새우볶음밥)
                        </span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>밀쿠폰 내 지도 기재</span>
                      </li>
                    </ul>
                  </TableCell>
                  <TableCell
                    rowSpan={2}
                    className="group-reservation-td text-center"
                  >
                    --
                  </TableCell>
                  <TableCell
                    rowSpan={2}
                    className="py-4 text-red-600 font-medium text-center"
                  >
                    10,000
                  </TableCell>
                  <TableCell className="group-reservation-td">
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start space-x-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>롯데월드 어드벤처 내 3층</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>식권 뒷편 약도 첨부</span>
                      </li>
                    </ul>
                  </TableCell>
                </TableRow>
                <TableRow className="hover:bg-gray-50 transition-colors">
                  <TableCell className="group-reservation-td">
                    얼오브샌드위치
                  </TableCell>
                  <TableCell className="group-reservation-td">
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start space-x-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>
                          <span className="text-blue-500">
                            「샌드위치 15종 중 택 1 + 음료」
                          </span>
                        </span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>밀쿠폰 내 지도 기재</span>
                      </li>
                    </ul>
                  </TableCell>
                  <TableCell className="group-reservation-td">
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start space-x-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>롯데월드 정문매표소 옆 연간이용센터 앞</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>포장 or 매장이용 가능 ( 입장 전/ 퇴장 후)</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span className="text-blue-500 underline">
                          사전에 메뉴 및 시간 예약이 가능합니다.
                        </span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>
                          선택 가능 메뉴 (에그&체다, 비엘티, 이탈리안, 햄&에그,
                          캐논볼, 클럽, 튜나멜트, 햄&스위스, 치폴레 치킨
                          아보카도, 오리지널1762, 하와이안바베큐, 풀몬태규,
                          치즈불닭, 얼스버거, 베지)
                        </span>
                      </li>
                    </ul>
                  </TableCell>
                </TableRow>
              </TableBody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
