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
    <div className="text-center space-y-8">
      <h1 className="text-4xl font-bold">[ 해외 단체 요금 안내 ]</h1>

      <div className="space-y-8">
        <p className="text-red-500">
          ※ 월드코리아에서 제공하는 요금은 모든 해외 국적 단체에 적용
          가능합니다. (해외 인바운드 / 국내 체류 외국인)
        </p>
        <p className="m-10">
          롯데월드 공식 해외 인바운드 마케팅 및 예약 전담 대행사
          월드코리아입니다.
          <br />
          아래 예약요청서를 정확히 작성하신 후, 마지막 “예약이 완료되었습니다.”
          메세지까지 꼭 확인 부탁드립니다.
        </p>
      </div>

      <Table className="border-2">
        <TableHeader>
          <TableRow>
            <TableHead className="text-center w-[100px]">구분</TableHead>
            <TableHead className="text-center">권종</TableHead>
            <TableHead className="text-center w-[100px]">당일 예약시</TableHead>
            <TableHead className="text-center w-[100px] text-red-500">
              사전 예약시
            </TableHead>
            <TableHead className="text-center w-[550px]">비고</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell rowSpan={3}>단품</TableCell>
            <TableCell>롯데월드</TableCell>
            <TableCell>29,000</TableCell>
            <TableCell className="text-red-500">27,000</TableCell>
            <TableCell rowSpan={7}>
              <span>&lt;월드코리아 상품 예약 안내 (공통)&gt;</span>
              <ul className="text-left list-disc m-2 space-y-2">
                <li>
                  방문일자 (방문시간) / 업체명 / 이용상품 인원 (손님+인솔자
                  각각) / 국적 / 인솔자 정보
                </li>
                <li className="text-red-500">
                  예약은 방문 1일 전까지 가능합니다.
                </li>
                <li>
                  매표소에서 구매하실 경우 사전 예약 요금은 적용되지 않습니다.{' '}
                  <span className="text-red-500">
                    티켓수령 및 결제는 반드 시 월드코리아 담당자와 대면
                    진행하시도록 전달 바랍니다.
                  </span>
                </li>
              </ul>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>아쿠아리움</TableCell>
            <TableCell>22,000</TableCell>
            <TableCell className="text-red-500">20,000</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>서울스카이 </TableCell>
            <TableCell>24,000</TableCell>
            <TableCell className="text-red-500">22,000</TableCell>
          </TableRow>
          <TableRow>
            <TableCell rowSpan={4}>
              롯데월드
              <br />
              패키지
            </TableCell>
            <TableCell>롯데월드+아쿠아리움</TableCell>
            <TableCell>38,000</TableCell>
            <TableCell className="text-red-500">35,000</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>롯데월드+서울스카이</TableCell>
            <TableCell>40,000</TableCell>
            <TableCell className="text-red-500">37,000</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>서울스카이+아쿠아리움</TableCell>
            <TableCell>40,000</TableCell>
            <TableCell className="text-red-500">37,000</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>롯데월드+서울스카이+아쿠아리움</TableCell>
            <TableCell>50,000</TableCell>
            <TableCell className="text-red-500">47,000</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>부산</TableCell>
            <TableCell>부산 롯데월드</TableCell>
            <TableCell>35,000</TableCell>
            <TableCell className="text-red-500">26,000</TableCell>
            <TableCell>
              <ul className="text-left list-disc space-y-2 m-2 space-y-2">
                <li>
                  단체 매표소에서 직접 매표 <br />※ 방문 전 안내 문자
                  발송드립니다.
                </li>
                <li>가이드증 미지참 시 인솔자도 매표 필요</li>
              </ul>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Table className="border-2">
        <TableBody>
          <TableRow>
            <TableCell className="w-[100px]" rowSpan={2}>
              밀쿠폰
            </TableCell>
            <TableCell>엠테이블</TableCell>
            <TableCell>
              <ul className="list-disc text-left space-y-2">
                <li>
                  <span className="text-blue-500">
                    「지정 메뉴 중 택 1 + 음료」
                  </span>
                  <br />
                  (자장면 / 돈카츠 / 새우볶음밥)
                </li>
                <li>밀쿠폰 내 지도 기재</li>
              </ul>
            </TableCell>
            <TableCell rowSpan={2} className="w-[100px]">
              -
            </TableCell>
            <TableCell rowSpan={2} className="text-red-500 w-[100px]">
              10,000
            </TableCell>
            <TableCell className="w-[550px]">
              <ul className="list-disc text-left space-y-2">
                <li>롯데월드 어드벤처 내 3층</li>
                <li>식권 뒷편 약도 첨부</li>
              </ul>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>얼오브샌드위치</TableCell>
            <TableCell>
              <ul className="list-disc text-left space-y-2">
                <li>
                  <span className="text-blue-500">
                    「샌드위치 15종 중 택 1 + 음료」
                  </span>
                </li>
                <li>밀쿠폰 내 지도 기재</li>
              </ul>
            </TableCell>
            <TableCell>
              <ul className="list-disc text-left space-y-2">
                <li>롯데월드 정문매표소 옆 연간이용센터 앞</li>
                <li>포장 or 매장이용 가능 ( 입장 전/ 퇴장 후)</li>
                <li className="text-blue-500 underline">
                  사전에 메뉴 및 시간 예약이 가능합니다.
                </li>
                <li>
                  선택 가능 메뉴 (에그&체다, 비엘티, 이탈리안, 햄&에그, 캐논볼,
                  클럽, 튜나멜트, 햄&스위스, 치폴레 치킨 아보카도, 오리지널1762,
                  하와이안바베큐, 풀몬태규, 치즈불닭, 얼스버거, 베지)
                </li>
              </ul>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
