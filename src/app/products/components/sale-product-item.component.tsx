import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PackageDetailName, SaleProductFormData } from '@/definitions';
import { Label } from '@radix-ui/react-label';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';

type Props = {
  saleProduct: SaleProductFormData<PackageDetailName>;
  onPlusClick: () => void;
  onMinusClick: () => void;
  onDeleteClick: () => void;
};

export default function SaleProductItem({
  saleProduct,
  onPlusClick,
  onMinusClick,
  onDeleteClick,
}: Props) {
  return (
    <div key={saleProduct._id} className="space-y-1 space-x-1">
      <Label>{saleProduct.name}</Label>
      <Input type="number" className="w-16" />
      <Button size="icon" variant="outline" type="button" onClick={onPlusClick}>
        <FaPlus />
      </Button>
      <Button
        size="icon"
        variant="outline"
        type="button"
        onClick={onMinusClick}
      >
        <FaMinus />
      </Button>
      <Button
        size="icon"
        variant="outline"
        type="button"
        onClick={onDeleteClick}
      >
        <RiDeleteBin6Line />
      </Button>
    </div>
  );
}
