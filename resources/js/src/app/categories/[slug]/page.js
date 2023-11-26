"use client";
import React, { useEffect, useState } from "react";
import InstructorProfileBoxTemplate from "../../components/template/instructor/InstructorProfileBoxTemplate";
import CoursesFiltrationTemplate from "../../components/template/Course/CoursesFiltrationTemplate";
import CoursesTemplate from "../../components/template/CoursesTemplate";
import { PiChalkboardTeacherFill, PiShootingStarThin } from "react-icons/pi";
import { BiSolidHot, BiSolidVideos } from "react-icons/bi";
import StudentTemplate from "../../Templates/StudentTemplate";
import axiosConfig from "../../components/axiosConfig/axiosConfig";
import toastAlert from "../../components/utilities/Alert";
import SubCategoriesTemplate from "../../components/template/SubCategoriesTemplate";
import { MdOutlineCategory } from "react-icons/md";

export default function CategoryCourses({ params }) {
    const slug = params.slug;
    const [category, setCategory] = useState(null);
    const [topInstructors, setTopInstructors] = useState(null);
    const [topCourses, setTopCourses] = useState(null);
    const [newCourses, setNewCourses] = useState(null);
    const [subCategories, setSubCategories] = useState(null);

    useEffect(() => {
        axiosConfig
            .get(`categories/${slug}/courses`)
            .then((response) => {
                setCategory(response.data.data.data.category);
                setTopInstructors(response.data.data.data.top_instructors);
                setTopCourses(response.data.data.data.top_courses);
                setNewCourses(response.data.data.data.new_courses);
                setSubCategories(response.data.data.data.sub_categories);
            })
            .catch(({ response }) => {
                toastAlert(response.data.message, "error");
            });
    }, [slug]);

    return (
        <StudentTemplate>
            <div className="container">
                <div className="category-page">
                    <div className="row">
                        <div className="col-6">
                            <h1>{category?.title}</h1>
                        </div>
                        <div className="col-6 text-right">
                            {category?.icon && (
                                <img
                                    src={category?.icon}
                                    height={50}
                                    width={50}
                                    alt="category"
                                />
                            )}
                        </div>
                    </div>
                    <hr className="home-hr" />
                    <div className="instructors">
                        <h4 className="font-weight-bold">
                            <PiChalkboardTeacherFill /> Our top instructors
                        </h4>
                        <div className="row m-auto">
                            {topInstructors &&
                                topInstructors.length > 0 &&
                                topInstructors.map((instructor, index) => (
                                    <InstructorProfileBoxTemplate
                                        instructor={instructor}
                                        containerClass={"col-3 me-2"}
                                    />
                                ))}
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
                        <div className="">
                            <CoursesTemplate
                                containerClass={"justify-content-around"}
                                courses={topCourses}
                                childClass={"col-3"}
                            />
                        </div>
                    </div>
                    <hr className="home-hr" />
                    <div className="courses">
                        <h4 className="font-weight-bold">
                            <MdOutlineCategory /> What's inside
                        </h4>
                        <div className="">
                            <SubCategoriesTemplate
                                containerClass={"justify-content-around"}
                                categories={subCategories}
                                childClass={"col-3 bg-light"}
                            />
                        </div>
                    </div>
                    <hr className="home-hr" />
                    <div className="courses">
                        <h4 className="font-weight-bold">
                            <BiSolidHot /> Newest courses
                        </h4>
                        <div className="">
                            <CoursesTemplate
                                containerClass={"justify-content-around"}
                                courses={newCourses}
                                childClass={"col-3"}
                            />
                        </div>
                    </div>
                    {/* <hr className="home-hr" />
                    <div className="filter-courses">
                        <h4 className="font-weight-bold">
                            <BiSolidVideos /> All {category?.title} courses
                        </h4>
                        <CoursesFiltrationTemplate
                            type={1}
                            filters={""}
                            data={category?.courses}
                            cols={["col-4", "col-8"]}
                        />
                    </div> */}
                </div>
            </div>
        </StudentTemplate>
    );
}
