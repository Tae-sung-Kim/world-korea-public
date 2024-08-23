import { Pin } from '@/definitions/pins.type';
import { model, models, Schema, Model, Types } from 'mongoose';

export interface PinDB {
  number: string;
  product: Types.ObjectId;
  endDate?: Date;
  usedDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

interface PinMethods {}

interface PinSchemaModel extends Model<PinDB, {}, PinMethods> {
  getPinList(): Promise<Pin>; // 핀 목록 반환
  getPinById(pinId: string): Promise<Pin>;  // 핀 상세 반환
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

schema.static('getPinList', function getPinList() {
  return this.find({}).populate('product');
});

schema.static('getPinById', function getPinById(pinId) {
  return this.findOne({ _id: pinId }).populate('product');
});

const Pin =
  (models.Pin as PinSchemaModel) || model<PinDB, PinSchemaModel>('Pin', schema);

export default Pin;
