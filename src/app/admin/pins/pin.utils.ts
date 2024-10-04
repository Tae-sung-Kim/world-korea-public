import { PinData } from '@/definitions';

//핀번호 4자리씩 대쉬 추가
export const splitFourChar = (pinNumber: string = '') => {
  if (pinNumber) {
    return pinNumber.replace(/(.{4})/g, '$1-').slice(0, -1);
  }
};

//엑셀에서 복사한 데이터
export const excelDataToPinRegisterData = (value: string): PinData[] => {
  const splitLineValue = value.split('\n');

  return splitLineValue.reduce((acc: PinData[], cur: string) => {
    const splitTabValue = cur.split('\t');

    acc.push({
      pinNumber: splitTabValue[0].replaceAll('-', ''),
      endDate: new Date(splitTabValue[1] ?? new Date()),
    });

    return acc;
  }, []);
};
