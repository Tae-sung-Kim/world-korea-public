import {
  HTTP_STATUS_MESSAGES,
  HttpStatusValues,
} from '@/definitions/http.constant';
import { NextResponse } from 'next/server';

export function createResponse(
  status: HttpStatusValues,
  message?: string,
  data?: any
) {
  return NextResponse.json(
    {
      message: message || HTTP_STATUS_MESSAGES[status],
      data,
    },
    {
      status,
    }
  );
}
