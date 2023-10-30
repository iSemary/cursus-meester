import React from "react";
import InstructorProfileBoxTemplate from "../../components/template/instructor/InstructorProfileBoxTemplate";
import CoursesFiltrationTemplate from "../../components/template/Course/CoursesFiltrationTemplate";
import CoursesTemplate from "../../components/template/CoursesTemplate";
import { PiChalkboardTeacherFill, PiShootingStarThin } from "react-icons/pi";
import { BiSolidVideos } from "react-icons/bi";
import StudentTemplate from "../../Templates/StudentTemplate";

export default function CategoryCourses({ params }) {
    const category = {
        title: "Front End Development",
        description:
            "The best career, The best careerThe best career, The best careerThe best career, The best careerThe best career, The best careerThe best career, The best careerThe best career, The best career.",
        top_courses: [
            {
                name: "Course 1",
                slug: "course-1",
                rate: {
                    average: 4.2,
                    total: 4454852,
                },
                final_price: "$500",
                original_price: "$500",
                image: "https://placehold.co/600x450.png",
                instructor: {
                    name: "Ahmed",
                },
            },
            {
                name: "Course 1",
                slug: "course-1",
                rate: {
                    average: 4.2,
                    total: 4454852,
                },
                final_price: "$500",
                original_price: "$500",
                image: "https://placehold.co/600x450.png",
                instructor: {
                    name: "Ahmed",
                },
            },
            {
                name: "Course 1",
                slug: "course-1",
                rate: {
                    average: 4.2,
                    total: 4454852,
                },
                final_price: "$500",
                original_price: "$500",
                image: "https://placehold.co/600x450.png",
                instructor: {
                    name: "Ahmed",
                },
            },
            {
                name: "Course 1",
                slug: "course-1",
                rate: {
                    average: 4.2,
                    total: 4454852,
                },
                final_price: "$500",
                original_price: "$700",
                image: "https://placehold.co/600x450.png",
                instructor: {
                    name: "Ahmed",
                },
            },
        ],
        courses: [
            {
                name: "Course 1",
                slug: "course-1",
                rate: {
                    average: 4.2,
                    total: 4454852,
                },
                final_price: "$500",
                original_price: "$500",
                image: "https://placehold.co/600x450.png",
                instructor: {
                    name: "Ahmed",
                },
            },
            {
                name: "Course 1",
                slug: "course-1",
                rate: {
                    average: 4.2,
                    total: 4454852,
                },
                final_price: "$500",
                original_price: "$500",
                image: "https://placehold.co/600x450.png",
                instructor: {
                    name: "Ahmed",
                },
            },
            {
                name: "Course 1",
                slug: "course-1",
                rate: {
                    average: 4.2,
                    total: 4454852,
                },
                final_price: "$500",
                original_price: "$500",
                image: "https://placehold.co/600x450.png",
                instructor: {
                    name: "Ahmed",
                },
            },
            {
                name: "Course 1",
                slug: "course-1",
                rate: {
                    average: 4.2,
                    total: 4454852,
                },
                final_price: "$500",
                original_price: "$700",
                image: "https://placehold.co/600x450.png",
                instructor: {
                    name: "Ahmed",
                },
            },
        ],
        instructors: [
            {
                name: "Ahmed Mohamed",
                specialty: "Software Engineer",
                username: "ahmeddd",
                image: "https://placehold.co/600x450/png",
                total_students: "500,000",
                total_courses: 8,
                rate: {
                    total: 500,
                    average: 2.3,
                },
            },
            {
                name: "Ahmed Mohamed",
                specialty: "Software Engineer",
                username: "ahmeddd",
                image: "https://placehold.co/600x450/png",
                total_students: 5000,
                total_courses: 8,
                rate: {
                    total: 500,
                    average: 2.3,
                },
            },
            {
                name: "Ahmed Mohamed",
                specialty: "Software Engineer",
                username: "ahmeddd",
                image: "https://placehold.co/600x450/png",
                total_students: 5000,
                total_courses: 8,
                rate: {
                    total: 500,
                    average: 2.3,
                },
            },
            {
                name: "Ahmed Mohamed",
                specialty: "Software Engineer",
                username: "ahmeddd",
                image: "https://placehold.co/600x450/png",
                total_students: 5000,
                total_courses: 8,
                rate: {
                    total: 500,
                    average: 2.3,
                },
            },
        ],
    };
    return (
        <StudentTemplate>
            <div className="container">
                <div className="category-page">
                    <div className="row">
                        <div className="col-12">
                            <h1>{category.title}</h1>
                            <p>{category.description}</p>
                        </div>
                    </div>
                    <hr className="home-hr" />
                    <div className="instructors">
                        <h4 className="font-weight-bold">
                            <PiChalkboardTeacherFill /> Our popular instructors
                        </h4>
                        <div className="row m-auto justify-content-space-between">
                            {category.instructors &&
                                category.instructors.length > 0 &&
                                category.instructors.map(
                                    (instructor, index) => (
                                        <InstructorProfileBoxTemplate
                                            instructor={instructor}
                                            containerClass={"col-3 me-2"}
                                        />
                                    )
                                )}
                        </div>
                    </div>
                    <hr className="home-hr" />
                    <div className="courses">
                        <h4 className="font-weight-bold">
                            <PiShootingStarThin
                                style={{ strokeWidth: "15px" }}
                            />{" "}
                            Courses to get you started
                        </h4>
                        <div className="row">
                            <CoursesTemplate
                                courses={category.top_courses}
                                childClass={"col-3"}
                            />
                        </div>
                    </div>
                    <hr className="home-hr" />
                    <div className="filter-courses">
                        <h4 className="font-weight-bold">
                            <BiSolidVideos /> All {category.title} courses
                        </h4>
                        <CoursesFiltrationTemplate
                            type={1}
                            filters={""}
                            data={category.courses}
                            cols={["col-4", "col-8"]}
                        />
                    </div>
                </div>
            </div>
        </StudentTemplate>
    );
}
