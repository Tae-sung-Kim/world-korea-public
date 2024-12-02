import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import qs from 'qs';
import { ChangeEvent, KeyboardEvent, useState } from 'react';
import { FaSearch } from 'react-icons/fa';

export default function SaleProductSearch() {
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
    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-5 items-start md:items-center m-5">
      <Label className="">상품명</Label>
      <Input
        value={value}
        name="name"
        className="w-full md:w-64"
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />

      <Button
        type="button"
        variant="secondary"
        size="icon"
        onClick={handleSearchClick}
      >
        <FaSearch />
      </Button>
    </div>
  );
}
