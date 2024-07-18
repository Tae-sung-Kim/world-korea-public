import { HTTP_STATUS } from '@/constants';
import { createResponse } from '@/utils/http';
import { NextRequest, NextResponse } from 'next/server';

/**
 * 상품 상세 반환
 */
export async function GET() {
  try {
    return NextResponse.json(true);
  } catch (error) {
    return createResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}

/**
 * 상품 내용 변경
 */
export async function PATCH(req: NextRequest) {
  try {
    return NextResponse.json(true);
  } catch (error) {
    return createResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}
