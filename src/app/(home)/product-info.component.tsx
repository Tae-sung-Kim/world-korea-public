import { addComma } from '@/utils/number';

type Props = {
  name: string;
  price: number;
};

export default function ProductInfo({ name, price }: Props) {
  return (
    <div>
      <div className="text-lg font-medium">{name}</div>
      <div className="text-gray-500 mt-1 tracking-wide">₩{addComma(price)}</div>
    </div>
  );
}
