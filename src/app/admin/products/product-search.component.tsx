import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import qs from 'qs';
import { ChangeEvent, useState } from 'react';

export default function ProductSearchComponent() {
  const [value, setValue] = useState('');

  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const pageSize = Number(searchParams.get('pageSize') ?? 5);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleSearchClick = () => {
    const filter = {
      name: value,
    };
    const params = qs.stringify({ pageNumber: 1, pageSize, filter });

    router.push(pathName + '?' + params);
  };

  return (
    <div className="flex">
      <Input value={value} name="name" onChange={handleInputChange} />
      <Button type="button" onClick={handleSearchClick}>
        검색
      </Button>
    </div>
  );
}
