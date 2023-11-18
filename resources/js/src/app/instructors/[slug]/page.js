import Image from "next/image";
import React from "react";
import CourseTemplate from "../../components/template/CourseTemplate";
import StudentTemplate from "../../Templates/StudentTemplate";

export default function Instructor({ params }) {
    const courses = [
        {
            title: "Course 1",
            currency: "$",
            slug: "course-1",
            rates: {
                average: 4.2,
                total: 4454852,
            },
            final_price: "$500",
            original_price: "$500",
            thumbnail: "https://placehold.co/600x450.png",
            instructor: {
                full_name: "Course 1",
            },
        },
        {
            title: "Course 1",
            currency: "$",
            slug: "course-1",
            rates: {
                average: 4.2,
                total: 4454852,
            },
            final_price: "$500",
            original_price: "$500",
            thumbnail: "https://placehold.co/600x450.png",
            instructor: {
                full_name: "Course 1",
            },
        },
        {
            title: "Course 1",
            currency: "$",
            slug: "course-1",
            rates: {
                average: 4.2,
                total: 4454852,
            },
            final_price: "$500",
            original_price: "$500",
            thumbnail: "https://placehold.co/600x450.png",
            instructor: {
                full_name: "Course 1",
            },
        },
        {
            title: "Course 1",
            currency: "$",
            slug: "course-1",
            rates: {
                average: 4.2,
                total: 4454852,
            },
            final_price: "$500",
            original_price: "$500",
            thumbnail: "https://placehold.co/600x450.png",
            instructor: {
                full_name: "Course 1",
            },
        },
        {
            title: "Course 1",
            currency: "$",
            slug: "course-1",
            rates: {
                average: 4.2,
                total: 4454852,
            },
            final_price: "$500",
            original_price: "$500",
            thumbnail: "https://placehold.co/600x450.png",
            instructor: {
                full_name: "Course 1",
            },
        },
        {
            title: "Course 1",
            currency: "$",
            slug: "course-1",
            rates: {
                average: 4.2,
                total: 4454852,
            },
            final_price: "$500",
            original_price: "$500",
            thumbnail: "https://placehold.co/600x450.png",
            instructor: {
                full_name: "Course 1",
            },
        },
        {
            title: "Course 1",
            currency: "$",
            slug: "course-1",
            rates: {
                average: 4.2,
                total: 4454852,
            },
            final_price: "$500",
            original_price: "$500",
            thumbnail: "https://placehold.co/600x450.png",
            instructor: {
                full_name: "Course 1",
            },
        },
        {
            title: "Course 1",
            currency: "$",
            slug: "course-1",
            rates: {
                average: 4.2,
                total: 4454852,
            },
            final_price: "$500",
            original_price: "$700",
            thumbnail: "https://placehold.co/600x450.png",
            instructor: {
                full_name: "Course 1",
            },
        },
    ];
    const instructor = {
        name: "Ahmed Ali",
        specialty: "Software Engineer",
        total_courses: 50,
        total_students: "500,568",
        thumbnail: "https://placehold.co/600x450/png",
        rates: {
            total: 50,
            average: 1.2,
        },
        summary: `I'm Angela, I'm a developer with a passion for
        teaching. I'm the lead instructor at the London App
        Brewery, London's leading Programming Bootcamp. I've
        helped hundreds of thousands of students learn to
        code and change their lives by becoming a developer.
        I've been invited by companies such as Twitter,
        Facebook and Google to teach their employees. My
        first foray into programming was when I was just 12
        years old, wanting to build my own Space Invader
        game. Since then, I've made hundred of websites,
        apps and games. But most importantly, I realised
        that my greatest passion is teaching. I spend most
        of my time researching how to make learning to code
        fun and make hard concepts easy to understand. I
        apply everything I discover into my bootcamp
        courses. In my courses, you'll find lots of geeky
        humour but also lots of explanations and animations
        to make sure everything is easy to understand. I'll
        be there for you every step of the way.`,
        courses: courses,
    };
    return (
        <StudentTemplate>
            <div className="container instructor-page">
                <div className="row pt-4 justify-content-space-between">
                    <div className="col-md-6">
                        <div className="instructor-details">
                            <div className="row">
                                <div className="col-6 text-center">
                                    <Image
                                        className="instructor-profile-image"
                                        width={150}
                                        src={instructor.image}
                                        height={150}
                                    />
                                </div>
                                <div className="col-6 text-left pt-5">
                                    <h3 className="color-primary font-weight-bold">
                                        {instructor.name}
                                    </h3>
                                    <p>{instructor.specialty}</p>
                                </div>
                            </div>
                            <hr className="home-hr" />
                            <div className="row">
                                <div className="col-4">
                                    <h6 className="font-weight-bold text-center color-primary">
                                        Total Courses{" "}
                                        <div className="text-muted">
                                            {instructor.total_courses}
                                        </div>
                                    </h6>
                                </div>
                                <div className="col-4">
                                    <h6 className="font-weight-bold text-center color-primary">
                                        Total Students{" "}
                                        <div className="text-muted">
                                            {instructor.total_students}
                                        </div>
                                    </h6>
                                </div>
                                <div className="col-4">
                                    <h6 className="font-weight-bold text-center color-primary">
                                        Rate{" "}
                                        <div className="text-muted">{5}</div>
                                    </h6>
                                </div>
                            </div>

                            <hr className="home-hr" />

                            <h5 className="font-weight-bold">Summary</h5>
                            <p className="text-muted">{instructor.summary}</p>
                        </div>
                    </div>

                    <div className="col-md-6"></div>
                </div>
                <hr className="home-hr" />
                <div className="instructor-courses">
                    <h5 className="font-weight-bold">Courses</h5>
                    <div className="row">
                        {instructor.courses &&
                            instructor.courses.length > 0 &&
                            instructor.courses.map((course, index) => (
                                <CourseTemplate
                                    course={course}
                                    containerClass={"col-3"}
                                />
                            ))}
                    </div>
                </div>
            </div>
        </StudentTemplate>
    );
}
