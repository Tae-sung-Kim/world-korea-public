import executeQuery from '@/db/database';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const sql = `select id, email from worldkoreadev.users`;
    const data = await executeQuery(sql, '');
    const userListData = JSON.parse(JSON.stringify(data));

    return NextResponse.json({
      success: true,
      data: userListData,
      message: '회원목록 조회에 성공했습니다.',
    });
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
