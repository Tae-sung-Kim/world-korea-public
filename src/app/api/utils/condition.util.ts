/**
 *
 *
 */
export function resolveData<T>(newData: T | undefined, data: T): T {
  return newData !== undefined ? newData : data;
}
