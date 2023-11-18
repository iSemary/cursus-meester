import React from "react";
import Pagination from "../utilities/Pagination";
import CourseTemplate from "./CourseTemplate";

export default function CourseGridViewer({
    items,
    removeCart = false,
    addCart = false,
    addWishlist = false,
    removeWishlist = false,
    changeToWishlist = false,
    handleRemoveCart,
    handleMoveToWishlist,
}) {
    return (
        <div>
            <div className="row">
                {items.map((course, index) => (
                    <CourseTemplate
                        course={course}
                        containerClass={"col-12 full-box m-2"}
                        cols={["col-3", "col-9"]}
                        imageWidth="170"
                        removeCart={removeCart}
                        addCart={addCart}
                        addWishlist={addWishlist}
                        removeWishlist={removeWishlist}
                        changeToWishlist={changeToWishlist}
                        handleRemoveCart={handleRemoveCart}
                        handleMoveToWishlist={handleMoveToWishlist}
                    />
                ))}
            </div>
        </div>
    );
}
