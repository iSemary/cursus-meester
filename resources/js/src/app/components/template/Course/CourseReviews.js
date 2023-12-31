import Link from "next/link";
import React from "react";
import StarsRate from "../../utilities/StarsRate";
import { FaQuoteLeft } from "react-icons/fa6";
import LeaveReview from "./LeaveReview";
import Image from "next/image";

export default function CourseReviews({ rates, courseSlug, canRate }) {
    return (
        <div className="row">
            {/* Give a review for enrolled users only  */}
            {canRate && <LeaveReview courseSlug={courseSlug} />}
            <hr className="home-hr my-3" />
            {/* List all rates */}
            {rates &&
                rates.length > 0 &&
                rates.map((rate, index) => (
                    <div className="my-2">
                        <div className="col-12" key={index}>
                            <div className="user-info w-50">
                                <Link
                                    className="no-link"
                                    href={"/students/" + rate?.user?.username}
                                >
                                    <div className="row">
                                        <div className="col-2 px-0">
                                            <Image
                                                src={rate?.user?.base_avatar}
                                                width={50}
                                                height={50}
                                                alt={"profile"}
                                            />
                                        </div>
                                        <div className="col-10 px-0">
                                            <div>{rate?.user?.full_name}</div>
                                            <div className="row">
                                                <span className="col-5">
                                                    <StarsRate
                                                        rate={{
                                                            average: rate.rate,
                                                        }}
                                                    />
                                                </span>
                                                <span className="col-7 font-weight-bold text-muted">
                                                    {rate.created_at_diff}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                            <div className="mt-2">
                                <FaQuoteLeft
                                    className="mb-2 me-1 text-muted"
                                    size={25}
                                />
                                {rate.comment}
                            </div>
                        </div>
                        <hr className="home-hr" />
                    </div>
                ))}
        </div>
    );
}
