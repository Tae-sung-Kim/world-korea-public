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
 * object의 String의 숫자값을 number로 변경 또는 nubmer를 string으로 변경
 *
 * @param obj
 * @param toString boolean default false
 * @returns
 */
export const ObjectStrToNum = (
  obj: { [key: string]: any },
  toString = false
) => {
  let convertObj: { [key: string]: any } = {};

  if (toString) {
    for (let key in obj) {
      convertObj[key] =
        typeof obj[key] === 'number' ? String(obj[key]) : obj[key];
    }
  } else {
    for (let key in obj) {
      convertObj[key] =
        typeof obj[key] === 'string' && !isNaN(Number(obj[key]))
          ? Number(obj[key])
          : obj[key];
    }
  }

  return convertObj;
};
