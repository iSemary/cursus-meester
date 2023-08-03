import React from "react";
import CourseTemplate from "./CourseTemplate";

export default function CoursesTemplate({ courses, containerClass, childClass, cols }) {
    return (
        <div className={"row " + containerClass}>
            {courses &&
                courses.length > 0 &&
                courses.map((course, index) => (
                    <CourseTemplate course={course} containerClass={childClass} cols={cols} />
                ))}
        </div>
    );
}
