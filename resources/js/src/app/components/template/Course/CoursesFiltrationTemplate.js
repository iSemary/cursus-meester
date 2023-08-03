import React from "react";
import CoursesTemplate from "../CoursesTemplate";

export default function CoursesFiltrationTemplate({ type, filters, data, cols }) {
    return (
        <div className="filtration">
            <div className="row">
                <div className="col-4"></div>
                <div className="col-8">
                    {type === 1 && (
                        <CoursesTemplate courses={data} childClass={"col-12"} cols={cols} />
                    )}
                </div>
            </div>
        </div>
    );
}
