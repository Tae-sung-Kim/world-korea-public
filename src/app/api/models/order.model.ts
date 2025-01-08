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
  PipelineStage,
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
  payType: string;
  paymentId: string;
  merchantId: string;
  orderDate: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  visitDate: Date;
  refundedAt: Date;
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
    paginationParams: PaginationParams,
    userId?: string
  ): PaginationResponse<Promise<Order[]>>;
  getPartnerOrderList(
    paginationParams: PaginationParams,
    userId?: string
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
  payType: { type: String },
  paymentId: { type: String },
  merchantId: { type: String },
  orderDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date },
  visitDate: { type: Date },
  refundedAt: { type: Date },
});

schema.static(
  'getOrderList',
  async function getOrderList(
    {
      pageNumber = PAGE_NUMBER_DEFAULT,
      pageSize = PAGE_SIZE_DEFAULT,
      filter: filterQuery = null,
      sort: sortQuery = null,
    } = {},
    userId
  ) {
    const skip = (pageNumber - 1) * pageSize;
    const filter: Record<string, any> = {};
    const sort: { [key: string]: SortOrder } =
      sortQuery && sortQuery.order !== ''
        ? { [sortQuery.name]: sortQuery.order === 'asc' ? 1 : -1 }
        : { createdAt: -1 }; // 최신순 정렬

    const nestedFilters: Record<string, any> = {};
    if (filterQuery) {
      Object.keys(filterQuery).forEach((key) => {
        const value = filterQuery[key];

        // 중첩된 필드와 일반 필드 분리
        if (key.includes('.')) {
          // 중첩 필드는 별도로 처리
          if (typeof value === 'object' && value !== null) {
            nestedFilters[key] = value;
          } else {
            nestedFilters[key] = { $regex: value, $options: 'i' };
          }
        } else {
          // 일반 필드 처리
          if (typeof value === 'object' && value !== null) {
            filter[key] = value;
          } else {
            filter[key] = { $regex: value, $options: 'i' };
          }
        }
      });
    }

    if (userId) {
      filter.user = userId;
    }

    // 총 개수 가져오기 (Aggregation Pipeline 사용)
    const countPipeline: PipelineStage[] = [
      { $match: filter }, // 기본 필터 조건 적용
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $lookup: {
          from: 'saleproducts',
          localField: 'saleProduct',
          foreignField: '_id',
          as: 'saleProduct',
        },
      },
      { $unwind: { path: '$saleProduct', preserveNullAndEmptyArrays: true } },
    ];

    // 중첩된 필드에 대한 필터 추가
    if (Object.keys(nestedFilters).length > 0) {
      countPipeline.push({ $match: nestedFilters });
    }

    const totalItemsResult = await this.aggregate([
      ...countPipeline,
      { $count: 'total' },
    ]);

    const totalItems = totalItemsResult[0]?.total || 0;

    const aggregationPipeline: PipelineStage[] = [
      ...countPipeline, // 카운트 파이프라인과 동일한 초기 스테이지 사용
      {
        $addFields: {
          user: {
            $mergeObjects: [
              {
                _id: '$user._id',
                name: '$user.name',
                companyName: '$user.companyName',
              },
            ],
          },
          saleProduct: {
            $mergeObjects: [
              {
                _id: '$saleProduct._id',
                name: '$saleProduct.name',
              },
            ],
          },
        },
      },
    ];

    // 정렬과 페이지네이션 추가
    aggregationPipeline.push(
      { $sort: sort as Record<string, 1 | -1> },
      { $skip: skip },
      { $limit: pageSize }
    );

    const list = await this.aggregate(aggregationPipeline);
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
  'getPartnerOrderList',
  async function getPartnerOrderList(
    {
      pageNumber = PAGE_NUMBER_DEFAULT,
      pageSize = PAGE_SIZE_DEFAULT,
      filter: filterQuery = null,
      sort: sortQuery = null,
    } = {},
    userId
  ) {
    const skip = (pageNumber - 1) * pageSize;
    const filter: Record<string, any> = {};
    const sort: { [key: string]: SortOrder } =
      sortQuery && sortQuery.order !== ''
        ? { [sortQuery.name]: sortQuery.order === 'asc' ? 1 : -1 }
        : { createdAt: -1 }; // 최신순 정렬

    const nestedFilters: Record<string, any> = {};
    if (filterQuery) {
      Object.keys(filterQuery).forEach((key) => {
        const value = filterQuery[key];

        // 중첩된 필드와 일반 필드 분리
        if (key.includes('.')) {
          // 중첩 필드는 별도로 처리
          if (typeof value === 'object' && value !== null) {
            nestedFilters[key] = value;
          } else {
            nestedFilters[key] = { $regex: value, $options: 'i' };
          }
        } else {
          // 일반 필드 처리
          if (typeof value === 'object' && value !== null) {
            filter[key] = value;
          } else {
            filter[key] = { $regex: value, $options: 'i' };
          }
        }
      });
    }

    // 총 개수 가져오기 (Aggregation Pipeline 사용)
    const countPipeline: PipelineStage[] = [
      { $match: filter }, // 기본 필터 조건 적용
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $lookup: {
          from: 'saleproducts',
          localField: 'saleProduct',
          foreignField: '_id',
          as: 'saleProduct',
        },
      },
      { $unwind: { path: '$saleProduct', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'products',
          localField: 'saleProduct.products', // saleProduct의 products 배열 참조
          foreignField: '_id',
          as: 'product',
        },
      },
    ];

    // 중첩된 필드에 대한 필터 추가
    if (Object.keys(nestedFilters).length > 0) {
      countPipeline.push({ $match: nestedFilters });
    }

    const totalItemsResult = await this.aggregate([
      ...countPipeline,
      { $count: 'total' },
    ]);

    const totalItems = totalItemsResult[0]?.total || 0;

    const aggregationPipeline: PipelineStage[] = [
      ...countPipeline, // 카운트 파이프라인과 동일한 초기 스테이지 사용
      {
        $addFields: {
          user: {
            $mergeObjects: [
              {
                _id: '$user._id',
                name: '$user.name',
                companyName: '$user.companyName',
              },
            ],
          },
          saleProduct: {
            $mergeObjects: [
              {
                _id: '$saleProduct._id',
                name: '$saleProduct.name',
              },
            ],
          },

          product: {
            $let: {
              vars: {
                filteredProducts: {
                  $filter: {
                    input: '$product',
                    as: 'prod',
                    cond: { $eq: ['$$prod.partner', userId] },
                  },
                },
              },
              in: {
                $map: {
                  input: '$$filteredProducts',
                  as: 'product',
                  in: {
                    _id: '$$product._id',
                    name: '$$product.name',
                    partner: '$$product.partner',
                    // 필요한 다른 제품 정보 추가
                  },
                },
              },
            },
          },
        },
      },
    ];

    // 정렬과 페이지네이션 추가
    aggregationPipeline.push(
      { $sort: sort as Record<string, 1 | -1> },
      { $skip: skip },
      { $limit: pageSize }
    );

    const list = await this.aggregate(aggregationPipeline);
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
