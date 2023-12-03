import React from "react";
import { AiFillStar } from "react-icons/ai";

export default function StarsRate({ rate, totalStudents }) {
    const totalStars = 5; // Total number of stars
    const filledStars = Math.round(rate.average);

    return (
        <div className="stars-rate">
            <span className="text-muted">{rate.average}</span>
            {Array.from({ length: totalStars }, (_, index) => (
                <AiFillStar
                    key={index}
                    className={
                        "star-icon " + (index < filledStars ? "active" : "")
                    }
                />
            ))}
            {totalStudents && (
                <span className="text-muted mx-2">
                    {"(" + totalStudents + ") Students"}
                </span>
            )}
        </div>
    );
}
