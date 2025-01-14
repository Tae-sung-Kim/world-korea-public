import { PinData } from '@/definitions';
import { v4 as uuidv4 } from 'uuid';

export function generate12CharUUID() {
  const uuid = uuidv4().replace(/-/g, ''); // 하이픈을 제거하고 32자리 문자열 생성
  return uuid.substring(0, 12); // 앞의 12자리만 사용
}

//핀번호 4자리씩 대쉬 추가
export const splitFourChar = (pinNumber: string = '') => {
  if (pinNumber) {
    return pinNumber.replace(/(.{4})/g, '$1-').slice(0, -1);
  }
  return pinNumber;
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

export const excelDataToPinUsedData = (value: string): string[] => {
  const splitLineValue = value.split('\n');

  return splitLineValue.reduce((acc: string[], cur: string) => {
    const splitTabValue = cur.split('\t');

    acc.push(splitTabValue[0].replaceAll('-', ''));

    return acc;
  }, []);
};
