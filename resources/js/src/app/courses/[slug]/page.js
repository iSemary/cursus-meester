"use client";
import { useEffect, useState } from "react";
import StudentTemplate from "../../Templates/StudentTemplate";
import CoursePageTemplate from "../../components/template/CoursePageTemplate";
import axiosConfig from "../../components/axiosConfig/axiosConfig";

export default function Course({ params }) {
    const slug = params.slug;
    const [course, setCourse] = useState({});
    const [rates, setRates] = useState([]);
    useEffect(() => {
        axiosConfig.get("/courses/" + slug).then((response) => {
            setCourse(response.data.data.data.course);
            setRates(response.data.data.data.rates);
        });
    }, [slug]);

    return (
        <StudentTemplate>
            {course && <CoursePageTemplate course={course} rates={rates} />}
        </StudentTemplate>
    );
}
