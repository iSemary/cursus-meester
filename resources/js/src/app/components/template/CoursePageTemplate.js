import React from "react";
import CourseDetailsTemplate from "./Course/CourseDetailsTemplate";

export default function CoursePageTemplate({
    course,
    rates,
    resources,
    containerClass,
}) {
    return (
        <CourseDetailsTemplate
            course={course}
            resources={resources}
            rates={rates}
            containerClass={containerClass}
        />
    );
}
