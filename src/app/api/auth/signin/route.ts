import executeQuery from '@/db/database';
import { comparePassword } from '@/utils/password';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { id, password } = await req.json();

    // 유저 조회
    // 비밀번호 체크
    // 결과값 반환
    const sql = `INSERT INTO users SET ?`;
    await executeQuery(sql, {
      id,
      password,
      name,
    });

    return NextResponse.json(true);
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
