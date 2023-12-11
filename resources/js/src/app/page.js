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
import { useEffect, useState } from "react";
import axiosConfig from "./components/axiosConfig/axiosConfig";
import { PiChalkboardTeacherFill } from "react-icons/pi";
import InstructorProfileBoxTemplate from "./components/template/instructor/InstructorProfileBoxTemplate";
import CoursesCarousel from "./components/home/CoursesCarousel";

export default function Home() {
    const { user } = useAuth();

    const [categories, setCategories] = useState([]);
    const [mostRecentCourses, setMostRecentCourses] = useState([]);
    const [topRatedCourses, setTopRatedCourses] = useState([]);
    const [randomPopularCategoryCourses, setRandomPopularCategoryCourses] =
        useState({});
    const [shortCourses, setShortCourses] = useState([]);
    const [topInstructors, setTopInstructors] = useState([]);
    const [topOrganizations, setTopOrganizations] = useState([]);
    const [topSoftSkillsCourses, setTopSoftSkillsCourses] = useState([]);

    useEffect(() => {
        axiosConfig
            .get("/")
            .then((response) => {
                setMostRecentCourses(
                    response.data.data.response.most_recent_courses
                );
                setTopRatedCourses(
                    response.data.data.response.top_rated_courses
                );
                setRandomPopularCategoryCourses(
                    response.data.data.response.random_popular_category_courses
                );
                setShortCourses(response.data.data.response.short_courses);
                setTopInstructors(response.data.data.response.top_instructors);
                setTopOrganizations(
                    response.data.data.response.top_organizations
                );
                setTopSoftSkillsCourses(
                    response.data.data.response.top_soft_skills_courses
                );
            })
            .catch((error) => {
                console.log(error);
            });

        axiosConfig.get("categories?parents=1").then((response) => {
            setCategories(response.data.data.categories.data);
        });
    }, []);

    return (
        <StudentTemplate>
            <div className="home-page">
                {/* Most recent courses */}
                <div className="courses">
                    <h3>
                        <BsStars /> Most Recent Courses
                    </h3>
                    <CoursesCarousel courses={mostRecentCourses} />
                </div>
                {/* Top Instructors */}
                {topInstructors ? (
                    topInstructors.length > 0 && (
                        <>
                            <hr className="home-hr" />
                            <div className="instructors">
                                <h4 className="font-weight-bold">
                                    <PiChalkboardTeacherFill /> Our top
                                    instructors
                                </h4>
                                <div className="row m-auto">
                                    {topInstructors &&
                                        topInstructors.length > 0 &&
                                        topInstructors.map(
                                            (instructor, index) => (
                                                <InstructorProfileBoxTemplate
                                                    instructor={instructor}
                                                    containerClass={
                                                        "col-3 me-2"
                                                    }
                                                />
                                            )
                                        )}
                                </div>
                            </div>
                        </>
                    )
                ) : (
                    <CourseListLoader classes="my-2" />
                )}
                <hr className="home-hr" />
                {/* Top Soft Skills courses */}
                <div className="courses">
                    <h3>
                        <BsStars /> Top Soft Skills Courses
                    </h3>
                    <CoursesCarousel courses={topSoftSkillsCourses?.courses} />
                </div>
                <hr className="home-hr" />
                {/* Short and sweet courses */}
                <div className="courses">
                    <h3>
                        <BsStars /> Short & Sweet Courses
                    </h3>
                    <CoursesCarousel courses={shortCourses} />
                </div>
                <hr className="home-hr" />
                {/* Our Partners */}
                <div className="partners">
                    <div className="partners-container">
                        <div className="row my-3">
                            {topOrganizations &&
                                topOrganizations.length > 0 &&
                                topOrganizations.map((organization, index) => (
                                    <div className="col-1 partner-image">
                                        <Link
                                            href={
                                                "/organizations/" +
                                                organization.slug
                                            }
                                        >
                                            <img
                                                src={organization.logo}
                                                className="grayscale-image"
                                                width={100}
                                                title={organization.name}
                                                alt={organization.name}
                                                height={100}
                                            />
                                        </Link>
                                    </div>
                                ))}
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
                {/* Top Rated courses */}
                <div className="courses">
                    <h3>
                        <BsStars /> Top Rated Courses
                    </h3>
                    <CoursesCarousel courses={topRatedCourses} />
                </div>
                <hr className="home-hr" />
                {/* Top Rated courses */}
                <div className="courses">
                    <h3>
                        <BsStars /> Top {randomPopularCategoryCourses?.title}{" "}
                        Courses
                    </h3>
                    <CoursesCarousel
                        courses={randomPopularCategoryCourses?.courses}
                    />
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
                                    containerClass={"col-3"}
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
                                <div className="m-4">
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
                                        href={
                                            user
                                                ? "/join/instructor"
                                                : "/register/instructor"
                                        }
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
