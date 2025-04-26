import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination";


interface PagePaginationProps {
    pageNumber: number,
    nextPageAvailable: boolean,

}

export default function PagePagination(props: PagePaginationProps) {
    const pageNumber = props.pageNumber
    const nextPageAvailable = props.nextPageAvailable

    return (
        <Pagination className="absolute bottom-4">
            <PaginationContent>
                {(pageNumber != 1) &&
                    <PaginationItem>
                        <PaginationPrevious href={`${pageNumber - 1}`}></PaginationPrevious>
                    </PaginationItem>
                }
                <PaginationItem >
                    <PaginationLink isActive href="#">{pageNumber}</PaginationLink>
                </PaginationItem>
                {nextPageAvailable &&
                    <PaginationItem>
                        <PaginationNext href={`${pageNumber + 1}`}></PaginationNext>
                    </PaginationItem>

                }
            </PaginationContent>
        </Pagination>
    )
}