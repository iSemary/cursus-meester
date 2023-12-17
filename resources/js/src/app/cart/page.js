"use client";
import React, { useState } from "react";
import StudentTemplate from "../Templates/StudentTemplate";
import axiosConfig from "../components/axiosConfig/axiosConfig";
import CourseGridViewer from "../components/template/CourseGridViewer";
import CourseListLoader from "../components/loaders/CourseListLoader";
import ProceedCheckout from "../components/template/cart/ProceedCheckout";
import toastAlert from "../components/utilities/Alert";

export default function Cart() {
    const [courses, setCourses] = useState(null);
    /** Fetch cart items */
    const handleCartContent = () => {
        axiosConfig
            .get("cart")
            .then((response) => {
                setCourses(response.data.data);
            })
            .catch((error) => {
                console.error(error);
            });
    };
    /** Soft deleting cart item */
    const handleRemoveCart = (id) => {
        axiosConfig
            .delete(`cart/${id}`)
            .then((response) => {
                toastAlert(response.data.message, "success");
                handleCartContent();
            })
            .catch((error) => {
                console.error(error);
            });
    };
    /** Move item to wishlist and Soft delete cart item */
    const handleMoveToWishlist = (id) => {
        axiosConfig
            .post(`cart/${id}/move-wishlist`)
            .then((response) => {
                toastAlert(response.data.message, "success");
                handleCartContent();
            })
            .catch((error) => {
                console.error(error);
            });
    };

    useState(() => {
        handleCartContent();
    }, []);

    return (
        <StudentTemplate>
            <div className="container my-courses-page">
                <h3 className="font-weight-bold pb-2">Shopping Cart</h3>
                <div className="row">
                    <div className="col-8">
                        {/* Courses List */}
                        {courses ? (
                            courses.courses.length > 0 ? (
                                <CourseGridViewer
                                    items={courses.courses}
                                    removeCart={true}
                                    changeToWishlist={true}
                                    handleRemoveCart={handleRemoveCart}
                                    handleMoveToWishlist={handleMoveToWishlist}
                                />
                            ) : (
                                <p className="text-center">
                                    Your cart is empty.
                                </p>
                            )
                        ) : (
                            <CourseListLoader />
                        )}
                    </div>
                    <div className="col-4">
                        {courses ? (
                            <ProceedCheckout
                                totalPrice={courses.total_price}
                                discountPrice={courses.discount_price}
                                discountPercentage={courses.discount_percentage}
                                currency={courses.currency}
                            />
                        ) : (
                            <CourseListLoader />
                        )}
                    </div>
                </div>
            </div>
        </StudentTemplate>
    );
}
