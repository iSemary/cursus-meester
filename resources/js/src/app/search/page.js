"use client";

import React, { useEffect, useState } from "react";
import StudentTemplate from "../Templates/StudentTemplate";
import axiosConfig from "../components/axiosConfig/axiosConfig";
import { useSearchParams } from "next/navigation";
import CourseListViewer from "../components/template/CourseListViewer";
import CourseListLoader from "../components/loaders/CourseListLoader";
export default function Search() {
    const searchParams = useSearchParams();
    const [courses, setCourses] = useState(null);
    const q = searchParams.get("q");
    const [currentPage, setCurrentPage] = useState(1);

    const handleContentPagination = (page) => {
        axiosConfig
            .get(`/search?q=${q}&page=${currentPage}`)
            .then((response) => {
                setCourses(response.data.data.results);
            })
            .catch(({ response }) => {
                setCourses([]);
            });
    };

    const handlePageClick = (e) => {
        const newPage = e.selected + 1;
        setCurrentPage(newPage);
        handleContentPagination(newPage);
    };

    useState(() => {
        if(q) {
            handleContentPagination(currentPage);
        }
    }, [currentPage, q]);

    return (
        <StudentTemplate>
            <div className="container search-page">
                <h3 className="font-weight-bold pb-2">
                    Search results for : "{q}"
                </h3>
                {courses ? (
                    courses.data && courses.data.length > 0 ? (
                        <CourseListViewer
                            items={courses}
                            currentPage={currentPage}
                            handlePageClick={handlePageClick}
                        />
                    ) : (
                        <p className="text-center">There's no records found.</p>
                    )
                ) : (
                    <CourseListLoader />
                )}
            </div>
        </StudentTemplate>
    );
}
