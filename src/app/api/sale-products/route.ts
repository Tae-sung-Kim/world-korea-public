import { getQueryParams } from '../utils/api.utils';
import { getCurrentUser, requiredIsAdmin } from '../utils/auth.util';
import connectMongo from '@/app/api/libs/database';
import SaleProductModel from '@/app/api/models/sale-product.model';
import { createResponse } from '@/app/api/utils/http.util';
import { HTTP_STATUS, USER_CATEGORY_LEVEL_ADMIN } from '@/definitions';
import { NextRequest, NextResponse } from 'next/server';

/**
 * 상품 목록 반환
 */
export async function GET(req: NextRequest) {
  try {
    await connectMongo();
    const userData = await getCurrentUser();
    if (!userData) {
      return createResponse(HTTP_STATUS.UNAUTHORIZED);
    }
    const { isAdmin } = userData;
    const { level } = userData.userCategory;
    const { pageNumber, pageSize, filter } = getQueryParams(req);
    const paginationResponse = await SaleProductModel.getSaleProductList({
      pageNumber,
      pageSize,
      filter,
      level: String(isAdmin ? USER_CATEGORY_LEVEL_ADMIN : level),
    });
    return NextResponse.json(paginationResponse);
  } catch (error) {
    return createResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}

/**
 * 상품 등록
 */
export async function POST(req: NextRequest) {
  try {
    await connectMongo();

    if (!(await requiredIsAdmin())) {
      return createResponse(HTTP_STATUS.FORBIDDEN);
    }

    const { name, accessLevel, products, price, isReservable } =
      await req.json();

    if (!Array.isArray(products) || products.length === 0) {
      return createResponse(HTTP_STATUS.BAD_REQUEST);
    }

    const newProduct = new SaleProductModel({
      name,
      accessLevel,
      products,
      price,
      isReservable,
    });

    await newProduct.save();

    return NextResponse.json(newProduct);
  } catch (error) {
    return createResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}
