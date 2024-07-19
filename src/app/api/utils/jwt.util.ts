import { UserJwtPayloadType } from '@/types';
import jwt from 'jsonwebtoken';

const secretKey = process.env.NEXTAUTH_SECRET as string;

class JwtUtils {
  sign(payload: UserJwtPayloadType) {
    return jwt.sign(payload, secretKey, {
      algorithm: 'HS256', // 암호화 알고리즘
      expiresIn: '7d', // 유효기간
    });
  }

  verify(token: string) {
    let decoded = null;

    try {
      decoded = jwt.verify(token, secretKey) as UserJwtPayloadType;

      return {
        id: decoded.id,
        name: decoded.name,
        isAdmin: decoded.isAdmin,
      };
    } catch (err) {
      return false;
    }
  }
  // refresh: () => { // refresh token 발급
  //   return jwt.sign({}, secret, { // refresh token은 payload 없이 발급
  //     algorithm: 'HS256',
  //     expiresIn: '14d',
  //   });
  // },
  // refreshVerify: async (token, userId) => { // refresh token 검증
  //   /* redis 모듈은 기본적으로 promise를 반환하지 않으므로,
  //      promisify를 이용하여 promise를 반환하게 해줍니다.*/
  //   const getAsync = promisify(redisClient.get).bind(redisClient);

  //   try {
  //     const data = await getAsync(userId); // refresh token 가져오기
  //     if (token === data) {
  //       try {
  //         jwt.verify(token, secret);
  //         return true;
  //       } catch (err) {
  //         return false;
  //       }
  //     } else {
  //       return false;
  //     }
  //   } catch (err) {
  //     return false;
  //   }
  // },
}

export default new JwtUtils();
