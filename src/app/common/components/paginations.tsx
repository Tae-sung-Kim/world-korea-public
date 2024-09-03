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
import { usePathname, useRouter } from 'next/navigation';

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

  const handlePageSizeChange = (pageSize: string) => {
    router.push(pathName + '?pageNumber=' + 1 + '&pageSize=' + pageSize);
  };

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
    router.push(
      pathName + '?pageNumber=' + pageNumber + '&pageSize=' + pageSize
    );
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            style={{
              pointerEvents: pageNumber <= 1 ? 'none' : 'auto',
            }}
            onClick={() => {
              handleMovePage(pageNumber - 1);
            }}
          />
        </PaginationItem>
        {pageNumbers.map((d) => {
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

        <PaginationItem>
          <PaginationNext
            href="#"
            style={{
              pointerEvents: pageNumber >= totalPages ? 'none' : 'auto',
            }}
            onClick={() => {
              handleMovePage(pageNumber + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>

      <Select onValueChange={handlePageSizeChange} value={String(pageSize)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="선택" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {PAGE_SIZE_LIST.map((d) => {
              return (
                <SelectItem key={d} value={String(d)}>
                  {d} 개
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Pagination>
  );
}
