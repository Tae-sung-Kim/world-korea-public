//https로 할경우 package json 수정
"dev": "next dev -H (IP입력) -p (PORT번호) --experimental-https",
예시 -> "dev": "next dev -H 192.168.35.80 -p 3005 --experimental-https",

- env파일도 프로토콜을 https로 변경
- mkcert로 인증 파일 생성해야함.

https://worldkorea.vercel.app/

지금 해야 할거(2024-10-22)

1. 팝업관리
2. 파트너사 개발
   2.1 상품 연결 만들어야함. => PATCH 안되는거 같은데 확인 필요
3. sort기능은 API로 대체 해야함

해야할 목록 작성(2024-10-11 미팅) #전체 수정 내역

1. 날짜는 유효기간
2. 판매가는 일단 필요없음.(완)
3. 사용여부 - 취소 처리 -> 관리자만 -> 경고창 - 이렇게만 할려다가 다시 파트너사에게도 권한 처리(관리자 완)
4. 어드민일경우 구매 목록 -> qrCode는 상품 정보(상품명, 사용여부)로 처리가 나오도록
5. 정산관리 - 대쉬보드
6. 업체번호는 필요없음 - 지금은 필요 없음!
7. qr은 따로 - 이게 뭐드라...
8. 같은 업체끼리는 패키지 없음.
9. 구매목록 -> 구매일, 방문예정일(유효기간), 업체명, 업체 담당자명 추가, 구매자명 삭제
   - 구매할때 -> 카톡, 메일 선택해야함.
10. 팝업관리 -> 등록, 삭제, 목록 -> 완료
11. 구매 목록 상세 화면
12. 검색 기능 추가 - object안에 상품의 이름으로 filter를 할 경우 확인 필요 - 예)saleProduct.name이런식으로 전달
13. 정렬 기능 추가 - 기능 추가 완료 -> 내가 하는게 아니고(이미 했던것은 삭제), server에 querystring으로 전달 예정

#단체예약 - 엑셀 파일 받았으므로, 작업해야 함.

1. 당일 예약 불가 -> 전날에 예매
2. 구매안함, 무조건 사전 예약
3. 예약 목록 만들어야함 - 상품에 따로 노출여부 있어야 함.
4. 사전 예약을 위한 상품이 따로 있음 - 단건만 예약
5. 단체 예약 수기 작성 -일자 -> 달력 컴포넌트, 시간 selectbox

#파트너사 (대쉬보드, 구매내역, 핀번호 목록만 보여짐) -> api완료

1. 핀번호 목록
2. 구매내역 -> 핀 번호 사용 처리만
3. 정산관리 - 대쉬보드
4. 회원가입은 파트사가 직접 -> 승인은 관리자가 함
5. 파트너사와 1:N 관계 -> 연결 고리 만들어야함. -연결 화면
6. 핀사용 여부 취소 기능까지.
7. 회원가입은 개인이 하며 관리자가 파트너사 체크하도록
8. 상품 연결은 파트너사 상세 페이지 만들고 거기서 연결 가능하도록 -> api 있음
9. 구매 목록 및 핀번호 목록은 파트너에 해당되는 상품만
10. 핀번호 사용시, 파트너에 상품만 핀번호 사용 가능하도록???

#엑셀기능

- 핀번호 목록 - 버튼 영역 제외
- 구매목록 - 버튼 영역 제외
- 단체예약 -방문일자, 방문시간(selectbox, 10~20시),상품명, 업체명, 인솔자명, 연락처, 인원수(인솔자수), 국적

#나중에 처리 예정 목록

1. 앞으로는 핀번호가 아닌 url로 처리(url이동시 QRCODE 노출) -> 롯데월드(롯데월드 상품만)만
   - 출력시에는 핀번호로, 온라인에서는 url

# qr shortUrl사용

판매상품 등록 시 shortId 추가로 DB에 저장 (8자리)
QR코드 데이터는 /o/[shortId]
QR코드 찍었을 경우 해당 Url 로 이동
세션이 있을 경우 이에 해당하는 신규 API 호출 /api/...../[shortId]
판매상품 내에 권한에 해당하는 상품 목록 반환
클라이언트에서 상품 표현 (링크도 있어야 할듯)

////////////// 20241112

- 롯데월드랑 월코 상품이랑 항상 한셋트인데 그렇다면, 롯데월드 1개, 상품 1개 이렇게 세트로 10개 구매하면 qrCODE는 총 20개 인가?
  그렇다면 tickets[{롯데월드1, 판매상품1}, {롯데월드2, 판매상품2}]가 이렇게 내려와야 하는건가?
  //////////////////

short url

- 구매목록에 url 정보 내려줌
- 외부 카메라로 했을때 session 없으면
  - 경고창으로 이동

#추가 처리 내용

1. 컴포넌트화 하기
   - 해당 화면에서만 필요할 경우는 거기에 작성하되, 추가적으로 다른곳에서 쓰는 공통요소가 될 경우 components/common폴더로 만들예정
2. hook으로 할 수 잇는 부분은 hook으로
3. type할때 form이랑 display용은 따로 하는게
