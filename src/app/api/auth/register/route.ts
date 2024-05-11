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

    return NextResponse.json(
      {
        id,
        email,
        name,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 500,
      },
    );
  }
}
