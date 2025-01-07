import OrderModel from '../models/order.model';
import SaleProductModel from '../models/sale-product.model';
import { getQueryParams } from '../utils/api.utils';
import { getCurrentUser, requiredIsMe } from '../utils/auth.util';
import { createResponse } from '../utils/http.util';
import { generateShortId } from '../utils/short-id.utils';
import connectMongo from '@/app/api/libs/database';
import PinModel from '@/app/api/models/pin.model';
import {
  HTTP_STATUS,
  OrderStatus,
  Pin,
  Product,
  SaleProduct,
} from '@/definitions';
import { NextRequest, NextResponse } from 'next/server';

/**
 * 주문 목록 반환
 */
export async function GET(req: NextRequest) {
  try {
    await connectMongo();

    const userData = await getCurrentUser();
    if (!userData) {
      return createResponse(HTTP_STATUS.UNAUTHORIZED);
    }

    const { pageNumber, pageSize, filter, sort } = getQueryParams(req);
    const paginationResponse = await OrderModel.getOrderList({
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
 * 구매 진행
 * - 구매 상태 (대기중)
 * - 개수 만큼 핀
 * - 특정 시간 지나면 구매 내역 삭제 처리 후 핀 복구
 *
 * {
 *    saleProduct: 판매상품 ID
 *    quantity: 수량 개수
 * }
 *
 *
 * @param req
 * @returns
 */
export async function POST(req: NextRequest) {
  try {
    await connectMongo();

    const userData = await getCurrentUser();
    if (!userData) {
      return createResponse(HTTP_STATUS.UNAUTHORIZED);
    }

    const { saleProduct, quantity, payType, visitDate } = await req.json();

    // 개수 만큼 핀 있는지 확인
    // 1. 판매상품 검색
    const saleProductItem = await SaleProductModel.findOne({
      _id: saleProduct,
    })
      .populate({
        path: 'products',
        select: '_id pins',
        populate: {
          path: 'pins',
          select: '_id orderStatus',
        },
      })
      .lean<{ products: Product[]; price: number }>()
      .exec();

    // 2. 상품 목록에서 pins 에 대해서 loop를 통며 필터한다.
    if (!saleProductItem) {
      return createResponse(HTTP_STATUS.NOT_FOUND);
    }

    // - orderState Unpaid 만
    saleProductItem.products.forEach((productItem) => {
      let pinList = productItem.pins;

      pinList = pinList.filter(({ orderStatus }) => {
        return orderStatus === OrderStatus.Unpaid;
      });

      productItem.pins = pinList;
    });

    // 2. 상품 재고 체크
    let ticketList: {
      shortId: string;
      pins: string[];
    }[] = [];
    let isInValid = saleProductItem.products.some(({ pins }) => {
      const pinList = pins
        .map((pinItem) => pinItem._id as string)
        .slice(0, quantity);

      for (let i = 0, len = pinList.length; i < len; i++) {
        let ticket = ticketList[i];

        if (!ticket) {
          ticketList[i] = {
            shortId: '',
            pins: [],
          };

          ticket = ticketList[i];
        }

        ticket.pins.push(pinList[i]);
      }

      return quantity > pins.length;
    });

    if (isInValid) {
      return createResponse(HTTP_STATUS.BAD_REQUEST, '재고가 부족합니다.');
    }

    // 3. shortId 삽입
    for (let ticket of ticketList) {
      while (!ticket.shortId) {
        const generatedId = generateShortId();
        const isDuplicate = await OrderModel.checkShortIdExists(generatedId);

        if (!isDuplicate) {
          ticket.shortId = generatedId;
        }
      }
    }

    // 구매 추가
    const orderData = new OrderModel({
      saleProduct,
      tickets: ticketList,
      quantity,
      totalPrice: saleProductItem.price * quantity,
      user: userData._id,
      orderDate: Date.now(),
      status: OrderStatus.Pending,
      visitDate,
      payType,
    });

    // 4. 상품
    // - 핀 상태 결제 중으로 변경
    for (let pinNumber of ticketList.map((d) => d.pins).flat()) {
      await PinModel.updateOne(
        { _id: pinNumber },
        {
          $set: {
            saleProduct,
            orderStatus: OrderStatus.Pending,
            order: orderData._id,
          },
        },
        {
          runValidators: true,
        }
      );
    }

    await orderData.save();

    return NextResponse.json(orderData);
  } catch (error) {
    return createResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}
