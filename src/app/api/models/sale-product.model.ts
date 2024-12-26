import '@/app/api/models/product.model';
import {
  OrderStatus,
  PAGE_NUMBER_DEFAULT,
  PAGE_SIZE_DEFAULT,
  PaginationParams,
  PaginationResponse,
  Pin,
  Product,
  SaleProduct,
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
import '@/app/api/models/pin.model';

export interface SaleProductDB {
  name: string; // 상품 판매명
  accessLevel: number; // 접근 레벨
  products: Types.ObjectId[]; // 상품 목록
  price: number; // 판매가
  taxFree: number; // 면세가
  isReservable: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

type SaleProductDocument =
  | (Document<unknown, {}, SaleProductDB> &
      Omit<
        SaleProductDB & {
          _id: Types.ObjectId;
        },
        keyof SaleProductMethods
      > &
      SaleProductMethods)
  | null;

interface SaleProductMethods {}

interface SaleProductSchemaModel
  extends Model<SaleProductDB, {}, SaleProductMethods> {
  getSaleProductById(
    saleProductId: Types.ObjectId
  ): Promise<SaleProductDocument | null>;
  getSaleProductList(
    paginationParams: PaginationParams & { level: string }
  ): PaginationResponse<Promise<SaleProduct[]>>;
  deleteSaleProductById(saleProductId: string): Promise<boolean>;
  getReservableSaleProductList(): Promise<SaleProductDocument[]>; // 예약 가능 판매상품 목록 반환
}

const schema = new Schema<
  SaleProductDB,
  SaleProductSchemaModel,
  SaleProductMethods
>({
  name: { type: String, required: true },
  accessLevel: { type: Number, default: 1 },
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  price: { type: Number, required: true },
  taxFree: { type: Number, default: 0 },
  isReservable: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date },
});

schema.static('getSaleProductById', function getSaleProductById(saleProductId) {
  return this.findById(saleProductId);
});

schema.static(
  'getSaleProductList',
  async function getSaleProductList({
    pageNumber = PAGE_NUMBER_DEFAULT,
    pageSize = PAGE_SIZE_DEFAULT,
    filter: filterQuery = null,
    level = 1,
  } = {}) {
    const skip = (pageNumber - 1) * pageSize;
    const filter: Record<string, any> = {
      accessLevel: { $lte: level },
    };
    const sort = { createdAt: -1 as SortOrder }; // 최신순 정렬

    if (filterQuery) {
      Object.keys(filterQuery).forEach((key) => {
        const value = filterQuery[key];
        filter[key] = { $regex: value, $options: 'i' }; // 정규식 검색 적용
      });
    }

    // 총 개수 가져오기
    const totalItems = await this.countDocuments(filter);

    // 데이터 가져오기
    let list = (
      await this.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(pageSize)
        .populate({
          path: 'products',
          select: '_id name images pins',
          populate: {
            path: 'pins',
            select: '_id orderStatus',
          },
        })
    ).map((d) => d.toObject()) as (SaleProductDB & {
      products: {
        _id: string;
        name: string;
        images: string[];
        pins: Pin[];
        pinCount: number;
      }[];
    })[];

    list.forEach((d) => {
      (
        d.products as {
          _id: string;
          name: string;
          images: string[];
          pins?: Pin[];
          pinCount?: number;
        }[]
      ).forEach((dd) => {
        dd.pins = dd.pins?.filter(({ orderStatus }) => {
          return orderStatus === OrderStatus.Unpaid;
        });

        dd.pinCount = dd.pins ? dd.pins.length : 0;
        delete dd.pins;
      });
    });

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

schema.static(
  'deleteSaleProductById',
  async function deleteSaleProductById(productId) {
    const product = await this.getSaleProductById(productId);
    if (!product) {
      return false;
    }

    product.deletedAt = new Date();
    await product.save();

    return true;
  }
);

schema.static(
  'getReservableSaleProductList',
  function getReservableSaleProductList() {
    return this.find({ isReservable: true });
  }
);

const SaleProductModel =
  (models.SaleProduct as SaleProductSchemaModel) ||
  model<SaleProductDB, SaleProductSchemaModel>('SaleProduct', schema);

export default SaleProductModel;
