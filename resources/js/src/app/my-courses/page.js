"use client";
import React, { useState } from "react";
import StudentTemplate from "../Templates/StudentTemplate";
import axiosConfig from "../components/axiosConfig/axiosConfig";
import CourseListViewer from "../components/template/CourseListViewer";
import CourseListLoader from "../components/loaders/CourseListLoader";

export default function MyCourses() {
    const [currentPage, setCurrentPage] = useState(1);
    const [myCourses, setMyCourses] = useState(null);

    const handleContentPagination = (page) => {
        axiosConfig.get(`my-courses?page=${page}`).then((response) => {
            setMyCourses(response.data.data.courses);
        }).catch((error)=>{
            console.error(error);
        });
    };

    const handlePageClick = (e) => {
        const newPage = e.selected + 1;
        setCurrentPage(newPage);
        handleContentPagination(newPage);
    };

    useState(() => {
        handleContentPagination(currentPage);
    }, [currentPage]);

    return (
        <StudentTemplate>
            <div className="container my-courses-page">
                <h3 className="font-weight-bold pb-2">My Courses</h3>
                {/* Courses List */}
                {myCourses ? (
                    myCourses.data && myCourses.data.length > 0 ? (
                        <CourseListViewer
                            items={myCourses}
                            currentPage={currentPage}
                            handlePageClick={handlePageClick}
                        />
                    ) : (
                        <p className="text-center">
                            There's no enrolled courses for you yet.
                        </p>
                    )
                ) : (
                    <CourseListLoader />
                )}
            </div>
        </StudentTemplate>
    );
}
