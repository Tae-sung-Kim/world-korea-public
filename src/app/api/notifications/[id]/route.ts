import NotificationModel from '../../models/notification.model';
import { requiredIsAdmin } from '../../utils/auth.util';
import connectMongo from '@/app/api/libs/database';
import { createResponse } from '@/app/api/utils/http.util';
import { HTTP_STATUS } from '@/definitions';
import { NextRequest, NextResponse } from 'next/server';

/**
 * @swagger
 * /api/notifications/[id]:
 *    delete:
 *      tags:
 *        - Notifications
 *      description: 노티를 삭제한다.
 *      parameters:
 *      - in: path
 *        id: id
 *        required: True
 *        schema:
 *          type: string
 *      responses:
 *        200:
 *          description: OK
 *        403:
 *          description: 관리자 권한이 없습니다.
 */
export async function DELETE(
  req: NextRequest,
  ctx: { params: { id: string } }
) {
  try {
    const notificationId = ctx.params.id;
    await connectMongo();

    if (!(await requiredIsAdmin())) {
      return createResponse(HTTP_STATUS.FORBIDDEN);
    }

    await NotificationModel.findByIdAndDelete(notificationId);

    return NextResponse.json(true);
  } catch (error) {
    return createResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}
