import React from "react";
import Pagination from "../utilities/Pagination";
import CourseTemplate from "./CourseTemplate";

export default function CourseListViewer({
    items,
    currentPage,
    handlePageClick,
    removeWishlist,
    changeToCart,
    handleRemoveWishlist,
    handleMoveToCart,
}) {
    return (
        <div>
            <div className="row justify-content-around">
                {items.data.map((course, index) => (
                    <CourseTemplate
                        course={course}
                        containerClass={"col-3"}
                        removeWishlist={removeWishlist}
                        handleRemoveWishlist={handleRemoveWishlist}
                        changeToCart={changeToCart}
                        handleMoveToCart={handleMoveToCart}
                    />
                ))}
            </div>
            {/* Courses Pagination */}
            <Pagination
                className="mt-5"
                currentPage={currentPage}
                pageCount={Math.ceil(items.total / items.per_page)}
                pageRangeDisplayed={items.per_page}
                total={items.total}
                perPage={items.per_page}
                itemsName="courses"
                handlePageClick={handlePageClick}
            />
        </div>
    );
}
