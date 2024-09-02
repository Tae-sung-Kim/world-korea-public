import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { SearchParams } from '@/definitions/pins.type';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export type Pagination = {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  onMovePage: (pageNumber: number) => void;
  onPrevPage: () => void;
  onNextPage: () => void;
};

export default function Paginations({
  pageNumber = 1,
  pageSize = 10,
  totalPages = 0,
  onMovePage,
  onPrevPage,
  onNextPage,
}: Pagination) {
  const searchParams = useSearchParams();

  const router = useRouter();
  const pathName = usePathname();

  const [queryParams, setQueryParams] = useState<SearchParams>({
    pageNumber,
    pageSize,
  });

  const handlePrevPage = () => {
    onPrevPage && onPrevPage();
  };

  const handleNextPage = () => {
    onNextPage && onNextPage();
  };

  const handleMovePage = (pageNumber: number) => {
    onMovePage && onMovePage(pageNumber);
  };

  useEffect(() => {
    setQueryParams((prevData) => ({
      ...prevData,
      pageNumber,
      pageSize,
    }));
  }, [pageNumber, pageSize]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    Object.keys(queryParams).forEach((key) => {
      if (queryParams[key]) {
        params.set(key, String(queryParams[key]));
        // } else {
        //   params.delete(key);
      }
    });

    router.push(pathName + '?' + params.toString());
  }, [router, pathName, searchParams, queryParams]);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" onClick={handlePrevPage} />
        </PaginationItem>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((d) => {
          return (
            <PaginationItem key={`paginations-${d}`}>
              <PaginationLink
                href="#"
                onClick={() => handleMovePage(d)}
                isActive={pageNumber === d}
              >
                {d}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {/* <PaginationItem>
        <PaginationEllipsis />
      </PaginationItem> */}
        <PaginationItem>
          <PaginationNext href="#" onClick={handleNextPage} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
