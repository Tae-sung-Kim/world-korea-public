//https로 할경우 package json 수정
"dev": "next dev -H (IP입력) -p (PORT번호) --experimental-https",
예시 -> "dev": "next dev -H 192.168.35.80 -p 3005 --experimental-https",

- env파일도 프로토콜을 https로 변경
- mkcert로 인증 파일 생성해야함.

https://worldkorea.vercel.app/

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
10. 팝업관리 -> 등록, 삭제, 목록 api - api개발 완료
    - 24시간 보지않기, 닫기 기능 개발 해야함
11. 구매 목록 상세 화면
12. 검색 기능 추가 - object안에 상품의 이름으로 filter를 할 경우 확인 필요 - 예)saleProduct.name이런식으로 전달
13. 정렬 기능 추가 - 기능 추가 완료 -> 내가 하는게 아니고(이미 했던것은 삭제), server에 querystring으로 전달 예정

#단체예약

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
5. 파트너사는 로그인하면 관리자페이지만 -> 파트너사 권한 부여(회원등급)
6. 파트너사와 1:N 관계 -> 연결 고리 만들어야함. -연결 화면
7. 핀사용 여부 취소 기능까지.
8. 회원가입은 개인이 하며 관리자가 파트너사 체크하도록
9. user상세에서 관리자 승인 옆에 파트너사 여부 추가
10. 상품 연결은 파트너사 상세 페이지 만들고 거기서 연결 가능하도록 -> api 있음

#엑셀기능

- 핀번호 목록 - 버튼 영역 제외
- 구매목록 - 버튼 영역 제외
- 단체예약 -방문일자, 방문시간(selectbox, 10~20시),상품명, 업체명, 인솔자명, 연락처, 인원수(인솔자수), 국적

#나중에 처리 예정 목록

1. 앞으로는 핀번호가 아닌 url로 처리(url이동시 QRCODE 노출) -> 롯데월드(롯데월드 상품만)만
   - 출력시에는 핀번호로, 온라인에서는 url
