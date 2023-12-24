import Image from "next/image";
import Link from "next/link";
import React from "react";
import StarsRate from "../utilities/StarsRate";
import RemoveCartBtn from "./Course/buttons/RemoveCartBtn";
import ChangeToWishlistBtn from "./Course/buttons/ChangeToWishlistBtn";
import RemoveWishlistBtn from "./Course/buttons/RemoveWishlistBtn";
import ChangeToCartBtn from "./Course/buttons/ChangeToCartBtn";
import AddWishlistBtn from "./Course/buttons/AddWishlistBtn";
import AddCardBtn from "./Course/buttons/AddCardBtn";

export default function CourseTemplate({
    course,
    instructorName,
    containerClass,
    cols,
    imageWidth = 230,
    removeCart = false,
    addCart = false,
    addWishlist = false,
    removeWishlist = false,
    changeToWishlist = false,
    changeToCart = false,
    handleMoveToWishlist,
    handleRemoveWishlist,
    handleMoveToCart,
    addCartCallback,
    removeCartCallback,
    addWishlistCallback,
    removeWishlistCallback,
}) {
    return (
        <div className={"course-box mb-3 " + containerClass}>
            <div className="row">
                <div className={cols ? cols[0] : "col-12"}>
                    <Link href={`/courses/${course.slug}`} className="no-link">
                        <Image
                            src={course.thumbnail}
                            width={imageWidth}
                            height={150}
                            alt={course.title + " thumbnail"}
                        />
                    </Link>
                </div>

                <div
                    className={(cols ? cols[1] : "col-12") + " course-details"}
                >
                    <div>
                        <Link
                            href={`/courses/${course.slug}`}
                            className="no-link"
                        >
                            <h5 className="my-1">{course.title}</h5>
                            <p className="text-muted my-1">
                                {course?.instructor?.full_name ??
                                    instructorName}
                            </p>
                            <StarsRate
                                rate={course.rates}
                                totalStudents={course.total_students}
                            />
                            <h6 className="font-weight-bold mt-1">
                                {course.currency + course.final_price}
                                {course.final_price < course.price && (
                                    <>
                                        &nbsp;&nbsp;
                                        <s className="text-muted">
                                            {course.currency + course.price}
                                        </s>
                                    </>
                                )}
                            </h6>
                        </Link>
                    </div>
                    <div className="course-actions">
                        {removeCart && (
                            <RemoveCartBtn
                                id={course.id}
                                removeCartCallback={removeCartCallback}
                            />
                        )}
                        {changeToWishlist && (
                            <ChangeToWishlistBtn
                                id={course.id}
                                handleMoveToWishlist={handleMoveToWishlist}
                            />
                        )}
                        {removeWishlist && (
                            <RemoveWishlistBtn
                                id={course.id}
                                removeWishlistCallback={removeWishlistCallback}
                            />
                        )}
                        {addWishlist && (
                            <AddWishlistBtn
                                id={course.id}
                                addWishlistCallback={addWishlistCallback}
                            />
                        )}
                        {addCart && (
                            <AddCardBtn
                                id={course.id}
                                addCartCallback={addCartCallback}
                            />
                        )}
                        {changeToCart && (
                            <ChangeToCartBtn
                                id={course.id}
                                handleMoveToCart={handleMoveToCart}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
