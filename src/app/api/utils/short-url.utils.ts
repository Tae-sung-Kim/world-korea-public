// 문자열 길이 제한 유틸리티 타입
type Length8String<T extends string> =
  T extends `${infer A}${infer B}${infer C}${infer D}${infer E}${infer F}${infer G}${infer H}`
    ? T
    : never;

// short URL 타입 정의
type ShortUrl = Length8String<string>;

export function generateShortUrl(): ShortUrl {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let shortUrl = '';

  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    shortUrl += characters[randomIndex];
  }

  return shortUrl as ShortUrl; // 8자리 문자열로 강제 변환
}
