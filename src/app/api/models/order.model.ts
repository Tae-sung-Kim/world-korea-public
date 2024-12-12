import {
  Order,
  OrderStatus,
  PAGE_NUMBER_DEFAULT,
  PAGE_SIZE_DEFAULT,
  PaginationParams,
  PaginationResponse,
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

export interface OrderDB extends Document {
  saleProduct: Types.ObjectId; // SaleProduct ID 참조
  tickets: [
    {
      pins: Types.ObjectId[];
      shortId: string;
    }
  ];
  quantity: number;
  totalPrice: number;
  user: Types.ObjectId; // User ID 참조
  shortId: string; // shortId
  status: OrderStatus;
  paymentId: string;
  merchantId: string;
  orderDate: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

type OrderDocument =
  | (Document<unknown, {}, OrderDB> &
      Omit<
        OrderDB & {
          _id: Types.ObjectId;
        },
        keyof OrderMethods
      > &
      OrderMethods)
  | null;

interface OrderMethods {}

interface OrderSchemaModel extends Model<OrderDB, {}, OrderMethods> {
  getOrderList(
    paginationParams: PaginationParams
  ): PaginationResponse<Promise<Order[]>>;
  checkShortIdExists(shortId: string): Promise<boolean>; // shortUrl 이 이미 있는지 여부 반환
  getOrderByShortId(shortId: string): Promise<OrderDocument | null>;
  getSaleProductIdByShortId(shortId: string): Promise<string | null>;
}

const schema = new Schema<OrderDB, OrderSchemaModel, OrderMethods>({
  saleProduct: {
    type: Schema.Types.ObjectId,
    ref: 'SaleProduct',
  },
  tickets: [
    {
      shortId: String,
      pins: [{ type: Schema.Types.ObjectId, ref: 'Pin' }],
    },
  ],
  quantity: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(OrderStatus),
    default: OrderStatus.Pending,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  paymentId: { type: String },
  merchantId: { type: String },
  orderDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date },
});

schema.static(
  'getOrderList',
  async function getOrderList({
    pageNumber = PAGE_NUMBER_DEFAULT,
    pageSize = PAGE_SIZE_DEFAULT,
    filter: filterQuery = null,
  } = {}) {
    const skip = (pageNumber - 1) * pageSize;
    const filter: Record<string, any> = {
      // accessLevel: { $lte: level },
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
          path: 'user',
          select: '_id name companyName',
        })
        .populate({
          path: 'saleProduct',
          select: '_id name',
        })
    ).map((d) => d.toObject());

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

schema.static('checkShortIdExists', async function checkShortIdExists(shortId) {
  const exists = await this.exists({ 'tickets.shortId': shortId });
  return exists;
});

schema.static('getOrderByShortId', function getOrderByShortId(shortId) {
  return this.findOne({ 'tickets.shortId': shortId });
});

schema.static(
  'getSaleProductIdByShortId',
  async function getSaleProductIdByShortId(shortId) {
    const orderData: OrderDocument | null = await this.findOne({
      'tickets.shortId': shortId,
    });
    if (!orderData) {
      return null;
    }

    return orderData.saleProduct;
  }
);

const OrderModel =
  (models.Order as OrderSchemaModel) ||
  model<OrderDB, OrderSchemaModel>('Order', schema);

export default OrderModel;
