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
  if (isNaN(Number(value))) {
    return value;
  }

  return new Intl.NumberFormat('ko-KR').format(Number(value));
};
