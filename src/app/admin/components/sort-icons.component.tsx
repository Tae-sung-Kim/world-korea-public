import { SortOrder } from '../hooks/useSort';
import { BiSortAlt2, BiSortDown, BiSortUp } from 'react-icons/bi';

type SortIcon = {
  title: string;
  order: SortOrder;
};

export default function SortIcons({ title, order }: SortIcon) {
  return (
    <div className="flex justify-center">
      <span>{title}</span>
      <div className="m-1">
        {order === '' && <BiSortAlt2 />}
        {order === 'asc' && <BiSortDown />}
        {order === 'desc' && <BiSortUp />}
      </div>
    </div>
  );
}
