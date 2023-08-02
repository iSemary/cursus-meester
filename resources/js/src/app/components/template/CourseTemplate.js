import Image from "next/image";
import Link from "next/link";
import React from "react";
import StarsRate from "../utilities/StarsRate";

export default function CourseTemplate({ course, containerClass }) {
    return (
        <div className={"course-box " + containerClass}>
            <Link href={`course/${course.slug}`} className="no-link">
                <Image
                    src={course.image}
                    width={200}
                    height={150}
                    alt={course.name + " thumbnail"}
                />
                <h5 className="my-1">{course.name}</h5>
                <p className="text-muted my-1">{course.instructor.name}</p>
                <StarsRate rate={course.rate} />
                <h6 className="font-weight-bold">{course.final_price}</h6>
            </Link>
        </div>
    );
}
