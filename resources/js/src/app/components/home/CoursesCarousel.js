import React from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import CourseTemplate from "../template/CourseTemplate";
import "@splidejs/react-splide/css";

export default function CoursesCarousel({ courses }) {
    return (
        <Splide
            options={{
                perPage: 4,
                rewind: true,
                perMove: 1,
            }}
        >
            {courses &&
                courses.length > 0 &&
                courses.map((course, index) => (
                    <SplideSlide>
                        <CourseTemplate
                            course={course}
                            addCart={course.cart ? false : true}
                            removeCart={course.cart ? true : false}
                            addWishlist={course.wishlist ? true : false}
                            removeWishlist={course.wishlist ? false : true}
                        />
                    </SplideSlide>
                ))}
        </Splide>
    );
}
