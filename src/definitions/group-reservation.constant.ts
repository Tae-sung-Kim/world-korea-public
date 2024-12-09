export const ADDITIONAL_OPTIONS = [
  { id: 'schoolUniformTrial', label: '교복체험' },
  { id: 'hanRiverCruise', label: '한강유람선(이크루즈)', boardingTime: '' },
];

export const MEAL_COUPON = [
  { value: 'allOfSandwich', label: '얼오브샌드위치' },
  { value: 'mTable', label: '엠테이블' },
  { value: 'multiUse', label: '겸용' },
];

export const PAYMENT_TYPE = [
  { value: 'dayOfCardPayment', label: '당일 카드결제' },
  { value: 'cashPayment', label: '현금 결제', etc: true },
  { value: 'preDeposit', label: '사전 입금', etc: true },
];

export const ESTIMATED_ARRIVAL_TIME = [
  { value: 'mainEntrance', label: '정문' },
  { value: 'southEntrance', label: '남문' },
  { value: 'lotteWorldBusPark', label: '롯데월드 버스 주차장' },
  { value: 'seoulSkyEntrance', label: '서울스카이 입구' },
  { value: 'etc', label: '기타', memo: '' },
];

export const GROUP_RESERVATION_ICONS = [
  {
    alt: '롯데월드 어드벤처',
    url: 'https://adventure.lotteworld.com/kor/group-program/introduce/contentsid/331/index.do',
    src: '/images/group-reservation/lotteworld_adv.png',
  },
  {
    alt: '서울 스카이',
    url: ' https://seoulsky.lotteworld.com/ko/watch/groupDirection.do',
    src: '/images/group-reservation/seoul_sky.png',
  },
  {
    alt: '롯데월드 아쿠아리움',
    url: ' https://www.lotteworld.com/contents/contents.asp?cmsCd=CM0875',
    src: '/images/group-reservation/lotteworld_aqa.png',
  },
  {
    alt: '롯데월드 어드벤처 부산',
    url: ' https://adventurebusan.lotteworld.com/kor/group-program/introduce/contentsid/461/index.do',
    src: '/images/group-reservation/lotteworld_adv_busan.png',
  },
];
