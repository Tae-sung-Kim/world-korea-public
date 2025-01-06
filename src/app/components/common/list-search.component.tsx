import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChangeEvent, KeyboardEvent } from 'react';
import { FaSearch } from 'react-icons/fa';

type searchProps = {
  value: string;
  placeholder?: string;
  title?: string;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  onSearchClick: () => void;
};

export default function ListSearchComponent({
  value,
  title = '상품명',
  placeholder = '상품명을 입력하세요.',
  onInputChange,
  onKeyDown,
  onSearchClick,
}: searchProps) {
  return (
    <div className="search-container">
      <div className="search-wrapper">
        <div className="search-content">
          <Label className="min-w-20 text-sm font-medium text-gray-900">
            {title}
          </Label>
          <div className="flex-1 w-full sm:w-auto">
            <Input
              value={value}
              name="name"
              className="w-full sm:w-[300px]"
              placeholder={placeholder}
              onChange={onInputChange}
              onKeyDown={onKeyDown}
            />
          </div>
          <Button onClick={onSearchClick} variant="search">
            <FaSearch className="icon-search" />
            검색
          </Button>
        </div>
      </div>
    </div>
  );
}
