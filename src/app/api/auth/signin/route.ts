import executeQuery from '@/db/database';
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

    return NextResponse.json(isEqual);
  } catch (error) {
    return NextResponse.json(
      {
        error,
      },
      {
        status: 500,
      }
    );
  }
}
