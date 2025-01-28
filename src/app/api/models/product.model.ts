import { resolveData } from '../utils/condition.util';
import { FILE_PATH, FILE_TYPE, uploadFile } from '../utils/upload.util';
import PinModel from './pin.model';
import {
  OrderStatus,
  PAGE_NUMBER_DEFAULT,
  PAGE_SIZE_DEFAULT,
  PRODUCT_STATUS,
  PaginationParams,
  PaginationResponse,
  Product,
  ProductFormData,
  ProductImage,
  ProductStatus,
} from '@/definitions';
import {
  model,
  models,
  Schema,
  Model,
  Types,
  Document,
  SortOrder,
} from 'mongoose';

export interface ProductDB {
  name: string; // 상품명
  accessLevel: number; // 접근 레벨
  status: ProductStatus; // 상품 상태
  images: string[]; // 상품 이미지
  regularPrice: number; // 정가
  salePrice: number; // 할인가
  price: number; // 판매가
  taxFree: number; // 면세가
  description1: string;
  description2: string;
  description3: string;
  description4: string;
  unavailableDates?: Date[]; // 이용 불가능 날짜
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  pins: Types.ObjectId[]; // 빈 번호 목록
  partner?: Types.ObjectId | null; // 파트너 아이디 목록
  isLotteWorld?: boolean;
}

type ProductDocument =
  | (Document<unknown, {}, ProductDB> &
      Omit<
        ProductDB & {
          _id: Types.ObjectId;
        },
        keyof ProductMethods
      > &
      ProductMethods)
  | null;

interface ProductMethods {
  updateProduct(productData: ProductFormData<string | ProductImage>): boolean;
  addProductPin(pin: Types.ObjectId | Types.ObjectId[]): ProductDocument;
  deleteProductPin(pin: Types.ObjectId | Types.ObjectId[]): ProductDocument;
}

interface ProductSchemaModel extends Model<ProductDB, {}, ProductMethods> {
  getProductById(productId: Types.ObjectId): Promise<ProductDocument>;
  getProductList(
    paginationParams: PaginationParams & { level: string }
  ): PaginationResponse<Promise<Product[]>>;
  deleteProductById(productId: string): Promise<boolean>;
}

const schema = new Schema<ProductDB, ProductSchemaModel, ProductMethods>({
  name: { type: String, required: true },
  accessLevel: { type: Number, default: 1 },
  status: {
    type: String,
    enum: Object.values(PRODUCT_STATUS),
    default: PRODUCT_STATUS.AVAILABLE,
  },
  images: {
    type: [String],
    required: true,
  },
  regularPrice: { type: Number, required: true }, // 정가
  salePrice: { type: Number, required: true }, // 할인가
  price: { type: Number, required: true }, // 판매가
  description1: { type: String, default: '' },
  description2: { type: String, default: '' },
  description3: { type: String, default: '' },
  description4: { type: String, default: '' },
  unavailableDates: { type: [Date] }, // 예약 불가 날짜 배열
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date },
  pins: [{ type: Schema.Types.ObjectId, ref: 'Pin' }],
  partner: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  isLotteWorld: { type: Boolean, default: false },
});

schema.static('getProductById', function getProductById(productId) {
  return this.findById(productId);
});

