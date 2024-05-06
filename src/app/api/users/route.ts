import { NextResponse } from 'next/server';
import executeQuery from '@/db/database';

export async function GET() {
  try {
    const sql = `select * from worldkoreadev.users a join worldkoreadev.member_types b on a.member_type_id = b.id`;
    const data = await executeQuery(sql, '');
    const getdata = JSON.parse(JSON.stringify(data));

    return NextResponse.json(getdata);
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
