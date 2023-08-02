import Image from "next/image";
import Link from "next/link";
import React from "react";
import StarsRate from "../utilities/StarsRate";

export default function CoursePageTemplate({ course, containerClass }) {
    return (
        <div className={"course-details " + containerClass}>
            <div className="row">
                <div className="col-12">
                    <h1 className="font-weight-bold">{course.name}</h1>
                    <p>{course.description}</p>

                    <StarsRate rate={course.rate} />

                    <h6>
                        Instructor{" "}
                        <b>
                            <Link
                                href={`instructor/${course.instructor.username}`}
                            >
                                {course.instructor.name}
                            </Link>
                        </b>
                    </h6>

                    <h6>Last updated {course.last_updated}</h6>
                </div>
            </div>
            <hr className="home-hr" />
            <div className="row">
                <div className="col-8">
                    {/* Requirements */}
                    <div className="requirements">
                        <h3 className="font-weight-bold">Requirements</h3>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: course.requirements,
                            }}
                        />
                    </div>
                    {/* Requirements */}
                    <div className="content">
                        <h3 className="font-weight-bold">Course Content</h3>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: course.content,
                            }}
                        />
                    </div>
                </div>
            </div>
            <hr className="home-hr" />
        </div>
    );
}
