import executeQuery from '@/db/database';
import { hashPassword } from '@/utils/password';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { id, email, password, name } = await req.json();
    const hashedPassword = await hashPassword(password);

    const sql = `INSERT INTO users SET ?`;
    await executeQuery(sql, {
      id,
      email,
      password: hashedPassword,
      name,
    });

    return NextResponse.json({
      success: true,
      data: {
        id,
        email,
        name,
      },
      message: '회원가입이 성공적으로 완료되었습니다.',
    });
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
