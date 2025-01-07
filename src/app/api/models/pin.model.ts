import ProductModel from './product.model';
import { OrderStatus, PaginationResponse } from '@/definitions';
import {
  PAGE_NUMBER_DEFAULT,
  PAGE_SIZE_DEFAULT,
} from '@/definitions/pagination.constant';
import { PaginationParams } from '@/definitions/pagination.type';
import type { Pin } from '@/definitions/pin.type';
import {
  model,
  models,
  Schema,
  Model,
  Types,
  SortOrder,
  Document,
  PipelineStage,
} from 'mongoose';

export interface PinDB {
  number: string;
  product: Types.ObjectId;
  orderStatus: OrderStatus;
  saleProduct?: Types.ObjectId;
  order?: Types.ObjectId;
  endDate?: Date;
  usedDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

type GetPinListParams = {
  partnerProducts?: string[];
};

type PinDocument =
  | (Document<unknown, {}, PinDB> &
      Omit<
        PinDB & {
          _id: Types.ObjectId;
        },
        keyof PinMethods
      > &
      PinMethods)
  | null;

interface PinMethods {}

interface PinSchemaModel extends Model<PinDB, {}, PinMethods> {
  getPinList(
    paginationParams: PaginationParams,
    getPinListParams?: GetPinListParams
  ): Promise<PaginationResponse<Pin[]>>; // 핀 목록 반환
  getPinById(pinId: string): Promise<Pin>; // 핀 상세 반환
  getPinByNumber(pinNumber: string): Promise<Pin>; // 핀 상세 반환
  updateUsedDatePin(pinId: string, used: boolean): Promise<boolean>; // 빈 사용날짜 수정
  updateUsedDatePinNumberList(
    pinList: [string],
    used: boolean
  ): Promise<boolean>; // 빈 사용날짜 수정
  checkShortIdExists(shortId: string): Promise<boolean>; // shortId 이 이미 있는지 여부 반환
  getPinByShortId(shortId: string): Promise<PinDocument | null>;
}

const schema = new Schema<PinDB, PinSchemaModel, PinMethods>({
  number: {
    type: String,
    required: true,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
  },
  saleProduct: {
    type: Schema.Types.ObjectId,
    ref: 'SaleProduct',
  },
  order: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
  },
  orderStatus: {
    type: String,
    enum: Object.values(OrderStatus),
    default: OrderStatus.Unpaid,
  },
  endDate: { type: Date },
  usedDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date },
});

schema.static(
  'getPinList',
  async function getPinList(
    {
      pageNumber = PAGE_NUMBER_DEFAULT,
      pageSize = PAGE_SIZE_DEFAULT,
      filter: filterQuery = null,
      sort: sortQuery = null,
    } = {},
    { partnerProducts = null } = {}
  ) {
    const skip = (pageNumber - 1) * pageSize;
    const filter: Record<string, any> = {};
    const sort: { [key: string]: SortOrder } =
      sortQuery && sortQuery.order !== ''
        ? { [sortQuery.name]: sortQuery.order === 'asc' ? 1 : -1 }
        : { createdAt: -1 }; // 최신순 정렬

    if (Array.isArray(partnerProducts)) {
      filter['product'] = { $in: partnerProducts };
    }

    const { name } = filterQuery ?? {};

    // 상품명 검색 조건 추가
    if (name) {
      const products = await ProductModel.find({
        name: { $regex: name, $options: 'i' },
      }).select('_id');

      const productIds = products.map((p: { _id: Types.ObjectId }) => p._id);
      // 검색된 상품이 없는 경우 빈 배열로 설정하여 결과가 없도록 함
      filter['product'] =
        productIds.length > 0
          ? {
              $in: Array.from(
                new Set([...(filter['product']?.$in || []), ...productIds])
              ),
            }
          : { $in: [] };
    }

    // 총 개수 가져오기
    const totalItems = await this.countDocuments(filter);

    const aggregationPipeline: PipelineStage[] = [
      { $match: filter }, // 필터 조건 적용
      {
        $lookup: {
          from: 'products',
          localField: 'product',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: '$product' }, // product 배열을 평탄화
      {
        $lookup: {
          from: 'users',
          localField: 'product.partner',
          foreignField: '_id',
          as: 'partner',
        },
      },
      { $unwind: { path: '$partner', preserveNullAndEmptyArrays: true } },
      { $sort: sort as Record<string, 1 | -1> }, // 정렬
      { $skip: skip },
      {
        $addFields: {
          product: {
            $mergeObjects: [
              {
                _id: '$product._id',
                name: '$product.name',
                status: '$product.status',
                images: '$product.images',
                partner: '$product.partner',
              },
            ],
          },
          partner: {
            $mergeObjects: [
              {
                _id: '$partner._id',
                name: '$partner.name',
                contactNumber: '$partner.contactNumber',
                companyName: '$partner.companyName',
                phoneNumber: '$partner.phoneNumber',
                companyNo: '$partner.companyNo',
                partnerProducts: '$partner.partnerProducts',
              },
            ],
          },
        },
      },
      { $limit: pageSize },
    ];

    const list = await this.aggregate(aggregationPipeline);

    // // 데이터 가져오기
    // const list = await this.find(filter)
    //   .sort(sort)
    //   .skip(skip)
    //   .limit(pageSize)
    //   .populate({
    //     path: 'product',
    //     select: '_id name status images',
    //   });

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

schema.static('getPinById', function getPinById(pinId) {
  return this.findOne({ _id: pinId }).populate('product');
});

/**
 * 번호로 핀 데이터 반환
 */
schema.static('getPinByNumber', function getPinByNumber(pinNumber) {
  return this.findOne({ number: pinNumber });
});

schema.static('updateUsedDatePin', async function updateUsedDatePin(id, used) {
  const newPin = await this.findByIdAndUpdate(
    id,
    {
      $set: {
        usedDate: used ? new Date() : null,
      },
    },
    {
      runValidators: true,
    }
  );

  return !!newPin;
});

/**
 * 핀 번호 목록으로 핀 사용날짜 설정
 * - 유효성 체크는 함수 사용 전에 진행
 *
 */
schema.static(
  'updateUsedDatePinNumberList',
  async function updateUsedDatePinNumberList(pinNumberList, used) {
    const newPin = await this.updateMany(
      { number: { $in: pinNumberList } },
      {
        $set: {
          usedDate: used ? new Date() : null,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return true;
  }
);

/**
 * 핀 상태 변경 (결제 중)
 */
schema.static(
  'updatePendingPinIdList',
  async function updatePendingPinList(pinIdList) {}
);

const Pin =
  (models.Pin as PinSchemaModel) || model<PinDB, PinSchemaModel>('Pin', schema);

export default Pin;
