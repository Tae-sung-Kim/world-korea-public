import { model, models, Schema, Model, Types } from 'mongoose';

export interface PinDB {
  number: string;
  product: Types.ObjectId;
  endDate?: Date;
  useDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

interface PinMethods {}

interface PinSchemaModel extends Model<PinDB, {}, PinMethods> {}

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
  useDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date },
});

const Pin =
  (models.Pin as PinSchemaModel) || model<PinDB, PinSchemaModel>('Pin', schema);

export default Pin;
