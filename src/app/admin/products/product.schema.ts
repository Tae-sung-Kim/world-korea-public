import { removeComma } from '@/utils/number';
import { z } from 'zod';

export const priceShcema = () => {
  return z.string().refine((d) => removeComma(d) > 0, {
    message: '0보다 큰 금액을 입력해주세요.',
  });
};

export const descriptionShcema = () => {
  return z.string().optional();
};
