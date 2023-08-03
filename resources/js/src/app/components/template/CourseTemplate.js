import Image from "next/image";
import Link from "next/link";
import React from "react";
import StarsRate from "../utilities/StarsRate";

export default function CourseTemplate({ course, containerClass, cols }) {
    return (
        <div className={"course-box " + containerClass}>
            <Link href={`/courses/${course.slug}`} className="no-link">
                <div className="row">
                    <div className={cols ? cols[0] : "col-12"}>
                        <Image
                            src={course.image}
                            width={250}
                            height={150}
                            alt={course.name + " thumbnail"}
                        />
                    </div>
                    <div className={(cols ? cols[1] : "col-12") + " course-details"}>
                        <h5 className="my-1">{course.name}</h5>
                        <p className="text-muted my-1">
                            {course.instructor.name}
                        </p>
                        <StarsRate rate={course.rate} />
                        <h6 className="font-weight-bold mt-1">
                            {course.final_price}
                            {course.final_price < course.original_price && (
                                <>
                                    &nbsp;&nbsp;
                                    <s className="text-muted">
                                        {course.original_price}
                                    </s>
                                </>
                            )}
                        </h6>
                    </div>
                </div>
            </Link>
        </div>
    );
}
