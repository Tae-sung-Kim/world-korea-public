import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import qs from 'qs';
import { ChangeEvent, KeyboardEvent, useState } from 'react';
import { FaSearch } from 'react-icons/fa';

export default function ProductSearch() {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const [value, setValue] = useState(
    searchParams.getAll('filter[name]').toString() ?? ''
  );

  const pageSize = Number(searchParams.get('pageSize') ?? 10);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value);
    if (e.key === 'Enter' || e.key.toLocaleLowerCase() === 'enter') {
      //엔터일경우 현재값으로 조회
      handleSearchClick();
    }
  };

  const handleSearchClick = () => {
    const filter = {
      name: value,
    };
    const params = qs.stringify({ pageNumber: 1, pageSize, filter });

    router.push(pathName + '?' + params);
  };

  return (
    <div className="search-container">
      <div className="search-wrapper">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
          <Label className="min-w-20 text-sm font-medium text-gray-900">
            상품명
          </Label>
          <div className="flex-1 w-full sm:w-auto">
            <Input
              value={value}
              name="name"
              className="w-full sm:w-[300px]"
              placeholder="상품명을 입력하세요"
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
          </div>
          <Button onClick={handleSearchClick} variant="search">
            <FaSearch className="icon-search" />
            검색
          </Button>
        </div>
      </div>
    </div>
  );
}
