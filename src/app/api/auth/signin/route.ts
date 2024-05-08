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
      return NextResponse.json({
        success: true,
        data: false,
        message: '해당 아이디로 등록된 사용자를 찾을 수 없습니다.',
      });
    }
    userData = userData[0];

    // 비밀번호 체크
    const isEqual = await comparePassword(password, userData.password);

    return NextResponse.json({
      success: true,
      data: isEqual,
      message: isEqual
        ? '로그인이 성공적으로 완료되었습니다.'
        : '로그인에 실패했습니다. 입력한 정보를 다시 확인해주세요.',
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
