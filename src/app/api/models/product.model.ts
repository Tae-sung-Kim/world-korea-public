import { resolveData } from '../utils/condition.util';
import { PRODUCT_STATUS, ProductStatus } from '@/definitions';
import { model, models, Schema, Model, Types } from 'mongoose';

export interface ProductDB {
  name: string; // 상품명
  accessLevel: number; // 접근 레벨
  status: ProductStatus; // 상품 상태
  images: string[]; // 상품 이미지
  regularPrice: number; // 정가
  salePrice: number; // 할인가
  price: number; // 판매가
  description1: string;
  description2: string;
  description3: string;
  description4: string;
  unavailableDates?: Date[]; // 이용 불가능 날짜
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  pins: string[]; // 빈 번호 목록
}

interface ProductMethods {
  updateProduct(productData: ProductDB): boolean;
}

interface ProductSchemaModel extends Model<ProductDB, {}, ProductMethods> {}

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
  pins: [{ type: Types.ObjectId, ref: 'Pin' }],
});

schema.method('updateProduct', function updateProduct(productData) {
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
  this.updatedAt = new Date();

  return this.save();
});

const Product =
  (models.Product as ProductSchemaModel) ||
  model<ProductDB, ProductSchemaModel>('Product', schema);

export default Product;
