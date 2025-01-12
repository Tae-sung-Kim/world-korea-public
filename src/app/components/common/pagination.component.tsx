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
  totalItems?: number;
  pageRange?: number;
  minPages?: number;
};

export default function Paginations({
  pageNumber = 1,
  pageSize = 10,
  totalPages = 1,
  totalItems = 0,
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

  const handlePageMove = (pageNumber: number) => {
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
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
      <div className="text-sm text-muted-foreground bg-gray-50 px-4 py-2 rounded-md">
        전체 <span className="font-semibold text-primary">{totalItems}</span>개
        중{' '}
        <span className="font-semibold text-primary">
          {(pageNumber - 1) * pageSize + 1}-
          {Math.min(pageNumber * pageSize, totalItems)}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <Pagination className="rounded-lg bg-white shadow-sm border border-gray-100 pl-1 pr-3">
          <PaginationContent className="gap-1">
            <PaginationItem>
              <PaginationLink
                onClick={(e) => {
                  e.preventDefault();
                  if (pageNumber > 1) handlePageMove(1);
                }}
                className={cn(
                  'hover:bg-gray-50 transition-colors rounded-md cursor-pointer',
                  pageNumber <= 1 &&
                    'opacity-50 cursor-not-allowed hover:bg-transparent',
                  'font-medium text-sm px-3'
                )}
              >
                처음
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationPrevious
                onClick={(e) => {
                  e.preventDefault();
                  if (pageNumber > 1) handlePageMove(pageNumber - 1);
                }}
                className={cn(
                  'hover:bg-gray-50 transition-colors rounded-md cursor-pointer',
                  pageNumber <= 1 &&
                    'opacity-50 cursor-not-allowed hover:bg-transparent'
                )}
              />
            </PaginationItem>

            {startPage > 1 && (
              <>
                <PaginationItem>
                  <PaginationLink
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageMove(1);
                    }}
                    className="hover:bg-gray-50 transition-colors rounded-md font-medium cursor-pointer"
                  >
                    1
                  </PaginationLink>
                </PaginationItem>
                {startPage > 2 && (
                  <PaginationEllipsis className="text-gray-400" />
                )}
              </>
            )}

            {pageNumbers.map((d) => (
              <PaginationItem key={`paginations-${d}`}>
                <PaginationLink
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageMove(d);
                  }}
                  className={cn(
                    'hover:bg-gray-50 transition-colors rounded-md font-medium cursor-pointer',
                    pageNumber === d && 'bg-blue-50 text-blue-600'
                  )}
                  isActive={pageNumber === d}
                >
                  {d}
                </PaginationLink>
              </PaginationItem>
            ))}

            {endPage < totalPages && (
              <>
                {endPage < totalPages - 1 && (
                  <PaginationEllipsis className="text-gray-400" />
                )}
                <PaginationItem>
                  <PaginationLink
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageMove(totalPages);
                    }}
                    className="hover:bg-gray-50 transition-colors rounded-md font-medium cursor-pointer"
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}

            <PaginationItem>
              <PaginationNext
                onClick={(e) => {
                  e.preventDefault();
                  if (pageNumber < totalPages) handlePageMove(pageNumber + 1);
                }}
                className={cn(
                  'hover:bg-gray-50 transition-colors rounded-md cursor-pointer',
                  pageNumber >= totalPages &&
                    'opacity-50 cursor-not-allowed hover:bg-transparent'
                )}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                onClick={(e) => {
                  e.preventDefault();
                  if (pageNumber < totalPages) handlePageMove(totalPages);
                }}
                className={cn(
                  'hover:bg-gray-50 transition-colors rounded-md cursor-pointer',
                  pageNumber >= totalPages &&
                    'opacity-50 cursor-not-allowed hover:bg-transparent',
                  'font-medium text-sm px-3'
                )}
              >
                마지막
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
        <div className="flex items-center gap-2">
          <Select onValueChange={handlePageSizeChange} value={String(pageSize)}>
            <SelectTrigger className="w-[140px] bg-white border border-gray-100 shadow-sm hover:bg-gray-50 transition-colors">
              <SelectValue placeholder="페이지 크기" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {PAGE_SIZE_LIST.map((d) => (
                  <SelectItem
                    key={d}
                    value={String(d)}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {d}개씩 보기
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
