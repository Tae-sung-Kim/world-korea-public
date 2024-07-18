import { PRODUCT_STATUS } from '@/constants';
import { ProductStatus } from '@/types/product';
import { model, models, Schema, Model, Types } from 'mongoose';

export interface Product {
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
}

interface ProductMethods {}

interface ProductModel extends Model<Product, {}, ProductMethods> {}

const schema = new Schema<Product>({
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
});

const Product =
  (models.Product as ProductModel) ||
  model<Product, ProductModel>('Product', schema);

export default Product;
