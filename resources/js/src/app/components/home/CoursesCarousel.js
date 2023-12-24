import React, { useEffect, useState } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import CourseTemplate from "../template/CourseTemplate";
import "@splidejs/react-splide/css";
import axiosConfig from "../axiosConfig/axiosConfig";

export default function CoursesCarousel({ courses }) {
    const [currentCourses, setCurrentCourses] = useState([]);
    const removeCartCallback = (id) => {
        const updatedCourses = currentCourses.map((course) => {
            if (course.id === id) {
                return {
                    ...course,
                    actions: {
                        ...course.actions,
                        cart: false,
                    },
                };
            }
            return course;
        });
        setCurrentCourses(updatedCourses);
    };

    const addCartCallback = (id) => {
        const updatedCourses = currentCourses.map((course) => {
            if (course.id === id) {
                return {
                    ...course,
                    actions: {
                        ...course.actions,
                        cart: true,
                    },
                };
            }
            return course;
        });
        setCurrentCourses(updatedCourses);
    };
    const addWishlistCallback = (id) => {
        const updatedCourses = currentCourses.map((course) => {
            if (course.id === id) {
                return {
                    ...course,
                    actions: {
                        ...course.actions,
                        wishlist: true,
                    },
                };
            }
            return course;
        });
        setCurrentCourses(updatedCourses);
    };

    const removeWishlistCallback = (id) => {
        const updatedCourses = currentCourses.map((course) => {
            if (course.id === id) {
                return {
                    ...course,
                    actions: {
                        ...course.actions,
                        wishlist: false,
                    },
                };
            }
            return course;
        });
        setCurrentCourses(updatedCourses);
    };

    useEffect(() => {
        setCurrentCourses(courses);
    }, [courses]);

    return (
        <Splide
            options={{
                perPage: 4,
                rewind: true,
                perMove: 1,
            }}
        >
            {currentCourses &&
                currentCourses.length > 0 &&
                currentCourses.map((course, index) => (
                    <SplideSlide key={index}>
                        <CourseTemplate
                            course={course}
                            addCart={course.actions.cart ? false : true}
                            removeCart={course.actions.cart ? true : false}
                            addWishlist={course.actions.wishlist ? false : true}
                            removeWishlist={course.actions.wishlist ? true : false}
                            addCartCallback={() => addCartCallback(course.id)}
                            removeCartCallback={() => removeCartCallback(course.id)}
                            addWishlistCallback={() => addWishlistCallback(course.id)}
                            removeWishlistCallback={() => removeWishlistCallback(course.id)}
                        />
                    </SplideSlide>
                ))}
        </Splide>
    );
}
