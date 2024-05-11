import executeQuery from '@/db/database';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // const session = await authService.getSession();
    // if (!session) {
    //   return NextResponse.json(
    //     { message: '권한이 없습니다.' },
    //     { status: 400 },
    //   );
    // }

    const sql = `select id, email from worldkoreadev.users`;
    const data = await executeQuery(sql, '');
    const userListData = JSON.parse(JSON.stringify(data));

    return NextResponse.json(userListData);
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
