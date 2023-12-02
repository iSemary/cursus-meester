"use client";
import { useEffect, useState } from "react";
import StudentTemplate from "../../Templates/StudentTemplate";
import CoursePageTemplate from "../../components/template/CoursePageTemplate";
import axiosConfig from "../../components/axiosConfig/axiosConfig";

export default function Course({ params }) {
    const slug = params.slug;
    const [course, setCourse] = useState({});
    useEffect(() => {
        axiosConfig.get("/courses/" + slug).then((response) => {
            setCourse(response.data.data.data.course);
        });
    }, [slug]);

    return (
        <StudentTemplate>
            {course && <CoursePageTemplate course={course} />}
        </StudentTemplate>
    );
}
