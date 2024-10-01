import {
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
  pins: Types.ObjectId[]; // 빈 아이디 목록
  quantity: number;
  totalPrice: number;
  user: Types.ObjectId; // User ID 참조
  status: OrderStatus;
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

interface OrderSchemaModel extends Model<OrderDB, {}, OrderMethods> {}

const schema = new Schema<OrderDB, OrderSchemaModel, OrderMethods>({
  saleProduct: {
    type: Schema.Types.ObjectId,
    ref: 'SaleProduct',
  },
  pins: [{ type: Schema.Types.ObjectId, ref: 'Pin' }],
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
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  orderDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date },
});

const OrderModel =
  (models.Order as OrderSchemaModel) ||
  model<OrderDB, OrderSchemaModel>('Order', schema);

export default OrderModel;
