/**
 * 문자열 숫자로 부터 comma를 제거 후 number로 변환
 * @param value
 * @returns number
 */

export const removeComma = (value: string) => {
  return Number(value.replace(/,/g, ''));
};

/**
 * 숫자를 comma를 추가한 문자열변 변환
 */
export const addComma = (value: number | string) => {
  if (typeof value === 'string' && value.includes(',')) {
    return value;
  }

  if (isNaN(Number(value))) {
    return '0';
  }

  return new Intl.NumberFormat('ko-KR').format(Number(value));
};

/**
 * object의 value를 string에서 number로 변경
 * @param obj
 */

export const ObjectStrToNum = (obj: { [key: string]: any }) => {
  let convertObj: { [key: string]: string | number } = {};

  for (let key in obj) {
    convertObj[key] =
      typeof obj[key] === 'string' ? Number(obj[key]) : obj[key];
  }

  return convertObj;
};
