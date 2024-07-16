export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

type HttpStatusKeys = keyof typeof HTTP_STATUS;
export type HttpStatusValues = (typeof HTTP_STATUS)[HttpStatusKeys];

export const HTTP_STATUS_MESSAGES: Record<HttpStatusValues, string> = {
  200: 'OK',
  201: 'Created',
  204: 'No Content',
  400: 'Bad Request',
  401: 'Authentication required',
  403: 'Forbidden',
  404: 'Not Found',
  500: 'Internal Server Error',
};
