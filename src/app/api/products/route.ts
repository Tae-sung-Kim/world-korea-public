import { HTTP_STATUS } from '@/constants';
import { createResponse } from '@/utils/http';
import { NextRequest, NextResponse } from 'next/server';

/**
 * 상품 목록 반환
 */
export async function GET() {
  try {
    return NextResponse.json(true);
  } catch (error) {
    return createResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}

/**
 * 상품 등록
 */
export async function POST(req: NextRequest) {
  try {
    return NextResponse.json(true);
  } catch (error) {
    return createResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}
