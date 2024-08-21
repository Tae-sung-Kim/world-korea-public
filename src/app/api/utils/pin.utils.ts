import { v4 as uuidv4 } from 'uuid';

export function generate12CharUUID() {
  const uuid = uuidv4().replace(/-/g, ''); // 하이픈을 제거하고 32자리 문자열 생성
  return uuid.substring(0, 12); // 앞의 12자리만 사용
}
