import { PaginationResponse } from '@/definitions';
import {
  PAGE_NUMBER_DEFAULT,
  PAGE_SIZE_DEFAULT,
} from '@/definitions/pagination.constant';
import { PaginationParams } from '@/definitions/pagination.type';
import { Pin } from '@/definitions/pins.type';
import { model, models, Schema, Model, Types, SortOrder, Document } from 'mongoose';

export interface PinDB {
  number: string;
  product: Types.ObjectId;
  endDate?: Date;
  usedDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

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
  getPinList(paginationParams: PaginationParams): Promise<PaginationResponse<Pin[]>>; // 핀 목록 반환
  getPinById(pinId: string): Promise<Pin>;  // 핀 상세 반환
  updateUsedDatePin(pinId: string, used: boolean): Promise<boolean>; // 빈 사용날짜 수정
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
  endDate: { type: Date },
  usedDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date },
});

schema.static('getPinList', async function getPinList({ pageNumber = PAGE_NUMBER_DEFAULT, pageSize = PAGE_SIZE_DEFAULT } = {}){
  const skip = (pageNumber - 1) * pageSize;
  const filter = {}
  const sort = { createdAt: -1 as SortOrder }; // 최신순 정렬
  
  // 총 개수 가져오기
  const totalItems = await this.countDocuments(filter);

  // 데이터 가져오기
  const list = await this.find(filter).sort(sort).skip(skip).limit(pageSize).populate('product');

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
  
});

schema.static('getPinById', function getPinById(pinId) {
  return this.findOne({ _id: pinId }).populate('product');
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
      new: true,
      runValidators: true,
    }
  );

  return !!newPin;
});

const Pin =
  (models.Pin as PinSchemaModel) || model<PinDB, PinSchemaModel>('Pin', schema);

export default Pin;
