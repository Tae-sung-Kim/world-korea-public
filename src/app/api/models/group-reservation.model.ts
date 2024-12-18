// 단체예약

import {
  PAGE_NUMBER_DEFAULT,
  PAGE_SIZE_DEFAULT,
  PaginationParams,
  PaginationResponse,
  GroupReservation,
} from '@/definitions';
import {
  model,
  models,
  Schema,
  Model,
  Types,
  SortOrder,
  Document,
} from 'mongoose';

export interface GroupReservationDB {
  customData: Record<string, unknown>;
  usedAt: Date;
  phoneNumber: string;
  name: string;
  createdAt?: Date;
}

type GroupReservationDocument =
  | (Document<unknown, {}, GroupReservationDB> &
      Omit<
        GroupReservationDB & {
          _id: Types.ObjectId;
        },
        keyof GroupReservationMethods
      > &
      GroupReservationMethods)
  | null;

interface GroupReservationMethods {}

interface GroupReservationSchemaModel
  extends Model<GroupReservationDB, {}, GroupReservationMethods> {
  getGroupReservationList(
    paginationParams: PaginationParams // & { level: string }
  ): PaginationResponse<Promise<GroupReservation[]>>;
}

const schema = new Schema<
  GroupReservationDB,
  GroupReservationSchemaModel,
  GroupReservationMethods
>({
  customData: {
    type: Object,
    default: {},
  },
  usedAt: { type: Date },
  name: { type: String },
  phoneNumber: { type: String },
  createdAt: { type: Date, default: Date.now },
});

schema.static(
  'getGroupReservationList',
  async function getGroupReservationList({
    pageNumber = PAGE_NUMBER_DEFAULT,
    pageSize = PAGE_SIZE_DEFAULT,
    // filter: filterQuery = null,
    // level = 1,
  }) {
    const skip = (pageNumber - 1) * pageSize;
    const filter: Record<string, any> = {
      // accessLevel: { $lte: level },
    };
    const sort = { createdAt: -1 as SortOrder }; // 최신순 정렬

    // if (filterQuery) {
    //   Object.keys(filterQuery).forEach((key) => {
    //     const value = filterQuery[key];
    //     filter[key] = { $regex: value, $options: 'i' }; // 정규식 검색 적용
    //   });
    // }

    // 총 개수 가져오기
    const totalItems = await this.countDocuments(filter);

    // 데이터 가져오기
    let list = (
      await this.find(filter).sort(sort).skip(skip).limit(pageSize)
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

const GroupReservationModel =
  (models.GroupReservation as GroupReservationSchemaModel) ||
  model<GroupReservationDB, GroupReservationSchemaModel>(
    'GroupReservation',
    schema
  );

export default GroupReservationModel;
