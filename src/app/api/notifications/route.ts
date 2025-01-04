import { getCurrentUser, requiredIsAdmin } from '../utils/auth.util';
import { FILE_PATH, FILE_TYPE, uploadFile } from '../utils/upload.util';
import connectMongo from '@/app/api/libs/database';
import NotificationModel from '@/app/api/models/notification.model';
import { createResponse } from '@/app/api/utils/http.util';
import { HTTP_STATUS } from '@/definitions/http.constant';
import { NextRequest, NextResponse } from 'next/server';

/**
 * @swagger
 * /api/notifications:
 *    get:
 *      tags:
 *        - Notifications
 *      description: 사이트 진입 시 띄울 모달 목록을 반환한다.
 *      responses:
 *        200:
 *          description: OK
 */
export async function GET() {
  try {
    await connectMongo();

    const userData = await getCurrentUser();
    if (!userData) {
      return createResponse(HTTP_STATUS.UNAUTHORIZED);
    }

    const nofitications = await NotificationModel.find({});

    return NextResponse.json(nofitications);
  } catch (error) {
    return createResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}

/**
 * @swagger
 * /api/notifications:
 *    post:
 *      tags:
 *        - Notifications
 *      description: 노티를 등록한다.
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                title:
 *                  type: string
 *                image:
 *                  type: File
 *      responses:
 *        200:
 *          description: OK
 *        403:
 *          description: 관리자 권한이 없습니다.
 */
export async function POST(req: NextRequest) {
  try {
    await connectMongo();

    if (!(await requiredIsAdmin())) {
      return createResponse(HTTP_STATUS.FORBIDDEN);
    }

    const formData = await req.formData();

    const title = formData.get('title');

    const imageFiles = Array.from(formData.getAll('image')) as File[];
    let imageList = await uploadFile(imageFiles, {
      path: FILE_PATH.NOTIFICATION,
      type: FILE_TYPE.IMAGE,
    });
    let imageUrlListToUpload = imageList.map((d) => d.url);

    const newProduct = new NotificationModel({
      title,
      image: imageUrlListToUpload[0],
    });

    await newProduct.save();

    return NextResponse.json(newProduct, { status: 200 });
  } catch (error) {
    return createResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}
