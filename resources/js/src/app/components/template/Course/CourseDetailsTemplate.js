import React from "react";
import StarsRate from "../../utilities/StarsRate";
import Link from "next/link";
import CourseResourcesTemplate from "./CourseResourcesTemplate";
import {BsBoxes} from "react-icons/bs";
import {FaChalkboardTeacher} from "react-icons/fa";
import {PiTarget} from "react-icons/pi";

export default function CourseDetailsTemplate({ course, containerClass }) {
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
                                href={`/instructors/${course.instructor.username}`}
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
                        <h3 className="font-weight-bold"><PiTarget /> Requirements</h3>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: course.requirements,
                            }}
                        />
                    </div>
                    <hr className="home-hr" />
                    {/* Requirements */}
                    <div className="content">
                        <h3 className="font-weight-bold"><FaChalkboardTeacher /> Course Content</h3>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: course.content,
                            }}
                        />
                    </div>
                    <hr className="home-hr" />
                    {/* Course Resources */}
                    <div className="resources">
                        <h3 className="font-weight-bold"><BsBoxes /> Resources</h3>
                        <div className="row">
                            <CourseResourcesTemplate
                                resources={course.resources}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
