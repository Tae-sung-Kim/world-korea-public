//핀번호 4자리씩 대쉬 추가
export const splitFourChar = (pinNumber: string = '') => {
  if (pinNumber) {
    return pinNumber.replace(/(.{4})/g, '$1-').slice(0, -1);
  }
};
