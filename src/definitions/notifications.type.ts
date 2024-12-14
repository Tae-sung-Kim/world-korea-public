export interface NotificationForm<T> {
  title: string;
  image: T;
}

export interface NotificationDisplayData<T> extends NotificationForm<T> {
  _id?: string;
  createAt?: Date | string;
}
