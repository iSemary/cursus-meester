import React from "react";
import StarsRate from "../../utilities/StarsRate";
import Link from "next/link";
import CourseResourcesTemplate from "./CourseResourcesTemplate";
import { BsBoxes, BsDownload } from "react-icons/bs";
import { FaChalkboardTeacher } from "react-icons/fa";
import { MdOndemandVideo, MdOutlineReviews } from "react-icons/md";
import { GoDeviceDesktop } from "react-icons/go";
import { PiExam, PiTarget, PiCertificateDuotone } from "react-icons/pi";
import CourseReviews from "./CourseReviews";
import MediaPlayer from "../../MediaPlayer/MediaPlayer";

export default function CourseDetailsTemplate({
    course,
    rates,
    containerClass,
}) {
    return (
        <div className={"course-details " + containerClass}>
            <div className="row">
                <div className="col-8">
                    <h1 className="font-weight-bold">{course.title}</h1>
                    <p>{course.description}</p>

                    {course.rates && (
                        <StarsRate
                            rate={course.rates}
                            totalStudents={course.total_students}
                        />
                    )}
                    <br />
                    <h6>
                        Instructor:{" "}
                        <b>
                            <Link
                                className="text-primary"
                                href={`/instructors/${course?.instructor?.username}`}
                            >
                                {course?.instructor?.full_name}
                            </Link>
                        </b>
                    </h6>

                    <h6>Last updated: {course.updated_at_diff}</h6>
                </div>
            </div>
            <hr className="home-hr" />
            <div className="row">
                <div className="col-8">
                    {/* Requirements */}
                    <div className="content">
                        <h3 className="font-weight-bold">
                            <FaChalkboardTeacher /> Course Content
                        </h3>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: course.content,
                            }}
                        />
                    </div>
                    <hr className="home-hr" />
                    {/* Course Resources */}
                    <div className="resources">
                        <h3 className="font-weight-bold">
                            <BsBoxes /> Resources
                        </h3>
                        <div className="row">
                            <MediaPlayer />

                            <CourseResourcesTemplate
                                resources={course.resources}
                            />
                        </div>
                    </div>
                    <hr className="home-hr" />
                    {/* Rate and reviews */}
                    <div className="reviews">
                        <h3 className="font-weight-bold">
                            <MdOutlineReviews /> Rate & Reviews
                        </h3>
                        {rates && rates.length ? (
                            <CourseReviews
                                rates={rates}
                                courseSlug={course?.slug}
                                canRate={course?.actions?.can_rate}
                            />
                        ) : (
                            <p className="text-center text-muted">
                                There's no review on this course yet.
                            </p>
                        )}
                    </div>
                </div>
                <div className="col-4">
                    <div className="lecture-viewer">
                        <div className="preview-image">
                            <img
                                src={course.thumbnail}
                                alt="course preview"
                                width={250}
                                height={150}
                            />
                            <h5>Preview the course</h5>
                        </div>
                        <h4 className="font-weight-bold mt-2">
                            {course.currency + course.final_price}
                        </h4>
                        <div className="row m-auto">
                            <button className="w-100 btn btn-primary">
                                Add to cart
                            </button>
                            <button className="w-100 mt-2 btn btn-outline-primary">
                                Purchase Now
                            </button>
                        </div>

                        <div className="course-includes mt-3">
                            <h6 className="font-weight-bold">
                                This course includes:
                            </h6>
                            <div className="includes">
                                <p>
                                    <MdOndemandVideo /> {course.total_lectures}{" "}
                                    on-demand video
                                </p>
                                <p>
                                    <PiExam /> {course.total_exams} Assignments
                                </p>
                                <p>
                                    <BsDownload /> {course.total_files}{" "}
                                    downloadable file resources
                                </p>
                                <p>
                                    <GoDeviceDesktop /> Access on mobile and TV
                                </p>
                                <p>
                                    <PiCertificateDuotone /> Certificate after
                                    completing the course
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
