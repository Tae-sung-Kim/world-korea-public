import ProductModel from '../../models/product.model';
import { requiredIsAdmin, requiredIsMe } from '../../utils/auth.util';
import connectMongo from '@/app/api/libs/database';
import { createResponse } from '@/app/api/utils/http.util';
import { HTTP_STATUS, ProductImage, ProductStatus } from '@/definitions';
import { NextRequest, NextResponse } from 'next/server';

/**
 * 상품 상세 반환
 */
export async function GET(req: NextRequest, ctx: { params: { id: string } }) {
  try {
    const productId = ctx.params.id;

    await connectMongo();

    if (!(await requiredIsMe())) {
      return createResponse(HTTP_STATUS.UNAUTHORIZED);
    }

    const productData = await ProductModel.findOne({ _id: productId });

    return NextResponse.json(productData);
  } catch (error) {
    return createResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}

/**
 * 상품 내용 변경
 */
export async function PATCH(req: NextRequest, ctx: { params: { id: string } }) {
  try {
    const productId = ctx.params.id;

    await connectMongo();

    if (!(await requiredIsAdmin())) {
      return createResponse(HTTP_STATUS.FORBIDDEN);
    }

    const formData = await req.formData();

    const name = formData.get('name') as string;
    const accessLevel = formData.get('accessLevel') as string;
    const status = formData.get('status') as ProductStatus;
    const regularPrice = formData.get('regularPrice') as string;
    const salePrice = formData.get('salePrice') as string;
    const price = formData.get('price') as string;
    const taxFree = formData.get('taxFree') as string;
    const description1 = formData.get('description1') as string;
    const description2 = formData.get('description2') as string;
    const description3 = formData.get('description3') as string;
    const description4 = formData.get('description4') as string;
    const images = formData.getAll('images') as ProductImage[];
    const isLotteWorld = formData.get('isLotteWorld') === 'true';

    const existingProduct = await ProductModel.findById(productId);
    if (!existingProduct) {
      return NextResponse.json(false);
    }

    await existingProduct.updateProduct({
      name,
      accessLevel,
      status,
      regularPrice,
      salePrice,
      price,
      taxFree,
      description1,
      description2,
      description3,
      description4,
      images,
      isLotteWorld,
    });

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
    const productId = ctx.params.id;
    await connectMongo();

    if (!(await requiredIsAdmin())) {
      return createResponse(HTTP_STATUS.FORBIDDEN);
    }

    await ProductModel.deleteProductById(productId);

    return NextResponse.json(true);
  } catch (error) {
    return createResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}
