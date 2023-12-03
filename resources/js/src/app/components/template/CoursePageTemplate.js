import React from "react";
import CourseDetailsTemplate from "./Course/CourseDetailsTemplate";

export default function CoursePageTemplate({ course, rates, containerClass }) {
    return (
        <CourseDetailsTemplate
            course={course}
            rates={rates}
            containerClass={containerClass}
        />
    );
}
