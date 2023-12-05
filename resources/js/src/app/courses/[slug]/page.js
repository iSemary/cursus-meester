"use client";
import { useEffect, useState } from "react";
import StudentTemplate from "../../Templates/StudentTemplate";
import CoursePageTemplate from "../../components/template/CoursePageTemplate";
import axiosConfig from "../../components/axiosConfig/axiosConfig";
import CourseListLoader from "../../components/loaders/CourseListLoader";

export default function Course({ params }) {
    const slug = params.slug;
    const [course, setCourse] = useState(false);
    const [rates, setRates] = useState([]);
    const [resources, setResources] = useState([]);
    useEffect(() => {
        axiosConfig.get("/courses/" + slug).then((response) => {
            setCourse(response.data.data.data.course);
            setRates(response.data.data.data.rates);
            setResources(response.data.data.data.resources);
        });
    }, [slug]);

    return (
        <StudentTemplate>
            {course ? (
                <CoursePageTemplate
                    course={course}
                    resources={resources}
                    rates={rates}
                />
            ) : (
                <CourseListLoader />
            )}
        </StudentTemplate>
    );
}
