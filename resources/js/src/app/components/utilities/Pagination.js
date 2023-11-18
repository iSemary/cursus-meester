import React from "react";
import ReactPaginate from "react-paginate";

export default function Pagination({
    className,
    pageCount,
    currentPage,
    total,
    itemsName,
    perPage,
    pageRangeDisplayed,
    handlePageClick,
}) {
    const fromItems = Math.min((currentPage - 1) * perPage + 1, total);
    const toItems = Math.min(currentPage * perPage, total);

    return (
        <div className={"list-pagination " + className}>
            <ReactPaginate
                breakLabel="..."
                nextLabel=">"
                onPageChange={handlePageClick}
                pageRangeDisplayed={pageRangeDisplayed}
                pageCount={pageCount}
                previousLabel="<"
                renderOnZeroPageCount={null}
            />
            <div className="text-center">
                <small className="text-muted">{`${fromItems} - ${toItems} of ${total} ${itemsName}`}</small>
            </div>
        </div>
    );
}
