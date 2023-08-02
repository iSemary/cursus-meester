import Image from "next/image";
import CourseTemplate from "./components/template/CourseTemplate";
import HomeCategoryTemplate from "./components/template/HomeCategoryTemplate";

export default function Home() {
    const courses = [
        {
            name: "Course 1",
            slug: "course-1",
            rate: {
                average: 4.2,
                total: 4454852,
            },
            final_price: "500 $",
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
            final_price: "500 $",
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
            final_price: "500 $",
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
            final_price: "500 $",
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
        <div className="container home-page">
            <hr className="home-hr" />
            {/* Most watched courses */}
            <div className="courses">
                <h3>Most watched courses</h3>
                <div className="row">
                    {courses &&
                        courses.length > 0 &&
                        courses.map((course, index) => (
                            <CourseTemplate
                                course={course}
                                containerClass={"col-3"}
                            />
                        ))}
                </div>
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
                        Our partners are an integral part of our journey. <br />
                        We select partners who align with our commitment to
                        quality, integrity, and innovation.
                    </h6>
                </div>
            </div>
            <hr className="home-hr" />
            {/* Top Categories Clicked */}
            <div className="home-categories">
                <h3>Top categories clicked</h3>
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
        </div>
    );
}