schema.static(
  'getProductList',
  async function getProductList({
    pageNumber = PAGE_NUMBER_DEFAULT,
    pageSize = PAGE_SIZE_DEFAULT,
    filter: filterQuery = null,
    sort: sortQuery = null,
    level = 1,
  } = {}) {
    const skip = (pageNumber - 1) * pageSize;
    const filter: Record<string, any> = {
      accessLevel: { $lte: level },
    };
    const sort: { [key: string]: SortOrder } =
      sortQuery && sortQuery.order !== ''
        ? { [sortQuery.name]: sortQuery.order === 'asc' ? 1 : -1 }
        : { createdAt: -1 }; // 최신순 정렬

    if (filterQuery) {
      Object.keys(filterQuery).forEach((key) => {
        const value = filterQuery[key];
        filter[key] = { $regex: value, $options: 'i' }; // 정규식 검색 적용
      });
    }

    //삭제 데이터 제외
    filter.deletedAt = { $exists: false };

    // 총 개수 가져오기
    const totalItems = await this.countDocuments(filter);

    // // 데이터 가져오기
    // let list = (
    //   await this.find(filter).sort(sort).skip(skip).limit(pageSize)
    // ).map((d) => d.toObject()) as (ProductDB & {
    //   pinCount?: number;
    // })[];

    const list = await this.aggregate([
      { $match: filter },
      { $sort: sort as Record<string, 1 | -1> }, // 기존 정렬 조건 추가
      { $skip: skip }, // 페이지네이션 skip 추가
      { $limit: pageSize }, // 페이지네이션 limit 추가
      {
        $lookup: {
          from: 'pins',
          let: { productId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$product', '$$productId'] },
                    { $eq: ['$orderStatus', OrderStatus.Unpaid] },
                  ],
                },
              },
            },
          ],
          as: 'pins',
        },
      },
      {
        $addFields: {
          pinCount: { $size: '$pins' },
        },
      },
    ]);

    // 전체 페이지 수 계산
    const totalPages = Math.ceil(totalItems / pageSize);

    // 페이지네이션 관련 정보 계산
    const hasPreviousPage = pageNumber > 1;
    const hasNextPage = pageNumber < totalPages;
    const previousPage = hasPreviousPage ? pageNumber - 1 : null;
    const nextPage = hasNextPage ? pageNumber + 1 : null;

    return {
      list,
      pageNumber,
      pageSize,
      totalItems,
      totalPages,
      hasPreviousPage,
      hasNextPage,
      previousPage,
      nextPage,
      startIndex: skip,
      endIndex: totalItems - 1,
    };
  }
);

schema.static('deleteProductById', async function deleteProductById(productId) {
  const product = await this.getProductById(productId);
  if (!product) {
    return false;
  }

  // Unpaid 상태의 핀들 찾기
  const unpaidPins = await PinModel.find({
    product: productId,
    orderStatus: OrderStatus.Unpaid,
  });

  // 실제 핀 삭제
  await PinModel.deleteMany({
    product: productId,
    orderStatus: OrderStatus.Unpaid,
  });

  // 상품의 pins 배열에서 Unpaid 핀 제거
  product.pins = product.pins.filter(
    (pinId) => !unpaidPins.some((pin) => pin._id.equals(pinId))
  );

  // 상품 삭제 처리
  product.deletedAt = new Date();
  await product.save();

  return true;
});

schema.method('updateProduct', async function updateProduct(productData) {
  this.name = resolveData<ProductDB['name']>(productData.name, this.name);
  this.accessLevel = resolveData<ProductDB['accessLevel']>(
    productData.accessLevel,
    this.accessLevel
  );
  this.status = resolveData<ProductDB['status']>(
    productData.status,
    this.status
  );
  this.regularPrice = resolveData<ProductDB['regularPrice']>(
    productData.regularPrice,
    this.regularPrice
  );
  this.salePrice = resolveData<ProductDB['salePrice']>(
    productData.salePrice,
    this.salePrice
  );
  this.price = resolveData<ProductDB['price']>(productData.price, this.price);
  this.description1 = resolveData<ProductDB['description1']>(
    productData.description1,
    this.description1
  );
  this.description2 = resolveData<ProductDB['description2']>(
    productData.description2,
    this.description2
  );
  this.description3 = resolveData<ProductDB['description3']>(
    productData.description3,
    this.description3
  );
  this.description4 = resolveData<ProductDB['description4']>(
    productData.description4,
    this.description4
  );
  this.isLotteWorld = resolveData<ProductDB['isLotteWorld']>(
    productData.isLotteWorld,
    this.isLotteWorld
  );
  this.updatedAt = new Date();

  if (Array.isArray(productData.images)) {
    let imageDataList = [];

    for (let imageData of productData.images) {
      if (typeof imageData === 'string') {
        imageDataList.push(imageData);
      } else {
        let imageList = await uploadFile([imageData], {
          path: FILE_PATH.PRODUCT,
          type: FILE_TYPE.IMAGE,
        });

        if (Array.isArray(imageList) && imageList.length === 1) {
          imageDataList.push(imageList[0].url);
        }
      }
    }

    this.images = imageDataList;
  }

  return this.save();
});

schema.method('addProductPin', function addProductPin(pin) {
  const pinList = Array.isArray(pin) ? pin : [pin];
  this.pins = this.pins.concat(pinList);

  return this.save();
});

schema.method('deleteProductPin', function deleteProductPin(pin) {
  const pinList = Array.isArray(pin) ? pin : [pin];
  this.pins = this.pins.filter((d) => !pinList.includes(d));

  return this.save();
});

const ProductModel =
  (models.Product as ProductSchemaModel) ||
  model<ProductDB, ProductSchemaModel>('Product', schema);

export default ProductModel;
