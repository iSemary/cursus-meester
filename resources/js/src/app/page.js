"use client";
import Image from "next/image";
import HomeCategoryTemplate from "./components/template/HomeCategoryTemplate";
import { BsStars } from "react-icons/bs";
import { TbCategory2 } from "react-icons/tb";
import CoursesTemplate from "./components/template/CoursesTemplate";
import JoinInstructorsImage from "/public/assets/images/landing/instructor-1.jpg";
import Link from "next/link";
import StudentTemplate from "./Templates/StudentTemplate";
import { useAuth } from "./components/hooks/AuthProvider";
import { useEffect } from "react";

export default function Home() {
    const { user } = useAuth();
    useEffect(() => {
        if (user) {
            console.log(user);
        }
    }, [user]);

    const courses = [
        {
            name: "Course 1",
            slug: "course-1",
            rate: {
                average: 4.2,
                total: 4454852,
            },
            final_price: "$500",
            original_price: "$500",
            image: "https://placehold.co/600x450.png",
            instructor: {
                name: "Ahmed",
            },
        },
        {
            name: "Course 1",
            slug: "course-1",
            rate: {
                average: 4.2,
                total: 4454852,
            },
            final_price: "$500",
            original_price: "$500",
            image: "https://placehold.co/600x450.png",
            instructor: {
                name: "Ahmed",
            },
        },
        {
            name: "Course 1",
            slug: "course-1",
            rate: {
                average: 4.2,
                total: 4454852,
            },
            final_price: "$500",
            original_price: "$500",
            image: "https://placehold.co/600x450.png",
            instructor: {
                name: "Ahmed",
            },
        },
        {
            name: "Course 1",
            slug: "course-1",
            rate: {
                average: 4.2,
                total: 4454852,
            },
            final_price: "$500",
            original_price: "$700",
            image: "https://placehold.co/600x450.png",
            instructor: {
                name: "Ahmed",
            },
        },
    ];
    const categories = [
        {
            name: "Front End Development",
            slug: "front-end-development",
            image: "https://cdn.icon-icons.com/icons2/1857/PNG/512/vector_117831.png",
        },
        {
            name: "Front End Development",
            slug: "front-end-development",
            image: "https://cdn.icon-icons.com/icons2/1857/PNG/512/vector_117831.png",
        },
        {
            name: "Front End Development",
            slug: "front-end-development",
            image: "https://cdn.icon-icons.com/icons2/1857/PNG/512/vector_117831.png",
        },
        {
            name: "Front End Development",
            slug: "front-end-development",
            image: "https://cdn.icon-icons.com/icons2/1857/PNG/512/vector_117831.png",
        },
        {
            name: "Front End Development",
            slug: "front-end-development",
            image: "https://cdn.icon-icons.com/icons2/1857/PNG/512/vector_117831.png",
        },
        {
            name: "Front End Development",
            slug: "front-end-development",
            image: "https://cdn.icon-icons.com/icons2/1857/PNG/512/vector_117831.png",
        },
        {
            name: "Front End Development",
            slug: "front-end-development",
            image: "https://cdn.icon-icons.com/icons2/1857/PNG/512/vector_117831.png",
        },
    ];
    return (
        <StudentTemplate>
            <div className="container home-page">
                <hr className="home-hr" />
                {/* Most watched courses */}
                <div className="courses">
                    <h3>
                        <BsStars /> Most watched courses
                    </h3>
                    <CoursesTemplate courses={courses} childClass={"col-3"} />
                </div>
                <hr className="home-hr" />
                {/* Our Partners */}
                <div className="partners">
                    <div className="partners-container">
                        <div className="row my-3">
                            <div className="col-1 partner-image">
                                <Image
                                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/2560px-Samsung_Logo.svg.png"
                                    className="grayscale-image"
                                    width={100}
                                    height="50"
                                />
                            </div>
                            <div className="col-1 partner-image">
                                <Image
                                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/2560px-Samsung_Logo.svg.png"
                                    className="grayscale-image"
                                    width={100}
                                    height="50"
                                />
                            </div>
                            <div className="col-1 partner-image">
                                <Image
                                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/2560px-Samsung_Logo.svg.png"
                                    className="grayscale-image"
                                    width={100}
                                    height="50"
                                />
                            </div>
                            <div className="col-1 partner-image">
                                <Image
                                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/2560px-Samsung_Logo.svg.png"
                                    className="grayscale-image"
                                    width={100}
                                    height="50"
                                />
                            </div>
                            <div className="col-1 partner-image">
                                <Image
                                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/2560px-Samsung_Logo.svg.png"
                                    className="grayscale-image"
                                    width={100}
                                    height="50"
                                />
                            </div>
                            <div className="col-1 partner-image">
                                <Image
                                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/2560px-Samsung_Logo.svg.png"
                                    className="grayscale-image"
                                    width={100}
                                    height="50"
                                />
                            </div>
                        </div>
                        <h6 className="text-center text-muted font-weight-bold">
                            Our partners are an integral part of our journey.{" "}
                            <br />
                            We select partners who align with our commitment to
                            quality, integrity, and innovation.
                        </h6>
                    </div>
                </div>
                <hr className="home-hr" />
                {/* Top Categories Clicked */}
                <div className="home-categories">
                    <h3>
                        <TbCategory2 /> Top categories clicked
                    </h3>
                    <div className="row">
                        {categories &&
                            categories.length > 0 &&
                            categories.map((category, index) => (
                                <HomeCategoryTemplate
                                    category={category}
                                    containerClass={"col-4"}
                                />
                            ))}
                    </div>
                </div>
                <hr className="home-hr" />

                <div className="join-instructors">
                    <div className="w-75 m-auto">
                        <div className="row">
                            <div className="col-6">
                                <Image
                                    src={JoinInstructorsImage}
                                    width={420}
                                    height={250}
                                    alt="logo"
                                />
                            </div>
                            <div className="col-6">
                                <div className="mt-4">
                                    <h3 className="font-weight-bold">
                                        Become a teacher
                                    </h3>
                                    <p>
                                        Educators spanning the globe are
                                        imparting knowledge to countless
                                        learners on Udemy. We equip you with the
                                        necessary resources and expertise to
                                        share your passion.
                                    </p>
                                    <Link
                                        href="/register/instructor"
                                        className="join-btn"
                                    >
                                        Join now
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </StudentTemplate>
    );
}
