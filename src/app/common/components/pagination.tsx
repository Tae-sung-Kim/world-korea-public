import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { PaginationResponse } from '@/definitions';
import { useEffect, useState } from 'react';

export default function Paginations({
  pagination,
  onPageNumberClick,
  url,
}: {
  pagination: Omit<PaginationResponse<unknown>, 'list'>;
  onPageNumberClick: (pageNumber: number) => void;
  url?: string;
}) {
  const [pageInfo, setPageInfo] =
    useState<Omit<PaginationResponse<unknown>, 'list'>>(pagination);

  const [currentPage, setCurrentPage] = useState(pageInfo.pageNumber);

  const handlePrevPage = () => {
    setCurrentPage((prevData) => prevData - 1);
  };

  const handleNextPage = () => {
    setCurrentPage((prevData) => prevData + 1);
  };

  useEffect(() => {
    setPageInfo(pagination);
    setCurrentPage(pagination.pageNumber);
  }, [pagination]);

  console.log('currentPage', currentPage);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" onClick={handlePrevPage} />
        </PaginationItem>
        {Array.from({ length: pageInfo.totalPages }, (_, i) => i + 1).map(
          (d) => {
            return (
              <PaginationItem key={`paginations-${d}`}>
                <PaginationLink
                  href={url ?? '#'}
                  onClick={() => onPageNumberClick(d)}
                  isActive={currentPage === d}
                >
                  {d}
                </PaginationLink>
              </PaginationItem>
            );
          }
        )}

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
