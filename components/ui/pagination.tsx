import * as React from "react"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
  showFirstLast?: boolean
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
  showFirstLast = true,
}: PaginationProps) {
  // 표시할 페이지 번호 계산
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 7 // 최대 표시할 페이지 번호 수

    if (totalPages <= maxVisible) {
      // 전체 페이지가 적으면 모두 표시
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // 많으면 생략 표시
      if (currentPage <= 4) {
        // 현재 페이지가 앞쪽
        for (let i = 1; i <= 5; i++) {
          pages.push(i)
        }
        pages.push("ellipsis")
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 3) {
        // 현재 페이지가 뒤쪽
        pages.push(1)
        pages.push("ellipsis")
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        // 현재 페이지가 중간
        pages.push(1)
        pages.push("ellipsis")
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push("ellipsis")
        pages.push(totalPages)
      }
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
    >
      <div className="flex items-center gap-1">
        {/* 첫 페이지 버튼 */}
        {showFirstLast && (
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            aria-label="첫 페이지로"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
        )}

        {/* 이전 페이지 버튼 */}
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          aria-label="이전 페이지"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* 페이지 번호 버튼들 */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((page, index) => {
            if (page === "ellipsis") {
              return (
                <div
                  key={`ellipsis-${index}`}
                  className="flex h-9 w-9 items-center justify-center"
                  aria-hidden="true"
                >
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                </div>
              )
            }

            const pageNumber = page as number
            const isActive = pageNumber === currentPage

            return (
              <Button
                key={pageNumber}
                variant={isActive ? "default" : "outline"}
                size="icon"
                className={cn(
                  "h-9 w-9",
                  isActive &&
                    "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                )}
                onClick={() => onPageChange(pageNumber)}
                aria-label={`페이지 ${pageNumber}`}
                aria-current={isActive ? "page" : undefined}
              >
                {pageNumber}
              </Button>
            )
          })}
        </div>

        {/* 다음 페이지 버튼 */}
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          aria-label="다음 페이지"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* 마지막 페이지 버튼 */}
        {showFirstLast && (
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            aria-label="마지막 페이지로"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </nav>
  )
}

// 페이지 정보 표시 컴포넌트 (선택사항)
interface PaginationInfoProps {
  currentPage: number
  totalPages: number
  itemsPerPage: number
  totalItems: number
  className?: string
}

export function PaginationInfo({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  className,
}: PaginationInfoProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <div className={cn("text-sm text-muted-foreground text-center", className)}>
      총 <span className="font-semibold text-foreground">{totalItems.toLocaleString()}</span>개 중{" "}
      <span className="font-semibold text-foreground">{startItem.toLocaleString()}</span>-
      <span className="font-semibold text-foreground">{endItem.toLocaleString()}</span> 표시
    </div>
  )
}
