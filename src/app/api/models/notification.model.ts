import {
  model,
  models,
  Schema,
  Model,
  Types,
  SortOrder,
  Document,
} from 'mongoose';

export interface NotificationDB {
  title: string;
  image: string;
  createdAt?: Date;
}

type NotificationDocument =
  | (Document<unknown, {}, NotificationDB> &
      Omit<
        NotificationDB & {
          _id: Types.ObjectId;
        },
        keyof NotificationMethods
      > &
      NotificationMethods)
  | null;

interface NotificationMethods {}

interface NotificationSchemaModel
  extends Model<NotificationDB, {}, NotificationMethods> {}

const schema = new Schema<
  NotificationDB,
  NotificationSchemaModel,
  NotificationMethods
>({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },

  createdAt: { type: Date, default: Date.now },
});

const Notification =
  (models.Notification as NotificationSchemaModel) ||
  model<NotificationDB, NotificationSchemaModel>('Notification', schema);

export default Notification;
