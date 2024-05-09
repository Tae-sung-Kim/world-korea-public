import executeQuery from '@/db/database';
import { generateToken } from '@/utils/jwt';
import { comparePassword } from '@/utils/password';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { id, password } = await req.json();

    // 유저 조회
    let sql = `SELECT * FROM worldkoreadev.users users WHERE id = '${id}'`;
    const userResult = await executeQuery(sql, '');
    let userData = JSON.parse(JSON.stringify(userResult));
    if (userData.length === 0) {
      return NextResponse.json(false);
    }
    userData = userData[0];

    // 비밀번호 체크
    const isEqual = await comparePassword(password, userData.password);

    if (isEqual) {
      // 유저 id, 관리자 여부 객체로 토큰 페이로드 정보 생성
      const payload = {
        id: userData.id,
      };

      // jwt.js에서 작성된 토큰 생성 코드 실행
      const token = generateToken(payload);

      return NextResponse.json(userData);
      // return NextResponse.json({
      //   user: {
      //     id: userData.id,
      //   },
      //   token,
      // });
    }

    return NextResponse.json(false);
  } catch (error) {
    return NextResponse.json(
      {
        error,
      },
      {
        status: 500,
      },
    );
  }
}
