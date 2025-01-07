import { getQueryParams } from '../../utils/api.utils';
import { requiredIsAdmin } from '../../utils/auth.util';
import connectMongo from '@/app/api/libs/database';
import UserModel from '@/app/api/models/user.model';
import { createResponse } from '@/app/api/utils/http.util';
import { HTTP_STATUS } from '@/definitions/http.constant';
import { NextRequest, NextResponse } from 'next/server';

/**
 * 회원 목록 반환
 */
export async function GET(req: NextRequest) {
  try {
    await connectMongo();

    if (!(await requiredIsAdmin())) {
      return createResponse(HTTP_STATUS.FORBIDDEN);
    }

    const { pageNumber, pageSize, filter, sort } = getQueryParams(req);
    const paginationResponse = await UserModel.getPartnerUserList({
      pageNumber,
      pageSize,
      filter,
      sort,
    });

    return NextResponse.json(paginationResponse);
  } catch (error) {
    return createResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}
