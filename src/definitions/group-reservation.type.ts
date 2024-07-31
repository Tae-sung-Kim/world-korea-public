//단체 예약
export type GroupReservationItemProduct = {
  productId: string;
  productName: string;
};

export type GroupReservationItem = {
  personType: string;
  peopleCount: string;
  reserveDate: Date;
  reserveProduct: Array<GroupReservationItemProduct>;
  reserverName: string;
  reserverTel: string;
};
