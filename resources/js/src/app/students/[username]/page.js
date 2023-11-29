"use client";
import React, { useEffect, useState } from "react";
import CourseTemplate from "../../components/template/CourseTemplate";
import StudentTemplate from "../../Templates/StudentTemplate";
import axiosConfig from "../../components/axiosConfig/axiosConfig";
import toastAlert from "../../components/utilities/Alert";
import SocialLinks from "../../components/SocialLinks/SocialLinks";
import { ProfileLoader } from "../../components/loaders/ProfileLoader";

export default function StudentProfile({ params }) {
    const username = params.username;
    const [student, setStudent] = useState(null);

    useEffect(() => {
        if (username) {
            // Get user details
            axiosConfig
                .get(`student/${username}`)
                .then((response) => {
                    setStudent(response.data.data.student);
                })
                .catch((response) => {
                    toastAlert(response.data.message, "error");
                });
        }
    }, [username]);

    return (
        <StudentTemplate>
            {student ? (
                <div className="container student-page">
                    <div className="row pt-4 justify-content-space-between">
                        {/* Student Information */}
                        <div className="col-md-6">
                            <div className="student-details">
                                <div className="row">
                                    <div className="col-4 text-center">
                                        <img
                                            className="student-profile-image"
                                            width={150}
                                            src={student?.info?.avatar}
                                            height={150}
                                        />
                                    </div>
                                    <div className="col-8 text-left pt-5">
                                        <h3 className="color-primary font-weight-bold">
                                            {student?.info?.full_name}
                                        </h3>
                                        <p>{student?.info?.position}</p>
                                    </div>
                                </div>
                                <hr className="home-hr" />
                                {student?.info?.bio && (
                                    <>
                                        <h5 className="font-weight-bold">
                                            Summary
                                        </h5>
                                        <p className="text-muted">
                                            {student?.info?.bio}
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                        {/* Social Links */}
                        <div className="col-md-6 social-links-container">
                            <SocialLinks links={student?.social_links} />
                        </div>
                    </div>
                    <hr className="home-hr" />
                    {/* Student Courses */}
                    <div className="student-courses">
                        <h5 className="font-weight-bold">Enrolled Courses</h5>
                        <div className="row justify-content-around">
                            {student?.courses && student.courses.length > 0
                                ? student.courses.map((course, index) => (
                                      <CourseTemplate
                                          course={course}
                                          studentName={student?.info?.full_name}
                                          containerClass={"col-3"}
                                      />
                                  ))
                                : "There's no enrolled courses yet."}
                        </div>
                    </div>
                </div>
            ) : (
                <ProfileLoader className="mt-7" />
            )}
        </StudentTemplate>
    );
}
