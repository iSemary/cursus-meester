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
                        <img
                            src={instructor.avatar}
                            width={50}
                            height={50}
                            alt={instructor.full_name + " thumbnail"}
                        />
                    </div>
                    <div className="col-9">
                        <h6 className="mb-1 font-weight-bold">{instructor.full_name}</h6>
                        <p className="mt-1 mb-0 text-14">{instructor.industry.title}</p>
                        <InstructorStarRate overallRate={instructor.overall_rate} totalStudents={instructor.total_students} />
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
