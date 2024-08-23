import { requiredIsAdmin, requiredIsLoggedIn } from '../utils/auth.util';
import { FILE_PATH, FILE_TYPE, uploadFile } from '../utils/upload.util';
import connectMongo from '@/app/api/libs/database';
import ProductModel from '@/app/api/models/product.model';
import { createResponse } from '@/app/api/utils/http.util';
import { HTTP_STATUS } from '@/definitions';
import { NextRequest, NextResponse } from 'next/server';

/**
 * 상품 목록 반환
 */
export async function GET() {
  try {
    if (!(await requiredIsLoggedIn())) {
      return createResponse(HTTP_STATUS.UNAUTHORIZED);
    }

    const list = await ProductModel.getProductList();

    return NextResponse.json(list);
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

    const formData = await req.formData();

    const name = formData.get('name');
    const accessLevel = formData.get('accessLevel');
    const status = formData.get('status');
    const regularPrice = formData.get('regularPrice');
    const salePrice = formData.get('salePrice');
    const price = formData.get('price');
    const description1 = formData.get('description1');
    const description2 = formData.get('description2');
    const description3 = formData.get('description3');
    const description4 = formData.get('description4');
    // const unavailableDates = formData.get('unavailableDates');

    const imageFiles = Array.from(formData.getAll('images')) as File[];
    let imageList = await uploadFile(imageFiles, {
      path: FILE_PATH.PRODUCT,
      type: FILE_TYPE.IMAGE,
    });
    let imageUrlListToUpload = imageList.map((d) => d.url);

    const newProduct = new ProductModel({
      name,
      accessLevel,
      status,
      regularPrice,
      salePrice,
      price,
      description1,
      description2,
      description3,
      description4,
      images: imageUrlListToUpload,
      // unavailableDates
    });

    await newProduct.save();

    return NextResponse.json(newProduct, { status: 200 });
  } catch (error) {
    return createResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}
