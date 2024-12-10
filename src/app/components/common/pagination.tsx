import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import cn from 'classnames';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import qs from 'qs';

const PAGE_SIZE_LIST = [5, 10, 20, 30, 40, 50, 100, 200];

export type Pagination = {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  pageRange?: number;
  minPages?: number;
};

export default function Paginations({
  pageNumber = 1,
  pageSize = 10,
  totalPages = 1,
  pageRange = 2,
  minPages = 3,
}: Pagination) {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const allParams = searchParams.toString();

  // 페이지 번호 배열 생성
  let startPage = Math.max(pageNumber - pageRange, 1);
  let endPage = Math.min(pageNumber + pageRange, totalPages);

  // 최소 페이지 수가 보이도록 조정
  if (endPage - startPage + 1 < minPages) {
    const extraPages = minPages - (endPage - startPage + 1);

    // 시작 페이지 조정
    startPage = Math.max(startPage - extraPages, 1);
    // 끝 페이지 조정
    endPage = Math.min(startPage + minPages - 1, totalPages);
  }

  // 페이지 번호 배열 생성
  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const handleMovePage = (pageNumber: number) => {
    const params = qs.stringify({ ...qs.parse(allParams), pageNumber });

    router.push(pathName + '?' + params);
  };

  const handlePageSizeChange = (pageSize: string) => {
    const params = qs.stringify({
      ...qs.parse(allParams),
      pageNumber: 1,
      pageSize,
    });

    router.push(pathName + '?' + params);
  };
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <Pagination className="rounded-lg bg-white shadow-sm">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              className={cn(
                'hover:bg-gray-100 transition-colors',
                pageNumber <= 1 &&
                  'opacity-50 cursor-not-allowed hover:bg-transparent'
              )}
              onClick={() => {
                if (pageNumber > 1) handleMovePage(pageNumber - 1);
              }}
            />
          </PaginationItem>
          {pageNumbers.map((d) => {
            return (
              <PaginationItem key={`paginations-${d}`}>
                <PaginationLink
                  href="#"
                  onClick={() => handleMovePage(d)}
                  className={cn(
                    'hover:bg-gray-100 transition-colors',
                    pageNumber === d &&
                      'bg-primary text-primary-foreground hover:bg-primary/90'
                  )}
                  isActive={pageNumber === d}
                >
                  {d}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            <PaginationNext
              href="#"
              className={cn(
                'hover:bg-gray-100 transition-colors',
                pageNumber >= totalPages &&
                  'opacity-50 cursor-not-allowed hover:bg-transparent'
              )}
              onClick={() => {
                if (pageNumber < totalPages) handleMovePage(pageNumber + 1);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <div className="flex items-center gap-2">
        <Select onValueChange={handlePageSizeChange} value={String(pageSize)}>
          <SelectTrigger className="w-[100px] bg-white">
            <SelectValue placeholder="선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {PAGE_SIZE_LIST.map((d) => {
                return (
                  <SelectItem key={d} value={String(d)}>
                    {d}개
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
