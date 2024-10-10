import PinModel from '../../models/pin.model';
import { requiredIsAdmin } from '../../utils/auth.util';
import { createResponse } from '../../utils/http.util';
import connectMongo from '@/app/api/libs/database';
import { HTTP_STATUS } from '@/definitions';
import { Types } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

/**
 * 핀 사용날짜 변경 (핀 목록)
 */
export async function POST(req: NextRequest) {
  try {
    const { pinNumberList, used = true } = await req.json();

    await connectMongo();

    if (!(await requiredIsAdmin())) {
      return createResponse(HTTP_STATUS.FORBIDDEN);
    }

    const pinList = await PinModel.find({ number: { $in: pinNumberList } });

    // 존재하지 않는 핀 번호 체크
    if (pinList.length < pinNumberList) {
      return createResponse(
        HTTP_STATUS.UNPROCESSABLE_ENTITY,
        '유효하지 않은 핀 번호가 있습니다.'
      );
    }

    // 이미 사용된 핀 번호 체크
    const alreadyUsedPinList: Types.ObjectId[] = pinList.reduce<
      Types.ObjectId[]
    >((acc, pinItem) => {
      if (pinItem.usedDate) {
        acc.push(pinItem._id);
      }

      return acc;
    }, []);

    if (alreadyUsedPinList.length > 0) {
      return createResponse(
        HTTP_STATUS.UNPROCESSABLE_ENTITY,
        '이미 사용된 핀 번호가 있습니다.',
        alreadyUsedPinList
      );
    }

    await PinModel.updateUsedDatePinNumberList(pinNumberList, used);

    return NextResponse.json(true);
  } catch (error) {
    return createResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}
