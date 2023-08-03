import Image from "next/image";
import Link from "next/link";
import React from "react";
import InstructorStarRate from "../../utilities/InstructorStarRate";

export default function InstructorProfileBoxTemplate({
    instructor,
    containerClass,
}) {
    return (
        <div className={"instructor-box " + containerClass}>
            <Link
                href={`/instructors/${instructor.username}`}
                className="no-link"
            >
                <div className="row">
                    <div className="col-3 grid-center">
                        <Image
                            src={instructor.image}
                            width={50}
                            height={50}
                            alt={instructor.name + " thumbnail"}
                        />
                    </div>
                    <div className="col-9">
                        <h6 className="mb-1 font-weight-bold">{instructor.name}</h6>
                        <p className="mt-1 mb-0 text-14">{instructor.specialty}</p>
                        <InstructorStarRate rate={instructor.rate} />
                        <div className="text-14">
                            <span className="font-weight-bold">
                                {instructor.total_courses}
                            </span>{" "}
                            Courses
                        </div>
                        <div className="text-14">
                            <span className="font-weight-bold">
                                {instructor.total_students}
                            </span>{" "}
                            Students
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}
