import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

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
  minPages = 5,
}: Pagination) {
  const router = useRouter();
  const pathName = usePathname();

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
    </Pagination>
  );
}
