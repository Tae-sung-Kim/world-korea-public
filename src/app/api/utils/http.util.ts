import {
  HTTP_STATUS_MESSAGES,
  HttpStatusValues,
} from '@/definitions/http.constant';
import { NextResponse } from 'next/server';

export function createResponse(status: HttpStatusValues) {
  return NextResponse.json(
    {
      message: HTTP_STATUS_MESSAGES[status],
    },
    {
      status,
    }
  );
}
