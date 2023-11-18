"use client";
import React, { useState } from "react";
import StudentTemplate from "../Templates/StudentTemplate";
import axiosConfig from "../components/axiosConfig/axiosConfig";
import CourseListViewer from "../components/template/CourseListViewer";
import CourseListLoader from "../components/loaders/CourseListLoader";
import toastAlert from "../components/utilities/Alert";

export default function Wishlist() {
    const [currentPage, setCurrentPage] = useState(1);
    const [courses, setCourses] = useState(null);

    /** Fetch wishlist items */
    const handleContentPagination = (page) => {
        axiosConfig.get(`wishlist?page=${page}`).then((response) => {
            setCourses(response.data.data.courses);
        });
    };
    /** Handle pagination fetching data */
    const handlePageClick = (e) => {
        const newPage = e.selected + 1;
        setCurrentPage(newPage);
        handleContentPagination(newPage);
    };

    /** handle soft delete wishlist item */
    const handleRemoveWishlist = (id) => {
        axiosConfig.delete(`wishlist/${id}`).then((response) => {
            toastAlert(response.data.message, "success");
            handleContentPagination(currentPage);
        });
    };
    /** Move item to cart and Soft delete wishlist item */
    const handleMoveToCart = (id) => {
        axiosConfig.post(`wishlist/${id}/move-cart`).then((response) => {
            toastAlert(response.data.message, "success");
            handleContentPagination(currentPage);
        });
    };

    useState(() => {
        handleContentPagination(currentPage);
    }, [currentPage]);

    return (
        <StudentTemplate>
            <div className="container my-courses-page">
                <h3 className="font-weight-bold pb-2">Wishlist</h3>
                {/* Courses List */}
                {courses ? (
                    courses.data && courses.data.length > 0 ? (
                        <CourseListViewer
                            items={courses}
                            currentPage={currentPage}
                            handlePageClick={handlePageClick}
                            handleRemoveWishlist={handleRemoveWishlist}
                            handleMoveToCart={handleMoveToCart}
                            removeWishlist
                            changeToCart
                        />
                    ) : (
                        <p className="text-center">Your wishlist is empty.</p>
                    )
                ) : (
                    <CourseListLoader />
                )}
            </div>
        </StudentTemplate>
    );
}
