import PinModel from '../../models/pin.model';
import ProductModel from '../../models/product.model';
import { requiredIsAdmin, requiredIsMe } from '../../utils/auth.util';
import connectMongo from '@/app/api/libs/database';
import { createResponse } from '@/app/api/utils/http.util';
import { HTTP_STATUS } from '@/definitions';
import { NextRequest, NextResponse } from 'next/server';

/**
 * 핀 상세 반환
 */
export async function GET(req: NextRequest, ctx: { params: { id: string } }) {
  try {
    const pinId = ctx.params.id;

    await connectMongo();

    if (!(await requiredIsMe())) {
      return createResponse(HTTP_STATUS.UNAUTHORIZED);
    }

    const productData = await PinModel.getPinById(pinId);

    return NextResponse.json(productData);
  } catch (error) {
    return createResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}

/**
 * 핀 내용 변경
 */
export async function PATCH(req: NextRequest, ctx: { params: { id: string } }) {
  try {
    const pinId = ctx.params.id;
    const body = await req.json();

    await connectMongo();

    if (!(await requiredIsAdmin())) {
      return createResponse(HTTP_STATUS.FORBIDDEN);
    }

    const existingProduct = await PinModel.findById(pinId);
    if (!existingProduct) {
      return NextResponse.json(false);
    }

    // await existingProduct.updateProduct(body);

    return NextResponse.json(true);
  } catch (error) {
    return createResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}

export async function DELETE(
  req: NextRequest,
  ctx: { params: { id: string } }
) {
  try {
    const id = ctx.params.id;
    await connectMongo();

    if (!(await requiredIsAdmin())) {
      return createResponse(HTTP_STATUS.FORBIDDEN);
    }

    const deletedPin = await PinModel.findByIdAndDelete(id);
    if (deletedPin) {
      const product = await ProductModel.getProductById(deletedPin.product);
      if (product) {
        await product.deleteProductPin(deletedPin.product);
      }
    }

    return NextResponse.json(true);
  } catch (error) {
    return createResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}
