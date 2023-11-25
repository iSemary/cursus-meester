"use client";
import React, { useEffect, useState } from "react";
import CourseTemplate from "../../components/template/CourseTemplate";
import StudentTemplate from "../../Templates/StudentTemplate";
import axiosConfig from "../../components/axiosConfig/axiosConfig";
import toastAlert from "../../components/utilities/Alert";
import SocialLinks from "../../components/SocialLinks/SocialLinks";
import { ProfileLoader } from "../../components/loaders/ProfileLoader";

export default function InstructorProfile({ params }) {
    const username = params.username;
    const [instructor, setInstructor] = useState(null);

    useEffect(() => {
        if (username) {
            // Get user details
            axiosConfig
                .get(`instructor/${username}`)
                .then((response) => {
                    setInstructor(response.data.data.instructor);
                })
                .catch((response) => {
                    toastAlert(response.data.message, "error");
                });
        }
    }, [username]);

    return (
        <StudentTemplate>
            {instructor ? (
                <div className="container instructor-page">
                    <div className="row pt-4 justify-content-space-between">
                        {/* Instructor Information */}
                        <div className="col-md-6">
                            <div className="instructor-details">
                                <div className="row">
                                    <div className="col-4 text-center">
                                        <img
                                            className="instructor-profile-image"
                                            width={150}
                                            src={instructor?.info?.avatar}
                                            height={150}
                                        />
                                    </div>
                                    <div className="col-8 text-left pt-5">
                                        <h3 className="color-primary font-weight-bold">
                                            {instructor?.info?.full_name}
                                        </h3>
                                        <p>{instructor?.info?.position}</p>
                                    </div>
                                </div>
                                <hr className="home-hr" />
                                <div className="row">
                                    <div className="col-4">
                                        <h6 className="font-weight-bold text-center color-primary">
                                            Total Courses{" "}
                                            <div className="text-muted">
                                                {
                                                    instructor?.info
                                                        ?.total_courses
                                                }
                                            </div>
                                        </h6>
                                    </div>
                                    <div className="col-4">
                                        <h6 className="font-weight-bold text-center color-primary">
                                            Total Students{" "}
                                            <div className="text-muted">
                                                {
                                                    instructor?.info
                                                        ?.total_students
                                                }
                                            </div>
                                        </h6>
                                    </div>
                                    <div className="col-4">
                                        <h6 className="font-weight-bold text-center color-primary">
                                            Rate{" "}
                                            <div className="text-muted">
                                                {instructor?.info?.overall_rate}
                                            </div>
                                        </h6>
                                    </div>
                                </div>

                                <hr className="home-hr" />

                                <h5 className="font-weight-bold">Summary</h5>
                                <p className="text-muted">
                                    {instructor?.info?.bio}
                                </p>
                            </div>
                        </div>
                        {/* Social Links */}
                        <div className="col-md-6 social-links-container">
                            <SocialLinks links={instructor?.social_links} />
                        </div>
                    </div>
                    <hr className="home-hr" />
                    {/* Instructor Courses */}
                    <div className="instructor-courses">
                        <h5 className="font-weight-bold">
                            Courses Expertly Taught
                        </h5>
                        <div className="row justify-content-around">
                            {instructor?.courses &&
                                instructor.courses.length > 0 &&
                                instructor.courses.map((course, index) => (
                                    <CourseTemplate
                                        course={course}
                                        instructorName={
                                            instructor?.info?.full_name
                                        }
                                        containerClass={"col-3"}
                                    />
                                ))}
                        </div>
                    </div>
                </div>
            ) : (
                <ProfileLoader className="mt-7" />
            )}
        </StudentTemplate>
    );
}
