import ProductModel from '../models/product.model';
import { getQueryParams } from '../utils/api.utils';
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
export async function GET(req: NextRequest) {
  try {
    await connectMongo();

    if (!(await requiredIsAdmin())) {
      return createResponse(HTTP_STATUS.FORBIDDEN);
    }

    const { pageNumber, pageSize, filter, sort } = getQueryParams(req);

    const paginationResponse = await PinModel.getPinList({
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
      orderStatus, //핀 상태
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
          orderStatus,
          product: productId,
          number: `${pinPrefixFour}${generate12CharUUID()}`,
          endDate,
        });
      });

      const pinList = await PinModel.insertMany(listToInsert, {
        ordered: false,
      });
      const product = await ProductModel.getProductById(productId);
      if (product) {
        await product.addProductPin(pinList.map((d) => d._id));
      }

      return NextResponse.json(true);
    } else if (isPinManualValid) {
      const listToInsert: PinDB[] = [];

      // 먼저 중복된 핀 번호 체크
      const existingPins = await PinModel.find({
        number: { $in: pinList.map((p) => p.pinNumber) },
      });

      // 중복된 핀 번호가 있으면 에러 응답
      if (existingPins.length > 0) {
        return NextResponse.json(
          {
            success: false,
            message: `다음 핀 번호들이 이미 존재합니다: ${existingPins
              .map((pin) => pin.number)
              .join(', ')}`,
          },
          { status: 400 }
        );
      }

      pinList.forEach(
        ({ pinNumber, endDate }: { pinNumber: string; endDate?: Date }) => {
          if (typeof pinNumber === 'string' && pinNumber.length === 16) {
            listToInsert.push({
              orderStatus,
              product: productId,
              number: pinNumber,
              endDate,
            });
          }
        }
      );

      if (listToInsert.length > 0) {
        const pinList = await PinModel.insertMany(listToInsert, {
          ordered: false,
        });
        const product = await ProductModel.getProductById(productId);
        if (product) {
          await product.addProductPin(pinList.map((d) => d._id));
        }

        return NextResponse.json(true);
      }
    }

    return createResponse(HTTP_STATUS.BAD_REQUEST);
  } catch (error) {
    return createResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}

/**
 * 다건 핀 삭제
 */

export async function DELETE(req: NextRequest) {
  try {
    await connectMongo();

    if (!(await requiredIsAdmin())) {
      return createResponse(HTTP_STATUS.FORBIDDEN);
    }

    const { ids } = await req.json(); // 요청 본문에서 직접 ids 추출

    // ids 유효성 검사 추가
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return createResponse(
        HTTP_STATUS.BAD_REQUEST,
        '유효하지 않은 핀 ID 목록'
      );
    }

    const deletedPins = await PinModel.find({ _id: { $in: ids } });

    // 존재하지 않는 핀 ID 처리
    if (deletedPins.length !== ids.length) {
      const existingPinIds = deletedPins.map((pin) => pin._id.toString());
      const missingPinIds = ids.filter((id) => !existingPinIds.includes(id));

      console.log(`다음 핀 ID는 존재하지 않음: ${missingPinIds.join(', ')}`);
    }

    await PinModel.deleteMany({ _id: { $in: ids } });

    const productIds = deletedPins.map((pin) => pin.product).filter(Boolean);
    await ProductModel.updateMany(
      { _id: { $in: productIds } },
      { $pullAll: { pins: deletedPins.map((pin) => pin._id) } }
    );

    return NextResponse.json({
      deletedCount: deletedPins.length,
      totalRequestedCount: ids.length,
    });
  } catch (error) {
    console.error('핀 다건 삭제 중 오류:', error);
    return createResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}
