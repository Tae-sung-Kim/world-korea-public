import { NextRequest, NextResponse } from 'next/server';
import { OrderStatus } from '@/definitions';
import OrderModel from '../../../models/order.model';
import connectMongo from '@/app/api/libs/database';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectMongo();
    
    const order = await OrderModel.findOne({ _id: params.id });
    if (!order) {
      return NextResponse.json(
        { message: '주문을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const isPaid = order.status === OrderStatus.Completed;
    return NextResponse.json({ isPaid });
  } catch (error) {
    console.error('Error getting order status:', error);
    return NextResponse.json(
      { message: '주문 상태 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
