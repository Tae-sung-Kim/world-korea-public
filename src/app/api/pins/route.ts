import ProductModel from '../models/product.model';
import { requiredIsAdmin, requiredIsLoggedIn } from '../utils/auth.util';
import { generate12CharUUID } from '../utils/pin.utils';
import { FILE_PATH, FILE_TYPE, uploadFile } from '../utils/upload.util';
import connectMongo from '@/app/api/libs/database';
import PinModel, { PinDB } from '@/app/api/models/pin.model';
import { createResponse } from '@/app/api/utils/http.util';
import { HTTP_STATUS } from '@/definitions';
import { NextRequest, NextResponse } from 'next/server';

/**
 * 핀 목록 반환
 */
export async function GET() {
  try {
    if (!(await requiredIsAdmin())) {
      return createResponse(HTTP_STATUS.FORBIDDEN);
    }

    const list = await PinModel.getPinList();

    return NextResponse.json(list);
  } catch (error) {
    return createResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}

/**
 * 핀 등록
 */
export async function POST(req: NextRequest) {
  try {
    await connectMongo();

    if (!(await requiredIsAdmin())) {
      return createResponse(HTTP_STATUS.FORBIDDEN);
    }

    const body = await req.json();
    let {
      productId, // 상품 ID
      pinPrefixFour, // 핀번호 앞자리 (자동)
      pinCount, // 생성할 개수 (자동)
      pinList, // 핀 번호 목록 (수동)
      endDate,
    } = body;

    // pinPrefixFour 가 있을 경우 (유효성 체크 후 뒤 12자리 생성)
    const isPinPrefixFourValid =
      typeof pinPrefixFour === 'string' && pinPrefixFour.length === 4;
    // 사용자가 pin 번호를 직접 다 작성한 경우
    const isPinManualValid = Array.isArray(pinList) && pinList.length > 0;

    if (isPinPrefixFourValid) {
      if (typeof pinCount !== 'number' || pinCount <= 0) {
        return createResponse(HTTP_STATUS.BAD_REQUEST);
      }

      const listToInsert: PinDB[] = [];
      new Array(pinCount).fill(undefined).forEach(() => {
        listToInsert.push({
          product: productId,
          number: `${pinPrefixFour}${generate12CharUUID()}`,
          endDate,
        });
      });

      const pinList = await PinModel.insertMany(listToInsert, {
        ordered: false,
      });
      const product = await ProductModel.getProductById(productId);
      console.log(product);
      if (product) {
        await product.addProductPin(pinList.map((d) => d._id));
      }

      return NextResponse.json(true);
    } else if (isPinManualValid) {
      const listToInsert: PinDB[] = [];

      pinList.forEach((pin: string) => {
        if (typeof pin === 'string' && pin.length === 16) {
          listToInsert.push({
            product: productId,
            number: pin,
            endDate,
          });
        }
      });

      if (listToInsert.length > 0) {
        await PinModel.insertMany(listToInsert, { ordered: false });

        return NextResponse.json(true);
      }
    }

    return createResponse(HTTP_STATUS.BAD_REQUEST);
  } catch (error) {
    return createResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}
